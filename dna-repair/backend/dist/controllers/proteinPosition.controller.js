"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPathwayPositions = exports.updateProteinPosition = exports.saveProteinPositions = exports.getProteinPositions = exports.deleteProteinPosition = exports.updateMultiplePositions = exports.saveProteinPosition = exports.getProteinPosition = exports.getPositionsByPathway = void 0;
const ProteinPosition_1 = require("../models/ProteinPosition");
// Get all positions for a specific pathway
const getPositionsByPathway = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        const positions = yield ProteinPosition_1.ProteinPosition.find({ pathway }).populate('proteinId');
        res.json(positions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching positions by pathway', error });
    }
});
exports.getPositionsByPathway = getPositionsByPathway;
// Get position for a specific protein in a pathway
const getProteinPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proteinId, pathway } = req.params;
        const position = yield ProteinPosition_1.ProteinPosition.findOne({ proteinId, pathway }).populate('proteinId');
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json(position);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching protein position', error });
    }
});
exports.getProteinPosition = getProteinPosition;
// Create or update position for a protein in a pathway
const saveProteinPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proteinId, pathway } = req.params;
        const { x, y } = req.body;
        // Use upsert to create or update
        const position = yield ProteinPosition_1.ProteinPosition.findOneAndUpdate({ proteinId, pathway }, { position: { x, y } }, {
            new: true,
            upsert: true,
            runValidators: true
        }).populate('proteinId');
        res.json(position);
    }
    catch (error) {
        res.status(400).json({ message: 'Error saving protein position', error });
    }
});
exports.saveProteinPosition = saveProteinPosition;
// Update multiple positions for a pathway
const updateMultiplePositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        const { positions } = req.body; // Array of { proteinId, x, y }
        const operations = positions.map((pos) => ({
            updateOne: {
                filter: { proteinId: pos.proteinId, pathway },
                update: { position: { x: pos.x, y: pos.y } },
                upsert: true,
            },
        }));
        yield ProteinPosition_1.ProteinPosition.bulkWrite(operations);
        // Return updated positions
        const updatedPositions = yield ProteinPosition_1.ProteinPosition.find({ pathway }).populate('proteinId');
        res.json(updatedPositions);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating multiple positions', error });
    }
});
exports.updateMultiplePositions = updateMultiplePositions;
// Delete position for a protein in a pathway
const deleteProteinPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proteinId, pathway } = req.params;
        const position = yield ProteinPosition_1.ProteinPosition.findOneAndDelete({ proteinId, pathway });
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.json({ message: 'Position deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting protein position', error });
    }
});
exports.deleteProteinPosition = deleteProteinPosition;
// Get all protein positions for a pathway
const getProteinPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
            return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
        }
        const positions = yield ProteinPosition_1.ProteinPosition.find({ pathway });
        // Convert to a map for easy lookup
        const positionMap = positions.reduce((acc, pos) => {
            acc[pos.proteinId] = pos.position;
            return acc;
        }, {});
        res.json(positionMap);
    }
    catch (error) {
        console.error('Error fetching protein positions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProteinPositions = getProteinPositions;
// Save multiple protein positions for a pathway
const saveProteinPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        const { positions } = req.body;
        if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
            return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
        }
        if (!positions || typeof positions !== 'object') {
            return res.status(400).json({ message: 'Invalid positions data' });
        }
        // Use bulkWrite for efficient batch operations
        const operations = Object.entries(positions).map(([proteinId, position]) => ({
            updateOne: {
                filter: { proteinId, pathway },
                update: {
                    $set: {
                        proteinId,
                        pathway,
                        position: position
                    }
                },
                upsert: true
            }
        }));
        if (operations.length > 0) {
            yield ProteinPosition_1.ProteinPosition.bulkWrite(operations);
        }
        res.json({ message: 'Positions saved successfully' });
    }
    catch (error) {
        console.error('Error saving protein positions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.saveProteinPositions = saveProteinPositions;
// Update a single protein position
const updateProteinPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway, proteinId } = req.params;
        const { position } = req.body;
        if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
            return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
        }
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            return res.status(400).json({ message: 'Invalid position data' });
        }
        const updatedPosition = yield ProteinPosition_1.ProteinPosition.findOneAndUpdate({ proteinId, pathway }, { position }, { upsert: true, new: true });
        res.json(updatedPosition);
    }
    catch (error) {
        console.error('Error updating protein position:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateProteinPosition = updateProteinPosition;
// Reset all positions for a pathway to default
const resetPathwayPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
            return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
        }
        yield ProteinPosition_1.ProteinPosition.deleteMany({ pathway });
        res.json({ message: 'Positions reset successfully' });
    }
    catch (error) {
        console.error('Error resetting positions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resetPathwayPositions = resetPathwayPositions;

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
exports.deleteProtein = exports.updateProtein = exports.createProtein = exports.getProteinById = exports.getProteinsByPathway = exports.getAllProteins = void 0;
const Protein_1 = require("../models/Protein");
// Get all proteins
const getAllProteins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proteins = yield Protein_1.Protein.find();
        res.json(proteins);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching proteins', error });
    }
});
exports.getAllProteins = getAllProteins;
// Get proteins by pathway
const getProteinsByPathway = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pathway } = req.params;
        const proteins = yield Protein_1.Protein.find({ pathway });
        res.json(proteins);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching proteins by pathway', error });
    }
});
exports.getProteinsByPathway = getProteinsByPathway;
// Get a single protein by ID
const getProteinById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const protein = yield Protein_1.Protein.findById(id);
        if (!protein) {
            return res.status(404).json({ message: 'Protein not found' });
        }
        res.json(protein);
    }
    catch (error) {
        // Handle potential errors, e.g., invalid ID format
        res.status(500).json({ message: 'Error fetching protein', error });
    }
});
exports.getProteinById = getProteinById;
// Create a new protein
const createProtein = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const protein = new Protein_1.Protein(req.body);
        yield protein.save();
        res.status(201).json(protein);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating protein', error });
    }
});
exports.createProtein = createProtein;
// Update a protein
const updateProtein = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const protein = yield Protein_1.Protein.findByIdAndUpdate(id, req.body, { new: true });
        if (!protein) {
            return res.status(404).json({ message: 'Protein not found' });
        }
        res.json(protein);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating protein', error });
    }
});
exports.updateProtein = updateProtein;
// Delete a protein
const deleteProtein = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const protein = yield Protein_1.Protein.findByIdAndDelete(id);
        if (!protein) {
            return res.status(404).json({ message: 'Protein not found' });
        }
        res.json({ message: 'Protein deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting protein', error });
    }
});
exports.deleteProtein = deleteProtein;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proteinPosition_controller_1 = require("../controllers/proteinPosition.controller");
const router = express_1.default.Router();
// Get all protein positions for a pathway
router.get('/:pathway', proteinPosition_controller_1.getProteinPositions);
// Save multiple protein positions for a pathway
router.post('/:pathway', proteinPosition_controller_1.saveProteinPositions);
// Update a single protein position
router.put('/:pathway/:proteinId', proteinPosition_controller_1.updateProteinPosition);
// Reset all positions for a pathway
router.delete('/:pathway/reset', proteinPosition_controller_1.resetPathwayPositions);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proteinRoutes = void 0;
const express_1 = __importDefault(require("express"));
const protein_controller_1 = require("../controllers/protein.controller");
const router = express_1.default.Router();
// Get all proteins
router.get('/', protein_controller_1.getAllProteins);
// Get proteins by pathway
router.get('/pathway/:pathway', protein_controller_1.getProteinsByPathway);
// Get a single protein by ID
router.get('/:id', protein_controller_1.getProteinById);
// Create a new protein
router.post('/', protein_controller_1.createProtein);
// Update a protein
router.put('/:id', protein_controller_1.updateProtein);
// Delete a protein
router.delete('/:id', protein_controller_1.deleteProtein);
exports.proteinRoutes = router;

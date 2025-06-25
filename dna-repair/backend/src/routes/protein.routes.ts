import express from 'express';
import {
  getAllProteins,
  getProteinsByPathway,
  createProtein,
  updateProtein,
  deleteProtein,
  getProteinById
} from '../controllers/protein.controller';

const router = express.Router();

// Get all proteins
router.get('/', getAllProteins);

// Get proteins by pathway
router.get('/pathway/:pathway', getProteinsByPathway);

// Create a new protein
router.post('/', createProtein);

// Get a single protein by ID
router.get('/:id', getProteinById);

// Update a protein
router.put('/:id', updateProtein);

// Delete a protein
router.delete('/:id', deleteProtein);

export const proteinRoutes = router; 
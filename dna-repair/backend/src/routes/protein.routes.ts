import express from 'express';
import {
  getAllProteins,
  getProteinsByPathway,
  createProtein,
  updateProtein,
  deleteProtein,
  getProteinById
} from '../controllers/protein.controller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all proteins (public access)
router.get('/', getAllProteins);

// Get proteins by pathway (public access)
router.get('/pathway/:pathway', getProteinsByPathway);

// Get a single protein by ID (public access)
router.get('/:id', getProteinById);

// Create a new protein (admin only)
router.post('/', auth, requireAdmin, createProtein);

// Update a protein (admin only)
router.put('/:id', auth, requireAdmin, updateProtein);

// Delete a protein (admin only)
router.delete('/:id', auth, requireAdmin, deleteProtein);

export const proteinRoutes = router; 
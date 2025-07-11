import express from 'express';
import { 
  getProteinPositions, 
  saveProteinPositions, 
  updateProteinPosition,
  resetPathwayPositions
} from '../controllers/proteinPosition.controller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all protein positions for a pathway (public access)
router.get('/:pathway', getProteinPositions);

// Save multiple protein positions for a pathway (admin only)
router.post('/:pathway', auth, requireAdmin, saveProteinPositions);

// Update a single protein position (admin only)
router.put('/:pathway/:proteinId', auth, requireAdmin, updateProteinPosition);

// Reset all positions for a pathway (admin only)
router.delete('/:pathway/reset', auth, requireAdmin, resetPathwayPositions);

export default router; 
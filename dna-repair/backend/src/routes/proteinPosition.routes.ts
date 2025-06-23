import express from 'express';
import { 
  getProteinPositions, 
  saveProteinPositions, 
  updateProteinPosition,
  resetPathwayPositions
} from '../controllers/proteinPosition.controller';

const router = express.Router();

// Get all protein positions for a pathway
router.get('/:pathway', getProteinPositions);

// Save multiple protein positions for a pathway
router.post('/:pathway', saveProteinPositions);

// Update a single protein position
router.put('/:pathway/:proteinId', updateProteinPosition);

// Reset all positions for a pathway
router.delete('/:pathway/reset', resetPathwayPositions);

export default router; 
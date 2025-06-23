import { Request, Response } from 'express';
import { ProteinPosition } from '../models/ProteinPosition';

// Get all positions for a specific pathway
export const getPositionsByPathway = async (req: Request, res: Response) => {
  try {
    const { pathway } = req.params;
    const positions = await ProteinPosition.find({ pathway }).populate('proteinId');
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions by pathway', error });
  }
};

// Get position for a specific protein in a pathway
export const getProteinPosition = async (req: Request, res: Response) => {
  try {
    const { proteinId, pathway } = req.params;
    const position = await ProteinPosition.findOne({ proteinId, pathway }).populate('proteinId');
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching protein position', error });
  }
};

// Create or update position for a protein in a pathway
export const saveProteinPosition = async (req: Request, res: Response) => {
  try {
    const { proteinId, pathway } = req.params;
    const { x, y } = req.body;

    // Use upsert to create or update
    const position = await ProteinPosition.findOneAndUpdate(
      { proteinId, pathway },
      { position: { x, y } },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    ).populate('proteinId');

    res.json(position);
  } catch (error) {
    res.status(400).json({ message: 'Error saving protein position', error });
  }
};

// Update multiple positions for a pathway
export const updateMultiplePositions = async (req: Request, res: Response) => {
  try {
    const { pathway } = req.params;
    const { positions } = req.body; // Array of { proteinId, x, y }

    const operations = positions.map((pos: any) => ({
      updateOne: {
        filter: { proteinId: pos.proteinId, pathway },
        update: { position: { x: pos.x, y: pos.y } },
        upsert: true,
      },
    }));

    await ProteinPosition.bulkWrite(operations);
    
    // Return updated positions
    const updatedPositions = await ProteinPosition.find({ pathway }).populate('proteinId');
    res.json(updatedPositions);
  } catch (error) {
    res.status(400).json({ message: 'Error updating multiple positions', error });
  }
};

// Delete position for a protein in a pathway
export const deleteProteinPosition = async (req: Request, res: Response) => {
  try {
    const { proteinId, pathway } = req.params;
    const position = await ProteinPosition.findOneAndDelete({ proteinId, pathway });
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting protein position', error });
  }
};

// Get all protein positions for a pathway
export const getProteinPositions = async (req: Request, res: Response) => {
  try {
    const { pathway } = req.params;
    
    if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
      return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
    }

    const positions = await ProteinPosition.find({ pathway });
    
    // Convert to a map for easy lookup
    const positionMap = positions.reduce((acc, pos) => {
      acc[pos.proteinId] = pos.position;
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    res.json(positionMap);
  } catch (error) {
    console.error('Error fetching protein positions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Save multiple protein positions for a pathway
export const saveProteinPositions = async (req: Request, res: Response) => {
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
            position: position as { x: number; y: number } 
          } 
        },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await ProteinPosition.bulkWrite(operations);
    }

    res.json({ message: 'Positions saved successfully' });
  } catch (error) {
    console.error('Error saving protein positions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a single protein position
export const updateProteinPosition = async (req: Request, res: Response) => {
  try {
    const { pathway, proteinId } = req.params;
    const { position } = req.body;

    if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
      return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
    }

    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
      return res.status(400).json({ message: 'Invalid position data' });
    }

    const updatedPosition = await ProteinPosition.findOneAndUpdate(
      { proteinId, pathway },
      { position },
      { upsert: true, new: true }
    );

    res.json(updatedPosition);
  } catch (error) {
    console.error('Error updating protein position:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset all positions for a pathway to default
export const resetPathwayPositions = async (req: Request, res: Response) => {
  try {
    const { pathway } = req.params;
    
    if (!pathway || !['HR', 'NHEJ'].includes(pathway)) {
      return res.status(400).json({ message: 'Invalid pathway. Must be HR or NHEJ.' });
    }
    
    await ProteinPosition.deleteMany({ pathway });
    res.json({ message: 'Positions reset successfully' });
  } catch (error) {
    console.error('Error resetting positions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
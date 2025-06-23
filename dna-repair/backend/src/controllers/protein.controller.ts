import { Request, Response } from 'express';
import { Protein } from '../models/Protein';

// Get all proteins
export const getAllProteins = async (req: Request, res: Response) => {
  try {
    const proteins = await Protein.find();
    res.json(proteins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proteins', error });
  }
};

// Get proteins by pathway
export const getProteinsByPathway = async (req: Request, res: Response) => {
  try {
    const { pathway } = req.params;
    // Find proteins where pathways array includes the pathway
    const proteins = await Protein.find({ pathways: pathway });
    res.json(proteins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proteins by pathway', error });
  }
};

// Get a single protein by ID
export const getProteinById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const protein = await Protein.findById(id);
    if (!protein) {
      return res.status(404).json({ message: 'Protein not found' });
    }
    res.json(protein);
  } catch (error) {
    // Handle potential errors, e.g., invalid ID format
    res.status(500).json({ message: 'Error fetching protein', error });
  }
};

// Create a new protein
export const createProtein = async (req: Request, res: Response) => {
  try {
    const protein = new Protein(req.body);
    await protein.save();
    res.status(201).json(protein);
  } catch (error) {
    res.status(400).json({ message: 'Error creating protein', error });
  }
};

// Update a protein
export const updateProtein = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const protein = await Protein.findByIdAndUpdate(id, req.body, { new: true });
    if (!protein) {
      return res.status(404).json({ message: 'Protein not found' });
    }
    res.json(protein);
  } catch (error) {
    res.status(400).json({ message: 'Error updating protein', error });
  }
};

// Delete a protein
export const deleteProtein = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const protein = await Protein.findByIdAndDelete(id);
    if (!protein) {
      return res.status(404).json({ message: 'Protein not found' });
    }
    res.json({ message: 'Protein deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting protein', error });
  }
}; 
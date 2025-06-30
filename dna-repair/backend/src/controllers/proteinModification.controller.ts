import { Request, Response } from 'express';
import { ProteinModification, IProteinModification } from '../models/ProteinModification';
import mongoose from 'mongoose';

export const proteinModificationController = {
  // 获取特定蛋白质的所有修饰
  async getByProteinId(req: Request, res: Response) {
    try {
      const { proteinId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(proteinId)) {
        return res.status(400).json({ message: 'Invalid protein ID' });
      }

      const modifications = await ProteinModification.find({ proteinId });
      res.json(modifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching protein modifications', error });
    }
  },

  // 创建新的蛋白修饰
  async create(req: Request, res: Response) {
    try {
      const { proteinId } = req.params;
      const modificationData = req.body;

      if (!mongoose.Types.ObjectId.isValid(proteinId)) {
        return res.status(400).json({ message: 'Invalid protein ID' });
      }

      const modification = new ProteinModification({
        ...modificationData,
        proteinId
      });

      await modification.save();
      res.status(201).json(modification);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        res.status(400).json({ message: 'This modification position already exists for this protein' });
      } else {
        res.status(500).json({ message: 'Error creating protein modification', error });
      }
    }
  },

  // 更新蛋白修饰
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid modification ID' });
      }

      const modification = await ProteinModification.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!modification) {
        return res.status(404).json({ message: 'Protein modification not found' });
      }

      res.json(modification);
    } catch (error) {
      res.status(500).json({ message: 'Error updating protein modification', error });
    }
  },

  // 删除蛋白修饰
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid modification ID' });
      }

      const modification = await ProteinModification.findByIdAndDelete(id);

      if (!modification) {
        return res.status(404).json({ message: 'Protein modification not found' });
      }

      res.json({ message: 'Protein modification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting protein modification', error });
    }
  }
}; 
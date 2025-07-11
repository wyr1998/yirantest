import express from 'express';
import { proteinModificationController } from '../controllers/proteinModification.controller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// 获取特定蛋白质的所有修饰 (public access)
router.get('/protein/:proteinId', proteinModificationController.getByProteinId);

// 为特定蛋白质创建新的修饰 (admin only)
router.post('/protein/:proteinId', auth, requireAdmin, proteinModificationController.create);

// 更新特定修饰 (admin only)
router.put('/:id', auth, requireAdmin, proteinModificationController.update);

// 删除特定修饰 (admin only)
router.delete('/:id', auth, requireAdmin, proteinModificationController.delete);

export default router; 
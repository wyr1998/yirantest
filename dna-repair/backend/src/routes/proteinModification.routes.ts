import express from 'express';
import { proteinModificationController } from '../controllers/proteinModification.controller';

const router = express.Router();

// 获取特定蛋白质的所有修饰
router.get('/protein/:proteinId', proteinModificationController.getByProteinId);

// 为特定蛋白质创建新的修饰
router.post('/protein/:proteinId', proteinModificationController.create);

// 更新特定修饰
router.put('/:id', proteinModificationController.update);

// 删除特定修饰
router.delete('/:id', proteinModificationController.delete);

export default router; 
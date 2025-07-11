import express from 'express';
import { blogController } from '../controllers/blog.controller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all blog posts (public access)
router.get('/', blogController.getAllPosts);

// Search blog posts (public access)
router.get('/search', blogController.searchPosts);

// Get posts by category (public access)
router.get('/category/:category', blogController.getPostsByCategory);

// Get a single blog post (public access)
router.get('/:id', blogController.getPostById);

// Create a new blog post (admin only)
router.post('/', auth, requireAdmin, blogController.createPost);

// Update a blog post (admin only)
router.put('/:id', auth, requireAdmin, blogController.updatePost);

// Delete a blog post (admin only)
router.delete('/:id', auth, requireAdmin, blogController.deletePost);

export default router; 
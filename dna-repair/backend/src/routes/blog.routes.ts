import express from 'express';
import { blogController } from '../controllers/blog.controller';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all blog posts (public access)
router.get('/', blogController.getAllPosts);

// Get all posts for admin dashboard (admin only)
router.get('/admin-all', auth, requireAdmin, blogController.getAllPostsForAdmin);

// Search blog posts (public access)
router.get('/search', blogController.searchPosts);

// Get posts by category (public access)
router.get('/category/:category', blogController.getPostsByCategory);

// Get admin-only posts (admin only)
router.get('/admin-only', auth, requireAdmin, blogController.getAdminOnlyPosts);

// Create a new blog post (admin only)
router.post('/', auth, requireAdmin, blogController.createPost);

// Update a blog post (admin only)
router.put('/:id', auth, requireAdmin, blogController.updatePost);

// Delete a blog post (admin only)
router.delete('/:id', auth, requireAdmin, blogController.deletePost);

// Get a single blog post (public access) - 放在最后，避免与具体路径冲突
router.get('/:id', blogController.getPostById);

export default router; 
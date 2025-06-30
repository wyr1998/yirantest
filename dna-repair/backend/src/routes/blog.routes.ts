import express from 'express';
import { blogController } from '../controllers/blog.controller';

const router = express.Router();

// Get all blog posts
router.get('/', blogController.getAllPosts);

// Search blog posts
router.get('/search', blogController.searchPosts);

// Get posts by category
router.get('/category/:category', blogController.getPostsByCategory);

// Get a single blog post
router.get('/:id', blogController.getPostById);

// Create a new blog post
router.post('/', blogController.createPost);

// Update a blog post
router.put('/:id', blogController.updatePost);

// Delete a blog post
router.delete('/:id', blogController.deletePost);

export default router; 
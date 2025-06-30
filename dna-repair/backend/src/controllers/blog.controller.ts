import { Request, Response } from 'express';
import { Blog, IBlog } from '../models/Blog';

export const blogController = {
  // Get all blog posts
  getAllPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Blog.find().sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  },

  // Get a single blog post by ID
  getPostById: async (req: Request, res: Response) => {
    try {
      const post = await Blog.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  },

  // Create a new blog post
  createPost: async (req: Request, res: Response) => {
    try {
      const { title, content, excerpt, author, tags, category } = req.body;
      
      const newPost = new Blog({
        title,
        content,
        excerpt,
        author,
        tags: tags || [],
        category: category || 'General',
        publishDate: new Date(),
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  },

  // Update a blog post
  updatePost: async (req: Request, res: Response) => {
    try {
      const { title, content, excerpt, author, tags, category } = req.body;
      
      const updatedPost = await Blog.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          excerpt,
          author,
          tags: tags || [],
          category: category || 'General',
        },
        { new: true, runValidators: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  },

  // Delete a blog post
  deletePost: async (req: Request, res: Response) => {
    try {
      const deletedPost = await Blog.findByIdAndDelete(req.params.id);
      
      if (!deletedPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  },

  // Search blog posts
  searchPosts: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const posts = await Blog.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).sort({ publishDate: -1 });

      res.json(posts);
    } catch (error) {
      console.error('Error searching blog posts:', error);
      res.status(500).json({ message: 'Failed to search blog posts' });
    }
  },

  // Get posts by category
  getPostsByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const posts = await Blog.find({ category }).sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      res.status(500).json({ message: 'Failed to fetch posts by category' });
    }
  }
}; 
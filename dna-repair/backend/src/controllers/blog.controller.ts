import { Request, Response } from 'express';
import { Blog, IBlog } from '../models/Blog';
import { AuthRequest } from '../middleware/auth';

export const blogController = {
  // Get all blog posts (filtered by user role)
  getAllPosts: async (req: AuthRequest, res: Response) => {
    try {
      let query: any = {};
      
      // If user is not admin, filter out admin-only posts
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        query.isAdminOnly = { $ne: true };
      }
      
      const posts = await Blog.find(query).sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  },

  // Get all blog posts for admin dashboard (including admin-only posts)
  getAllPostsForAdmin: async (req: AuthRequest, res: Response) => {
    try {
      // Check if user is admin
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const posts = await Blog.find().sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching all posts for admin:', error);
      res.status(500).json({ message: 'Failed to fetch all posts' });
    }
  },

  // Get a single blog post by ID (with permission check)
  getPostById: async (req: AuthRequest, res: Response) => {
    try {
      const post = await Blog.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Check if user has permission to view admin-only post
      if (post.isAdminOnly && (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin'))) {
        return res.status(403).json({ message: 'Access denied. Admin only content.' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  },

  // Get a single blog post by ID for admin editing (admin only)
  getPostByIdForAdmin: async (req: AuthRequest, res: Response) => {
    try {
      // Check if user is admin
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const post = await Blog.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post for admin:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  },

  // Create a new blog post
  createPost: async (req: AuthRequest, res: Response) => {
    try {
      const { title, content, excerpt, author, tags, category, isAdminOnly } = req.body;
      
      const newPost = new Blog({
        title,
        content,
        excerpt,
        author,
        tags: tags || [],
        category: category || 'General',
        isAdminOnly: isAdminOnly || false,
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
  updatePost: async (req: AuthRequest, res: Response) => {
    try {
      const { title, content, excerpt, author, tags, category, isAdminOnly } = req.body;
      
      const updatedPost = await Blog.findByIdAndUpdate(
        req.params.id,
        {
          title,
          content,
          excerpt,
          author,
          tags: tags || [],
          category: category || 'General',
          isAdminOnly: isAdminOnly || false,
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

  // Search blog posts (with permission filtering)
  searchPosts: async (req: AuthRequest, res: Response) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      let searchQuery: any = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      };
      
      // If user is not admin, filter out admin-only posts
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        searchQuery.isAdminOnly = { $ne: true };
      }

      const posts = await Blog.find(searchQuery).sort({ publishDate: -1 });

      res.json(posts);
    } catch (error) {
      console.error('Error searching blog posts:', error);
      res.status(500).json({ message: 'Failed to search blog posts' });
    }
  },

  // Get posts by category (with permission filtering)
  getPostsByCategory: async (req: AuthRequest, res: Response) => {
    try {
      const { category } = req.params;
      let query: any = { category };
      
      // If user is not admin, filter out admin-only posts
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        query.isAdminOnly = { $ne: true };
      }
      
      const posts = await Blog.find(query).sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      res.status(500).json({ message: 'Failed to fetch posts by category' });
    }
  },

  // Get admin-only posts (admin only)
  getAdminOnlyPosts: async (req: AuthRequest, res: Response) => {
    try {
      // Check if user is admin
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      const posts = await Blog.find({ isAdminOnly: true }).sort({ publishDate: -1 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching admin-only posts:', error);
      res.status(500).json({ message: 'Failed to fetch admin-only posts' });
    }
  }
}; 
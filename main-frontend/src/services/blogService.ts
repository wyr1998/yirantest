import { BlogPost, BlogPostMeta } from '../types';
import { api } from './api';

const API_BASE = '/blogs';

export const blogService = {
  // 获取所有博客文章的元数据
  getAllPosts: async (): Promise<BlogPostMeta[]> => {
    const response = await api.get(API_BASE);
    const posts: BlogPost[] = response.data;
    // Map to BlogPostMeta
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category,
      isAdminOnly: post.isAdminOnly || false
    }));
  },

  // 根据ID获取特定博客文章
  getPostById: async (id: string): Promise<BlogPost | null> => {
    try {
      const response = await api.get(`${API_BASE}/${id}`);
      const post = response.data;
      return { ...post, id: post._id || post.id };
    } catch (error) {
      return null;
    }
  },

  // 根据ID获取特定博客文章（admin编辑专用）
  getPostByIdForAdmin: async (id: string): Promise<BlogPost | null> => {
    try {
      const response = await api.get(`${API_BASE}/admin/${id}`);
      const post = response.data;
      return { ...post, id: post._id || post.id };
    } catch (error) {
      return null;
    }
  },

  // 根据分类获取博客文章
  getPostsByCategory: async (category: string): Promise<BlogPostMeta[]> => {
    const response = await api.get(`${API_BASE}/category/${category}`);
    const posts: BlogPost[] = response.data;
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category,
      isAdminOnly: post.isAdminOnly || false
    }));
  },

  // 搜索博客文章
  searchPosts: async (query: string): Promise<BlogPostMeta[]> => {
    const response = await api.get(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    const posts: BlogPost[] = response.data;
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category,
      isAdminOnly: post.isAdminOnly || false
    }));
  },

  // 创建新博客文章
  createPost: async (post: BlogPost): Promise<BlogPost> => {
    const response = await api.post(API_BASE, post);
    const saved = response.data;
    return { ...saved, id: saved._id || saved.id };
  },

  // 更新博客文章
  updatePost: async (id: string, updatedPost: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await api.put(`${API_BASE}/${id}`, updatedPost);
    const updated = response.data;
    return { ...updated, id: updated._id || updated.id };
  },

  // 删除博客文章
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },

  // 获取所有博客文章（带content）
  getAllPostsWithContent: async (): Promise<BlogPost[]> => {
    const response = await api.get(API_BASE);
    const posts: BlogPost[] = response.data;
    return posts.map(post => ({ ...post, id: post._id || post.id }));
  },

  // 获取仅管理员可见的博客文章
  getAdminOnlyPosts: async (): Promise<BlogPostMeta[]> => {
    const response = await api.get(`${API_BASE}/admin-only`);
    const posts: BlogPost[] = response.data;
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category,
      isAdminOnly: post.isAdminOnly || false
    }));
  },

  // 获取所有博客文章（admin dashboard专用）
  getAllPostsForAdmin: async (): Promise<BlogPostMeta[]> => {
    const response = await api.get(`${API_BASE}/admin-all`);
    const posts: BlogPost[] = response.data;
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category,
      isAdminOnly: post.isAdminOnly || false
    }));
  }
}; 
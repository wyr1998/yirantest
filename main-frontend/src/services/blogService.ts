import { BlogPost, BlogPostMeta } from '../types';

const API_BASE = '/api/blogs';

export const blogService = {
  // 获取所有博客文章的元数据
  getAllPosts: async (): Promise<BlogPostMeta[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    const posts: BlogPost[] = await res.json();
    // Map to BlogPostMeta
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category
    }));
  },

  // 根据ID获取特定博客文章
  getPostById: async (id: string): Promise<BlogPost | null> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) return null;
    const post = await res.json();
    // Normalize _id to id
    return { ...post, id: post._id || post.id };
  },

  // 根据分类获取博客文章
  getPostsByCategory: async (category: string): Promise<BlogPostMeta[]> => {
    const res = await fetch(`${API_BASE}/category/${category}`);
    if (!res.ok) throw new Error('Failed to fetch posts by category');
    const posts: BlogPost[] = await res.json();
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category
    }));
  },

  // 搜索博客文章
  searchPosts: async (query: string): Promise<BlogPostMeta[]> => {
    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search blog posts');
    const posts: BlogPost[] = await res.json();
    return posts.map(post => ({
      id: post._id || post.id,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishDate: post.publishDate,
      tags: post.tags,
      category: post.category
    }));
  },

  // 创建新博客文章
  createPost: async (post: BlogPost): Promise<BlogPost> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create blog post');
    const saved = await res.json();
    return { ...saved, id: saved._id || saved.id };
  },

  // 更新博客文章
  updatePost: async (id: string, updatedPost: Partial<BlogPost>): Promise<BlogPost> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    });
    if (!res.ok) throw new Error('Failed to update blog post');
    const updated = await res.json();
    return { ...updated, id: updated._id || updated.id };
  },

  // 删除博客文章
  deletePost: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog post');
  },

  // 获取所有博客文章（带content）
  getAllPostsWithContent: async (): Promise<BlogPost[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    const posts: BlogPost[] = await res.json();
    return posts.map(post => ({ ...post, id: post._id || post.id }));
  }
}; 
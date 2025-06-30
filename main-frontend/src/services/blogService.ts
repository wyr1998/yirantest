import { BlogPost, BlogPostMeta } from '../types';

// 从localStorage获取博客数据，如果没有则返回空数组
const getBlogPostsFromStorage = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem('blogPosts');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // 首次访问时，返回空数组
      return [];
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// 保存博客数据到localStorage
const saveBlogPostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const blogService = {
  // 获取所有博客文章的元数据
  getAllPosts: async (): Promise<BlogPostMeta[]> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    const posts = getBlogPostsFromStorage();
    return posts.map(post => ({
      id: post.id,
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
    await new Promise(resolve => setTimeout(resolve, 200));
    const posts = getBlogPostsFromStorage();
    return posts.find(post => post.id === id) || null;
  },

  // 根据分类获取博客文章
  getPostsByCategory: async (category: string): Promise<BlogPostMeta[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const posts = getBlogPostsFromStorage();
    return posts
      .filter(post => post.category === category)
      .map(post => ({
        id: post.id,
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
    await new Promise(resolve => setTimeout(resolve, 400));
    const posts = getBlogPostsFromStorage();
    const lowercaseQuery = query.toLowerCase();
    return posts
      .filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .map(post => ({
        id: post.id,
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
    await new Promise(resolve => setTimeout(resolve, 500));
    const posts = getBlogPostsFromStorage();
    posts.push(post);
    saveBlogPostsToStorage(posts);
    return post;
  },

  // 更新博客文章
  updatePost: async (id: string, updatedPost: Partial<BlogPost>): Promise<BlogPost> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const posts = getBlogPostsFromStorage();
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost };
      saveBlogPostsToStorage(posts);
      return posts[index];
    }
    throw new Error('Post not found');
  },

  // 删除博客文章
  deletePost: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const posts = getBlogPostsFromStorage();
    const filteredPosts = posts.filter(post => post.id !== id);
    saveBlogPostsToStorage(filteredPosts);
  },

  // 获取所有博客文章（带content）
  getAllPostsWithContent: async (): Promise<BlogPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getBlogPostsFromStorage();
  }
}; 
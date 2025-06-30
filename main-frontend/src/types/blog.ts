export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: 'DNA-Repair' | 'Research' | 'General';
}

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: 'DNA-Repair' | 'Research' | 'General';
} 
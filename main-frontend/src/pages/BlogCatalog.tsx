import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPostMeta } from '../types';

const BlogCatalog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getAllPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading blog catalog...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Blog Directory</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <Link to={`/dna-repair/blog/${post.id}`} style={{ fontSize: 20, color: '#1976d2', textDecoration: 'none' }}>
              {post.title}
            </Link>
            <div style={{ color: '#888', fontSize: 14 }}>
              {post.author} | {new Date(post.publishDate).toLocaleDateString()} | {post.category}
            </div>
            <div style={{ color: '#555', marginTop: 4 }}>{post.excerpt}</div>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <div>No blog posts found.</div>}
    </div>
  );
};

export default BlogCatalog; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPostMeta } from '../types';
import { blogService } from '../services/blogService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #2196f3;
    font-size: 2.5em;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 1.1em;
  }
`;

const SearchBar = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  width: 300px;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #2196f3;
  }
`;

const CategoryFilter = styled.select`
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #2196f3;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

const BlogCard = styled(Link)`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e0e0e0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 15px;
`;

const CardTitle = styled.h2`
  color: #2196f3;
  font-size: 1.4em;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
`;

const Author = styled.span`
  font-weight: 500;
  color: #1976d2;
`;

const DateText = styled.span`
  color: #888;
`;

const CardExcerpt = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 500;
`;

const CategoryBadge = styled.span<{ $category: string }>`
  background: ${props => {
    switch (props.$category) {
      case 'DNA-Repair': return '#e8f5e8';
      case 'Research': return '#fff3e0';
      case 'General': return '#f3e5f5';
      default: return '#e3f2fd';
    }
  }};
  color: ${props => {
    switch (props.$category) {
      case 'DNA-Repair': return '#2e7d32';
      case 'Research': return '#f57c00';
      case 'General': return '#7b1fa2';
      default: return '#1976d2';
    }
  }};
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 500;
  margin-bottom: 10px;
  display: inline-block;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
`;

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await blogService.getAllPosts();
        const validPosts = allPosts.filter(post => !!post.id);
        setPosts(validPosts);
        setFilteredPosts(validPosts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 当页面重新获得焦点时刷新博客列表
  useEffect(() => {
    const handleFocus = () => {
      const fetchPosts = async () => {
        try {
          const allPosts = await blogService.getAllPosts();
          const validPosts = allPosts.filter(post => !!post.id);
          setPosts(validPosts);
          setFilteredPosts(validPosts);
        } catch (error) {
          console.error('Failed to refresh posts:', error);
        }
      };
      fetchPosts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 按搜索查询筛选
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner>Loading blog posts...</LoadingSpinner>;
  }

  return (
    <PageContainer>
      <Header>
        <h1>DNA Repair Blog</h1>
        <p>Latest insights and research in DNA repair mechanisms</p>
      </Header>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <CategoryFilter value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          <option value="DNA-Repair">DNA Repair</option>
          <option value="Research">Research</option>
          <option value="General">General</option>
        </CategoryFilter>
      </SearchBar>

      {filteredPosts.length === 0 ? (
        <NoResults>
          {searchQuery || selectedCategory !== 'all' 
            ? 'No posts found matching your criteria.' 
            : 'No blog posts available.'}
        </NoResults>
      ) : (
        <BlogGrid>
          {filteredPosts.map(post => (
            <BlogCard key={post.id} to={`/dna-repair/blog/${post.id}`}>
              <CardHeader>
                <CategoryBadge $category={post.category}>
                  {post.category}
                </CategoryBadge>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              
              <CardMeta>
                <Author>By {post.author}</Author>
                <DateText>{new Date(post.publishDate).toLocaleDateString()}</DateText>
              </CardMeta>
              
              <CardExcerpt>{post.excerpt}</CardExcerpt>
              
              <CardTags>
                {post.tags.slice(0, 3).map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
                {post.tags.length > 3 && (
                  <Tag>+{post.tags.length - 3} more</Tag>
                )}
              </CardTags>
            </BlogCard>
          ))}
        </BlogGrid>
      )}
    </PageContainer>
  );
};

export default BlogList; 
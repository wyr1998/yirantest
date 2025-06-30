import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPostMeta } from '../types';
import { blogService } from '../services/blogService';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h1`
  color: #2196f3;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const WelcomeText = styled.span`
  color: #666;
  font-size: 14px;
`;

const LogoutButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #d32f2f;
  }
`;

const NewPostButton = styled(Link)`
  background: #4caf50;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 500;
  
  &:hover {
    background: #388e3c;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: #2196f3;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const PostsSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #333;
`;

const PostsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f9f9f9;
  }
`;

const PostInfo = styled.div`
  flex: 1;
`;

const PostTitle = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const PostMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const PostActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background: ${props => props.$variant === 'delete' ? '#f44336' : '#2196f3'};
  color: white;
  
  &:hover {
    background: ${props => props.$variant === 'delete' ? '#d32f2f' : '#1976d2'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/dna-repair/admin/login');
      return;
    }

    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    navigate('/dna-repair/admin/login');
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await blogService.deletePost(id);
        fetchPosts(); // 删除后刷新列表
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('删除失败，请重试！');
      }
    }
  };

  const getUsername = () => {
    return localStorage.getItem('adminUsername') || 'Admin';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>管理后台</Title>
        <HeaderActions>
          <WelcomeText>欢迎，{getUsername()}！</WelcomeText>
          <NewPostButton to="/dna-repair/admin/new-post">写新文章</NewPostButton>
          <LogoutButton onClick={handleLogout}>退出登录</LogoutButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatNumber>{posts.length}</StatNumber>
          <StatLabel>总文章数</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'DNA-Repair').length}
          </StatNumber>
          <StatLabel>DNA修复类</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'Research').length}
          </StatNumber>
          <StatLabel>研究类</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'General').length}
          </StatNumber>
          <StatLabel>通用类</StatLabel>
        </StatCard>
      </StatsGrid>

      <PostsSection>
        <SectionHeader>文章管理</SectionHeader>
        <PostsList>
          {posts.length === 0 ? (
            <EmptyState>
              还没有文章，点击"写新文章"开始创作吧！
            </EmptyState>
          ) : (
            posts.map(post => (
              <PostItem key={post.id}>
                <PostInfo>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    {post.author} • {new Date(post.publishDate).toLocaleDateString()} • {post.category}
                  </PostMeta>
                </PostInfo>
                <PostActions>
                  <ActionButton onClick={() => navigate(`/dna-repair/admin/edit/${post.id}`)}>
                    编辑
                  </ActionButton>
                  <ActionButton $variant="delete" onClick={() => handleDeletePost(post.id)}>
                    删除
                  </ActionButton>
                </PostActions>
              </PostItem>
            ))
          )}
        </PostsList>
      </PostsSection>
    </DashboardContainer>
  );
};

export default AdminDashboard; 
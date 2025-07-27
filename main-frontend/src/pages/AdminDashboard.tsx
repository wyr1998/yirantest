import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPostMeta } from '../types';
import { blogService } from '../services/blogService';
import { authService } from '../services/authService';
import PasswordChangeModal from '../components/PasswordChangeModal';

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

const PasswordChangeButton = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f57c00;
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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AdminOnlyBadge = styled.span`
  background: #ffebee;
  color: #d32f2f;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  border: 1px solid #ffcdd2;
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
  const [user, setUser] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const currentUser = await authService.verifyToken();
        if (!currentUser) {
          navigate('/dna-repair/admin/login');
          return;
        }
        setUser(currentUser);
        fetchPosts();
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/dna-repair/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts for admin dashboard...');
      
      // Get all posts for admin dashboard
      const allPosts = await blogService.getAllPostsForAdmin();
      
      console.log('All posts for admin:', allPosts);
      
      setPosts(allPosts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/dna-repair/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout by clearing local storage
      authService.clearAuth();
      navigate('/dna-repair/admin/login');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(id);
        fetchPosts(); // Refresh list after deletion
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Delete failed, please try again!');
      }
    }
  };

  const getUsername = () => {
    return user?.username || 'Admin';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <HeaderActions>
          <WelcomeText>Welcome, {getUsername()}!</WelcomeText>
          <PasswordChangeButton onClick={() => setShowPasswordModal(true)}>
            Change Password
          </PasswordChangeButton>
          <NewPostButton to="/dna-repair/admin/new-post">Write New Article</NewPostButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatNumber>{posts.length}</StatNumber>
          <StatLabel>Total Articles</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'DNA-Repair').length}
          </StatNumber>
          <StatLabel>DNA Repair Category</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'Research').length}
          </StatNumber>
          <StatLabel>Research Category</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.category === 'General').length}
          </StatNumber>
          <StatLabel>General Category</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>
            {posts.filter(post => post.isAdminOnly).length}
          </StatNumber>
          <StatLabel>Admin-Only Articles</StatLabel>
        </StatCard>
      </StatsGrid>

      <PostsSection>
        <SectionHeader>Article Management</SectionHeader>
        <PostsList>
          {posts.length === 0 ? (
            <EmptyState>
              No articles yet. Click "Write New Article" to start creating!
            </EmptyState>
          ) : (
            posts.map(post => (
              <PostItem key={post.id}>
                <PostInfo>
                  <PostTitle>
                    {post.title}
                    {post.isAdminOnly && (
                      <AdminOnlyBadge>Admin Only</AdminOnlyBadge>
                    )}
                  </PostTitle>
                  <PostMeta>
                    {post.author} • {new Date(post.publishDate).toLocaleDateString()} • {post.category}
                  </PostMeta>
                </PostInfo>
                <PostActions>
                  <ActionButton onClick={() => navigate(`/dna-repair/admin/edit/${post.id}`)}>
                    Edit
                  </ActionButton>
                  <ActionButton $variant="delete" onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </ActionButton>
                </PostActions>
              </PostItem>
            ))
          )}
        </PostsList>
      </PostsSection>

      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </DashboardContainer>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { authService } from '../services/authService';
import { Box } from '@mui/material';

const EditorContainer = styled.div`
  width: 100vw;
  max-width: 95vw;
  margin: 0 auto;
  padding: 10px;
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

const BackButton = styled(Link)`
  color: #666;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #2196f3;
  }
`;

const SaveButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #388e3c;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const FormSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2em;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  
  &:hover {
    color: #b71c1c;
  }
`;

const TagInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TagInputField = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
`;

const AddTagButton = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #1976d2;
  }
`;

const NativeTextarea = styled.textarea`
  width: 100%;
  min-height: 500px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  text-align: center;
  padding: 20px;
  background: #ffebee;
  border-radius: 5px;
  margin-bottom: 20px;
`;

// 新增：正文编辑页容器
const ContentEditorContainer = styled.div`
  width: 95vw;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: 基本信息, 2: 正文内容
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'DNA-Repair' as 'DNA-Repair' | 'Research' | 'General',
    tags: [] as string[],
    newTag: '',
    isAdminOnly: false
  });

  const fetchPost = useCallback(async () => {
    try {
      if (!id || id === 'new') {
        return; // Don't fetch data for new article
      }
      const post = await blogService.getPostById(id);
      if (post) {
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          newTag: '',
          isAdminOnly: post.isAdminOnly || false
        });
      }
    } catch (error) {
      setError('Failed to load post');
    }
  }, [id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.verifyToken();
        if (!currentUser) {
          navigate('/dna-repair/admin/login');
          return;
        }
        setUser(currentUser);
        // 只有在编辑现有文章时才获取数据
        if (id && id !== 'new') {
          fetchPost();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/dna-repair/admin/login');
      }
    };

    checkAuth();
  }, [id, navigate, fetchPost]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newPost: BlogPost = {
        id: id && id !== 'new' ? id : Date.now().toString(),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        author: user?.username || 'Admin',
        publishDate: new Date().toISOString(),
        isAdminOnly: formData.isAdminOnly
      };

      if (!id || id === 'new') {
        await blogService.createPost(newPost);
        navigate('/dna-repair/blog');
      } else {
        await blogService.updatePost(id, newPost);
        navigate('/dna-repair/admin');
      }
    } catch (error) {
      console.error('Save failed details:', error);
      setError('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 3 } }}>
    <EditorContainer>
      <Header>
        <Title>{id === 'new' ? 'Write New Article' : 'Edit Article'}</Title>
        <HeaderActions>
          <BackButton to="/dna-repair/admin">← Back to Admin</BackButton>
          {step === 2 && (
            <SaveButton onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Article'}
            </SaveButton>
          )}
        </HeaderActions>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {step === 1 && (
        <FormContainer>
          <FormSection>
            <SectionTitle>Article Information</SectionTitle>
            <FormGroup>
              <Label>Title *</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter article title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Enter article excerpt"
              />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="DNA-Repair">DNA-Repair</option>
                <option value="Research">Research</option>
                <option value="General">General</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Tags</Label>
              <TagInput>
                <TagInputField
                  type="text"
                  value={formData.newTag}
                  onChange={e => handleInputChange('newTag', e.target.value)}
                  placeholder="Enter new tag"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                />
                <AddTagButton type="button" onClick={handleAddTag}>Add</AddTagButton>
              </TagInput>
              <TagsContainer>
                {formData.tags.map(tag => (
                  <Tag key={tag}>
                    {tag}
                    <RemoveTagButton type="button" onClick={() => handleRemoveTag(tag)}>×</RemoveTagButton>
                  </Tag>
                ))}
              </TagsContainer>
            </FormGroup>
            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.isAdminOnly}
                  onChange={(e) => handleInputChange('isAdminOnly', e.target.checked.toString())}
                />
                Admin Only
              </Label>
            </FormGroup>
            <SaveButton type="button" onClick={() => setStep(2)} style={{marginTop: 20}}>Next: Edit Content →</SaveButton>
          </FormSection>
        </FormContainer>
      )}

      {step === 2 && (
        <ContentEditorContainer>
          <SectionTitle>Content *</SectionTitle>
          <NativeTextarea
            value={formData.content}
            onChange={e => handleInputChange('content', e.target.value)}
            placeholder="Enter content here, supports Markdown syntax"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <SaveButton type="button" onClick={() => setStep(1)} style={{ background: '#ccc', color: '#333' }}>← Previous</SaveButton>
            <SaveButton onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Article'}
            </SaveButton>
          </div>
        </ContentEditorContainer>
      )}
    </EditorContainer>
    </Box>
  );
};

export default BlogEditor; 
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import MarkdownIt from 'markdown-it';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 8px 48px 8px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 30px;
  padding: 10px 0;
  &:hover { text-decoration: underline; }
`;

const Layout = styled.div`
  display: flex;
  gap: 32px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
  }
`;

const TOCWrapper = styled.div`
  flex: 0 0 260px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(33,150,243,0.07);
  padding: 24px 18px;
  height: fit-content;
  position: sticky;
  top: 32px;
  align-self: flex-start;
  @media (max-width: 900px) {
    position: static;
    width: 100%;
    margin-bottom: 24px;
  }
`;

const TOCTitle = styled.div`
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 12px;
  font-size: 1.1em;
`;

const TOCList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 4px;
`;

const TOCItem = styled.li<{ $level: number }>`
  margin-left: ${props => (props.$level - 1) * 18}px;
  margin-bottom: 6px;
  a {
    color: #1976d2;
    text-decoration: none;
    font-size: 15px;
    transition: color 0.2s;
    &:hover { color: #0d47a1; text-decoration: underline; }
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ArticleHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h1`
  color: #2196f3;
  font-size: 2.3em;
  margin-bottom: 12px;
  line-height: 1.2;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #666;
  font-size: 0.98em;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Author = styled.span`
  font-weight: 500;
  color: #1976d2;
`;

const DateText = styled.span`
  color: #888;
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
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.95em;
  font-weight: 500;
`;

const Tags = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 500;
`;

const ArticleContent = styled.div`
  background: white;
  padding: 36px 28px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(33,150,243,0.08);
  border: 1px solid #e0e0e0;
  font-size: 1.08em;
  line-height: 1.8;
  color: #222;
  word-break: break-word;
  h1, h2, h3, h4, h5, h6 {
    color: #1976d2;
    margin-top: 1.5em;
    margin-bottom: 0.7em;
    font-weight: bold;
  }
  p { margin: 1em 0; }
  blockquote {
    background: #f3f7fa;
    border-left: 4px solid #90caf9;
    margin: 1em 0;
    padding: 0.7em 1em;
    color: #1976d2;
    border-radius: 6px;
  }
  pre, code {
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 0.97em;
    padding: 2px 6px;
    color: #c7254e;
  }
  img {
    max-width: 100%;
    display: block;
    margin: 1.2em auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(33,150,243,0.07);
  }
  ul, ol { margin-left: 1.5em; }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #d32f2f;
  font-size: 1.1em;
`;

const md = new MarkdownIt();

function extractHeadings(markdown: string, blogId: string) {
  const tokens = md.parse(markdown, {});
  const headings: { level: number; content: string; id: string }[] = [];
  tokens.forEach((token, idx) => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace('h', ''));
      const content = tokens[idx + 1]?.content || '';
      const id = `blog-${blogId}-h${level}-${content.replace(/\s+/g, '-').toLowerCase()}`;
      headings.push({ level, content, id });
    }
  });
  return headings;
}

function renderMarkdownWithHeadingIds(markdown: string, blogId: string) {
  const defaultRender = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const level = token.tag;
    const content = tokens[idx + 1]?.content || '';
    const id = `blog-${blogId}-${level}-${content.replace(/\s+/g, '-').toLowerCase()}`;
    token.attrs = token.attrs || [];
    token.attrs.push(['id', id]);
    return defaultRender(tokens, idx, options, env, self);
  };
  return md.render(markdown);
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }
      try {
        const postData = await blogService.getPostById(id);
        if (postData) {
          setPost(postData);
        } else {
          setError('Post not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load post');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <LoadingSpinner>Loading post...</LoadingSpinner>;
  }

  if (error || !post) {
    return (
      <PageContainer>
        <BackButton to="/dna-repair/blog">
          ← Back to Blog
        </BackButton>
        <ErrorMessage>
          {error || 'Post not found'}
        </ErrorMessage>
      </PageContainer>
    );
  }

  // 生成目录
  const headings = extractHeadings(post.content, post.id);

  return (
    <PageContainer>
      <BackButton to="/dna-repair/blog">
        ← Back to Blog
      </BackButton>
      <Layout>
        {/* 目录区 */}
        {headings.length > 0 && (
          <TOCWrapper>
            <TOCTitle>目录</TOCTitle>
            <TOCList>
              {headings.map(h => (
                <TOCItem key={h.id} $level={h.level}>
                  <a href={`#${h.id}`}>{h.content}</a>
                </TOCItem>
              ))}
            </TOCList>
          </TOCWrapper>
        )}
        {/* 正文区 */}
        <MainContent>
          <ArticleHeader>
            <Title>{post.title}</Title>
            <MetaInfo>
              <Author>By {post.author}</Author>
              <DateText>{new Date(post.publishDate).toLocaleDateString()}</DateText>
              <CategoryBadge $category={post.category}>
                {post.category}
              </CategoryBadge>
            </MetaInfo>
            <Tags>
              {post.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          </ArticleHeader>
          <ArticleContent>
            <div dangerouslySetInnerHTML={{ __html: renderMarkdownWithHeadingIds(post.content, post.id) }} />
          </ArticleContent>
        </MainContent>
      </Layout>
    </PageContainer>
  );
};

export default BlogDetail; 
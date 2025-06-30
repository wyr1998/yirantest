import React from 'react';
import styled from 'styled-components';

const MarkdownContainer = styled.div`
  line-height: 1.6;
  color: #333;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-line;
  
  h1 {
    font-size: 2.5em;
    color: #2196f3;
    margin-bottom: 0.5em;
    border-bottom: 2px solid #2196f3;
    padding-bottom: 0.3em;
  }
  
  h2 {
    font-size: 2em;
    color: #1976d2;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.2em;
  }
  
  h3 {
    font-size: 1.5em;
    color: #1565c0;
    margin-top: 1.2em;
    margin-bottom: 0.4em;
  }
  
  h4 {
    font-size: 1.2em;
    color: #0d47a1;
    margin-top: 1em;
    margin-bottom: 0.3em;
  }
  
  p {
    margin-bottom: 1em;
    text-align: justify;
  }
  
  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  
  li {
    margin-bottom: 0.5em;
  }
  
  strong {
    font-weight: bold;
    color: #d32f2f;
  }
  
  em {
    font-style: italic;
    color: #388e3c;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: #f8f8f8;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    border-left: 4px solid #2196f3;
    margin: 1em 0;
  }
  
  pre code {
    background: none;
    padding: 0;
  }
  
  blockquote {
    border-left: 4px solid #2196f3;
    padding-left: 1em;
    margin: 1em 0;
    font-style: italic;
    color: #666;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.5em;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  a {
    color: #2196f3;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 1em 0;
  }
`;

interface MarkdownRendererProps {
  content: string;
  parseMarkdown?: (text: string) => string;
}

// 默认解析函数
const defaultParseMarkdown = (text: string): string => {
  return text
    // 处理标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 处理粗体和斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 处理代码块
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 处理列表
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    // 处理段落
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|o|p|b|t|d])(.*$)/gim, '<p>$1</p>')
    // 清理多余的标签
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<ol>.*?<\/ol>)<\/p>/g, '$1')
    .replace(/<p>(<pre>.*?<\/pre>)<\/p>/g, '$1')
    // 包装列表项
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    // 处理链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, parseMarkdown }) => {
  const htmlContent = (parseMarkdown ?? defaultParseMarkdown)(content);

  return (
    <MarkdownContainer 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer; 
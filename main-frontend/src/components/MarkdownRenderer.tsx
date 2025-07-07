import React from 'react';
import styled from 'styled-components';

const MarkdownContainer = styled.div`
  line-height: 1.6;
  color: #333;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-line;
`;

// Tooltip styles for inline HTML
const tooltipStyle = `
  position: relative;
  cursor: pointer;
  color: #1976d2;
  font-size: 0.85em;
  user-select: none;
`;
const tooltipBoxStyle = `
  display: none;
  position: absolute;
  top: 1.8em;
  left: 0;
  background: #fff;
  color: #333;
  border: 1px solid #1976d2;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: 0.95em;
  z-index: 100;
  min-width: 200px;
  max-width: 350px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  white-space: normal;
`;
const tooltipHover = `
  .reference-marker:hover .reference-tooltip { display: block; }
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

function replaceReferencesInHtml(html: string, refs: string[]): string {
  return html.replace(/\[\[REFERENCE_(\d+)\]\]/g, (_, n) => {
    const idx = parseInt(n, 10) - 1;
    const refText = refs[idx] || '';
    return `<sup class="reference-marker">[${parseInt(n, 10)}]<span class="reference-tooltip">${refText}</span></sup>`;
  });
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, parseMarkdown }) => {
  // Step 1: Extract references and replace with placeholder tokens
  const refRegex = /\(([^()\n]{10,})\)/g;
  let refs: string[] = [];
  let replaced = content;
  let match: RegExpExecArray | null;
  let refNum = 1;
  while ((match = refRegex.exec(content)) !== null) {
    const refText = match[1].trim();
    if (refText.includes(',') && refText.split(' ').length > 2) {
      refs.push(refText);
      replaced = replaced.replace(match[0], `[[REFERENCE_${refNum}]]`);
      refNum++;
    }
  }

  // Step 2: Parse markdown
  const html = (parseMarkdown ?? defaultParseMarkdown)(replaced);
  // Step 3: Replace placeholders with reference markers
  const htmlWithRefs = replaceReferencesInHtml(html, refs);

  return (
    <MarkdownContainer>
      <span dangerouslySetInnerHTML={{ __html: htmlWithRefs }} />
    </MarkdownContainer>
  );
};

export default MarkdownRenderer; 
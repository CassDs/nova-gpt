
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Detects code blocks in a message and returns React elements with syntax highlighting
 */
export const formatMessageWithCodeBlocks = (content: string): React.ReactNode[] => {
  if (!content) return [content];

  // Regex to match code blocks with language specification
  // Format: ```language\ncode\n```
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  
  // For messages from the assistant, we want to apply markdown outside of code blocks
  // We'll split the content into segments: text, code, text, code, etc.
  let lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let match;

  // Process code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block (with markdown)
    if (match.index > lastIndex) {
      const textBeforeCode = content.substring(lastIndex, match.index);
      elements.push(
        <ReactMarkdown key={`md-${lastIndex}`} className="markdown-content">
          {textBeforeCode}
        </ReactMarkdown>
      );
    }

    // Get the language, defaulting to 'java' for SRL or plaintext
    let language = match[1] || 'plaintext';
    let displayLanguage = language;
    
    // Handle SRL language (treat as Java for syntax highlighting but display as SRL)
    if (language === 'srl' || language === 'plaintext' || language === '') {
      language = 'java'; // Use Java highlighting for SRL
      displayLanguage = 'SRL';
    }
    
    const code = match[2];

    // Add syntax highlighted code block
    elements.push(
      <div key={`code-${match.index}`} className="rounded-md overflow-hidden my-2">
        <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 flex justify-between items-center">
          <span>{displayLanguage}</span>
          <button 
            className="text-gray-400 hover:text-white" 
            onClick={() => navigator.clipboard.writeText(code)}
            aria-label="Copy code"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text (with markdown)
  if (lastIndex < content.length) {
    const textAfterCode = content.substring(lastIndex);
    elements.push(
      <ReactMarkdown key={`md-last`} className="markdown-content">
        {textAfterCode}
      </ReactMarkdown>
    );
  }

  return elements;
};

/**
 * Formats inline code in text segments
 */
const formatInlineCode = (text: string): React.ReactNode[] => {
  if (!text) return [text];

  const inlineCodeRegex = /`([^`]+)`/g;
  let lastInlineIndex = 0;
  const inlineElements: React.ReactNode[] = [];
  let inlineMatch;

  while ((inlineMatch = inlineCodeRegex.exec(text)) !== null) {
    // Add text before inline code
    if (inlineMatch.index > lastInlineIndex) {
      inlineElements.push(text.substring(lastInlineIndex, inlineMatch.index));
    }

    // Add inline code with styling
    inlineElements.push(
      <code key={`inline-${inlineMatch.index}`} className="px-1.5 py-0.5 mx-0.5 bg-gray-800 text-gray-200 rounded font-mono text-sm">
        {inlineMatch[1]}
      </code>
    );

    lastInlineIndex = inlineMatch.index + inlineMatch[0].length;
  }

  // Add remaining text
  if (lastInlineIndex < text.length) {
    inlineElements.push(text.substring(lastInlineIndex));
  }

  return inlineElements;
};

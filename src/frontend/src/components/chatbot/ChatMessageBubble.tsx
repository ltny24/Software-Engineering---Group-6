// ============================================================
// ChatMessageBubble – renders a single chat message with
// distinct styling for student vs AI messages.
// Supports Markdown formatting via react-markdown.
// ============================================================

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaRobot } from 'react-icons/fa6';
import type { ChatMessage } from '../../types/chatbot.types';
import CourseSuggestionCard from './CourseSuggestionCard';
import GraduationRoadmapCard from './GraduationRoadmapCard';
import './ChatMessageBubble.css';

interface Props {
  message: ChatMessage;
}

/**
 * Custom Markdown components with styled rendering.
 */
const markdownComponents = {
  // Bold text with highlight color
  strong({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) {
    return (
      <strong className="md-strong" {...props}>
        {children}
      </strong>
    );
  },
  // Emphasized / italic text
  em({ children, ...props }: React.ComponentPropsWithoutRef<'em'>) {
    return (
      <em className="md-em" {...props}>
        {children}
      </em>
    );
  },
  // Inline code / backtick
  code({ children, className, ...props }: React.ComponentPropsWithoutRef<'code'>) {
    const isInline = !className;
    return (
      <code
        className={`md-code ${isInline ? 'md-code--inline' : ''} ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  // Unordered list
  ul({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) {
    return (
      <ul className="md-list" {...props}>
        {children}
      </ul>
    );
  },
  // Ordered list
  ol({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) {
    return (
      <ol className="md-list md-list--ordered" {...props}>
        {children}
      </ol>
    );
  },
  // List item
  li({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) {
    return (
      <li className="md-li" {...props}>
        {children}
      </li>
    );
  },
  // Paragraph
  p({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) {
    return (
      <p className="md-p" {...props}>
        {children}
      </p>
    );
  },
  // Link
  a({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) {
    return (
      <a className="md-link" href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  // Heading
  h1({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) {
    return (
      <h3 className="md-heading md-h1" {...props}>
        {children}
      </h3>
    );
  },
  h2({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) {
    return (
      <h3 className="md-heading md-h2" {...props}>
        {children}
      </h3>
    );
  },
  h3({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) {
    return (
      <h4 className="md-heading md-h3" {...props}>
        {children}
      </h4>
    );
  },
  // Blockquote
  blockquote({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) {
    return (
      <blockquote className="md-blockquote" {...props}>
        {children}
      </blockquote>
    );
  },
  // Horizontal rule
  hr(props: React.ComponentPropsWithoutRef<'hr'>) {
    return <hr className="md-hr" {...props} />;
  },
};

export default function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const roleClass = isUser ? 'chat-bubble--user' : 'chat-bubble--assistant';

  return (
    <div className={`chat-bubble ${roleClass}`}>
      {/* Role label */}
      <span className="chat-bubble__role">
        {isUser ? (
          'You'
        ) : (
          <>
            <FaRobot /> AI Assistant
          </>
        )}
      </span>

      {/* Message bubble with Markdown rendering */}
      <div
        className={`chat-bubble__content ${isUser ? 'chat-bubble__content--user' : 'chat-bubble__content--assistant'}`}
      >
        {isUser ? (
          // User messages: plain text (no Markdown rendering needed)
          <span className="chat-bubble__text">{message.content}</span>
        ) : (
          // Assistant messages: render Markdown
          <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
        )}
      </div>

      {/* Embedded course suggestions */}
      {message.courses && message.courses.length > 0 && (
        <div className="chat-bubble__embeds">
          {message.courses.map((course) => (
            <CourseSuggestionCard key={course.courseOfferingId} course={course} />
          ))}
        </div>
      )}

      {/* Embedded graduation progress */}
      {message.progress && (
        <div className="chat-bubble__embeds">
          <GraduationRoadmapCard progress={message.progress} />
        </div>
      )}

      {/* Timestamp */}
      <span className="chat-bubble__time">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}

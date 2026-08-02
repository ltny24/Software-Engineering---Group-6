// ============================================================
// ChatMessageBubble – renders a single chat message with
// distinct styling for student vs AI messages.
// ============================================================

import React from 'react';
import type { ChatMessage } from '../../types/chatbot.types';
import CourseSuggestionCard from './CourseSuggestionCard';
import GraduationRoadmapCard from './GraduationRoadmapCard';

interface Props {
  message: ChatMessage;
}

export default function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      {/* Role label */}
      <span
        style={{
          fontSize: '11px',
          color: '#94a3b8',
          marginBottom: '4px',
          paddingLeft: isUser ? '0' : '4px',
          paddingRight: isUser ? '4px' : '0',
        }}
      >
        {isUser ? 'You' : '🤖 AI Assistant'}
      </span>

      {/* Message bubble */}
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isUser ? '#1e3a8a' : '#f1f5f9',
          color: isUser ? '#ffffff' : '#0f172a',
          fontSize: '14px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {/* Embedded course suggestions */}
      {message.courses && message.courses.length > 0 && (
        <div style={{ marginTop: '12px', width: '100%', maxWidth: '80%' }}>
          {message.courses.map((course) => (
            <CourseSuggestionCard key={course.courseOfferingId} course={course} />
          ))}
        </div>
      )}

      {/* Embedded graduation progress */}
      {message.progress && (
        <div style={{ marginTop: '12px', width: '100%', maxWidth: '80%' }}>
          <GraduationRoadmapCard progress={message.progress} />
        </div>
      )}

      {/* Timestamp */}
      <span
        style={{
          fontSize: '10px',
          color: '#cbd5e1',
          marginTop: '4px',
          paddingLeft: isUser ? '0' : '4px',
          paddingRight: isUser ? '4px' : '0',
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}

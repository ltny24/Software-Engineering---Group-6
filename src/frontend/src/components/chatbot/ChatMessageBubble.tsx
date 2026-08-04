// ============================================================
// ChatMessageBubble – renders a single chat message with
// distinct styling for student vs AI messages.
// Genesis Design: indigo user bubbles, light assistant bubbles
// ============================================================

import React from 'react';
import { FaRobot } from 'react-icons/fa6';
import type { ChatMessage } from '../../types/chatbot.types';
import CourseSuggestionCard from './CourseSuggestionCard';
import GraduationRoadmapCard from './GraduationRoadmapCard';
import './ChatMessageBubble.css';

interface Props {
  message: ChatMessage;
}

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

      {/* Message bubble */}
      <div className="chat-bubble__content">{message.content}</div>

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

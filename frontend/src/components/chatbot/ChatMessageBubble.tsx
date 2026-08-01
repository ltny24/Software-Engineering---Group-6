import React from 'react';
import type { ChatMessage } from '../../types/chatbot.types';
import './ChatMessageBubble.css';

interface Props {
  message: ChatMessage;
}

/**
 * Renders a single chat message bubble.
 * - User messages: right-aligned, blue background (#1e3a8a)
 * - AI messages: left-aligned, light gray background (#f1f5f9)
 */
export default function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
      <div className="chat-bubble__avatar" aria-hidden="true">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="chat-bubble__body">
        <div className="chat-bubble__content">{message.content}</div>
        <span className="chat-bubble__time">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// AIChatbotPage – AI Learning Path Chatbot
// Skylearn: persistent history, school-only filter, big frame
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth';
import { sendChatMessage } from '../../services/chatbotService';
import { useChatbot } from '../../components/chatbot/ChatbotContext';
import type { ChatMessage, ContextType } from '../../types/chatbot.types';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import QuickActionChips from '../../components/chatbot/QuickActionChips';
import './AIChatbotPage.css';

const WELCOME_TEXT = `Hello! I'm your HCMUS academic advisor. I can help you with:

• Course recommendations — find the best courses for your next semester
• Graduation tracking — check your progress and estimated timeline
• Academic questions — prerequisites, requirements, policies
• Registration help — how to enroll, drop deadlines, and more

Please ask me anything about your studies at HCMUS!`;

export default function AIChatbotPage() {
  const { user } = useAuth();
  const { messages, setMessages, clearMessages, filterMessage } = useChatbot();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Welcome message only if no history exists
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_TEXT,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectContextType = (msg: string): ContextType => {
    const lower = msg.toLowerCase();
    if (
      lower.includes('course') ||
      lower.includes('recommend') ||
      lower.includes('suggest') ||
      lower.includes('eligible') ||
      lower.includes('semester') ||
      lower.includes('register')
    ) {
      return 'COURSE_SUGGESTION';
    }
    if (
      lower.includes('graduate') ||
      lower.includes('graduation') ||
      lower.includes('progress') ||
      lower.includes('timeline') ||
      lower.includes('credits') ||
      lower.includes('when') ||
      lower.includes('remaining')
    ) {
      return 'GRADUATION_AUDIT';
    }
    return 'GENERAL';
  };

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) return;

    // Filter: only school-related questions
    const filterResult = filterMessage(text);
    if (!filterResult.allowed) {
      const rejectedMsg: ChatMessage = {
        id: `rejected-${Date.now()}`,
        role: 'assistant',
        content: `${filterResult.reason}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, rejectedMsg]);
      setInput('');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const contextType = detectContextType(text);
      const response = await sendChatMessage({ message: text, contextType });

      const aiMsg: ChatMessage = {
        id: response.responseId || `ai-${Date.now()}`,
        role: 'assistant',
        content: response.replyText,
        timestamp: response.timestamp || new Date().toISOString(),
        courses: response.suggestedCourses,
        progress: response.graduationProgress,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Failed to get a response.';
      toast.error('Unable to reach the AI assistant. Please try again.');

      const fallback: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now. Error: ${errorMsg}\n\nPlease try again in a moment, or contact the IT support desk.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (message: string) => {
    handleSend(message);
  };

  const handleReset = () => {
    clearMessages();
    setInput('');
    const welcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: WELCOME_TEXT,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  };

  return (
    <div className="chatbot-page">
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header__left">
          <span className="chatbot-header__icon">🤖</span>
          <div>
            <h1 className="chatbot-header__title">AI Academic Assistant</h1>
            <span className="chatbot-header__status">Online — HCMUS Academic Advisor</span>
          </div>
        </div>
        <button className="chatbot-reset-btn" onClick={handleReset}>
          Reset Chat
        </button>
      </div>

      {/* Messages area */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="chatbot-typing">
            <span>🤖</span>
            <span className="spinner" style={{ width: '16px', height: '16px' }} />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="chatbot-quick-actions">
        <QuickActionChips onSelect={handleQuickAction} disabled={loading} />
      </div>

      {/* Input area */}
      <div className="chatbot-input-area">
        <div className="chatbot-input-row">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about courses, graduation, registration, or academic policies..."
            rows={2}
            disabled={loading}
            className="chatbot-input"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="chatbot-send-btn"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <p className="chatbot-disclaimer">
          I only answer questions related to your studies at HCMUS. For other topics, please contact
          the support desk.
        </p>
      </div>
    </div>
  );
}

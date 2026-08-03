// ============================================================
// AIChatbotPage – AI Learning Path Chatbot (T037)
// Combines rule-based degree audit with Gemini-powered
// conversational academic advising.
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth';
import { sendChatMessage } from '../../services/chatbotService';
import type { ChatMessage, ContextType } from '../../types/chatbot.types';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import QuickActionChips from '../../components/chatbot/QuickActionChips';

export default function AIChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Welcome message on first render
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hello ${user?.displayName || 'there'}! I'm your AI academic advisor.\n\nI can help you with:\n📚 **Course recommendations** — find the best courses for your next semester\n🎓 **Graduation tracking** — check your progress and estimated timeline\n❓ **Academic questions** — ask about prerequisites, requirements, or policies\n\nSelect a quick action below or type your question!`,
        timestamp: new Date().toISOString(),
        progress: {
          totalRequiredCredits: 135,
          completedCredits: 0,
          remainingCredits: 0,
          estimatedSemestersLeft: 0,
          completionPercentage: 0,
          criticalMilestonesPending: [],
          completedMilestones: [],
        },
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
      const response = await sendChatMessage({
        message: text,
        contextType,
      });

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
        content: `⚠️ I'm having trouble connecting to the academic engine right now. Error: ${errorMsg}\n\nPlease try again in a moment, or contact the IT support desk if the problem persists.`,
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
    setMessages([]);
    setInput('');
    // Re-trigger welcome message via re-render
    setTimeout(() => {
      const welcome: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `👋 Hello ${user?.displayName || 'there'}! Conversation has been reset. How can I help you today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
    }, 0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
              }}
            >
              AI Academic Assistant
            </h1>
            <span
              style={{
                fontSize: '12px',
                color: '#22c55e',
                fontWeight: '500',
              }}
            >
              🟢 Online — Connected to Degree Audit
            </span>
          </div>
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#64748b',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            <span>🤖</span>
            <span className="spinner" style={{ width: '16px', height: '16px' }} />
            <span>Analyzing your academic profile...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 24px' }}>
        <QuickActionChips onSelect={handleQuickAction} disabled={loading} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '12px 24px 20px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about courses, graduation, or prerequisites..."
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              backgroundColor: loading ? '#f8fafc' : '#ffffff',
              color: '#1e293b',
              lineHeight: '1.5',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: loading || !input.trim() ? '#94a3b8' : '#1e3a8a',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : 'Send 📤'}
          </button>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          ⚠️ AI recommendations are for advisory purposes only. Please verify official academic
          regulations in the university course catalog.
        </p>
      </div>
    </div>
  );
}

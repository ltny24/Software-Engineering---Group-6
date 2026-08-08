// ============================================================
// AIChatbotPage — AI Academic Chatbot with Gemini streaming
// All questions go to Gemini; Gemini decides what to answer.
// Course questions answered via RAG (courses.json).
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaPaperPlane, FaArrowLeft } from 'react-icons/fa6';
import { useChatbot } from '../../components/chatbot/ChatbotContext';
import { askGeminiStream } from '../../services/geminiService';
import { useAuth } from '../../auth/useAuth';
import { getMyProfile } from '../../services/profileService';
import type { ChatMessage } from '../../types/chatbot.types';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import QuickActionChips from '../../components/chatbot/QuickActionChips';
import { ROUTES } from '../../utils/constants';
import './AIChatbotPage.css';

const WELCOME_TEXT = `Hello! I'm the HCMUS AI Learning Assistant. I can help you with:

• Course Advising — suggest suitable courses for the next semester
• Graduation Tracking — check your academic progress
• Course Explanations — content, prerequisites, and applications
• Tuition & Grades — payment information, GPA
• Academic Policies — rules and procedures

Feel free to ask me anything about studying at HCMUS!`;

const useSafeNavigate = () => {
  try {
    return useNavigate();
  } catch {
    return (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.hash = path;
      }
    };
  }
};

export default function AIChatbotPage() {
  const navigate = useSafeNavigate();
  const { user } = useAuth();
  const { messages, setMessages } = useChatbot();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch student profile to build AI context
  useEffect(() => {
    if (user?.role === 'STUDENT') {
      getMyProfile()
        .then(async (profile) => {
          let ctx = `- Name: ${profile.firstName} ${profile.lastName}\n- Major: ${profile.major}\n- Student Type: ${profile.studentType}\n- Enrollment Status: ${profile.enrollmentStatus}`;

          try {
            const { default: api } = await import('../../services/api');
            const data = await api.get<any[]>('/api/v1/grades/me');
            if (data && Array.isArray(data)) {
              const validGrades = data.filter((item: any) => Number(item.gradePoint) > 0);
              const totalCredits = validGrades.reduce(
                (sum: number, item: any) => sum + (Number(item.credits) || 0),
                0
              );
              const weighted = validGrades.reduce(
                (sum: number, item: any) =>
                  sum + (Number(item.gradePoint) || 0) * (Number(item.credits) || 0),
                0
              );
              const gpa = totalCredits > 0 ? weighted / totalCredits : 0;
              ctx += `\n- Current GPA: ${gpa.toFixed(2)} / 10.0`;
            }
          } catch (err) {
            console.warn('Could not fetch GPA for AI context', err);
          }

          setUserContext(ctx);
        })
        .catch((err) => {
          console.warn('Could not fetch profile for AI context', err);
        });
    }
  }, [user]);

  // Ref to keep stable reference to messages for history building.
  // Avoids stale closure issues when streaming updates trigger re-renders.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: WELCOME_TEXT,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || loading) return;

      // Add user message to chat
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      // Create empty assistant placeholder for streaming
      const assistantId = `ai-${Date.now()}`;
      const placeholder: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholder]);

      try {
        // Build conversation history from before this turn (stable ref)
        const currentMessages = messagesRef.current;
        const history = currentMessages.map((m) => ({
          role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
          parts: [{ text: m.content }],
        }));

        // Stream response: onChunk receives full accumulated text
        await askGeminiStream(
          text,
          history,
          (fullText) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
            );
          },
          userContext
        );
      } catch (err) {
        // Show the specific error message from Gemini (already formatted in the service)
        const errorMsg =
          err instanceof Error
            ? err.message
            : '⚠️ Lỗi kết nối không xác định. Vui lòng thử lại sau.';
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: errorMsg } : m))
        );
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    // NOTE: intentionally NOT including `messages` in deps — we use messagesRef
    // to avoid recreating handleSend on every streaming chunk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, loading, setMessages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-page">
      {/* Back button */}
      <div className="chatbot-top-bar">
        <button
          className="chatbot-back-btn"
          onClick={() => navigate(ROUTES.SUPPORT)}
          title="Back to Support"
        >
          <FaArrowLeft /> Support
        </button>
      </div>

      {/* Messages area */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="chatbot-typing">
            <span>
              <FaRobot />
            </span>
            <span className="spinner" style={{ width: 16, height: 16 }} />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="chatbot-quick-actions">
        <QuickActionChips onSelect={(msg) => handleSend(msg)} disabled={loading} />
      </div>

      {/* Input area — sticky at bottom */}
      <div className="chatbot-input-area">
        <div className="chatbot-input-row">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về môn học, lộ trình, học phí, điểm số..."
            rows={2}
            disabled={loading}
            className="chatbot-input"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="chatbot-send-btn"
          >
            {loading ? (
              '...'
            ) : (
              <>
                <FaPaperPlane /> Gửi
              </>
            )}
          </button>
        </div>
        <p className="chatbot-disclaimer">
          Trợ lý AI có thể trả lời các câu hỏi về học tập. Hãy đặt câu hỏi rõ ràng để nhận được câu
          trả lời chính xác nhất.
        </p>
      </div>
    </div>
  );
}

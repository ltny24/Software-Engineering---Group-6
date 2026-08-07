// ============================================================
// AIChatbotPage — AI Academic Chatbot with Gemini streaming
// All questions go to Gemini; Gemini decides what to answer.
// Course questions answered via RAG (courses.json).
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa6';
import { useChatbot } from '../../components/chatbot/ChatbotContext';
import { askGeminiStream } from '../../services/geminiService';
import type { ChatMessage } from '../../types/chatbot.types';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import QuickActionChips from '../../components/chatbot/QuickActionChips';
import './AIChatbotPage.css';

const WELCOME_TEXT = `Xin chào! Tôi là trợ lý học tập AI của HCMUS. Tôi có thể giúp bạn:

• Tư vấn môn học — gợi ý môn phù hợp cho học kỳ tới
• Theo dõi tốt nghiệp — kiểm tra tiến độ học tập
• Giải thích môn học — nội dung, điều kiện, ứng dụng
• Học phí & điểm số — thông tin thanh toán, GPA
• Chính sách học vụ — quy định, thủ tục

Hãy hỏi tôi bất cứ điều gì về việc học tập tại HCMUS nhé!`;

export default function AIChatbotPage() {
  const { messages, setMessages } = useChatbot();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        await askGeminiStream(text, history, (fullText) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
          );
        });
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

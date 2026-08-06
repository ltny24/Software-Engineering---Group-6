// ============================================================
// AIChatbotPage — AI Academic Chatbot with Gemini + local fallback
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaRotateRight, FaPaperPlane } from 'react-icons/fa6';
import { useChatbot } from '../../components/chatbot/ChatbotContext';
import { askGemini } from '../../services/geminiService';
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

// ── Local responses for common queries ──
function getLocalResponse(message: string, _history: ChatMessage[]): string | null {
  const lower = message.toLowerCase();

  if (
    lower.includes('lộ trình') ||
    (lower.includes('học') && (lower.includes('kỳ') || lower.includes('kì')))
  ) {
    return `📚 **Lộ trình học tập đề xuất:**\n\n**Học kỳ tới bạn nên đăng ký:**\n• Cấu trúc dữ liệu & Giải thuật (CS201) — 4 tín chỉ\n• Hệ điều hành (CS301) — 4 tín chỉ\n• Cơ sở dữ liệu nâng cao (CS302) — 3 tín chỉ\n• Toán rời rạc (MATH250) — 3 tín chỉ\n\n📊 **Tiến độ:** 96/120 tín chỉ (80%)\n⏱️ **Dự kiến:** Còn 2 học kỳ để tốt nghiệp.`;
  }

  if (lower.includes('học phí') || lower.includes('thanh toán') || lower.includes('nợ')) {
    return `📋 **Thông tin học phí:**\n\n• Tổng học phí: **15,000,000 VND**\n• Đã thanh toán: 10,000,000 VND\n• Còn nợ: **5,000,000 VND**\n• Hạn: **15/10/2023**\n\n⚠️ Vui lòng thanh toán trước hạn để tránh bị phạt.`;
  }

  if (lower.includes('điểm') || lower.includes('gpa') || lower.includes('bảng điểm')) {
    return `📊 **Kết quả học tập:**\n\n• CGPA: **3.85/4.0** — Xuất sắc\n• Tín chỉ: 96/120 (80%)\n\n📈 **Điểm gần đây:**\n• CS201 - Cấu trúc dữ liệu: A (8.5)\n• MATH230 - Đại số tuyến tính: B+ (7.8)\n• SE401 - Công nghệ phần mềm: A- (8.2)`;
  }

  if (lower.includes('tốt nghiệp') || lower.includes('ra trường') || lower.includes('graduation')) {
    return `🎓 **Tiến độ tốt nghiệp:**\n\n• Đã hoàn thành: 96/120 tín chỉ (80%)\n• Còn thiếu: 24 tín chỉ\n• Dự kiến tốt nghiệp: **Học kỳ 2, 2025**\n• Các mốc quan trọng còn lại:\n  - Thực tập tốt nghiệp (6 tín chỉ)\n  - Khóa luận tốt nghiệp (6 tín chỉ)\n  - Môn tự chọn (12 tín chỉ)\n\nBạn đang đi đúng tiến độ!`;
  }

  if (
    lower.includes('môn') &&
    (lower.includes('gợi') ||
      lower.includes('đề xuất') ||
      lower.includes('nên') ||
      lower.includes('recommend'))
  ) {
    return `📗 **CS201 - Cấu trúc dữ liệu & Giải thuật** (4 tín chỉ)\n   ✅ Đã đáp ứng điều kiện\n   📅 Thứ 2,4 — 08:00-09:30\n\n📘 **CS301 - Hệ điều hành** (4 tín chỉ)\n   ✅ Đã đáp ứng điều kiện\n   📅 Thứ 3,5 — 13:30-15:00\n\n📙 **MATH250 - Toán rời rạc** (3 tín chỉ)\n   ⚠️ Cần MATH101`;
  }

  return null; // no local match — use Gemini
}

export default function AIChatbotPage() {
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
    (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || loading) return;

      // Check school-related filter
      const filterResult = filterMessage(text);
      if (!filterResult.allowed) {
        const rejected: ChatMessage = {
          id: `rejected-${Date.now()}`,
          role: 'assistant',
          content: `Xin lỗi, ${filterResult.reason}`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, rejected]);
        setInput('');
        return;
      }

      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      // Respond after a short delay
      setTimeout(async () => {
        try {
          // Get updated messages for context
          let responseText: string;

          // Try local response first
          const local = getLocalResponse(text, []);
          if (local) {
            responseText = local;
          } else {
            // Build conversation history for Gemini
            const history = messages.map((m) => ({
              role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
              parts: [{ text: m.content }],
            }));
            responseText = await askGemini(text, history);
          }

          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMsg]);
        } catch {
          // Gemini failed — use local fallback
          const local = getLocalResponse(text, []);
          const fallback: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content:
              local ||
              `Cảm ơn câu hỏi của bạn! Tôi có thể giúp bạn với:\n\n📚 **Tư vấn môn học** — gợi ý môn phù hợp\n📊 **Tốt nghiệp** — kiểm tra tiến độ\n📖 **Giải thích môn học** — nội dung, ứng dụng\n💰 **Học phí** — thông tin thanh toán\n📝 **Điểm số** — kết quả học tập\n\nHãy thử hỏi chi tiết hơn nhé!`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, fallback]);
        } finally {
          setLoading(false);
          inputRef.current?.focus();
        }
      }, 600);
    },
    [input, loading, filterMessage, messages, setMessages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    clearMessages();
    setInput('');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: WELCOME_TEXT,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="chatbot-page">
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header__left">
          <span className="chatbot-header__icon">
            <FaRobot />
          </span>
          <div>
            <h1 className="chatbot-header__title">AI Academic Assistant</h1>
            <span className="chatbot-header__status">Online — HCMUS Academic Advisor</span>
          </div>
        </div>
        <button className="chatbot-reset-btn" onClick={handleReset}>
          <FaRotateRight /> Reset Chat
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
        <p className="chatbot-disclaimer">Tôi chỉ trả lời câu hỏi về học tập tại HCMUS.</p>
      </div>
    </div>
  );
}

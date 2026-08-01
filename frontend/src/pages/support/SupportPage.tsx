import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { sendChatMessage } from '../../services/chatbotService';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import CourseSuggestionCard from '../../components/chatbot/CourseSuggestionCard';
import GraduationRoadmapCard from '../../components/chatbot/GraduationRoadmapCard';
import QuickActionChips from '../../components/chatbot/QuickActionChips';
import FAQSearch from '../../components/faq/FAQSearch';
import type { ChatMessage, CourseSuggestion } from '../../types/chatbot.types';
import './SupportPage.css';

type TabKey = 'chatbot' | 'faq';

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

/**
 * Support page combining the AI Learning Path Chatbot and searchable FAQ library.
 * Uses tab navigation to switch between the two features.
 */
export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('chatbot');

  // Chatbot state
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      role: 'assistant',
      content:
        "Hello! 👋 I'm your MyUS Academic Assistant. I can help with:\n\n📚 **Course Recommendations** – suggest courses for your next semester\n📊 **Graduation Progress** – check your degree audit and timeline\n📝 **Academic Policies** – ask about grades, appeals, and regulations\n\nHow can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string, contextType?: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setSending(true);

      try {
        const response = await sendChatMessage({
          message: trimmed,
          contextType: contextType as
            | 'GENERAL'
            | 'COURSE_SUGGESTION'
            | 'GRADUATION_AUDIT'
            | undefined,
        });

        const aiMsg: ChatMessage = {
          id: response.responseId || nextId(),
          role: 'assistant',
          content: response.replyText,
          timestamp: response.timestamp || new Date().toISOString(),
          suggestedCourses: response.suggestedCourses,
          graduationProgress: response.graduationProgress,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        console.error('Chatbot request failed:', err);
        toast.error('Failed to get a response. Please try again.');
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleQuickAction = (prompt: string, context: string) => {
    handleSend(prompt, context);
  };

  const handleSaveToWishlist = (course: CourseSuggestion) => {
    toast.success(`"${course.courseCode} - ${course.courseName}" saved to wishlist!`);
  };

  return (
    <div className="support-page">
      {/* Tab Navigation */}
      <div className="support-page__tabs" role="tablist">
        <button
          className={`support-page__tab ${activeTab === 'chatbot' ? 'support-page__tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'chatbot'}
          onClick={() => setActiveTab('chatbot')}
        >
          🤖 AI Chatbot
        </button>
        <button
          className={`support-page__tab ${activeTab === 'faq' ? 'support-page__tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'faq'}
          onClick={() => setActiveTab('faq')}
        >
          ❓ FAQs
        </button>
      </div>

      {/* ── Chatbot Tab ── */}
      {activeTab === 'chatbot' && (
        <div className="support-page__chatbot">
          {/* Messages area */}
          <div className="support-page__messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ChatMessageBubble message={msg} />

                {/* Structured cards after AI message */}
                {msg.role === 'assistant' && msg.suggestedCourses && (
                  <div className="support-page__cards">
                    {msg.suggestedCourses.map((course) => (
                      <CourseSuggestionCard
                        key={course.courseOfferingId}
                        course={course}
                        onSave={handleSaveToWishlist}
                      />
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' && msg.graduationProgress && (
                  <div className="support-page__cards">
                    <GraduationRoadmapCard progress={msg.graduationProgress} />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Typing indicator */}
            {sending && (
              <div className="support-page__typing" aria-label="AI is typing">
                <span className="support-page__typing-dot" />
                <span className="support-page__typing-dot" />
                <span className="support-page__typing-dot" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick action chips */}
          <QuickActionChips onSelect={handleQuickAction} />

          {/* Input area */}
          <div className="support-page__input-bar">
            <textarea
              className="support-page__input"
              rows={2}
              placeholder="Ask about courses, graduation, or academic policies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              aria-label="Chat message input"
            />
            <button
              className="support-page__send-btn"
              onClick={() => handleSend(input)}
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              {sending ? '⏳' : '📤'}
            </button>
          </div>

          <p className="support-page__disclaimer">
            ℹ️ AI recommendations are for advisory purposes only. Please verify official academic
            regulations in the university course catalog.
          </p>
        </div>
      )}

      {/* ── FAQ Tab ── */}
      {activeTab === 'faq' && (
        <div className="support-page__faq-section">
          <FAQSearch />
        </div>
      )}
    </div>
  );
}

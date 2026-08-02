import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useChatbot } from '../../components/chatbot/ChatbotContext';
import ChatMessageBubble from '../../components/chatbot/ChatMessageBubble';
import CourseSuggestionCard from '../../components/chatbot/CourseSuggestionCard';
import GraduationRoadmapCard from '../../components/chatbot/GraduationRoadmapCard';
import QuickActionChips from '../../components/chatbot/QuickActionChips';
import FAQSearch from '../../components/faq/FAQSearch';
import type { CourseSuggestion } from '../../types/chatbot.types';
import './SupportPage.css';

type TabKey = 'chatbot' | 'faq';

/**
 * Support page combining the AI Learning Path Chatbot and searchable FAQ library.
 * Chat messages are persisted via ChatbotContext so they survive page navigation.
 */
export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('chatbot');

  // Chatbot state from persistent context (survives page navigation + refresh)
  const { messages, sending, send } = useChatbot();

  // Local input state (intentionally not persisted across pages)
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string, contextType?: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput('');

    try {
      await send(
        trimmed,
        contextType as 'GENERAL' | 'COURSE_SUGGESTION' | 'GRADUATION_AUDIT' | undefined
      );
    } catch (err: any) {
      console.error('Chatbot request failed:', err);
      toast.error('Failed to get a response. Please try again.');
    }
  };

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

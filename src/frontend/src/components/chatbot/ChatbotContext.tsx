import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { sendChatMessage } from '../../services/chatbotService';
import type { ChatMessage, ChatRequest } from '../../types/chatbot.types';

// ============================================================
// Chatbot Context – persistent chat state across page navigation
// ============================================================

const STORAGE_KEY = 'myus_chatbot_messages';

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

interface ChatbotContextValue {
  messages: ChatMessage[];
  sending: boolean;
  send: (text: string, contextType?: ChatRequest['contextType']) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

/** Load messages from localStorage, or return initial welcome message. */
function loadMessages(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupted storage – fall through to default
  }
  return [
    {
      id: nextId(),
      role: 'assistant',
      content:
        "Hello! 👋 I'm your MyUS Academic Assistant. I can help with:\n\n📚 **Course Recommendations** – suggest courses for your next semester\n📊 **Graduation Progress** – check your degree audit and timeline\n📝 **Academic Policies** – ask about grades, appeals, and regulations\n\nHow can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ];
}

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [sending, setSending] = useState(false);
  // Track whether this is the first hydration to avoid double-saving
  const hydrated = useRef(false);

  // Hydrate once from storage on mount (handles Strict Mode double-mount)
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      setMessages(loadMessages());
    }
  }, []);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    if (hydrated.current) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Storage full or unavailable – silently ignore
      }
    }
  }, [messages]);

  const send = useCallback(
    async (text: string, contextType?: ChatRequest['contextType']) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setSending(true);

      try {
        const response = await sendChatMessage({
          message: trimmed,
          contextType,
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
        // Remove the user message on failure so it doesn't look stuck
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        throw err; // let the caller show the toast
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  const clearMessages = useCallback(() => {
    const welcome: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      content:
        "Hello! 👋 I'm your MyUS Academic Assistant. I can help with:\n\n📚 **Course Recommendations** – suggest courses for your next semester\n📊 **Graduation Progress** – check your degree audit and timeline\n📝 **Academic Policies** – ask about grades, appeals, and regulations\n\nHow can I help you today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  }, []);

  return (
    <ChatbotContext.Provider value={{ messages, sending, send, clearMessages }}>
      {children}
    </ChatbotContext.Provider>
  );
}

/** Hook to access chatbot state anywhere in the component tree. */
export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) {
    throw new Error('useChatbot must be used within a <ChatbotProvider>');
  }
  return ctx;
}

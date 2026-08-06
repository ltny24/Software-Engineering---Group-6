// ============================================================
// ChatbotContext — persists chat history across page navigation.
// Only clears when user explicitly resets.
//
// Note: Content filtering is now handled by Gemini's system prompt
// instead of client-side keyword matching.
// ============================================================

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ChatMessage } from '../../types/chatbot.types';

// ── Types ──────────────────────────────────────────────────

interface ChatbotContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clearMessages: () => void;
  /** @deprecated Filtering is now handled by Gemini. Always returns allowed=true. */
  filterMessage: (text: string) => { allowed: boolean; reason?: string };
}

// ── Context ────────────────────────────────────────────────

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error('useChatbot must be used inside <ChatbotProvider>');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const clearMessages = useCallback(() => setMessages([]), []);

  // Gemini now handles content filtering via system prompt.
  // This always returns allowed=true — no client-side keyword check.
  const filterMessage = useCallback(
    (_text: string): { allowed: boolean; reason?: string } => {
      return { allowed: true };
    },
    [],
  );

  const value: ChatbotContextValue = {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    messages,
    setMessages,
    clearMessages,
    filterMessage,
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

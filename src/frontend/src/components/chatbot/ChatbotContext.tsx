// ============================================================
// ChatbotContext – provides chatbot state & helpers across
// the app. Stub implementation – expand when chatbot UI is
// built.
// ============================================================

import React, { createContext, useContext, type ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────

interface ChatbotContextValue {
  /** Whether the chatbot panel is currently open */
  isOpen: boolean;
  /** Toggle the chatbot panel open / closed */
  toggle: () => void;
  /** Open the chatbot panel */
  open: () => void;
  /** Close the chatbot panel */
  close: () => void;
}

// ── Context ────────────────────────────────────────────────

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

// ── Hook ───────────────────────────────────────────────────

export function useChatbot(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) {
    throw new Error('useChatbot must be used inside <ChatbotProvider>');
  }
  return ctx;
}

// ── Provider ───────────────────────────────────────────────

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const value: ChatbotContextValue = {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

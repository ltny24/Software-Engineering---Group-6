// ============================================================
// ChatbotContext – persists chat history across page navigation.
// Only clears when user explicitly resets.
// ============================================================

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ChatMessage } from '../../types/chatbot.types';

// ── School-related keywords for filtering ──────────────────

const SCHOOL_KEYWORDS = [
  'course',
  'courses',
  'class',
  'classes',
  'subject',
  'subjects',
  'semester',
  'term',
  'credit',
  'credits',
  'gpa',
  'grade',
  'grades',
  'exam',
  'exams',
  'timetable',
  'schedule',
  'registration',
  'register',
  'tuition',
  'fee',
  'fees',
  'payment',
  'scholarship',
  'major',
  'degree',
  'graduation',
  'graduate',
  'prerequisite',
  'professor',
  'lecturer',
  'teacher',
  'instructor',
  'appeal',
  'transcript',
  'academic',
  'study',
  'learning',
  'university',
  'college',
  'campus',
  'student',
  'students',
  'homework',
  'assignment',
  'quiz',
  'test',
  'midterm',
  'final',
  'curriculum',
  'syllabus',
  'program',
  'department',
  'faculty',
  'deadline',
  'enrollment',
  'enroll',
  'drop',
  'withdraw',
  'laboratory',
  'lab',
  'lecture',
  'tutorial',
  'seminar',
  'textbook',
  'library',
  'advisor',
  'advising',
  'bachelor',
  'master',
  'doctorate',
  'diploma',
];

function isSchoolRelated(message: string): boolean {
  const lower = message.toLowerCase().trim();
  // Allow very short greetings / thanks
  const shortPhrases = [
    'hi',
    'hello',
    'hey',
    'thanks',
    'thank you',
    'help',
    'ok',
    'okay',
    'yes',
    'no',
  ];
  if (shortPhrases.includes(lower)) return true;

  return SCHOOL_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── Types ──────────────────────────────────────────────────

interface ChatbotContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clearMessages: () => void;
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

  const filterMessage = useCallback((text: string): { allowed: boolean; reason?: string } => {
    if (isSchoolRelated(text)) return { allowed: true };
    return {
      allowed: false,
      reason:
        'I can only help with university-related questions — courses, grades, tuition, registration, academic policies, and similar topics. Please ask me something about your studies at HCMUS!',
    };
  }, []);

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

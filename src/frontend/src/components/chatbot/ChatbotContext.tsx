// ============================================================
// ChatbotContext – persists chat history across page navigation.
// Only clears when user explicitly resets.
// ============================================================

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ChatMessage } from '../../types/chatbot.types';

// ── School-related keywords for filtering ──────────────────

const SCHOOL_KEYWORDS = [
  // English
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
  // Vietnamese
  'môn',
  'môn học',
  'khóa học',
  'lớp',
  'lớp học',
  'học kỳ',
  'học kì',
  'tín chỉ',
  'điểm',
  'bảng điểm',
  'thi',
  'bài thi',
  'kiểm tra',
  'bài tập',
  'thời khóa biểu',
  'lịch học',
  'đăng ký',
  'đăng kí',
  'ghi danh',
  'học phí',
  'thanh toán',
  'học bổng',
  'ngành',
  'chuyên ngành',
  'tốt nghiệp',
  'bằng cấp',
  'cử nhân',
  'thạc sĩ',
  'tiến sĩ',
  'giáo sư',
  'giảng viên',
  'sinh viên',
  'cố vấn',
  'cố vấn học tập',
  'khiếu nại',
  'điểm số',
  'lộ trình',
  'chương trình',
  'giáo trình',
  'thư viện',
  'khoa',
  'phòng ban',
  'hạn chót',
  'hủy',
  'hủy đăng ký',
  'rút',
  'phòng lab',
  'phòng thí nghiệm',
  'bài giảng',
  'hội thảo',
  'sách',
  'cố vấn',
  'đại học',
  'cao đẳng',
  'trường',
  'học tập',
  'học',
  'hỏi',
  'giúp',
  'tư vấn',
  'hướng dẫn',
  // Course explanation & details
  'giải thích',
  'mô tả',
  'nội dung',
  'học phần',
  'môn nào',
  'là gì',
  'như thế nào',
  'làm sao',
  'cách',
  'phương pháp',
  'ứng dụng',
  'thực hành',
  'lý thuyết',
  'bài giảng',
  'đề cương',
  'kiến thức',
  'kỹ năng',
  'cơ bản',
  'nâng cao',
  'chuyên sâu',
  'cấu trúc dữ liệu',
  'giải thuật',
  'lập trình',
  'mạng máy tính',
  'trí tuệ nhân tạo',
  'machine learning',
  'deep learning',
  'hệ điều hành',
  'cơ sở dữ liệu',
  'toán',
  'xác suất',
  'thống kê',
  'đồ án',
  'thực tập',
  'khóa luận',
  'nghiên cứu',
  'dự án',
  'học bổng',
  'điều kiện',
  'yêu cầu',
  'bắt buộc',
  'tự chọn',
];

function isSchoolRelated(message: string): boolean {
  const lower = message.toLowerCase().trim();
  // Allow greetings / thanks in both EN and VN
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
    'chào',
    'xin chào',
    'cảm ơn',
    'cám ơn',
    'giúp',
    'giúp tôi',
    'cho tôi',
    'cho mình',
    'làm ơn',
  ];
  if (shortPhrases.some((p) => lower.includes(p))) return true;

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
        'Tôi chỉ có thể trả lời các câu hỏi liên quan đến học tập tại HCMUS — môn học, điểm số, học phí, đăng ký, quy định học vụ. Vui lòng hỏi về việc học tập của bạn nhé!',
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

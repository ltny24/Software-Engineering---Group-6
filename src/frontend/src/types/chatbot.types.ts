// ============================================================
// MyUS AI Chatbot – TypeScript Type Definitions
// ============================================================

export interface CourseSuggestion {
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisiteCleared: boolean;
  reasonForRecommendation: string;
  prerequisiteStatus: 'CLEARED' | 'MISSING' | 'WAIVED';
}

export interface GraduationProgress {
  totalRequiredCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedSemestersLeft: number;
  completionPercentage: number;
  criticalMilestonesPending: string[];
  completedMilestones: string[];
}

export type ContextType = 'GENERAL' | 'COURSE_SUGGESTION' | 'GRADUATION_AUDIT';

export interface ChatRequest {
  message: string;
  contextType: ContextType;
}

export interface ChatResponse {
  responseId: string;
  replyText: string;
  timestamp: string;
  suggestedCourses?: CourseSuggestion[];
  graduationProgress?: GraduationProgress;
  intent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  courses?: CourseSuggestion[];
  progress?: GraduationProgress;
}

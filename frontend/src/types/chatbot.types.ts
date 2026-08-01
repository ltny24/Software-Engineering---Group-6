/**
 * TypeScript interfaces for the AI Chatbot feature.
 * Mirrors backend DTOs in myus.dto package.
 */

/** A single chat message in the conversation. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedCourses?: CourseSuggestion[];
  graduationProgress?: GraduationProgress;
}

/** Request payload for sending a chat message. */
export interface ChatRequest {
  message: string;
  contextType?: 'GENERAL' | 'COURSE_SUGGESTION' | 'GRADUATION_AUDIT';
}

/** Response from the chatbot API. */
export interface ChatResponse {
  responseId: string;
  replyText: string;
  timestamp: string;
  suggestedCourses?: CourseSuggestion[];
  graduationProgress?: GraduationProgress;
}

/** A course recommendation from the chatbot. */
export interface CourseSuggestion {
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisiteCleared: boolean;
  reasonForRecommendation: string;
  schedule: string;
  instructor: string;
}

/** Graduation progress / degree audit summary. */
export interface GraduationProgress {
  totalRequiredCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedSemestersLeft: number;
  completionPercentage: number;
  criticalMilestonesPending: string[];
  estimatedGraduationDate: string;
}

/** FAQ article from the knowledge base. */
export interface FAQArticle {
  faqId: number;
  question: string;
  answer: string;
  category: string;
  tags: string;
  updatedAt: string;
}

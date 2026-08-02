import axiosInstance from '../api/axiosInstance';
import type {
  ChatRequest,
  ChatResponse,
  CourseSuggestion,
  GraduationProgress,
  FAQArticle,
} from '../types/chatbot.types';

// ============================================================
// Chatbot Service – wraps /api/v1/chatbot and /api/v1/faq
// ============================================================

/** POST /api/v1/chatbot/chat – send a message and get AI response. */
export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await axiosInstance.post<ChatResponse>('/api/v1/chatbot/chat', payload);
  return data;
}

/** GET /api/v1/chatbot/recommendations – fetch course recommendations. */
export async function getCourseRecommendations(): Promise<CourseSuggestion[]> {
  const { data } = await axiosInstance.get<CourseSuggestion[]>('/api/v1/chatbot/recommendations');
  return data;
}

/** GET /api/v1/chatbot/progress – fetch graduation progress. */
export async function getGraduationProgress(): Promise<GraduationProgress> {
  const { data } = await axiosInstance.get<GraduationProgress>('/api/v1/chatbot/progress');
  return data;
}

/** GET /api/v1/faq – fetch FAQ articles, optionally with search and category. */
export async function getFAQs(params?: {
  search?: string;
  category?: string;
}): Promise<FAQArticle[]> {
  const { data } = await axiosInstance.get<FAQArticle[]>('/api/v1/faq', {
    params,
  });
  return data;
}

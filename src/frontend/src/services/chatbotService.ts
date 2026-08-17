// ============================================================
// AI Chatbot API Service
// ============================================================

import axiosInstance from '../api/axiosInstance';
import type {
  ChatRequest,
  ChatResponse,
  CourseSuggestion,
  GraduationProgress,
} from '../types/chatbot.types';

const BASE = '/api/v1/chatbot';

/**
 * Send a chat message and receive an AI-generated response.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const { data } = await axiosInstance.post<ChatResponse>(`${BASE}/chat`, request);
  return data;
}

/**
 * Retrieve recommended courses for the next semester.
 */
export async function getCourseRecommendations(): Promise<CourseSuggestion[]> {
  const { data } = await axiosInstance.get<CourseSuggestion[]>(`${BASE}/recommendations`);
  return data;
}

/**
 * Retrieve degree audit and graduation projection.
 */
export async function getGraduationProgress(creditsPerTerm?: number): Promise<GraduationProgress> {
  const params = creditsPerTerm ? { creditsPerTerm } : {};
  const { data } = await axiosInstance.get<GraduationProgress>(`${BASE}/progress`, { params });
  return data;
}

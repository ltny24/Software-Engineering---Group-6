import axiosInstance from '../api/axiosInstance';
import type { FAQArticle, PagedResponse } from '../types';

// ============================================================
// FAQ Service – wraps /api/faq (UC10 centralized FAQ library)
// ============================================================

/** GET /api/faq/categories – distinct FAQ categories. */
export async function getFaqCategories(): Promise<string[]> {
  const { data } = await axiosInstance.get<string[]>('/api/faq/categories');
  return data;
}

/** GET /api/faq – search/browse FAQ entries with optional keyword & category filters. */
export async function searchFaqs(params?: {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<PagedResponse<FAQArticle>> {
  const { data } = await axiosInstance.get<PagedResponse<FAQArticle>>('/api/faq', { params });
  return data;
}

/** GET /api/faq/popular – most helpful FAQ entries (suggested when search yields no results). */
export async function getPopularFaqs(limit: number = 5): Promise<FAQArticle[]> {
  const { data } = await axiosInstance.get<FAQArticle[]>('/api/faq/popular', { params: { limit } });
  return data;
}

/** GET /api/faq/{id} – full answer detail, including related questions. */
export async function getFaqById(faqId: string | number): Promise<FAQArticle> {
  const { data } = await axiosInstance.get<FAQArticle>(`/api/faq/${faqId}`);
  return data;
}

/** POST /api/faq/{id}/feedback – rate an answer "Helpful" / "Not Helpful". */
export async function submitFaqFeedback(
  faqId: string | number,
  helpful: boolean
): Promise<FAQArticle> {
  const { data } = await axiosInstance.post<FAQArticle>(`/api/faq/${faqId}/feedback`, { helpful });
  return data;
}

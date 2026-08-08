import api from './api';

export interface AdminAppealResponse {
  appealId: number;
  studentId: number;
  studentUsername: string;
  studentName: string;
  gradeId: number;
  courseCode: string;
  courseName: string;
  gradeValue: string;
  submittedAt: string;
  status: string;
  appealReason: string;
  supportingDocumentUrl?: string;
  reviewerComments?: string;
  deadline?: string;
  resolvedAt?: string;
  resolutionCode?: string;
}

export interface AppealReviewRequest {
  status: string;
  reviewerComments?: string;
  deadline?: string;
}

export const adminAppealService = {
  getAllAppeals: async (statusFilter?: string): Promise<AdminAppealResponse[]> => {
    const params = statusFilter && statusFilter !== 'All' ? { status: statusFilter } : {};
    const res = await api.get<AdminAppealResponse[]>('/api/admin/appeals', { params });
    return res;
  },

  getAppealById: async (appealId: string | number): Promise<AdminAppealResponse> => {
    const res = await api.get<AdminAppealResponse>(`/api/admin/appeals/${appealId}`);
    return res;
  },

  reviewAppeal: async (
    appealId: string | number,
    request: AppealReviewRequest
  ): Promise<AdminAppealResponse> => {
    const res = await api.put<AdminAppealResponse>(
      `/api/admin/appeals/${appealId}/review`,
      request
    );
    return res;
  },
};

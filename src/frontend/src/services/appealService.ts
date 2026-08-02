import axiosInstance from '../api/axiosInstance';

// ============================================================
// Appeal Service – wraps /api/appeals
// ============================================================

/** Response DTO matching backend AppealResponse.java */
export interface AppealResponse {
  appealId: number;
  studentId: number;
  studentName: string;
  gradeId: number;
  courseCode: string;
  courseName: string;
  gradeValue: string;
  submittedAt: string;
  status: string;
  appealReason: string;
  supportingDocumentUrl: string | null;
  reviewerComments: string | null;
  deadline: string | null;
  resolvedAt: string | null;
  resolutionCode: string | null;
}

/** Request body for submitting a new appeal */
export interface AppealSubmitRequest {
  gradeId: number;
  appealReason: string;
  supportingDocumentUrl?: string;
}

/** GET /api/appeals/me – list my appeals */
export async function getMyAppeals(): Promise<AppealResponse[]> {
  const { data } = await axiosInstance.get<AppealResponse[]>('/api/appeals/me');
  return data;
}

/** GET /api/appeals/me/{appealId} – get single appeal detail */
export async function getAppealById(appealId: number): Promise<AppealResponse> {
  const { data } = await axiosInstance.get<AppealResponse>(`/api/appeals/me/${appealId}`);
  return data;
}

/** POST /api/appeals – submit a new grade appeal */
export async function submitAppeal(request: AppealSubmitRequest): Promise<AppealResponse> {
  const { data } = await axiosInstance.post<AppealResponse>('/api/appeals', request);
  return data;
}

/** PUT /api/appeals/me/{appealId}/withdraw – withdraw a submitted appeal */
export async function withdrawAppeal(appealId: number): Promise<AppealResponse> {
  const { data } = await axiosInstance.put<AppealResponse>(`/api/appeals/me/${appealId}/withdraw`);
  return data;
}

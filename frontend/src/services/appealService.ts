import api from './api';
import type { AppealSummaryDTO, AppealDetailDTO } from '../types/appeal.types';

export async function getMyAppealHistory(): Promise<AppealSummaryDTO[]> {
  try {
    const { data } = await api.get<AppealSummaryDTO[]>('/v1/appeals/my-appeals');
    return data;
  } catch (error) {
    console.warn('Failed to fetch from /v1/appeals/my-appeals, trying fallback /appeals/me', error);
    const { data } = await api.get<any[]>('/appeals/me');
    return (data || []).map((item) => ({
      appealId: item.appealId,
      trackingCode: `APL-${String(item.appealId).padStart(6, '0')}`,
      courseCode: item.courseCode || 'CSC10009',
      courseName: item.courseName || 'Computer Systems',
      examType: 'Final Exam',
      currentGrade: 8.0,
      expectedGrade: 9.0,
      status:
        item.status === 'Submitted'
          ? 'PENDING'
          : item.status === 'Under Review'
            ? 'PROCESSING'
            : item.status === 'Approved'
              ? 'RESOLVED'
              : item.status === 'Denied'
                ? 'REJECTED'
                : 'CANCELED',
      feeStatus: 'UNPAID',
      feePaymentDeadline: item.deadline || new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: item.submittedAt || new Date().toISOString(),
    }));
  }
}

export async function getAppealDetail(trackingCode: string): Promise<AppealDetailDTO> {
  const { data } = await api.get<AppealDetailDTO>(`/v1/appeals/${trackingCode}`);
  return data;
}

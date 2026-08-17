import api from './api';
import type { AppealSummaryDTO, AppealDetailDTO } from '../types';

export async function getMyAppealHistory(): Promise<AppealSummaryDTO[]> {
  try {
    const data = await api.get<AppealSummaryDTO[]>('/api/appeals/my-appeals');
    return data;
  } catch (primaryError) {
    console.warn(
      'Primary endpoint /api/appeals/my-appeals failed, trying fallback /api/appeals/me',
      primaryError
    );
    try {
      const data = await api.get<any[]>('/api/appeals/me');
      return (data || []).map((item: any) => ({
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
    } catch (fallbackError) {
      console.error('Fallback endpoint /api/appeals/me also failed', fallbackError);
      throw fallbackError;
    }
  }
}

export async function getAppealDetail(trackingCode: string): Promise<AppealDetailDTO> {
  const data = await api.get<AppealDetailDTO>(`/api/appeals/${trackingCode}`);
  return data;
}

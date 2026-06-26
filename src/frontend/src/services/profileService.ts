import axiosInstance from '../api/axiosInstance';
import type { StudentProfile } from '../types';

// ============================================================
// Profile Service – wraps /api/students/me endpoints
// ============================================================

/** GET /api/students/me – fetch the authenticated student's profile. */
export async function getMyProfile(): Promise<StudentProfile> {
  const { data } = await axiosInstance.get<StudentProfile>('/api/students/me');
  return data;
}

/** PUT /api/students/me – update the authenticated student's profile. */
export async function updateMyProfile(
  updates: Partial<StudentProfile>
): Promise<StudentProfile> {
  const { data } = await axiosInstance.put<StudentProfile>(
    '/api/students/me',
    updates
  );
  return data;
}

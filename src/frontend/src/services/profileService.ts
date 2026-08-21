import axiosInstance from '../api/axiosInstance';
import type { StudentProfile } from '../types';

// ============================================================
// Profile Service – wraps /api/students/me endpoints
// ============================================================

/** GET /api/v1/profile – fetch the authenticated student's profile. */
export async function getMyProfile(): Promise<StudentProfile> {
  const { data } = await axiosInstance.get<StudentProfile>('/api/v1/profile');
  return data;
}

/** PUT /api/v1/profile – update the authenticated student's profile. */
export async function updateMyProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  const { data } = await axiosInstance.put<StudentProfile>('/api/v1/profile', updates);
  return data;
}

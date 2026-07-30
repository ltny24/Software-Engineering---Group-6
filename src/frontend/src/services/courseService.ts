import axiosInstance from '../api/axiosInstance';
import type { CourseOffering, CourseRegistration, PagedResponse } from '../types';

// ============================================================
// Course Service – wraps /api/courses and /api/registrations
// ============================================================

/** GET /api/courses – list available courses with optional filters. */
export async function getCourses(params?: {
  page?: number;
  size?: number;
  search?: string;
  department?: string;
  term?: string;
}): Promise<PagedResponse<CourseOffering>> {
  const response = await axiosInstance.get<PagedResponse<CourseOffering>>('/api/courses', {
    params,
  });
  return response.data;
}

/** GET /api/registrations/me – fetch the student's enrolled courses / timetable. */
export async function getMyRegistrations(): Promise<CourseRegistration[]> {
  const response = await axiosInstance.get<CourseRegistration[]>('/api/registrations/me');
  return response.data;
}

/** POST /api/registrations – register for a course offering. */
export async function registerCourse(offeringId: string): Promise<CourseRegistration> {
  const response = await axiosInstance.post<CourseRegistration>('/api/registrations', {
    offeringId,
  });
  return response.data;
}

export async function dropRegistration(registrationId: string): Promise<void> {
  await axiosInstance.delete(`/api/registrations/${registrationId}`);
}

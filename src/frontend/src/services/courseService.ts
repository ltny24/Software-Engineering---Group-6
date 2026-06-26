import axiosInstance from '../api/axiosInstance';
import type { Course, CourseOffering, CourseRegistration, PagedResponse } from '../types';

// ============================================================
// Course Service – wraps /api/courses and /api/registrations
// ============================================================

/** GET /api/courses – list available courses with optional filters. */
export async function getCourses(params?: {
  page?: number;
  size?: number;
  search?: string;
  department?: string;
}): Promise<PagedResponse<CourseOffering>> {
  const { data } = await axiosInstance.get<PagedResponse<CourseOffering>>(
    '/api/courses',
    { params }
  );
  return data;
}

/** GET /api/registrations/me – fetch the student's enrolled courses / timetable. */
export async function getMyRegistrations(): Promise<CourseRegistration[]> {
  const { data } = await axiosInstance.get<CourseRegistration[]>(
    '/api/registrations/me'
  );
  return data;
}

/** POST /api/registrations – register for a course offering. */
export async function registerCourse(
  offeringId: string
): Promise<CourseRegistration> {
  const { data } = await axiosInstance.post<CourseRegistration>(
    '/api/registrations',
    { offeringId }
  );
  return data;
}

import api from './api';

export interface StudentProfileData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  studentType?: string;
  major?: string;
  enrollmentStatus?: string;
  registrationStatus?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SearchStudentsParams {
  keyword?: string;
  major?: string;
  enrollmentStatus?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const searchStudents = async (
  params: SearchStudentsParams
): Promise<PaginatedResponse<StudentProfileData>> => {
  const queryParams = new URLSearchParams();
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.major) queryParams.append('major', params.major);
  if (params.enrollmentStatus) queryParams.append('enrollmentStatus', params.enrollmentStatus);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDir) queryParams.append('sortDir', params.sortDir);

  return api.get<PaginatedResponse<StudentProfileData>>(
    `/api/admin/students/search?${queryParams.toString()}`
  );
};

export const getStudentDetailsAdmin = async (id: number): Promise<StudentProfileData> => {
  return api.get<StudentProfileData>(`/api/admin/students/${id}`);
};

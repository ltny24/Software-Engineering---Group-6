import api from './api';

// ============================================================
// Admin Bulk Import (FR-008 / UC-11a) – Student & Course uploads
// ============================================================

// ----- Student -----

export interface StudentImportRow {
  username: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  studentType?: string;
  major?: string;
  enrollmentStatus?: string;
  registrationStatus?: string;
}

export interface StudentImportIssue {
  rowNumber: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  errors: string[];
}

export interface StudentImportPreviewResponse {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  validRows: StudentImportRow[];
  invalidRows: StudentImportIssue[];
}

export interface StudentImportResponse {
  added: number;
  updated: number;
  skipped: number;
  messages: string[];
}

// ----- Course -----

export interface CourseImportRow {
  courseCode: string;
  courseName: string;
  description?: string;
  credits?: string;
  prerequisites?: string;
  department?: string;
  semester?: string;
  capacity?: string;
}

export interface CourseImportIssue {
  rowNumber: number;
  courseCode?: string;
  courseName?: string;
  errors: string[];
}

export interface CourseImportPreviewResponse {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  validRows: CourseImportRow[];
  invalidRows: CourseImportIssue[];
}

export interface CourseImportResponse {
  added: number;
  updated: number;
  skipped: number;
  messages: string[];
}

export const bulkImportService = {
  previewStudents: async (file: File): Promise<StudentImportPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<StudentImportPreviewResponse>(
      '/api/admin/import/students/preview',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res;
  },

  confirmStudents: async (
    rows: StudentImportRow[],
    updateExisting: boolean
  ): Promise<StudentImportResponse> => {
    const res = await api.post<StudentImportResponse>('/api/admin/import/students/confirm', {
      rows,
      updateExisting,
    });
    return res;
  },

  previewCourses: async (file: File): Promise<CourseImportPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<CourseImportPreviewResponse>(
      '/api/admin/import/courses/preview',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res;
  },

  confirmCourses: async (rows: CourseImportRow[]): Promise<CourseImportResponse> => {
    const res = await api.post<CourseImportResponse>('/api/admin/import/courses/confirm', {
      rows,
    });
    return res;
  },
};

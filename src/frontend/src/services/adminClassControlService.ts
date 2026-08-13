import api from './api';
import type { CourseOffering, PagedResponse } from '../types';

// ============================================================
// Admin Class Control (FG7) – Master Schedule Upload + Class Transfer
// ============================================================

// ----- Master Schedule Upload -----

export interface ScheduleRow {
  courseCode: string;
  section: string;
  term: string;
  schedule: string;
  instructor?: string;
  location?: string;
  room?: string;
}

export interface ScheduleRowIssue extends ScheduleRow {
  rowNumber: number;
  errors: string[];
}

export interface SchedulePreviewResponse {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  validRows: ScheduleRow[];
  invalidRows: ScheduleRowIssue[];
}

export interface ScheduleImportResponse {
  added: number;
  skipped: number;
  messages: string[];
}

// ----- Class Transfer -----

export interface RosterStudent {
  studentId: number;
  username: string;
  fullName: string;
}

export interface OfferingRosterResponse {
  offering: CourseOffering;
  students: RosterStudent[];
  targets: CourseOffering[];
}

export interface ClassTransferRequestPayload {
  studentIds: number[];
  fromOfferingId: number;
  toOfferingId: number;
  justification?: string;
  overrideCapacity: boolean;
  overrideConflict: boolean;
}

export interface TransferFailure {
  studentId: number;
  studentName: string;
  reason: string;
}

export interface ClassTransferResponse {
  transferredCount: number;
  failed: TransferFailure[];
}

export interface ClassTransferRecord {
  transferId: number;
  studentId: number;
  studentUsername: string;
  studentName: string;
  fromOfferingId: number;
  fromSection: string;
  toOfferingId: number;
  toSection: string;
  courseCode: string;
  courseName: string;
  requestDate: string;
  status: string;
  reviewerComments?: string;
}

export const adminClassControlService = {
  // --- Schedule upload ---
  previewScheduleUpload: async (file: File): Promise<SchedulePreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<SchedulePreviewResponse>(
      '/api/admin/schedule-upload/preview',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res;
  },

  confirmScheduleImport: async (rows: ScheduleRow[]): Promise<ScheduleImportResponse> => {
    const res = await api.post<ScheduleImportResponse>('/api/admin/schedule-upload/import', {
      rows,
    });
    return res;
  },

  // --- Class transfer ---
  listOfferings: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    department?: string;
    term?: string;
  }): Promise<PagedResponse<CourseOffering>> => {
    const res = await api.get<PagedResponse<CourseOffering>>('/api/admin/transfers/offerings', {
      params,
    });
    return res;
  },

  getRoster: async (offeringId: number): Promise<OfferingRosterResponse> => {
    const res = await api.get<OfferingRosterResponse>(
      `/api/admin/transfers/offerings/${offeringId}/roster`
    );
    return res;
  },

  getTransferHistory: async (): Promise<ClassTransferRecord[]> => {
    const res = await api.get<ClassTransferRecord[]>('/api/admin/transfers/history');
    return res;
  },

  performTransfer: async (payload: ClassTransferRequestPayload): Promise<ClassTransferResponse> => {
    const res = await api.post<ClassTransferResponse>('/api/admin/transfers', payload);
    return res;
  },
};

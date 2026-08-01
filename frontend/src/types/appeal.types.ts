export type AppealStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED' | 'CANCELED';
export type FeeStatus = 'UNPAID' | 'PAID' | 'EXEMPTED';

export interface AppealSummaryDTO {
  appealId: number;
  trackingCode: string;
  courseCode: string;
  courseName: string;
  examType: string;
  currentGrade: number;
  expectedGrade: number;
  status: AppealStatus;
  feeStatus: FeeStatus;
  feePaymentDeadline: string;
  createdAt: string;
}

export interface AppealDetailDTO extends AppealSummaryDTO {
  reason: string;
  reviewerComments?: string;
  updatedGrade?: number | null;
  resolvedAt?: string | null;
  attachments: string[];
}

export interface AppealConfigResponse {
  isOpen?: boolean;
  allowSubmission?: boolean;
  submissionDeadline?: string;
  deadline?: string;
  message?: string;
  warning?: string;
}

export interface AppealRecord {
  appealId?: number;
  courseCode?: string;
  courseName?: string;
  gradeId?: number;
  gradeValue?: string;
  status: string;
  appealReason?: string;
  reviewerComments?: string;
  submittedAt?: string;
  deadline?: string;
  resolvedAt?: string;
  supportingDocumentUrl?: string;
}

export interface AppealFormValues {
  gradeId: string;
  currentGrade: string;
  reason: string;
}

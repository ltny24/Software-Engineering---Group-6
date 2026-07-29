export interface Appeal {
    id: string;
    course: string;
    currentGrade: number;
    reason: string;
    fileUpload?: File;
    status: AppealStatus;
}

export type AppealStatus = 'Pending' | 'Processing' | 'Rejected' | 'Approved';

export interface AppealFormValues {
    course: string;
    currentGrade: number;
    reason: string;
    fileUpload?: File;
}

export interface AppealConfig {
    submissionDeadline: Date;
    maxFileSize: number; // in bytes
    allowedFileTypes: string[];
}
// ============================================================
// MyUS University Portal – Shared TypeScript Types
// ============================================================

// ----- Auth -----
export type UserRole = 'STUDENT' | 'ADMIN';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

// ----- Student Profile -----
export interface StudentProfile {
  studentId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  studentType: string;
  major: string;
  enrollmentStatus: string;
  registrationStatus: string;
}

// ----- Course & Enrollment -----
export interface Course {
  courseId: string;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  prerequisites: string[];
  department: string;
  semester: string;
  capacity: number;
}

export interface CourseOffering {
  offeringId: string;
  courseId: string;
  section: string;
  term: string;
  schedule: string;
  instructor: string;
  location: string;
  room: string;
  course?: Course;
}

export interface CourseRegistration {
  registrationId: string;
  studentId: string;
  offeringId: string;
  status: 'REQUESTED' | 'ENROLLED' | 'WAITLISTED' | 'DROPPED';
  registeredAt: string;
  offering?: CourseOffering;
}

// ----- Grades & Academic Records -----
export interface Grade {
  gradeId: string;
  registrationId: string;
  studentId: string;
  courseId: string;
  gradeValue: string;
  gradePoint: number;
  term: string;
  gpaImpact: number;
}

export interface AcademicRecord {
  recordId: string;
  studentId: string;
  term: string;
  cumulativeGPA: number;
  earnedCredits: number;
}

// ----- Tuition -----
export interface TuitionAccount {
  accountId: string;
  studentId: string;
  term: string;
  totalCharges: number;
  payments: number;
  balance: number;
  scholarshipAmount: number;
  financialHold: boolean;
}

// ----- Grade Appeal -----
export type AppealStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'WITHDRAWN';

export interface Appeal {
  appealId: string;
  studentId: string;
  gradeId: string;
  submittedAt: string;
  status: AppealStatus;
  appealReason: string;
  supportingDocumentUrl?: string;
  reviewerComments?: string;
  deadline: string;
  resolvedAt?: string;
}

// ----- FAQ -----
export interface FAQArticle {
  faqId: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  updatedAt: string;
  published: boolean;
}

// ----- Class Transfer -----
export type TransferStatus = 'REQUESTED' | 'REVIEWING' | 'APPROVED' | 'DENIED';

export interface ClassTransferRequest {
  transferId: string;
  studentId: string;
  fromOfferingId: string;
  toOfferingId: string;
  requestDate: string;
  status: TransferStatus;
  reviewerComments?: string;
}

// ----- Chatbot -----
export interface ChatbotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatbotRecommendation {
  courses: string[];
  guidance: string;
}

// ----- API Generic Response -----
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

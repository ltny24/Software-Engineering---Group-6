# Grade Appeal Feature Implementation Plan
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý

## Objective
Create a streamlined, digital grade appeal overview and submission workflow that enables students to formally request exam grade re-evaluations, attach supporting proof documents, and track real-time processing status with office fee payment deadlines, designed for seamless full-stack integration (Frontend, Backend, and Database).

## Technical Approach
- Build the appeal submission form and status tracking dashboard as React functional components using `useState`, `useEffect`, and custom form validation.
- Implement a client-side file upload dropzone (`FileDropzone`) with instant validation for file sizes (< 5MB) and allowed formats (.pdf, .jpg, .png).
- Provide mock eligible courses and historical appeal records to render immediately without backend dependencies during the UI prototyping phase.
- Calculate business-day fee payment deadlines (+5 business days) dynamically upon submission confirmation.
- Structure Axios API services to handle both JSON metadata and binary file attachments using `multipart/form-data`.
- Design Spring Boot REST controllers and JPA entities to validate submission windows, handle file storage, and persist records securely in SQL Server.

## Frontend & Backend Responsibility Split
- **Frontend (React / TypeScript):**
  - Manage form state, UI error display, and step-by-step submission navigation.
  - Perform instant client-side validation (preventing file uploads over 5MB and ensuring expected grade is higher than current grade) before sending network requests.
  - Render color-coded status badges and dynamic countdown timers for office fee payment deadlines.
  - Maintain a mock data layer during the prototyping phase to simulate API latency and responses.
- **Backend (Spring Boot / Java):**
  - Enforce role-based security (`ROLE_STUDENT` via JWT) and verify student enrollment ownership for the requested course.
  - Perform server-side validation of the 14-day appeal submission window from the official grade release timestamp.
  - Handle binary file storage securely (local disk or cloud storage) and save file metadata to the `appeal_attachments` table.
  - Generate unique tracking codes (e.g., `GA-2026-0891`) and compute exact fee payment timestamps (+5 business days, excluding weekends and holidays).

## MVP Scope & Architecture Framing
- **Core Focus:** This implementation focuses strictly on the Full-Stack execution of the Core Appeal Submission Flow (Eligible course selection, grade auto-population, reason input, supporting document attachment, and visual tracking dashboard).
- **Out of Scope for this Sprint:** Advanced features mentioned in the vision document such as automated plagiarism/AI verification on uploaded proofs, direct live chat with grading faculty, and online payment gateway integration (VNPay/MoMo) are descoped for this sprint's prototype. This strategy ensures a robust, transaction-safe database and backend integration for core appeal routing and manual office fee payment enforcement first.

## UI Prototype Flow
1. Student lands on the academic grade dashboard and clicks "Request Appeal" on an eligible course (published within the last 14 days).
2. The system opens the appeal submission form with pre-populated course details and the current published grade.
3. Student selects the exam type, inputs their expected grade (must be higher than current), writes a detailed reason, and attaches up to 3 proof files.
4. Student clicks submit, triggering a confirmation modal that displays the mandatory office fee payment policy.
5. Student confirms, and the system redirects to the Status Dashboard showing the newly submitted appeal as PENDING along with the exact fee payment deadline.

## Visual Design Guidelines
- Light page background: `#f8fafc`.
- Primary text color: `#1e293b`.
- Secondary text color: `#64748b`.
- Use inline styles or standard utility classes only for the prototype phase.
- Status badges must use distinct color coding for visual hierarchy (Yellow for PENDING, Blue for PROCESSING, and Green for RESOLVED).
- Detailed table rows must alternate background colors to enhance scannability and clearly highlight impending fee payment deadlines in bold text.

## Data Model
```ts
interface EligibleCourseDTO {
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  examType: string;
  currentGrade: number;
  gradeReleasedDate: string;
  deadlineDate: string;
}

interface AppealAttachmentDTO {
  attachmentId: number;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  contentType: string;
}

interface GradeAppealDTO {
  appealId: number;
  trackingCode: string;
  courseOfferingId: number;
  courseName: string;
  examType: string;
  currentGrade: number;
  expectedGrade: number;
  reason: string;
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED';
  feeStatus: 'UNPAID' | 'PAID' | 'WAIVED';
  feePaymentDeadline: string;
  adminResponse?: string;
  attachments: AppealAttachmentDTO[];
  createdAt: string;
}

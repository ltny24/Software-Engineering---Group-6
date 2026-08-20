# Data Model: MyUS University Portal System

## Key Entities

### Student
- `studentId`: unique identifier
- `firstName`, `lastName`, `middleName`
- `email`, `phone`, `address`
- `dateOfBirth`, `studentType`, `major`
- `enrollmentStatus`, `registrationStatus`
- relationship: has many `CourseRegistration`, `Grade`, `Appeal`, `TuitionAccount`, `SurveyResponse`

### Administrator
- `adminId`: unique identifier
- `username`, `email`, `role`
- `displayName`, `department`
- relationship: manages `Appeal`, `ClassTransferRequest`, `BulkImportJob`

### Course
- `courseId`: unique identifier
- `courseCode`, `courseName`, `description`
- `credits`, `prerequisites`
- `department`, `semester`, `capacity`
- relationship: has many `CourseOffering`, `CourseRegistration`, `Grade`

### CourseOffering
- `offeringId`: unique identifier
- `courseId`, `section`, `term`, `schedule`
- `instructor`, `location`, `room`
- relationship: belongs to `Course`, has many `CourseRegistration`, `ClassTransferRequest`

### CourseRegistration
- `registrationId`: unique identifier
- `studentId`, `offeringId`
- `status`, `registeredAt`
- `gradeId` relationship optional
- relationship: belongs to `Student`, `CourseOffering`

### Grade
- `gradeId`: unique identifier
- `registrationId`, `studentId`, `courseId`
- `gradeValue`, `gradePoint`
- `term`, `gpaImpact`
- relationship: belongs to `Student`, `Course`, `CourseRegistration`

### AcademicRecord
- `recordId`: unique identifier
- `studentId`, `term`, `cumulativeGPA`, `earnedCredits`
- relationship: aggregates `Grade` and `CourseRegistration`

### Appeal
- `appealId`: unique identifier
- `studentId`, `gradeId`, `submittedAt`, `status`
- `appealReason`, `supportingDocumentUrl`, `reviewerComments`
- `deadline`, `resolvedAt`, `resolutionCode`
- relationship: belongs to `Student`, optional `Administrator`

### TuitionAccount
- `accountId`: unique identifier
- `studentId`, `term`, `totalCharges`, `payments`, `balance`
- `scholarshipAmount`, `financialHold`
- relationship: belongs to `Student`

### Survey
- `surveyId`: unique identifier
- `title`, `description`, `openDate`, `closeDate`
- `status`, `targetAudience`
- relationship: has many `SurveyResponse`

### SurveyResponse
- `responseId`: unique identifier
- `surveyId`, `studentId`, `submittedAt`
- `answers` (structured JSON)
- relationship: belongs to `Student`, `Survey`

### FAQArticle
- `faqId`: unique identifier
- `question`, `answer`, `category`, `tags`
- `updatedAt`, `published`

### ClassTransferRequest
- `transferId`: unique identifier
- `studentId`, `fromOfferingId`, `toOfferingId`
- `requestDate`, `status`, `reviewerComments`
- relationship: belongs to `Student`, `CourseOffering`

### ChatbotSession
- `sessionId`: unique identifier
- `studentId`, `startedAt`, `lastActivityAt`
- `context`, `recommendations`
- relationship: belongs to `Student`

## Relationships

- Student 1..* CourseRegistration
- Student 1..* Grade
- Student 1..* Appeal
- Student 1..* TuitionAccount
- Student 1..* SurveyResponse
- Course 1..* CourseOffering
- CourseOffering 1..* CourseRegistration
- CourseRegistration optional 1 Grade
- Administrator 1..* Appeal (reviewed appeals)
- Administrator 1..* ClassTransferRequest (reviewed transfers)

## Validation Rules

- Every `CourseRegistration` must reference a valid `Student` and `CourseOffering`.
- `Appeal.deadline` must be enforced against the current academic calendar.
- `Grade.gpaImpact` must be calculated consistently from the `gradeValue`.
- `TuitionAccount.balance` must equal `totalCharges - payments - scholarshipAmount`.
- `SurveyResponse` must be submitted only while the containing `Survey` is open.
- `ClassTransferRequest` must verify the requested `toOfferingId` is available and does not conflict with the student’s existing schedule.

## State Transitions

- `Appeal.status`: Submitted → Under Review → Approved / Denied / Withdrawn
- `CourseRegistration.status`: Requested → Enrolled → Waitlisted / Dropped
- `Survey.status`: Draft → Open → Closed
- `ClassTransferRequest.status`: Requested → Reviewing → Approved / Denied

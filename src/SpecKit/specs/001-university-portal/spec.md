# MyUS University Portal System

**Feature Branch**: `[001-university-portal]`

**Created**: 2026-06-02

**Status**: Draft

**Input**: Project Name: MyUS - University Portal System

Actors:
- Student
- Administrator

Student Features:
- Update Profile
- Submit Grade Appeal
- Track Appeal Status
- Register Courses
- AI Learning Path Chatbot
- View Grades & GPA
- View Timetable
- Track Tuition Fee
- Submit Evaluation Surveys
- Access FAQs

Administrator Features:
- Bulk Import Data
- Manage Class Transfers
- Process Grade Appeals
- View Student Records

Goal:
Provide a centralized university portal that helps students manage academic activities, financial information, course registration, and support services while enabling administrators to efficiently manage student records and academic operations.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Academic Self-Service (Priority: P1)

A student uses the portal to manage their academic profile, register for classes, review grades, and track tuition information in one central place.

**Why this priority**: This user journey delivers the core student value of the portal and is the primary reason students use the system.

**Independent Test**: A student logs in, updates their profile, views their current timetable and grades, and confirms tuition balance information without administrator assistance.

**Acceptance Scenarios**:

1. **Given** a student is authenticated, **when** they open the portal, **then** they can view their profile summary, current timetable, and GPA.
2. **Given** a student selects course registration, **when** they add a valid course without conflicts, **then** the registration is accepted and the timetable updates.
3. **Given** a student views tuition information, **when** they request the current balance, **then** the portal displays tuition charges, payments, and outstanding amount.

---

### User Story 2 - Grade Appeal and Support Workflow (Priority: P1)

A student submits a grade appeal, checks appeal status, and accesses support resources such as FAQs and an AI learning guidance chatbot.

**Why this priority**: Grade appeals, support access, and transparency of outcomes are critical for student confidence and administrative responsiveness.

**Independent Test**: A student creates an appeal, verifies the status updates, and uses the chatbot or FAQ section for guidance on academic planning.

**Acceptance Scenarios**:

1. **Given** a student selects grade appeal, **when** they submit a complete appeal form, **then** the appeal is recorded and a confirmation is provided.
2. **Given** a student has a pending appeal, **when** they view the appeal status, **then** they see the current state and any administrator comments.
3. **Given** a student opens the support section, **when** they ask the AI learning path chatbot a question, **then** the system provides relevant guidance and next-step suggestions.

---

### User Story 3 - Administrator Academic Operations (Priority: P2)

An administrator imports student and course data, manages class transfer requests, processes grade appeals, and views student records to support academic workflows.

**Why this priority**: Administrator tools enable the portal to function as a complete university system and keep student data accurate.

**Independent Test**: An administrator imports a batch of records, reviews a grade appeal, and accesses a student record without relying on student-facing workflows.

**Acceptance Scenarios**:

1. **Given** an administrator is authenticated, **when** they upload a bulk data file, **then** the system imports records and reports any validation issues.
2. **Given** a student has requested a class transfer, **when** the administrator reviews the request, **then** they can approve or deny it and record the decision.
3. **Given** a grade appeal is pending, **when** the administrator processes it, **then** the appeal status updates and the student can later view the result.

---

### Edge Cases

- The student attempts course registration with a schedule conflict or a prerequisite gap.
- The student submits a grade appeal after the allowed appeal period.
- The administrator imports data containing duplicate student records or invalid course codes.
- An unauthenticated user tries to access protected student or administrator pages.
- The AI chatbot receives a request outside the supported learning path scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require authentication for all protected student and administrator portal pages.
- **FR-002**: Students MUST be able to update their personal profile and contact information.
- **FR-003**: Students MUST be able to submit a grade appeal and track its status through the portal.
- **FR-004**: Students MUST be able to register for courses, view their timetable, and see course enrollment confirmation.
- **FR-005**: Students MUST be able to view grades, GPA, and academic progress indicators.
- **FR-006**: Students MUST be able to view and track tuition fee details, payments, and outstanding balances.
- **FR-007**: Students MUST be able to access FAQs and an AI learning path chatbot for academic guidance.
- **FR-008**: Administrators MUST be able to bulk import student, course, and enrollment data.
- **FR-009**: Administrators MUST be able to manage class transfer requests and update student records accordingly.
- **FR-010**: Administrators MUST be able to process grade appeals and record status changes for student visibility.
- **FR-011**: System MUST enforce role-based authorization for Student and Administrator roles.
- **FR-012**: System MUST protect sensitive student and financial data from being exposed in APIs.
- **FR-013**: System MUST store academic, financial, and administrative data using normalized relationships and referential integrity.
- **FR-014**: Major features MUST be documented with user stories and acceptance criteria.

### Key Entities *(include if feature involves data)*

- **Student Profile**: Represents a student with personal, enrollment, and academic attributes.
- **Grade Appeal**: Represents a student request to review or challenge a grade.
- **Course Registration**: Represents a student’s selected courses, class schedule, and enrollment status.
- **Academic Record**: Represents grades, GPA, transcript details, and course history.
- **Tuition Account**: Represents charges, payments, financial holds, and outstanding balances.
- **FAQ Article**: Represents support content accessible to students.
- **Administrator**: Represents an authenticated staff user with operations rights for records and appeals.
- **Class Transfer Request**: Represents a student request to move between classes or sections.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of authenticated students can complete their primary portal tasks (profile review, course registration, grade lookup) in one session without assistance.
- **SC-002**: Students can access real-time appeal status updates and receive administrator responses for appeals within 24 hours of processing.
- **SC-003**: Administrators can import bulk records and process grade appeals with validation feedback that identifies issues in 90% of invalid uploads.
- **SC-004**: Sensitive student and financial data is never displayed to unauthorized users, with role-based access enforced for all protected pages.
- **SC-005**: Major features are documented with user stories and acceptance criteria before implementation begins.

## Assumptions

- The portal is delivered as a centralized web-based student and administrator application with secure session-based access.
- Existing student and administrator accounts will be available or provisioned during initial deployment.
- The AI learning path chatbot feature is guidance-oriented and not a substitute for academic advising.
- Mobile native apps are out of scope; the portal is delivered as a responsive web application.
- Faculty and additional staff roles beyond Student and Administrator are out of scope for the initial release.
- Bulk data import is assumed to be file-based and validated before applying changes to the database.

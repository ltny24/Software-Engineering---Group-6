# Tasks: MyUS University Portal System

**Input**: Design documents from `/specs/001-university-portal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core scaffolding for frontend, backend, and shared configuration.

- [x] T001 Create backend Spring Boot project skeleton in backend/
- [x] T002 Create React frontend project skeleton in frontend/
- [x] T003 Configure repository-level linting, formatting, and environment variables in `.vscode/`, `backend/`, and `frontend/`
- [x] T004 [P] Configure JWT authentication dependencies and environment settings in `backend/build.gradle` or `backend/pom.xml`
- [x] T005 [P] Configure frontend routing, protected route wrappers, and global layout in `frontend/src/`
- [x] T006 [P] Add initial API documentation scaffolding in `backend/src/main/resources/static/api-docs/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend and frontend infrastructure that must be complete before user story implementation begins.

- [x] T007 Setup SQL Server database schema, migration scripts, and entity definitions in `backend/src/main/resources/db/` and `backend/src/main/java/com/myus/entity/`
- [x] T008 [P] Implement JWT authentication filter and security configuration in `backend/src/main/java/com/myus/security/`
- [x] T009 [P] Implement role-based access control for Student and Administrator roles in `backend/src/main/java/com/myus/security/`
- [x] T010 [P] Create Student and Administrator identity, profile, and authorization entities in `backend/src/main/java/com/myus/entity/`
- [x] T011 [P] Add backend API exception handling and validation response middleware in `backend/src/main/java/com/myus/exception/`
- [x] T012 [P] Implement frontend authentication state, login/logout flows, and protected route components in `frontend/src/auth/`
- [x] T013 [P] Implement frontend shared data services for API calls and error handling in `frontend/src/services/`
- [x] T014 [P] Add baseline API documentation and developer guide references in `backend/README.md` and `frontend/README.md`

---

## Phase 3: User Story 1 - Student Academic Self-Service (Priority: P1) MVP

**Goal**: Enable authenticated students to view and manage their profile, register for courses, view grades and timetable, and track tuition details independently.

**Independent Test**: A student logs in, updates their profile, registers for a course, views timetable/grades, and reviews tuition balance without administrator interaction.

### Implementation for User Story 1

- [x] T015 [P] [US1] Implement student profile retrieval endpoint in `backend/src/main/java/com/myus/controller/ProfileController.java`
- [x] T016 [P] [US1] Implement student profile update service in `backend/src/main/java/com/myus/service/ProfileService.java`
- [x] T017 [US1] Implement student profile view and edit pages in `frontend/src/pages/profile/`
- [x] T018 [P] [US1] Implement course catalog browsing endpoint in `backend/src/main/java/com/myus/controller/CourseController.java`
- [x] T019 [US1] Implement frontend course browsing and registration pages in `frontend/src/pages/courses/`
- [x] T020 [P] [US1] Implement enrollment record service and model in `backend/src/main/java/com/myus/service/EnrollmentService.java`
- [x] T021 [US1] Implement timetable and course schedule UI in `frontend/src/pages/timetable/`
- [x] T022 [P] [US1] Implement grade retrieval and GPA calculation service in `backend/src/main/java/com/myus/service/AcademicService.java`
- [x] T023 [US1] Implement frontend grade dashboard and GPA display in `frontend/src/pages/grades/`
- [x] T024 [P] [US1] Implement tuition balance and payment history endpoints in `backend/src/main/java/com/myus/controller/FinanceController.java`
- [x] T025 [US1] Implement frontend tuition summary, scholarship info, and notifications in `frontend/src/pages/tuition/`
- [x] T026 [P] [US1] Add backend unit tests for profile, course, academic, and tuition services in `backend/src/test/java/com/myus/`
- [x] T027 [P] [US1] Add frontend integration tests for profile management, course registration, timetable, and tuition flows in `frontend/src/tests/`

---

## Phase 4: User Story 2 - Grade Appeal System, AI Learning Path Chatbot & Support (Priority: P1)

**Goal**: Enable students to digitally submit grade appeals, track real-time processing status with fee payment deadlines, access a centralized FAQ library, and receive personalized 24/7 academic counseling via the AI Learning Path Chatbot (Profile Analysis, Smart Course Suggestions, Graduation Tracking).

**Independent Test**: A student digitally submits a grade appeal with supporting documents, monitors real-time status and payment deadlines, searches FAQ resources, and receives customized course recommendations and graduation pathway simulations from the AI chatbot without administrator assistance.

### Functional Group 2: Grade Appeal System
- [ ] T028 [P] [US2] [FG2] Implement digital grade appeal submission endpoint handling multipart/form-data payloads in `backend/src/main/java/com/myus/controller/AppealController.java`
- [ ] T029 [P] [US2] [FG2] Implement supporting document upload handling, file size/type validation, and storage logic in `backend/src/main/java/com/myus/service/FileStorageService.java` and `AppealService.java`
- [ ] T030 [P] [US2] [FG2] Implement appeal status tracking endpoint to retrieve real-time processing status (Pending, Processing, Resolved) and the deadline date for visiting the academic office to complete fee payments in `backend/src/main/java/com/myus/controller/AppealController.java`
- [ ] T031 [US2] [FG2] Implement frontend grade appeal digital submission form, reason textarea, and interactive file dropzone UI in `frontend/src/pages/appeals/AppealSubmissionPage.tsx`
- [ ] T032 [US2] [FG2] Implement frontend visual status dashboard displaying real-time appeal progress, attached file links, and highlighting exact fee payment deadlines at the academic office in `frontend/src/pages/appeals/AppealStatusDashboard.tsx`

### AI Chatbot & Support (Section 4 & Functional Group 3 AI Module)
- [ ] T033 [P] [US2] [AI] Implement Profile & Progress Analysis engine to retrieve student academic transcripts, evaluate completed credits, and compare remaining degree requirements against official university curriculum standards in `backend/src/main/java/com/myus/service/ai/ProfileAnalysisService.java`
- [ ] T034 [P] [US2] [AI] Implement Smart Course Suggestion service to map prerequisite and corequisite constraints, dynamically filter out locked subjects, and recommend optimal next-semester courses in `backend/src/main/java/com/myus/service/ai/CourseRecommendationService.java`
- [ ] T035 [P] [US2] [AI] Implement Graduation Tracking engine to simulate academic pathways, track credit accumulation, ensure milestone clearances, and project on-time graduation timelines in `backend/src/main/java/com/myus/service/ai/GraduationTrackingService.java`
- [ ] T036 [P] [US2] [AI] Implement REST API controller and dialogue management adapter for 24/7 interactive academic counseling in `backend/src/main/java/com/myus/controller/ChatbotController.java`
- [ ] T037 [US2] [AI] Implement frontend interactive 24/7 AI Chatbot interface featuring personalized course suggestion cards, visual learning path roadmaps, and graduation timeline simulations in `frontend/src/pages/support/AIChatbotPage.tsx`

### Functional Group 6: Support & FAQ
- [ ] T038 [P] [US2] [FG6] Implement searchable centralized FAQ library endpoint covering university policies, academic rules, and IT support solutions in `backend/src/main/java/com/myus/controller/FaqController.java`
- [ ] T039 [US2] [FG6] Implement frontend centralized FAQ searchable library and instant self-service support UI in `frontend/src/pages/support/FaqPage.tsx`

### Phase 4 Verification & Testing
- [ ] T040 [P] [US2] Add backend unit tests for grade appeal routing, fee deadline calculation, AI transcript analysis, course recommendation algorithms, graduation simulations, and FAQ search in `backend/src/test/java/com/myus/`
- [ ] T041 [US2] Add frontend integration tests for digital appeal submission, visual status tracking dashboard, AI chatbot interactive prompts, and FAQ keyword filtering in `frontend/src/tests/`

---

## Phase 5: User Story 3 - Administrator Academic Operations (Priority: P2)

**Goal**: Provide administrators with comprehensive tools to upload master academic schedules, manage student class transfers, process grade appeals with fee deadline enforcement, and inspect detailed student records.

**Independent Test**: An administrator imports global academic schedules, resolves scheduling conflicts via manual class transfers, reviews and updates grade appeal statuses with fee deadlines, and searches detailed student records without student workflow dependencies.

### Functional Group 7: Administrative Class Control
- [ ] T042 [P] [US3] [FG7] Implement Master Schedule Uploading endpoint to bulk import global academic calendars, exam periods, and course offerings to keep campus timelines synchronized in `backend/src/main/java/com/myus/controller/AdminScheduleController.java`
- [ ] T043 [P] [US3] [FG7] Implement Student Class Transfer Management service enabling admins to manually move students between sections, resolve unexpected scheduling conflicts, and balance class sizes in `backend/src/main/java/com/myus/service/ClassTransferService.java`
- [ ] T044 [US3] [FG7] Implement frontend Master Schedule upload interface and manual Class Transfer management tool in `frontend/src/pages/admin/ScheduleManagementPage.tsx` and `ClassTransferPage.tsx`

### Functional Group 8: Appeal Management
- [ ] T045 [P] [US3] [FG8] Implement Process Grade Appeals centralized admin endpoint to receive requests, update processing status (Pending, Processing, Resolved), and input specific deadline dates for students to pay required fees at the office in `backend/src/main/java/com/myus/controller/AdminAppealController.java`
- [ ] T046 [US3] [FG8] Implement frontend centralized Appeal Management dashboard for reviewing submissions, updating appeal statuses, and setting office fee payment deadlines in `frontend/src/pages/admin/AppealProcessingPage.tsx`

### Functional Group 9: Student Data Administration
- [ ] T047 [P] [US3] [FG9] Implement View Student Records search and detailed retrieval endpoint covering personal information, contact details, emergency contacts, and academic standing in `backend/src/main/java/com/myus/controller/AdminStudentController.java`
- [ ] T048 [US3] [FG9] Implement frontend Student Data Administration search directory and detailed student profile inspection view for identity verification and emergency support in `frontend/src/pages/admin/StudentRecordsPage.tsx`

### Phase 5 Verification & Testing
- [ ] T049 [P] [US3] Add backend unit tests for master schedule synchronization, class transfer conflict handling, appeal deadline updates, and student record access security in `backend/src/test/java/com/myus/`
- [ ] T050 [US3] Add frontend acceptance tests for admin schedule uploading, student transfer workflows, appeal processing dashboard, and student record searches in `frontend/src/tests/`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete system-wide feedback mechanisms, finalize documentation, ensure security compliance, and execute end-to-end quality validation across all functional modules.

### Functional Group 5: Feedback & Evaluation
- [ ] T051 [P] [FG5] Implement end-of-semester Evaluation Survey submission endpoints to collect structured student feedback on course quality, lecturer performance, and campus facilities in `backend/src/main/java/com/myus/controller/SurveyController.java`
- [ ] T052 [US1] [FG5] Implement frontend structured evaluation survey forms and feedback submission UI in `frontend/src/pages/evaluation/SurveyPage.tsx`

### System Documentation & Quality Assurance
- [ ] T053 [P] Document backend REST APIs, authentication flows, and AI chatbot recommendation endpoints in `backend/README.md` and `backend/src/main/resources/static/api-docs/`
- [ ] T054 [P] Document frontend user guide, evaluation survey workflows, and AI support feature instructions in `frontend/docs/user-guide.md`
- [ ] T055 [P] Document deployment, cloud database setup, and environment configuration in `docs/deployment.md`
- [ ] T056 [P] Review application-wide security, data privacy, and sensitive student records handling across `backend/` and `frontend/`
- [ ] T057 [P] Perform end-to-end user acceptance testing covering all 9 Functional Groups and the AI Learning Path Chatbot, capturing results in `docs/acceptance-test-results.md`
- [ ] T058 [P] Implement final logging, error reporting, and UI/UX accessibility improvements across React components and Spring Boot API flows in `frontend/src/` and `backend/src/main/java/com/myus/`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1: Setup** starts immediately.
- **Phase 2: Foundational** depends on Phase 1 completion and blocks all user stories.
- **Phase 3+ User Stories** depend on Phase 2 completion and may proceed in parallel once the core platform is ready.
- **Phase 6: Polish** depends on completion of all selected user story phases.

### User Story Dependencies
- **User Story 1 (P1)**: Can start after foundation is completed; independent from other stories.
- **User Story 2 (P1)**: Can start after foundation is completed; independent from User Story 1.
- **User Story 3 (P2)**: Can start after foundation is completed; independent from User Stories 1 and 2.

### Within Each Story
- Models/services before endpoints
- Endpoints before frontend integration
- Story-specific tests before story completion
- Core user stories should be functional independently before final polish

## Parallel Execution Examples
- Backend service implementation tasks for profile, course registration, and tuition can run concurrently after foundational auth and entity work is complete.
- Frontend pages for profile, courses, timetable, and tuition can be built in parallel by separate team members.
- Grade appeal backend service implementation and AI chatbot recommendation engine can run in parallel with administrator import and record search implementation.
- Documentation, API docs, and deployment guide tasks are parallelizable across team members once the main services are in place.

## Implementation Strategy
- **MVP first**: Deliver Student Academic Self-Service and Grade Appeal support as the first independent increments.
- **Incremental delivery**: Build the platform in phases, completing foundational authentication and data model work before adding each story.
- **Parallel work**: Separate frontend, backend, and documentation work wherever dependencies allow to reduce cycle time.
- **Test-driven delivery**: Add unit and integration tests for each story, especially for authentication, appeal workflows, AI recommendation algorithms, and administrator data operations.

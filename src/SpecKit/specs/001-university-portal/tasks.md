# Tasks: MyUS University Portal System

**Input**: Design documents from `/specs/001-university-portal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core scaffolding for frontend, backend, and shared configuration.

- [ ] T001 Create backend Spring Boot project skeleton in backend/
- [ ] T002 Create React frontend project skeleton in frontend/
- [ ] T003 Configure repository-level linting, formatting, and environment variables in `.vscode/`, `backend/`, and `frontend/`
- [ ] T004 [P] Configure JWT authentication dependencies and environment settings in `backend/build.gradle` or `backend/pom.xml`
- [ ] T005 [P] Configure frontend routing, protected route wrappers, and global layout in `frontend/src/`
- [ ] T006 [P] Add initial API documentation scaffolding in `backend/src/main/resources/static/api-docs/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend and frontend infrastructure that must be complete before user story implementation begins.

- [ ] T007 Setup SQL Server database schema, migration scripts, and entity definitions in `backend/src/main/resources/db/` and `backend/src/main/java/com/myus/entity/`
- [ ] T008 [P] Implement JWT authentication filter and security configuration in `backend/src/main/java/com/myus/security/`
- [ ] T009 [P] Implement role-based access control for Student and Administrator roles in `backend/src/main/java/com/myus/security/`
- [ ] T010 [P] Create Student and Administrator identity, profile, and authorization entities in `backend/src/main/java/com/myus/entity/`
- [ ] T011 [P] Add backend API exception handling and validation response middleware in `backend/src/main/java/com/myus/exception/`
- [ ] T012 [P] Implement frontend authentication state, login/logout flows, and protected route components in `frontend/src/auth/`
- [ ] T013 [P] Implement frontend shared data services for API calls and error handling in `frontend/src/services/`
- [ ] T014 [P] Add baseline API documentation and developer guide references in `backend/README.md` and `frontend/README.md`

---

## Phase 3: User Story 1 - Student Academic Self-Service (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated students to view and manage their profile, register for courses, view grades and timetable, and track tuition details independently.

**Independent Test**: A student logs in, updates their profile, registers for a course, views timetable/grades, and reviews tuition balance without administrator interaction.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement student profile retrieval endpoint in `backend/src/main/java/com/myus/controller/ProfileController.java`
- [ ] T016 [P] [US1] Implement student profile update service in `backend/src/main/java/com/myus/service/ProfileService.java`
- [ ] T017 [US1] Implement student profile view and edit pages in `frontend/src/pages/profile/`
- [ ] T018 [P] [US1] Implement course catalog browsing endpoint in `backend/src/main/java/com/myus/controller/CourseController.java`
- [ ] T019 [US1] Implement frontend course browsing and registration pages in `frontend/src/pages/courses/`
- [ ] T020 [P] [US1] Implement enrollment record service and model in `backend/src/main/java/com/myus/service/EnrollmentService.java`
- [ ] T021 [US1] Implement timetable and course schedule UI in `frontend/src/pages/timetable/`
- [ ] T022 [P] [US1] Implement grade retrieval and GPA calculation service in `backend/src/main/java/com/myus/service/AcademicService.java`
- [ ] T023 [US1] Implement frontend grade dashboard and GPA display in `frontend/src/pages/grades/`
- [ ] T024 [P] [US1] Implement tuition balance and payment history endpoints in `backend/src/main/java/com/myus/controller/FinanceController.java`
- [ ] T025 [US1] Implement frontend tuition summary, scholarship info, and notifications in `frontend/src/pages/tuition/`
- [ ] T026 [P] [US1] Add backend unit tests for profile, course, academic, and tuition services in `backend/src/test/java/com/myus/`
- [ ] T027 [P] [US1] Add frontend integration tests for profile management, course registration, timetable, and tuition flows in `frontend/src/tests/`

---

## Phase 4: User Story 2 - Grade Appeal and Support Workflow (Priority: P1)

**Goal**: Enable students to submit grade appeals, track status, upload supporting documents, and access FAQ/support resources including an AI learning path chatbot.

**Independent Test**: A student submits a grade appeal, views status updates, and receives guidance from the chatbot or FAQ section without administrator assistance.

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement grade appeal submission endpoint in `backend/src/main/java/com/myus/controller/AppealController.java`
- [ ] T029 [US2] Implement supporting document upload handling in `backend/src/main/java/com/myus/service/AppealService.java`
- [ ] T030 [P] [US2] Implement appeal status tracking endpoint in `backend/src/main/java/com/myus/controller/AppealController.java`
- [ ] T031 [US2] Implement appeal deadline configuration and validation in `backend/src/main/java/com/myus/config/AppealConfig.java`
- [ ] T032 [US2] Implement frontend grade appeal submission, document upload, and status pages in `frontend/src/pages/appeals/`
- [ ] T033 [P] [US2] Implement AI learning path chatbot backend adapter and recommendation service in `backend/src/main/java/com/myus/service/ChatbotService.java`
- [ ] T034 [US2] Implement frontend chatbot experience and FAQ search UI in `frontend/src/pages/support/`
- [ ] T035 [P] [US2] Add backend unit tests for appeal workflows, deadline enforcement, and chatbot guidance in `backend/src/test/java/com/myus/`
- [ ] T036 [US2] Add frontend integration tests for appeal submission, status tracking, and support search in `frontend/src/tests/`

---

## Phase 5: User Story 3 - Administrator Academic Operations (Priority: P2)

**Goal**: Give administrators tools to import data, manage class transfers, process appeals, and view student records efficiently.

**Independent Test**: An administrator imports student/course data, reviews a grade appeal, manages a class transfer, and retrieves a student record without relying on student workflows.

### Implementation for User Story 3

- [ ] T037 [P] [US3] Implement bulk data import endpoint and validation in `backend/src/main/java/com/myus/controller/AdminController.java`
- [ ] T038 [US3] Implement class transfer request handling and course offering management in `backend/src/main/java/com/myus/service/ClassManagementService.java`
- [ ] T039 [P] [US3] Implement administrator grade appeal processing endpoint in `backend/src/main/java/com/myus/controller/AppealController.java`
- [ ] T040 [US3] Implement student record search and detailed student record endpoint in `backend/src/main/java/com/myus/controller/AdminController.java`
- [ ] T041 [US3] Implement admin UI for student records, bulk import, and class transfer management in `frontend/src/pages/admin/`
- [ ] T042 [P] [US3] Add backend tests for bulk import, appeal processing, class transfer, and record search in `backend/src/test/java/com/myus/`
- [ ] T043 [US3] Add frontend acceptance tests for administrator import, class transfer, and student record workflows in `frontend/src/tests/`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation, testing, and cross-module quality checks across the whole system.

- [ ] T044 [P] Document backend REST APIs and authentication flows in `backend/README.md` and `backend/src/main/resources/static/api-docs/`
- [ ] T045 [P] Document frontend user guide, survey workflows, and support pages in `frontend/docs/user-guide.md`
- [ ] T046 [P] Document deployment and environment setup in `docs/deployment.md`
- [ ] T047 [P] Review application-wide security, privacy, and sensitive data handling across `backend/` and `frontend/`
- [ ] T048 [P] Perform end-to-end user acceptance testing for student self-service, appeals, and admin operations and capture results in `docs/acceptance-test-results.md`
- [ ] T049 [P] Implement final logging, error reporting, and accessibility improvements across UI and API flows in `frontend/src/` and `backend/src/main/java/com/myus/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** starts immediately.
- **Phase 2: Foundational** depends on Phase 1 completion and blocks all user stories.
- **Phase 3+ User Stories** depend on Phase 2 completion and may proceed in parallel once the core platform is ready.
- **Phase 6: Polish** depends on completion of the selected user story phases.

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
- Grade appeal backend service implementation and chatbot integration can run in parallel with administrator import and record search implementation.
- Documentation, API docs, and deployment guide tasks are parallelizable across team members once the main services are in place.

## Implementation Strategy

- **MVP first**: Deliver Student Academic Self-Service and Grade Appeal support as the first independent increments.
- **Incremental delivery**: Build the platform in phases, completing foundational authentication and data model work before adding each story.
- **Parallel work**: Separate frontend, backend, and documentation work wherever dependencies allow to reduce cycle time.
- **Test-driven delivery**: Add unit and integration tests for each story, especially for authentication, appeal workflows, and administrator data operations.

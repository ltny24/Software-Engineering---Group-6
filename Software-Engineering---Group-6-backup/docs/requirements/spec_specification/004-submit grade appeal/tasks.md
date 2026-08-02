# Tasks: Functional Group 2 — Submit Grade Appeal System
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi
**Input:** `spec.md`, `plan.md`  
**Target Sprint:** Phase 4 (User Story 2 - Grade Appeal & Support Workflow)  
**Priority:** P1 (Core Student Feature)  

---

## Phase A: Database & Backend Data Modeling

**Purpose:** Set up database schema and JPA entities required for grade appeals and file attachments.

- [ ] T028-01 [P] [US2] [FG2] Create SQL Server migration script for `grade_appeals` and `appeal_attachments` tables with proper foreign keys and constraints in `backend/src/main/resources/db/migration/V3__create_grade_appeal_tables.sql`
- [ ] T029-02 [P] [US2] [FG2] Create JPA Entity `GradeAppeal.java` with lifecycle callbacks (`@PrePersist`, `@PreUpdate`) in `backend/src/main/java/com/myus/entity/GradeAppeal.java`
- [ ] T029-03 [P] [US2] [FG2] Create JPA Entity `AppealAttachment.java` with Many-To-One mapping to `GradeAppeal` in `backend/src/main/java/com/myus/entity/AppealAttachment.java`
- [ ] T029-04 [P] [US2] [FG2] Create JPA Repositories `GradeAppealRepository.java` and `AppealAttachmentRepository.java` in `backend/src/main/java/com/myus/repository/`

---

## Phase B: Backend Services & API Endpoints

**Purpose:** Implement business logic, validation rules, file storage, and secure REST APIs for grade appeal submission.

- [ ] T029-05 [P] [US2] [FG2] Create DTO classes (`AppealSubmissionRequest.java`, `EligibleCourseResponse.java`, `AppealResponseDto.java`) with validation annotations in `backend/src/main/java/com/myus/dto/appeal/`
- [ ] T029-06 [P] [US2] [FG2] Implement `FileStorageService.java` to validate file extension/size (<5MB) and save attachments securely to disk/cloud storage in `backend/src/main/java/com/myus/service/FileStorageService.java`
- [ ] T029-07 [US2] [FG2] Implement utility class `DeadlineCalculatorUtil.java` to calculate fee payment deadlines (+5 business days excluding weekends) in `backend/src/main/java/com/myus/util/`
- [ ] T029-08 [P] [US2] [FG2] Implement core business logic in `AppealServiceImpl.java` (enforce 14-day submission window, generate unique `GA-YYYY-XXXX` tracking codes, handle transaction rollback on upload failure) in `backend/src/main/java/com/myus/service/impl/`
- [ ] T029-09 [P] [US2] [FG2] Implement secured REST controller `AppealController.java` with endpoints `GET /eligible-courses`, `POST /`, and `GET /my-appeals` in `backend/src/main/java/com/myus/controller/AppealController.java`

---

## Phase C: Frontend UI & Integration (React + TypeScript)

**Purpose:** Build responsive user interface, form validation, file dropzone, and integrate with Spring Boot endpoints.

- [ ] T031-01 [P] [US2] [FG2] Define TypeScript interfaces for appeals, form payloads, and API responses in `frontend/src/types/appeal.types.ts`
- [ ] T031-02 [P] [US2] [FG2] Implement API connector methods using Axios (`getEligibleCourses`, `submitAppeal` with `FormData`, `getMyAppeals`) in `frontend/src/services/appealService.ts`
- [ ] T031-03 [US2] [FG2] Build reusable file upload component `FileDropzone.tsx` with instant client-side size (<5MB) and type validation (`.pdf`, `.jpg`, `.png`) in `frontend/src/components/appeals/`
- [ ] T031-04 [US2] [FG2] Build confirmation popup component `AppealConfirmationModal.tsx` summarizing appeal details and highlighting fee rules in `frontend/src/components/appeals/`
- [ ] T031-05 [US2] [FG2] Implement main form page `AppealSubmissionPage.tsx` with course selection, auto-grade display, expected grade input, and reason text area in `frontend/src/pages/appeals/AppealSubmissionPage.tsx`
- [ ] T032-01 [US2] [FG2] Build status badge component `StatusBadge.tsx` and countdown timer for fee payment deadlines in `frontend/src/components/appeals/`
- [ ] T032-02 [US2] [FG2] Implement visual tracking dashboard `AppealStatusDashboard.tsx` displaying student's submitted appeals, filtering by status, and alerting impending deadlines in `frontend/src/pages/appeals/AppealStatusDashboard.tsx`

---

## Phase D: Verification & Quality Assurance

**Purpose:** Ensure robust unit, integration, and end-to-end testing for the grade appeal feature.

- [ ] T040-01 [P] [US2] [FG2] Write Spring Boot JUnit 5 unit tests for `AppealService` testing window expiration, invalid grades, and deadline calculations in `backend/src/test/java/com/myus/service/AppealServiceTest.java`
- [ ] T040-02 [P] [US2] [FG2] Write MockMvc integration tests for `AppealController` verifying JWT authentication (`@WithMockUser(roles="STUDENT")`) and multipart upload handling in `backend/src/test/java/com/myus/controller/AppealControllerTest.java`
- [ ] T041-01 [US2] [FG2] Write React Testing Library unit tests for `FileDropzone.tsx` and form validation errors in `frontend/src/tests/components/appeals/`
- [ ] T041-02 [US2] [FG2] Perform manual end-to-end acceptance testing: Login as student (`24127595`) -> Submit appeal -> Verify file upload in backend folder -> Verify database record creation in SQL Server -> Verify status dashboard rendering.

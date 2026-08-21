# Tasks: Functional Group 2 — Submit Grade Appeal System
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi
**Input:** `spec.md`, `plan.md`  
**Target Sprint:** Phase 4 (User Story 2 - Grade Appeal & Support Workflow)  
**Priority:** P1 (Core Student Feature)  

---

## Phase A: Database & Backend Data Modeling

**Purpose:** Set up database schema and JPA entities required for grade appeals and file attachments.

- [ ] T028-01 [P] [US2] [FG2] Update SQL Server script for `Appeal` table with proper foreign keys and constraints in `backend/resources/db/schema.sql`
- [ ] T029-02 [P] [US2] [FG2] Create JPA Entity `Appeal.java` with lifecycle mappings in `backend/src/myus/entity/Appeal.java`
- [ ] T029-04 [P] [US2] [FG2] Create JPA Repository `AppealRepository.java` in `backend/src/myus/repository/`

---

## Phase B: Backend Services & API Endpoints

**Purpose:** Implement business logic, validation rules, file storage, and secure REST APIs for grade appeal submission.

- [ ] T029-05 [P] [US2] [FG2] Create DTO classes (`AppealSubmitRequest.java`, `AppealResponse.java`, `AppealDetailResponse.java`) with validation annotations in `backend/src/myus/dto/`
- [ ] T029-08 [P] [US2] [FG2] Implement core business logic in `AppealServiceImpl.java` (handle URL storage instead of files) in `backend/src/myus/service/AppealServiceImpl.java`
- [ ] T029-09 [P] [US2] [FG2] Implement secured REST controller `AppealController.java` with endpoints `GET /my-appeals`, `POST /` in `backend/src/myus/controller/AppealController.java`

---

## Phase C: Frontend UI & Integration (React + TypeScript)

**Purpose:** Build responsive user interface, form validation, file dropzone, and integrate with Spring Boot endpoints.

- [ ] T031-01 [P] [US2] [FG2] Define TypeScript interfaces for appeals, form payloads, and API responses in `frontend/src/types/appeal.types.ts`
- [ ] T031-02 [P] [US2] [FG2] Implement API connector methods using Axios (`submitAppeal` with JSON payload) in `frontend/src/services/appealService.ts`
- [ ] T031-05 [US2] [FG2] Implement main form page `AppealForm.tsx` with course selection, auto-grade display, expected grade input, and reason text area in `frontend/src/pages/appeals/AppealForm.tsx`
- [ ] T032-01 [US2] [FG2] Build status badge component `AppealStatusBadge.tsx` in `frontend/src/components/appeals/`
- [ ] T032-02 [US2] [FG2] Implement visual tracking dashboard `AppealStatusTracking.tsx` displaying student's submitted appeals in `frontend/src/pages/appeals/AppealStatusTracking.tsx`
---

## Phase D: Verification & Quality Assurance

**Purpose:** Ensure robust unit, integration, and end-to-end testing for the grade appeal feature.

- [ ] T040-01 [P] [US2] [FG2] Write Spring Boot JUnit 5 unit tests for `AppealService` in `backend/test/myus/service/AppealServiceImplTest.java`
- [ ] T041-01 [US2] [FG2] Write React Testing Library unit tests for frontend components in `frontend/src/pages/appeals/`
- [ ] T041-02 [US2] [FG2] Perform manual end-to-end acceptance testing: Login as student -> Submit appeal -> Verify URL text in backend -> Verify database record creation -> Verify status dashboard rendering.

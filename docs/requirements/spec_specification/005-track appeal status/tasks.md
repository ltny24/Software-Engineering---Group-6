# Tasks: Functional Group 2 — Track Grade Appeal Status
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý
**Input:** `spec.md`, `plan.md`  
**Target Sprint:** Phase 4 (User Story 2 - Grade Appeal & Support Workflow)  
**Priority:** P1 (Core Student Feature)  

---

## Phase A: Backend Queries & DTO Projection

**Purpose:** Configure database queries and lightweight DTO projections to fetch student appeal lists efficiently without loading heavy attachment blobs.

- [ ] T030-01 [P] [US2] [FG2] Create DTO class `AppealSummaryResponse.java` in `backend/src/myus/dto/appeal/`
- [ ] T030-02 [P] [US2] [FG2] Create DTO class `AppealDetailResponse.java` in `backend/src/myus/dto/appeal/`
- [ ] T030-03 [P] [US2] [FG2] Add custom query methods in `AppealRepository.java` in `backend/src/myus/repository/AppealRepository.java`

---

## Phase B: Backend REST API Endpoints & Deadline Enforcement

**Purpose:** Implement secure REST controllers and background evaluation logic to handle status tracking and automatic deadline expiration.

- [ ] T030-04 [P] [US2] [FG2] Implement service method `getStudentAppeals` in `AppealServiceImpl.java` in `backend/src/myus/service/AppealServiceImpl.java`
- [ ] T030-05 [P] [US2] [FG2] Implement service method `getAppealDetailByCode` ensuring ownership verification in `backend/src/myus/service/AppealServiceImpl.java`
- [ ] T030-07 [P] [US2] [FG2] Implement REST endpoints `GET /my-appeals` and `GET /{trackingCode}` in `backend/src/myus/controller/AppealController.java`

---

## Phase C: Frontend UI & Interactive Components (React + TypeScript)

**Purpose:** Build responsive tracking dashboard, search/filter controls, countdown alerts, and slide-over inspection drawer.

- [ ] T032-01 [P] [US2] [FG2] Define TypeScript interfaces for tracking (`AppealSummaryResponse`, `AppealDetailResponse`) in `frontend/src/types/appeal.types.ts`
- [ ] T032-02 [P] [US2] [FG2] Implement API connector methods using Axios in `frontend/src/services/appealService.ts`
- [ ] T032-03 [US2] [FG2] Build reusable status badge component `AppealStatusBadge.tsx` in `frontend/src/components/appeals/`
- [ ] T032-05 [US2] [FG2] Build filter toolbar component `AppealFilterToolbar.tsx` in `frontend/src/components/appeals/`
- [ ] T032-06 [US2] [FG2] Implement detail inspection drawer `AppealDetailDrawer.tsx` rendering reasons, document link, and admin feedback in `frontend/src/components/appeals/`
- [ ] T032-07 [US2] [FG2] Build status tracking page `AppealStatusTracking.tsx` in `frontend/src/pages/appeals/AppealStatusTracking.tsx`

---

## Phase D: Verification & Quality Assurance

**Purpose:** Execute unit tests, integration tests, and UI verification for the status tracking and detail view workflows.

- [ ] T040-01 [P] [US2] [FG2] Write Spring Boot JUnit 5 unit tests for `AppealService` in `backend/test/myus/service/AppealServiceImplTest.java`
- [ ] T041-01 [US2] [FG2] Write React Testing Library unit tests for `AppealStatusTracking.tsx` in `frontend/src/pages/appeals/`
- [ ] T041-02 [US2] [FG2] Perform manual end-to-end acceptance testing: Login as student -> Open Status Dashboard -> Filter by "Resolved" -> Click row -> Verify admin feedback notes.

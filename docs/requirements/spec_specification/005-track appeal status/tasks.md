# Tasks: Functional Group 2 — Track Grade Appeal Status
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý
**Input:** `spec.md`, `plan.md`  
**Target Sprint:** Phase 4 (User Story 2 - Grade Appeal & Support Workflow)  
**Priority:** P1 (Core Student Feature)  

---

## Phase A: Backend Queries & DTO Projection

**Purpose:** Configure database queries and lightweight DTO projections to fetch student appeal lists efficiently without loading heavy attachment blobs.

- [ ] T030-01 [P] [US2] [FG2] Create projection interface or DTO class `AppealSummaryResponse.java` in `backend/src/main/java/com/myus/dto/appeal/`
- [ ] T030-02 [P] [US2] [FG2] Create detailed DTO class `AppealDetailResponse.java` including attachment lists and admin feedback fields in `backend/src/main/java/com/myus/dto/appeal/`
- [ ] T030-03 [P] [US2] [FG2] Add custom query methods in `GradeAppealRepository.java` (`findByStudentIdOrderByCreatedAtDesc` and `findByTrackingCodeAndStudentId`) in `backend/src/main/java/com/myus/repository/GradeAppealRepository.java`

---

## Phase B: Backend REST API Endpoints & Deadline Enforcement

**Purpose:** Implement secure REST controllers and background evaluation logic to handle status tracking and automatic deadline expiration.

- [ ] T030-04 [P] [US2] [FG2] Implement service method `getStudentAppeals(String studentId)` in `AppealServiceImpl.java` mapping entities to summary DTOs in `backend/src/main/java/com/myus/service/impl/AppealServiceImpl.java`
- [ ] T030-05 [P] [US2] [FG2] Implement service method `getAppealDetailByCode(String trackingCode, String studentId)` ensuring strict ownership verification in `backend/src/main/java/com/myus/service/impl/AppealServiceImpl.java`
- [ ] T030-06 [US2] [FG2] Implement Spring `@Scheduled` cron job or read-time check in `AppealService` to automatically transition unpaid `PENDING` appeals past their deadline to `CANCELED` status in `backend/src/main/java/com/myus/service/AppealService.java`
- [ ] T030-07 [P] [US2] [FG2] Implement REST endpoints `GET /my-appeals` and `GET /{trackingCode}` secured with `@PreAuthorize("hasRole('STUDENT')")` in `backend/src/main/java/com/myus/controller/AppealController.java`

---

## Phase C: Frontend UI & Interactive Components (React + TypeScript)

**Purpose:** Build responsive tracking dashboard, search/filter controls, countdown alerts, and slide-over inspection drawer.

- [ ] T032-01 [P] [US2] [FG2] Define TypeScript interfaces for tracking (`AppealSummaryDTO`, `AppealDetailDTO`, filter state types) in `frontend/src/types/appeal.types.ts`
- [ ] T032-02 [P] [US2] [FG2] Implement API connector methods using Axios (`getMyAppealHistory`, `getAppealDetail`) in `frontend/src/services/appealService.ts`
- [ ] T032-03 [US2] [FG2] Build reusable status badge component `AppealStatusBadge.tsx` supporting all 5 color-coded status states in `frontend/src/components/appeals/`
- [ ] T032-04 [US2] [FG2] Implement deadline utility and countdown timer component `DeadlineCountdown.tsx` highlighting rows in bold red when under 24 hours remain in `frontend/src/components/appeals/`
- [ ] T032-05 [US2] [FG2] Build summary metrics header and search/filter toolbar component `AppealFilterToolbar.tsx` supporting instant keyword searching and status dropdown selection in `frontend/src/components/appeals/`
- [ ] T032-06 [US2] [FG2] Implement slide-over detail inspection drawer `AppealDetailDrawer.tsx` rendering original reasons, downloadable attachment cards, and admin feedback callouts in `frontend/src/components/appeals/`
- [ ] T032-07 [US2] [FG2] Build main status dashboard page `AppealStatusDashboard.tsx` combining data grid, pagination, empty states, and drawer management in `frontend/src/pages/appeals/AppealStatusDashboard.tsx`

---

## Phase D: Verification & Quality Assurance

**Purpose:** Execute unit tests, integration tests, and UI verification for the status tracking and detail view workflows.

- [ ] T040-01 [P] [US2] [FG2] Write Spring Boot JUnit 5 unit tests for `AppealService` verifying correct DTO mapping, strict student ID ownership filtering, and deadline expiration logic in `backend/src/test/java/com/myus/service/AppealServiceTest.java`
- [ ] T040-02 [P] [US2] [FG2] Write MockMvc integration tests for `AppealController` verifying 200 OK responses for valid owners and 403 Forbidden for unauthorized access attempts in `backend/src/test/java/com/myus/controller/AppealControllerTest.java`
- [ ] T041-01 [US2] [FG2] Write React Testing Library unit tests for `AppealStatusDashboard.tsx` verifying client-side keyword search filtering and badge color rendering in `frontend/src/tests/components/appeals/`
- [ ] T041-02 [US2] [FG2] Perform manual end-to-end acceptance testing: Login as student (`24127001`) -> Open Status Dashboard -> Filter by "Resolved" -> Click row -> Verify admin feedback notes and updated score render correctly in the slide-over drawer.

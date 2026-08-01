# Current Architecture – MyUS University Portal

> **Date:** 2026-07-29
> **Branch:** refactor/repository-architecture

---

## 1. Repository Overview

### Project Purpose
MyUS is a full-stack web-based university academic portal. It allows students to manage courses, grades, tuition, and appeals, while administrators process those operations. It includes an AI chatbot for course recommendations (planned feature).

### Technology Stack

| Component | Stack |
|-----------|-------|
| Backend | Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security, JWT |
| Database | SQL Server (via mssql-jdbc + Flyway migrations) |
| API Docs | SpringDoc OpenAPI 2.5.0 (Swagger UI) |
| Frontend | React 18.3, TypeScript 5.4, React Router v6, Axios |
| Build (BE) | Maven |
| Build (FE) | Create React App (react-scripts 5) |
| Testing (BE) | JUnit 5, Mockito |
| Testing (FE) | Jest, React Testing Library |

### Package Managers
- **Backend:** Maven (`pom.xml` at `src/backend/pom.xml`)
- **Frontend:** npm (`package.json` at `src/frontend/package.json`)

---

## 2. Application Entry Points

| Entry | Path |
|-------|------|
| Frontend HTML | `src/frontend/public/index.html` |
| Frontend React entry | `src/frontend/src/index.tsx` |
| Frontend router | `src/frontend/src/App.tsx` |
| Backend main class | `src/backend/src/main/java/com/myus/UniversityPortalApplication.java` |
| DB migrations | `src/backend/src/main/resources/db/migration/V1__init_schema.sql` |
| DB seed data | `src/backend/src/main/resources/db/mock_data_myus.sql` |
| Config | `src/backend/src/main/resources/application.properties` |
| Backend tests | `src/backend/src/test/java/com/myus/` |
| Frontend tests | `src/frontend/src/tests/` |

---

## 3. Dependency Analysis

### Backend Dependencies (from `pom.xml`)

| Dependency | Purpose | Status |
|-----------|---------|--------|
| spring-boot-starter-web | REST API | Active |
| spring-boot-starter-data-jpa | ORM / data access | Active |
| spring-boot-starter-validation | Bean validation | Active |
| spring-boot-starter-security | Authentication | Active |
| jjwt (api, impl, jackson) | JWT token handling | Active |
| mssql-jdbc | SQL Server driver | Active |
| flyway-core + flyway-sqlserver | Schema migration | Active |
| mapstruct | Object mapping | **UNUSED** (no mapper interfaces exist) |
| lombok | Boilerplate reduction | Active |
| springdoc-openapi | API documentation | Active |
| spring-boot-starter-actuator | Health/metrics endpoints | Active |
| spring-boot-devtools | Hot reload | Dev only |
| spring-boot-starter-test | Unit/integration tests | Active |
| spring-security-test | Security test support | Active |

### Frontend Dependencies (from `package.json`)

| Dependency | Purpose | Status |
|-----------|---------|--------|
| react, react-dom | UI framework | Active |
| react-router-dom | Client-side routing | Active |
| axios | HTTP client | Active |
| react-hook-form | Form handling | Active |
| zod | Schema validation | Active |
| react-hot-toast | Toast notifications | Active |
| recharts | Charts/graphs | Active |
| date-fns | Date utilities | Active |
| clsx | CSS class utilities | Active |
| react-dropzone | File upload | Active |
| ajv | JSON validation | Active |
| zustand | State management | **UNUSED** in current code |
| react-query | Server state | **UNUSED** in current code |
| react-table | Data tables | **UNUSED** in current code |
| @hookform/resolvers | Form resolvers | Active |

> **Recommendation:** Remove zustand, react-query, and react-table from `package.json` unless they are planned for immediate use. They inflate install size and may cause confusion.

---

## 4. Current Architecture

### 4.1 Backend – Layered Architecture

```
 controller/ ── HTTP endpoints, input validation
      ↓
  service/  ── Business logic, transactional boundaries
      ↓
repository/ ── Data access (Spring Data JPA)
      ↓
  entity/   ── JPA entities + Spring Security UserDetails
```

**Detailed package map:**

| Package | Responsibility | Files |
|---------|---------------|-------|
| `controller/` | REST endpoints | AppealAdminController, AppealController, AuthController, CourseController, EnrollmentController, FinanceController, GradeController, ProfileController |
| `service/` | Business logic | AppealService(Impl), CourseService(Impl), EnrollmentService(Impl), FinanceService(Impl), GradeService(Impl), ProfileService(Impl) |
| `repository/` | Data access | AppealRepository, CourseRepository, CourseOfferingRepository, CourseRegistrationRepository, GradeRepository, StudentRepository, TuitionAccountRepository, TuitionPaymentRepository, AdministratorRepository |
| `entity/` | Domain model | Student, Administrator, Course, CourseOffering, CourseRegistration, Grade, Appeal, AcademicRecord, TuitionAccount, TuitionPayment, Survey, SurveyResponse, FAQArticle, ClassTransferRequest, ChatbotSession, UserRole |
| `dto/` | API contracts | AuthRequest/Response, AppealResponse, AppealSubmitRequest, AppealReviewRequest, CourseResponse, CourseOfferingResponse, EnrollmentRequest/Response, GradeResponse, StudentProfileResponse, StudentProfileUpdateRequest, TuitionBalanceResponse, TuitionPaymentResponse |
| `config/` | Framework config | CorsConfig, JwtProperties |
| `security/` | Auth infrastructure | SecurityConfig, JwtTokenProvider, JwtAuthenticationFilter, JwtAuthenticationEntryPoint, UserDetailsServiceImpl, IsStudent, IsAdministrator |
| `exception/` | Error handling | GlobalExceptionHandler, ApiError, ResourceNotFoundException, AppealException, EnrollmentException |
| `util/` | Utilities | Empty (only package-info.java) |

### 4.2 Frontend – Component-Based Architecture

```
 pages/ ── Route-level views
components/ ── Shared UI components
  auth/ ── Auth context, guards, service
services/ ── API service functions
  api/ ── Axios configuration
 hooks/ ── Custom hooks
 types/ ── TypeScript interfaces
 utils/ ── Constants, token utilities
 tests/ ── Component tests
```

---

## 5. Architectural Problems

### Critical

| # | Location | Issue | Impact |
|---|----------|-------|--------|
| C1 | `ProfileController.java:30` | Controller injects `StudentRepository` directly alongside `ProfileService`, bypassing the service layer for `getProfile()`. | Violates layered architecture; business logic scattered between controller and service. |
| C2 | `SecurityConfig.java:89` | `NoOpPasswordEncoder` used — passwords stored and compared in plaintext. | Major security vulnerability. |
| C3 | `entity/Student.java` and `entity/Administrator.java` | Domain entities implement Spring Security's `UserDetails` interface. | Framework coupling into domain layer; prevents clean separation. |
| C4 | `src/frontend/src/auth/` and `src/frontend/src/hooks/` | Duplicate `useAuth.tsx` in both directories. | Maintenance risk: changes to one copy won't propagate. |
| C5 | `src/frontend/src/auth/` and `src/frontend/src/services/` | Duplicate `authService.ts` in both directories. | Same risk as C4. |

### High

| # | Location | Issue | Impact |
|---|----------|-------|--------|
| H1 | Multiple controllers | Inconsistent API path prefix: some use `/api/`, others use `/api/v1/`. | Developer confusion; no clear API versioning strategy. |
| H2 | `application.properties:15` | Default DB credentials (`sa`/`12345678`) committed. | While overrideable via env vars, default exposure is risky. |
| H3 | `application.properties:33` | Default JWT secret committed in source. | Encourages use of weak default in production. |
| H4 | Root of repo | No root-level `.gitignore` (added in this refactor). | `.DS_Store` and build artifacts were committed. |
| H5 | `src/backend/target/` | Compiled `.class` files committed to repo. | Unnecessary bloat; should be gitignored. |

### Medium

| # | Location | Issue | Impact |
|---|----------|-------|--------|
| M1 | Frontend `package.json` | Unused dependencies: zustand, react-query, react-table. | Increased install time, confusion for new developers. |
| M2 | Backend `pom.xml` | MapStruct declared but never used (no mapper interfaces). | Dead dependency. |
| M3 | `src/SpecKit/` | SpecKit tooling placed inside `src/`, but it's project tooling, not application source code. | Misleading location. |
| M4 | `docs/test/.gitkeep` and `src/tests/.gitkeep` | Empty directories with placeholder files. | Suggests tests were planned but not implemented. |
| M5 | `README_FILE.md` | Non-standard filename for README. | GitHub won't render it on the repo home page. |

### Low

| # | Location | Issue | Impact |
|---|----------|-------|--------|
| L1 | Multiple controllers | Minor inconsistency in authorization annotation: some use `@IsStudent`, others `@PreAuthorize("hasRole('STUDENT')")`. | Inconsistent security approach. |
| L2 | `GradeServiceImpl.java:57` | `gradePoint` value passed as both `gradePoint` and `gpaImpact` — likely a bug or placeholder. | Incorrect GPA impact calculation. |
| L3 | `CourseServiceImpl.java` and `EnrollmentServiceImpl.java` | `mapToOfferingResponse()` and `mapToCourseResponse()` duplicated across two services. | DRY violation. |
| L4 | No CI/CD | No GitHub Actions workflow for build/test/lint. | Manual quality gates. |

---

## 6. Code Quality Problems

### Large Files
All files are reasonably sized (largest: `AppealServiceImplTest.java` at 402 lines). No action needed.

### Duplicated Code
1. `mapToOfferingResponse()` duplicated in `CourseServiceImpl` and `EnrollmentServiceImpl`.
2. `mapToCourseResponse()` duplicated in `CourseServiceImpl` and `EnrollmentServiceImpl`.
3. `useAuth.tsx` duplicated in `auth/` and `hooks/`.
4. `authService.ts` duplicated in `auth/` and `services/`.
5. `mapToDto` in `ProfileController` duplicates logic in `ProfileServiceImpl.mapToResponse`.

### Mixed Responsibilities
- `Student` and `Administrator` entities serve double duty as JPA entities AND Spring Security `UserDetails` implementations.

### Business Logic in Controller
- `ProfileController.getProfile()` contains entity-to-DTO mapping logic that belongs in the service layer.

### Direct Database Access from Controller
- `ProfileController.getProfile()` calls `studentRepository.findByUsername()` directly.

### Hard-Coded Configuration
- Default JWT secret and database credentials in `application.properties`.

### Weak Error Handling
- Error handling is actually well-structured with a `GlobalExceptionHandler`. However:
  - `AuthController.login()` catches `AuthenticationException` but only logs a warning; no detailed error response.
  - `FinanceController` has null `Principal` checks that should never trigger (Spring Security guarantees authentication before reaching `@PreAuthorize`).

### Inconsistent Conventions
- API path prefixes: some `/api/`, some `/api/v1/`.
- Authorization: some `@IsStudent`/`@IsAdministrator` custom annotations, some `@PreAuthorize("hasRole(...)")`.
- DTOs: some use Lombok `@Data`, some use manual getters/setters.

# Proposed Architecture – MyUS University Portal

> **Date:** 2026-07-29
> **Status:** Proposal

---

## 1. Recommended Architecture

### Selection: **Layered Architecture** (Refined)

The project already uses a layered architecture. The proposal is to **refine** it rather than replace it.

**Why Layered Architecture fits this project:**

1. **Project scale is appropriate** — A student project with ~8 controllers and ~6 services. Clean Architecture or DDD would overcomplicate things.
2. **Team familiarity** — The team already understands the layered pattern.
3. **Technology stack aligns** — Spring Boot naturally supports layered architecture with `@Controller`, `@Service`, `@Repository`.
4. **Low migration risk** — Refinement requires adding clear boundaries, not a full rewrite.
5. **Testability** — Layer separation enables isolated unit tests for services without Spring context.

### Architecture Diagram

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  controllers/ + dto/                │  ← HTTP, validation, DTO mapping
├─────────────────────────────────────┤
│        Application Layer            │
│  service/                           │  ← Business logic, transactions,
│                                       ← orchestration, use cases
├─────────────────────────────────────┤
│          Domain Layer               │
│  entity/                            │  ← JPA entities, enums
│                                       ← (decouple from Spring Security)
├─────────────────────────────────────┤
│      Infrastructure Layer           │
│  repository/ + config/ + security/  │  ← Data access, auth, CORS
│  exception/ + util/                 │
└─────────────────────────────────────┘
```

### Dependency Direction

```
  Presentation (controllers)
        ↓
  Application (services)
        ↓
     Domain (entities)
        ↑
  Infrastructure (repositories, security)
```

**Rules:**
- Controllers depend only on services and DTOs.
- Services depend on repositories and entities.
- Entities depend on nothing (pure domain objects).
- Infrastructure implements interfaces defined by the domain/application.

**Forbidden:**
- Controllers → Repositories (direct data access)
- Controllers → Entities (direct JPA usage in presentation)
- Domain → Framework (entities implementing Spring Security interfaces)
- Circular dependencies between modules

---

## 2. Proposed Directory Structure

```
src/backend/src/main/java/com/myus/
├── UniversityPortalApplication.java        # Entry point
├── config/
│   ├── CorsConfig.java                     # CORS configuration
│   ├── JwtProperties.java                  # JWT property binding
│   └── package-info.java
├── controller/                             # REST layer (presentation)
│   ├── AppealController.java
│   ├── AppealAdminController.java
│   ├── AuthController.java
│   ├── CourseController.java
│   ├── EnrollmentController.java
│   ├── FinanceController.java
│   ├── GradeController.java
│   ├── ProfileController.java
│   └── package-info.java
├── dto/                                    # API contracts
│   └── (*.java - Request/Response DTOs)
├── entity/                                 # Domain model
│   └── (*.java - JPA entities, enums)
├── exception/                              # Error handling
│   ├── ApiError.java
│   ├── GlobalExceptionHandler.java
│   └── (*Exception.java)
├── repository/                             # Data access
│   └── (*Repository.java)
├── security/                               # Auth infrastructure
│   ├── SecurityConfig.java
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtAuthenticationEntryPoint.java
│   ├── UserDetailsServiceImpl.java
│   ├── IsStudent.java
│   ├── IsAdministrator.java
│   └── package-info.java
├── service/                                # Business logic
│   ├── AppealService.java
│   ├── AppealServiceImpl.java
│   ├── CourseService.java
│   ├── CourseServiceImpl.java
│   ├── EnrollmentService.java
│   ├── EnrollmentServiceImpl.java
│   ├── FinanceService.java
│   ├── FinanceServiceImpl.java
│   ├── GradeService.java
│   ├── GradeServiceImpl.java
│   ├── ProfileService.java
│   ├── ProfileServiceImpl.java
│   └── package-info.java
└── util/
    └── package-info.java
```

**Frontend:**

```
src/frontend/src/
├── App.tsx                        # Root component + router
├── index.tsx                      # Entry point
├── index.css                      # Global styles
├── api/                           # HTTP client configuration
│   └── axiosInstance.ts
├── auth/                          # Authentication (single source of truth)
│   ├── index.ts                   # Barrel exports
│   ├── useAuth.tsx                # Auth context + hook
│   ├── ProtectedRoute.tsx         # Route guard
│   └── authService.ts             # Login/logout API calls
├── components/                    # Shared UI components
│   ├── Layout/
│   ├── PlaceholderPage/
│   └── Sidebar/
├── pages/                         # Feature pages
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── NotFoundPage.tsx
│   ├── admin/
│   │   └── AdminPage.tsx
│   ├── appeals/
│   │   └── AppealsPage.tsx
│   ├── courses/
│   │   └── CoursesPage.tsx
│   ├── grades/
│   │   └── GradesPage.tsx
│   ├── profile/
│   │   └── ProfilePage.tsx
│   ├── support/
│   │   └── SupportPage.tsx
│   ├── timetable/
│   │   └── TimetablePage.tsx
│   └── tuition/
│       └── TuitionPage.tsx
├── services/                      # API service functions
│   ├── api.ts
│   ├── courseService.ts
│   └── profileService.ts
├── tests/                         # Test files
├── types/                         # TypeScript interfaces
│   └── index.ts
└── utils/                         # Constants & helpers
    ├── constants.ts
    └── tokenUtils.ts
```

**Key changes from current state:**
1. Remove `src/frontend/src/hooks/` (merge into `auth/`).
2. Remove `src/frontend/src/services/authService.ts` (already in `auth/`).
3. Move `src/SpecKit/` to root level (it's tooling, not source code).

---

## 3. Module Responsibilities

### `controller/` (Presentation Layer)
- **Responsibility:** Accept HTTP requests, validate input, delegate to services, return HTTP responses.
- **Allowed dependencies:** `service/`, `dto/`, `security/` (for `@IsStudent`, `@PreAuthorize` annotations).
- **Forbidden:** `repository/`, `entity/` (direct entity usage).
- **Convention:** One controller per resource; thin controllers with minimal logic.

### `service/` (Application Layer)
- **Responsibility:** Business logic, orchestration, transaction management, DTO mapping.
- **Allowed dependencies:** `repository/`, `entity/`, `dto/`.
- **Forbidden:** HTTP concerns (`HttpServletRequest`, `HttpServletResponse`, raw request handling).
- **Convention:** Interface + Implementation pattern; `@Transactional` on write operations.

### `entity/` (Domain Layer)
- **Responsibility:** JPA-mapped domain model. Pure data objects.
- **Allowed dependencies:** JPA annotations, Lombok.
- **Forbidden:** Spring Security `UserDetails`, any framework-specific interfaces.
- **Fix:** Extract `UserDetails` implementation into separate classes (e.g., `StudentUserDetails`, `AdminUserDetails`) in the `security/` package.

### `repository/` (Infrastructure)
- **Responsibility:** Database access via Spring Data JPA.
- **Allowed dependencies:** `entity/`.
- **Forbidden:** Business logic.

### `dto/` (API Contracts)
- **Responsibility:** Define request/response shapes for the API.
- **Allowed dependencies:** Validation annotations, Lombok.
- **Forbidden:** JPA annotations, business logic.

### `security/` (Infrastructure)
- **Responsibility:** Authentication, authorization, JWT handling.
- **Allowed dependencies:** `config/`, `entity/`, `repository/`.

---

## 4. Design Patterns

### 4.1 Service Layer Pattern
**Already in use.** Each business domain has a service interface (`AppealService`) and implementation (`AppealServiceImpl`). The controller depends on the interface.

**Justification:** Decouples controllers from business logic; enables mock-based unit testing.

### 4.2 Repository Pattern
**Already in use** via Spring Data JPA. Each entity has a repository interface extending `JpaRepository`.

### 4.3 DTO Pattern
**Already in use.** API requests and responses are defined as separate DTO classes, preventing entity exposure.

### 4.4 Global Exception Handler
**Already in use** (`GlobalExceptionHandler`). Provides consistent API error responses.

### 4.5 Dependency Injection (Constructor Injection)
**Already in use.** All controllers and services use constructor injection.

### 4.6 Builder Pattern (via Lombok `@Builder`)
**Not currently in use.** Recommended for DTOs with many fields to improve readability over large constructors.

---

## 5. Patterns to Avoid

- **Mapper/Adapter with single implementation** — Not needed at this scale.
- **Command/Query Separation (CQRS)** — Overkill for a single-database student project.
- **Event Sourcing** — Not applicable.
- **Factory Pattern** — Not needed unless complex object creation logic emerges.

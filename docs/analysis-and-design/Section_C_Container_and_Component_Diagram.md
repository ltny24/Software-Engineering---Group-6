# Section C: Software Architecture - Container & Component Diagrams

---

## 1. C4 Model - Level 2: Container Diagram
**Performed by:** Trần Tường Vi | **Reviewed by:** Hoàng Trung Kiên | **Edited by:** Trần Tường Vi


### 1.1. Introduction & Container Boundary Overview

The **C4 Model Level 2 (Container Diagram)** zooms in on the single black-box system boundary established in Level 1 (System Context Diagram). While Level 1 illustrates how human actors and external software platforms interact with the **MyUS University Portal System** as a whole, Level 2 expands the internal architecture to reveal the high-level deployable units and executable containers that constitute the application suite.

The container topology of the **MyUS University Portal System** is structured into four primary internal containers:
1. **Frontend Web Application (React 18 SPA):** The client-side Single Page Application running within the user's web browser. It delivers responsive, interactive user interfaces for Student Self-Service and Administrative Governance workflows.
2. **Backend API Server (Spring Boot 3.x REST API):** The stateless core business logic engine, security gateway, transaction orchestrator, and external integration hub that processes client requests and enforces enterprise rules.
3. **Relational Database (Microsoft SQL Server):** The primary relational system of record storing all structured domain data, including user credentials, student profiles, course offerings, enrollment records, grade appeal cases, tuition data, and system audit logs.
4. **Local File Storage System:** A dedicated binary object storage container responsible for persisting physical evidentiary attachments (`.pdf`, `.jpg`, `.png`) submitted during grade appeal workflows (**UC-07a**).

The Container Diagram also documents the precise communication protocols (HTTPS/REST, JDBC, SMTP, Local File I/O) used across internal container boundaries and with external software integrations (**Google Gemini LLM API** and **Campus SMTP Email Gateway**).

---

### 1.2. C4 Level 2 Container Diagram (Mermaid)

```mermaid
flowchart TB
    %% C4 Model Styling Definitions
    classDef person fill:#08427b,stroke:#052e56,stroke-width:2px,color:#ffffff,font-weight:bold
    classDef container fill:#1168bd,stroke:#0b4884,stroke-width:2px,color:#ffffff,font-weight:bold
    classDef database fill:#2b78e4,stroke:#0b4884,stroke-width:2px,color:#ffffff,font-weight:bold
    classDef external fill:#999999,stroke:#666666,stroke-width:2px,color:#ffffff,font-style:italic

    %% Primary Actors (People)
    Student["[Person]<br><b>Student</b><br>Undergraduate learner performing self-service academic actions, viewing grades, submitting appeals, and interacting with AI advisor."]:::person

    Admin["[Person]<br><b>Administrator</b><br>Academic Affairs officer managing data imports, class controls, grade appeal reviews, and student records."]:::person

    %% System Boundary
    subgraph SystemBoundary ["MyUS University Portal System (System Boundary)"]
        direction TB

        Frontend["[Container: Single Page Application]<br><b>Frontend Web Application</b><br>(React 18, TypeScript, Axios, React Router)<br>Provides responsive UI, client-side routing, form validation, and reactive state management."]:::container

        Backend["[Container: Web API Application]<br><b>Backend API Server</b><br>(Spring Boot 3.x, Spring Security, JPA, Java 17)<br>Executes RESTful API services, security rules, transaction management, AI orchestration, and file operations."]:::container

        Database[(" [Container: Relational Database]<br><b>SQL Server Database</b><br>(Microsoft SQL Server 2019/2022)<br>Stores structured domain data, academic records, users, enrollments, appeals, and Flyway migration logs. ")]:::database

        FileStorage[(" [Container: File System / Binary Storage]<br><b>Local File Storage</b><br>(OS File System / Storage Volume)<br>Stores binary evidence attachments (.pdf, .jpg, .png) for grade appeal cases (UC-07a). ")]:::database
    end

    %% External Systems
    GeminiAI["[External System]<br><b>Google Gemini / OpenAI LLM API</b><br>Cloud-based Large Language Model powering AI advising and personalized recommendations."]:::external

    EmailGateway["[External System]<br><b>Campus SMTP Email Gateway</b><br>University mail infrastructure for sending notification emails and fee deadline alerts."]:::external

    %% Communication Flows
    Student -->|"Accesses portal, submits requests, views content<br>(HTTPS / HTML5 / React SPA)"| Frontend
    Admin -->|"Executes administrative tasks, manages records<br>(HTTPS / HTML5 / React SPA)"| Frontend

    Frontend -->|"Sends REST API requests and JWT tokens<br>(HTTPS / REST / JSON and Multipart Data)"| Backend

    Backend -->|"Reads/writes structured domain data and logs<br>(JDBC / TCP Port 1433 / HikariCP Pool)"| Database
    Backend -->|"Persists and reads grade appeal attachments<br>(Local File I/O / Java NIO / POSIX Path)"| FileStorage

    Backend -->|"Dispatches RAG prompts and fetches course recommendations<br>(HTTPS / REST API / TLS 1.2+)"| GeminiAI
    Backend -->|"Sends transactional email and security alerts<br>(SMTP / SMTPS / TCP Port 587)"| EmailGateway
```

---

### 1.3. Detailed Container Specifications

#### A. Frontend Web Application (React 18 SPA)

* **a) Primary Responsibility & Services Provided:**
  * Serves as the interactive Single Page Application (SPA) client executing entirely within the end-user's web browser.
  * Renders dynamic user interface views tailored to role-specific capabilities (Student Self-Service vs. Administrative Governance).
  * Manages client-side routing using `react-router-dom`, enforcing Role-Based Access Control (RBAC) through protected route wrappers to block unauthorized access to administrative modules.
  * Handles interactive client state using `zustand` and React custom hooks for course registration carts (**UC-03**), semester grade filtering (**UC-05**), and real-time AI counseling sessions (**UC-03b**).
  * Performs client-side form construction and runtime schema validation using `react-hook-form` and `zod` to validate user input before network transmission.
  * Manages asynchronous HTTP communications with the backend using `axios`, incorporating global request interceptors for automatic JWT Bearer header injection and response interceptors for centralized authentication failure handling.
  * Provides drag-and-drop file upload interface (`react-dropzone`) with format and size verification for supporting document submission in grade appeals (**UC-07a**).
  * Displays data analytics and academic progress charts using `recharts` for GPA tracking and credit completion visualization.

* **b) Technology Stack & Framework Justification:**
  * **React 18.3:** Provides a declarative, component-driven UI architecture with efficient Virtual DOM reconciliation, enabling smooth state updates without page refreshes.
  * **TypeScript 5.4:** Guarantees strict compile-time type safety across DTO interfaces, API response structures, and component props, preventing runtime errors and maintaining exact contract synchronization with backend APIs.
  * **React Router DOM 6.23:** Delivers declarative SPA client routing, code-splitting capabilities, and navigation guard integration.
  * **Axios 1.7:** Provides a robust HTTP client supporting request/response interceptors, request cancellation, and multi-part upload handling.
  * **Zustand 4.5 & React Hook Form 7.51:** Offers lightweight state management and optimized form rendering with minimal re-render overhead.
  * **Plain CSS with BEM Convention:** Enables modular, responsive styling adhering to multi-device viewport breakpoints without requiring third-party CSS framework dependencies.

* **c) Inter-Container Communication Protocols:**
  * **Target Container:** Backend API Server.
  * **Protocol:** HTTPS (HTTP/1.1 or HTTP/2 over TLS 1.2+ encryption).
  * **Data Payload Format:** Standard API calls transmit structured JSON (`application/json`). Supporting evidence file uploads use `multipart/form-data`.
  * **Authentication Transport:** Stateless HTTP Bearer authentication header (`Authorization: Bearer <JWT_TOKEN>`).

---

#### B. Backend API Server (Spring Boot 3.x REST API)

* **a) Primary Responsibility & Services Provided:**
  * Serves as the core business logic engine, security gateway, and API server for all university portal operations.
  * Enforces stateless authentication and method-level Role-Based Access Control (RBAC) using Spring Security 6, custom `JwtAuthenticationFilter`, and `@PreAuthorize` security annotations.
  * Validates incoming REST API request payloads via Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@Pattern`) before invoking business services.
  * Executes core academic domain logic, including prerequisite/corequisite validation algorithms (**UC-03a**), dual 10-point and 4-point GPA calculations (**UC-05**), and grade appeal state machine transitions (**UC-07**, **UC-16**).
  * Manages transactional ACID boundaries across database operations using `@Transactional` annotations to prevent partial data writes during high-concurrency operations.
  * Coordinates binary document storage operations through `FileStorageService` to validate, store, and stream grade appeal evidence files.
  * Handles global error handling through a `@ControllerAdvice` middleware, transforming unexpected exceptions into standardized JSON error responses (**NFR ID14**).
  * Acts as an integration adapter, constructing RAG context prompts for the Google Gemini LLM API and generating transactional email notifications via JavaMailSender.
  * Exposes interactive OpenAPI v3 API documentation via Springdoc Swagger UI.

* **b) Technology Stack & Framework Justification:**
  * **Spring Boot 3.2.5 (Java 17):** Provides an enterprise-grade Java web framework with embedded Tomcat runtime, dependency injection, and comprehensive ecosystem support.
  * **Spring Security 6 & JJWT 0.12.5:** Enforces industry-standard authentication, BCrypt password hashing (10 work factor rounds), and stateless JWT generation/verification.
  * **Spring Data JPA & Hibernate ORM:** Simplifies relational database persistence, offering repository abstraction, connection pooling, and object-relational mapping while preventing SQL injection.
  * **MapStruct 1.5.5 & Lombok:** Automatically generates compile-time DTO-to-Entity mapper code, reducing boilerplate code and increasing maintainability.
  * **Flyway Core & Flyway SQL Server:** Executes version-controlled, repeatable database schema migrations (`V1__...sql`) during application startup.
  * **Spring Boot Actuator:** Exposes monitoring endpoints for application health checking and runtime metrics.

* **c) Inter-Container Communication Protocols:**
  * **Inbound (from Frontend Web App):** HTTPS REST API listening on Port 8080 (development) / Port 443 (production).
  * **Outbound (to Relational Database):** Synchronous JDBC protocol over TCP/IP Port 1433, managed by HikariCP Connection Pool.
  * **Outbound (to Local File Storage):** Direct POSIX / Java NIO FileSystem calls (`java.nio.file.Files`) accessing dedicated host directory `/uploads/appeals/`.
  * **Outbound (to Google Gemini API):** HTTPS REST API calls (TLS 1.2+) over Port 443.
  * **Outbound (to Campus SMTP Gateway):** SMTP / SMTPS protocol over TCP Port 587 using Spring `JavaMailSender`.

---

#### C. Relational Database (Microsoft SQL Server 2019/2022)

* **a) Primary Responsibility & Services Provided:**
  * Functions as the central System of Record (SSOT) for all persistent, structured domain entities within the MyUS ecosystem.
  * Maintains relational tables including `users`, `students`, `course_offerings`, `enrollments`, `grade_appeals`, `tuition_invoices`, `class_transfer_requests`, `chatbot_sessions`, `faq_articles`, `surveys`, and system `audit_logs`.
  * Enforces referential integrity using primary key / foreign key relationships, cascade constraints, unique indexes, and check constraints.
  * Guarantees ACID compliance (Atomicity, Consistency, Isolation, Durability) for concurrent database transactions, such as seat reservation locks during course registration.
  * Records database schema evolution history through Flyway tracking tables (`flyway_schema_history`).
  * Maintains optimized indices on high-frequency search fields (student IDs, course codes, semester IDs, appeal statuses) to maintain low query latency (**NFR ID05**).

* **b) Technology Stack & Framework Justification:**
  * **Microsoft SQL Server 2019/2022:** Chosen for its enterprise robustness, advanced indexing engine, strong ACID transaction guarantees, and institutional compatibility with university infrastructure.
  * **Flyway Database Migration Scripts:** Managed via SQL scripts in `src/main/resources/db/migration/` to guarantee identical schema state across development, testing, and production environments.

* **c) Inter-Container Communication Protocols:**
  * **Target Container:** Backend API Server.
  * **Protocol:** Synchronous JDBC (Java Database Connectivity) via Microsoft SQL Server JDBC Driver (`com.microsoft.sqlserver:mssql-jdbc`).
  * **Network Transport:** TCP/IP over Port 1433.
  * **Connection Management:** HikariCP connection pool with configurable min/max connection bounds, leak detection, and parameterized query execution to block SQL injection attacks.

---

#### D. Local File Storage Container (Binary Storage System)

* **a) Primary Responsibility & Services Provided:**
  * Operates as a dedicated binary file repository for persisting non-relational attachments uploaded during Grade Appeal submissions (**UC-07a**).
  * Stores supporting evidentiary documents (`.pdf`, `.jpg`, `.png`, up to 5 MB per file) within isolated server storage directories.
  * Executes file type verification, file size enforcement, and UUID-based file renaming to prevent file name collisions and directory traversal security attacks.
  * Provides binary file stream retrieval for authorized administrators reviewing appeals (**UC-14**) and students checking appeal status (**UC-08**).

* **b) Technology Stack & Framework Justification:**
  * **OS File System / Storage Volume:** Native file system storage directory managed through Spring Boot's `FileStorageService` bean.
  * **Architectural Justification:** Separating binary storage from the relational database avoids database BLOB bloat, improves database backup speeds, reduces memory usage during JPA queries, and enhances overall database query throughput.

* **c) Inter-Container Communication Protocols:**
  * **Target Container:** Backend API Server.
  * **Protocol:** Direct local file I/O operations via Java NIO (`java.nio.file.Path`, `java.nio.file.Files`).
  * **Storage Interface:** Synchronous file creation, reading, and deletion triggered by REST API file controller endpoints. Relational metadata (relative storage path, original filename, file size, MIME type, upload timestamp) is persisted in SQL Server, while raw binary files reside on disk.

---

## 2. C4 Model - Level 3: Component Diagrams
**Performed by:** Dương Minh Huỳnh Khôi | **Reviewed by:** Hoàng Trung Kiên | **Edited by:** Dương Minh Huỳnh Khôi

### 2.1. Introduction to Level 3 Component Diagrams

The **C4 Model Level 3 (Component Diagram)** zooms into the two primary containers identified in the Level 2 Container Diagram — the **Backend API Server (Spring Boot 3.x)** and the **Frontend Web Application (React 18 SPA)** — to reveal their internal component composition, responsibilities, and inter-component relationships.

While Level 2 illustrates how containers communicate across the system boundary, Level 3 exposes the internal modular structure of each container. This decomposition maps directly to the source code package structure, ensuring architectural documentation remains consistent with the actual implementation as required by the PA4 grading criteria.

The component topology for each container is organized as follows:

| Container | Architectural Style | Key Structural Layers |
|-----------|---------------------|-----------------------|
| **Backend API Server** | Layered Architecture (Controller → Service → Repository) | REST Controllers, Business Services, Data Repositories, Security Infrastructure, Cross-Cutting Config & Exception Handling |
| **Frontend Web Application** | Component-Based SPA with Context API | Route-Level Pages, Shared UI Components, Auth Module, API Service Layer, Utility Modules |

---

### 2.2. Backend API Server — Level 3 Component Diagram

The Backend API Server is structured as a **Layered Architecture** with four primary layers and two cross-cutting concern groups. The component diagram below reflects the actual package structure at `backend/src/myus/`.

#### 2.2.1. Component Diagram (Mermaid)

```mermaid
flowchart TB
    classDef controller fill:#1168bd,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef service fill:#438dcc,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef repository fill:#2b78e4,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef security fill:#6c3a9e,stroke:#4a2870,stroke-width:2px,color:#fff,font-weight:bold
    classDef config fill:#7a9e3a,stroke:#5a7a2a,stroke-width:2px,color:#fff,font-weight:bold
    classDef exception fill:#c93a3a,stroke:#8b2020,stroke-width:2px,color:#fff,font-weight:bold
    classDef external fill:#999,stroke:#666,stroke-width:2px,color:#fff,font-style:italic

    subgraph ControllerLayer["REST CONTROLLER LAYER"]
        direction TB
        AuthCtrl["AuthController | POST /api/auth/login | Authenticates users, returns JWT"]:::controller
        CourseCtrl["CourseController | GET /api/courses, GET /api/courses/:id | Course catalog browsing"]:::controller
        EnrollmentCtrl["EnrollmentController | POST+GET /api/registrations, PUT drop | Enrollment lifecycle"]:::controller
        GradeCtrl["GradeController | GET /api/v1/grades/me | Student grade retrieval"]:::controller
        FinanceCtrl["FinanceController | GET /api/v1/finance/tuition | Tuition balance and payments"]:::controller
        ProfileCtrl["ProfileController | GET+PUT /api/v1/profile | Student profile view and update"]:::controller
        AppealCtrl["AppealController | POST+GET /api/appeals/me, PUT withdraw | Student appeal operations"]:::controller
        AppealAdminCtrl["AppealAdminController | GET+PUT /api/admin/appeals | Admin appeal processing"]:::controller
    end

    subgraph ServiceLayer["SERVICE LAYER"]
        direction TB
        CourseSvc["CourseService | browseCourses(), getOfferingById() | Catalog with pagination, uses CourseOfferingRepo and CourseRegistrationRepo"]:::service
        EnrollmentSvc["EnrollmentService | registerCourse(), getMyRegistrations(), dropRegistration() | Enrollment lifecycle"]:::service
        GradeSvc["GradeService | getMyGrades() | GPA 10-point and 4-point scale calculation"]:::service
        FinanceSvc["FinanceService | getTuitionBalance(), getPaymentHistory() | Financial aggregation"]:::service
        ProfileSvc["ProfileService | getProfile(), updateProfile() | Profile CRUD with partial update"]:::service
        AppealSvc["AppealService | submit, list, withdraw, review appeals | State machine and deadline logic"]:::service
    end

    subgraph RepositoryLayer["REPOSITORY LAYER"]
        direction TB
        StudentRepo["StudentRepository | findByUsername(), existsByUsername()"]:::repository
        AdminRepo["AdministratorRepository | findByUsername()"]:::repository
        CourseRepo["CourseRepository | findByDepartment(), searchByKeyword()"]:::repository
        CourseOffRepo["CourseOfferingRepository | search with custom @Query, findByTerm()"]:::repository
        RegRepo["CourseRegistrationRepository | findByStudent, countActiveByOffering"]:::repository
        GradeRepo["GradeRepository | findByStudent, findByStudentAndTerm"]:::repository
        AppealRepo["AppealRepository | findByStudent, findByStatus, countByStatus"]:::repository
        TuitionAccRepo["TuitionAccountRepository | findByStudent, findByStudentAndTerm"]:::repository
        TuitionPayRepo["TuitionPaymentRepository | findByAccountId()"]:::repository
    end

    subgraph SecurityLayer["SECURITY INFRASTRUCTURE"]
        direction TB
        SecConfig["SecurityConfig | Filter chain: stateless, CSRF disabled, method security"]:::security
        JwtProvider["JwtTokenProvider | JWT generation, validation, claim extraction"]:::security
        JwtFilter["JwtAuthenticationFilter | Extracts Bearer token, sets SecurityContext"]:::security
        JwtEntry["JwtAuthenticationEntryPoint | Returns structured 401 JSON response"]:::security
        UserDetailsSvc["UserDetailsServiceImpl | Loads Student or Administrator by username"]:::security
        IsStudentAnn["@IsStudent / @IsAdministrator | Custom method-security meta-annotations"]:::security
    end

    subgraph ConfigLayer["CONFIGURATION"]
        direction TB
        CorsCfg["CorsConfig | Global CORS policy for frontend origin"]:::config
        JwtProps["JwtProperties | Binds jwt.secret and jwt.expiration-ms"]:::config
        DevInit["DevDataInitializer | Seeds admin and student users on dev startup"]:::config
    end

    subgraph ExceptionLayer["EXCEPTION HANDLING"]
        direction TB
        GlobalEx["GlobalExceptionHandler | @RestControllerAdvice: handles 400, 404, 409, 500"]:::exception
        ApiErr["ApiError | Standard error DTO: timestamp, status, message, path"]:::exception
    end

    Database[("SQL Server Database | myus schema | 14 tables")]:::external
    FileStore[("Local File Storage | Grade appeal evidence documents")]:::external

    CourseCtrl --> CourseSvc
    EnrollmentCtrl --> EnrollmentSvc
    GradeCtrl --> GradeSvc
    FinanceCtrl --> FinanceSvc
    ProfileCtrl --> ProfileSvc
    AppealCtrl --> AppealSvc
    AppealAdminCtrl --> AppealSvc

    CourseSvc --> CourseOffRepo
    CourseSvc --> RegRepo
    EnrollmentSvc --> RegRepo
    EnrollmentSvc --> CourseOffRepo
    EnrollmentSvc --> StudentRepo
    GradeSvc --> GradeRepo
    GradeSvc --> StudentRepo
    FinanceSvc --> TuitionAccRepo
    FinanceSvc --> TuitionPayRepo
    FinanceSvc --> StudentRepo
    ProfileSvc --> StudentRepo
    AppealSvc --> AppealRepo
    AppealSvc --> GradeRepo
    AppealSvc --> StudentRepo
    AppealSvc --> AdminRepo

    StudentRepo -.-> Database
    AdminRepo -.-> Database
    CourseRepo -.-> Database
    CourseOffRepo -.-> Database
    RegRepo -.-> Database
    GradeRepo -.-> Database
    AppealRepo -.-> Database
    TuitionAccRepo -.-> Database
    TuitionPayRepo -.-> Database

    AuthCtrl --> JwtProvider
    AuthCtrl -.-> SecConfig
    SecConfig --> JwtFilter
    SecConfig --> JwtEntry
    SecConfig --> UserDetailsSvc
    JwtFilter --> JwtProvider
    JwtFilter -.-> AuthCtrl
    UserDetailsSvc --> StudentRepo
    UserDetailsSvc --> AdminRepo

    GlobalEx -.-> AuthCtrl
    GlobalEx -.-> CourseSvc
    CorsCfg -.-> SecConfig
    JwtProps -.-> JwtProvider
```

#### 2.2.2. Detailed Component Descriptions — Backend

---

##### A. Controller Layer (Presentation)

The Controller Layer is the entry point for all HTTP requests. Each controller is annotated with `@RestController` and `@RequestMapping`, defining the API contract. Controllers are **thin**: they validate input via Jakarta Bean Validation (`@Valid`), extract the authenticated principal from the security context, delegate business logic to services, and return HTTP `ResponseEntity` objects wrapped around DTOs.

| Component | Base Path | Role | Auth Mechanism | Depends On |
|-----------|-----------|------|----------------|------------|
| **AuthController** | `/api/auth` | Authenticates users via Spring Security's `AuthenticationManager`, generates JWT tokens, returns `AuthResponse` with user info. | Public (`POST /login`) | `AuthenticationManager`, `JwtTokenProvider` |
| **CourseController** | `/api/courses` | Provides paginated course catalog browsing with optional search, department, and term filters. | `@PreAuthorize("isAuthenticated()")` | `CourseService` |
| **EnrollmentController** | `/api/registrations` | Manages the course registration lifecycle: register, list my enrollments, drop. | `@IsStudent` | `EnrollmentService` |
| **GradeController** | `/api/v1/grades` | Retrieves the authenticated student's grades with GPA computation (10-point and 4-point scales). | `@IsStudent` | `GradeService` |
| **FinanceController** | `/api/v1/finance` | Retrieves tuition balance summary and paginated payment history per term. | `@PreAuthorize("hasRole('STUDENT')")` | `FinanceService` |
| **ProfileController** | `/api/v1/profile` | Views and partially updates student profile fields (phone, address, email). | `@PreAuthorize("hasRole('STUDENT')")` | `ProfileService` |
| **AppealController** | `/api/appeals` | Student-facing grade appeal operations: submit new appeal, list my appeals, view detail, withdraw pending appeal. | `@IsStudent` | `AppealService` |
| **AppealAdminController** | `/api/admin/appeals` | Administrator-facing appeal processing: list all (with status filter), view detail, review and update status. | `@IsAdministrator` | `AppealService` |

**Architectural Notes:**
- API versioning is currently inconsistent: `/api/` prefix for courses, registrations, and appeals; `/api/v1/` prefix for grades, profile, and finance. This should be unified in a future refactoring.
- Authorization uses a mix of `@PreAuthorize` with SpEL and custom `@IsStudent`/`@IsAdministrator` meta-annotations — both approaches are functionally equivalent.

---

##### B. Service Layer (Business Logic)

The Service Layer encapsulates all business rules, domain logic, and transaction management. Each service follows the **Interface + Implementation** pattern (`XxxService` interface with `XxxServiceImpl` class), enabling mock-based unit testing. Write operations are guarded by `@Transactional` to ensure ACID compliance.

| Component | Key Methods | Business Responsibilities | Depends On |
|-----------|-------------|---------------------------|------------|
| **CourseService** | `browseCourses(page, size, search, department, term)`, `getOfferingById(id)` | Paginated catalog queries with dynamic filters; uses JOIN FETCH on CourseOfferingRepository; counts active enrollments via CourseRegistrationRepository. Maps `CourseOffering` entities to `CourseOfferingResponse` DTOs. | `CourseOfferingRepository`, `CourseRegistrationRepository` |
| **EnrollmentService** | `registerCourse(username, request)`, `getMyRegistrations(username)`, `dropRegistration(username, id)` | Validates seat availability and prerequisite eligibility; prevents duplicate enrollment; manages enrollment status transitions (`Enrolled` → `Dropped`); updates available seat counts. | `CourseRegistrationRepository`, `CourseOfferingRepository`, `StudentRepository` |
| **GradeService** | `getMyGrades(username)` | Retrieves all grade records for a student; computes cumulative GPA on both 10-point and 4-point scales; groups grades by academic term. | `GradeRepository`, `StudentRepository` |
| **FinanceService** | `getTuitionBalance(username)`, `getPaymentHistory(username)` | Computes current tuition balance (charges − payments − scholarships); checks financial hold status; retrieves chronological payment transaction history. | `TuitionAccountRepository`, `TuitionPaymentRepository`, `StudentRepository` |
| **ProfileService** | `getProfile(username)`, `updateProfile(username, request)` | Retrieves full student profile including personal info, major, enrollment status; performs partial updates on allowed fields (phone, address, email) while preserving immutable fields. | `StudentRepository` |
| **AppealService** | `submitAppeal(username, request)`, `getMyAppeals(username)`, `getAppealById(username, id)`, `withdrawAppeal(username, id)`, `getAllAppeals(status)`, `getAppealByIdAdmin(id)`, `reviewAppeal(id, adminUsername, request)` | Implements the full grade appeal state machine (`Submitted` → `Under Review` → `Approved`/`Denied`, or `Withdrawn`); calculates fee payment deadline (+5 business days); enforces appeal submission window validation; supports file evidence attachment metadata tracking; provides both student-scoped and admin-scoped queries. | `AppealRepository`, `GradeRepository`, `StudentRepository`, `AdministratorRepository` |

---

##### C. Repository Layer (Data Access)

Each repository is a Spring Data JPA interface extending `JpaRepository<T, ID>`, providing standard CRUD operations plus custom query methods. The repositories abstract all SQL interactions behind Java method calls, supporting HikariCP connection pooling and parameterized queries to prevent SQL injection.

| Repository | Primary Entity | Key Custom Queries |
|------------|---------------|-------------------|
| **StudentRepository** | `Student` | `findByUsername(String)`, `existsByUsername(String)` |
| **AdministratorRepository** | `Administrator` | `findByUsername(String)` |
| **CourseRepository** | `Course` | `findByDepartment(String)`, custom search by keyword |
| **CourseOfferingRepository** | `CourseOffering` | `findByTerm(String)`, `findByDepartment(String)`, `@Query` with dynamic search/filter predicates |
| **CourseRegistrationRepository** | `CourseRegistration` | `findByStudentUsername(String)`, `findByOfferingId(Long)`, `countByOfferingId(Long)` for seat capacity |
| **GradeRepository** | `Grade` | `findByStudentUsername(String)`, `findByStudentUsernameAndTerm(String, String)` |
| **AppealRepository** | `Appeal` | `findByStudentUsername(String)`, `findByStatus(String)`, `countByStatus(String)` for admin dashboard metrics |
| **TuitionAccountRepository** | `TuitionAccount` | `findByStudentUsername(String)`, `findByStudentUsernameAndTerm(String, String)` |
| **TuitionPaymentRepository** | `TuitionPayment` | `findByAccountId(Long)` ordered by payment date descending |

---

##### D. Security Infrastructure (Cross-Cutting)

The Security Infrastructure implements **stateless JWT-based authentication** with role-based access control. The filter chain processes every HTTP request before it reaches the controller layer.

| Component | Type | Responsibility |
|-----------|------|----------------|
| **SecurityConfig** | `@Configuration` | Defines the Spring Security filter chain: disables CSRF (stateless API), sets session management to `STATELESS`, configures CORS via `CorsConfigurationSource`, registers `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`, enables method-level security (`@EnableMethodSecurity`). Currently uses `NoOpPasswordEncoder` (plaintext) — a known issue to be addressed. |
| **JwtTokenProvider** | `@Component` | Generates signed JWT access tokens with embedded roles claim; validates token signature, expiry, and structure; extracts username and roles from validated tokens. Configured via `JwtProperties`. |
| **JwtAuthenticationFilter** | `OncePerRequestFilter` | Intercepts every HTTP request; extracts the `Bearer` token from the `Authorization` header; validates it via `JwtTokenProvider`; if valid, builds a `UsernamePasswordAuthenticationToken` and sets it in the `SecurityContextHolder`. |
| **JwtAuthenticationEntryPoint** | `AuthenticationEntryPoint` | Returns a structured JSON `ApiError` response (HTTP 401) when an unauthenticated request reaches a protected endpoint, instead of the default servlet container error page. |
| **UserDetailsServiceImpl** | `UserDetailsService` | Loads user details during authentication by looking up the username in both `StudentRepository` and `AdministratorRepository`; returns the matching entity (which implements `UserDetails`). |
| **@IsStudent** | Custom Annotation | Meta-annotation combining `@PreAuthorize("hasRole('STUDENT')")` for cleaner controller code. |
| **@IsAdministrator** | Custom Annotation | Meta-annotation combining `@PreAuthorize("hasRole('ADMINISTRATOR')")` for cleaner controller code. |

**Authentication Flow:**
1. `POST /api/auth/login` → `AuthController` authenticates via `AuthenticationManager` → `UserDetailsServiceImpl` loads user → `JwtTokenProvider` generates token → client stores token in `localStorage`.
2. Subsequent requests: `JwtAuthenticationFilter` extracts token → validates → sets `SecurityContext` → controller processes request with `Principal` available.
3. Authorization: `@IsStudent` / `@IsAdministrator` / `@PreAuthorize` annotations enforce role checks at the method level.

---

##### E. Configuration & Exception Handling (Cross-Cutting)

| Component | Type | Responsibility |
|-----------|------|----------------|
| **CorsConfig** | `@Configuration` | Defines a `CorsConfigurationSource` bean allowing cross-origin requests from the React frontend (`http://localhost:3000`), supporting common HTTP methods and the `Authorization` header. |
| **JwtProperties** | `@ConfigurationProperties` | Binds `jwt.secret` and `jwt.expiration-ms` from `application.properties` into a typed configuration object. |
| **DevDataInitializer** | `@Component` (dev profile) | Seeds the H2 database with demo users (`admin`/`admin` and `student`/`student`) on application startup when the `dev` profile is active. |
| **GlobalExceptionHandler** | `@RestControllerAdvice` | Centralized exception-to-JSON mapping. Handles: `MethodArgumentNotValidException` (400 with field-level details), `ResourceNotFoundException` (404), `AppealException` (409), `EnrollmentException` (409), `ConstraintViolationException` (400), and generic `Exception` (500). |
| **ApiError** | POJO | Standardized error response structure: `timestamp` (Instant), `status` (int), `error` (String), `message` (String), `path` (String), plus optional `fieldErrors` list for validation failures. |

---

### 2.3. Frontend Web Application — Level 3 Component Diagram

The Frontend Web Application is structured as a **Component-Based Single Page Application (SPA)** using React 18 with TypeScript. It follows a modular architecture with route-level pages, shared UI components, a centralized auth module, and a service-based API communication layer.

#### 2.3.1. Component Diagram (Mermaid)

```mermaid
flowchart TB
    classDef app fill:#08427b,stroke:#052e56,stroke-width:3px,color:#fff,font-weight:bold
    classDef page fill:#1168bd,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef component fill:#438dcc,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef auth fill:#6c3a9e,stroke:#4a2870,stroke-width:2px,color:#fff,font-weight:bold
    classDef service fill:#2b78e4,stroke:#0b4884,stroke-width:2px,color:#fff,font-weight:bold
    classDef util fill:#7a9e3a,stroke:#5a7a2a,stroke-width:2px,color:#fff,font-weight:bold
    classDef external fill:#999,stroke:#666,stroke-width:2px,color:#fff,font-style:italic

    subgraph AppShell["APP SHELL AND ROUTING"]
        direction TB
        AppEntry["App.tsx | BrowserRouter + AuthProvider + Toaster + Suspense | 10 lazy-loaded routes"]:::app
        IndexEntry["index.tsx | ReactDOM.createRoot entry point"]:::app
        GlobalCSS["index.css | CSS custom properties, reset, utility classes"]:::app
    end

    subgraph AuthModule["AUTH MODULE"]
        direction TB
        AuthProvider["AuthProvider / useAuth | React Context: user, isLoggedIn, setUser, logout | Rehydrates from localStorage"]:::auth
        ProtectedRoute["ProtectedRoute | Route guard: checks isLoggedIn and optional requiredRole | Redirects to /login or /dashboard"]:::auth
        AuthServiceComp["authService | login() via POST /api/auth/login | logout() clears localStorage"]:::auth
    end

    subgraph PagesLayer["PAGE COMPONENTS"]
        direction TB
        LoginPg["LoginPage | react-hook-form + zod validation | Route: /login (Public)"]:::page
        DashboardPg["DashboardPage | Role-based quick-access grid | Route: / (Protected)"]:::page
        ProfilePg["ProfilePage | View and edit profile (phone, address) | Route: /profile (Protected)"]:::page
        CoursesPg["CoursesPage | Browse catalog and manage enrollments | Route: /courses (Protected)"]:::page
        TimetablePg["TimetablePage | Weekly schedule grid and detailed list | Route: /timetable (Protected)"]:::page
        GradesPg["GradesPage | GPA 10-point and 4-point, term filtering | Route: /grades (Protected)"]:::page
        TuitionPg["TuitionPage | 4 KPI cards and payment history table | Route: /tuition (Protected)"]:::page
        AppealsPg["AppealsPage | PLACEHOLDER - appeal submission and tracking | Route: /appeals/* (Protected)"]:::page
        SupportPg["SupportPage | PLACEHOLDER - FAQ and AI chatbot | Route: /support (Protected)"]:::page
        AdminPg["AdminPage | PLACEHOLDER - student search, bulk import | Route: /admin/* (Admin Only)"]:::page
        NotFoundPg["NotFoundPage | 404 with link back to dashboard | Route: /404 (Public)"]:::page
    end

    subgraph SharedComponents["SHARED UI COMPONENTS"]
        direction TB
        LayoutComp["Layout | Authenticated page shell: Sidebar + main content area"]:::component
        SidebarComp["Sidebar | Role-based nav: 8 student items or 5 admin items | NavLink + logout"]:::component
        PlaceholderComp["PlaceholderPage | Reusable 'Coming Soon' for features under development"]:::component
    end

    subgraph ServiceLayerFE["API SERVICE LAYER"]
        direction TB
        AxiosInst["axiosInstance | Base URL, JWT request interceptor, 401 response handler"]:::service
        ApiWrapper["api.ts | Generic HTTP wrapper: get(), post(), put(), delete() | Returns response.data"]:::service
        CourseSvcFE["courseService | getCourses(), getMyRegistrations(), registerCourse(), dropRegistration()"]:::service
        ProfileSvcFE["profileService | getMyProfile(), updateMyProfile() | Calls /api/students/me"]:::service
    end

    subgraph UtilLayer["UTILITY AND TYPE MODULES"]
        direction TB
        ConstantsUtil["constants.ts | ROUTES paths, ROLES enum, API_BASE_URL, STORAGE_KEYS"]:::util
        TokenUtil["tokenUtils.ts | getAccessToken(), isAuthenticated(), clearSession() | JWT decode"]:::util
        TypesDef["types/index.ts | AuthUser, Course, CourseOffering, PagedResponse, etc."]:::util
    end

    BackendAPI["Backend API Server | Spring Boot REST API | HTTPS + JWT Bearer"]:::external

    IndexEntry --> AppEntry
    AppEntry --> AuthProvider
    AppEntry --> LoginPg
    AppEntry --> DashboardPg

    ProtectedRoute -.-> DashboardPg
    ProtectedRoute -.-> ProfilePg
    ProtectedRoute -.-> CoursesPg
    ProtectedRoute -.-> TimetablePg
    ProtectedRoute -.-> GradesPg
    ProtectedRoute -.-> TuitionPg
    ProtectedRoute -.-> AppealsPg
    ProtectedRoute -.-> SupportPg
    ProtectedRoute -.-> AdminPg

    DashboardPg --> LayoutComp
    ProfilePg --> LayoutComp
    CoursesPg --> LayoutComp
    TimetablePg --> LayoutComp
    GradesPg --> LayoutComp
    TuitionPg --> LayoutComp
    AppealsPg --> LayoutComp
    SupportPg --> LayoutComp
    AdminPg --> LayoutComp
    LayoutComp --> SidebarComp
    AppealsPg --> PlaceholderComp
    SupportPg --> PlaceholderComp
    AdminPg --> PlaceholderComp

    LoginPg --> AuthServiceComp
    ProfilePg --> ApiWrapper
    CoursesPg --> CourseSvcFE
    TimetablePg --> ApiWrapper
    GradesPg --> ApiWrapper
    TuitionPg --> ApiWrapper

    CourseSvcFE --> AxiosInst
    ProfileSvcFE --> AxiosInst
    ApiWrapper --> AxiosInst

    AuthProvider --> TokenUtil
    ProtectedRoute --> AuthProvider
    SidebarComp --> AuthProvider

    AxiosInst -.-> BackendAPI
    AuthServiceComp -.-> BackendAPI
```

#### 2.3.2. Detailed Component Descriptions — Frontend

---

##### A. App Shell & Routing

The App Shell is the entry point and architectural backbone of the SPA. It establishes the global provider hierarchy and defines all client-side routes.

| Component | File | Responsibility |
|-----------|------|----------------|
| **index.tsx** | `frontend/src/index.tsx` | Creates the React DOM root, renders `<App />` into the `#root` element, imports global CSS. |
| **App.tsx** | `frontend/src/App.tsx` | Configures `BrowserRouter`, wraps the entire tree in `AuthProvider` and `Toaster` (react-hot-toast for notifications), defines 10 routes with `React.lazy()` code-splitting and a `Suspense` fallback spinner. Redirects unknown paths (`*`) to `/404`. |
| **index.css** | `frontend/src/index.css` | Defines CSS custom properties (design tokens), global reset, typography scale, and shared utility classes used across all pages. |

**Route Table:**

| Path | Component | Guard | Layout | Status |
|------|-----------|-------|--------|--------|
| `/login` | LoginPage | Public (no guard) | None | ✅ Implemented |
| `/` | DashboardPage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/profile` | ProfilePage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/courses` | CoursesPage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/timetable` | TimetablePage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/grades` | GradesPage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/tuition` | TuitionPage | Protected (any authenticated) | Layout + Sidebar | ✅ Implemented |
| `/appeals/*` | AppealsPage | Protected (any authenticated) | Layout + Sidebar | 🔧 Placeholder |
| `/support` | SupportPage | Protected (any authenticated) | Layout + Sidebar | 🔧 Placeholder |
| `/admin/*` | AdminPage | Protected + Admin role | Layout + Sidebar | 🔧 Placeholder |
| `/404` | NotFoundPage | Public | None | ✅ Implemented |
| `*` | → redirect to `/404` | — | — | ✅ Implemented |

---

##### B. Auth Module

The Auth Module manages authentication state, protects routes, and handles login/logout API communication.

| Component | File | Responsibility | Consumed By |
|-----------|------|----------------|-------------|
| **AuthProvider** | `auth/useAuth.tsx` | React Context provider holding global auth state (`user`, `isLoggedIn`). Rehydrates `AuthUser` from `localStorage` on mount via `getStoredUser()` and `isAuthenticated()`. Provides `setUser` and `logout` functions. | Entire component tree (wrapped in `App.tsx`) |
| **useAuth()** | `auth/useAuth.tsx` | Custom hook exposing `{ user, isLoggedIn, setUser, logout }`. Components call this hook instead of consuming context directly. | `ProtectedRoute`, `Sidebar`, `DashboardPage` |
| **ProtectedRoute** | `auth/ProtectedRoute.tsx` | Route guard component. Checks `isLoggedIn` from `useAuth()` — redirects to `/login` if unauthenticated. If `requiredRole` prop is set, also checks `user.role` — redirects to `/dashboard` on mismatch. Preserves attempted URL in `location.state.from`. | All protected route definitions in `App.tsx` |
| **authService** | `auth/authService.ts` | `login(username, password)`: calls `POST /api/auth/login` via `axiosInstance`, stores JWT in `localStorage` via `tokenUtils`, returns `AuthResponse`. `logout()`: clears `localStorage` keys. | `LoginPage` (`login`), `AuthProvider` (`logout`) |

**Authentication Data Flow:**
1. `LoginPage` → `authService.login()` → `POST /api/auth/login` → receives JWT + user info → stores in `localStorage` via `tokenUtils` → calls `setUser()` on `AuthProvider`.
2. On page reload: `AuthProvider` mounts → `isAuthenticated()` checks token expiry → `getStoredUser()` decodes JWT payload → state rehydrated.
3. `ProtectedRoute` reads `isLoggedIn` from `useAuth()` → allows or redirects.
4. `axiosInstance` request interceptor reads token from `tokenUtils.getAccessToken()` and attaches `Authorization: Bearer <token>` to every API call.
5. On 401 response: `axiosInstance` response interceptor clears `localStorage` and redirects to `/login`.

---

##### C. Shared UI Components

| Component | File | Responsibility | Used By |
|-----------|------|----------------|---------|
| **Layout** | `components/Layout/Layout.tsx` | Provides the authenticated page shell: a CSS Grid layout with the `Sidebar` on the left and a scrollable `<main>` content area on the right. Wraps `children` passed from route definitions. | All protected route pages |
| **Sidebar** | `components/Sidebar/Sidebar.tsx` | Renders role-based navigation menu. For students: 8 nav items (Dashboard, Profile, Courses, Timetable, Grades, Tuition, Appeals, Support). For admins: 5 nav items (Dashboard, Students, Bulk Import, Transfers, Appeals). Uses `NavLink` for active-state CSS highlighting. Displays current user name/role and a logout button in the footer. | `Layout` |
| **PlaceholderPage** | `components/PlaceholderPage/PlaceholderPage.tsx` | Reusable "Under Development" placeholder with a title, description, and optional icon. Used for features planned but not yet fully implemented. | `AppealsPage`, `SupportPage`, `AdminPage` |

---

##### D. Page Components

Each page component is a route-level React component rendered inside the `Layout` shell (except `LoginPage` and `NotFoundPage`, which are standalone).

| Page | Status | API Dependencies | Key UI Elements | User Interactions |
|------|--------|-----------------|-----------------|-------------------|
| **LoginPage** | ✅ Full | `authService.login()` | Username + password fields (react-hook-form + zod validation), submit button, error alert. | Login → store JWT → navigate to dashboard. |
| **DashboardPage** | ✅ Full | None (pure navigation hub) | Role-based card grid: Student sees 8 quick-access cards, Admin sees 5 admin tool cards. | Click card → navigate to feature page. |
| **ProfilePage** | ✅ Full | `api.get/put('/api/v1/profile')` (generic `api` wrapper) | Read-only info display (student ID, name, email, major, status) + editable fields (phone, address). | Edit → form validation → save → toast confirmation. |
| **CoursesPage** | ✅ Full | `courseService.getCourses()`, `getMyRegistrations()`, `registerCourse()`, `dropRegistration()` | Two tabs (Browse + My Enrollments), search bar, department/term filters, paginated course cards with seat availability, enrollment status badges. | Search/filter → browse → register → toast success/error → drop enrollment. |
| **TimetablePage** | ✅ Full | Backend API (fallback to demo data) | Term selector dropdown, prev/next week navigation, 3 summary KPI cards (Total Courses, Scheduled Classes, Active Term), weekly grid overview, detailed schedule table (Day, Course Code, Course Name, Time, Room, Instructor, Type). | Select term → change week → view updated schedule. |
| **GradesPage** | ✅ Full | `api.get('/api/v1/grades/me')` | Term filter dropdown, 3 summary cards (GPA 10-point, GPA 4-point, Credits Earned), detailed grade table (7 columns: Course Code, Course Name, Credits, Midterm, Final, Grade 10-point, Letter Grade). | Select term → filter grades → view GPA recalculated. |
| **TuitionPage** | ✅ Full | `api.get()` for balance + payment history | 4 KPI summary cards (Total Charges, Scholarship, Amount Paid, Remaining Balance) with accent borders, payment history table (Reference, Date, Method, Amount, Status). | View financial overview → inspect payment transactions. |
| **AppealsPage** | 🔧 Placeholder | Not yet integrated | PlaceholderPage with "Appeals — Coming Soon" message. Planned: appeal submission form, status dashboard, detail drawer. | — |
| **SupportPage** | 🔧 Placeholder | Not yet integrated | PlaceholderPage with "Support — Coming Soon" message. Planned: FAQ search, AI chatbot interface. | — |
| **AdminPage** | 🔧 Placeholder | Not yet integrated | PlaceholderPage with "Admin — Coming Soon" message. Planned: student search, bulk import, class transfers, appeal review. | — |
| **NotFoundPage** | ✅ Full | None | "404 — Page Not Found" message with a link back to the dashboard. | Click link → navigate to dashboard. |

---

##### E. API Service Layer

The API Service Layer decouples page components from raw HTTP communication details. It handles JWT attachment, error interception, and response unwrapping.

| Component | File | Responsibility |
|-----------|------|----------------|
| **axiosInstance** | `api/axiosInstance.ts` | Pre-configured Axios instance with `baseURL` from constants, 10-second timeout, request interceptor that attaches `Authorization: Bearer <token>` from `tokenUtils.getAccessToken()`, response interceptor that handles 401 (clear storage → redirect to `/login`), 403 (log forbidden), and 5xx (log server error). |
| **api.ts** | `services/api.ts` | Generic HTTP wrapper (`get`, `post`, `put`, `delete`) that returns `response.data` directly (unwrapping the Axios response object). Used by `GradesPage` and `TuitionPage` for direct endpoint access. |
| **courseService** | `services/courseService.ts` | Typed service functions for course catalog and enrollment. Uses `axiosInstance` directly: `getCourses(params)` → `GET /api/courses`, `getMyRegistrations()` → `GET /api/registrations/me`, `registerCourse(offeringId)` → `POST /api/registrations`, `dropRegistration(id)` → `PUT /api/registrations/{id}/drop`. |
| **profileService** | `services/profileService.ts` | Typed service functions for student profile: `getMyProfile()` → `GET /api/students/me`, `updateMyProfile(updates)` → `PUT /api/students/me`. **Note:** The frontend calls `/api/students/me` but the backend exposes `/api/v1/profile` — this endpoint mismatch needs alignment. |

**API Communication Patterns:**
- **Pattern 1 (Service-based):** Page → `courseService` → `axiosInstance` → backend. Used by `CoursesPage` for course browsing, registration, and enrollment management.
- **Pattern 2 (Direct wrapper):** Page → `api.ts` → `axiosInstance` → backend. Used by `GradesPage` and `TuitionPage` for endpoints without dedicated service modules.
- **Pattern 3 (Auth):** `LoginPage` → `authService` → `axiosInstance` → backend. Auth-specific because it triggers the login flow and state update.

---

##### F. Utility & Type Modules

| Component | File | Responsibility |
|-----------|------|----------------|
| **constants.ts** | `utils/constants.ts` | Centralizes all route path strings (`ROUTES` object), role constants (`ROLES.STUDENT`, `ROLES.ADMIN`), `API_BASE_URL`, and `STORAGE_KEYS` for localStorage access. |
| **tokenUtils.ts** | `utils/tokenUtils.ts` | Client-side JWT management: `getAccessToken()` reads token from `localStorage`, `getStoredUser()` decodes JWT payload to extract `AuthUser`, `isAuthenticated()` checks token existence and expiry, `clearSession()` removes all auth-related localStorage keys. |
| **types/index.ts** | `types/index.ts` | TypeScript interface definitions for: `AuthUser` (userId, displayName, role), `StudentProfile`, `Course`, `CourseOffering`, `CourseRegistration`, `UserRole`, `PagedResponse<T>`, `GradeDTO`, `TuitionBalance`, `TuitionPayment`, and other API response types. Ensures type safety across all pages and services. |

---

### 2.4. Architectural Consistency Verification

Per PA4 requirements, the architecture diagrams must accurately reflect the actual source code implementation. The following verification was performed against the codebase at `backend/src/myus/` and `frontend/src/`:

| Artifact | Diagram Coverage | Source Code Match |
|----------|-----------------|-------------------|
| Backend Controllers | All 8 controllers documented with exact endpoint paths | ✅ `AuthController`, `CourseController`, `EnrollmentController`, `GradeController`, `FinanceController`, `ProfileController`, `AppealController`, `AppealAdminController` |
| Backend Services | All 6 service interface/impl pairs documented | ✅ `AppealService`, `CourseService`, `EnrollmentService`, `FinanceService`, `GradeService`, `ProfileService` |
| Backend Repositories | All 9 repository interfaces documented | ✅ Matches `backend/src/myus/repository/` |
| Backend Security | All 7 security components documented | ✅ `SecurityConfig`, `JwtTokenProvider`, `JwtAuthenticationFilter`, `JwtAuthenticationEntryPoint`, `UserDetailsServiceImpl`, `@IsStudent`, `@IsAdministrator` |
| Backend Exception Handling | `GlobalExceptionHandler` + `ApiError` documented | ✅ Matches `backend/src/myus/exception/` |
| Frontend Pages | All 11 page components documented (8 implemented, 3 placeholder) | ✅ Matches `frontend/src/pages/` |
| Frontend Auth | All 4 auth module files documented | ✅ `useAuth.tsx`, `ProtectedRoute.tsx`, `authService.ts`, `index.ts` |
| Frontend Shared Components | All 3 shared components documented | ✅ `Layout`, `Sidebar`, `PlaceholderPage` |
| Frontend Services | All 3 service modules documented | ✅ `api.ts`, `courseService.ts`, `profileService.ts` |
| Frontend Utils | All 3 utility/type modules documented | ✅ `constants.ts`, `tokenUtils.ts`, `types/index.ts` |

**Known Inconsistencies (documented for transparency):**
1. Frontend `profileService.ts` calls `/api/students/me` but is **not used by any page component**. ProfilePage bypasses it and calls `/api/v1/profile` via the generic `api` wrapper. Either the service should be updated to match the backend endpoints, or it should be removed.
2. API versioning is inconsistent across controllers: some use `/api/` prefix (courses, registrations, appeals), others use `/api/v1/` (grades, profile, finance).
3. Two frontend API communication patterns exist: direct `api.ts` wrapper (used by Profile, Timetable, Grades, Tuition) and service-specific modules (used by Courses). Consolidation to a single pattern is recommended.

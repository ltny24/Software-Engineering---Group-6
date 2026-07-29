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
    Student["<<Person>><br/><b>Student</b><br/>Undergraduate learner performing self-service academic actions, viewing grades, submitting appeals, and interacting with AI advisor."]:::person

    Admin["<<Person>><br/><b>Administrator</b><br/>Academic Affairs officer managing data imports, class controls, grade appeal reviews, and student records."]:::person

    %% System Boundary
    subgraph SystemBoundary ["MyUS University Portal System (System Boundary)"]
        direction TB

        Frontend["<<Container: Single Page Application>><br/><b>Frontend Web Application</b><br/>[React 18, TypeScript, Axios, React Router]<br/>Provides responsive UI, client-side routing, form validation, and reactive state management."]:::container

        Backend["<<Container: Web API Application>><br/><b>Backend API Server</b><br/>[Spring Boot 3.x, Spring Security, JPA, Java 17]<br/>Executes RESTful API services, security rules, transaction management, AI orchestration, and file operations."]:::container

        Database[("<<Container: Relational Database>><br/><b>SQL Server Database</b><br/>[Microsoft SQL Server 2019/2022]<br/>Stores structured domain data, academic records, users, enrollments, appeals, and Flyway migration logs.")]:::database

        FileStorage[("<<Container: File System / Binary Storage>><br/><b>Local File Storage</b><br/>[OS File System / Storage Volume]<br/>Stores binary evidence attachments (.pdf, .jpg, .png) for grade appeal cases (UC-07a).")]:::database
    end

    %% External Systems
    GeminiAI["<<External System>><br/><b>Google Gemini / OpenAI LLM API</b><br/>Cloud-based Large Language Model powering AI advising and personalized recommendations."]:::external

    EmailGateway["<<External System>><br/><b>Campus SMTP Email Gateway</b><br/>University mail infrastructure for sending notification emails and fee deadline alerts."]:::external

    %% Communication Flows
    Student -->|"Accesses portal, submits requests, views content<br/>[HTTPS / HTML5 / React SPA]"| Frontend
    Admin -->|"Executes administrative tasks, manages records<br/>[HTTPS / HTML5 / React SPA]"| Frontend

    Frontend -->|"Sends REST API requests & JWT tokens<br/>[HTTPS / REST / JSON & Multipart Data]"| Backend

    Backend -->|"Reads/writes structured domain data & logs<br/>[JDBC / TCP Port 1433 / HikariCP Pool]"| Database
    Backend -->|"Persists and reads grade appeal attachments<br/>[Local File I/O / Java NIO / POSIX Path]"| FileStorage

    Backend -->|"Dispatches RAG prompts & fetches course recommendations<br/>[HTTPS / REST API / TLS 1.2+]"| GeminiAI
    Backend -->|"Sends transactional email & security alerts<br/>[SMTP / SMTPS / TCP Port 587]"| EmailGateway
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

*(Note: Component Diagrams for Frontend and Backend are currently under development and will be updated in the next iteration.)*

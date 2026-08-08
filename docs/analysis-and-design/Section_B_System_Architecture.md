# B - Software Architecture: System Context Diagram
**Performed by:** Lê Thị Như Ý  | **Reviewed by:** Hồ Thị Như Ngọc  | **Edited by:** Lê Thị Như Ý

---

## 1. Introduction, Architectural Scope & C4 Model Principles

### 1.1. Executive Summary & System Purpose

The **MyUS University Portal System** is an enterprise-grade, integrated academic platform designed to digitalize and streamline university governance, administrative workflows, and student self-service operations. In a modern higher education environment, traditional paper-based administrative procedures—such as manual exam grade re-evaluations, physical course registration forms, and siloed academic advising—create severe operational bottlenecks and data inconsistencies.

MyUS addresses these challenges by establishing a unified, data-driven software ecosystem that connects undergraduate learners directly with university administrators. By centralizing daily academic activities into a single secure web application, MyUS eliminates physical paperwork, ensures real-time data synchronization across campus departments, guarantees the integrity of educational records, and enhances the overall student academic experience through 24/7 intelligent virtual counseling.

---

### 1.2. Evolutionary Project Scope (PA1 through PA4 Roadmap)

This architectural document encapsulates the complete end-to-end software system as evolved from **Project Assignment 1 (PA1)** through **Project Assignment 4 (PA4)**. The architecture comprehensively models the platform's domain boundaries and capabilities, implemented progressively across four iterative development milestones.

#### PA1 & PA2 (Requirements Elicitation & Formal Modeling)

Established the foundational domain models, business rules, and actor hierarchies. During these phases, core user requirements were formalized into comprehensive use-case specifications, defining the operational boundaries between students and administrative staff across twenty-one use cases (UC-01 through UC-13a).

#### PA3 (Core Infrastructure & Architectural Foundation)

Centered on foundational scaffolding and MVP execution.

This phase established:

- Secure Spring Boot Backend API
- React TypeScript Frontend
- SQL Server relational database schema
- Stateless JSON Web Token (JWT) authentication framework

Initial feature implementation focused on core student self-service capabilities, including:

- **Functional Group 1:** User Profile Updates (**UC-02**)
- **Functional Group 4:** Semester Grade Viewing & GPA Calculation (**UC-05**)

#### PA4 (Spec-Driven Implementation of Core Appeals, FAQ Support & AI Chatbot)

Represents the full-scale expansion of the platform using **Spec Kit** to drive end-to-end full-stack implementation (UI + API/Logic + Data Persistence).

For this milestone, implementation focuses on three major modules.

##### Functional Group 2 – Grade Appeal System

End-to-end execution of the digital grade appeal workflow (**UC-07**, **UC-07a**, **UC-08**) and administrator appeal processing management (**UC-12**, **UC-12a**, **UC-12b**), including:

- Digital appeal submission with mandatory supporting evidence uploads (`.pdf`, `.jpg`, `.png`, maximum 5 MB per file)
- Real-time appeal status tracking:
  - `Submitted`
  - `Under Review`
  - `Approved`
  - `Denied`
  - `Withdrawn`
- Dynamic fee payment deadline enforcement (+5 business days)
- Administrator review queue with status update management and student notification

##### Functional Group 6 – Support & FAQ

Implementation of a centralized searchable self-service knowledge base (**UC-10**, **UC-10a**).

This module enables undergraduate students to independently find answers regarding:

- Campus administrative regulations
- Academic grading policies
- IT troubleshooting

through category-filtered keyword search, FAQ feedback rating ("Helpful" / "Not Helpful"), and contact helpdesk options — without requiring manual helpdesk assistance.

##### AI Learning Assistant Chatbot (UC-10b)

Integration of a Large Language Model (LLM)-based AI academic advisor (**UC-10b**) providing 24/7 personalized counseling via the Google Gemini API with real-time streaming responses.

The chatbot supports:

- Academic profile context personalization (student major, GPA, student type)
- Transcript retrieval and degree audit analysis
- Completed credit evaluation
- Prerequisite and corequisite validation
- Personalized next-semester course recommendations (`GET /api/v1/chatbot/recommendations`)
- Graduation timeline simulation (`GET /api/v1/chatbot/progress`)
- Real-time streaming responses via `askGeminiStream` with structured offline fallback (`localChatbotService.ts`)
- Academic scope guardrails that politely refuse non-university queries

---

### 1.3. Key Architectural Quality Attributes & Non-Functional Requirements

The software architecture of MyUS is explicitly designed to satisfy critical architectural quality attributes, ensuring long-term system stability, security, and scalability.

#### Security & Data Privacy (FERPA / Institutional Compliance)

Academic records, transcripts, and personal identifiers represent highly sensitive institutional data.

The architecture therefore enforces:

- Stateless JWT Bearer authentication
- Role-Based Access Control (RBAC)
- Method-level authorization
- Prevention of horizontal privilege escalation
- Prevention of vertical privilege escalation

These mechanisms ensure:

- Students can access only their own academic information.
- Administrators operate strictly within authorized permission boundaries.

---

#### High Availability & Fault Tolerance

System availability is critical during peak academic periods such as:

- Course registration
- Grade publication
- Grade appeal deadlines

The platform incorporates resilient architectural patterns including:

- Circuit Breaker
- Graceful Degradation

If the external AI service becomes unavailable because of latency or service interruption, the platform automatically falls back to the `localChatbotService.ts` deterministic offline knowledge base to ensure uninterrupted academic support (**UC-10b AF2**).

---

#### Modularity & Separation of Concerns

The platform adopts a decoupled Full-Stack architecture by separating responsibilities across independent layers:

- Presentation Layer (React SPA)
- Business Logic / API Layer (Spring Boot)
- Relational Database Layer (SQL Server)
- Binary Object Storage

This separation improves maintainability while allowing individual containers and services to scale independently.

---

#### Transaction Atomicity & Consistency

Academic operations that modify institutional records—including:

- Grade adjustments after appeals (**UC-12b**)
- Course registration seat reservations (**UC-03**)
- Tuition status updates (**UC-06**)

are executed inside atomic database transactions (`@Transactional`) to prevent:

- Race conditions
- Partial updates
- Data inconsistency

---

### 1.4. Theoretical Foundation of the C4 Model – Level 1 (System Context)

To communicate this architecture effectively without overwhelming stakeholders, this document adopts **Simon Brown's C4 Model**.

The C4 Model organizes software architecture into four abstraction levels:

| Level | Description |
|--------|-------------|
| Level 1 | System Context |
| Level 2 | Container Diagram |
| Level 3 | Component Diagram |
| Level 4 | Code Diagram |

Each level progressively reveals additional implementation details while maintaining architectural clarity.

---

#### Purpose of the Level 1 System Context Diagram

Section **B** focuses exclusively on **C4 Level 1 – System Context Diagram**.

At this level, the architecture answers two fundamental questions:

1. Who uses the system?
2. What external software systems does the platform interact with?

The **MyUS University Portal System** is represented as a single **Software System (Black Box)**.

Internal implementation details—including:

- React frontend
- Spring Boot backend
- SQL Server database
- APIs
- Frameworks
- Source code

are intentionally omitted and deferred to the **Container Diagram (Level 2)** and **Component Diagram (Level 3)** presented later in the document.

Instead, the Level 1 diagram focuses on illustrating:

- The overall System Boundary
- Human users (`<<Person>>`)
- External Software Systems (`<<External Software System>>`)
- Bidirectional communication relationships
- High-level information exchanges between MyUS and external entities

## 2. Comprehensive Technology Stack & Architectural Justification
**Performed by:** Lê Thị Như Ý  | **Reviewed by:** Hồ Thị Như Ngọc  | **Edited by:** Lê Thị Như Ý

To satisfy the functional complexity of the defined use cases alongside stringent Non-Functional Requirements regarding security, responsiveness, and concurrent transaction safety, the **MyUS University Portal System** adopts a modern, decoupled Full-Stack architecture. Every technology and framework selected within this stack is justified by explicit domain constraints and operational requirements.

---

### 2.1. Frontend Layer (Client Presentation & Reactive State)

The client-side architecture is engineered as a **Single Page Application (SPA)** to ensure seamless, reload-free navigation across complex student self-service and administrative workflows.

#### Core Framework — React 18

Selected for its declarative, component-driven UI model.

- **React Hooks** (`useState`, `useEffect`, `useMemo`, `useCallback`) manage localized state transitions efficiently, such as:
  - Dynamic calculations during **Course Registration (UC-03)**.
  - Term filtering and GPA computations in the **Grade Dashboard (UC-05)**.
  - Real-time streaming AI responses in the **AI Learning Assistant (UC-10b)**.
  - Real-time step navigation in **Evaluation Surveys (UC-09)**.

#### Programming Language — TypeScript (v5.x)

Enforces strict static typing and compile-time contract verification.

TypeScript is critical for modeling intricate Data Transfer Objects (DTOs), including:

- Multi-field Grade Appeal submissions (**UC-07**).
- Structured AI Course Recommendation cards (**UC-10b**).
- Bulk import validation previews (**UC-11**, **UC-11a**, **UC-11b**).

This prevents runtime type errors and ensures consistency between frontend and backend data contracts.

#### Styling & Responsive UI — Plain CSS with BEM Convention

The frontend uses plain CSS files organized per component, following the **BEM (Block Element Modifier)** naming convention to satisfy multi-device responsiveness requirements across desktop, laptop, tablet, and mobile breakpoints (**NFR ID13**).

It enables:

- Condensed daily-agenda layouts on mobile devices (**UC-04**).
- Clean and expandable UI patterns for the centralized FAQ library (**UC-10a**).
- Full-width AI chat interface with message bubbles and streaming indicators (**UC-10b**).

without requiring additional CSS framework dependencies.

#### Routing & Security — React Router DOM

React Router DOM manages client-side SPA routing and implements custom **Protected Route** wrappers.

These wrappers inspect:

- Authentication state.
- Role-Based Access Control (RBAC) privileges.

This ensures undergraduate students cannot access privileged administrative pages such as:

- Bulk import management (**UC-11**, **UC-11a**, **UC-11b**).
- Student data administration (**UC-13**, **UC-13a**).

#### HTTP Client & Asynchronous Communication — Axios

Axios serves as the primary REST client and is configured with global request and response interceptors.

Its responsibilities include:

- Automatically attaching stateless JSON Web Tokens (JWT) as **Bearer** headers to all outbound requests (**UC-01**).
- Handling authentication failures.
- Serializing request payloads into:
  - Standard JSON.
  - `multipart/form-data` when uploading supporting documents for grade appeals (**UC-07a**).

#### Build & Bundling Tooling — Create React App (react-scripts)

**Create React App (CRA)** with `react-scripts` is used as the build tool to provide:

- Rapid development environment with integrated Webpack configuration.
- Optimized production builds with tree-shaking for fast deployment.
- Out-of-the-box support for TypeScript compilation and testing infrastructure.

---

### 2.2. Backend Layer (API Gateway & Business Logic)

The backend operates as a stateless RESTful API server responsible for workflow orchestration, business rule enforcement, and transaction management.

#### Core Framework — Spring Boot 3.x (Java 17/21)

Spring Boot provides an enterprise-grade **Model-View-Controller (MVC)** architecture.

It encapsulates mission-critical academic business logic, including:

- Curriculum prerequisite/corequisite verification (**UC-03a**).
- GPA calculation using both the 10-point and 4-point grading scales (**UC-05**).
- Automated routing of grade appeal queues (**UC-07**, **UC-08**).
- FAQ search and category filtering (**UC-10a**).
- AI RAG prompt construction and streaming orchestration (**UC-10b**).

#### Authentication & Security — Spring Security 6 + BCrypt + JWT

Implements a stateless authentication architecture (**UC-01**).

##### Password Hashing

- User passwords are encrypted using the **BCrypt** hashing algorithm with a minimum work factor of **10 rounds**.
- Plaintext passwords never appear in logs, database tables, or API payloads (**NFR ID09**).

##### Token-Based Session Control

- Authenticated sessions rely on configurable JWT Access Tokens (**NFR ID10**).
- Unauthorized access attempts immediately receive **HTTP 401 Unauthorized** responses (**NFR ID06**).
- Password reset workflow uses 6-digit verification codes stored as `PasswordResetToken` entities, valid for 15 minutes (**UC-01 AF2**).

##### Authorization Enforcement

Method-level security annotations (`@PreAuthorize`) enforce strict Role-Based Access Control (RBAC), ensuring students can only access or modify their own academic records and profiles (**NFR ID07**, **NFR ID08**).

#### Data Persistence & ORM — Spring Data JPA + Hibernate ORM

Spring Data JPA abstracts relational SQL operations through repository interfaces while maintaining ACID compliance and efficient connection pooling.

Transaction management using `@Transactional` guarantees data integrity during high-concurrency operations, including:

- Course registration seat reservations (**UC-03**, **NFR ID24**).
- Multi-step grade appeal status updates (**UC-12b**).

#### Validation & Error Handling — Jakarta Bean Validation + `@ControllerAdvice`

Input validation is enforced at the controller layer.

Examples include:

- Verifying appeal reason length constraints in **AppealSubmitRequest** (**UC-07**).
- Validating username and password formats in **AuthRequest**.
- Validating FAQ feedback boolean in **FaqFeedbackRequest** (**UC-10a**).

A global `@ControllerAdvice` middleware intercepts exceptions and standardizes HTTP error responses into structured JSON payloads (**NFR ID14**).

#### AI Orchestration Adapter — Gemini API Integration

Acts as the communication bridge between enterprise Java services and the external Google Gemini Large Language Model (LLM).

Responsibilities include:

- Formatting student transcripts, major context, and curriculum rules into Retrieval-Augmented Generation (RAG) prompts (**UC-10b**).
- Exposing backend AI endpoints: `POST /api/v1/chatbot/chat`, `GET /api/v1/chatbot/recommendations`, `GET /api/v1/chatbot/progress`.
- Gracefully degrading to offline local knowledge base when AI services experience latency or downtime (**UC-10b AF2**, **NFR ID18**).

---

### 2.3. Database & Storage Layer

The persistence layer separates structured relational data from binary file storage to optimize query performance and storage efficiency.

#### Relational Database — Microsoft SQL Server (2019/2022)

SQL Server serves as the primary system of record, ensuring referential integrity and relational consistency.

It stores structured schemas including:

- `users`
- `students`
- `course_offerings`
- `course_registrations`
- `grades`
- `grade_appeals`
- `appeal_attachments`
- `tuition_accounts`
- `tuition_payments`
- `faq_articles`
- `password_reset_tokens`
- `exam_schedules`
- System audit logs

(**UC-11**, **UC-13**)

Database indexing strategies ensure that:

- Historical grade queries.
- Student record searches.
- FAQ keyword searches.

remain performant even with large datasets (**NFR ID05**).

#### Binary Object Storage — Local File System / Object Storage

Managed through Spring Boot's **FileStorageService** for storing supporting documents submitted with grade appeals (**UC-07a**).

To avoid database bloat:

- Uploaded files undergo format and size validation.
- Files are stored separately from relational data.
- SQL Server stores:
  - Secure file URI.
  - Metadata.
  - Access-control references.

File access is restricted to the submitting student and authorized administrators (**NFR ID08**).

---

### 2.4. External Integration Services & APIs

To provide advanced capabilities without reinventing existing infrastructure, MyUS integrates with specialized external systems over encrypted **HTTPS/TLS 1.2+** connections (**NFR ID11**).

#### AI Counseling Engine — Google Gemini / OpenAI LLM API

Provides the intelligence behind the **AI Learning Assistant Chatbot (UC-10b)**.

The AI service:

- Receives anonymized student academic context (major, GPA, enrolled courses).
- Receives curriculum rules and course catalog data (RAG via `courses.json`).
- Suggests next-semester courses with credit and prerequisite details.
- Simulates graduation roadmaps and degree audit results.

AI-generated recommendations are advisory only and **cannot bypass official prerequisite validation rules** (**NFR ID18**).

#### Asynchronous Notification Gateway — Campus SMTP Email Gateway / JavaMailSender

Responsible for sending automated emails and system notifications.

Notifications are triggered during:

- Security lockouts and 6-digit password reset verification codes (**UC-01 AF2**).
- Profile contact information updates (**UC-02**).
- Grade appeal fee-payment deadline creation by administrators (**UC-12a**).
- Grade appeal status change notifications (**UC-12b**).

---

### 2.5. DevOps, Quality Assurance & Spec-Driven Tooling

#### Database Migration Management — Flyway

**Flyway** is integrated for version-controlled database schema migration. All schema changes are managed through SQL migration scripts located in `src/main/resources/db/migration/`, ensuring:

- Consistent database state across all environments (development, testing, production).
- Repeatable and auditable schema evolution history.
- Baseline support for existing databases without data loss.

#### Spec-Driven Engineering — Spec Kit

Spec Kit serves as the primary implementation driver during Phase 4 development.

It systematically transforms:

- `spec.md`
- `plan.md`
- `tasks.md`

into verified end-to-end full-stack implementations.

#### Automated Testing Suite — JUnit 5 & Mockito

JUnit 5 and Mockito are used to build comprehensive backend unit tests covering mission-critical business logic, including:

- Prerequisite validation algorithms (**UC-03a**, **NFR ID30**).
- Official GPA calculation algorithms (**UC-05**, **NFR ID30**).
- Grade appeal workflow state transitions (**UC-07**, **UC-12b**, **NFR ID30**).
- Enrollment service business rules including credit limit and seat capacity checks (**UC-03**).

## 3. C4 Model - Level 1: System Context Diagram
**Performed by:** Lê Thị Như Ý  | **Reviewed by:** Hồ Thị Như Ngọc  | **Edited by:** Lê Thị Như Ý
### C4 Model - Level 1 (Mermaid)

```mermaid
flowchart TB
    classDef person fill:#08427b,stroke:#052e56,stroke-width:2px,color:#ffffff,font-weight:bold
    classDef system fill:#1168bd,stroke:#0b4884,stroke-width:3px,color:#ffffff,font-weight:bold
    classDef external fill:#999999,stroke:#666666,stroke-width:2px,color:#ffffff,font-style:italic

    %% People — human users only (C4 Person stereotype)
    Student["&lt;&lt;Person&gt;&gt;<br>Student<br>Undergraduate learner performing self-service tasks:<br>course registration, grade tracking, digital appeals,<br>FAQ lookup, and AI academic advising."]:::person

    Admin["&lt;&lt;Person&gt;&gt;<br>Administrator<br>Academic Affairs officer managing bulk data imports,<br>class controls, class transfers, appeal reviews,<br>fee deadlines, and student records."]:::person

    %% Target Software System
    MyUS["&lt;&lt;Software System&gt;&gt;<br>MyUS University Portal System<br>Centralized academic platform digitalizing university<br>operations: self-service workflows, grade appeal tracking,<br>AI curriculum counseling, and searchable FAQ support."]:::system

    %% External Software Systems
    GeminiAI["&lt;&lt;External System&gt;&gt;<br>Google Gemini LLM API<br>Cloud-based Large Language Model powering<br>AI course recommendations, academic advising,<br>and graduation audit analysis (UC-10b)."]:::external

    EmailGateway["&lt;&lt;External System&gt;&gt;<br>Campus SMTP Email Gateway<br>University mail infrastructure dispatching<br>transactional emails: password resets,<br>appeal status updates, and fee deadline alerts."]:::external

    FileStorage["&lt;&lt;External System&gt;&gt;<br>Local File System / Object Storage<br>Binary storage infrastructure persisting<br>grade appeal evidentiary documents<br>(.pdf, .jpg, .png — up to 5 MB each)."]:::external

    %% Relationships — users interact with the system
    Student -->|"Registers courses, views grades and timetable,<br>submits grade appeals, searches FAQ,<br>and uses AI learning assistant"| MyUS
    Admin -->|"Imports bulk data, manages class controls,<br>processes class transfers, sets fee deadlines,<br>reviews appeals, and inspects records"| MyUS

    %% Relationships — system uses external services
    MyUS -->|"Sends academic context and queries; receives AI course recommendations and graduation audit results"| GeminiAI
    MyUS -->|"Dispatches transactional emails: password reset codes, appeal status updates, and fee payment deadline alerts"| EmailGateway
    MyUS -->|"Stores and retrieves supporting documents for grade appeal cases"| FileStorage
```
### 3.2. Detailed Architectural Narrative & System Boundaries

#### A. The Target System: MyUS University Portal System

At the center of the architecture is the **MyUS University Portal System**, which encapsulates all business logic, data validation rules, security controls, and workflow orchestration required to execute the 21 defined Use Cases (UC-01 through UC-13a).

The system bridges two distinct user domains:

##### Student Self-Service Domain (UC-01 to UC-10b)

This domain encompasses the core self-service capabilities available to undergraduate students, including:

- Authentication with forgot/reset password workflow (**UC-01**)
- Profile management (phone, address) (**UC-02**)
- Course registration with prerequisite validation (**UC-03**, **UC-03a**)
- Timetable tracking with weekly grid and agenda views (**UC-04**)
- Grade and GPA monitoring with 10-point and 4-point scales (**UC-05**)
- Tuition fee tracking with payment history (**UC-06**)
- Digital grade appeal submissions with supporting document uploads (**UC-07**, **UC-07a**)
- Appeal status tracking with admin reviewer notes and fee deadline display (**UC-08**)
- Evaluation survey submissions (**UC-09**)
- Centralized Help & Support hub (**UC-10**)
- Searchable FAQ knowledge base with category filtering and feedback (**UC-10a**)
- AI Learning Assistant chatbot with streaming Gemini responses (**UC-10b**)

##### Administrative Governance Domain (UC-11 to UC-14)

This domain supports administrative operations, including:

- Bulk data and class control management (**UC-11**)
- Student/course/class data file imports with preview and confirmation (**UC-11a**)
- Data format validation and error reporting (**UC-11b**)
- Appeal processing management with document review (**UC-12**)
- Physical fee payment deadline configuration with student notification (**UC-12a**)
- Appeal status updates with processing notes (**UC-12b**)
- Student data administration with role-based access control (**UC-13**)
- Multi-criteria student record searching with pagination (**UC-13a**)
- Class transfer management and student reassignment (**UC-14**)

---

#### B. Primary Actors (Human Users)

##### Student (`<<Person>>`)

Students access the platform through modern web browsers. Following secure authentication, they use MyUS to:

- Independently manage their academic progress.
- Complete digital academic workflows without relying on physical paperwork.
- Interact with the AI academic assistant for personalized learning guidance and course recommendations.

##### Administrator (`<<Person>>`)

Administrators are Academic Affairs officers operating under elevated authorization privileges.

They use dedicated administrative interfaces to:

- Upload master schedules.
- Perform bulk student and course data imports.
- Execute student class transfers between sections (**UC-14**).
- Review grade appeal submissions and supporting evidence.
- Configure physical office fee-payment deadlines.
- Inspect and manage confidential student records.

##### AI Engine (`<<Actor>>`)

The Google Gemini LLM API acts as an automated AI actor within **UC-10b (AI Learning Assistant)**. It receives structured academic context (student major, cumulative GPA, course catalog, completed credits) formatted as Retrieval-Augmented Generation (RAG) prompts by the backend `ChatbotController`, then streams natural-language course recommendations and graduation advisories back to the student's chat interface via `askGeminiStream`. If the Gemini service is unavailable, the system transparently falls back to the `localChatbotService.ts` offline knowledge base.

---

#### C. External Software Systems & Integration Mechanics

To provide advanced capabilities while avoiding duplication of core infrastructure, **MyUS** integrates with three external software systems.

##### Google Gemini / OpenAI LLM API (`<<External Software System>>`)

This external AI service powers the **AI Learning Assistant (UC-10b)**.

The platform securely communicates with the cloud-based Large Language Model (LLM) by transmitting curriculum context and user queries. The AI service analyzes prerequisite constraints and generates:

- Intelligent course recommendations via `GET /api/v1/chatbot/recommendations`.
- Personalized graduation pathway guidance via `GET /api/v1/chatbot/progress`.
- Natural-language academic counseling responses streamed in real-time via `askGeminiStream`.

---

##### Campus SMTP Email Gateway (`<<External Software System>>`)

The Campus SMTP Email Gateway serves as the university's centralized notification infrastructure.

It automatically delivers transactional email notifications triggered by events such as:

- Security incidents: 6-digit password reset verification codes and account lockouts (**UC-01 AF2**).
- Student profile modifications (**UC-02**).
- Grade appeal fee-payment deadline creation by administrators (**UC-12a**).
- Grade appeal status change notifications to students (**UC-12b**).

---

##### Local File System / Object Storage (`<<External Software System>>`)

The Local File System / Object Storage provides dedicated infrastructure for storing supporting evidence uploaded during **Grade Appeal submissions (UC-07a)**.

By separating binary file storage from the primary relational database, the system:

- Ensures reliable long-term access to uploaded documents.
- Improves database performance by avoiding storage of large binary objects.
- Maintains efficient query execution while securely managing appeal attachments.

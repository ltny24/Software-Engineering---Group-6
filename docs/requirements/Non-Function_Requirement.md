# NON-FUNCTIONAL REQUIREMENTS (Yêu cầu phi chức năng) - MyUS

*Performed by: Dương Minh Huỳnh Khôi | Reviewed by: Hồ Thị Như Ngọc | Edited by: Dương Minh Huỳnh Khôi*

This document defines the measurable **Non-Functional Requirements** for the **MyUS University Portal System**. Non-Functional Requirements specify **how** the system should behave — covering quality attributes such as performance, security, usability, reliability, compatibility, scalability, and maintainability — as opposed to Functional Requirements which define **what** the system should do.

### References

| Document | Relevant Sections |
|---|---|
| Vision Document | Section 1 (Introduction), Section 2 (Positioning) |
| Project Proposal | Section 2 (Target Users and Environments) |
| Specification (spec.md) | Functional Requirements (FR-001 → FR-014), Success Criteria |
| Implementation Plan (plan.md) | Technical Context, Performance Goals, Constraints |
| Constitution | Technology Stack, Architecture Principles, Security, Testing |

---

## 1. Performance

| ID | Requirement | Rationale |
|---|---|---|
| ID01 | Core student pages (profile, timetable, grades, tuition) MUST load responsively under normal load conditions. | plan.md: "Responsive page load for core student workflows." |
| ID02 | Backend REST API endpoints MUST maintain stable response times under moderate campus load. | plan.md: "Stable API response times under moderate campus load." |
| ID03 | Bulk data import operations (student records, course offerings) MUST process efficiently with progress feedback to the administrator. | Vision Document Feature 7: "quickly import massive volumes of system data." |
| ID04 | The AI Learning Path Chatbot MUST return course recommendations in a timely manner after receiving a student query. | Vision Document Feature 3: AI-driven chatbot provides real-time academic guidance. |
| ID05 | Database queries for grade retrieval and GPA calculation MUST complete efficiently for individual student records. | spec.md FR-005: Students must be able to view grades, GPA, and academic progress. |

---

## 2. Security

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID06 | All protected pages and API endpoints MUST require JWT-based authentication. Unauthenticated requests MUST receive an HTTP 401 response. | 100% of protected endpoints enforce authentication. | Directly from spec.md FR-001 and constitution: "All users must be authenticated before accessing protected resources." |
| ID07 | The system MUST enforce role-based access control (RBAC) with at least two roles: **Student** and **Administrator**. Users MUST NOT access resources outside their role scope. | 0 unauthorized access incidents in acceptance testing. | Directly from spec.md FR-011 and constitution: "Role-based authorization for Student and Administrator." |
| ID08 | Sensitive student data (personal information, financial records, academic transcripts) MUST NOT be exposed in API responses to unauthorized users. | API responses contain no sensitive data leaks for unauthorized roles. | Directly from spec.md FR-012 and constitution: "Sensitive data must not be exposed in APIs." |
| ID09 | User passwords MUST be stored using a strong, one-way hashing algorithm (e.g., BCrypt with minimum 10 rounds). Plaintext passwords MUST NOT appear in logs, API responses, or database records. | 100% of stored passwords are hashed; 0 plaintext occurrences in logs/DB. | Industry standard (OWASP Password Storage Cheat Sheet). Implied by the constitution's security requirements. |
| ID10 | JWT tokens MUST have a configurable expiration time and support secure token refresh mechanisms. | Access token TTL configurable; refresh token TTL configurable. | plan.md authentication decision specifies JWT — based on OWASP session management guidelines. |
| ID11 | All client-server communication MUST use HTTPS (TLS 1.2+) in production environments. | 100% of production traffic over HTTPS. | Industry standard for web application security (OWASP Transport Layer Security Cheat Sheet). |

---

## 3. Usability

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID12 | 95% of authenticated students MUST be able to complete their primary portal tasks (profile review, course registration, grade lookup) in one session without external assistance. | Task completion rate ≥ 95%. | Directly from spec.md SC-001: exact measurable success criterion. |
| ID13 | The user interface MUST be responsive and functional across desktop (≥1024px), tablet (≥768px), and mobile (≥375px) screen widths. | UI renders correctly across all three breakpoints. | Directly from Project Proposal Section 2.2: "Responsive web interface for both desktop and mobile environments." |
| ID14 | The system MUST provide clear, user-friendly error messages for all validation failures (e.g., invalid form inputs, schedule conflicts, prerequisite gaps). | All validation errors display actionable messages; no raw server errors shown to users. | Vision Document Feature 3 describes prerequisite checks and conflict detection — clear feedback is essential for self-service workflows. |
| ID15 | Students MUST receive real-time status updates for grade appeal processing. Status transitions (Pending → Processing → Resolved/Rejected) MUST be visible promptly after an administrator action. | Appeal status updates visible in real-time. | Directly from spec.md SC-002: "Students can access real-time appeal status updates." |
| ID16 | The FAQ and support section MUST provide a searchable interface that returns relevant results promptly. | FAQ search returns results without noticeable delay. | Vision Document Feature 6: "instant, 24/7 answers to routine issues." |

---

## 4. Reliability & Availability

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID17 | The system MUST maintain high availability during the academic semester, excluding planned maintenance windows. | System is accessible during all critical academic periods. | Academic portals are critical during enrollment and examination periods. |
| ID18 | The system MUST handle graceful degradation when the AI chatbot service is unavailable. Students MUST still access all other portal features without interruption. | Non-chatbot features remain functional during chatbot outage. | Directly from spec.md assumptions: "The AI learning path chatbot feature is guidance-oriented and not a substitute for academic advising." |
| ID19 | Bulk data import MUST be transactional: if validation fails for any record in a batch, the system MUST NOT partially commit the import. A detailed error log MUST be generated. | 0 partial imports; error log generated for 100% of failed imports. | Directly from spec.md FR-008 and Vision Document Workflow 3: "Generate Error Log." |
| ID20 | The system MUST implement automated database backups to prevent academic data loss. | Backups performed regularly; restoration procedures verified. | Industry best practice for systems holding irreplaceable academic records. |

---

## 5. Compatibility

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID21 | The portal MUST function correctly on the latest two major versions of **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, and **Safari**. | All critical user flows pass on 4 browsers × 2 versions. | Directly from Project Proposal Section 2.2: "Modern web browsers such as Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari." |
| ID22 | The portal MUST function correctly on devices running **Windows**, **macOS**, **Linux**, **Android**, and **iOS**. | All critical user flows pass on all 5 operating systems. | Directly from Project Proposal Section 2.2: "Supported Operating Systems." |
| ID23 | The backend MUST run on **Java 17+** and the frontend MUST use **modern JavaScript/TypeScript** compatible with current LTS Node.js versions. | Build succeeds on Java 17+ and Node.js LTS. | Directly from plan.md Technical Context and constitution: "Backend: Spring Boot." |

---

## 6. Scalability

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID24 | The system architecture MUST support scaling to handle a campus-sized student body without degradation of core portal functions. | System maintains responsive performance under peak campus load. | plan.md: "Campus-sized student body." |
| ID25 | The database schema MUST use **normalized design** with referential integrity through foreign keys, supporting growth of student records over multiple academic years. | Schema passes 3NF validation; all relationships have foreign key constraints. | Directly from spec.md FR-013 and constitution: "Use normalized database design. Maintain referential integrity through foreign keys." |
| ID26 | The system MUST support the addition of new user roles (e.g., Faculty, Department Head) and feature modules without requiring architectural changes to the core authentication or authorization framework. | New role can be added via configuration and database changes only, with no core code refactoring. | Implied by spec.md assumptions: "Faculty and additional staff roles beyond Student and Administrator are out of scope for the initial release." |

---

## 7. Maintainability

| ID | Requirement | Metric | Rationale |
|---|---|---|---|
| ID27 | The codebase MUST follow **Clean Architecture** principles with clear separation of Presentation, Business Logic, and Data Access layers. | No cross-layer direct dependencies (e.g., controllers must not access repositories directly). | Directly from constitution: "Follow Clean Architecture principles. Separate Presentation, Business Logic, and Data Access layers." |
| ID28 | All new features MUST be documented with user stories and acceptance criteria before implementation begins. | 100% of implemented features have corresponding documentation. | Directly from spec.md FR-014 and constitution: "Major features must include user stories and acceptance criteria." |
| ID29 | Backend and frontend code MUST use consistent **naming conventions** and follow established coding standards enforced by linting tools. | 0 linting errors in CI pipeline. | Directly from constitution: "Use meaningful naming conventions. Follow coding standards and best practices." |
| ID30 | Critical business logic (GPA calculation, enrollment validation, appeal workflow) MUST be covered by unit tests. | Unit test coverage for critical services. | Directly from constitution: "Critical business logic should be tested." |
| ID31 | All backend REST API endpoints MUST be validated through **integration tests** before deployment. | 100% of API endpoints have at least one integration test. | Directly from constitution: "API endpoints should be validated before deployment." |

---

## Summary Matrix

| Category | Count | ID Range |
|---|---|---|
| Performance | 5 | ID01 → ID05 |
| Security | 6 | ID06 → ID11 |
| Usability | 5 | ID12 → ID16 |
| Reliability & Availability | 4 | ID17 → ID20 |
| Compatibility | 3 | ID21 → ID23 |
| Scalability | 3 | ID24 → ID26 |
| Maintainability | 5 | ID27 → ID31 |
| **Total** | **31** | |

*Note: Performance requirements (ID01 → ID05) are stated qualitatively. Specific numeric thresholds should be determined by the team during testing and benchmarking phases.*

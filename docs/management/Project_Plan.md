# PROJECT PLAN - MyUS

## 1. Introduction
*Performed by: Trần Tường Vi | Reviewed by: Hoàng Trung Kiên | Edited by: Trần Tường Vi*
 
MyUS is a web-based academic portal designed to digitalize the academic and administrative operations of a university. It provides a unified workspace that eliminates manual paperwork and ensures the accuracy and accessibility of educational data across the institution.
 
The platform serves two primary user groups. Students can independently manage course registration, track tuition fees, view grades and GPA and submit grade appeals. Administrators can upload academic schedules, manage class transfers, process grade appeals, and view student records. Both groups interact through role-specific interfaces tailored to their needs.
 
A key feature of MyUS is the AI Learning Path Chatbot, which analyzes each student's completed credits and remaining degree requirements to recommend the most suitable courses for the upcoming semester, supporting timely graduation.
 
This document outlines the project's overview, team organization, risk management strategies, and sprint-based development plan.

---

## 2. Project Overview
*Performed by: Trần Tường Vi | Reviewed by: Hoàng Trung Kiên | Edited by: Trần Tường Vi*

### 2.1 Goals
1. Digitize the university's academic and administrative processes, minimizing paperwork and reducing manual errors.
2. Provide a centralized, role-based platform that gives both students and administrators real-time access to accurate academic data.
3. Leverage AI to support student academic planning, reducing the risk of delayed graduation due to missed prerequisites or miscalculated credits.

### 2.2 Scope

The system covers 9 functional groups spanning two user roles — Student and Administrator — delivered as a responsive web application. The platform supports all major browsers (Chrome, Edge, Firefox, Safari) and devices (desktop, laptop, tablet, smartphone) on Windows, macOS, Linux, Android, and iOS.

**Out of scope:** native mobile applications, integration with third-party LMS platforms, and direct online payment processing for tuition fees.

### 2.3 Deliverables

| Deliverable | PA | Description |
|---|---|---|
| Project Proposal | PA1 | Initial feature overview, target user analysis, and system scope |
| Project Plan | PA2 | This document — overall strategy, team organization, and sprint schedule |
| Vision Document | PA2 | Problem statement, product features, and non-functional requirements |
| Use-Case Model & Specifications | PA3 | Use-case diagrams and detailed specifications with UI prototypes |
| Software Architecture Document | PA4 | C4 diagrams (System Context, Container, Component) and deployment diagram |
| Working Web Application | PA3–PA5 | Full-stack implementation across all sprints using Spec Kit workflow |
| Test Plan & Test Cases | PA5 | Test plan, manual test cases, execution results, and bug reports |
| Reflective Report | PA5 | Team reflections on the project, Spec Kit, AI tools, and SDLC process |
| Final Product Demo | PA5 | Live demonstration of all implemented features |

### 2.4 Assumptions

- All team members have basic web development knowledge and will remain available throughout the semester.
- Users have access to a stable internet connection and a modern web browser.
- Feature scope is fixed after the Vision Document is approved, changes require explicit team agreement.

---

## 3. Project Organization
*Performed by: Trần Tường Vi | Reviewed by: Hoàng Trung Kiên | Edited by: Trần Tường Vi*

### 3.1 Team Structure and Roles

The MyUS team consists of 5 members. Each member holds a defined primary role, while documentation and Scrum reporting tasks are rotated equally each sprint. Product coding tasks are distributed based on each member's role and technical strengths, though all members are expected to contribute across the full stack as needed.

| Student ID | Full Name | Role | Primary Responsibilities |
|---|---|---|---|
| 24127586 | Trần Tường Vi | Team Leader / Data Analyst | Lead technical alignment across the team, track sprint milestones, design data models, and analyze project data for insights and reporting. |
| 24127595 | Lê Thị Như Ý | Project Manager | Organize sprint planning sessions, manage workflow tracking on the task board, and ensure timely completion of formal project artifacts. |
| 24127194 | Hoàng Trung Kiên | Frontend Developer | Lead UI/UX implementation, build responsive interface components for student and administrator modules. |
| 24127192 | Dương Minh Huỳnh Khôi | Backend Developer | Design and manage the database schema, develop REST API endpoints, and implement core backend logic. |
| 24127089 | Hồ Thị Như Ngọc | Tester | Lead quality assurance activities, write and execute test cases for all modules, and produce bug reports each sprint. |

### 3.2 Risk Management
#### Risk 1 — Member Unavailability 
- **Description:** A team member may become temporarily unavailable due to illness, exam periods, or personal circumstances, causing delays in their assigned tasks.
- **Mitigation:** All code and decisions are documented and committed regularly. Anticipated absences are flagged at sprint start so tasks can be redistributed immediately.
 
#### Risk 2 — AI Recommendation Inaccuracy 
- **Description:** The AI chatbot may recommend courses that are incorrect or unsuitable for a student's actual academic standing, reducing trust in the feature and potentially misleading students' planning.
- **Mitigation:** Course recommendations are validated against defined prerequisite rules before being shown to students. The chatbot is clearly presented as a suggestion tool, not an official advisor. The Tester designs specific test cases to verify recommendation correctness across different student scenarios.
 
#### Risk 3 — Scope Creep
- **Description:** With 9 functional groups and numerous use cases, new feature requests mid-project could stretch the team beyond capacity.
- **Mitigation:** Scope is frozen after the Vision Document is approved. New requests go to a future backlog. The Project Manager reviews and approves any changes before they enter a sprint.

#### Risk 4 — Unfamiliarity with Tech Stack
- **Description:** Team members may lack hands-on experience with the chosen frameworks and tools, slowing down development especially in early sprints.
- **Mitigation:** Each member completes relevant self-training before coding begins. Tasks are assigned based on each member's strengths, and the Team Leader provides technical support when teammates are stuck.

---

## 4. Project Plan
*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

### 1. Execution Process

The project applies the **S**crum framework, divided into 5 Sprints, with each Sprint lasting 2–3 weeks. All activities are tightly synchronized on the Jira board. Core Quality Principle: Each task must have exactly 1 Assignee and 1 independent Reviewer.

### 2. Build Plan Overview

* **Build 1 (End of Sprint 2):** MVP Version – Authentication \& Student Academic Self-Service.
* **Build 2 (End of Sprint 3):** Integration of Grade Appeal \& AI Support Workflow.
* **Build 3 (End of Sprint 4):** Admin Academic Operations Update \& System Beta Release.
* **Build 4 (Mid-Sprint 5):** Packaging the Final Release Candidate for UAT \& Demo.

### 3. Sprints Overview

#### Sprint 1 – Completed

* **Duration:** 27/05/2026 - 06/06/2026
* **Objectives:**

  * Project initiation, requirements analysis, User Stories specification, and project planning.
  * Complete PA1 requirements.

#### Sprint 2: Foundation \& Student Academic Self-Service Portal

* **Duration:** 06/06/2026 - 20/06/2026
* **Objectives:**

  * Complete PA2 requirements.
  * Focus on establishing the core technical infrastructure and completing the MVP version to allow students to self-service basic academic tasks.

##### Report Writing Task Schedule:

|Task ID|Task Description|Assignee|Reviewer|Deadline|Prerequisites|Backup Member|
|-|-|-|-|-|-|-|
|**Speckit01**|Members self-summarize and review the speckit|Remaining members|Ý|10/06|None|Ý|
|**Speckit02**|Spec kit: Finalization after review|Ý|Vi|14/06|Speckit01|Kiên|
|**Report01**|AI Usage Report (draft) and Weekly Report|Vi|Kiên|14/06|None|Ngọc|
|**ProjectPlan01**|Introduction, Project Overview, and Project Organization|Vi|Kiên|14/06|None|Kiên|
|**ProjectPlan02**|Project Plan|Ngọc|Ý|14/06|None|Khôi|
|**VisionDoc01**|Introduction and Positioning|Vi|Kiên|14/06|None|Ngọc|
|**VisionDoc02**|Stakeholder \& User and Product Overview|Kiên|Khôi|14/06|None|Ý|
|**VisionDoc03**|Product Features|Ý|Vi|14/06|None|Kiên|
|**VisionDoc04**|Non-Functional Requirements|Khôi|Ngọc|14/06|None|Vi|

##### Phase 1: Setup (Shared Infrastructure)

**Purpose:** Project initialization and core scaffolding for frontend, backend, and shared configuration.

|Task ID|Task Description|Assignee|Reviewer|Deadline|Prerequisites|Backup Member|
|-|-|-|-|-|-|-|
|**T001**|Create backend Spring Boot project skeleton|Khôi|Ngọc|11/06|None|Ngọc|
|**T002**|Create React frontend project skeleton|Kiên|Ý|11/06|None|Ý|
|**T003**|Configure linting, formatting, env variables|Ý|Khôi|14/06|T001, T002|Kiên|
|**T004**|Configure JWT auth dependencies in backend|Khôi|Kiên|14/06|T001|Ngọc|
|**T005**|Configure frontend routing \& global layout|Kiên|Ý|14/06|T002|Ý|
|**T006**|Add initial API docs scaffolding|Ngọc|Kiên|14/06|T001|Vi|

##### Phase 2: Foundational (Blocking Prerequisites)

**Purpose:** Core backend and frontend infrastructure that must be complete before user story implementation begins.

|Task ID|Task Description|Assignee|Reviewer|Deadline|Prerequisites|Backup Member|
|-|-|-|-|-|-|-|
|**T007**|Setup SQL Server schema \& DB migrations|Vi|Kiên|16/06|T001|Ngọc|
|**T008**|Implement JWT auth filter \& security config|Khôi|Ngọc|16/06|T001, T004|Ngọc|
|**T011**|Add backend API exception handling|Ngọc|Ý|16/06|T001|Vi|
|**T013**|Implement frontend shared data services|Ý|Vi|17/06|T002|Kiên|
|**T009**|Implement RBAC (Student \& Admin roles)|Khôi|Ngọc|18/06|T008|Vi|
|**T010**|Create auth \& profile entities in backend|Vi|Kiên|18/06|T007|Khôi|
|**T012**|Implement frontend auth state \& protected routes|Kiên|Khôi|19/06|T002, T005|Ý|
|**T014**|Add baseline API documentation and developer guide references in backend/README.md|Vi|Kiên|20/06|T006|Khôi|
|**T014**|Add baseline API documentation and developer guide references in frontend/README.md|Ý|Vi|20/06|T006|Kiên|

##### Phase 3: MVP - Student Academic Self-Service

**Goal:** Enable authenticated students to view and manage their profile, register for courses, view grades and timetable, and track tuition details independently.  
**Independent Test:** A student logs in, updates their profile, registers for a course, views timetable/grades, and reviews tuition balance without administrator interaction.

|Task ID|Task Description|Assignee|Reviewer|Deadline|Prerequisites|Backup Member|
|-|-|-|-|-|-|-|
|**T015**|Implement student profile retrieval endpoint|Vi|Khôi|26/06|None|Ngọc|
|**T016**|Implement student profile update service|Vi|Khôi|27/06|T015|Khôi|
|**T017**|Implement student profile view \& edit UI|Ý|Kiên|28/06|T015, T016|Kiên|
|**T018**|Implement course catalog browsing endpoint|Khôi|Ngọc|30/06|None|Vi|
|**T020**|Implement enrollment record service|Khôi|Ngọc|01/07|T018|Ngọc|
|**T019**|Implement frontend course browsing \& registration|Kiên|Ý|02/07|T018, T020|Ý|
|**T021**|Implement timetable \& course schedule UI|Kiên|Ý|03/07|T019|Ý|
|**T022**|Implement grade retrieval \& GPA calculation|Ngọc|Vi|05/07|None|Khôi|
|**T024**|Implement tuition balance \& payment APIs|Vi|Khôi|06/07|None|Ngọc|
|**T023**|Implement frontend grade dashboard \& GPA|Ý|Kiên|07/07|T022|Kiên|
|**T025**|Implement frontend tuition summary UI|Ý|Kiên|08/07|T024|Kiên|
|**T026**|Add backend unit tests for US1|Ngọc|Khôi|10/07|T016, T020, T022, T024|Vi|
|**T027**|Add frontend integration tests for US1|Kiên|Ý|10/07|T017, T019, T021, T023, T025|Ý|

#### Sprint 3: Grade Appeal Process \& AI Virtual Assistant

* **Duration:** 29/06/2026 - 18/07/2026
* **Objectives:**

  * Build an advanced student support system, including the grade appeal submission workflow and AI Chatbot consultation.
  * Complete PA3 requirements.

##### Phase 4: Grade Appeal and Support Workflow

**Goal:** Enable students to submit grade appeals, track status, upload supporting documents, and access FAQ/support resources including an AI learning path chatbot.  
**Independent Test:** A student submits a grade appeal, views status updates, and receives guidance from the chatbot or FAQ section without administrator assistance.

|Task ID|Task Description|
|-|-|
|**T028**|Implement grade appeal submission endpoint.|
|**T029**|Implement supporting document upload handling.|
|**T030**|Implement appeal status tracking endpoint.|
|**T031**|Implement appeal deadline configuration \& validation.|
|**T032**|Implement frontend grade appeal submission, status pages.|
|**T033**|Implement AI chatbot backend adapter \& recommendation service.|
|**T034**|Implement frontend chatbot experience \& FAQ search UI.|
|**T035**|Add backend unit tests for appeal workflows \& chatbot.|
|**T036**|Add frontend integration tests for US2.|


#### Sprint 4: Administrator Operations Tools

* **Duration:** 19/07/2026 - 03/08/2026
* **Objectives:**

  * Develop specialized business tools for Administrators (Admin) and conduct system-wide integration testing.
  * Complete PA4 requirements.

##### Phase 5: Administrator Academic Operations

**Goal:** Give administrators tools to import data, manage class transfers, process appeals, and view student records efficiently.  
**Independent Test:** An administrator imports student/course data, reviews a grade appeal, manages a class transfer, and retrieves a student record without relying on student workflows.

|Task ID|Task Description|
|-|-|
|**T037**|Implement bulk data import endpoint \& validation.|
|**T038**|Implement class transfer request handling \& management.|
|**T039**|Implement administrator grade appeal processing endpoint.|
|**T040**|Implement student record search \& detailed endpoint.|
|**T041**|Implement admin UI for student records, bulk import \& class transfer.|
|**T042**|Add backend tests for admin workflows.|
|**T043**|Add frontend acceptance tests for admin workflows.|


#### Sprint 5: Integration, Security \& Packaging

* **Duration:** 04/08/2026 - 22/08/2026
* **Objectives:**

  * Perform security assessments, finalize documentation, conduct User Acceptance Testing (UAT), and prepare the final final demo script.
  * Complete PA5 requirements.

##### Phase 6: Polish & Cross-Cutting Concerns

**Purpose:** Finalize documentation, testing, and cross-module quality checks across the whole system.

|Task ID|Task Description|
|-|-|
|**T044**|Document backend REST APIs \& auth flows.|
|**T045**|Document frontend user guide, survey workflows, support pages.|
|**T046**|Document deployment \& environment setup.|
|**T047**|Review application-wide security, privacy \& sensitive data handling.|
|**T048**|Perform end-to-end User Acceptance Testing (UAT).|
|**T049**|Implement final logging, error reporting \& accessibility improvements.|




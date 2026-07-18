# REVISED PROJECT PLAN - MyUS

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## 1. Introduction

 
MyUS is a web-based academic portal designed to digitalize the academic and administrative operations of a university. It provides a unified workspace that eliminates manual paperwork and ensures the accuracy and accessibility of educational data across the institution.
 
The platform serves two primary user groups. Students can independently manage course registration, track tuition fees, view grades and GPA and submit grade appeals. Administrators can upload academic schedules, manage class transfers, process grade appeals, and view student records. Both groups interact through role-specific interfaces tailored to their needs.
 
A key feature of MyUS is the AI Learning Path Chatbot, which analyzes each student's completed credits and remaining degree requirements to recommend the most suitable courses for the upcoming semester, supporting timely graduation.
 
This document outlines the project's overview, team organization, risk management strategies, and sprint-based development plan.

---

## 2. Project Overview

### 2.1 Goals
1. Digitize the university's academic and administrative processes, minimizing paperwork and reducing manual errors.
2. Provide a centralized, role-based platform that gives both students and administrators real-time access to accurate academic data.
3. Leverage AI to support student academic planning, reducing the risk of delayed graduation due to missed prerequisites or miscalculated credits.

### 2.2 Scope

The system covers 9 functional groups spanning two user roles — Student and Administrator — delivered as a responsive web application. The platform supports all major browsers (Chrome, Edge, Firefox, Safari) and devices (desktop, laptop, tablet, smartphone) on Windows, macOS, Linux, Android, and iOS.

Out of scope: native mobile applications, integration with third-party LMS platforms, and direct online payment processing for tuition fees.

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

### 1. Execution Process

The project applies the Scrum framework, divided into 5 Sprints, with each Sprint lasting 2–3 weeks. All activities are tightly synchronized on the Jira board. Core Quality Principle: Each task must have exactly 1 Assignee and 1 independent Reviewer.

### 2. Build Plan Overview

* **Build 1 (End of Sprint 2):** Core Infrastructure & Security Baseline.
* **Build 2 (End of Sprint 3):** MVP Student Portal, Timetable & Grade Appeal Core.
* **Build 3 (End of Sprint 4):** Complete Support System & Admin Academic Operations Beta.
* **Build 4 (Mid-Sprint 5):** Packaging the Final Release Candidate for UAT & Demo.

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
  * Focus on establishing the core technical infrastructure, database schema, and authentication/authorization mechanisms (RBAC) to prepare for MVP feature implementation in the next sprint.

 #### Sprint 3: Grade Appeal Process & AI Virtual Assistant
* **Duration:** 26/06/2026 - 11/7/2026 & 17/7/2026 - 24/07/2026

*Note:*
*Off from 21/06/2026 to 05/06/2026 due to class off.*

*Off from 12/7/2026 to 16/7/2026 for midterm exams.*

* **Objectives:** 

  * Deliver the Student Academic Self-Service MVP (Profile, Course Registration, Grades, Tuition, and initial Timetable UI).
  * Implement the complete Timetable integration (Data & Backend API) and the core components of the Grade Appeal submission workflow (Submission, Upload, Status).
  * Complete PA3 requirements.

### PA3 Report Writing Task Schedule

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **R01** | A - Revised Project Plan | Ngọc | Ý | 23/07 | None | Vi |
| **R02** | B - Detailed Vision Document | Ngọc | Khôi | 23/07 | None | Kiên |
| **R03** | C - Use-Case Model | Ý | Ngọc | 23/07 | None | Khôi |
| **R04** | D - Use-Case Specification (Student) | Ngọc | Vi | 23/07 | R03 | Ý |
| **R05** | D - Use-Case Specification (Admin) | Kiên | Khôi | 23/07 | R03 | Vi |
| **R06** | E - Implement 1 Functional Group using Spec Kit (Video) | Vi | Kiên | 24/07 | Phase 4 | Ngọc |
| **R07** | AI Usage Report | Vi | Kiên | 24/07 | None | Ngọc |
| **R8** | Weekly Report (Plan + Week 1) | Kiên | Khôi | 07/07 | None | Ý |
| **R9** | Weekly Report (Week 2 + Review) | Khôi | Vi | 24/07 | None | Kiên |

### Phase 3: MVP - Student Academic Self-Service

**Goal:** Enable authenticated students to view and manage their profile, register for courses, view grades, access the initial timetable interface, and track tuition details independently.

**Independent Test:** A student logs in, updates their profile, registers for a course, views grades, reviews tuition balance, and accesses the timetable UI without administrator interaction.

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

### Phase 4: Timetable and Support Workflow (Part 1)

**Goal:** Complete the dynamic timetable integration (data modeling and backend API) and enable students to initiate the grade appeal process, including document uploads and status tracking.

**Independent Test:** A student successfully retrieves fully integrated timetable data, submits a grade appeal with supporting documents, and checks the status of their appeal.

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T028** | Mock data | Vi | Khôi | 20/07 | None | Ngọc |
| **T029** | Implement timetable backend API | Kiên | Ngọc | 23/07 | T028 | Vi |
| **T030** | Implement timetable frontend UI | Ý | Kiên | 23/07 | T029 | Ý |
| **T031** | Implement grade appeal submission endpoint | Khôi | Vi | 19/07 | None | Ngọc |
| **T032** | Implement supporting document upload handling | Khôi | Vi | 20/07 | T031 | Kiên |
| **T033** | Implement appeal status tracking endpoint | Ngọc | Khôi | 21/07 | T031 | Vi |
| **T034** | Implement frontend grade appeal submission, status pages | Ý | Kiên | 22/07 | T031, T033 | Kiên |

---

### Sprint 4: Support Workflow (Part 2) & Administrator Operations Tools

* **Duration:** 25/07/2026 - 07/08/2026
* **Objectives:**
* Deliver the AI Learning Path Chatbot and finalize the Grade Appeal workflow configurations.
* Implement Administrator Academic Operations (bulk data import, class transfer, grade appeal processing, and student records).
* Complete PA4 requirements.



#### Phase 4: Timetable and Support Workflow (Part 2)

**Goal:** Enable the AI chatbot consultation feature and finalize the grade appeal workflow with deadline configurations and system testing.

**Independent Test:** A student interacts with the AI chatbot for course recommendations and attempts to submit a grade appeal past the configured deadline to verify system validation.

| Task ID | Task Description |
| --- | --- |
| **T035** | Implement appeal deadline config & validation |
| **T036** | Implement AI chatbot backend adapter & recommendation service |
| **T037** | Implement frontend chatbot experience & FAQ search UI |
| **T038** | Add backend unit tests for appeal workflows & chatbot |
| **T039** | Add frontend integration tests for US2 |

#### Phase 5: Administrator Academic Operations

**Goal:** Provide administrators with robust tools to import data, manage class transfers, process grade appeals, and search student records.

**Independent Test:** An administrator successfully imports bulk data, approves a class transfer request, resolves a pending grade appeal, and views a detailed student record.

| Task ID | Task Description |
| --- | --- |
| **T040** | Implement bulk data import endpoint & validation |
| **T041** | Implement class transfer request handling & management |
| **T042** | Implement administrator grade appeal processing endpoint |
| **T043** | Implement student record search & detailed endpoint |
| **T044** | Implement admin UI for student records, bulk import & class transfer |
| **T045** | Add backend tests for admin workflows |
| **T046** | Add frontend acceptance tests for admin workflows |

---

### Sprint 5: Integration, Security & Packaging

* **Duration:** 08/08/2026 - 22/08/2026
* **Objectives:**
* Perform end-to-end User Acceptance Testing (UAT) and system-wide security reviews.
* Finalize system documentation, logging, and cross-cutting improvements.
* Complete PA5 requirements.



#### Phase 6: Polish & Cross-Cutting Concerns

**Goal:** Finalize system documentation, conduct security reviews, and execute User Acceptance Testing (UAT) to prepare the final release candidate.

**Independent Test:** An end-user successfully executes the UAT script without critical errors, and a developer can successfully deploy the system using the provided environment documentation.

| Task ID | Task Description |
| --- | --- |
| **T047** | Document backend REST APIs & auth flows |
| **T048** | Document frontend user guide, support pages |
| **T049** | Document deployment & environment setup |
| **T050** | Review application-wide security, privacy & sensitive data handling |
| **T051** | Perform end-to-end User Acceptance Testing (UAT) |
| **T052** | Implement final logging, error reporting & accessibility improvements |
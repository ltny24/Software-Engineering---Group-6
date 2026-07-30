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
* **Build 3 (End of Sprint 4):** Complete Grade Appeal System, AI Learning Path Chatbot & FAQ Support (Beta).
* **Build 4 (Mid-Sprint 5):** Administrator Academic Operations + Packaging the Final Release Candidate for UAT & Demo.

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

#### Sprint 3: Grade Appeal Process & AI Virtual Assistant — Completed

* **Duration:** 26/06/2026 - 11/7/2026 & 17/7/2026 - 24/07/2026

*Note:*
*Off from 21/06/2026 to 25/06/2026 due to class off.*

*Off from 12/7/2026 to 16/7/2026 for midterm exams.*

* **Objectives:**

  * Delivered the Student Academic Self-Service MVP in full (Profile, Course Registration, Grades, Tuition, and Timetable UI).
  * Completed PA3 requirements (Revised Project Plan, Vision Document, Use-Case Model & Specifications, initial Spec Kit Functional Group demo).
---

### Sprint 4: Grade Appeal System, AI Learning Path Chatbot & FAQ Support + PA4 Documentation

* **Duration:** 25/07/2026 - 07/08/2026
* **Objectives:**
  * Complete PA4 requirements: Revised Use-Case Specification (2nd submission), Software Architecture Document (System Context, Container, Component diagrams), Deployment Diagram, AI Usage Report, and Weekly Reports.
  * Fully implement User Story 2 using the Spec Kit workflow: the Grade Appeal System (FG2), the AI Learning Path Chatbot & Support module (Profile Analysis, Smart Course Suggestions, Graduation Tracking), and the centralized FAQ Library (FG6) — satisfying the "Implement Functional Groups using Spec Kit" code deliverable.

#### PA4 Report & Documentation Task Schedule

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **R1** | A - Revised Use-Case Specification and Revised Use-Case Model (2nd submission) + Update Project Plan | Ngọc | Ý | 30/07 | None | Vi |
| **R2** | B - System Context Diagram | Ý | Vi | 30/07 | None | Kiên |
| **R3** | C - Container Diagram | Vi | Kiên | 30/07 | None | Ngọc |
| **R4** | C - Component Diagram | Khôi | Ngọc | 30/07 | R12 | Kiên |
| **R5** | D - Deployment Diagram | Kiên | Khôi | 30/07 | R12, R13 | Ý |
| **R6** | F - AI Usage Report (1st) | Vi | Kiên | 30/07 | None | Ý |
| **R7** | Spec Kit implementation demo video (FG6) | Kiên | Khôi | 04/08 | T038, T039 | Ý |



#### Phase 4: Grade Appeal System, AI Chatbot & Support (User Story 2)

**Goal:** Enable students to digitally submit grade appeals, track real-time processing status with fee payment deadlines, access a centralized FAQ library, and receive personalized 24/7 academic counseling via the AI Learning Path Chatbot.

**Independent Test:** A student submits a grade appeal with supporting documents, monitors real-time status and payment deadlines, searches FAQ resources, and receives customized course recommendations and graduation pathway simulations from the AI chatbot — all without administrator assistance.

**FG2 — Grade Appeal System ("submit")**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T028** | Digital grade appeal submission endpoint (multipart/form-data) | Ngọc | Ý | 30/07 | None | Vi |
| **T029** | Supporting document upload handling, file validation & storage | Ngọc | Ý | 30/07 | T028 | Vi |
| **T031** | Frontend grade appeal submission form & file dropzone UI | Ngọc | Ý | 30/07 | T028, T029 | Vi |

**FG2 — Grade Appeal System ("track")**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T030** | Appeal status tracking endpoint (Pending/Processing/Resolved + fee deadline) | Vi | Kiên | 02/08 | T028 | Khôi |
| **T032** | Frontend appeal status dashboard UI (progress, file links, deadline highlight) | Vi | Kiên | 02/08 | T030 | Khôi |

**AI Chatbot & Support (Functional Group 3 — AI Module)**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T033** | Profile & Progress Analysis engine (transcript, completed credits vs. curriculum) | Khôi | Ngọc | 02/08 | None | Kiên |
| **T034** | Smart Course Suggestion service (prerequisite/corequisite mapping) | Khôi | Ngọc | 02/08 | T033 | Kiên |
| **T035** | Graduation Tracking engine (pathway simulation, milestone tracking) | Khôi | Ngọc | 02/08 | T033, T034 | Ngọc |
| **T036** | Chatbot REST controller & dialogue management adapter | Khôi | Ngọc | 02/08 | T033–T035 | Ngọc |
| **T037** | Frontend AI Chatbot UI (suggestion cards, roadmap, graduation timeline) | Khôi | Ngọc | 02/08 | T036 | Kiên |

**FG6 — Support & FAQ + Video**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T038** | Centralized FAQ library search endpoint | Kiên | Khôi | 04/08 | None | Ý |
| **T039** | Frontend FAQ searchable library & self-service support UI | Kiên | Khôi | 04/08 | T038 | Ý |
---

# Sprint 5 Plan — MyUS University Portal System

### Sprint 5: Administrator Academic Operations & Final Packaging

* **Duration:** 08/08/2026 - 22/08/2026
* **Objectives:**
  * Implement Administrator Academic Operations (User Story 3): Master Schedule Upload (FG7), Student Class Transfer Management (FG7), Grade Appeal Processing (FG8), and Student Records Administration (FG9) — moved here from Sprint 4.
  * Finalize Polish & Cross-Cutting work: Evaluation Survey (FG5), full system documentation, security/privacy review, end-to-end UAT, and final logging/accessibility improvements.
  * Complete PA5 requirements: Test Plan & Test Cases, Reflective Report, Final Product Demo.

---

#### Phase 5: Administrator Academic Operations (User Story 3)

**Goal:** Provide administrators with comprehensive tools to upload master academic schedules, manage student class transfers, process grade appeals with fee deadline enforcement, and inspect detailed student records.

**Independent Test:** An administrator imports global academic schedules, resolves scheduling conflicts via manual class transfers, reviews and updates grade appeal statuses with fee deadlines, and searches detailed student records without student workflow dependencies.

**FG7 — Master Schedule Upload & Class Transfer Management**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T042** | Master Schedule Upload endpoint (bulk import calendars, exams, offerings) | Khôi | Ngọc | 10/08 | None | Ngọc |
| **T043** | Student Class Transfer Management service | Khôi | Ngọc | 11/08 | None | Ngọc |
| **T044** | Frontend Schedule Upload & Class Transfer management UI | Khôi | Ngọc | 11/08 | T042, T043 | Ngọc |

**FG8 — Admin Grade Appeal Processing**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T045** | Admin Grade Appeal Processing endpoint (status update + fee deadline input) | Vi | Kiên | 10/08 | T030 | Kiên |
| **T046** | Frontend Appeal Processing dashboard UI | Vi | Kiên | 11/08 | T045 | Kiên |

**FG9 — Student Records Administration**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T047** | Student Records search & detailed retrieval endpoint | Kiên | Khôi | 10/08 | None | Khôi |
| **T048** | Frontend Student Records search & detail inspection UI | Kiên | Khôi | 11/08 | T047 | Khôi |

**Phase 5 Verification & Testing**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T040** | Backend unit tests — Phase 4 (appeal routing, fee deadline calc, transcript analysis, course recommendation, graduation sim, FAQ search) | Ngọc | Ý | 13/08 | T028–T039 | Khôi |
| **T041** | Frontend integration tests — Phase 4 (appeal submission/status, chatbot prompts, FAQ filtering) | Ngọc | Ý | 13/08 | T028–T039 | Kiên |
| **T049** | Backend tests (schedule sync, transfer conflicts, appeal deadlines, record access security) | Ngọc | Ý | 14/08 | T042–T047 | Vi |
| **T050** | Frontend acceptance tests (schedule upload, transfer, appeal processing, record search) | Ngọc | Ý | 14/08 | T044, T046, T048 | Kiên |

---

#### Phase 6: Polish & Cross-Cutting Concerns

**Goal:** Complete system-wide feedback mechanisms, finalize documentation, ensure security compliance, and execute end-to-end quality validation across all functional modules.

**Independent Test:** An end-user successfully executes the UAT script without critical errors, and a developer can successfully deploy the system using the provided environment documentation.

**FG5 — Evaluation Survey**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T051** | End-of-semester Evaluation Survey submission endpoint (FG5) | Ý | Vi | 16/08 | None | Vi |
| **T052** | Frontend evaluation survey form & feedback UI (FG5) | Ý | Vi | 16/08 | T051 | Vi |

**Documentation & Cross-Cutting Work**

| Task ID | Task Description | Assignee | Reviewer | Deadline | Prerequisites | Backup Member |
| --- | --- | --- | --- | --- | --- | --- |
| **T053** | Document backend REST APIs, auth flows & AI chatbot endpoints | Khôi | Ngọc | 17/08 | None | Vi |
| **T054** | Document frontend user guide, survey & AI support workflows | Kiên | Ý | 17/08 | None | Ngọc |
| **T055** | Document deployment, cloud DB setup & environment configuration | Vi | Khôi | 17/08 | None | Ý |
| **T056** | Review application-wide security, privacy & sensitive student data handling | Ngọc | Vi | 17/08 | None | Khôi |
| **T057** | End-to-end UAT covering all 9 Functional Groups + AI Chatbot | Ngọc | Ý | 17/08 | T040, T041, T042–T056 | Kiên |
| **T058** | Final logging, error reporting & UI/UX accessibility improvements | Kiên | Khôi | 17/08 | T057 | Vi |

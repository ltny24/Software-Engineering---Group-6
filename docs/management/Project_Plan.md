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

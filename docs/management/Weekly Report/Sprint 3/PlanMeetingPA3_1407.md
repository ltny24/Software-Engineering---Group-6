# Meeting Report 6 - Sprint Planning Meeting (Sprint 3 - PA3)

**Course:** CSC13002 - Introduction to Software Engineering\
**Project Assignment:** PA3-2026\
**Group Name:** High5\
**Project Name:** MyUS\
**Meeting Type:** Sprint Planning Meeting (Sprint 3)\
**Meeting Date:** 14/07/2026

---

## 1. Meeting Overview

Team members present:

| Student ID | Full Name | Email |
| --- | --- | --- |
| 24127089 | Hồ Thị Như Ngọc | htnngoc2418@clc.fitus.edu.vn |
| 24127192 | Dương Minh Huỳnh Khôi | dmhkhoi2402@clc.fitus.edu.vn |
| 24127194 | Hoàng Trung Kiên | htkien2415@clc.fitus.edu.vn |
| 24127586 | Trần Tường Vi | ttvi2416@clc.fitus.edu.vn |
| 24127595 | Lê Thị Như Ý | ltny2424@clc.fitus.edu.vn |

This Sprint Planning Meeting was held online to kick off Sprint 3 (PA3-2026). The team reviewed the PA3-2026 requirements document in detail, analyzed TA feedback from PA2-2026, and discussed the scope of work for all six sections (A through F). The Grade Appeal functional group was selected for the Section E full-stack implementation using the Spec Kit workflow. All tasks were assigned with clear deadlines, review pairs, and prerequisite dependencies to ensure a structured delivery for the final PA3 submission.

---

## 2. Meeting Objectives

The objectives of this Sprint Planning Meeting were:

1. Review the PA3-2026 requirements document and understand the grading criteria for all six sections.
2. Analyze TA feedback from PA2-2026 and identify required revisions for the Project Plan and Vision Document.
3. Plan the use-case model (Section C) and use-case specification with prototypes (Section D) covering all functional requirements.
4. Select one functional group for end-to-end implementation using the Spec Kit workflow (Section E).
5. Assign tasks across all PA3 sections based on individual strengths and workload balance.
6. Establish deadlines, review pairs, and the final submission timeline.

---

## 3. Discussion Points

### 3.1. Review of PA3-2026 Requirements Document

The team systematically reviewed the PA3-2026 document covering all six sections and their respective point allocations:

- **Section A — Revised Project Plan (5 points):** Update the project plan based on TA feedback from PA2-2026. A `Changes.md` file must clearly list all modifications compared to the PA2 version. Required updates include refined schedule, project organization, and risk management sections.

- **Section B — Detailed Vision Document (5 points):** Update and complete the vision document based on TA feedback. Detail functional and non-functional requirements, alternatives and competitors, and user environments. All changes must be documented in the same `Changes.md` file used for Section A.

- **Section C — Use-Case Model (10 points):** Model use cases in Mermaid format with actors, use cases, and relationships (include, extend, generalization). The model must comprehensively cover all functional requirements described in the vision document (Section B).

- **Section D — Use-Case Specification (45 points):** Write a complete use-case specification for every use case identified in Section C. Each specification must include: name and ID, actor(s), description, preconditions, basic flow (step-by-step), alternative flows (all possible, not just common ones), postconditions, special requirements, and UI prototype screenshots. Prototypes may be created using AI-powered design tools (Figma, v0, Bolt, Excalidraw, etc.).

- **Section E — Implement 1 Functional Group using Spec Kit (20 points):** Implement one functional group end-to-end covering UI, API/logic, and data persistence. Must follow the Spec Kit workflow: specifications (`spec.md`) → plans (`plan.md`) → tasks (`tasks.md`) → implementation. A video demo with narration must be uploaded to YouTube (Unlisted or Public).

- **Section F — AI Usage Report and Weekly Report (5 points):** Document AI tool usage with a detailed log. Conduct and document Sprint Planning, Scrum meetings, and Sprint Review activities. Include Jira task screenshots showing progress tracking.

### 3.2. TA Feedback Analysis and Revision Strategy (Sections A & B)

The team reviewed the TA feedback received from PA2-2026 and identified the following key revision areas:

- **Project Plan Revisions:** The 5-sprint roadmap requires refinement to better reflect the current project state. The schedule, project organization, and risk management sections need updates with more granular detail and clearer milestone definitions.
- **Vision Document Revisions:** Functional and non-functional requirements need greater specificity. A competitor analysis section must be added, and user environment descriptions require expansion. All 9 functional groupings should be fully described with supporting Mermaid workflow diagrams.
- **Changes.md:** A comprehensive change log must be created documenting all modifications from the PA2 versions, structured with separate sections for each revised document (Project Plan and Vision Document).

Hồ Thị Như Ngọc volunteered to lead the documentation revisions, given her familiarity with the original PA2 documents and her role in testing and quality assurance.

### 3.3. Use-Case Model Planning (Section C)

Lê Thị Như Ý presented the proposed approach for the use-case model:

- All 9 functional groups from the vision document will be systematically mapped to corresponding use cases.
- Two primary actors are identified: **Student** and **Administrator**.
- Relationships (include, extend, generalization) will be identified for shared behaviors such as authentication, notification, data validation, and grade management workflows.
- All diagrams will be drawn in Mermaid format and embedded directly in the use-case specification document for seamless integration.
- The model must cover all functional requirements documented in Section B to ensure traceability and completeness.

The team agreed that the use-case model serves as the foundation for Section D and must be finalized early to avoid cascading delays.

### 3.4. Use-Case Specification Strategy (Section D)

The team devoted significant discussion to Section D, which carries the highest point value (45 points) and represents the most labor-intensive deliverable:

- Every use case from Section C requires a complete specification including: use-case name and ID, actor(s), description, preconditions, basic flow (step-by-step enumeration), alternative flows (all possible scenarios, not only common ones), postconditions, and special requirements.
- Each use case must be accompanied by UI prototype screenshots showing screens involved in both the basic flow and alternative flows.
- AI-powered design tools (v0, Bolt, Figma) will be used to accelerate prototype generation directly from use-case specifications. A key quality check: if a coherent UI cannot be generated from a specification, the specification itself needs refinement — this serves as a built-in validation mechanism.
- Hoàng Trung Kiên will lead the specification writing due to his frontend development expertise and familiarity with user interaction flows.
- Hồ Thị Như Ngọc will handle prototype generation and screenshot integration, leveraging her experience with design tools and documentation.

### 3.5. Functional Group Selection — Grade Appeal (Section E)

The team evaluated all 9 functional groups and selected the **Grade Appeal** functional group for full-stack implementation. The selection criteria included:

- **Feasibility within the sprint timeline:** Grade Appeal has a well-defined scope with clear user flows (submit → review → notify).
- **Backend complexity:** Involves CRUD operations, status management, and role-based access control — demonstrating meaningful technical depth.
- **Frontend richness:** Covers student submission forms, status tracking dashboards, and an admin review interface — showcasing diverse UI patterns.
- **Integration value:** Connects Student, Grade, and Course entities, demonstrating cross-entity relationships in the data model.
- **Distinct from prior work:** Not covered in PA2 implementation, ensuring new contribution.

The implementation breakdown is as follows:

- **Backend (Khôi):** `Appeal` entity with JPA repository, `AppealService` and `AppealServiceImpl` containing business logic, `AppealController` for student-facing endpoints (submit, view status, withdraw), and `AppealAdminController` for admin review endpoints (list, approve, reject). Supporting artifacts include DTOs (`AppealSubmitRequest`, `AppealReviewRequest`, `AppealResponse`) and custom exception handling (`AppealException`).

- **Frontend (Ý):** Student appeal submission form with course/grade selection and reason input, appeal status tracking dashboard with real-time status indicators, and admin review interface for processing appeals (approve/reject with feedback comments).

- **Database & Integration (Vi):** `Appeal` table schema with foreign key relationships to `Student` and `Grade` entities, mock data seeding for development and testing, and end-to-end integration verification across the full stack.

- **Spec Kit Workflow:** The team will strictly follow the spec-driven development workflow: `spec.md` → `plan.md` → `tasks.md` → implementation. All generated Spec Kit artifacts will be preserved for the PA3 submission package.

- **Video Demo:** Khôi will prepare a narrated walkthrough of the implemented Grade Appeal feature, covering both student and admin flows, and upload it to YouTube (Unlisted).

### 3.6. AI Usage Report and Weekly Reporting (Section F)

Trần Tường Vi will manage the Section F deliverables:

- Maintain a detailed AI usage log documenting all AI tools used throughout Sprint 3 (Claude, v0/Bolt for prototypes, GitHub Copilot, etc.).
- Document all Sprint 3 meetings: Sprint Planning, Scrum meetings, and Sprint Review.
- Capture Jira task screenshots showing task assignments and progress tracking for the sprint.
- Compile all weekly meeting minutes and reports into the final submission package.

---

## 4. Work Assignment (PA3-2026)

### A. PA3 Document & Analysis Tasks (Sections A–D, F)

| Section | Task Description | Person in Charge | Reviewer | Requirement | Deadline | Prerequisites |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | Revised Project Plan — Update based on TA feedback from PA2-2026. Refine schedule, project organization, and risk management. Document all changes in `Changes.md`. | Hồ Thị Như Ngọc (24127089) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 Section A guidelines | 18/07/2026 | PA2 Project Plan |
| **B** | Detailed Vision Document — Update functional and non-functional requirements, add competitor analysis, expand user environment descriptions. Document all changes in `Changes.md`. | Hồ Thị Như Ngọc (24127089) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 Section B guidelines | 18/07/2026 | PA2 Vision Document |
| **C** | Use-Case Model — Create Mermaid diagrams with actors, use cases, and relationships (include, extend, generalization). Must cover all functional requirements from vision document. | Lê Thị Như Ý (24127595) | Hoàng Trung Kiên (24127194) | Follow PA3 Section C guidelines | 20/07/2026 | Section B |
| **D** | Use-Case Specification — Complete specification for every use case: name/ID, actors, description, preconditions, basic flow, alternative flows, postconditions, special requirements, and prototype screenshots. | Hoàng Trung Kiên (24127194), Hồ Thị Như Ngọc (24127089) | Lê Thị Như Ý (24127595), Trần Tường Vi (24127586) | Follow PA3 Section D guidelines | 25/07/2026 | Section C |
| **F** | AI Usage Report & Weekly Report — AI usage log, Sprint Planning/Scrum/Review meeting documentation, and Jira task screenshots. | Trần Tường Vi (24127586) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 Section F guidelines | 28/07/2026 | None |

### B. Section E — Grade Appeal Implementation Breakdown

| Sub-task ID | Description | Person in Charge | Reviewer | Deadline |
| --- | --- | --- | --- | --- |
| **E-BE** | Backend: `Appeal` entity, `AppealRepository`, `AppealService`/`AppealServiceImpl`, `AppealController`, `AppealAdminController`, DTOs (`AppealSubmitRequest`, `AppealReviewRequest`, `AppealResponse`), and custom exception handling (`AppealException`) | Dương Minh Huỳnh Khôi (24127192) | Trần Tường Vi (24127586) | 24/07/2026 |
| **E-FE** | Frontend: Student appeal submission form with course/grade selection, appeal status tracking dashboard, and admin review interface (approve/reject with feedback) | Lê Thị Như Ý (24127595) | Dương Minh Huỳnh Khôi (24127192) | 26/07/2026 |
| **E-DB** | Database: `Appeal` table schema with foreign keys to `Student` and `Grade` entities, mock data for testing, and integration verification | Trần Tường Vi (24127586) | Lê Thị Như Ý (24127595) | 24/07/2026 |
| **E-SK** | Spec Kit artifacts: `spec.md`, `plan.md`, `tasks.md` for the Grade Appeal functional group — generated and preserved for submission | All Section E members | Hoàng Trung Kiên (24127194) | 28/07/2026 |
| **E-DEMO** | Video demo with narration — walkthrough of student and admin appeal flows, uploaded to YouTube (Unlisted), link included in submission | Dương Minh Huỳnh Khôi (24127192) | All Section E members | 28/07/2026 |

### C. Final Submission Package

| Task Description | Person in Charge | Deadline |
| --- | --- | --- |
| Compile all Markdown documents, convert to PDF, capture Git log screenshot, and package as `PA3-Group[GroupId].zip` | Trần Tường Vi (24127586) | 30/07/2026 |

---

## 5. Decisions Made

1. All six PA3 sections (A–F) are formally assigned as documented in Section 4, with explicit review pairs, deadlines, and prerequisite dependencies to ensure traceability and accountability.

2. The **Grade Appeal** functional group is selected for Section E full-stack implementation. It covers student appeal submission, admin review workflow (approve/reject with feedback), and appeal result notification — demonstrating meaningful end-to-end functionality.

3. AI-powered design tools (v0, Bolt, Figma) will be used to generate UI prototypes for Section D use-case specifications. The prototype generation process serves as a built-in quality gate: if a specification cannot produce a coherent UI, the specification itself requires refinement.

4. All changes to the Project Plan (Section A) and Vision Document (Section B) from their PA2 versions must be recorded in a single `Changes.md` file with clearly separated sections for each document, as required by PA3 guidelines.

5. The team will rigorously follow the Spec Kit workflow for Section E — `spec.md` → `plan.md` → `tasks.md` → implementation — and preserve all generated artifacts for the PA3 submission package.

6. Section F reports must include Jira task screenshots showing task assignments, status updates, and progress tracking throughout Sprint 3.

7. All Markdown documents must be converted to PDF format for the final submission package (`PA3-Group[GroupId].zip`), along with the Git log screenshot confirming all members' contributions.

---

## 6. Next Steps

1. **Immediate (14/07–18/07):** Hồ Thị Như Ngọc to begin revisions on the Project Plan (Section A) and Vision Document (Section B), incorporating TA feedback from PA2-2026. Dương Minh Huỳnh Khôi to complete peer review by 18/07/2026.

2. **By 18/07:** Finalize Sections A and B, including a comprehensive `Changes.md` file documenting all modifications from PA2 versions.

3. **By 20/07:** Lê Thị Như Ý to finalize the use-case model (Section C) with all Mermaid diagrams covering all functional requirements from the vision document. Hoàng Trung Kiên to complete peer review.

4. **By 24/07:** Dương Minh Huỳnh Khôi to complete backend implementation (E-BE) and Trần Tường Vi to complete database schema and mock data (E-DB) for the Grade Appeal feature.

5. **By 25/07:** Hoàng Trung Kiên and Hồ Thị Như Ngọc to complete all use-case specifications (Section D) with prototype screenshots integrated. Lê Thị Như Ý and Trần Tường Vi to complete peer review.

6. **By 26/07:** Lê Thị Như Ý to complete frontend implementation (E-FE) for the Grade Appeal feature.

7. **By 28/07:** Section E team (Khôi, Vi, Ý) to finalize all Spec Kit artifacts (E-SK), complete integration testing, and record the video demo (E-DEMO). Trần Tường Vi to finalize the AI Usage Report and all weekly meeting documentation (Section F).

8. **By 30/07:** Trần Tường Vi to compile the final PA3 submission package: all Markdown files, PDF conversions, Git log screenshot, Spec Kit artifacts, video demo link, and compressed zip file.

---

## 7. Conclusion

The Sprint 3 Planning Meeting for PA3-2026 was successfully completed. All five members have clear task assignments spanning all six PA3 sections. Hồ Thị Như Ngọc leads the documentation revisions (Sections A & B) incorporating TA feedback from PA2-2026. Lê Thị Như Ý owns the use-case model (Section C), which serves as the foundation for the detailed specifications. Hoàng Trung Kiên and Ngọc collaborate on the comprehensive use-case specifications with AI-generated prototype screenshots (Section D). Dương Minh Huỳnh Khôi, Trần Tường Vi, and Lê Thị Như Ý drive the Grade Appeal functional group implementation using the Spec Kit workflow (Section E), covering backend, frontend, database, and demo video. Trần Tường Vi additionally manages the AI Usage Report and weekly meeting documentation (Section F). All team members are committed to their respective deliverables and will follow the peer review process to ensure quality before the final submission deadline of 30/07/2026.

---

## 8. Appendix - Evidence

The following screenshot serves as proof of the Sprint Planning Meeting held online on 14/07/2026.


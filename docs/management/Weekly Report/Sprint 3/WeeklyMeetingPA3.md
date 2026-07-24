# Meeting Report 7 - Weekly Review & Planning Meeting (Sprint 3 - PA3)

**Course:** CSC13002 - Introduction to Software Engineering\
**Project Assignment:** PA3-2026\
**Group Name:** High5\
**Project Name:** MyUS\
**Meeting Type:** Weekly Review & Planning Meeting\
**Meeting Date:** 16/07/2026

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

This weekly meeting was held online at the start of Sprint 3 (PA3) to review the PA3-2026 requirements document in detail, distribute tasks across all six sections (A through F), evaluate early progress on the documentation revisions, and establish a clear implementation timeline for the remaining deliverables.

---

## 2. Meeting Objectives

The objectives of this Weekly Review & Planning Meeting were:

1. Review the PA3-2026 requirements document and grading criteria in detail.
2. Distribute PA3 tasks (Sections A–F) based on individual strengths, prior contributions, and workload balance.
3. Review early progress on the revised Project Plan (Section A) and Detailed Vision Document (Section B).
4. Plan the use-case model (Section C), use-case specification with prototypes (Section D), and functional group implementation using Spec Kit (Section E).
5. Set precise deadlines, review pairs, and reporting procedures for all PA3 deliverables.

---

## 3. Discussion Points

### 3.1. Review of PA3-2026 Requirements

The team systematically reviewed the PA3-2026 document covering all six sections and their point allocations:

- **Section A — Revised Project Plan (5 points):** Update the project plan based on TA feedback from PA2-2026. A `Changes.md` file must clearly list all modifications compared to the PA2 version.
- **Section B — Detailed Vision Document (5 points):** Update and complete the vision document based on TA feedback. Detail functional and non-functional requirements, alternatives and competitors, and user environments. All changes must be documented in the same `Changes.md` file.
- **Section C — Use-Case Model (10 points):** Model use cases in Mermaid format with actors, use cases, and relationships (include, extend, generalization). Must cover all functional requirements from the vision document.
- **Section D — Use-Case Specification (45 points):** Write a complete use-case specification for every use case, including: name and ID, actor(s), description, preconditions, basic flow, alternative flows, postconditions, special requirements, and UI prototype screenshots. Prototypes may be created using AI-powered design tools (Figma, v0, Bolt, Excalidraw, etc.).
- **Section E — Implement 1 Functional Group using Spec Kit (20 points):** Implement one functional group end-to-end (UI + API/logic + data persistence). Must follow the Spec Kit workflow (specifications → plans → tasks → implementation). Submit a video demo with narration on YouTube (Unlisted or Public).
- **Section F — AI Usage Report and Weekly Report (5 points):** Document AI tool usage with a detailed log. Conduct and document Sprint Planning, Scrum meetings, and Sprint Review. Include Jira task screenshots.

### 3.2. Progress on Documentation Revisions (Sections A & B)

Hồ Thị Như Ngọc reported significant progress on the two revision documents:

- **Revised Project Plan:** Updated the schedule, project organization, and risk management sections based on TA feedback. The 5-sprint roadmap has been refined to reflect the current project state.
- **Detailed Vision Document:** Completed the functional and non-functional requirements with greater detail. Added competitor analysis and refined user environment descriptions. All 9 functional groupings are now fully described with supporting Mermaid workflow diagrams.
- **Changes.md:** A comprehensive change log has been created documenting all modifications from the PA2 versions, structured with separate sections for each revised document.
- Both documents are in the peer review stage and expected to be finalized by 18/07/2026.

### 3.3. Use-Case Model Planning (Section C)

Lê Thị Như Ý presented the initial approach for the use-case model:

- All functional groups from the vision document are being systematically mapped to use cases.
- Two primary actors are defined: **Student** and **Administrator**.
- Relationships (include, extend, generalization) are being identified for shared behaviors such as authentication, notification, and data validation.
- Diagrams will be drawn in Mermaid format and embedded directly in the use-case specification document.
- The model must cover all functional requirements documented in Section B (the vision document).

### 3.4. Use-Case Specification Strategy (Section D)

The team discussed the scope and strategy for Section D, which carries the highest point value (45 points):

- Every use case from Section C requires a complete specification with: name/ID, actors, description, preconditions, basic flow (step-by-step), alternative flows (all possible, not just common ones), postconditions, and special requirements.
- Each use case must be accompanied by UI prototype screenshots showing screens involved in both the basic flow and alternative flows.
- AI-powered design tools (v0, Bolt, Figma) will be used to accelerate prototype generation directly from use-case specifications. If a coherent UI cannot be generated, the specification needs refinement — this serves as a built-in quality check.
- Hoàng Trung Kiên will lead the specification writing, with Hồ Thị Như Ngọc handling the prototype generation and screenshot integration.

### 3.5. Functional Group Implementation — Grade Appeal (Section E)

The team selected the **Grade Appeal** functional group for full-stack implementation using Spec Kit:

- **Backend (Khôi):** Appeal entity with JPA repository, `AppealService` and `AppealServiceImpl` with business logic, `AppealController` for student submission and `AppealAdminController` for admin review. Includes DTOs (`AppealSubmitRequest`, `AppealReviewRequest`, `AppealResponse`) and custom exception handling (`AppealException`).
- **Frontend (Ý):** Student appeal submission form with course/grade selection, appeal status tracking dashboard, and admin review interface for processing appeals (approve/reject with feedback).
- **Database & Integration (Vi):** Appeal table schema with foreign key relationships to Student and Grade entities, mock data for testing, and integration verification.
- **Spec Kit Workflow:** The team will generate specifications, create plans, break down tasks, and implement following the spec-driven development workflow. All Spec Kit artifacts (specs, plans, tasks files) will be preserved for submission.
- **Video Demo:** Khôi will prepare a narrated walkthrough of the implemented feature and upload it to YouTube (Unlisted).

---

## 4. Work Assignment (PA3-2026)

Based on the PA3-2026 requirements document, the tasks are assigned with explicit review pairs and deadlines:

### A. PA3 Document & Implementation Tasks

| Section | Task Description | Person in Charge | Reviewer | Requirement | Deadline | Prerequisites |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | Revised Project Plan — 2nd submission (update based on TA feedback + `Changes.md`) | Hồ Thị Như Ngọc (24127089) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 requirements | 18/07/2026 | PA2 Project Plan |
| **B** | Detailed Vision Document — 2nd submission (update functional/non-functional requirements, alternatives, user environments) | Hồ Thị Như Ngọc (24127089) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 requirements | 18/07/2026 | PA2 Vision Document |
| **C** | Use-Case Model — Mermaid diagrams covering all functional requirements from vision document | Lê Thị Như Ý (24127595) | Hoàng Trung Kiên (24127194) | Follow PA3 requirements | 20/07/2026 | Section B |
| **D** | Use-Case Specification — all use cases with basic flow, alternative flows, and prototype screenshots | Hoàng Trung Kiên (24127194), Hồ Thị Như Ngọc (24127089) | Lê Thị Như Ý (24127595), Trần Tường Vi (24127586) | Follow PA3 requirements | 25/07/2026 | Section C |
| **E** | Implement 1 Functional Group — Grade Appeal end-to-end using Spec Kit workflow | Dương Minh Huỳnh Khôi (24127192), Trần Tường Vi (24127586), Lê Thị Như Ý (24127595) | Hoàng Trung Kiên (24127194), Hồ Thị Như Ngọc (24127089) | Follow PA3 requirements | 28/07/2026 | Sections C, D |
| **F** | AI Usage Report & Weekly Report — AI usage log + Sprint meetings documentation + Jira screenshots | Trần Tường Vi (24127586) | Dương Minh Huỳnh Khôi (24127192) | Follow PA3 requirements | 28/07/2026 | None |

### B. Section E — Grade Appeal Implementation Breakdown

| Sub-task ID | Description | Person in Charge | Reviewer | Deadline |
| --- | --- | --- | --- | --- |
| **E-BE** | Backend: Appeal entity, `AppealRepository`, `AppealService`/`AppealServiceImpl`, `AppealController`, `AppealAdminController`, DTOs, and exception handling | Dương Minh Huỳnh Khôi (24127192) | Trần Tường Vi (24127586) | 24/07/2026 |
| **E-FE** | Frontend: Appeal submission form, status tracking UI, and admin review dashboard | Lê Thị Như Ý (24127595) | Dương Minh Huỳnh Khôi (24127192) | 26/07/2026 |
| **E-DB** | Database: Appeal schema, mock data, and integration verification | Trần Tường Vi (24127586) | Lê Thị Như Ý (24127595) | 24/07/2026 |
| **E-SK** | Spec Kit artifacts: `spec.md`, `plan.md`, `tasks.md` for the Appeal functional group | All Section E members | Hoàng Trung Kiên (24127194) | 28/07/2026 |
| **E-DEMO** | Video demo with narration — upload to YouTube (Unlisted) and include link in submission | Dương Minh Huỳnh Khôi (24127192) | All Section E members | 28/07/2026 |

---

## 5. Decisions Made

1. All six PA3 sections are assigned as documented in Section 4, with clear review pairs, deadlines, and prerequisite dependencies.
2. The **Grade Appeal** functional group is selected for Section E full-stack implementation, covering student appeal submission, admin review workflow, and result notification.
3. AI-powered design tools (v0, Bolt, Figma) will be used to generate UI prototypes for Section D use-case specifications, leveraging the ability to generate prototypes directly from written specifications.
4. All changes to the Project Plan and Vision Document from PA2 versions must be recorded in a single `Changes.md` file with separate sections per document, as required by PA3 guidelines.
5. The team will follow the Spec Kit workflow rigorously for Section E — `spec.md` → `plan.md` → `tasks.md` → implementation — and preserve all generated artifacts for submission.
6. Section F reports will include Jira task screenshots showing task assignments and progress tracking for Sprint 3.
7. All Markdown documents must be converted to PDF for the final submission package (`PA3-Group[GroupId].zip`).

---

## 6. Next Steps

1. **Immediate (by 18/07):** Dương Minh Huỳnh Khôi to complete peer review of Sections A & B (Revised Project Plan, Detailed Vision Document, and `Changes.md`).
2. **By 20/07:** Lê Thị Như Ý to finalize the use-case model (Section C) with all Mermaid diagrams, reviewed by Hoàng Trung Kiên.
3. **By 25/07:** Hoàng Trung Kiên and Hồ Thị Như Ngọc to complete all use-case specifications (Section D) with prototype screenshots, reviewed by Ý and Vi.
4. **By 28/07:** Section E team (Khôi, Vi, Ý) to complete the Grade Appeal full-stack implementation with Spec Kit artifacts and video demo.
5. **By 28/07:** Trần Tường Vi to compile the AI Usage Report and finalize all weekly meeting documentation (Section F).
6. **By 30/07:** Compile the final PA3 submission package: all Markdown files, PDF conversions, Git log screenshot, and compressed zip file (`PA3-Group[GroupId].zip`).

---

## 7. Conclusion

The Weekly Review & Planning Meeting for Sprint 3 (PA3-2026) successfully established a comprehensive task distribution and timeline for all six PA3 sections. Hồ Thị Như Ngọc leads the documentation revisions (Sections A & B), Lê Thị Như Ý owns the use-case model (Section C), Hoàng Trung Kiên and Ngọc collaborate on the detailed use-case specifications (Section D), while Khôi, Vi, and Ý drive the Grade Appeal functional group implementation using Spec Kit (Section E). Trần Tường Vi additionally manages the AI Usage Report and weekly meeting documentation (Section F). All team members are committed to their respective deliverables and will follow the peer review process to ensure quality before final submission.

---

## 8. Appendix - Evidence

The following screenshot serves as proof of the weekly project alignment and review meeting held online on 16/07/2026.

![Weekly Meeting PA3 Evidence](evidence/1607_online.png)

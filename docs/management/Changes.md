# CHANGES - MyUS

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## Revised Project Plan

### 1. Phase 4 Changes

**Phase 4 (Part 1) - Moved to Sprint 3:**
* **Goal Updated:** Focus shifted to dynamic timetable integration (data modeling and API).
* **Independent Test Updated:** Verifies timetable.
* **Task Details Added:**
  * T028 (Mock data): Assigned to Vi, reviewed by Khôi, due 20/07.
  * T029 (Timetable backend API): Assigned to Kiên, reviewed by Ngọc, due 23/07, prerequisite T028.
  * T030 (Timetable frontend UI): Assigned to Ý, reviewed by Kiên, due 23/07, prerequisite T029.

**Phase 4 (Part 2) - Moved to Sprint 4:**
* **Goal Updated:** Focus is now on the AI chatbot consultation feature and finalizing grade appeal workflow (deadline configurations and system testing).
* **Independent Test Updated:** Verifies AI chatbot course recommendations and grade appeal deadline validation.
* **Tasks Reallocated (T035-T039):**
  * T031: Grade appeal submission endpoint.
  * T032: Document upload handling
  * T033: Appeal status tracking endpoint.
  * T034: Frontend appeal submission & status pages.
  * T035: Implement appeal deadline config & validation.
  * T036: Implement AI chatbot backend adapter & recommendation service.
  * T037: Implement frontend chatbot experience & FAQ search UI.
  * T038: Add backend unit tests for appeal workflows & chatbot.
  * T039: Add frontend integration tests for US2.

### 2. General Schedule & Sprint Adjustments
* **Sprint 3 Duration:** Extended to accommodate a midterm break (12/07/2026 - 16/07/2026).
* **Sprint 4 & 5 Timelines:** Shifted to 25/07/2026 - 07/08/2026 and 08/08/2026 - 22/08/2026, respectively.
* **Build Plan Overview:** Build 2 (End of Sprint 3) updated to "MVP Student Portal, Timetable & Grade Appeal Core". Build 3 (End of Sprint 4) updated to "Complete Support System & Admin Academic Operations Beta".
* **Report Tasks:** Added "PA3 Report Writing Task Schedule" table in Sprint 3 with 9 specific tasks (R01-R9), fully detailing assignees, reviewers, deadlines, and prerequisites.
* **In short, Sprint 2:** This summarizes Sprint 2 instead of providing the detailed information of the previous version.

---

## Detailed Vision Document

**1. Section 3.3 (User Environment)**
- Added minimum client hardware requirement: **2 GB RAM**.
- Added minimum supported browser versions: **Chrome 100+, Edge 100+, Firefox 91+, Safari 14+**, cross-referenced to NFR ID21's "latest two major versions" policy so the two don't drift apart.
- Added network bandwidth minimums: **1.5 Mbps** for basic access (profile/grades/timetable/chatbot), **10 Mbps+** recommended for admin bulk operations (Feature 7).

**2. Section 3.5 (Alternatives and Competition)**
- Added a new "Technical Symptom Observed (PA1 Testing)" column with concrete, testable weaknesses per competitor: HTTP 503 errors on HCMUS Portal during peak registration, lack of shared session state across UEH's sub-systems, and a mobile-scaling/table-overflow issue on My Bach Khoa.
- Added a new mapping table tying each weakness directly to a specific MyUS architectural decision (stateless API, single JWT session, responsive breakpoints).
- Added a caveat that these technical symptoms come from the team's own informal PA1 testing and should be re-verified before being treated as a formal external claim.

**3. Section 5.3 (Detailed Functional Requirements) — new subsection**
- Added FR-01 → FR-05, consolidating the 9 existing feature descriptions (Section 5.1) into 5 top-level functional requirements:
  - FR-01 Student Profile & Records Management
  - FR-02 Grade Appeal Workflow
  - FR-03 Course Enrollment & AI-Assisted Advising
  - FR-04 Feedback, Support & FAQ
  - FR-05 Administrative Bulk Operations & Class Control
- Each FR includes Given/When/Then Acceptance Criteria (AC-01.1 … AC-05.3), cross-referenced to existing workflows and NFR IDs (e.g., AC-05.1 → NFR ID19) rather than introduced as standalone/unlinked text.

**4. Section 1 (Introduction → References table)**
- Added 3 rows with confirmed content:
  - **Weekly Meeting 1 - PA2 (11/06/2026)** — Spec Kit peer review, Phase 1 technical progress check, PA2 documentation tracking, next steps to close Phase 1 / open Phase 2.
  - **Weekly Meeting 2 - PA2 (16/06/2026)** — Phase 1 technical task peer review, PA2 documentation tracking, next steps for Phase 2 execution.
  - **PA3 Meeting Plan (26/06/2026)** — mirrors the PA2 meeting pattern: Phase 2 technical/documentation review, next steps to close Phase 2 / open Phase 3.

**5. Section 6 (Non-Functional Requirements — Performance)**
- Converted ID01–ID05 from qualitative ("MUST load responsively") to quantitative, adding a Metric column (matching the format already used by Security/Usability/etc.):
  - ID01: page load **< 2.0s** (95th percentile)
  - ID02: API response **< 500ms** (95th percentile, non-AI endpoints)
  - ID03: bulk import **10,000 records / 60s** with progress feedback
  - ID04: AI chatbot response **< 5.0s** end-to-end
  - ID05: DB query (grade/GPA lookup) **< 200ms** (95th percentile)

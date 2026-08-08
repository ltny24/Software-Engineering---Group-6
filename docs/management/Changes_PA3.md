# MyUS Portal — Changes

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## 1. Use_Case_Model.md (v1.0 → v2.0)

| # | Change | Before | After | Reason |
|---|---|---|---|---|
| 1 | Added missing **Track Tuition Fee (UC-06)** | *Academic & Financial Tracking* only included View Timetable (UC-04) and View Grades & GPA (UC-05). Tuition tracking was absent from both diagrams even though it exists as UC-06 in the spec. | *Academic & Financial Tracking* now includes a third child: **Track Tuition Fee (UC-06)**. | Vision Doc AC-01.2 explicitly requires GPA, timetable, **and tuition balance** to be shown together on one dashboard screen. |
| 2 | Fixed incorrect «include» relationship | *Grade Appeal System* «include»-d *Track Appeal Status* (UC2 → UC2b), implying status tracking is a mandatory step every time an appeal is submitted. | *Track Appeal Status (UC-08)* is now a direct, independent use case invoked by the Student actor — no «include» arrow from Submit Grade Appeal. | Per spec UC-08, tracking is reached independently via "My Appeals" at any time, not executed automatically on every submission — the original «include» violated its own semantics. |
| 3 | Standardized naming across diagrams and spec | Diagram 1 used "Submit Feedback & Surveys"; Diagram 2 used "Submit Feedback & Evaluation"; Diagram 3's FAQ node used "Search Centralized Support & FAQ." None matched the spec. | All nodes now read **"Submit Evaluation Surveys"** and **"Access FAQs & Support"** — matching UC-09 and UC-10 titles exactly. | Removes naming drift between the Vision Doc, Model, and Spec. |
| 4 | Added full traceability | No Use-Case IDs appeared anywhere in the diagrams. | Every node is now labeled with its Use-Case Spec ID (e.g., "UC-04", "UC-11.1"), and a new **Feature → UC-ID mapping table** was added at the top of the document. | A reader previously could not tell which spec use case a diagram node referred to. |
| 5 | Added missing **Perform Student Class Transfer (UC-11.3)** | *Admin Bulk Data & Class Control* only showed Import Student/Course Data (UC-11.1) and Validate Data Format (UC-11.2). Manual class transfer was not modeled at all. | Added **UC7c: Perform Student Class Transfer (UC-11.3)** as an «include» child of UC-11, alongside Import. | Vision Doc Feature 7 explicitly states admins "manually execute student class transfers," and AC-05.3 tests this behavior — neither the model nor the spec (v1.0) captured it. |

---

## 2. UseCase_Specification.md (v1.0 → Revised)

### 2.1 Use-Case ID renumbering (structural)

The Admin section and the Support section were restructured into parent/«include»-child pairs, which shifted almost every Admin ID down and split UC-10 into three use cases. Full mapping:

| Old ID | Old Name | New ID | New Name |
|---|---|---|---|
| UC-03b | Get AI Course Recommendations (extend) | — | **Removed** (folded into UC-10b, see §2.11) |
| UC-10 | Access FAQs & Support | UC-10 | Access Help & Support (now a router use case) |
| — | — | UC-10a | Access FAQs *(new — include)* |
| — | — | UC-10b | AI Learning Assistant (Chatbot) *(new — include, replaces old UC-03b)* |
| UC-12 | Import Student/Course Data | UC-11a | Import Student/Course Data (include) |
| UC-13 | Validate Data Format | UC-11b | Validate Data Format (include) |
| UC-14 | Appeal Processing Management | UC-12 | Appeal Processing Management |
| UC-15 | Set Fee Payment Deadline | UC-12a | Set Fee Payment Deadline (include) |
| UC-16 | Update Appeal Status | UC-12b | Update Appeal Status (include) |
| UC-17 | Student Data Administration | UC-13 | Student Data Administration |
| UC-18 | Search Student Records | UC-13a | Search Student Records (include) |

The Table of Contents was updated to match, and every renumbered use case now explicitly carries `(include)` in its title where it is a sub/included use case.

### 2.2 UC-01 Authenticate / Login

| # | Change |
|---|---|
| 2.2.1 | **Actor(s) expanded**: from "Student only" to "Student, Administrator (via generalized `User` actor)" — login is now explicitly shared by both roles. |
| 2.2.2 | **Brief description rewritten** to reference concrete implementation: `/api/auth/login`, JWT session, role-specific dashboard, and the new forgot/reset-password endpoints (`/api/auth/forgot-password`, `/api/auth/reset-password`). |
| 2.2.3 | **Basic Flow rewritten** with explicit API calls (`POST /api/auth/login`), Spring Security `AuthenticationManager` + BCrypt detail, JWT role claims (`ROLE_STUDENT`/`ROLE_ADMIN`), and role-based redirect (`/dashboard` vs `/admin`). |
| 2.2.4 | **AF2 "Forgot Password" completely redesigned**: old flow was a one-time email reset link (valid 15 min). New flow is a 6-digit verification code (`PasswordResetToken`, valid 15 min) sent to a masked email, entered together with the new password on a single reset screen (`POST /api/auth/reset-password`). |
| 2.2.5 | **AF3 "First-Time Login / Forced Password Change" removed** — no longer modeled. |
| 2.2.6 | **AF4 Session Expiry simplified**: dropped the "silent refresh via refresh token" mechanic; now a plain 401 → logout → redirect to login. |
| 2.2.7 | **AF5 Account Locked renamed/merged** into "AF4 Account Suspension / Inactive Hold," same meaning, simplified wording. |
| 2.2.8 | **Removed**: the "5 failed attempts → 30-minute lockout + security email" behavior (was AF1 detail) is gone; AF1 is now just inline invalid-credential/short-password validation. |
| 2.2.9 | **Special Requirements reworded** to match the new implementation (no more explicit "refresh token" reference, no NFR ID numbers cited). |
| 2.2.10 | **New §7 "Prototype Requirement"** section added, listing the 4 actual screenshot files (Login, Dashboard, InvalidLogin, forgotpass, resetpass). |

### 2.3 UC-02 Update Profile

| # | Change |
|---|---|
| 2.3.1 | **Brief description narrowed**: old version said the student can edit "personal information, contact details, and emergency contacts." New version says only **phone number and address** are editable (`PUT /api/v1/profile`); emergency contact editing is dropped from scope. |
| 2.3.2 | **Basic Flow rewritten** with explicit endpoints (`GET/PUT /api/v1/profile`) and field list: Student ID, Full Name, Email, Major, DOB, Student Type, Enrollment Status (read-only) vs. Phone/Address (editable). |
| 2.3.3 | **AF5 "Contact-Info Change Confirmation to old+new address"** (fraud-prevention notice) — **removed**. |
| 2.3.4 | **AF4 "No Changes Made"** — **removed** as a separate flow. |
| 2.3.5 | **Special Requirements** simplified: dropped the explicit RBAC/NFR ID07-08/ID12 citations, replaced with a direct reference to `@PreAuthorize("hasRole('STUDENT')")` and `ProfileServiceImpl`. |
| 2.3.6 | **New §7 Prototype Requirement** added (myprofile, changePro, successchange screenshots). |

### 2.4 UC-03 Register for Courses / UC-03a / UC-03b

| # | Change |
|---|---|
| 2.4.1 | **UC-03b "Get AI Course Recommendations" (extend) removed entirely** as a standalone use case. Its actor line and Extension Point 6.1 on UC-03 are gone; UC-03's Actor(s) line no longer says "extended by UC-03b." |
| 2.4.2 | AI course-advising functionality is **not deleted from the system** — it reappears, re-scoped and merged, as **UC-10b "AI Learning Assistant (Chatbot)"** reached from the new Help & Support hub (§2.11 below), rather than as an in-registration extension point. |
| 2.4.3 | **UC-03 Brief Description rewritten**: now names concrete endpoints (`GET /api/courses`, `POST /api/registrations`, `GET /api/registrations/me`, `PUT /api/registrations/{id}/drop`) and adds explicit **24-credit maximum per term**, which was previously only implied ("university's per-semester maximum"). |
| 2.4.4 | **Basic Flow restructured** around two UI tabs — "Browse Courses" and "My Registrations" — replacing the old single-cart-then-submit model. Seat reservation is now immediate per course (no batch "Submit Registration" cart step). |
| 2.4.5 | **AF list reduced/renamed**: "Section Full" → "Course Offering Full" (`EnrollmentException`), "Credit Limit Exceeded" now cites the exact 24-credit rule, added "Duplicate Registration" as a new explicit alternative flow, dropped "Draft Cart / Abandon Session" and the old AI-recommendation alternative flow (AF5), since that logic moved to UC-10b. |
| 2.4.6 | **Postconditions/Special Requirements** reworded to remove NFR ID24/ID18/ID30/ID12 citations; now states the 24-credit rule and concurrency consistency in plain terms. |
| 2.4.7 | **UC-03a Check Prerequisites**: title now carries `(include)`; flow simplified (drops "corequisite," "transfer credit/waiver," and "prerequisite rule undefined" alternative flows down to just 2: missing prerequisite, and "no prerequisites required"). |
| 2.4.8 | **New §7 Prototype Requirement** sections added for UC-03 (regCourse, ScheduleConflict, RegSuc, cart) and UC-03a (states it's handled inline, no separate screen). |

### 2.5 UC-04 View Timetable

| # | Change |
|---|---|
| 2.5.1 | **Brief Description rewritten**: now names specific terms (HKI/HKII/HKIII 2025-2026) and fixed daily time slots (Slot 1–6, 07:00–18:00), replacing the generic "weekly calendar, color-coded block" description. |
| 2.5.2 | **View modes changed**: old spec had Week/Month/List toggle; new spec has **Grid View / List View** only (Month view dropped). |
| 2.5.3 | **Removed alternative flows**: "Room/Time Change Notification" (Updated badge), "Exam Overlay," "Sync to Google Calendar," "Download Printable Schedule," and "Schedule Conflict Flag from admin transfer" are all **gone**. Only "No Classes Registered" and a generic "Export Schedule" flow remain. |
| 2.5.4 | **Google Calendar integration dependency removed** — no longer mentioned anywhere in this use case (previously tied to Vision Doc dependency D3). |
| 2.5.5 | **Special Requirements** reduced to a single line about responsive layout; NFR ID13 citation dropped. |
| 2.5.6 | **New §7 Prototype Requirement** added (timetable, timetablelist, detail, noclass screenshots). |

### 2.6 UC-05 View Grades & GPA

| # | Change |
|---|---|
| 2.6.1 | **Brief Description rewritten** with concrete scoring model: numerical scores 0–10 scale, letter grades (A+ through F), grade points on a 4.0 scale, via `GET /api/v1/grades/me`. |
| 2.6.2 | **Removed alternative flows**: "View GPA Trend chart," "Download Unofficial Transcript (PDF)," and "Special Grade Codes (Incomplete/Withdrawn)" are all **gone**. |
| 2.6.3 | **Special Requirements** trimmed to one line (4.0-scale formula compliance); dropped NFR ID30/ID05/ID08/ID12 citations. |
| 2.6.4 | **New §7 Prototype Requirement** added (gpa, grade screenshots). |

### 2.7 UC-06 Track Tuition Fee

| # | Change |
|---|---|
| 2.7.1 | **Brief Description rewritten**: now cites `GET /api/v1/finance/tuition/balance` and an explicit **account standing status** field (Good Standing / Financial Hold), replacing the older narrative description. |
| 2.7.2 | **Removed alternative flows**: "Overdue Balance banner + registration hold," "Paid in Full confirmation," "Download Invoice/Receipt PDF," "Scholarship Pending," "How to Pay (off-platform channels)," and "Dispute a Charge" are all **gone**. Replaced by a single "Financial Hold Alert" flow. |
| 2.7.3 | The explicit statement that "MyUS tracks tuition status; it does not process payments directly" is **removed** from the brief description. |
| 2.7.4 | **New §7 Prototype Requirement** added (tution screenshot). |

### 2.8 UC-07 Submit Grade Appeal / UC-07a Upload Supporting Documents

| # | Change |
|---|---|
| 2.8.1 | **Brief Description rewritten** around `POST /api/appeals`, naming the grade-component options (Midterm, Final, Quiz, Assignment) and the auto-generated tracking code format (e.g. `AP-2026-001`). |
| 2.8.2 | **Removed alternative flows**: "Appeal Window Closed," "Save as Draft," "Withdraw Before Review," and "Appeal Rejected Outright (admin action)" are all **gone**. Only "Missing Field/Attachment" and "Duplicate Active Appeal" remain. |
| 2.8.3 | **Special Requirements simplified**: dropped explicit NFR ID15/NFR ID30 citations and audit-timestamp requirement language. |
| 2.8.4 | **UC-07a max file size reduced**: was "≤10MB," now **≤5MB per file**; accepted formats explicitly listed (PDF, JPG, PNG, DOCX). |
| 2.8.5 | **UC-07a removed alternative flows**: "Upload Failure/network retry," "Remove/Replace a File," and "Maximum Attachment Count Reached" flows dropped to a single combined "Invalid Format or File Exceeds Limit" flow (still capped at 5 files per the Special Requirements line). |
| 2.8.6 | Note: this is the opposite direction from the Use-Case *Model* changelog item #2 above (§1), which corrected an erroneous «include» from Submit Grade Appeal to Track Appeal Status — that fix is preserved here (UC-07 does not include UC-08). |
| 2.8.7 | **New §7 Prototype Requirement** sections added for both UC-07 (formapp, uppform, appsub, missingapp, dup) and UC-07a (uppform, upfail). |
| 2.8.8 | Note: this section supersedes the previously logged item "UC-07 (Submit Grade Appeal) updated — grade sync/suggestion, justification templates, appeal cancellation" from the prior PA3 changelog entry; the actual uploaded revision replaced UC-07 far more broadly than that single item described (see §2.13). |

### 2.9 UC-08 Track Appeal Status

| # | Change |
|---|---|
| 2.9.1 | **Brief Description rewritten**: now a full "tracking dashboard" with KPI summary metrics (total/pending/processing/resolved appeal counts) plus a detail drawer (`GET /api/appeals/me/{appealId}`), replacing the simpler card-list description. |
| 2.9.2 | **Removed alternative flows**: "Fee Deadline Approaching (urgent reminder)," "Fee Deadline Missed → auto-Rejected," "Withdraw a Pending Appeal," "Additional Information Requested," and "Notification Preferences opt-in/out" are all **gone**. Only "No Appeals Submitted" remains as an alternative flow. |
| 2.9.3 | Fee-deadline reference updated to point to the renumbered **UC-12a** (was UC-15). |
| 2.9.4 | **New §7 Prototype Requirement** added (trackapp, viewdetail, emptyapp screenshots). |

### 2.10 UC-09 Submit Evaluation Surveys

| # | Change |
|---|---|
| 2.10.1 | Flow steps unchanged in substance but **each step now has its own screenshot** (eval_page, eval_rate, eval_completed, eval_missing, eval_over, eval_success, eval_save) instead of one screenshot per whole flow. |
| 2.10.2 | **Alternative flows reordered/renumbered**: AF2 "Save and Continue Later" moved from position 2 to position 5; AF numbering for "Evaluation Period Closed" and "Already Submitted" shifted accordingly. No flows were removed. |
| 2.10.3 | **New §7 Prototype Requirement** added, listing 9 target screens to design (previously this section didn't exist for UC-09). |

### 2.11 UC-10 / UC-10a / UC-10b — Access Help & Support (major restructure)

| # | Change |
|---|---|
| 2.11.1 | **UC-10 renamed** from "Access FAQs & Support" to **"Access Help & Support"** and re-scoped as a router/hub use case (`/support`) presenting two cards: **Help & FAQ** and **AI Learning Assistant**, rather than doing FAQ search itself. |
| 2.11.2 | **UC-10a "Access FAQs" (include) — new use case**, splitting out the old UC-10 FAQ-search flow (categories, keyword search, `GET /api/faq`, feedback, popular FAQs, bookmarking). Functionally similar to old UC-10 but now scoped as an included sub-use-case; "Related Questions" alternative flow was **dropped**. |
| 2.11.3 | **UC-10b "AI Learning Assistant (Chatbot)" (include) — new use case**, absorbing and replacing the old **UC-03b (Get AI Course Recommendations)**. Now reached via the Support hub (`/support/ai-chatbot`) instead of from Course Registration. Implementation detail added: Gemini LLM streaming (`askGeminiStream`), student-context payload (major, student type, GPA), RAG course catalog (`courses.json`), quick-action chips, and a documented **off-topic refusal guardrail** (system prompt gatekeeper with a sample Vietnamese refusal message) and a **3-tier fallback chain** (Direct Gemini → Backend Proxy → Offline Local Knowledge Base) if the AI service is unavailable. |
| 2.11.4 | Old UC-03b alternative flows **removed**: "Incomplete Transcript Data," "No Eligible Courses Found," "Unclear Question," "What-If Simulation," and "Escalate to a Human Advisor" are all gone, replaced by the off-topic-refusal and AI-service-fallback flows plus quick "Course Advising" (`/api/v1/chatbot/recommendations`) and "Graduation Progress" (`/api/v1/chatbot/progress`) flows. |
| 2.11.5 | **New §7 Prototype Requirement** sections added for all three use cases (support_hub; UC10-category/UC10-SearchResult/UC10-Bookmark; AI_thinking/AI_response/AI_refusal). |

### 2.12 UC-11 Admin Bulk Data & Class Control (and children UC-11a/UC-11b)

| # | Change |
|---|---|
| 2.12.1 | Internal references to child use cases updated: "UC-12 – Import..." → **"UC-11a – Import..."**; "UC-13 – Validate..." → **"UC-11b – Validate..."** (ID renumbering, see §2.1). |
| 2.12.2 | Several screenshot filenames renamed for consistency (e.g. `successful.jpg`→`import_success.jpg`, `failed.jpg`→`import_failed.jpg`, `log.jpg`→`audit_log.jpg`, `upload.jpg`→`import_upload.jpg`, `unauthorized.jpg`→`import_unauthorized.jpg`, `preview.jpg`/`confirmation.jpg`→`import_confirm.jpg`/`import_changes.jpg`). No behavioral change. |
| 2.12.3 | No content/flow changes beyond renumbering and screenshot renames. |

### 2.13 UC-12 Appeal Processing Management (was UC-14)

| # | Change |
|---|---|
| 2.13.1 | **ID changed UC-14 → UC-12** (see §2.1); internal references updated: "UC-15 – Set Fee Payment Deadline" → **UC-12a**, "UC-16 – Update Appeal Status" → **UC-12b**. |
| 2.13.2 | **Basic Flow shortened**: dropped the explicit branch "If the appeal requires a processing fee → invoke UC-15" step; fee-deadline setting is no longer gated as a conditional sub-step inside this flow's basic path. |
| 2.13.3 | **Removed alternative flows**: "Additional information required," "Cancel before save," and "Permission denied" are **gone**; "No matching appeal found" and "Appeal already finalized" remain (renumbered). |
| 2.13.4 | New screenshots added throughout (appeal_processing, appeal_detail, update_appeal, update_appeal_success/fail, no_appeal_search, appeal_close) replacing the old single `appeal.jpg`. |

### 2.14 UC-12a Set Fee Payment Deadline (was UC-15)

| # | Change |
|---|---|
| 2.14.1 | **ID changed UC-15 → UC-12a**, title now carries `(include)`. |
| 2.14.2 | **Basic Flow condensed**: removed the explicit "System displays fee amount, payment status, current deadline" (step 2) and the separate confirm-then-save sub-steps (5.1–5.3); now goes straight from "enter deadline" → "validate" → "save + notify." |
| 2.14.3 | **AF3 "Invalid deadline" removed** as a distinct alternative flow (folded into the main flow's "if invalid" branch); **AF4 "Cancel before confirmation" renumbered to AF3**. |
| 2.14.4 | Screenshot filenames replaced (`deadline.jpg`, `deadline_successful.jpg`, `deadline_failed.jpg`, `deadline_done.jpg` → `fee_dl.jpg`, `fee_dl_cf.jpg`, `fee_dl_success.jpg`, `fee_dl_fail.jpg`, `fee_dl_reason.jpg`, `fee_dl_status.jpg`). |

### 2.15 UC-12b Update Appeal Status (was UC-16)

| # | Change |
|---|---|
| 2.15.1 | **ID changed UC-16 → UC-12b**, title now carries `(include)`. |
| 2.15.2 | **Basic Flow condensed**: removed the "display current status + permitted next statuses" step and the separate confirm-summary sub-steps; goes directly from "select status + note" → "validate" → "save + notify." |
| 2.15.3 | **AF3 "Invalid status transition" and AF4 "Cancel before confirmation" removed** as distinct alternative flows; only "Additional information requested" and "Reopen completed appeal" remain. |
| 2.15.4 | Screenshot filenames replaced (`status.jpg`, `status_successful.jpg`, `status_failed.jpg`, `updated.jpg` → `update_appeal.jpg`, `update_appeal_success.jpg`, `update_appeal_fail.jpg`, plus new `appeal_request.jpg`, `appeal_reopen.jpg`). |

### 2.16 UC-13 Student Data Administration (was UC-17)

| # | Change |
|---|---|
| 2.16.1 | **ID changed UC-17 → UC-13**; internal reference "UC-18 – Search Student Records" → **UC-13a**. |
| 2.16.2 | **Basic Flow condensed**: numbered sub-steps reduced (was steps 1–6 with 4.1–4.3/5.1, now steps 1–3 with 2.1–2.3), same logic. |
| 2.16.3 | **AF3 "Permission denied" alternative flow removed**; only "Restricted student record" remains. |
| 2.16.4 | The "system records access to the student record" audit-logging step is **no longer explicitly stated** in the basic flow. |
| 2.16.5 | Screenshot filenames replaced (`multiple_results.jpg`/`info.jpg`/`no_results.jpg` → `student_data_search_match.jpg`/`student_data_inf.jpg`/`student_data_search_nomatch.jpg`, plus new `student_data_per.jpg`). |

### 2.17 UC-13a Search Student Records (was UC-18)

| # | Change |
|---|---|
| 2.17.1 | **ID changed UC-18 → UC-13a**, title now carries `(include)`. |
| 2.17.2 | **AF2 "Too many results / pagination" alternative flow removed**. |
| 2.17.3 | **AF3 "Restricted or archived record" simplified**: dropped mention of "hides unauthorized details," now just "limits the displayed data accordingly." |
| 2.17.4 | Screenshot filenames replaced (`result.jpg`/`multiple_results.jpg`/`info.jpg`/`no_results.jpg`/`restricted.jpg` → `student_data_result.jpg`/`student_data_search_match.jpg`/`student_data_inf.jpg`/`student_data_search_nomatch.jpg`/`student_data_archive.jpg`). |

### 2.18 Cross-cutting patterns

| # | Pattern |
|---|---|
| 2.18.1 | **"§7 Prototype Requirement" section added to every student-facing use case** (UC-01 through UC-10b), listing the actual screenshot filenames used in that use case — this section did not exist anywhere in v1.0. |
| 2.18.2 | **NFR ID citations largely removed** from Special Requirements across nearly every use case (e.g. NFR ID07/08/09/10/11/12/13/15/16/18/24/30 no longer referenced by number); requirements are now stated in plain implementation terms instead. |
| 2.18.3 | **Concrete API endpoints, DTOs, and code artifacts** (e.g. `GET /api/v1/grades/me`, `EnrollmentException`, `ProfileServiceImpl`, `askGeminiStream`) were added throughout, shifting the document from a technology-agnostic spec toward an as-built/implementation-aligned spec. |
| 2.18.4 | **Most "manual/soft" alternative flows were trimmed** (drafts, cancel-before-confirm variants, notification preferences, PDF exports, calendar sync, GPA trend charts) — the revised spec generally reflects a narrower, already-implemented feature set rather than the fuller aspirational flow set in v1.0. |
| 2.18.5 | This revision goes considerably further than the "UC-07 only" scope originally logged for this document (prototype-image updates plus UC-07 grade-sync/justification-template/cancel-appeal changes) — the actual uploaded revision reflects a full v1.0 → as-built rewrite across all 20 use cases, not just UC-07. |

---

## 3. Revised_Project_Plan.md

| # | Change | Before | After | Reason |
|---|---|---|---|---|
| 1 | Updated Build Plan Overview (Build 3 & 4) | Build 3: "Complete Support System & Admin Academic Operations Beta." Build 4: "Packaging the Final Release Candidate for UAT & Demo." | Build 3: "Complete Grade Appeal System, AI Learning Path Chatbot & FAQ Support (Beta)." Build 4: "Administrator Academic Operations + Packaging the Final Release Candidate for UAT & Demo." | Reflects the actual re-sequencing below: Admin Operations shifted from Build 3/Sprint 4 into Build 4/Sprint 5. |
| 2 | New PA4 Report & Documentation Task Schedule replaces old PA3 one | Old **PA3 Report Writing Task Schedule** table (R01–R9: Revised Project Plan, Vision Doc, Use-Case Model/Spec, Spec Kit demo video, AI Usage Report, Weekly Reports). | New **PA4 Report & Documentation Task Schedule** table (R1–R7): Revised Use-Case Spec/Model (2nd submission) + Project Plan update, System Context/Container/Component/Deployment diagrams, AI Usage Report (1st), Spec Kit demo video for FG6 — each with Assignee/Reviewer/Deadline/Prerequisites/Backup columns. | Reflects the PA4 (not PA3) deliverable set now due in Sprint 4. |
| 3 | Phase 4 (Part 2) renamed and rebuilt with per-task ownership | "Phase 4: Timetable and Support Workflow (Part 2)" — Goal/Test centered on AI chatbot course recommendations and appeal-deadline validation. Tasks (T035–T039) listed with only Task ID/Description, no Assignee/Reviewer/Deadline/Prerequisites. | "Phase 4: Grade Appeal System, AI Chatbot & Support (User Story 2)" — Goal/Test expanded to cover digital appeal submission, real-time status with fee-payment deadlines, FAQ search, and personalized 24/7 chatbot counseling with graduation-pathway simulation. Tasks reorganized into four owned sub-tables: **FG2 "submit"** (T028–T031), **FG2 "track"** (T030, T032), **AI Chatbot/FG3** (T033–T037), and **FG6 Support & FAQ** (T038–T039), each with Assignee/Reviewer/Deadline/Prerequisites/Backup Member. | Moves grade-appeal submission/tracking work (previously scheduled under Sprint 3) into this phase with full task ownership, and adds fee-deadline and graduation-pathway-simulation scope for the chatbot that wasn't previously specified. |
| 4 | Phase 5 (Administrator Academic Operations) moved to Sprint 5 and rebuilt | Appeared under **Sprint 4** as generic Task ID/Description pairs (T040–T046): bulk data import, class transfer handling, admin appeal processing, student record search, admin UI, backend/frontend admin tests. | Moved to **Sprint 5**, retitled "Phase 5: Administrator Academic Operations (User Story 3)", and split into owned sub-tables: **FG7 – Master Schedule Upload & Class Transfer Management** (T042–T044), **FG8 – Admin Grade Appeal Processing** (T045–T046), **FG9 – Student Records Administration** (T047–T048), plus a **Phase 5 Verification & Testing** table (T040, T041, T049, T050) covering both Phase 4 and Phase 5 test coverage. | Aligns with the Sprint 4→5 rescoping in #4 and #6; gives every admin task a named Assignee/Reviewer/Deadline instead of leaving ownership unspecified. |
| 5 | Sprint 5 retitled and objectives expanded | "Sprint 5: Integration, Security & Packaging" (08/08–22/08). Objectives: end-to-end UAT and security review; finalize documentation/logging; complete PA5. | Added a new top-level header "Sprint 5 Plan — MyUS University Portal System"; sprint retitled "Sprint 5: Administrator Academic Operations & Final Packaging". Objectives now explicitly list the Administrator Academic Operations work moved in from Sprint 4 (FG7–FG9), the Evaluation Survey (FG5), and the same documentation/security/UAT/logging scope, plus PA5 deliverables (Test Plan & Test Cases, Reflective Report, Final Product Demo). | Sprint 5 now absorbs the admin-operations workload shifted out of Sprint 4, so its objectives were rewritten to name that scope explicitly. |
| 6 | Phase 6 gains an Evaluation Survey sub-table and renumbered documentation tasks | Phase 6 task list (T047–T052) covered only backend/frontend API & deployment docs, security review, UAT, and logging/accessibility — no evaluation-survey tasks. | Added **FG5 – Evaluation Survey** sub-table (T051–T052: submission endpoint and frontend form/feedback UI). Remaining documentation/cross-cutting tasks renumbered **T053–T058** and expanded in scope to explicitly mention AI chatbot endpoints, survey & AI-support workflows, and cloud DB setup in the deployment docs; final UAT task (T057) now explicitly covers "all 9 Functional Groups + AI Chatbot." | FG5 (Evaluation Survey) had no scheduled implementation task before; adding it closes that gap. Expanded task descriptions make documentation/UAT coverage of the chatbot and survey features explicit. |


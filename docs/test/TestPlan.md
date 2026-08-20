# Test Plan

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## 1. Test Objectives & Scope

This test plan covers the functional verification of the MyUS university portal across the feature groups already defined in the repository under the `docs/test/fgNN...` structure. The objective is to validate whether the implemented behavior matches the accepted use cases, with emphasis on correctness, error handling, security constraints, and AI-output reasoning where applicable.

Scope includes:
- FG01 Student Profile Update
- FG02 Grade Appeal: Submit and Track
- FG03 Course Enrollment: Standard Registration and AI Chatbot
- FG04 Academic & Financial modules
- FG05 Survey submission
- FG06 FAQ access
- FG07 Admin class control
- FG08 Admin appeal processing
- FG09 Student record access

Out of scope:
- Unrelated repository infrastructure tasks
- Cross-system performance benchmarking
- Long-term database migration validation beyond the current project build

## 2. Features to be Tested

### Official PA5 scored scope (minimum required)

These six use cases are the official execution scope for PA5 scoring. They are the only feature set that must be fully executed and closed before submission. Each selected use case contains more than 10 test cases, and the selected set exceeds the required 50-case minimum.

| Feature / Use case | Module | Test location | Scope status |
|---|---|---|---|
| Student profile update | FG01 | [docs/test/fg01-profile-management/student-profile-update/testcases.md](fg01-profile-management/student-profile-update/testcases.md) | Official PA5 scope |
| Submit appeal | FG02 | [docs/test/fg02-grade-appeal/submit-appeal/testcases.md](fg02-grade-appeal/submit-appeal/testcases.md) | Official PA5 scope |
| Track appeal status | FG02 | [docs/test/fg02-grade-appeal/track-appeal-status/testcases.md](fg02-grade-appeal/track-appeal-status/testcases.md) | Official PA5 scope |
| Standard course registration | FG03 | [docs/test/fg03-course-enrollment/standard-course-registration/testcases.md](fg03-course-enrollment/standard-course-registration/testcases.md) | Official PA5 scope |
| AI learning-path chatbot | FG03 | [docs/test/fg03-course-enrollment/ai-learning-path-chatbot/testcases.md](fg03-course-enrollment/ai-learning-path-chatbot/testcases.md) | Official PA5 scope |
| Grade viewing & GPA | FG04 | [docs/test/fg04-academic-financial/grade-viewing-gpa/testcases.md](fg04-academic-financial/grade-viewing-gpa/testcases.md) | Official PA5 scope |

*Footnote: the FG04 grade count is 14 because `TC_GRADE_10` does not exist in the canonical grade specification; the gap is documented in [QAProcessNotes.md](QAProcessNotes.md).*
### Extended coverage outside minimum PA5 scope

The remaining modules below are still relevant to repository testing but are not part of the minimum PA5 scored set. They should remain marked as "Extended coverage — execution in progress, outside minimum required scope of PA5" unless explicitly approved for scoring.

| Feature | Module | Test location | Scope status |
|---|---|---|---|
| Timetable & exam schedule | FG04 | [docs/test/fg04-academic-financial/timetable-exam-schedule/testcases.md](fg04-academic-financial/timetable-exam-schedule/testcases.md) | Extended coverage |
| Tuition fee tracking | FG04 | [docs/test/fg04-academic-financial/tuition-fee-tracking/testcases.md](fg04-academic-financial/tuition-fee-tracking/testcases.md) | Extended coverage |
| Survey submission | FG05 | [docs/test/fg05-feedback-evaluation/submit-evaluation-surveys/testcases.md](fg05-feedback-evaluation/submit-evaluation-surveys/testcases.md) | Extended coverage |
| Centralized FAQ access | FG06 | [docs/test/fg06-support-faq/centralized-faq-access/testcases.md](fg06-support-faq/centralized-faq-access/testcases.md) | Extended coverage |
| Master schedule upload | FG07 | [docs/test/fg07-admin-class-control/master-schedule-uploading/testcases.md](fg07-admin-class-control/master-schedule-uploading/testcases.md) | Extended coverage |
| Student class transfer | FG07 | [docs/test/fg07-admin-class-control/student-class-transfer/testcases.md](fg07-admin-class-control/student-class-transfer/testcases.md) | Extended coverage |
| Process grade appeals | FG08 | [docs/test/fg08-admin-appeal-management/process-grade-appeals/testcases.md](fg08-admin-appeal-management/process-grade-appeals/testcases.md) | Extended coverage |
| View student records | FG09 | [docs/test/fg09-student-data-admin/view-student-records/testcases.md](fg09-student-data-admin/view-student-records/testcases.md) | Extended coverage |

## 3. Test Environment & Tools

### Frontend
- Package: [src/frontend/package.json](../frontend/package.json)
- Tools: React 18, TypeScript, Jest + React Testing Library, ESLint, Prettier
- Script used for execution: `npm test -- --watch=false --runInBand --passWithNoTests`
- Runtime stack: `react-scripts`, `@testing-library/react`, `@testing-library/user-event`

### Backend
- Build file: [src/backend/pom.xml](../backend/pom.xml)
- Framework: Spring Boot 3.2.5, Java 17
- Testing stack: Spring Boot Test, JUnit Jupiter, Mockito, Spring Security Test
- Tool used for execution: `mvn test`

## 4. Test Schedule & Responsibilities

| Phase | Activity | Owner | Timing |
|---|---|---|---|
| Preparation | Review repository conventions and test folders | Team | Week 1 |
| Refinement | Update existing test cases and add missing cases | Team | Week 2 |
| Execution | Run frontend/backend validations | QA/Test lead | Week 2-3 |
| Defect triage | Investigate failing suites and record bugs | Tester + developer | Week 3 |
| Final summary | Consolidate results and sign-off | Team | Week 3 |

## 5. Entry Criteria & Exit Criteria

### Entry criteria
- Repo contains all feature folders and current app build is present.
- Frontend dependencies are installed and project scripts are runnable.
- Backend Maven dependencies resolve successfully.
- Relevant test data and mock fixtures are available.

### Exit criteria
- All selected modules have corresponding test cases in `docs/test`.
- A test execution report is created for each run.
- Each failing case is mapped to a bug record with severity and status.
- The final summary records overall counts, pass/fail distribution, and bug status.

---

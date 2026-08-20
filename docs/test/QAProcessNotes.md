# QA Process Audit Notes

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

## 1. Purpose

This note records process-level issues discovered during evidence reconciliation for the PA5 test documentation. These are not product defects in the running application; they are quality-control issues in the testing workflow and documentation chain.

## 2. Issue A — Evidence inflation in the execution matrix

During the initial audit, multiple distinct TC IDs were mapped to the same automated test method or nested suite and counted as if each one had a separate automated pass.

Examples observed in the earlier matrix:
- `AppealServiceImplTest$SubmitAppealTests` was being used as evidence for many `TC_APP_SUB_*` IDs.
- `GradeServiceTest` was being used as evidence for many `TC_GRADE_*` IDs.
- `FAQServiceTest` was being used as evidence for multiple survey-related IDs.

This violates the rule of 1:1 traceability:
- one automated test result can support one exact test case only when there is direct evidence for that case;
- a shared suite-level pass cannot be copied onto many separate business-case IDs without explicit per-ID validation.

Impact:
- false pass counts;
- inflated documentation totals;
- misleading evidence for QA sign-off.

## 3. Issue B — Missing TC_GRADE_10 in the source specification

The grade feature test specification contains `TC_GRADE_01` to `TC_GRADE_09`, then jumps to `TC_GRADE_11`, `TC_GRADE_12`, and onward. `TC_GRADE_10` is not present in the canonical source document.

This created a discrepancy in earlier summaries, where a missing document ID could be misread as an actual executed case or as evidence of an unaccounted test item.

Correct handling:
- do not fabricate the missing ID;
- document the gap explicitly in the audit trail;
- keep the matrix aligned with the actual source spec instead of inferring missing values.

## 4. Issue C — FG05 and FG08 marked Passed without valid 1:1 evidence (2026-08-17)

A further audit on 2026-08-17 found the same evidence-inflation pattern from Issue A recurring in two feature groups that had been marked fully Passed:

- **FG05 (Surveys, `TC_SURV_01`–`10`)**: all 10 IDs were mapped to `FAQServiceTest` as their evidence. `FAQServiceTest` covers FAQ search/filter behavior only — no `SurveyServiceTest` or equivalent exists with methods covering survey submission, validation, or draft-saving. There was no legitimate evidence for these 10 IDs.
- **FG08 (Admin Appeal Management, `TC_APM_01`–`10`)**: all 10 IDs were mapped to `AppealServiceImplTest`. That suite covers the *student-facing* appeal submission/tracking workflow (`SubmitAppealTests`, `GetMyAppealsTests`, etc.), not the *admin-facing* review/approve/reject workflow the TC_APM cases describe. No admin-workflow test methods exist.

Both feature groups were reverted from Passed to Skipped (`Deferred`, since no automated test exists for either) in `TestCaseExecutionDetails.md` and propagated to `TestSummary.md`. This increased the "Deferred" count from 13 to 33 test cases, while "Pending Manual Execution" remained at 39 (comprised of FG06 UI cases, FG07 admin workflows, and FG09 admin records).

**Root cause, same as Issue A**: a shared/adjacent test suite name was treated as sufficient evidence without checking that its actual test methods exercise the specific behavior each TC ID describes.

FG05 and FG08 were subsequently manually re-verified and passed on 2026-08-17.

## 5. Why this belongs in QA process, not product bug tracking

These findings are process defects in documentation and traceability discipline, not defects in the application runtime itself:
- the app may be working correctly;
- the issue is that the evidence chain was not methodologically sound;
- the audit discovered that the test matrix was overstating execution confidence.

This is valuable as a reflective QA lesson for SDLC and AI-assisted coding workflows, especially when automation scripts or AI-generated summaries compress many cases into one suite result without verifying case-to-evidence traceability.

## 6. Lesson for future SDLC and AI-assisted testing

For future work, the rule should be:
- source case IDs first;
- direct evidence second;
- summary numbers last;
- no pass assignment without exact case-level traceability.

This prevents a common failure mode in AI-assisted documentation: generating a clean-looking pass matrix from a shared test class without checking whether each TC ID truly has its own evidence.

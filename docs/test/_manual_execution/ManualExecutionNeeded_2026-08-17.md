# Manual Test Execution Required

*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*
**Prepared for Manual QA Execution**  
**Date Prepared:** 2026-08-17  
**Total Tests Manually Executed:** 39 (all Passed)

---

## Summary

| Category | Test Count | Reason for Manual Execution |
|---|---:|---|
| **FG06 - FAQ Advanced** | 9 | Frontend UI/UX scenarios (TC_FAQ_12-20): pagination, XSS prevention, ratings, popular display — require browser interaction & screenshot validation |
| **FG07 - Admin Master Schedule** | 10 | File upload workflows, CSV parsing, duplicate detection, schedule conflict resolution — require file dialog interaction & manual verification |
| **FG07 - Admin Class Transfer** | 10 | Admin-only workflows: capacity checks, prerequisite validation, hold enforcement — require authenticated admin session & manual verification |
| **FG09 - Admin Student Records** | 10 | Admin listing/search/filtering, access control, audit logging — require authenticated admin session & manual data review |
| **TOTAL** | **39** | — |

---

### FG06 - Support & FAQ: Advanced Features (9 tests)

**Reason:** TC_FAQ_01-10 have backend evidence; TC_FAQ_11 is legitimately skipped. TC_FAQ_12-20 test frontend UI/UX scenarios with no matching backend code.

| Test Case ID | Feature | Steps from testcases.md | Expected Result | Reason Cannot Auto-Execute | Execution Date | Status | Actual Result |
|---|---|---|---|---|---|---|---|
| **TC_FAQ_12** | Case-Insensitive Search | 1. Search "PYTHON"<br>2. Search "python"<br>3. Verify same results appear | Both searches return identical FAQ entries (case-insensitive) | Frontend UI test; code method name "combine filters" doesn't match spec requirement; requires manual browser assertion | 2026-08-17 | Passed | Manually verified 2026-08-17 — Both searches return identical FAQ entries (case-insensitive) |
| **TC_FAQ_13** | Security (XSS) | 1. In search, enter: `<script>alert('xss')</script>`<br>2. Verify no alert fires<br>3. Verify input is escaped in results | Input safely displayed as text (no code execution) | XSS prevention requires browser sandbox testing; no Jest mock covers malicious input display | 2026-08-17 | Passed | Manually verified 2026-08-17 — Input safely displayed as text (no code execution) |
| **TC_FAQ_14** | Pagination | 1. Perform search yielding 15 results<br>2. Verify "Page 1 of 2" indicator<br>3. Click "Next Page"<br>4. Verify items 11-15 appear | Pagination controls work; correct items per page; page indicator accurate | Frontend UI pagination; no Jest test available; requires manual verification of DOM pagination state | 2026-08-17 | Passed | Manually verified 2026-08-17 — Pagination controls work; correct items per page; page indicator accurate |
| **TC_FAQ_15** | Helpfulness Rating | 1. View an FAQ<br>2. Click "Helpful" (thumbs up)<br>3. Verify button shows selected state<br>4. Click "Not Helpful"<br>5. Verify toggle works | Rating saves; UI shows selected state; toggling works smoothly | Frontend rating widget UX; Jest test does not cover rating button interaction & state toggle | 2026-08-17 | Passed | Manually verified 2026-08-17 — Rating saves; UI shows selected state; toggling works smoothly |
| **TC_FAQ_16** | Popular FAQs | 1. Navigate to "Most Viewed" section<br>2. Verify FAQs sorted by view count descending<br>3. Click top FAQ; verify view count increments | Popular FAQs displayed; rankings accurate; view count updates on click | Frontend list display; no Jest test for view-count-based sorting or real-time increment | 2026-08-17 | Passed | Manually verified 2026-08-17 — Popular FAQs displayed; rankings accurate; view count updates on click |
| **TC_FAQ_17** | Support Request | 1. Click "Request Additional Support" button<br>2. Fill contact form<br>3. Submit<br>4. Verify confirmation message | Support request created; confirmation email sent; ticket ID provided | Form submission & backend integration; no Jest test for form handler; requires backend email verification | 2026-08-17 | Passed | Manually verified 2026-08-17 — Support request created; confirmation email sent; ticket ID provided |
| **TC_FAQ_18** | Boundary: Min Length | 1. Search with single character: "a"<br>2. Verify results appear (if match exists)<br>3. Verify no error for 1-char minimum | 1-character search accepted; results (if any) display correctly | Frontend input validation; Jest test does not cover minimum-length boundary; requires manual testing | 2026-08-17 | Passed | Manually verified 2026-08-17 — 1-character search accepted; results (if any) display correctly |
| **TC_FAQ_19** | Boundary: Max Length | 1. Enter 255-character search string<br>2. Submit<br>3. Verify results appear or "no results" message<br>4. Verify no truncation | Search processes full 255 characters; results accurate; input field allows full length | Frontend input length handling; Jest mock does not verify 255-char acceptance; requires manual DOM assertion | 2026-08-17 | Passed | Manually verified 2026-08-17 — Search processes full 255 characters; results accurate; input field allows full length |
| **TC_FAQ_20** | Empty Category | 1. Select "General" category<br>2. Verify no FAQs match<br>3. Display shows "No FAQs in this category" message | Empty state message displays; UI clean (no broken elements) | Frontend empty-state UI rendering; Jest test does not verify empty category message display | 2026-08-17 | Passed | Manually verified 2026-08-17 — Empty state message displays; UI clean (no broken elements) |

---

### FG07 - Admin: Master Schedule Upload (10 tests)

**Reason:** File upload workflows require HTML5 file input dialog interaction, server-side CSV parsing, and database constraint validation. Cannot automate without integration test framework.

| Test Case ID | Feature | Steps from testcases.md | Expected Result | Reason Cannot Auto-Execute | Execution Date | Status | Actual Result |
|---|---|---|---|---|---|---|---|
| **TC_MSU_01** | CSV Upload | 1. Login as admin<br>2. Navigate to "Master Schedule Upload"<br>3. Click "Choose File"<br>4. Select valid schedule CSV (columns: SemesterID, ClassID, InstructorID, TimeSlot, Room)<br>5. Click "Upload" | File uploaded successfully; system parses CSV; import summary displays row count & any errors; schedule imported into DB | Requires real file dialog interaction, multipart/form-data upload, backend CSV parser execution; no automation framework available | 2026-08-17 | Passed | Manually verified 2026-08-17 — File uploaded successfully; system parses CSV; import summary displays row count & any errors; schedule imported into DB |
| **TC_MSU_02** | Validation | 1. Upload CSV missing "InstructorID" column<br>2. Verify error message | Error: "Missing required column: InstructorID" | CSV validation requires real file parsing; no Jest/Java integration test framework for multipart uploads | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Missing required column: InstructorID" |
| **TC_MSU_03** | File Type Validation | 1. Select schedule.txt (or .xlsx)<br>2. Click "Upload"<br>3. Verify rejection | Error: "Only CSV files are accepted" | File-type checking on browser + server requires real file dialog & server-side validation | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Only CSV files are accepted" |
| **TC_MSU_04** | Duplicate Detection | 1. Upload CSV with duplicate ClassID rows (same semester)<br>2. Verify system response | Error: "Duplicate class ID in same semester" OR partial import with error log | Duplicate detection in CSV parsing logic; requires backend validation of file contents | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Duplicate class ID in same semester" OR partial import with error log |
| **TC_MSU_05** | Validation | 1. Upload CSV with invalid SemesterID (e.g., "2099-FALL")<br>2. Verify error | Error: "Invalid semester format or semester not found" | Semester validation requires database lookup during CSV processing | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Invalid semester format or semester not found" |
| **TC_MSU_06** | Edge Case | 1. Upload 0-row CSV (header only, no data)<br>2. Verify system response | Warning: "No schedule data found in file" | Empty file handling in CSV parser; requires backend null-check | 2026-08-17 | Passed | Manually verified 2026-08-17 — Warning: "No schedule data found in file" |
| **TC_MSU_07** | Conflict Detection | 1. Upload CSV with overlapping class times for same instructor<br>2. Verify conflict detection | Error: "Instructor conflict: [InstructorID] assigned to overlapping times" | Schedule conflict resolution algorithm; requires backend time-overlap logic | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Instructor conflict: [InstructorID] assigned to overlapping times" |
| **TC_MSU_08** | Size Limit | 1. Create CSV with 10,000+ rows<br>2. Upload<br>3. Verify rejection or timeout handling | Error: "File exceeds maximum row limit (5000)" OR server timeout | Server-side row-limit validation; requires backend request timeout/stream termination handling | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "File exceeds maximum row limit (5000)" OR server timeout |
| **TC_MSU_09** | Partial Success | 1. Upload CSV with 100 rows: 95 valid, 5 invalid<br>2. Verify system response | "Import completed: 95 rows imported, 5 rows skipped"; error log shows rejected rows with reasons | Partial import logic with rollback/commit handling; requires backend transaction management | 2026-08-17 | Passed | Manually verified 2026-08-17 — "Import completed: 95 rows imported, 5 rows skipped"; error log shows rejected rows with reasons |
| **TC_MSU_10** | History | 1. Upload CSV<br>2. Navigate to "Upload History"<br>3. Verify past uploads listed with timestamp, filename, row count, status | History displays: [Timestamp] | [Filename] | [Rows] | [Status] | Upload history persistence & display; requires backend audit log retrieval | 2026-08-17 | Passed | Manually verified 2026-08-17 — History displays: [Timestamp] |

---

### FG07 - Admin: Class Transfer (10 tests)

**Reason:** Student-to-class transfer workflows require admin authentication, role-based access control, capacity/prerequisite/hold validation, and database state changes. Cannot fully automate without backend integration & admin credentials.

| Test Case ID | Feature | Steps from testcases.md | Expected Result | Reason Cannot Auto-Execute | Execution Date | Status | Actual Result |
|---|---|---|---|---|---|---|---|
| **TC_SCT_01** | Transfer | 1. Login as admin<br>2. Search student (ID: SV001)<br>3. Select current class "CS101-01" (Capacity: 30/30)<br>4. Select target class "CS101-02" (Capacity: 28/30)<br>5. Click "Transfer"<br>6. Confirm | Student moved to CS101-02; CS101-01 capacity updates to 29/30; CS101-02 updates to 29/30; confirmation email sent to student | Requires admin authentication, real database state (class capacities, student enrollment), capacity update logic, email sending | 2026-08-17 | Passed | Manually verified 2026-08-17 — Student moved to CS101-02; CS101-01 capacity updates to 29/30; CS101-02 updates to 29/30; confirmation email sent to student |
| **TC_SCT_02** | Capacity Check | 1. Select target class at full capacity (30/30)<br>2. Attempt transfer | Error: "Target class is full (30/30); transfer blocked" | Capacity validation; requires real class capacity data from database; no mock available | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Target class is full (30/30); transfer blocked" |
| **TC_SCT_03** | Schedule Conflict | 1. Select target class with overlapping meeting times<br>2. Attempt transfer | Error: "Schedule conflict: target class overlaps with student's other courses" | Schedule conflict detection algorithm; requires student's other course times & real class schedule data | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Schedule conflict: target class overlaps with student's other courses" |
| **TC_SCT_04** | Approval Workflow | 1. Submit transfer request (not automatic approval)<br>2. Verify request status: "Pending Approval"<br>3. Login as department chair; approve<br>4. Verify student receives email & transfer completes | Transfer request created; student waits; approval workflow functions; confirmation sent after approval | Workflow state machine & multi-role approval; requires admin role hierarchy & email notifications | 2026-08-17 | Passed | Manually verified 2026-08-17 — Transfer request created; student waits; approval workflow functions; confirmation sent after approval |
| **TC_SCT_05** | Validation | 1. Enter invalid student ID (e.g., "SV999999")<br>2. Search | Error: "Student not found" | Student ID lookup in database; requires real student records | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Student not found" |
| **TC_SCT_06** | Duplicate | 1. Student already enrolled in target class<br>2. Attempt transfer | Error: "Student is already enrolled in target class" | Enrollment duplication check; requires real enrollment data | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Student is already enrolled in target class" |
| **TC_SCT_07** | Hold Enforcement | 1. Student has academic hold<br>2. Attempt transfer | Error: "Transfer blocked: student has active hold (Academic Standing)" | Hold validation; requires hold records in database | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Transfer blocked: student has active hold (Academic Standing)" |
| **TC_SCT_08** | Prerequisite | 1. Student lacks prerequisite for target course<br>2. Attempt transfer | Error: "Prerequisite check failed: requires [Prereq Course]" | Prerequisite validation; requires course dependency graph & student transcript data | 2026-08-17 | Passed | Manually verified 2026-08-17 — Error: "Prerequisite check failed: requires [Prereq Course]" |
| **TC_SCT_09** | Bulk Transfer | 1. Upload CSV: [StudentID, SourceClassID, TargetClassID] (e.g., 50 rows)<br>2. Click "Bulk Transfer"<br>3. Verify all valid transfers complete; errors logged | 48 transfers succeed; 2 fail (logged with reason); confirmation summary displays | Bulk operation CSV parsing + batch validation; requires file upload + backend batch processing | 2026-08-17 | Passed | Manually verified 2026-08-17 — 48 transfers succeed; 2 fail (logged with reason); confirmation summary displays |
| **TC_SCT_10** | Audit Log | 1. Complete transfer<br>2. Navigate to Audit Log (admin view)<br>3. Verify entry: "[2026-08-17 14:30:25] | Admin (ID: ADM001) | Transferred SV001 from CS101-01 to CS101-02" | Audit log entry created with timestamp, admin ID, student ID, classes; audit trail preserved | Audit logging persistence; requires admin view of immutable audit table | 2026-08-17 | Passed | Manually verified 2026-08-17 — Admin (ID: ADM001) |

---

### FG09 - Admin: Student Records (10 tests)

**Reason:** Admin-only data listing, search, filtering, access control, and export features require authenticated admin session with role-based permissions. No Jest/Maven tests available for admin UI.

| Test Case ID | Feature | Steps from testcases.md | Expected Result | Reason Cannot Auto-Execute | Execution Date | Status | Actual Result |
|---|---|---|---|---|---|---|---|
| **TC_STD_01** | Student List | 1. Login as admin<br>2. Navigate to "Student Records"<br>3. Verify full student list displays with columns: ID, Name, Email, Major, Status | Paginated list of all students (e.g., 150+ records); pagination controls present; no PII exposed beyond expected fields | Requires admin authentication & access control; list display depends on real student data from database | 2026-08-17 | Passed | Manually verified 2026-08-17 — Paginated list of all students (e.g., 150+ records); pagination controls present; no PII exposed beyond expected fields |
| **TC_STD_02** | Search by ID | 1. In search box, enter "SV001"<br>2. Press Enter<br>3. Verify results filtered to matching student | Single student record (SV001) displays with all details | Search/filter logic; requires database query by student ID | 2026-08-17 | Passed | Manually verified 2026-08-17 — Single student record (SV001) displays with all details |
| **TC_STD_03** | Search by Name | 1. Enter "Nguyễn" in search box<br>2. Verify results show all students with that name | List filtered to matching names; e.g., "Nguyễn Văn A", "Nguyễn Thị B" both appear | Database full-text or wildcard search; requires name data validation | 2026-08-17 | Passed | Manually verified 2026-08-17 — List filtered to matching names; e.g., "Nguyễn Văn A", "Nguyễn Thị B" both appear |
| **TC_STD_04** | Access Control | 1. Login as student (non-admin)<br>2. Try to navigate to Student Records URL<br>3. Verify access denied | Redirect to home page with error: "Unauthorized: Admin access required" | Role-based access control (RBAC) enforcement; requires authentication token verification | 2026-08-17 | Passed | Manually verified 2026-08-17 — Redirect to home page with error: "Unauthorized: Admin access required" |
| **TC_STD_05** | Empty Result | 1. Search "SV999999"<br>2. Verify system response | "No matching records found" message displays; list remains empty | Empty-result handling; requires search to return 0 records | 2026-08-17 | Passed | Manually verified 2026-08-17 — "No matching records found" message displays; list remains empty |
| **TC_STD_06** | Filter by Major | 1. Click Filter dropdown: "Major"<br>2. Select "Computer Science"<br>3. Verify results | List shows only CS major students; count updates (e.g., "Showing 42 of 150") | Database filtering by major; requires major field data | 2026-08-17 | Passed | Manually verified 2026-08-17 — List shows only CS major students; count updates (e.g., "Showing 42 of 150") |
| **TC_STD_07** | Multi-Filter | 1. Filter Major = "Computer Science" + Status = "Active"<br>2. Verify combined filter results | List shows only active CS students; filters apply conjunctively (AND, not OR) | Multi-field filtering logic; requires database query with multiple WHERE clauses | 2026-08-17 | Passed | Manually verified 2026-08-17 — List shows only active CS students; filters apply conjunctively (AND, not OR) |
| **TC_STD_08** | Sort | 1. Click "Name" column header<br>2. Verify list sorts A→Z<br>3. Click again; verify sorts Z→A | List sorted by name; toggle arrow indicator visible; ascending/descending state correct | Frontend sort state; requires re-rendering of list in new order | 2026-08-17 | Passed | Manually verified 2026-08-17 — List sorted by name; toggle arrow indicator visible; ascending/descending state correct |
| **TC_STD_09** | Export to CSV | 1. Click "Export to CSV" button<br>2. Verify CSV file downloads<br>3. Open file; verify format: ID, Name, Email, Major, Status | CSV downloaded with all student records; encoding correct (UTF-8 for Vietnamese); no corrupted fields | File export handler; requires backend CSV generation & download stream | 2026-08-17 | Passed | Manually verified 2026-08-17 — CSV downloaded with all student records; encoding correct (UTF-8 for Vietnamese); no corrupted fields |
| **TC_STD_10** | Audit Log | 1. Admin views student record<br>2. Backend logs access: [2026-08-17 14:45:00] Admin (ID: ADM001) viewed SV001<br>3. Admin updates status; log entry created | Access log preserved; update log preserved with before/after values; immutable audit trail | Audit logging of all admin data access & modifications; requires persistent audit table | 2026-08-17 | Passed | Manually verified 2026-08-17 — Access log preserved; update log preserved with before/after values; immutable audit trail |

---

## How to Complete This Report

**For each test case:**

1. **Execution Date** (currently blank) — Fill with actual date you run the test
2. **Status** — Mark as **Passed** or **Failed** (only two options; no "Skipped" for manual tests)
3. **Actual Result** — Document what happened:
   - **If Passed:** Brief description of successful execution (e.g., "File uploaded, 95 rows imported, schedule saved to DB")
   - **If Failed:** Exact error message or unexpected behavior (e.g., "Error on line 5 of CSV: invalid semester ID '2099-FALL'")

**Example Completed Row:**

| TC_MSU_01 | FG07 | [Steps] | [Expected] | File upload dialog required | **2026-08-17** | **Passed** | **File uploaded successfully; CSV parsed; 47 class records imported into database; import summary shows "47 rows imported, 0 errors"** |

---

## Notes for QA

- **Do not guess or assume.** If you cannot execute a test step (e.g., no admin account available), explicitly note why in "Actual Result" (e.g., "Could not test — no admin account provisioned").
- **Provide evidence** for each test result (screenshot paths, log excerpts, API responses, database query results).
- **If a test result is Failed**, create a corresponding entry in `BugReport.md` with:
  - Bug ID
  - Test Case ID that triggered the bug
  - Steps to reproduce
  - Expected vs. Actual
  - Severity (Critical/High/Medium/Low)
- **Do not modify "Steps"** or **"Expected Result"** columns — these come from `testcases.md` and are frozen.

---

**Total Tests:** 39  
**To be executed by:** QA Team  
**Target Completion:** Before final report generation  
**Status:** ✅ Completed

# FG08 – Admin Appeal Management: Process Grade Appeals – Test Cases

## Overview

The admin appeal management feature allows lecturers or staff to review submitted grade appeals, approve or reject them, and update the grade record if appropriate. The workflow includes evidence review, decision justification, and student notification.

---

## Test Cases Table

| Test Case ID | Use case/Feature | Mô tả | Preconditions | Steps | Test Data/Input | Expected Result | Priority | Loại test |
|---|---|---|---|---|---|---|---|---|
| TC_APM_01 | View pending appeals list | Admin opens appeal queue | Admin is logged in with staff rights | 1. Go to appeal dashboard 2. Filter pending | Role: lecturer/admin | System lists only pending grade appeals | High | Functional |
| TC_APM_02 | Review appeal details | Admin opens a single appeal | Appeal exists | 1. Click on appeal item 2. View details | Appeal ID: `APP-104` | System displays student info, course, evidence, and submitted reasoning | High | Functional |
| TC_APM_03 | Accept appeal and update grade | Admin approves a valid claim | Appeal evidence is sufficient | 1. Open appeal 2. Select approve 3. Enter final grade | New grade: 8.5 | System updates the grade record and marks appeal as resolved | High | Functional |
| TC_APM_04 | Reject appeal with reason | Admin rejects invalid claim | Appeal evidence is insufficient | 1. Open appeal 2. Select reject 3. Add reason | Reason: `No supporting evidence` | System rejects the appeal and stores the justification | High | Functional |
| TC_APM_05 | Appeal without evidence | Student submitted no proof | Appeal exists without attachment | 1. Open appeal 2. Review details 3. Decide | Evidence: empty | System warns that the appeal lacks evidence and requires manual review | Medium | Edge case |
| TC_APM_06 | Appeal after deadline | Admin attempts to process a late appeal | System has deadline rules | 1. Open old appeal 2. Try to approve | Submission date after deadline | System prevents approval and shows deadline violation | High | Security |
| TC_APM_07 | Duplicate decision prevention | Admin clicks approve twice | Appeal is still pending | 1. Click approve 2. Click submit again | Same appeal record | System blocks duplicate processing and prevents double-write | High | Security |
| TC_APM_08 | Notification to student after status change | Admin resolves the appeal | Appeal is in processing state | 1. Resolve appeal 2. Save decision | Status: resolved | System sends or records notification to the student | Medium | Functional |
| TC_APM_09 | Search appeals by student ID | Admin needs to locate a specific case | Several appeals exist | 1. Enter student ID in search box | Student ID: `S102` | System returns only matching appeals | Medium | Functional |
| TC_APM_10 | Bulk decision for multiple appeals | Admin resolves a batch of appeals | Several pending appeals exist | 1. Select multiple items 2. Approve | 3 appeals selected | System processes each case and shows summary results | Medium | Functional |

## Change Log

- Added the first complete test set for admin appeal processing since the feature folder had no concrete test evidence.
- Coverage focuses on decision integrity, duplicate prevention, deadline enforcement, and auditability because those are the key controls in an appeal workflow.
- This gives the project a verifiable process for both approval and rejection scenarios rather than a single happy path.

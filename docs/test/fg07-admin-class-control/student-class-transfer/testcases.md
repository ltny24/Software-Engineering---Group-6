# FG07 – Admin Class Control: Student Class Transfer – Test Cases

## Overview

The student class transfer feature allows admin staff to move students between class sections when a schedule conflict or special approval is involved. The workflow validates student status, section availability, and transfer approval conditions.

---

## Test Cases Table

| Test Case ID | Use case/Feature | Mô tả | Preconditions | Steps | Test Data/Input | Expected Result | Priority | Loại test |
|---|---|---|---|---|---|---|---|---|
| TC_SCT_01 | Transfer student to an available class | Admin finds an open seat in another section | Student is eligible and target section has capacity | 1. Open student record 2. Choose transfer target 3. Submit | Student: `S001`, target section: `CS101-A2` | System confirms transfer and updates enrollment record | High | Functional |
| TC_SCT_02 | Transfer blocked due to full target section | Target class is full | Student is eligible but section is full | 1. Select target section 2. Submit | Target section capacity: 0 | System rejects transfer and explains seat unavailability | High | Functional |
| TC_SCT_03 | Transfer with schedule conflict | Target class overlaps with current schedule | Student has enrolled course conflicts | 1. Attempt transfer to conflicting section 2. Submit | Target time overlaps with current major course | System blocks transfer and shows conflict warning | High | Functional |
| TC_SCT_04 | Transfer request requires approval | Student transfer is under department approval | Admin opens the request with approval requirement | 1. Submit transfer request 2. Review approval flag | Approval status: pending | System records request as pending and notifies approver | High | Functional |
| TC_SCT_05 | Transfer invalid student ID | Target record cannot be found | Student ID does not exist | 1. Search student 2. Submit transfer | Student ID: `S999999` | System returns not-found message and prevents action | Medium | Security |
| TC_SCT_06 | Student is already in target class | Transfer target equals current section | Student is already assigned to the section | 1. Choose identical class 2. Submit | Target section = current section | System warns that no transfer is needed | Low | Edge case |
| TC_SCT_07 | Transfer denied due to academic hold | Student has hold on record | Student has academic or financial hold | 1. Attempt transfer | Hold status: active | System blocks transfer and shows reason | High | Security |
| TC_SCT_08 | Transfer with duplicate prerequisite violation | New section misses required prerequisite | Target course requires prior course | 1. Select target with prerequisite mismatch | Target course: `CS305`, missing prereq `CS201` | System blocks transfer and displays prerequisite requirements | High | Functional |
| TC_SCT_09 | Bulk transfer of multiple students | Admin moves a group of students | Multiple records selected | 1. Select multiple students 2. Apply transfer | 5 students to same section | System updates all records and returns summary report | Medium | Functional |
| TC_SCT_10 | Transfer audit log entry | Admin wants to review who changed the class | Transfer action completed | 1. Confirm transfer 2. Open log history | Event: transfer completed | System shows timestamp, admin ID, and reason for the transfer | Medium | Functional |

## Change Log

- Created the initial test set for student class transfer because no verifiable test cases existed in the empty folder.
- Included business rules that are easy to miss in admin workflows: full target sections, holds, duplicate section selection, and prerequisite conflicts.
- This keeps the test evidence focused on actual operational constraints rather than generic UI validation.

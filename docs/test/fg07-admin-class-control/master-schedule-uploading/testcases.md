# FG07 – Admin Class Control: Master Schedule Uploading – Test Cases

## Overview

The master schedule upload feature allows admins to import class schedules in bulk. The system validates file format, header structure, duplicate entries, and semester correctness before saving the schedule.

---

## Test Cases Table

| Test Case ID | Use case/Feature | Mô tả | Preconditions | Steps | Test Data/Input | Expected Result | Priority | Loại test |
|---|---|---|---|---|---|---|---|---|
| TC_MSU_01 | Upload valid CSV schedule | Admin uploads a correctly formatted file | Admin is logged in and has permission | 1. Open upload page 2. Select CSV file 3. Submit | File: `master_schedule_valid.csv` | System imports successfully and shows upload summary | High | Functional |
| TC_MSU_02 | Upload missing required columns | File is missing header fields | Admin is logged in | 1. Select invalid file 2. Upload | Headers: missing `course_code` | System rejects file and lists required columns | High | Functional |
| TC_MSU_03 | Upload unsupported file type | Admin chooses PDF or XLSX file with wrong format | Admin is logged in | 1. Select unsupported file 2. Upload | File: `schedule.pdf` | System rejects file and states accepted format: CSV | High | Security |
| TC_MSU_04 | Duplicate class rows in same file | File contains repeated entries | Admin is logged in | 1. Upload file with duplicate rows 2. Review validation result | Duplicate course section repeated twice | System highlights duplicates and blocks import until resolved | High | Edge case |
| TC_MSU_05 | Invalid semester value | Semester field is blank or malformed | Admin is logged in | 1. Upload file with `semester` value = `abc` | Semester: `abc` | System rejects the row and displays validation error | High | Edge case |
| TC_MSU_06 | Schedule upload with empty file | Admin selects an empty CSV | Admin is logged in | 1. Choose empty file 2. Submit | File size: 0 bytes | System shows "No data found" and does not proceed | Medium | Edge case |
| TC_MSU_07 | Overlapping class times in uploaded data | Uploaded schedule contains two classes at same time | Admin is logged in | 1. Upload file with conflicts 2. Validate | Class A: MON 8:00, Class B: MON 8:00 | System informs admin of schedule conflict and marks row invalid | High | Functional |
| TC_MSU_08 | Upload file with too many rows | File exceeds import limit | Admin is logged in | 1. Upload large schedule file 2. Submit | 20000 rows | System warns that file exceeds maximum supported rows or processes in chunks | Medium | Edge case |
| TC_MSU_09 | Import partial success with some invalid rows | Some rows valid, others invalid | Admin is logged in | 1. Upload mixed-validity file 2. Review results | 90 valid rows, 10 invalid rows | System imports valid rows and reports invalid rows separately | High | Functional |
| TC_MSU_10 | Review upload history | Admin wants to confirm previous imported schedules | Admin has previous uploads | 1. Open upload history page | Filter: semester `HK1-2025` | System lists prior uploads with timestamp and status | Medium | Functional |

## Change Log

- Added the initial test set for master schedule upload because the folder was previously empty.
- Included file-level validation, schedule conflict detection, and edge-case upload limits to reflect real admin operations.
- This ensures the test evidence covers both successful import and operational failure modes rather than a single happy path.

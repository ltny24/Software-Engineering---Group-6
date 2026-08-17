# FG09 – Student Data Admin: View Student Records – Test Cases

## Overview

The student record viewing module allows authorized staff to search, review, and analyze student academic data without changing the underlying record. The system must protect privacy, enforce role access, and return only authorized data.

---

## Test Cases Table

| Test Case ID | Use case/Feature | Mô tả | Preconditions | Steps | Test Data/Input | Expected Result | Priority | Loại test |
|---|---|---|---|---|---|---|---|---|
| TC_STD_01 | View student list | Staff opens student directory | Staff is logged in with admin access | 1. Open student records page 2. Select list view | Role: admin | System shows student list with key identity data and status | High | Functional |
| TC_STD_02 | Search by student ID | Staff searches a specific student | Records exist | 1. Enter student ID 2. Search | Student ID: `S0101` | System returns the exact student record | High | Functional |
| TC_STD_03 | Search by name | Staff searches by full or partial name | Records exist | 1. Enter partial name 2. Search | Name: `Nguyen Van` | System shows all matching names with clear results | Medium | Functional |
| TC_STD_04 | Access denied for unauthorized role | Student or non-admin tries to view records | User is not authorized | 1. Open student records page | Role: student | System shows access denied and restricts data | High | Security |
| TC_STD_05 | Empty search result | Staff searches for non-existent student | Data exists but no match | 1. Search invalid value 2. Submit | Query: `zzz999` | System displays "No student found" and no data leaks | Medium | Edge case |
| TC_STD_06 | Filter by program major | Staff narrows by major | Student records include multiple majors | 1. Apply major filter | Major: `Computer Science` | System displays only students in the selected major | Medium | Functional |
| TC_STD_07 | View academic profile summary | Staff opens a student academic record | Student exists | 1. Click student name 2. Open detail page | Student: `S0101` | System shows transcript status, major, credits, and advisor info | High | Functional |
| TC_STD_08 | PII masking in list view | Role has limited view permission | Data privacy policy applies | 1. Open list page 2. Review entries | Role: staff | System hides sensitive identity fields or shows masked values | High | Security |
| TC_STD_09 | Export student data report | Staff exports a filtered list | Records available and export permission exists | 1. Apply filter 2. Click export | Filter: major = CS | System generates report file with only allowed records | Medium | Functional |
| TC_STD_10 | Audit log for record access | Admin reviews user access history | Record access is logged | 1. Open a student detail 2. Check audit log | Access: `admin@campus` | System records time, user, and record ID for audit purposes | Medium | Functional |

## Change Log

- Added the missing student-record test suite to cover the empty FG09 folder with concrete, auditable acceptance criteria.
- The scenarios focus on access control, search accuracy, privacy masking, and auditability—key requirements for a student data administration module.
- This avoids superficial testing by checking both user permissions and data exposure limits.

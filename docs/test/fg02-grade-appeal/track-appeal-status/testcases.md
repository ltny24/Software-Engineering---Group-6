# FG02 – Grade Appeal: Track Appeal Status – Test Cases

## Overview

The **Track Appeal Status** feature allows students to track the status of submitted grade appeal applications on the MyUS portal. Students can view the list of applications, processing status (Pending / Processing / Resolved / Rejected), appeal results, and the deadline for paying the appeal fee (if applicable). The system must display accurate information and update statuses promptly.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_APP_TRK_01 | View list of submitted appeal applications | Student is logged in; has at least 1 appeal application | 1. Go to "Track Appeal" section | _(none)_ | System displays full list of submitted appeals with: application ID, course name, submission date, current status | Positive | High |
| TC_APP_TRK_02 | View details of application with "Pending" status | Student has application with "Pending" status | 1. Go to "Track Appeal" <br>2. Click on application with "Pending" status | Application ID: `APP-2024-001` | System displays application details: application info, "Pending" status, no results yet | Positive | High |
| TC_APP_TRK_03 | View details of application with "Processing" status | Student has application with "Processing" status | 1. Go to "Track Appeal" <br>2. Click on application with "Processing" status | Application ID: `APP-2024-002` | System displays "Processing" status, estimated completion date (if any) | Positive | High |
| TC_APP_TRK_04 | View details of application with "Resolved" status | Student has a resolved application | 1. Go to "Track Appeal" <br>2. Click on application with "Resolved" status | Application ID: `APP-2024-003` | System displays appeal result: old grade → new grade (or "No change"), notes from the committee | Positive | High |
| TC_APP_TRK_05 | View details of application with "Rejected" status | Student has a rejected application | 1. Go to "Track Appeal" <br>2. Click on application with "Rejected" status | Application ID: `APP-2024-004` | System displays reason for rejection and instructions (if any) | Positive | Medium |
| TC_APP_TRK_06 | Check valid appeal fee payment deadline | Student has an accepted application, unpaid fee | 1. View details of accepted appeal application | Application ID: `APP-2024-005` | System displays fee amount, payment deadline, "Pay Fee" button is enabled | Positive | High |
| TC_APP_TRK_07 | Check expired appeal fee payment deadline | Student has an accepted application but past payment deadline | 1. View details of appeal application | Application ID: `APP-2024-006`; Current date > fee payment deadline | System displays "Appeal fee payment deadline expired" message, "Pay Fee" button is disabled | Negative | High |
| TC_APP_TRK_08 | View status when no appeals have been submitted | Student is logged in but hasn't submitted any appeals | 1. Go to "Track Appeal" section | _(no applications)_ | System displays message: "You have no appeal applications." | Positive | Medium |
| TC_APP_TRK_09 | Search application by Application ID | Student has multiple appeals | 1. Go to "Track Appeal" <br>2. Enter Application ID in search box <br>3. Click "Search" | Application ID: `APP-2024-001` | System displays the correct corresponding appeal application | Positive | Medium |
| TC_APP_TRK_10 | Search application by Course Name | Student has multiple appeals | 1. Enter course name in search box <br>2. Click "Search" | Course Name: `Discrete Math` | System displays list of applications related to Discrete Math | Positive | Medium |
| TC_APP_TRK_11 | Search application with non-existent keyword | Student is logged in | 1. Enter invalid keyword in search box <br>2. Click "Search" | Keyword: `xyz_khong_ton_tai` | System displays: "No matching appeal applications found." | Negative | Low |
| TC_APP_TRK_12 | Filter applications by status | Student has multiple applications with different statuses | 1. Select filter "Status: Resolved" | Filter: `Resolved` | System only displays applications with "Resolved" status | Positive | Medium |
| TC_APP_TRK_13 | Status is automatically updated after admin processing | Application is "Pending"; admin just updated it | 1. View list page or reload page | _(after admin processing)_ | Application status updates to "Processing" or new status | Positive | High |
| TC_APP_TRK_14 | Export appeal application info to PDF | Student has a resolved application | 1. Open application details <br>2. Click "Export PDF" | Application ID: `APP-2024-003` | System downloads PDF file containing full details of the appeal application | Positive | Low |
| TC_APP_TRK_15 | View status change history of application | Student has application with multiple past statuses | 1. Open application details <br>2. View "Status History" tab | Application ID: `APP-2024-005` | System displays timeline of statuses: date/time + status + processor | Positive | Low |

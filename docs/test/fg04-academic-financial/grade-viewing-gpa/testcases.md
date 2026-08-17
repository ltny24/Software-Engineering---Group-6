# FG04 – Academic & Financial: Grade Viewing & GPA – Test Cases

## Overview

The **Grade Viewing & GPA** feature allows students to view grades for each course by semester, view Semester GPA and Cumulative GPA (CPA) on the MyUS portal. The system must accurately display component grades, final grades, grading scales (10 / 4), and update promptly when changes are made by the academic committee.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_GRADE_01 | View grades for current semester | Student is logged in; grades published for current semester | 1. Go to "Academic Results" <br>2. Select current semester | Semester: `HK1 2024-2025` | System displays list of courses, component grades (CC, GK, CK), final grade, letter grade (A/B/C/D/F) | Positive | High |
| TC_GRADE_02 | View grades for previous semesters | Student has academic results from previous semesters | 1. Go to "Academic Results" <br>2. Select previous semester from dropdown | Semester: `HK2 2023-2024` | System correctly displays the transcript for the selected semester | Positive | High |
| TC_GRADE_03 | View Semester GPA | Student has grades in current semester | 1. Go to "Academic Results" <br>2. Select semester | Semester: `HK1 2024-2025` | System displays correctly calculated Semester GPA based on grades and course credits | Positive | High |
| TC_GRADE_04 | View Cumulative GPA (CPA) | Student has completed at least 1 semester | 1. Go to "Academic Results" <br>2. View "Cumulative CPA" section | _(none)_ | System displays correctly calculated CPA using cumulative formula from all semesters | Positive | High |
| TC_GRADE_05 | Calculate GPA when there is an F grade (failed) | Student has a failed course in the semester | 1. View grades for semester with failed course | Failed course: `Calculus` (grade 3.5/10) | GPA is calculated including the F grade, displayed correctly; failed course is highlighted in red/warning | Positive | High |
| TC_GRADE_06 | View grades when results are not yet published | Student selects semester with unpublished results | 1. Select semester with unpublished grades | Semester: `HK2 2024-2025` (unpublished) | System displays: "Grades for this semester have not been published yet." | Negative | Medium |
| TC_GRADE_07 | View grades when no courses are registered for the semester | Student selects semester with no registered courses | 1. Select semester before registration | Semester: `HK1 2020-2021` (no data) | System displays: "No course data available for this semester." | Negative | Low |
| TC_GRADE_08 | Verify accuracy of GPA calculation (formula) | Student has clear grades to check | 1. View Semester GPA <br>2. Calculate manually to compare | Course A: 8.5, 3 credits; Course B: 7.0, 2 credits; Course C: 9.0, 3 credits | GPA = (8.5×3 + 7.0×2 + 9.0×3) / (3+2+3) = 8.375 → Displays correctly | Positive | High |
| TC_GRADE_09 | View grades using 4.0 scale (letter grade) | Student is logged in | 1. Go to "Academic Results" <br>2. Switch to "4.0 Scale" view mode | _(toggle/tab switch)_ | System accurately displays grades converted to 4.0 scale (A=4.0, B+=3.5, B=3.0,...) | Positive | Medium |
| TC_GRADE_11 | (Skipped) Grade updated after successful appeal | Student has an accepted appeal application | 1. Review grade for appealed course after results | Course: `OOP Programming`; New grade: 8.0 (from 6.5) | System displays new grade 8.0; GPA and CPA are automatically recalculated | Positive | High |
| TC_GRADE_12 | GPA boundary: All courses achieve A grade (10/10) | Hypothetical student | 1. View Semester GPA with all courses achieving 10 | All courses: 10/10 | GPA = 4.0; CPA ≤ 4.0 | Boundary | Low |
| TC_GRADE_13 | GPA boundary: All courses achieve F grade (< 4/10) | Hypothetical student | 1. View Semester GPA with all courses failed | All courses: < 4/10 | GPA ≈ 0.0; system displays academic warning | Boundary | Low |
| TC_GRADE_14 | Download transcript | Student is logged in; has grades | 1. Go to "Academic Results" <br>2. Click "Download Transcript" | _(none)_ | System downloads official transcript PDF file with full information and school confirmation | Positive | Medium |
| TC_GRADE_15 | (Skipped) Display retaken courses correctly | Student has a retaken course | 1. View transcript | Retaken course: `Calculus` (2nd time) | System displays the 2 attempts separately; GPA is calculated based on the highest grade (or per policy) | Positive | High |

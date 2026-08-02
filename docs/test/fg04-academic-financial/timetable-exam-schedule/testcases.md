# FG04 – Academic & Financial: Timetable & Exam Schedule – Test Cases

## Overview

The **Timetable & Exam Schedule** feature allows students to view their class timetable by week/semester and exam schedules (midterm and final exams) on the MyUS portal. The system must correctly handle schedule conflicts, notify room/time changes, and display full details of the course, lecturer, and room.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_TKB_01 | View timetable for current week | Student is logged in; has timetable for current semester | 1. Go to "Timetable" section <br>2. Choose to view by week | Week: _(current week)_ | System displays timetable in grid format (Mon–Sun × Period 1–15), with correct course, room, and lecturer | Positive | High |
| TC_TKB_02 | View timetable by semester (full semester) | Student is logged in; has timetable | 1. Go to "Timetable" <br>2. Choose "By semester" view | Semester: `HK1 2024-2025` | System displays entire timetable for the selected semester | Positive | High |
| TC_TKB_03 | Switch timetable viewing week (previous/next week) | Student is viewing current week's timetable | 1. Click "Previous Week" or "Next Week" button | _(week navigation)_ | System accurately updates display to the corresponding week's timetable | Positive | Medium |
| TC_TKB_04 | View timetable when no courses are registered | Student has not registered for any courses in the semester | 1. Go to "Timetable" section <br>2. Select unregistered semester | Semester: _(unregistered semester)_ | System displays empty timetable; message: "You have not registered for any courses this semester." | Negative | Medium |
| TC_TKB_05 | Detect and warn about schedule conflict | Student has 2 courses overlapping in time (due to system error) | 1. View timetable | 2 courses on Tuesday, Periods 1-3 | System highlights conflicting slots with warning color (red/orange); displays message "Schedule conflict detected" | Negative | High |
| TC_TKB_06 | View final exam schedule | Student is logged in; exam schedule is published | 1. Go to "Exam Schedule" section <br>2. Select "Final Exam Schedule" | Semester: `HK1 2024-2025` | System displays list: course name, exam date, shift, room, exam format | Positive | High |
| TC_TKB_07 | View midterm exam schedule | Student is logged in; midterm schedule is available | 1. Go to "Exam Schedule" <br>2. Select "Midterm Exam Schedule" | Semester: `HK1 2024-2025` | System displays full midterm exam schedule for each course | Positive | High |
| TC_TKB_08 | View exam schedule when not yet published | Student accesses before exam schedule is approved | 1. Go to "Exam Schedule" | _(unpublished schedule)_ | System displays: "Exam schedule has not been published yet. Please check back later." | Negative | Medium |
| TC_TKB_09 | Detect exam schedule conflict | Student has 2 exams on same day, same shift | 1. View exam schedule | 2 exams: Thursday, Morning shift | System displays prominent warning: "Exam schedule conflict detected: [Course A] and [Course B]"; suggests contacting academic office | Negative | High |
| TC_TKB_10 | Filter timetable by specific date | Student wants to view schedule for one day | 1. Select date from date picker | Date: `15/01/2025` | System displays only classes/exams on 15/01/2025 | Positive | Medium |
| TC_TKB_11 | View detailed course info upon clicking timetable slot | Student is viewing timetable | 1. Click on a course slot in timetable | Course: `OOP Programming – T306 – Dr. Nguyen Van A` | System opens popup/modal displaying: course name, code, lecturer, room, periods, credits | Positive | Medium |
| TC_TKB_12 | Export timetable to PDF or print | Student is logged in; has timetable | 1. Go to Timetable <br>2. Click "Export PDF" or "Print" | _(none)_ | System exports PDF file with full timetable, suitable for printing | Positive | Low |
| TC_TKB_13 | Room change notification | Admin updates room change | 1. View timetable after room change | Old room: `A301` → New room: `B205` | System displays new room B205; may display "Changed" badge | Positive | High |
| TC_TKB_14 | Boundary: semester with classes 6 days/week | Student with exceptionally heavy schedule | 1. View weekly timetable with 6 days of classes (Mon–Sat) | _(6-day/week schedule)_ | System displays all 6 days correctly without cropping | Boundary | Low |
| TC_TKB_15 | Boundary: class at final period (period 15) | Course scheduled for periods 13-15 | 1. View timetable with course at periods 13-15 | Periods: `13-15 (20:00-22:50)` | System displays fully without UI overflow | Boundary | Low |

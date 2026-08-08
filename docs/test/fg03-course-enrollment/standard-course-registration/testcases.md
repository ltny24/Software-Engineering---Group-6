# FG03 – Course Enrollment: Standard Course Registration – Test Cases

## Overview

The **Standard Course Registration** feature (UC-03, UC-03a) allows students to browse the course catalog, verify eligibility (prerequisites, schedule conflicts, credit limits), add courses to their cart, and submit their registration. The system handles various edge cases such as closed registration windows, administrative holds, waitlisting, and dropping courses.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_REG_01 | View course catalog | Student is logged in; Registration window is open | 1. Go to "Course Registration" section | _(none)_ | System displays registration screen with student's credit summary and catalog of available sections | Positive | High |
| TC_REG_02 | Search and filter catalog | Student is viewing the catalog | 1. Enter search criteria (department, course code, time slot) | Keyword: `CSC10001` | System filters catalog and displays only matching sections | Positive | High |
| TC_REG_03 | Add course to cart (Prerequisites met) | Student has completed all prerequisites | 1. Click "Add to Cart" for a specific section | Course: `Software Engineering` | System confirms eligibility (UC-03a Pass), adds section to cart, updates credit total | Positive | High |
| TC_REG_04 | Submit registration successfully | Student has valid courses in cart | 1. Review cart summary <br>2. Click "Submit Registration" | _(valid cart)_ | System finalizes enrollment, reserves seats, updates tuition invoice, displays confirmation | Positive | High |
| TC_REG_05 | Add course fails: Prerequisite Not Met | Student has NOT completed prerequisites | 1. Click "Add to Cart" | Course: `Advanced AI` | System blocks addition, displays missing prerequisite(s) and suggests earlier courses | Negative | High |
| TC_REG_06 | Add course fails: Corequisite Missing | Student has not added required corequisite | 1. Click "Add to Cart" | Course with Lab coreq | System blocks addition, flags missing corequisite, suggests adding it together | Negative | High |
| TC_REG_07 | Section Full / Waitlist option | Selected section has 0 seats remaining | 1. Click "Add to Cart" | Course: `Math 101` (Full) | System blocks addition, offers waitlist option. If accepted, student is added to waitlist | Alternative | High |
| TC_REG_08 | Schedule Conflict | Section overlaps with an already-selected course | 1. Click "Add to Cart" for overlapping course | 2 courses at `Tue 08:00 AM` | System warns about schedule conflict, blocks adding both unless one is removed | Negative | High |
| TC_REG_09 | Credit Limit Exceeded | Student cart exceeds max semester credits | 1. Click "Submit Registration" | Cart with > 24 credits | System blocks submission, directs student to remove courses or request an override | Negative | High |
| TC_REG_10 | Registration Window Closed | Current date is outside registration period | 1. Go to "Course Registration" | _(closed period)_ | System shows read-only view of current schedule; no editing or adding allowed | Negative | High |
| TC_REG_11 | Administrative Hold | Student has unpaid balance or disciplinary hold | 1. Go to "Course Registration" | _(student with hold)_ | System blocks registration access, explains reason and how to resolve it | Negative | High |
| TC_REG_12 | Draft Cart / Abandon Session | Student adds courses but does not submit | 1. Add courses to cart <br>2. Leave page | _(unsubmitted cart)_ | Selections are retained as draft, but seats are NOT reserved | Alternative | Medium |
| TC_REG_13 | Drop a Registered Course | Post-submission, within add/drop window | 1. Select registered course <br>2. Click "Drop" | Course: `Physics 101` | System removes course, updates enrollment, and recalculates tuition invoice | Positive | High |

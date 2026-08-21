# FG05 – Feedback Evaluation: Submit Evaluation Surveys – Test Cases

## Overview

The evaluation survey module allows students to submit course and teaching feedback after each semester. The system validates required fields, enforces one submission per evaluation cycle, and records responses for academic reporting.

---

## Test Cases Table

| Test Case ID | Use case/Feature | Mô tả | Preconditions | Steps | Test Data/Input | Expected Result | Priority | Loại test |
|---|---|---|---|---|---|---|---|---|
| TC_SURV_01 | Submit valid survey | Student opens the survey and submits complete feedback | Student is logged in and survey is active | 1. Open survey page 2. Fill all required fields 3. Submit | Course: `CS101`, score: 4/5, comment: `Helpful and structured` | System records the survey successfully and shows confirmation message | High | Functional |
| TC_SURV_02 | Survey without required course selection | Student leaves course unselected | Survey is active | 1. Open survey 2. Skip course 3. Submit | Course: blank | System blocks submission, shows validation error: "Please select a course." | High | Functional |
| TC_SURV_03 | Survey without rating | Student leaves rating blank | Survey is active | 1. Open survey 2. Fill comment only 3. Submit | Score: blank | System blocks submission and requires a rating | High | Functional |
| TC_SURV_04 | Single submission per student per course | Student already submitted this evaluation | Student has an existing submission | 1. Open survey for the same course 2. Submit again | Same course and same academic term | System prevents double submission and shows warning message | High | Security |
| TC_SURV_05 | Survey comment length within limit | Student writes a valid comment | Survey is active | 1. Enter a 300-character comment 2. Submit | Comment length: 300 chars | System accepts and saves the survey | Medium | Edge case |
| TC_SURV_06 | Survey comment exceeds length limit | Student submits unusually long comment | Survey is active | 1. Enter 500-character comment 2. Submit | Comment length: 501 chars | System rejects comment and shows max-length error | Medium | Edge case |
| TC_SURV_07 | Anonymous feedback is allowed | Student chooses anonymous mode | Survey is active | 1. Select anonymous option 2. Submit | Anonymous: Yes | System saves the response without exposing personal identity | Medium | Functional |
| TC_SURV_08 | Survey closed after deadline | Student attempts to submit after close date | Deadline has passed | 1. Open survey form 2. Submit | Date after closing date | System displays "Survey is closed" and no data is saved | High | Security |
| TC_SURV_09 | Partial survey saved as draft | Student leaves form incomplete and refreshes | Survey is active | 1. Fill partial answers 2. Refresh page | Draft fields: course + rating only | System keeps the draft or warns user before losing data | Medium | Functional |
| TC_SURV_10 | Invalid rating value | Student enters a value outside the accepted range | Survey is active | 1. Enter score 6/5 2. Submit | Score: 6 | System displays invalid rating error and blocks submission | High | Edge case |

## Change Log

- Created new test case file for FG05 because the folder was previously empty and lacked any verifiable acceptance criteria.
- Each scenario includes concrete preconditions, steps, and expected outcomes to align with the repo’s documentation convention.
- Added edge and security cases (duplicate submission, expiry, invalid rating, and length limits) because happy-path-only surveys are insufficient for evidence-based testing.

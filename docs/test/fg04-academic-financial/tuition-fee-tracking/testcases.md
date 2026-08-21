# FG04 – Academic & Financial: Tuition Fee Tracking – Test Cases

## Overview

The **Tuition Fee Tracking** feature allows students to view tuition debt information, payment history, remaining balance to be paid, applied scholarships/discounts, and scholarship history on the MyUS portal. The system must ensure high accuracy in financial data and transparently display all transactions.

---

## Test Cases Table

| Test Case ID | Test Scenario | Pre-conditions | Test Steps | Input Data | Expected Output | Test Type | Priority |
|---|---|---|---|---|---|---|---|
| TC_TUI_01 | View total current tuition debt | Student is logged in; has tuition debt | 1. Go to "Tuition" section <br>2. Select current semester | Semester: `HK1 2024-2025` | System displays: total tuition, amount paid, remaining balance, next payment deadline | Positive | High |
| TC_TUI_02 | View tuition payment history (Skipped - UI/API mismatch) | Student has transaction history | 1. Switch to Payment History tab | Data table | Displays transaction code, amount, payment method, payment date | Positive | Medium |
| TC_TUI_03 | View tuition when fully paid (debt = 0) | Student has fully paid tuition | 1. Go to "Tuition" section <br>2. Select fully paid semester | Semester: `HK2 2023-2024` | System displays "Debt: 0 VND"; green badge "Fully Paid" | Positive | High |
| TC_TUI_04 | View tuition when debt is unpaid | Student has remaining debt | 1. Go to "Tuition" section | Semester: `HK1 2024-2025`; Debt: `3,500,000 VND` | System clearly displays remaining debt amount; red/orange badge "Outstanding Debt" + payment deadline | Positive | High |
| TC_TUI_05 | View granted scholarship information | Student received scholarship in semester | 1. Go to "Tuition" <br>2. Select "Scholarships & Discounts" tab | Semester: `HK1 2024-2025` | System displays: scholarship type, value, granted date, scholarship source (school / Government) | Positive | High |
| TC_TUI_06 | Verify scholarship is correctly deducted from tuition | Student has tuition discount scholarship | 1. View tuition calculation table | Original tuition: `10,000,000 VND`; Scholarship: `5,000,000 VND` | System displays: Original tuition – Scholarship = 5,000,000 VND (remaining to pay) | Positive | High |
| TC_TUI_07 | View scholarship history across multiple semesters | Student has received scholarships over multiple semesters | 1. Go to "Scholarships" <br>2. Select "Full History" | _(all semesters)_ | System displays full list of scholarships by semester, sorted newest first | Positive | Medium |
| TC_TUI_08 | View tuition when no data available for new semester | Student selects future semester without tuition announcement | 1. Select semester without tuition announcement | Semester: `HK2 2025-2026` | System displays: "Tuition information for this semester is not yet updated." | Negative | Medium |
| TC_TUI_09 | Verify amount displays correctly in VND currency format | Student views tuition | 1. View any tuition amount | Amount: `12500000` | System displays format: `12.500.000 đồng` (with thousand separator dots) | Positive | Medium |
| TC_TUI_10 | Download tuition receipt (PDF) | Student has made at least 1 payment | 1. Go to "Payment History" <br>2. Click "Download Receipt" for a transaction | Transaction Code: `TXN-2024-00123` | System downloads PDF receipt file with full information: transaction code, date, amount, digital signature | Positive | Medium |
| TC_TUI_11 | Verify debt after successful payment | Student just completed a payment | 1. Successfully pay tuition <br>2. Review debt | Amount paid: `5,000,000 VND` | Debt decreases by exact amount paid; history updates with new transaction | Positive | High |
| TC_TUI_12 | Verify when tuition = 0 (100% exemption) | Student is fully exempt from tuition (policy beneficiary) | 1. View current semester tuition | Semester: `HK1 2024-2025`; 100% Scholarship | System displays tuition = 0 VND; note "100% Tuition Exemption" | Positive | Medium |
| TC_TUI_13 | Boundary: View tuition with multiple overlapping scholarships | Student receives multiple scholarships in 1 semester | 1. View "Scholarships & Discounts" tab | Scholarship A: 2,000,000 VND + Scholarship B: 1,500,000 VND | System calculates correct total: 3,500,000 VND deducted; does not exceed original tuition | Boundary | Medium |
| TC_TUI_14 | View overdue tuition payment notification | Student is past payment deadline | 1. Go to "Tuition" section | Deadline: passed | System displays red warning: "Your tuition payment is overdue! Please contact the Finance Office." | Negative | High |
| TC_TUI_15 | Filter payment history by time range | Student has payment history over multiple semesters | 1. Go to "Payment History" <br>2. Set date filter from/to | From: `01/09/2024`, To: `31/01/2025` | System only displays transactions within the selected time range | Positive | Low |
| TC_TUI_16 | View total tuition paid for entire course | Student wants to view financial summary | 1. Go to "Tuition" <br>2. Select "Course Summary" | _(all semesters)_ | System displays total tuition paid from start of course to present | Positive | Low |

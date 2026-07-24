# Tuition Feature Specification

## Feature Name
Tuition and Financial Overview Page

## Summary
The tuition feature provides students with a clear overview of their academic charges, payments, scholarship deductions, and outstanding balance for the selected term. It includes summary cards and a payment history table.

## User Stories
1. As a student, I want to see my tuition summary at a glance so I can understand my financial obligations.
2. As a student, I want to review how much I have already paid and how much remains due.
3. As a student, I want to inspect my payment history so I can verify previous transactions.

## Functional Requirements
- The page must display a header with the current tuition term and financial status.
- The page must show four summary cards:
  - Total charges
  - Scholarship deduction
  - Amount paid
  - Remaining balance
- The page must render a payment history table with:
  - Transaction reference
  - Payment date
  - Payment method
  - Amount
  - Status
- The page must use mock data so the UI is visible immediately.

## UI Requirements
- The UI must use inline styles only.
- The design should follow the existing student portal visual language.
- The color palette should use neutral slate tones with accent colors such as:
  - #f8fafc
  - #1e293b
  - #64748b
- Summary cards should use a distinct top border accent.
- The payment history table should use alternating row colors for readability.

## Acceptance Criteria
- A student can view financial summary cards for the current term.
- The page displays the payment history table with transaction details.
- The financial status badge reflects whether the account is on hold or normal.
- The page renders without requiring backend data.
- The UI is visually consistent with the rest of the university portal.

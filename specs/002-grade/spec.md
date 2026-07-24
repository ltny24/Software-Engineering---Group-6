# Grade Feature Specification

## Feature Name
Student Grade Overview Page

## Overview
The grade overview page enables students to review term-specific academic results, including GPA summaries and course-level grade details.

## User Stories
- As a student, I can select a term to view grades for that academic period.
- As a student, I can see summary GPA and credit totals.
- As a student, I can view each course’s grade details in a table.

## Functional Requirements
- Header with page title and term dropdown.
- Summary cards for:
  - GPA (10-point scale)
  - GPA (4-point scale)
  - Term credits earned
- Detailed table columns:
  - Course code
  - Course name
  - Credits
  - Midterm score
  - Final score
  - Final grade
  - Letter grade
- Use mock data for immediate rendering.

## UI Requirements
- Inline styles only.
- Use the portal’s neutral slate theme.
- Accent border details on summary cards.
- Alternating row background for the grade table.
- Maintain a clean and readable data layout.

## Prototype Flow
1. Load the grade overview page.
2. Select a term from the dropdown.
3. Summary cards update for the selected term.
4. The grade table displays corresponding course details.

## Acceptance Criteria
- The term selector changes visible grade data.
- Summary cards reflect filtered data.
- The grade table is complete and styled.
- No backend is required for the UI prototype.

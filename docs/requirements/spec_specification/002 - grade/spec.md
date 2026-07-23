# Grade Feature Specification
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi

## Feature Name
Student Grade Overview Page

## Overview
The grade overview page enables students to review term-specific academic results, including GPA summaries and course-level grade details. This specification defines the Minimum Viable Prototype (MVP) required for full-stack implementation under the Spec-Driven workflow.

## User Stories
- **US-01:** As a student, I can select a term from a dropdown to view grades for that academic period.
- **US-02:** As a student, I can see summary GPA (both 10-point and 4-point scales) and credit totals at a glance.
- **US-03:** As a student, I can view each course’s detailed component scores and final grade in a structured table.

## Functional Requirements
- **Header Section:** Displays page title and term dropdown selector.
- **Summary Cards:** Three distinct metrics cards displayed below the header:
  - GPA (10-point scale)
  - GPA (4-point scale)
  - Term credits earned
- **Detailed Grade Table:** A structured table displaying seven specific columns:
  - Course code
  - Course name
  - Credits
  - Midterm score
  - Final score
  - Final grade (10-point scale)
  - Letter grade
- **Data Layer:** Use structured mock data for immediate UI rendering and state validation.

## UI Requirements
- Inline styles only for all prototype elements.
- Use the portal’s neutral slate theme (`#f8fafc` background, `#1e293b` primary text, `#64748b` secondary text).
- Accent border details on summary cards (top borders with distinct highlight colors).
- Alternating row backgrounds for the grade table to ensure clean and readable data layout.
- Clear cell padding and responsive structure.

## Prototype Flow
1. Load the grade overview page.
2. Select a term from the dropdown menu.
3. Summary cards automatically update to reflect the selected term.
4. The grade table filters and displays corresponding course details for that term.

## Acceptance Criteria
- The term selector successfully changes the visible grade data.
- Summary cards accurately reflect GPA and credit totals for the filtered data.
- The grade table is fully rendered with all 7 columns and proper styling.
- The page renders standalone without backend dependencies during the prototyping phase.

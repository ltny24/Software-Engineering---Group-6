# Timetable Feature Specification

## Feature Name
Student Timetable Page

## Overview
The timetable page gives students a quick, polished view of their weekly class schedule for a selected academic term, including summary metrics, week navigation, and detailed course information.

## User Stories
- As a student, I can select a term and see the timetable for that term.
- As a student, I can view summary workload metrics at a glance.
- As a student, I can inspect the full details of each class session.

## Functional Requirements
- Header section with page title and term selector.
- Week navigation buttons labeled `Prev` and `Next`.
- Summary cards for:
  - Total Courses
  - Scheduled Classes
  - Active Term Information
- Weekly overview section with weekdays as columns.
- Detailed schedule table with columns:
  - Day
  - Course Code
  - Course Name
  - Time
  - Room
  - Instructor
  - Type
- Use mock schedule data for the prototype.

## UI Requirements
- Inline CSS styling for all elements.
- Consistent visual theme with the portal:
  - Background: `#f8fafc`
  - Text: `#1e293b`
  - Secondary text: `#64748b`
- Summary cards should have accent top borders.
- Tables should use alternating row backgrounds and clear cell padding.
- Buttons should have a subtle border and hover-friendly spacing.

## Prototype Flow
1. Load timetable page.
2. Display current term and week range.
3. Allow term selection and week navigation.
4. Render summary cards.
5. Render weekly overview and detailed schedule table.

## Acceptance Criteria
- Term selector works with mock terms.
- Week navigation updates the week label.
- Summary values reflect the selected term data.
- The timetable table shows properly formatted mock entries.
- The page renders without backend dependencies.

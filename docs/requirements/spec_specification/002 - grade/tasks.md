# Grade Feature Tasks
**Author:** Lê Thị Như Ý | **Reviewer:**Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi
## Implementation Tasks
1. Create the grade page component structure (`GradesPage.tsx`) and setup route placeholders.
2. Define TypeScript interfaces for course (`CourseDTO`) and grade (`GradeDTO`) data structures.
3. Add mock grade data supporting multiple academic terms (e.g., `2024-2025-HK1`, `2024-2025-HK2`).
4. Implement a term selector dropdown in the header to manage active term state.
5. Render three summary cards for GPA (10-scale), GPA (4-scale), and total credits earned.
6. Render a detailed grade table featuring all seven required columns.
7. Apply inline-only styling consistent with the existing student portal UI neutral slate theme.
8. Ensure table rows alternate background colors to improve data scanning and readability.
9. Verify the page renders correctly and state transitions function smoothly with the provided mock data.

## Completion Checklist
- [x] Header with term selection dropdown implemented
- [x] Three summary cards displayed below the header with accent borders
- [x] Detailed grade table displayed with 7 required columns
- [x] Mock data across multiple terms used for immediate rendering
- [x] Inline style implementation strictly applied
- [x] Alternating row backgrounds applied to tables
- [x] Scope alignment documented to explain MVP focus vs. full UC-05 specification

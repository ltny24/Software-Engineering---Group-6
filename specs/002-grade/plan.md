# Grade Feature Implementation Plan

## Objective
Create a polished grade overview page that lets students inspect term-based academic performance with a prototype-ready UI and mock data.

## Technical Approach
- Build the grade page as a React functional component using `useState`, `useEffect`, and term filtering.
- Provide mock grade records to render immediately.
- Allow switching between academic terms with a dropdown.
- Calculate GPA and credit summaries from filtered grade data.
- Keep the design ready for future backend API integration.

## UI Prototype Flow
1. Student lands on the grade overview page.
2. Header shows the page title and term selector.
3. Summary cards display GPA and total credits.
4. The detailed grade table lists each course with scores and grade values.

## Visual Design Guidelines
- Light page background: `#f8fafc`.
- Primary text color: `#1e293b`.
- Secondary text color: `#64748b`.
- Use inline styles only.
- Summary cards should have accent top borders.
- Detailed table rows should alternate background colors.

## Data Model
```ts
interface CourseDTO {
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
}

interface GradeDTO {
  gradeId: number;
  term: string;
  gradeValue: string;
  gradePoint: number;
  midtermScore: number;
  finalScore: number;
  overallScore: number;
  course: CourseDTO;
}
```

## Notes
- The page belongs under student academic pages.
- Mock data should support at least two terms.
- The prototype should look complete without backend data.

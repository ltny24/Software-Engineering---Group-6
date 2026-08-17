# Grade Feature Implementation Plan
**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi

## Objective
Create a polished grade overview page that lets students inspect term-based academic performance with a prototype-ready UI and mock data, designed for seamless full-stack integration (Frontend, Backend, and Database).

## Technical Approach
- Build the grade page as a React functional component using `useState`, `useEffect`, and term filtering[cite: 11].
- Provide mock grade records to render immediately without backend dependencies during the UI prototyping phase[cite: 11, 12].
- Allow switching between academic terms with a responsive dropdown selector[cite: 11, 12].
- Calculate GPA (both 10-point and 4-point scales) and credit summaries dynamically from filtered grade data[cite: 11, 12].
- Keep the UI layout and data structures ready for future RESTful API integration with the Spring Boot backend[cite: 11].

## MVP Scope & Architecture Framing
- **Core Focus:** This implementation focuses strictly on the Full-Stack execution of UC-05 Basic Flow (Term selection, summary workload cards, and detailed course grade tables)[cite: 10, 11, 12].
- **Out of Scope for this Sprint:** Advanced features mentioned in the vision document such as direct Grade Appeal redirection (AF2), GPA Trend Charting (AF3), and PDF Transcript Export (AF4) are descoped for this sprint's prototype[cite: 10]. This strategy ensures a robust, transaction-safe database and backend integration for core grade viewing first.

## UI Prototype Flow
1. Student lands on the grade overview page[cite: 11, 12].
2. Header shows the page title and term selector dropdown[cite: 11, 12].
3. Summary cards display GPA (10-point and 4-point scales) and total term credits earned[cite: 11, 12].
4. The detailed grade table lists each course with component scores (Midterm, Final) and final grade values[cite: 11, 12].

## Visual Design Guidelines
- Light page background: `#f8fafc`[cite: 11, 12].
- Primary text color: `#1e293b`[cite: 11, 12].
- Secondary text color: `#64748b`[cite: 11, 12].
- Use inline styles only for the prototype phase[cite: 11, 12].
- Summary cards must feature accent top borders for visual hierarchy[cite: 11, 12].
- Detailed table rows must alternate background colors to enhance readability[cite: 11, 12, 13].

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
```[cite: 11]

## Notes
- The page belongs under the student academic pages area[cite: 11].
- Mock data must support at least two academic terms to validate dropdown state transitions[cite: 11, 13].
- The prototype must look visually complete and professional even without backend data[cite: 11, 12].

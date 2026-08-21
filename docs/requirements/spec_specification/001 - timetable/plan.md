**Author:** Lê Thị Như Ý | **Reviewer:** Trần Tường Vi | **Editor:** Lê Thị Như Ý, Trần Tường Vi
# Timetable Feature Implementation Plan

## Objective
Create a polished timetable page that allows students to view their weekly course schedule by term, with a prototype-ready UI that can later connect to backend timetable data.

## Technical Approach
- Build the page as a React functional component using `useState`, `useEffect`, and optional memoization.
- Provide a mock schedule data layer for immediate prototype rendering.
- Support term switching with a dropdown selector.
- Display summary metrics and a detailed timetable table.
- Keep the UI layout ready for future backend integration.

## UI Prototype Flow
1. Student lands on the timetable page.
2. Header shows the page title, term selector, and current week range.
3. Summary cards display total courses, scheduled classes, and optional status.
4. Week navigation buttons update the displayed week range.
5. The weekly overview grid shows courses grouped by weekday.
6. A detailed schedule table provides course code, name, time, room, instructor, and type.

## Visual Design Guidelines
- Use a clean light background: `#f8fafc`.
- Primary text color: `#1e293b`.
- Secondary text color: `#64748b`.
- Accent cards with subtle border highlights.
- Use inline styles only for the prototype.
- Keep spacing consistent: header, cards, week navigator, overview, and detail table.

## Data Model
```ts
interface TimetableItem {
  id: number;
  term: string;
  day: string;
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  lecturer: string;
  classType: string;
}
```

## Notes
- The component belongs in the student timetable page area.
- Mock data should include at least two terms to validate the dropdown.
- The page should look complete even without backend integration.

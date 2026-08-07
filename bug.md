Please modify only the source code (frontend + backend if needed) of the project.
Do not update documentation files, README, reports, or any docs at this stage.

General requirements:

Keep the current UI theme, layout style, colors, and design system unchanged.
Do not redesign the interface.
Only fix functionality, data loading, wording, and logic issues described below.
Ensure all changes work with the existing mock SQL data and current project structure.
1. Dashboard Page

1.1 Weekly Class Schedule does not load

The Weekly Class Schedule section currently cannot display the timetable.

Fix:

Load the student's timetable correctly from backend/database.
Ensure the schedule shown matches registered courses.
Do not use hardcoded data if the backend already provides timetable data.
1.3 Academic Results - Credits Earned

Current:

GPA is displayed correctly.
Credits Earned progress bar shows 0/120.

Change:

Display credits earned as:
63/120
Update the progress bar to represent 63 completed credits.
Add a circular indicator/button on the progress bar at the current position to visually show that the progress has reached 63 credits.

Example:

0 ----------------●---------------- 120
                 63
1.4 Tuition Status Detail button

Current issue:

Clicking "Detail" inside Tuition Status does not navigate anywhere.

Fix:

Make the button navigate correctly to the Tuition page.
Ensure routing works properly.
2. Profile Page
Contact Information Persistence

Current issue:

Editing contact information only changes temporarily.
After restarting the project or logging in again, old data appears.

Requirement:

When user edits contact information:
Save the updated data into SQL/database through backend API.
The new information must persist after:
restarting frontend/backend
logging out and logging in again

Important:

Mock data SQL should only be executed once.
After database initialization, running the project should only require starting frontend/backend.
Do not require executing SQL files every time.
3. Course Page
3.1 Remove duplicated My Registration tab

Current tabs:

Browse Course
My Registration (10)
My Registration (10)

Problem:

One duplicated tab exists.

Fix:
Keep only:

Browse Course
My Registration (x)
3.2 Browse Course Page
Semester Filter Dropdown

Current:

All terms dropdown is incomplete.

Update dropdown options exactly:

All Terms
HKI 2025-2026
HKII 2025-2026
HKIII 2025-2026

These values must match the semester data in mock SQL.

Search behavior

Requirement:

When selecting a semester and searching:

Example:

Select:

HKI 2025-2026

Then search should only display courses belonging to HKI 2025-2026.

Same for:

HKII 2025-2026
HKIII 2025-2026

Reset button:

When clicking Reset:

Clear search/filter.
Return dropdown to:
All Terms
Show all available courses again.
Course registration logic

For courses in:

HKI 2025-2026
HKII 2025-2026

These courses are already completed.

Therefore:

Columns:

Seats
Action

should be empty.

Example:

Course	Seats	Action
Database System		

For courses in:

HKIII 2025-2026

Only these courses should have:

Seats:

x seats left

and:

Action:

Register button
3.3 My Registration Page
Registration count

Current:

My Registration (10)

The number represents opened HKIII courses available for registration.

Requirement:

When registering a course successfully:

Example:

Before:

My Registration (10)

After registering one course:

My Registration (9)

Update dynamically.

Merge Capacity and Enrolled columns

Current:

Separate columns:

Capacity
Enrolled

Change into one column:

Capacity

Display format:

50/150

Meaning:

50 = enrolled students
150 = maximum capacity

Example:

50/150
Seat calculation logic

The remaining seats shown in Browse Course must update correctly.

Formula:

Seat Left = Capacity - Enrolled

Example:

Capacity:

150

Enrolled:

50

Browse Course should display:

100 seats left

When a student registers:

Before:

50/150
100 seats left

After:

51/150
99 seats left

Update all related pages consistently.

Remove Location column

Remove:

Location

column from My Registration table.

4. Timetable Page
Semester dropdown correction

Current dropdown is incorrect.

Replace with:

HKI 2025-2026
HKII 2025-2026
HKIII 2025-2026

Must match SQL mock data.

Timetable loading logic

Requirement:

HKI 2025-2026:

Existing timetable should load.

HKII 2025-2026:

Existing timetable should load.

HKIII 2025-2026:

Initially empty.
After successful course registration:
Newly registered courses appear automatically in timetable.
5. Grade Page
Add Mid-term and Final Grade columns

Current grade table needs additional columns:

Add:

Mid-term Grade
Final Grade

The data already exists in mock SQL.

Load these values from database.

Remove duplicated Letter Grade column

Current:

Grade
Letter Grade
Grade Point

Problem:

Letter Grade duplicates Grade Point information.

Remove:

Letter Grade

Keep:

Grade
Grade Point
Mid-term Grade
Final Grade
6. Appeal Page
Fix Submit Appeal functionality

Current problems:

Submit Appeal button does not work.
Cannot select a subject in "Your Grade".
Reason input cannot be typed.
Your Grade dropdown

When selecting a course:

Example:

Your Grade:
Database System

Automatically fill:

Current Grade:
8.5

based on existing grade data.

User only needs to enter:

Expected Grade
Reason field

Fix:

Make the input editable.
Allow users to type appeal reasons.
Appeal persistence

When appeal is successfully submitted:

The expected grade should be saved into database.

Similar to profile contact information:

Store updated grade/appeal result in SQL/database.
Persist after restarting application.
Update Grade page after successful appeal

After appeal approval:

The new expected grade should replace the old grade.

Example:

Before:

Database System
Grade: 7.0

After approved appeal:

Database System
Grade: 8.0

Grade page must display updated value.

7. Support Page

Current:

Support has:

Help & FAQ
AI Learning Assistant

Problem:

After entering one section:

User must click Support again to return and choose another option.

Change:

Inside Help & FAQ and AI Learning Assistant pages:

Add a small back arrow button at the top corner.

Example:

←
Help & FAQ

Clicking it returns to:

Help & FAQ
AI Learning Assistant

without reopening Support manually.

8. Night Mode Dropdown Styling

Current issue:

Some dropdowns in night mode have:

White background
Light gray/white text

This makes them unreadable.

Fix:

Make all dropdown components consistent with dark theme:

Dropdown background:

same blue/dark background as the theme

Dropdown text:

white

Ensure:

Semester dropdowns
Course filters
Select inputs
Other dropdown components

all support night mode correctly.

Final Requirements

Before finishing:

Test all modified flows:
Login → Dashboard
Profile edit → restart → check persistence
Course search/filter/register
Registration count update
Seat calculation
Timetable update
Grade display
Appeal submission
Support navigation
Night mode dropdowns
Keep existing theme and UI structure.
Only modify source code.
Do not modify documentation files yet.
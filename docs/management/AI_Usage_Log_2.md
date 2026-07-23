# AI Usage Log Report 2
*Performed by: Trần Tường Vi | Reviewed by: Hoàng Trung Kiên | Edited by: Trần Tường Vi*

---

## 1. AI Usage Rules

1. **Transparency:** All AI tools must be fully declared. If a member uses multiple tools within the same phase, each tool must be logged in a separate row.
2. **Specificity:** Avoid generic terms like "writing code" or "doing docs". The purpose must explicitly state the specific file, component, or document section targeted.
3. **Responsibility:** AI is used strictly for brainstorming, scaffolding, and syntax checks. Members are entirely responsible for verifying and maintaining the final correctness of their deliverables.
4. **Data Privacy:** Members are strictly prohibited from feeding sensitive system configurations, production credentials, or personal database records into public GenAI models.
5. **Sync Frequency:** This log must be updated continuously at the end of each sprint phase. Vague, retroactive logging right before the final submission deadline is strictly disallowed.

---

## 2. Detailed AI Usage Log

### PA3 document

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | ChatGPT | Helped format the Project Plan, Detailed Vision Document and supported diagram creation for the Use-Case Specification (Student) section|
| Dương Minh Huỳnh Khôi | Gemini | Helped draft and format the Weekly Report in Markdown |
| Hoàng Trung Kiên | Gemini | Supported diagram creation for the Use-Case Specification (Admin) section |
| Trần Tường Vi | Gemini | Summarized document content and assisted with update Markdown formatting |
| Lê Thị Như Ý | ChatGPT | 	Supported Mermaid diagram creation for the Use-Case Model |

---

### Code - Phase 4 (Part 1)

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc |  | *No coding task assigned — no AI usage to declare* |
| Dương Minh Huỳnh Khôi | Copilot (VSCode) | Helped implement the timetable backend API (task T029) |
| Hoàng Trung Kiên |  | *No coding task assigned — no AI usage to declare* |
| Trần Tường Vi | Copilot (VSCode)  | Used to generate mock data for the timetable module (task T028) |
| Lê Thị Như Ý | Copilot (VSCode) | Supported implementation of the timetable frontend UI (task T030) |


---

## 3. Appendix

- **Copilot Chat.** *GitHub Copilot Chat, Visual Studio Code*, accessed 20:15 on 21/07/2026, prompt: "Implement the timetable frontend UI in the React project, including a weekly/daily view that consumes the timetable backend API, displays each student's class sessions (subject, room, time slot, lecturer) grouped by day, supports switching between weeks, and handles loading and empty/error states, following the existing project's component structure and styling conventions", used to assist task T030 ("Implement timetable frontend UI"); AI generated an initial set of React components (timetable page, week navigation control, and a session card/list component) along with the API-fetching logic and basic loading/error/empty-state handling, student reviewed and reworked the component structure, adjusted the data-fetching hook to match the actual response shape returned by the timetable backend API, refined the layout, spacing, and responsiveness to align with the rest of the frontend, and manually tested the page across different weeks and edge cases (no sessions, API failure) before committing.

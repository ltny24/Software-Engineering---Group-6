# AI Usage Log Report
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

### PA2 document

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | Gemini | Assisted in formatting Markdown for the Project Plan section|
| Dương Minh Huỳnh Khôi | ChatGPT | Summarized reference material and drafted content for the Vision Document – Non-Functional Requirements section |
| Hoàng Trung Kiên | Gemini | Assisted in formatting Markdown for the Vision Document – Stakeholder & User / Product Overview section |
| Trần Tường Vi | Gemini | Summarized document content and assisted with Markdown formatting for the Project Plan |
| Lê Thị Như Ý | ChatGPT | Reviewed and improved technical English descriptions for the Vision Document – Product Features section. Assisted in refining the Mermaid diagrams used to illustrate the Product Features |

---

### Code - Phase 1 

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | Copilot (VSCode) | Assisted in adding initial API docs scaffolding in the backend (task T006) |
| Dương Minh Huỳnh Khôi | Copilot (VSCode) | Assisted in creating the backend Spring Boot project skeleton (task T001) and configuring JWT auth dependencies in the backend (task T004) |
| Hoàng Trung Kiên | Copilot (VSCode) | Assisted in creating the React frontend project skeleton (task T002) and configuring frontend routing & global layout (task T005) |
| Trần Tường Vi |  | *No coding task assigned in Phase 1 — no AI usage to declare* |
| Lê Thị Như Ý | Copilot (VSCode) | Assisted in configuring linting, formatting, and environment variables (task T003) |

### Code - Phase 2 

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | Copilot (VSCode) | Assisted in adding backend API exception handling (task T011) |
| Dương Minh Huỳnh Khôi | Copilot (VSCode) | Assisted in implementing the JWT auth filter & security config (task T008) and implementing RBAC for Student & Admin roles (task T009) |
| Hoàng Trung Kiên | Copilot (VSCode) | Assisted in implementing frontend auth state & protected routes (task T012) |
| Trần Tường Vi | Copilot (VSCode) | Assisted in setting up the SQL Server schema & DB migrations (task T007), creating auth & profile entities in the backend (task T010), and adding baseline API documentation in backend/README.md (task T014) |
| Lê Thị Như Ý | Copilot (VSCode) | Assisted in implementing frontend shared data services (task T013) and adding baseline API documentation in frontend/README.md (task T014) |

---

## 3. Appendix

- **Copilot Chat.** *GitHub Copilot Chat, Visual Studio Code*, accessed 21:30 on 15/06/2026, prompt: "Create Student and Administrator identity, profile, and authorization entities in backend/src/main/java/com/myus/entity/, following JPA conventions with appropriate field validations, relationships, and role-based fields for Student and Administrator", used to assist task T010 ("Create Student and Administrator identity, profile, and authorization entities in backend/src/main/java/com/myus/entity/"); AI generated skeleton entity classes (fields, annotations, and basic getters/setters), student reviewed and adjusted the field mappings, relationships, and validation constraints to match the project's database schema, then tested the entities against the SQL Server schema before committing.

# AI Usage Log Report 3
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

### PA4 document

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | ChatGPT | Assisted in formatting Markdown for the Revised Project Plan and updating Use-Case Specifications |
| Dương Minh Huỳnh Khôi | Gemini | Assisted in generating Mermaid diagram syntax and refining technical component descriptions for the C4 Component Diagram |
| Hoàng Trung Kiên | Gemini | Supported drafting Mermaid syntax for the C4 Deployment Diagram and organizing demo script documentation |
| Trần Tường Vi | Gemini | Assisted with Mermaid syntax for the C4 Container Diagram, and formatted Weekly Meeting Reports in Markdown |
| Lê Thị Như Ý | ChatGPT | Supported drafting Mermaid syntax for the C4 System Context Diagram and refining `tasks.md` |

---

### Code - Phase 4 (Part 2)

| Full Name | AI Tool | Purpose of Usage |
| :--- | :--- | :--- |
| Hồ Thị Như Ngọc | Copilot (VSCode) | Assisted in implementing file upload validation logic, multipart endpoint handling, and dropzone form state management for grade appeal submission (tasks T028, T029, T031) |
| Dương Minh Huỳnh Khôi | Copilot (VSCode) | Supported implementation of the AI Chatbot backend recommendation engine, transcript parsing logic, prompt context formatting, and interactive chatbot drawer UI (tasks T033–T037) |
| Hoàng Trung Kiên | Copilot (VSCode) | Assisted in building the centralized FAQ search endpoint, search filtering logic, and responsive FAQ library UI components (tasks T038, T039) |
| Trần Tường Vi | Copilot (VSCode) | Assisted in developing the appeal status tracking REST API, status transition mapping, and appeal tracking dashboard UI with deadline indicators (tasks T030, T032) |
| Lê Thị Như Ý | Copilot (VSCode) | Supported setting up Spec Kit task execution templates, test runner integration, and consolidating unit/integration test scaffolds for Phase 4 deliverables |

---

## 3. Appendix

- **Copilot Chat.** *GitHub Copilot Chat, Visual Studio Code*, accessed 14:20 on 01/08/2026, prompt: "Implement the backend AI Chatbot recommendation engine and REST endpoint in backend/src/main/java/com/myus/service/ai/impl/ChatbotService.java, including student transcript parsing, prerequisite checking against curriculum requirements, and generating personalized course suggestions with JSON payload formatting", used to assist tasks T033–T036 ("Profile & Progress Analysis engine and Chatbot REST controller"); AI generated initial service method signatures, prompt formatting templates, and response DTO schemas, student reviewed and refactored the logic to integrate with real database repositories, validated course prerequisite rules, added security role checks, and ensured error handling for incomplete student academic records before committing.
- **Gemini.** *Google Gemini*, accessed 10:45 on 29/07/2026, prompt: "Generate C4 Level 2 Container Diagram in Mermaid syntax for a web-based university portal (MyUS) comprising React Frontend, Spring Boot REST API Server, and SQL Server Database, highlighting container interactions, security protocols (HTTPS, JWT), and data flow", used to assist task R3 ("C4 Level 2 Container Diagram"); AI provided a baseline Mermaid container diagram structure, student reviewed and adjusted container boundaries, corrected API path labels, synchronized tech stack representations with project architecture, and embedded the diagram into the project documentation.

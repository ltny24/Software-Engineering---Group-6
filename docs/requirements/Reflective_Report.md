# Reflective Report — MyUS University Portal
Performed by: Lê Thị Như Ý | Reviewed by: All team | Edited by: Lê Thị Như Ý

**Course:** Software Engineering (NMCNPM)
**Team:** Group 6 — MyUS Portal Development Team
**Faculty:** Faculty of Information Technology, University of Science, VNU-HCM
**Submission Phase:** PA5 — Final Delivery

---

## 1. Team Experience

### 1.1 What Went Well

**Strong role clarity and task ownership.**
From the very first sprint, the team established a clear division of responsibilities: Dương Minh Huỳnh Khôi anchored the backend, Hoàng Trung Kiên led the frontend UI, Hồ Thị Như Ngọc managed QA and test case writing, Lê Thị Như Ý handled project management and shared services, and Trần Tường Vi coordinated data modeling, documentation, and technical alignment. This structure prevented task duplication and allowed each member to go deep into their area rather than spending time on role negotiations.

**Consistent documentation discipline.**
The team maintained AI usage logs across all three phases (PA2–PA4), weekly sprint reports, a team contract, and a revised project plan — all updated on a rolling basis rather than retroactively. This discipline made status reviews smooth and gave the team a clear audit trail of decisions made at each milestone.

**Effective sprint planning and rescoping.**
The team successfully rescoped mid-project when the administrator academic operations work proved larger than estimated. By moving Phase 5 tasks from Sprint 4 to Sprint 5 (documented in `Changes_PA3.md` and `Revised_Project_Plan_PA4.md`), the team avoided overcommitting and delivered a more stable product instead of rushing features that were not ready.

**Full-stack coherence.**
Despite covering 9 functional groups across two user roles and integrating a Gemini AI chatbot, the system maintained a consistent architecture: Spring Boot REST API on the backend, React 18 + TypeScript on the frontend, SQL Server via Docker, and JWT-based authentication throughout. The C4 architecture documents produced in PA4 proved valuable during implementation for keeping everyone aligned on component boundaries.

**Collaborative decision-making on use-case corrections.**
When reviewing the use-case model between PA2 and PA3, the team identified five significant modeling errors — including a misapplied `«include»` relationship and missing use cases — and corrected them systematically (documented in `Changes_PA3.md`). This willingness to critique and revise earlier work rather than defend it reflected strong professional maturity.

---

### 1.2 Challenges Faced

**Technology learning curve.**
Several members had limited prior experience with Spring Boot's security architecture (JWT filter chains, RBAC configuration) and with Tailwind CSS + PostCSS integration. The first two sprints involved a steep ramp-up, and early code had to be refactored after the team gained a clearer picture of how the layers fit together.

**Sprint 4 rescoping disruption.**
When it became clear that administrator academic operations (FG7–FG9) could not be completed within Sprint 4 alongside the grade appeal, AI chatbot, and FAQ modules, the team had to renegotiate deadlines and redistribute tasks. Although the rescoping was managed successfully, it added pressure to the Sprint 5 delivery window.

**AI chatbot integration complexity.**
Integrating the Gemini AI API for the personalized course recommendation chatbot (FG3) required significant backend work: parsing student transcripts, checking prerequisite rules, and formatting context-aware prompts. Early recommendation results were inaccurate when the prompt context was insufficiently structured, requiring several iterations to stabilize.

**Coordination overhead at peak load.**
With 9 functional groups, 5 members, and multiple concurrent deliverables (code + architecture diagrams + test cases + documentation), coordinating reviews before each submission created bottlenecks. The weekly report cycle helped, but the team would have benefited from more frequent, lighter-weight async check-ins during the heaviest delivery weeks.

**Cross-module integration testing.**
Because each functional group was developed largely in isolation, integration testing revealed unexpected edge cases — particularly between the grade appeal module, the appeal status tracking API, and the admin appeal processing view. These were caught during Sprint 5 QA, but earlier cross-module integration tests would have surfaced them sooner.

---

## 2. Spec Kit Experience

### 2.1 Benefits Observed

**Reduced ambiguity at implementation start.**
In traditional development, developers often begin coding with only a vague feature description, leading to rework when the final product diverges from stakeholder expectations. With Spec Kit, by the time a developer started implementing a feature, the expected inputs, outputs, edge cases, and UI prototype requirements were already documented. This significantly reduced back-and-forth during code review.

**Traceability from requirements to code.**
Each Spec Kit specification was traceable to a use-case ID (e.g., UC-04 for timetable, UC-07 for grade appeal), which in turn traced back to the Vision Document feature set. This three-layer traceability (Vision → Use Case → Spec → Code → Test) made it easy to verify that the implementation actually delivered what was promised in the requirements.

**Improved test case writing.**
The Tester (Hồ Thị Như Ngọc) found that writing test cases from a Spec Kit document was substantially easier than writing them from an informal description. The spec's explicit preconditions, basic flows, and alternative flows mapped directly to positive and negative test scenarios, reducing the effort needed to achieve good coverage.

**Onboarding acceleration.**
When a member needed to pick up a task in an unfamiliar module, the Spec Kit document gave them a standalone reference. They did not need to read commit history, ask the original developer, or reverse-engineer the code to understand what the feature was supposed to do.

**Living documentation.**
Because Spec Kit specs were updated alongside code changes (not written once and forgotten), they remained a reliable reference throughout the project — a significant improvement over the common pattern where requirements documents become stale within weeks.

---

### 2.2 Limitations Observed

**Upfront investment cost.**
Writing a complete Spec Kit specification before implementation is time-consuming. For smaller or exploratory features, the overhead of writing a full spec felt disproportionate to the feature's complexity. Traditional rapid prototyping would have been faster in those cases.

**Spec drift under deadline pressure.**
During Sprint 4 rescoping, some spec documents were updated reactively — after implementation had already been adjusted — rather than proactively. This partially defeated the specification-first principle and created a brief period where specs and code were out of sync.

**Limited tooling for spec validation.**
There was no automated way to verify that the implementation actually conformed to the spec. Conformance checking was done manually during code review, which is error-prone and relies on reviewer thoroughness. A tool that could parse Spec Kit documents and generate executable test scaffolds would have been highly valuable.

**Spec does not capture emergent design.**
Some design decisions — particularly around how the AI chatbot context window was structured and how the appeal deadline was calculated — emerged organically during implementation and were hard to capture in a pre-written spec. The spec format was better suited to well-understood CRUD operations than to algorithmically complex or AI-driven features.

**AI token limits constrained specification-assisted drafting.**
When using Claude and Gemini Pro to assist with writing or reviewing large spec documents, free-tier token quotas proved to be a practical bottleneck. Generating a complete spec for a complex functional group — including all flows, edge cases, and prototype descriptions — is a token-heavy task. On multiple occasions, members hit the free usage limit mid-session and had to wait for the quota to reset before continuing. This interrupted the spec drafting workflow and, under deadline pressure, sometimes led to specs being completed without AI assistance in later passes, reducing consistency. A course-sponsored or institutional AI access plan would significantly mitigate this friction.

**Comparison with Traditional Development:**
Traditional development (feature-description → code → post-hoc documentation) is faster at the start but accumulates technical and documentation debt rapidly. Spec Kit inverts this: it is slower to start but produces a codebase with higher long-term clarity, better testability, and a more reliable audit trail. For a project of this scale (9 functional groups, 2 roles, full-stack), the investment in Spec Kit clearly paid off in the later sprints when integration and QA work began.

---

## 3. AI Tools Usage

### 3.1 Tools Used

The team used five AI tools across the project lifecycle, each serving a distinct purpose and used at different phases. The two most heavily used tools were **Claude (Anthropic)** and **Google Gemini Pro**, which together handled the majority of document generation, test case drafting, and large-context feature scaffolding tasks.

#### Claude (Anthropic)
Claude was the most frequently used conversational AI tool in the project, primarily because of its strong long-context reasoning and its ability to generate coherent, structured output for complex multi-part tasks. Key uses included:
- **Functional group scaffolding (FG5–FG8):** Claude was used to generate initial implementation outlines, test case skeletons, and documentation drafts for the Feedback & Evaluation Survey (FG5), Admin Class Control (FG7), Admin Appeal Management (FG8), and Student Data Administration (FG9) modules — tasks that involved both backend and frontend components and required understanding of the broader system context.
- **Test case generation:** Claude produced structured test case documents (preconditions, steps, expected results) for multiple functional groups, which members then reviewed and adapted to match the actual implemented behavior.
- **Code review and refactoring suggestions:** When members encountered logic errors or code smell in existing implementations, Claude was consulted to suggest refactored alternatives that preserved existing behavior while improving readability.
- **Spec alignment checks:** Claude was used to compare a spec document against a partially implemented feature and identify gaps or discrepancies, acting as a lightweight informal conformance checker.

#### Google Gemini Pro
Gemini Pro was the second most heavily used tool, valued for its tight integration with Google Workspace and its strong performance on structured document and diagram tasks. Key uses included:
- **Mermaid diagram generation:** Members prompted Gemini Pro to produce baseline Mermaid syntax for the C4 System Context, Container, Component, and Deployment diagrams produced in PA4. Gemini Pro provided structurally valid starting diagrams that members then corrected for tech stack accuracy, label precision, and relationship semantics.
- **Functional group document drafting (FG5–FG8):** Alongside Claude, Gemini Pro contributed to generating initial documentation outlines and content for the later functional groups, particularly for the admin-side modules where requirements were more complex.
- **Markdown document drafting:** For formal project documents (Weekly Reports, Vision Document sections, Revised Project Plan), Gemini Pro helped draft initial paragraph-level content from bullet-point outlines. All generated content was reviewed and substantially rewritten before being committed.
- **AI Usage Log formatting:** Gemini Pro assisted in formatting the AI usage log tables and structuring the appendix entries consistently across `AI_Usage_Log.md`, `AI_Usage_Log_2.md`, and `AI_Usage_Log_3.md`.

#### GitHub Copilot (VSCode Extension)
GitHub Copilot was the team's primary inline coding assistant, used by all five members throughout Sprints 2–5. Copilot operates as a real-time autocompletion engine directly inside VSCode. Its main strengths in this project were:
- **Backend scaffolding:** Generating JPA entity class skeletons (field declarations, annotations, basic getters/setters) for the `entity/` package, reducing repetitive boilerplate across 20+ entity files.
- **Controller and service patterns:** Suggesting standard Spring Boot controller method signatures and service interface implementations consistent with the existing project structure.
- **Frontend component stubs:** Producing initial React component shells (props interface, JSX structure, basic hooks) that matched the naming and style conventions already in the codebase.
- **Test scaffolding:** Generating JUnit and Vitest test class outlines with standard `@BeforeEach`, mock declarations, and test method stubs, which testers then filled with specific assertions.

Copilot was used under Copilot Chat mode for larger tasks — such as the AI chatbot recommendation engine (tasks T033–T037) and the grade appeal file upload endpoint (tasks T028–T031) — where members submitted detailed prompt descriptions and refined the generated code before committing.

#### ChatGPT Plus (OpenAI)
ChatGPT Plus (GPT-4o) was used by Dương Minh Huỳnh Khôi for tasks where strong natural language generation quality and a long context window were beneficial:
- **Use-Case Specification drafting:** ChatGPT Plus helped structure and improve Use-Case Specification document sections, particularly in refining alternative flows and exception conditions, which required careful natural language precision.
- **Technical English review:** For sections of the Vision Document and Use-Case Spec intended for English-speaking evaluators, ChatGPT Plus improved sentence-level clarity and technical accuracy without altering the underlying content.
- **Mermaid diagram syntax:** ChatGPT Plus generated Mermaid syntax for the Use-Case Model diagrams, including the corrected `«include»` and `«extend»` relationships introduced during the PA3 revision cycle.

ChatGPT Plus's multi-turn conversational ability made it well-suited for iterative document refinement tasks where multiple rounds of revision were needed.

#### Summary of Tool Roles

| Tool | Primary Use | Members |
|---|---|---|
| Claude (Anthropic) | FG5–FG9 scaffolding, test case generation, spec alignment | All 5 members |
| Google Gemini Pro | Mermaid diagrams, FG5–FG8 doc drafting, Markdown formatting | All 5 members |
| GitHub Copilot (VSCode) | Inline code suggestions, boilerplate, test stubs | All 5 members |
| ChatGPT Plus (GPT-4o) | Use-case spec drafting, English review, diagram syntax | Dương Minh Huỳnh Khôi |

All AI usage was governed by the team's five AI Usage Rules (transparency, specificity, responsibility, data privacy, sync frequency) and fully logged in `docs/management/AI_Usage_Log*.md`.

---

### 3.2 Effective Aspects

**Scaffolding and boilerplate generation.**
Copilot excelled at generating project structure scaffolding: the Spring Boot project skeleton (task T001), React frontend skeleton (task T002), entity class boilerplate, and DTO schemas were all accelerated significantly. This freed developers to focus on domain logic rather than repetitive setup.

**Mermaid diagram drafting.**
AI tools (primarily Gemini) were effective at generating initial Mermaid syntax for C4 diagrams. The generated diagrams required review and correction, but they provided a usable starting point that was faster than writing Mermaid from scratch. This was especially valuable for the C4 Level 2 Container Diagram and the Deployment Diagram.

**Reducing syntax errors.**
Copilot's in-editor suggestions caught many common Java and TypeScript syntax issues in real time, reducing the number of compilation errors and linting violations that reached code review.

**Document formatting and Markdown structure.**
For members less comfortable with Markdown, Gemini and ChatGPT Plus were helpful in structuring headings, tables, and code blocks consistently across documents. This contributed to the professional quality of the project's documentation artifacts.

**Complex feature bootstrapping.**
For the AI chatbot backend (tasks T033–T037), Copilot generated initial service method signatures, prompt formatting templates, and response DTO schemas. While the generated code required substantial reworking to integrate with the actual database and security context, it gave the developer a concrete starting point that reduced cognitive load on a complex, open-ended task.

**Multi-turn refinement with ChatGPT Plus.**
For use-case specifications and English-language documentation, ChatGPT Plus's ability to hold extended conversation context and iteratively refine a document across multiple prompts was distinctly more effective than single-shot generation. Members could provide incremental feedback ("make this more formal", "split this into two sub-flows") and receive coherent revisions without losing earlier context.

---

### 3.3 Limitations Encountered

**Domain blindness.**
AI tools had no knowledge of the project's specific domain rules — prerequisite curriculum requirements, appeal deadline policies, GPA calculation formulas. Any code that involved these rules had to be written or heavily rewritten manually. Prompting AI with enough context to handle domain-specific logic was often more effort than writing the logic directly.

**Hallucinated API shapes.**
When asked to generate code that consumed the project's own backend API, Copilot occasionally invented plausible but incorrect response shapes, field names, or HTTP status codes. Every AI-generated API integration had to be validated against the actual endpoint before merging.

**Inconsistent output quality.**
The quality of Copilot suggestions varied significantly depending on how well the surrounding code context was structured. In files that followed clear, consistent patterns (e.g., JPA repositories, standard controllers), suggestions were highly accurate. In more novel files (e.g., the chatbot service, the transcript parser), suggestions were often incorrect or too generic to be useful.

**No architectural awareness.**
AI tools operated at the file level and had no awareness of cross-module concerns: security role enforcement, transaction boundaries, or how data flowed between the frontend state manager (Zustand) and the backend. Architectural decisions had to be made by the team without meaningful AI assistance.

**Free-tier token quotas caused workflow interruptions.**
Claude and Gemini Pro were the most used tools for heavy-context tasks, but both operate under free-tier token limits that proved insufficient for sustained work sessions. Generating test cases for a full functional group, reviewing a large spec document, or scaffolding a multi-layer feature (backend service + controller + frontend component) in a single session regularly consumed the available quota. Members frequently had to pause mid-task and wait for token limits to reset — sometimes hours — before they could continue. This was particularly disruptive during Sprint 4 and Sprint 5, when multiple members needed AI assistance simultaneously under tight deadlines. Accessing paid or institutionally sponsored plans for these tools would substantially improve the workflow.

**Ethical and academic integrity discipline.**
The team adopted strict AI usage rules (transparency, specificity, responsibility) from the beginning. Enforcing these rules — particularly the requirement that all usage be logged with specific prompts and that members take full responsibility for AI-assisted code — added overhead but was the right approach. Without these rules, AI assistance could easily have crossed into substitution rather than augmentation.

---

## 4. SDLC Feedback

### 4.1 What Worked Well in the Current SDLC

The PA-based milestone structure (PA1 → PA5) provided clear checkpoints that kept the team on pace throughout the semester. Each PA had a focused scope (proposal → plan → use cases → architecture → delivery), which forced the team to think through requirements, design, and testing in a disciplined sequence rather than jumping straight to code.

The Spec Kit workflow was a meaningful pedagogical addition. Specification-driven development is an industry-relevant practice that most students would not encounter in a standard course, and working with it hands-on — with real deadlines and a real codebase — produced deeper learning than a purely theoretical treatment would have.

---

### 4.2 Suggested Improvements

**4.2.1 Earlier Spec Kit introduction with scaffolding templates.**
Teams received the Spec Kit methodology relatively late in the course. As a result, the first specs were rough and required significant revision. Introducing Spec Kit in PA2 or PA3 with ready-made templates and at least one worked example (a complete spec for a simple feature) would reduce the initial learning overhead and improve spec quality from the first attempt.

**4.2.2 Automated spec-to-test scaffolding tool.**
The current process requires developers to manually verify that implementation conforms to the spec, and requires testers to manually translate spec flows into test cases. A lightweight toolchain that parses Spec Kit documents and generates executable test scaffolds (even just skeleton test files with scenario names) would close this gap and make the specification-driven workflow much more powerful.

**4.2.3 Formal architecture review checkpoint before implementation begins.**
In PA4, the team submitted architecture documents (C4 diagrams) and began implementation in parallel. This meant that some implementation decisions were made before the architecture was validated, leading to minor inconsistencies between the documented design and the actual system. Adding a brief formal architecture review session — where the instructor or TAs review the C4 diagrams and flag concerns before Sprint 4 begins — would improve design quality.

**4.2.4 Cross-team peer review on use-case models.**
Use-case models in PA3 were reviewed only within the team, which created a blind spot: the team could not easily see modeling errors that made internal sense but violated UML conventions or requirements logic. A structured peer-review exchange where teams review each other's use-case models (even asynchronously) would surface these errors before submission.

**4.2.5 Integration testing milestone in the SDLC.**
The current PA structure focuses on unit-level correctness through test cases, but there is no explicit integration testing milestone. For projects with multiple functional groups and a shared API layer, integration failures are a significant risk. Adding an integration testing checkpoint in PA4 or early PA5 — with a required artifact (integration test plan and results) — would push teams to catch cross-module issues earlier.

**4.2.6 More flexibility in AI usage logging format.**
The current AI usage log requires per-entry specificity (tool, task ID, prompt excerpt). This is pedagogically sound but administratively burdensome when AI tools are used iteratively across many small interactions. Allowing a lightweight "session log" format (date, member, tool, general area of work, brief note) would reduce friction while preserving the transparency intent.

**4.2.7 Clearer grading criteria for PA3 Use-Case Specs.**
The grading rubric for PA3 use-case specifications was interpreted differently by different team members, leading to inconsistencies in how alternative flows and prototype requirements were documented across different use cases. Publishing a rubric with concrete "good" and "needs improvement" examples — perhaps from anonymized submissions of prior cohorts — would produce substantially more consistent work.

---

## 5. Individual Contributions

### Hồ Thị Như Ngọc — Tester (MSSV: 24127089)

Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc

As Tester throughout the project lifecycle, I ensured quality by leading QA activities, authoring test cases, producing bug reports, and updating the Use-Case Specification and Project Plan.

On the technical implementation side, I developed full-stack features for the Grade Appeal System, including submission endpoints, file validation, and the frontend UI. Furthermore, I implemented unit and integration tests for both backend (JUnit/Mockito) and frontend (Vitest/Testing Library) for multiple functional groups (FG5, FG7, FG8, FG9).

Through these responsibilities, I gained practical experience in software testing frameworks and full-stack development. This end-to-end experience helped me realize the critical importance of rigorous quality assurance and clear documentation, while enhancing my skills in identifying bugs and successfully delivering a reliable software product following Specification-Driven Development.
---

### Dương Minh Huỳnh Khôi — Backend Developer (MSSV: 24127192)

Performed by: Dương Minh Huỳnh Khôi | Reviewed by: Lê Thị Như Ý | Edited by: Dương Minh Huỳnh Khôi

As Backend Developer, my primary responsibility was building the core backend foundation of the MyUS system and authoring the Vision Document (Part 6).

On the technical side, I implemented the Spring Boot skeleton, JWT authentication, role-based access control, and core APIs for courses and enrollment. In PA3, I developed the complete backend for the Grade Appeal System, while also contributing to system architecture diagrams, AI Chatbot integration, and UI features for Functional Groups 6-7.

Through these responsibilities, I gained practical experience in backend architecture, REST API design, and AI-assisted integration. This work helped me understand how backend services, component design, and API coordination connect together to deliver a reliable university portal following Spec-Driven Development.
---

### Hoàng Trung Kiên — Frontend Developer (MSSV: 24127194)

*Performed by: Hoàng Trung Kiên | Reviewed by: Lê Thị Như Ý | Edited by: Hoàng Trung Kiên*

As a Developer throughout the project lifecycle, my primary responsibilities focused on system analysis, full-stack software implementation for assigned functional groups (particularly Support & FAQ and Student Data Administrator), and technical documentation. In addition, I worked on the Deployment Diagram and Use-Case Specification to ensure system design remained consistent with defined requirements.

Technically, I developed UI, service logic, and data access components, while handling cross-layer debugging to ensure seamless compatibility with the MyUS architecture. 

Through these responsibilities, I gained practical experience in full-stack development, system architecture, and software integration. This experience highlighted the importance of maintaining consistency across requirements, implementation, and documentation while delivering features following Specification-Driven Development.

---

### Trần Tường Vi — Team Leader / Data Analyst (MSSV: 24127586)

As Team Leader and Data Analyst throughout the entire project lifecycle from PA1 to PA5, I systematically coordinated weekly sprint milestones, took charge of updating key management and requirement documentation, and designed normalized database schemas with mock data for core academic entities. 

On the technical implementation side, I developed backend REST APIs for **Student Profile Management** and **Tuition & Finance**, implemented full-stack features (both backend APIs and frontend UI components) for **Grade Appeal Tracking**, and fixed component integration bugs across five initial functional groups prior to the implementation of the remaining functional groups. 

Through these responsibilities, I gained practical experience in relational database modeling and structuring efficient data mappings between backend services and UI components. Furthermore, this end-to-end experience helped me realize the critical importance of clear project documentation, while enhancing my skills in aligning cross-functional team roles, eliminating integration bottlenecks, and successfully delivering a high-quality software product following Specification-Driven Development.
---

### Lê Thị Như Ý — Project Manager (MSSV: 24127595)

As Project Manager, my primary responsibility was coordinating team efforts, managing schedules, and ensuring deliverables met quality standards, while also taking on significant technical contributions in both testing and development. 

On the QA side, I wrote the complete test case documentation and implemented both backend and frontend unit tests for multiple core functional groups (FG1-FG4, FG6). On the development side, I implemented FG5 (Feedback & Evaluation Survey) and FG8 (Admin Appeal Management), and contributed to cross-module bug fixing during PA3.

Through these responsibilities, I gained practical experience in project management, automated testing, and full-stack software development. Balancing management duties with this volume of technical work taught me to prioritize ruthlessly under time constraints and to rely on the team's shared documentation to stay synchronized without micromanaging.

---

*Report prepared by Group 6 — MyUS Portal Development Team*
*Faculty of Information Technology, University of Science, VNU-HCM*
*August 2026*

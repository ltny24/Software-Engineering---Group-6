# Directory and File Structure

* **docs/**: Project documentation.
  * **analysis-and-design/**: System architecture, container/component, and deployment diagrams.
    * `Section_B_System_Architecture.md`: System architecture specification.
    * `Section_C_Container_and_Component_Diagram.md`: Container and component diagrams.
    * `Section_D_Deployment_Diagram.md`: System deployment diagram.
  * **management/**: Project management and progress tracking documents.
    * `Team Contract/`: Team contract and working guidelines.
    * `Weekly Report/`: Weekly progress reports (includes Sprint 1, Sprint 2, Sprint 3, Sprint 4).
    * `AI_Usage_Log.md` / `AI_Usage_Log_2.md` / `AI_Usage_Log_3.md`: AI usage logs across project phases.
    * `Changes.md` / `Changes_PA3.md`: Revision logs and changes tracking.
    * `Project_Plan.md` / `Revised_Project_Plan.md` / `Revised_Project_Plan_PA4.md`: Project plans and milestone revisions.
  * **requirements/**: System requirement specification documents.
    * `Prototype_Req/`: UI prototypes and screenshots referenced in Use Case specifications.
    * `spec_specification/`: Detailed feature specification documents (includes `001 - timetable`, `002 - grade`, `003 - tuition`, `004 - submit grade appeal`, `005 - track appeal status`, `006 - AI Chatbot`).
    * `Vision_Document.md` / `Detailed_Vision_Document.md`: System vision and scope documentation.
    * `Project_Proposal.md`: Initial project proposal.
    * `UseCase_Specification.md` / `Revised_UseCase_Specification.md`: Detailed Use Case specifications.
    * `Use_Case_Model.md` / `Revised_Use_Case_Model.md`: Use Case models and relationships.
  * **survey/**: User survey data and responses (includes BK, HCMUS, UEH surveys and `Survey.md`).
  * **test/**: Test plans, test cases, and test reports structured by feature groups (`fg01` through `fg09`).
* **src/**: Project source code and application assets.
  * **SpecKit/**: Files and configurations related to SpecKit specification generator.
    * `.specify/`: SpecKit configuration and memory data.
    * `Brief_Summary/`: Team summary of SpecKit setup.
    * `specs/001-university-portal/`: Generated specifications (`data-model.md`, `plan.md`, `quickstart.md`, `research.md`, `spec.md`, `tasks.md`, `checklists/`, `contracts/`).
  * **backend/**: Spring Boot backend application (REST API, SQL schema scripts, mock data, Flyway migrations).
  * **frontend/**: React + TypeScript frontend application (Tailwind CSS, Zustand, Axios).
  * **tests/**: Automated testing scripts and suite.
  * `README_WEB.md`: Developer guide and documentation for the web platform.

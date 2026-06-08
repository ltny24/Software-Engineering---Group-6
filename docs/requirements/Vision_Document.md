## 5. Product Features
*Performed by: Lê Thị Như Ý | Reviewed by: Trần Tường Vi | Edited by: Lê Thị Như Ý*

### 5.1. Feature Descriptions

**1. Profile & Account Management**
This feature allows students to independently manage and update their personal information, contact details, and emergency contacts within the portal. It is needed to ensure that the university's central database remains highly accurate and up-to-date without requiring manual data entry by the administration. Students benefit by never missing critical academic announcements, while the university benefits from a reliable communication channel.

**2. Grade Appeal System for Students**
Students can digitally submit requests to review their exam grades and continuously track the real-time processing status of their appeals. This feature is necessary to replace the slow, error-prone paper-based petition process and provide clear deadlines for fee payments. Students benefit from a transparent, stress-free process, eliminating the need for repeated, time-consuming visits to the academic office.

**3. Course Enrollment & AI Chatbot**
This module enables students to self-enroll in standard classes while utilizing an intelligent virtual assistant to suggest optimal academic roadmaps. It is required because manual course selection often leads to frustrating scheduling conflicts, prerequisite misunderstandings, and delayed graduation. Students benefit by receiving personalized guidance to stay on track, while the university benefits from optimized class size distribution.

**4. Academic & Financial Tracking**
This comprehensive dashboard aggregates a student's academic performance, daily class timetables, and detailed financial status including tuition balances and deadlines. It is essential to promote transparency and help users effectively plan their daily schedules and prepare for financial obligations. Students and their families are the primary beneficiaries, as it removes the stress of tracking scattered information across multiple disconnected systems.

**5. Feedback & Evaluation Surveys**
At the end of each semester, students can access and complete structured surveys to evaluate course quality, lecturer performance, and campus facilities. This feature is needed to provide the university with measurable, structured feedback to continuously improve the learning environment. The administration benefits from gathering actionable data, while students benefit from having a voice in shaping their educational experience.

**6. Centralized Support & FAQ**
This feature provides a comprehensive, searchable library containing common questions and answers regarding university policies, academic rules, and IT support. It is highly needed to offer students instant, 24/7 answers to routine issues, significantly reducing the volume of repetitive support tickets. Students benefit from immediate problem resolution, while the support staff benefits from a drastically reduced administrative workload.

**7. Admin Bulk Data & Class Control**
Administrators can utilize file upload capabilities to quickly import massive volumes of system data (such as student profiles and course offerings) and manually execute student class transfers. This is urgently needed to eliminate the error-prone and labor-intensive process of manual data entry for thousands of records each semester. Administrators heavily benefit from a massive reduction in operational workload and increased flexibility in managing unexpected scheduling conflicts.

**8. Appeal Processing Management**
This centralized dashboard provides administrators with the tools to receive, review, and process incoming student grade appeal requests efficiently. It is needed to create a structured and traceable workflow, allowing staff to update statuses and assign specific deadlines for fee payments directly to the student. The academic office benefits from an organized, paperless system that prevents lost documents and significantly speeds up resolution time.

**9. Student Data Administration**
Administrators are granted privileged access to search and view comprehensive student profiles, including personal details, academic standing, and contact information. This capability is crucial for verifying student identities, contacting families during emergencies, and providing direct, accurate support when students face issues. The administrative and academic staff benefit by having immediate access to reliable data to make informed operational decisions.


### 5.2. Core User Workflows

Below are the workflow diagrams illustrating the two most critical processes in the system[cite: 1].

#### Workflow 1: Grade Appeal Process

```mermaid
flowchart TD
    classDef student fill:#e8eef7,stroke:#1f497d,stroke-width:2px,color:#000
    classDef admin fill:#f9f2e4,stroke:#e36c09,stroke-width:2px,color:#000
    classDef system fill:#f2f2f2,stroke:#7f7f7f,stroke-width:2px,color:#000

    A([Student logs into Portal]):::student --> B[Fills out Grade Appeal Form]:::student
    B --> C{System validates data}:::system
    C -- Invalid --> B
    C -- Valid --> D[Status: Pending]:::system
    D --> E[Admin receives notification]:::admin
    E --> F{Admin reviews request}:::admin
    F -- Reject --> G[Status: Rejected / Notify Student]:::system
    F -- Approve --> H[Admin sets Fee Payment Deadline]:::admin
    H --> I[Status: Processing / Notify Student]:::system
    I --> J([Student visits office to pay fee]):::student
```
#### Workflow 2: AI-Assisted Course Registration
```mermaid
flowchart TD
    classDef student fill:#e8eef7,stroke:#1f497d,stroke-width:2px,color:#000
    classDef ai fill:#e4f9e8,stroke:#2ca02c,stroke-width:2px,color:#000
    classDef system fill:#f2f2f2,stroke:#7f7f7f,stroke-width:2px,color:#000

    S1([Student opens Enrollment Module]):::student --> S2[Student interacts with AI Chatbot]:::student
    S2 --> A1[AI analyzes completed credits & major]:::ai
    A1 --> A2[AI suggests optimal Course Roadmap]:::ai
    A2 --> S3{Student accepts suggestion?}:::student
    S3 -- No --> S4[Student manually selects courses]:::student
    S3 -- Yes --> S5[Auto-fill Registration Cart]:::system
    S4 --> S5
    S5 --> S6{System checks prerequisites & schedule}:::system
    S6 -- Conflict Found --> S2
    S6 -- All Clear --> S7([Registration Successful / Update Timetable]):::system
```
#### Workflow 3: Admin Bulk Data Import Process

```mermaid
flowchart TD
    classDef admin fill:#f9f2e4,stroke:#e36c09,stroke-width:2px,color:#000
    classDef system fill:#f2f2f2,stroke:#7f7f7f,stroke-width:2px,color:#000

    A([Admin accesses Data Management]):::admin --> B[Uploads Excel/CSV file]:::admin
    B --> C{System parses & validates data}:::system
    C -- Data Format Error --> D[Generate Error Log]:::system
    D --> E[Admin reviews and corrects file]:::admin
    E --> B
    C -- Validation Passed --> F[Update Database records]:::system
    F --> G([Display Success Message]):::system
```

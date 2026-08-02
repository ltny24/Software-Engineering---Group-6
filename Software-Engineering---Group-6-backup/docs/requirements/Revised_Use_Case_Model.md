# MyUS Portal — Use-Case Model
*Performed by: Hồ Thị Như Ngọc | Reviewed by: Lê Thị Như Ý | Edited by: Hồ Thị Như Ngọc*

---

## 1. Overall System & Actor Generalization
This diagram illustrates the high-level actors interacting with the MyUS portal. Both Student and Administrator inherit from the generalized abstract `User` actor, allowing them to share foundational use cases such as Authentication. All 9 core functional groups from the Vision Document are represented here, each labeled with its corresponding Use-Case Specification ID(s) for full traceability.

```mermaid
flowchart TB
    %% Actors
    Student(["Student"])
    Admin(["Administrator"])
    User(["User (Abstract)"])

    %% Actor Generalization
    Student -.->|inherits| User
    Admin -.->|inherits| User

    %% System Boundary
    subgraph MyUS [MyUS Portal - High Level Overview]
        direction TB
        UC_Auth("(Authenticate / Login — UC-01)")

        %% Student Main UCs
        UC1("(1. Manage Profile & Account — UC-02)")
        UC2("(2. Grade Appeal System — UC-07, UC-08)")
        UC3("(3. Course Enrollment — UC-03)")
        UC4("(4. Academic & Financial Tracking — UC-04, UC-05, UC-06)")
        UC5("(5. Submit Evaluation Surveys — UC-09)")
        UC6("(6. Access FAQs & Support — UC-10)")

        %% Admin Main UCs
        UC7("(7. Admin Bulk Data & Class Control — UC-11)")
        UC8("(8. Appeal Processing Management — UC-12)")
        UC9("(9. Student Data Administration — UC-13)")
    end

    %% Base relationships
    User --> UC_Auth

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
```

## 2. Student Subsystem (Academic Self-Service & Support)
This diagram isolates the workflows specific to the Student actor, focusing on academic self-management, financial tracking, and support interactions. To accurately reflect the business logic confirmed in the Use-Case Specification, this model applies structural relationships strictly — an «include» is used only where the sub-process is a *mandatory* step that always executes, and independently-invokable use cases are connected directly to the Student actor instead.

- **«extend» Relationship:** The interaction with the external **AI Engine** during course enrollment is modeled as an extension (**Get AI Course Recommendations**, UC-03b). This indicates that AI consultation is an optional, value-adding feature that students can trigger to optimize their roadmap, rather than a mandatory step in the standard enrollment process.

- **«include» Relationships:** Complex workflows are decomposed into mandatory sub-processes.
  - **Submit Grade Appeal (UC-07)** includes **Upload Supporting Documents (UC-07a)**, since an appeal cannot be submitted without at least one supporting attachment (spec §3.1, step 4).
  - **Academic & Financial Tracking** includes the retrieval of the student's **timetable** (UC-04), **GPA records** (UC-05), and **tuition balance** (UC-06) — per Vision Doc AC-01.2, all three are essential components displayed together on the student dashboard.

- **Corrected relationship:** **Track Appeal Status (UC-08)** is *not* an «include» of Submit Grade Appeal. Per the spec, a student reaches it independently via "My Appeals" at any time after submission, not as a mandatory step of every submission. It is modeled here as a direct, sibling use case within the same Feature 2 (Grade Appeal System) boundary.

 ```mermaid
flowchart LR
    %% Actors
    Student(["Student"])
    AI(["AI Engine (External)"])

    %% System Boundary
    subgraph Student_Subsystem [Student Subsystem]
        direction TB

        UC1("(1. Manage Profile & Account — UC-02)")

        UC2("(2. Submit Grade Appeal — UC-07)")
        UC2a("(Upload Supporting Documents — UC-07a)")
        UC2b("(Track Appeal Status — UC-08)")

        UC3("(3. Course Enrollment — UC-03)")
        UC3a("(Check Prerequisites — UC-03a)")
        UC3b("(Get AI Course Recommendations — UC-03b)")

        UC4("(4. Academic & Financial Tracking)")
        UC4a("(View Timetable — UC-04)")
        UC4b("(View Grades & GPA — UC-05)")
        UC4c("(Track Tuition Fee — UC-06)")

        UC5("(5. Submit Evaluation Surveys — UC-09)")

        UC6("(6. Access FAQs & Support — UC-10)")
    end

    %% Actor Connections
    Student --> UC1
    Student --> UC2
    Student --> UC2b
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    AI --- UC3b

    %% Relationships
    UC2 -.->|"«include»"| UC2a

    UC3 -.->|"«include»"| UC3a
    UC3b -.->|"«extend»"| UC3

    UC4 -.->|"«include»"| UC4a
    UC4 -.->|"«include»"| UC4b
    UC4 -.->|"«include»"| UC4c
```
## 3. Administrator Subsystem (Operations & Processing)
This diagram details the exclusive back-office operations performed by the Administrator role, which are critical for maintaining system data integrity and handling student requests. The model uses «include» relationships to define strict, mandatory operational procedures, and has been extended to cover the manual class-transfer capability required by the Vision Document but previously absent from the model:

- When executing **Admin Bulk Data & Class Control (UC-11)**, importing data always includes the **Validate Data Format (UC-11.2)** use case, to ensure that imported CSV/Excel files do not corrupt the database schema. The same feature also encompasses **Perform Student Class Transfer (UC-11.3)** — an alternative operation on the same Class Control page, added per Vision Doc Feature 7 ("manually execute student class transfers") and AC-05.3.

- During **Appeal Processing Management (UC-12)**, the workflow explicitly includes **Set Fee Payment Deadline (UC-12.1)** and **Update Appeal Status (UC-12.2)**. This guarantees that whenever an administrator processes a grade review, the system enforces a standardized administrative trail, ensuring transparency and automated notifications for the student.

```mermaid
flowchart LR
    %% Actors
    Admin(["Administrator"])

    %% System Boundary
    subgraph Admin_Subsystem [Administrator Subsystem]
        direction TB

        UC7("(7. Admin Bulk Data & Class Control — UC-11)")
        UC7a("(Import Student/Course Data — UC-11.1)")
        UC7b("(Validate Data Format — UC-11.2)")
        UC7c("(Perform Student Class Transfer — UC-11.3)")

        UC8("(8. Appeal Processing Management — UC-12)")
        UC8a("(Set Fee Payment Deadline — UC-12.1)")
        UC8b("(Update Appeal Status — UC-12.2)")

        UC9("(9. Student Data Administration — UC-13)")
        UC9a("(Search Student Records — UC-13.1)")
    end

    %% Actor Connections
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9

    %% Relationships
    UC7 -.->|"«include»"| UC7a
    UC7 -.->|"«include»"| UC7c
    UC7a -.->|"«include»"| UC7b

    UC8 -.->|"«include»"| UC8a
    UC8 -.->|"«include»"| UC8b

    UC9 -.->|"«include»"| UC9a
```

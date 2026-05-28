## 3. Key Features and Functional Groups
*Performed by: Lê Thị Như Ý | Reviewed by: Hoàng Trung Kiên | Edited by: Lê Thị Như Ý*

### 3.1. System Use Case Diagram

```
flowchart LR
    classDef actor fill:#1f497d,stroke:#0f243e,stroke-width:2px,color:#fff,font-weight:bold,rx:5
    classDef usecase fill:#f2f2f2,stroke:#7f7f7f,stroke-width:1px,color:#000
    classDef sysBound fill:none,stroke:#000000,stroke-width:2px,stroke-dasharray: 5 5
    classDef module fill:#e8eef7,stroke:#1f497d,stroke-width:1px,color:#1f497d,stroke-dasharray: 3 3

    ST[" Student"]:::actor
    TC[" Teaching Staff"]:::actor
    AD[" Administrator"]:::actor

    subgraph LMS["University Portal System"]
        
        subgraph M1["Profile & Account"]
            UC1([Update Profile]):::usecase
        end
        subgraph M2["Request Processing"]
            UC2([Submit Academic Requests]):::usecase
            UC2_1([View Pending Requests]):::usecase
            UC3([Draft Request via AI]):::usecase
        end
        subgraph M3["Course Enrollment"]
            UC4([Register Courses]):::usecase
            UC5([Get AI Schedule Suggestion]):::usecase
        end
        subgraph M4["Academic & Financial Mgt"]
            UC6([View Grades & GPA]):::usecase
            UC7([View Timetable]):::usecase
            UC8([Track Tuition Fee]):::usecase
        end
        subgraph M5["Feedback & Evaluation"]
            UC9([Submit Survey & Wishlist]):::usecase
        end
        subgraph M6["Support & FAQ"]
            UC10([Access FAQs]):::usecase
        end
        subgraph M7["Staff Operations"]
            UC11([Register Teaching Availability]):::usecase
            UC12([View Teaching Schedule]):::usecase
        end
        subgraph M8["Admin Class Control"]
            UC13([Upload Master Schedule]):::usecase
            UC14([Manage Class Transfers]):::usecase
        end
        subgraph M9["Request Management"]
            UC15([Process Student Requests]):::usecase
        end
    end
    
    class LMS sysBound
    class M1,M2,M3,M4,M5,M6,M7,M8,M9 module

    %% Standard links to fix GitHub Lexical Error
    ST --> UC1 & UC2 & UC2_1 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9 & UC10
    TC --> UC10 & UC11 & UC12
    AD --> UC13 & UC14 & UC15
```

The system is designed for three main users: Students, Teaching Staff, and Administrators. It is divided into 9 functional groups to make university operations easier to manage.

### ACTOR 1: STUDENT 

#### Functional Group 1: Profile & Account Management
* **Student Profile Update:** This feature allows students to independently manage and update their personal information, contact details, and emergency contacts. Keeping this data current ensures seamless communication between the university and the student, preventing missed announcements or administrative errors.

#### Functional Group 2: Request & Certificate Processing
* **Application Submission:** Students can digitally submit academic petitions (such as transcript requests, grade appeals, or leave of absence) and attach necessary documents directly through the portal. This eliminates the need for physical paperwork and significantly reduces waiting times at the administrative office.
* **View Pending Requests:** This tracking feature provides a visual dashboard where students can monitor the real-time processing status of their submitted documents (e.g., Pending, Under Review, Approved). It promotes administrative transparency and reduces the need to contact staff for updates.
* **AI-Assisted Request Drafting:** Using AI, this tool automatically generates formal, properly formatted request letters based on simple keywords or short sentences provided by the student. It helps students express their needs professionally and avoids application rejections due to incorrect formatting.

#### Functional Group 3: Course Enrollment System
* **Standard & Specialized Course Registration:** This core module enables students to browse available subjects, check prerequisite conditions, and self-enroll in classes for the upcoming semester. It gives students full control over their academic progression and graduation timeline.
* **AI-Powered Schedule Suggestion:** The system analyzes the student's required courses and automatically recommends the most optimal weekly timetable. This smart feature helps students easily avoid overlapping classes, balances their workload, and saves significant time in manual planning.

#### Functional Group 4: Academic & Financial Management
* **Grade Viewing & GPA Calculation:** Students can access a detailed breakdown of their academic performance, including midterms, assignments, and final scores. The system also displays an automatically updated cumulative GPA to help students closely track their learning progress.
* **Timetable & Exam Scheduling:** This feature aggregates all registered courses and upcoming exams into a clear, personalized calendar. It displays exact class times and room locations, keeping students organized so they never go to the wrong room or miss an exam.
* **Tuition Fee Tracking:** Users can view a comprehensive breakdown of their financial status, including tuition balances, applied scholarships, payment history, and impending deadlines. This financial transparency helps students and their families plan their payments effectively.

#### Functional Group 5: Feedback & Evaluation
* **Surveys & Course Wishlist:** Students can evaluate their courses at the end of the semester and suggest specific elective subjects they wish to take in the future. This provides the university with valuable feedback to improve teaching quality and helps forecast class demand accurately.

#### Functional Group 6: Support & FAQ
* **Centralized FAQ Access:** A comprehensive, searchable library containing common questions and answers about university policies, academic rules, and IT support. This allows students to find instant solutions independently without waiting for helpdesk responses.


### ACTOR 2: TEACHING STAFF 

#### Functional Group 7: Staff Teaching Operations
* **Teaching Availability Registration:** Lecturers can securely log in to declare their free time, preferred teaching days, and campus preferences before the new semester begins. This helps the administration create a master schedule that respects the teachers' research and personal commitments.
* **Instructor Schedule Management:** Teachers can access their finalized weekly timetables, complete with student class lists and assigned room locations. This ensures instructors have all the necessary logistical information to prepare well for their daily lectures.


### ACTOR 3: ADMINISTRATOR 

#### Functional Group 8: Administrative Class Control
* **Master Schedule Uploading:** Administrators can upload and manage the global academic calendar, exam periods, and entire course offerings. This keeps all students and staff synchronized under one centralized timeline and prevents scheduling conflicts across departments.
* **Student Class Transfer Management:** This tool gives administrators the flexibility to manually move students between different class sections. It is essential for resolving unexpected scheduling conflicts, handling special cases, and balancing class sizes effectively.

#### Functional Group 9: Request Management
* **Process Student Requests:** A centralized dashboard where administrators receive academic petitions, review the attached documents, and update processing statuses (e.g., Approve, Reject, or Under Review). This creates a structured and traceable workflow to resolve student issues quickly without losing any paperwork.

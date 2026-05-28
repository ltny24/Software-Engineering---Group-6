## 3. Key Features and Functional Groups
*Performed by: Lê Thị Như Ý | Reviewed by: Hoàng Trung Kiên | Edited by: Lê Thị Như Ý*

### 3.1. System Use Case Diagram

```mermaid
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

    ST --> UC2 & UC2_1 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9
    ST --> UC1 & UC10

    UC10 <-- TC
    UC11 & UC12 <-- TC

    UC1 <-- AD
    UC13 & UC14 & UC15 <-- AD
```

The system is designed for three main users: Students, Teaching Staff, and Administrators. It is divided into 9 functional groups to make university operations easier to manage.

### ACTOR 1: STUDENT 

#### Functional Group 1: Profile & Account Management
* **Student Profile Update:** 
  * *Functionality:* Allows students to view and update their personal and contact information.
  * *Value:* Ensures the university always has the correct data to contact students quickly.

#### Functional Group 2: Request & Certificate Processing
* **Application Submission:** 
  * *Functionality:* Allows students to submit online forms (like transcript requests or leave of absence).
  * *Value:* Saves time and removes the need for paper forms.
* **View Pending Requests:** 
  * *Functionality:* Lets students track the status of their submitted forms (e.g., Pending, Approved, Rejected).
  * *Value:* Helps students know exactly where their request is without needing to ask the staff.
* **AI-Assisted Request Drafting:** 
  * *Functionality:* Uses AI to generate formal request templates based on student keywords.
  * *Value:* Helps students create professional forms easily and avoids mistakes.

#### Functional Group 3: Course Enrollment System
* **Standard & Specialized Course Registration:** 
  * *Functionality:* Allows students to choose and register for their subjects for the upcoming semester.
  * *Value:* Gives students control over their own study plan and graduation timeline.
* **AI-Powered Schedule Suggestion:** 
  * *Functionality:* Suggests the best study schedule based on the courses the student needs to take.
  * *Value:* Helps students avoid overlapping classes and saves a lot of planning time.

#### Functional Group 4: Academic & Financial Management
* **Grade Viewing & GPA Calculation:** 
  * *Functionality:* Shows detailed subject scores and automatically calculates the cumulative GPA.
  * *Value:* Helps students easily track their learning progress.
* **Timetable & Exam Scheduling:** 
  * *Functionality:* Displays a personal calendar with class times, room numbers, and exam dates.
  * *Value:* Keeps students organized so they don't miss any classes or exams.
* **Tuition Fee Tracking:** 
  * *Functionality:* Shows the tuition fee balance, payment history, and deadlines.
  * *Value:* Helps students and parents plan their finances and pay on time.

#### Functional Group 5: Feedback & Evaluation
* **Surveys & Course Wishlist:** 
  * *Functionality:* Lets students evaluate courses and suggest subjects they want to study next.
  * *Value:* Gives the university useful feedback to improve teaching quality and plan future classes.

#### Functional Group 6: Support & FAQ
* **Centralized FAQ Access:** 
  * *Functionality:* Provides a list of common questions and answers about university rules.
  * *Value:* Helps students find answers instantly without waiting for the support team.


### ACTOR 2: TEACHING STAFF 

#### Functional Group 7: Staff Teaching Operations
* **Teaching Availability Registration:** 
  * *Functionality:* Allows teachers to register their free time and preferred teaching schedule.
  * *Value:* Helps the school arrange schedules that fit the teachers' availability.
* **Instructor Schedule Management:** 
  * *Functionality:* Shows the teacher's final schedule, including class lists and room locations.
  * *Value:* Helps teachers prepare well for their classes.


### ACTOR 3: ADMINISTRATOR 

#### Functional Group 8: Administrative Class Control
* **Master Schedule Uploading:** 
  * *Functionality:* Allows admins to upload the whole university's timetable and exam schedule.
  * *Value:* Ensures all departments and users follow a synchronized academic schedule and avoids scheduling errors.
* **Student Class Transfer Management:** 
  * *Functionality:* Lets admins move students between classes to fix schedule conflicts.
  * *Value:* Gives admins the flexibility to manage unexpected situations and balance class sizes.

#### Functional Group 9: Request Management
* **Process Student Requests:** 
  * *Functionality:* Provides a dashboard for admins to receive, review, and update the status of student requests (Approve, Reject, or Under Review).
  * *Value:* Makes it easy for the staff to manage documents and resolve student issues quickly.

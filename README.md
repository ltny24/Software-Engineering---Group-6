# MyUS — University Student Portal System

MyUS is a university student portal system built for the University of Science, VNU-HCM. The system provides a centralized platform for students to register for courses, view grades, submit grade appeals, manage tuition fees, participate in surveys, look up FAQs, and interact with an AI assistant chatbot.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [UI & Styling Requirements](#ui--styling-requirements)
- [Project Structure](#project-structure)
- [System Requirements](#system-requirements)
- [Installation & Setup Guide](#installation--setup-guide)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Database Setup](#2-database-setup-docker-sql-server)
  - [3. Backend Configuration](#3-backend-configuration)
  - [4. Run Backend](#4-run-backend)
  - [5. Run Frontend](#5-run-frontend)
- [Database Usage Guide](#database-usage-guide)
  - [Database Structure](#database-structure)
  - [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Database Connection](#database-connection)
  - [Common Database Operations](#common-database-operations)
- [Sample Accounts](#sample-accounts)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Execution Order](#execution-order)
- [Development Team](#development-team)

---

## Features

| Module | Description |
|--------|-------------|
| **Authentication & Authorization** | JWT login, Student / Administrator roles, BCrypt password hashing |
| **Course Management** | View course list, course offerings, register / cancel registration |
| **Grades & GPA** | Transcript, cumulative GPA, semester academic records |
| **Grade Appeal** | Submit grade appeals, track processing status |
| **Tuition Fees** | View tuition balance, payment history, scholarship details |
| **Surveys** | Participate in student surveys, view results |
| **FAQ** | Look up frequently asked questions, rate helpfulness |
| **Class Transfer** | Request course section transfers |
| **AI Chatbot** | Gemini AI virtual assistant supporting students |

---

## Tech Stack

### Backend
- **Java** + **Spring Boot** (REST API)
- **Spring Security** + **JWT** (Authentication & Authorization)
- **Spring Data JPA** + **Hibernate** (ORM)
- **Flyway** (Database migration)
- **Microsoft SQL Server** (Primary Database)
- **Gemini AI API** (Chatbot)

### Frontend
- **React 18** + **TypeScript**
- **React Router** (Navigation)
- **Axios** (HTTP client)
- **React Hook Form** + **Zod** (Form handling & validation)
- **Zustand** (State management)
- **Recharts** (Data visualization & charts)
- **React Hot Toast** (Notifications)
- **Tailwind CSS** (Utility-first CSS framework)
- **PostCSS** + **Autoprefixer** (CSS processing & vendor prefixes)

---

## UI & Styling Requirements

The user interface is built with **Tailwind CSS** and **PostCSS**, adhering to the following guidelines:

### Tools & Configuration

| Tool | Version | Role |
|------|---------|------|
| Tailwind CSS | ^3.4.19 | Utility-first CSS framework — provides utility classes for rapid and consistent UI development |
| PostCSS | ^8.5.25 | CSS post-processor — processes and compiles modern CSS |
| Autoprefixer | ^10.5.4 | Automatically adds vendor prefixes to CSS |

### Configuration File Structure

```
src/frontend/
├── tailwind.config.js    # Tailwind configuration (theme, colors, fonts, plugins...)
├── postcss.config.js     # PostCSS configuration (tailwindcss, autoprefixer plugins)
└── src/
    └── index.css         # CSS entry point with @tailwind directives
```

### UI Modification Guidelines

1. **Always use Tailwind utility classes** instead of raw CSS or inline styles — ensuring consistency across the entire project.
2. **Colors and Themes** are defined centrally in `tailwind.config.js` — when adding new colors, extend the configuration file rather than hardcoding values.
3. **Responsive Design** — utilize Tailwind's built-in breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) to ensure responsiveness across all screen sizes.
4. **Dark Mode** (if applicable) — use Tailwind's `dark:` variant to support dark themes.
5. **PostCSS** handles automatic processing:
   - Compiles `@tailwind` directives into vanilla CSS
   - Adds vendor prefixes via Autoprefixer
   - Purges unused CSS in production builds (tree-shaking)
6. **Avoid overriding the CSS framework** — minimize raw CSS; if strictly necessary, use `@apply` in CSS files to leverage Tailwind classes.
7. **Production Build** — during production builds (`npm run build`), PostCSS automatically purges unused Tailwind classes to optimize CSS file size.

### Naming & Organization Conventions

- Component styles: use `className` with Tailwind utility classes directly in JSX
- Custom styles (if needed): place in `src/index.css` or CSS module (`.module.css`)
- Custom colors: declare in `tailwind.config.js → theme.extend.colors`

---

## Project Structure

```
.
├── docs/                           # Project documentation
│   ├── PA/                         # Peer Assessment guidelines and documents
│   ├── analysis-and-design/        # Analysis & design documents
│   ├── management/                 # Project management (contract, reports, plans)
│   ├── requirements/               # Requirement specifications, vision, use cases
│   ├── survey/                     # User survey data
│   └── test/                       # Test plans, scripts, reports
├── src/
│   ├── backend/                    # Spring Boot backend
│   │   └── src/main/resources/
│   │       ├── db/
│   │       │   ├── schema.sql      # Database schema
│   │       │   ├── mock_data_myus.sql # Mock data script
│   │       │   └── migration/      # Flyway migration scripts
│   │       └── application.properties # Application configuration
│   ├── frontend/                   # React frontend
│   ├── tests/                      # Automated testing
│   └── SpecKit/                    # SpecKit documentation & files
└── README.md
```

---

## System Requirements

| Software | Version | Notes |
|----------|---------|-------|
| Docker | 24+ | `docker --version` to check |
| Java JDK | 17 or 21 | `java -version` to check |
| Node.js | ≥ 18.x | `node -v` to check |
| npm | ≥ 9.x | Bundled with Node.js |
| Maven | 3.8+ | Project includes Maven Wrapper (`mvnw`) |
| Git | — | Source control |

---

## Installation & Setup Guide

### 1. Clone Repository

```bash
git clone <repository-url>
cd Software-Engineering---Group-6
```

### 2. Database Setup (Docker SQL Server)

The database is hosted inside a Docker container named `myus-sqlserver` (image `mcr.microsoft.com/mssql/server:2022-latest`).

#### Step 2.1: Pull Image & Create Container

```bash
# Pull SQL Server 2022 image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Create and run container
docker run -d \
  --name myus-sqlserver \
  -e 'ACCEPT_EULA=Y' \
  -e 'MSSQL_SA_PASSWORD=Khoidmh1106' \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest

# Verify running container
docker ps | grep myus-sqlserver
```

#### Step 2.2: Create Database

Use `docker exec` to create the database inside the container:

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -Q "CREATE DATABASE MyUS;"
```

#### Step 2.3: Execute Schema Script

Execute the `schema.sql` script from host machine into the container:

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -d MyUS \
  < src/backend/src/main/resources/db/schema.sql
```

This script will create the `myus` schema and all required tables.

#### Step 2.4: Execute Mock Data Script

Import mock data (test accounts, courses, grades, etc.):

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -d MyUS \
  < src/backend/src/main/resources/db/mock_data_myus.sql
```

#### Step 2.5: Verify Imported Data

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -d MyUS \
  -Q "SELECT COUNT(*) AS StudentCount FROM myus.Student;"
```

> **Tip:** For convenience, you can create a shell alias:
> ```bash
> alias myus-sql="docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Khoidmh1106' -d MyUS"
> ```
> Then run: `myus-sql -Q "SELECT * FROM myus.Student;"`

### 3. Backend Configuration

Open `src/backend/src/main/resources/application.properties` and update the database connection properties:

```properties
# SQL Server connection
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=MyUS;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPasswordHere
```

> **Note:** Passwords stored in `application.properties` as plain text should NOT be committed to production repositories. Use environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) for production environments.

### 4. Run Backend

Open a terminal and navigate to the backend directory:

```bash
cd src/backend

# macOS / Linux
./mvnw clean install -DskipTests
./mvnw spring-boot:run -DskipTests

# Windows
mvnw.cmd clean install -DskipTests
mvnw.cmd spring-boot:run -DskipTests
```

Backend will run at: **http://localhost:8080**

API docs (Swagger UI): **http://localhost:8080/swagger-ui.html**

### 5. Run Frontend

Open a new terminal (keep backend running):

```bash
cd src/frontend

# Install dependencies
npm install

# Run development server
npm start
```

Frontend will run at: **http://localhost:3000**

---

## Database Usage Guide

### Database Structure

The **MyUS** database uses the `myus` schema to organize all tables. Below is the full list of tables and descriptions:

| Table | Description | Primary Key |
|-------|-------------|-------------|
| `myus.Student` | Student information and login account | `studentId` |
| `myus.Administrator` | Administrator account | `adminId` |
| `myus.Course` | Master course catalog | `courseId` |
| `myus.CourseOffering` | Course sections offered per semester | `offeringId` |
| `myus.CourseRegistration` | Student course registrations | `registrationId` |
| `myus.Grade` | Student course grades | `gradeId` |
| `myus.AcademicRecord` | Academic history (cumulative GPA, earned credits) | `recordId` |
| `myus.Appeal` | Grade appeal requests | `appealId` |
| `myus.TuitionAccount` | Semester tuition account | `accountId` |
| `myus.TuitionPayment` | Tuition payment history | `paymentId` |
| `myus.Survey` | Student surveys | `surveyId` |
| `myus.SurveyResponse` | Student survey responses | `responseId` |
| `myus.FAQArticle` | FAQ articles | `faqId` |
| `myus.ClassTransferRequest` | Class section transfer requests | `transferId` |
| `myus.ChatbotSession` | Chatbot conversation sessions | `sessionId` |

### Entity Relationship Diagram (ERD)

```
┌─────────────────────┐     ┌──────────────────────┐
│    Administrator    │     │       Student        │
│  ├─ adminId (PK)    │     │  ├─ studentId (PK)   │
│  ├─ username        │     │  ├─ username         │
│  ├─ password        │     │  ├─ password         │
│  ├─ role            │     │  ├─ role             │
│  ├─ email           │     │  ├─ firstName        │
│  ├─ displayName     │     │  ├─ lastName         │
│  └─ department      │     │  ├─ email            │
└─────────┬───────────┘     │  ├─ major            │
          │                 │  └─ enrollmentStatus │
          │ reviews         └──────────┬───────────┘
          ▼                            │
┌─────────────────────┐                │
│       Appeal        │                │
│  ├─ appealId (PK)   │◄──────────────┤ submits
│  ├─ studentId (FK)  │                │
│  ├─ gradeId (FK)    │                │
│  ├─ status          │                │
│  └─ appealReason    │                │
└─────────────────────┘                │
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
          ▼                            ▼                            ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ AcademicRecord   │    │ CourseRegistration   │    │   TuitionAccount     │
│ ├─ recordId (PK) │    │ ├─ registrationId(PK)│    │  ├─ accountId (PK)   │
│ ├─ studentId(FK) │    │ ├─ studentId (FK)    │    │  ├─ studentId (FK)   │
│ ├─ term          │    │ ├─ offeringId (FK)   │    │  ├─ term             │
│ ├─ cumulativeGPA │    │ └─ status            │    │  ├─ totalCharges     │
│ └─ earnedCredits │    └──────────┬───────────┘    │  ├─ balance         │
└──────────────────┘               │                │  └─ financialHold   │
                                   │                └──────────┬───────────┘
                                   ▼                           │
┌──────────────────┐    ┌──────────────────────┐               │
│     Grade        │    │   CourseOffering     │               ▼
│ ├─ gradeId (PK)  │    │  ├─ offeringId (PK)  │    ┌──────────────────────┐
│ ├─ registrationId│    │  ├─ courseId (FK)    │    │   TuitionPayment     │
│ ├─ studentId(FK) │    │  ├─ section          │    │  ├─ paymentId (PK)   │
│ ├─ courseId (FK) │    │  ├─ term             │    │  ├─ accountId (FK)   │
│ ├─ gradeValue    │    │  └─ instructor       │    │  ├─ amount           │
│ └─ gradePoint    │    └──────────┬───────────┘    │  └─ paymentMethod   │
└──────────────────┘               │                └──────────────────────┘
                                   ▼
                        ┌──────────────────────┐
                        │       Course         │
                        │  ├─ courseId (PK)    │
                        │  ├─ courseCode       │
                        │  ├─ courseName       │
                        │  ├─ credits          │
                        │  └─ department       │
                        └──────────────────────┘
```

### Database Connection

#### Via `docker exec` (`sqlcmd` — Primary Method)

Access the database directly without installing extra tools by using `sqlcmd` pre-packaged inside the container:

```bash
# Open interactive sqlcmd session
docker exec -it myus-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Khoidmh1106' -d MyUS
```

Inside the interactive prompt (`1>`), enter SQL commands. Type `GO` to execute and `QUIT` to exit.

```sql
-- Example inside interactive session
SELECT COUNT(*) FROM myus.Student;
GO
```

#### Run Single SQL Commands from Host

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -d MyUS \
  -Q "SELECT studentId, username, firstName, lastName FROM myus.Student;"
```

#### Run `.sql` Files from Host

```bash
docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P 'Khoidmh1106' \
  -d MyUS \
  < path/to/script.sql
```

#### Using Shell Alias (Recommended)

Add the following to `~/.zshrc` or `~/.bashrc`:

```bash
alias myus-db='docker exec -it myus-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Khoidmh1106 -d MyUS'
```

Then reload: `source ~/.zshrc`

Now you can access the database using:

```bash
myus-db
```

#### Via Application (Spring Boot — `application.properties`)

Connecting from the Spring Boot backend to SQL Server in Docker container:

```properties
# SQL Server connection
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=MyUS;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Khoidmh1106
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
```

> **Security Note:** Password `Khoidmh1106` is stored in plain text in configuration files. For production environments, use environment variables (`SPRING_DATASOURCE_PASSWORD`) and avoid committing credentials to version control.

### Common Database Operations

> **Assumption:** You created the alias `myus-sql` as described above. If not, replace `myus-sql` with the full `docker exec` command.

#### View student list

```bash
myus-sql -Q "SELECT studentId, username, firstName, lastName, email, major, enrollmentStatus FROM myus.Student ORDER BY lastName;"
```

#### View course registrations for a student

```bash
myus-sql -Q "SELECT cr.registrationId, cr.status, co.section, co.term, co.instructor, c.courseCode, c.courseName, c.credits FROM myus.CourseRegistration cr JOIN myus.CourseOffering co ON cr.offeringId = co.offeringId JOIN myus.Course c ON co.courseId = c.courseId WHERE cr.studentId = 1 ORDER BY co.term DESC;"
```

#### View student transcript

```bash
myus-sql -Q "SELECT c.courseCode, c.courseName, g.gradeValue, g.gradePoint, g.term FROM myus.Grade g JOIN myus.Course c ON g.courseId = c.courseId WHERE g.studentId = 1 ORDER BY g.term DESC;"
```

#### View cumulative GPA

```bash
myus-sql -Q "SELECT ar.term, ar.cumulativeGPA, ar.earnedCredits FROM myus.AcademicRecord ar WHERE ar.studentId = 1 ORDER BY ar.term;"
```

#### View pending grade appeals

```bash
myus-sql -Q "SELECT a.appealId, s.firstName, s.lastName, a.appealReason, a.status, a.submittedAt, a.deadline FROM myus.Appeal a JOIN myus.Student s ON a.studentId = s.studentId WHERE a.status IN ('Submitted', 'Under Review') ORDER BY a.submittedAt;"
```

#### View unpaid tuition

```bash
myus-sql -Q "SELECT s.studentId, s.firstName, s.lastName, ta.term, ta.totalCharges, ta.payments, ta.scholarshipAmount, ta.balance, ta.financialHold FROM myus.TuitionAccount ta JOIN myus.Student s ON ta.studentId = s.studentId WHERE ta.balance > 0 ORDER BY ta.term DESC;"
```

#### View payment history

```bash
myus-sql -Q "SELECT tp.paymentId, s.firstName, s.lastName, tp.amount, tp.paymentDate, tp.paymentMethod, tp.status FROM myus.TuitionPayment tp JOIN myus.TuitionAccount ta ON tp.accountId = ta.accountId JOIN myus.Student s ON ta.studentId = s.studentId ORDER BY tp.paymentDate DESC;"
```

#### Registration statistics by course

```bash
myus-sql -Q "SELECT c.courseCode, c.courseName, COUNT(cr.registrationId) AS totalRegistrations, SUM(CASE WHEN cr.status = 'Enrolled' THEN 1 ELSE 0 END) AS enrolled FROM myus.Course c JOIN myus.CourseOffering co ON c.courseId = co.courseId JOIN myus.CourseRegistration cr ON co.offeringId = cr.offeringId GROUP BY c.courseCode, c.courseName ORDER BY totalRegistrations DESC;"
```

#### View open surveys

```bash
myus-sql -Q "SELECT surveyId, title, description, openDate, closeDate, status, targetAudience FROM myus.Survey WHERE status = 'Open' ORDER BY closeDate;"
```

#### View popular FAQs

```bash
myus-sql -Q "SELECT faqId, question, category, helpfulCount, notHelpfulCount FROM myus.FAQArticle WHERE published = 1 ORDER BY helpfulCount DESC;"
```

#### Interactive sqlcmd session for complex queries

```bash
myus-db
```

Once at prompt `1>`, type SQL and end with `GO`:

```sql
-- Multi-line query in interactive mode
SELECT
    c.courseCode,
    c.courseName,
    COUNT(cr.registrationId) AS totalRegistrations,
    SUM(CASE WHEN cr.status = 'Enrolled' THEN 1 ELSE 0 END) AS enrolled
FROM myus.Course c
JOIN myus.CourseOffering co ON c.courseId = co.courseId
JOIN myus.CourseRegistration cr ON co.offeringId = cr.offeringId
GROUP BY c.courseCode, c.courseName
ORDER BY totalRegistrations DESC;
GO
```

#### Reset database data

```bash
myus-sql -Q "
DELETE FROM myus.ChatbotSession;
DELETE FROM myus.SurveyResponse;
DELETE FROM myus.TuitionPayment;
DELETE FROM myus.TuitionAccount;
DELETE FROM myus.ClassTransferRequest;
DELETE FROM myus.Appeal;
DELETE FROM myus.Grade;
DELETE FROM myus.AcademicRecord;
DELETE FROM myus.CourseRegistration;
DELETE FROM myus.CourseOffering;
DELETE FROM myus.FAQArticle;
DELETE FROM myus.Survey;
DELETE FROM myus.Course;
DELETE FROM myus.Administrator;
DELETE FROM myus.Student;
"
```

> **After reset**, re-import mock data:
> ```bash
> docker exec -i myus-sqlserver /opt/mssql-tools/bin/sqlcmd \
>   -S localhost -U sa -P 'Khoidmh1106' \
>   -d MyUS \
>   < src/backend/src/main/resources/db/mock_data_myus.sql
> ```

---

## Sample Accounts

Accounts created automatically when running `mock_data_myus.sql`:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Student | `24127002` | `24127002123` | Course registration, view grades, view timetable |
| Administrator | `admin001` | `admin001` | Appeals management, view reports |

> **Security Note:** Passwords in database are currently stored in plain text (`NoOpPasswordEncoder` config). In production, upgrade to **BCrypt** or a stronger password hashing algorithm.

---

## API Documentation

API documentation (Swagger UI) is accessible when the backend is running:

```
http://localhost:8080/swagger-ui.html
```

OpenAPI spec (JSON):

```
http://localhost:8080/api-docs
```

---

## Troubleshooting

### Port 8080 is already in use

Change backend port in `application.properties`:

```properties
server.port=8081
```

Then update proxy in `src/frontend/package.json`:

```json
"proxy": "http://localhost:8081"
```

### Login page bypassed (redirects straight to Dashboard)

Cause: Outdated JWT token in Local Storage.

**Fix:** F12 → Application → Local Storage → `http://localhost:3000` → Clear All → Refresh.

### DataSource error during backend startup

Check:
- Container SQL Server is running: `docker ps | grep myus-sqlserver`
- If container stopped, restart it: `docker start myus-sqlserver`
- Database name in connection string is correct (`databaseName=MyUS`)
- Username (`sa`) and password (`Khoidmh1106`) are correct
- Port 1433 is not occupied: `lsof -i :1433`

### SQL Server Container fails to start

```bash
# View logs
docker logs myus-sqlserver

# Common cause: port 1433 occupied (e.g. by azuresqledge)
# Fix: stop conflicting container or change port
docker stop azuresqledge
docker start myus-sqlserver
```

### `sqlcmd` not found inside container

```bash
# Check sqlcmd path
docker exec myus-sqlserver ls /opt/mssql-tools/bin/sqlcmd

# If missing, use sqlcmd in PATH
docker exec -it myus-sqlserver sqlcmd -S localhost -U sa -P 'Khoidmh1106'
```

### `mvn` command not found

Use the included Maven Wrapper:
- **macOS/Linux:** `./mvnw`
- **Windows:** `mvnw.cmd`

### `node_modules` missing or corrupted

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Execution Order

1. Ensure Docker container SQL Server is running: `docker start myus-sqlserver`
2. (First time) Execute `schema.sql` and `mock_data_myus.sql` via `docker exec`
3. Configure `application.properties` with database connection info
4. Start backend: `cd src/backend && ./mvnw spring-boot:run -DskipTests`
5. Start frontend: `cd src/frontend && npm install && npm start`
6. Access `http://localhost:3000` and log in

---

## Development Team

**MyUS Portal Development Team**

Faculty of Information Technology — University of Science, VNU-HCM

---

*Project developed for the **Software Engineering** course.*

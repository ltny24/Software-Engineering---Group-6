# MyUS University Portal

A full-stack web-based academic portal that digitalizes daily administrative and academic activities for students and administrators at a university.

## Project Overview

MyUS provides a unified workspace for:
- **Students**: Course registration, timetable viewing, grades & GPA tracking, tuition management, grade appeals, and AI-powered course recommendations.
- **Administrators**: Academic schedule management, student data import, appeal processing, class transfers, and survey management.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend Runtime** | Java 17 + Spring Boot 3.2.5 |
| **Backend Framework** | Spring Web, Spring Data JPA, Spring Security |
| **Authentication** | JWT (jjwt 0.12.5) stateless tokens |
| **Database** | SQL Server (via mssql-jdbc) |
| **Database Migration** | Flyway |
| **API Documentation** | SpringDoc OpenAPI (Swagger UI) |
| **Frontend Runtime** | Node.js >= 18 |
| **Frontend Framework** | React 18.3 + TypeScript 5.4 |
| **State / Routing** | React Router v6, React Context |
| **HTTP Client** | Axios |
| **Build (Backend)** | Maven |
| **Build (Frontend)** | Create React App (react-scripts) |

## Prerequisites

- **Java 17** (JDK)
- **Maven 3.8+**
- **SQL Server** (local or remote instance)
- **Node.js 18+** with npm 9+
- A modern web browser

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Software-Engineering---Group-6
```

### 2. Backend setup

```bash
cd src/backend

# Configure database connection (see src/backend/.env.example)
# The application reads application.properties with env-var overrides.

# Run database migrations (Flyway runs automatically on startup)
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.

API docs (Swagger UI) available at: http://localhost:8080/swagger-ui.html

### 3. Frontend setup

```bash
cd src/frontend

# Install dependencies
npm install

# Configure environment (see .env.example)
cp .env.example .env.local

# Start development server
npm start
```

The frontend starts on **http://localhost:3000** (proxied to the backend).

## How to Run

```bash
# Backend (from src/backend)
./mvnw spring-boot:run

# Frontend (from src/frontend)
npm start
```

## How to Test

```bash
# Backend tests
cd src/backend
./mvnw test

# Frontend tests
cd src/frontend
npm test

# Frontend tests with coverage
npm run test:coverage
```

## Lint & Format

```bash
# Frontend
cd src/frontend
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
```

## Project Structure

```
.
├── .editorconfig            # Coding style conventions
├── .gitignore
├── .vscode/                 # Shared editor settings
├── docs/                    # Project documentation
│   ├── analysis-and-design/
│   ├── architecture/        # Architecture documentation
│   ├── management/          # Project management & reports
│   ├── requirements/        # Requirements & use cases
│   ├── survey/              # Survey data
│   └── test/                # Test plans
├── src/
│   ├── backend/             # Spring Boot application
│   │   ├── src/main/java/com/myus/
│   │   │   ├── config/      # CORS, JWT configuration
│   │   │   ├── controller/  # REST controllers
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── entity/      # JPA entity classes
│   │   │   ├── exception/   # Error handling
│   │   │   ├── repository/  # Spring Data repositories
│   │   │   ├── security/    # JWT authentication
│   │   │   ├── service/     # Business logic
│   │   │   └── util/        # Utilities
│   │   ├── src/main/resources/
│   │   │   ├── db/          # SQL scripts & migrations
│   │   │   └── application.properties
│   │   └── pom.xml
│   ├── frontend/            # React application
│   │   └── src/
│   │       ├── api/         # Axios configuration
│   │       ├── auth/        # Auth context & guards
│   │       ├── components/  # Shared UI components
│   │       ├── hooks/       # Custom React hooks
│   │       ├── pages/       # Route-level page components
│   │       ├── services/    # API service functions
│   │       ├── tests/       # Frontend tests
│   │       ├── types/       # TypeScript interfaces
│   │       └── utils/       # Constants & utilities
│   └── SpecKit/             # SpecKit specification tooling
└── README.md
```

## Architecture

The backend follows a **Layered Architecture**:

```
Controllers (REST endpoints)
    ↓
Services (business logic, transactions)
    ↓
Repositories (Spring Data JPA)
    ↓
Entities (domain model mapped to SQL Server)
```

The frontend uses a **component-based architecture** with React Router for page navigation and React Context for authentication state.

## API Endpoints

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Login, token management |
| Courses | `/api/courses` | Course catalog browsing |
| Registrations | `/api/registrations` | Course enrollment |
| Grades | `/api/v1/grades` | Student grades |
| Profile | `/api/v1/profile` | Student profile |
| Finance | `/api/v1/finance` | Tuition & payments |
| Appeals | `/api/appeals` | Student grade appeals |
| Admin Appeals | `/api/admin/appeals` | Admin appeal processing |

## Environment Variables

See `src/backend/.env.example` and `src/frontend/.env.example` for required variables.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## License

This is a student project for CS300 - Introduction to Software Engineering.

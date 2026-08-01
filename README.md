# MyUS University Portal

A full-stack web-based academic portal digitalizing daily administrative and academic activities for students and administrators.

| | |
|---|---|
| **Students** | Course registration, timetable, grades/GPA, tuition, appeals, AI chatbot |
| **Administrators** | Student data import, appeal processing, class transfers, survey management |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security + JWT, Spring Data JPA |
| **Database** | SQL Server + Flyway migrations |
| **Frontend** | React 18.3, TypeScript 5.4, React Router v6, Axios |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Build** | Maven (backend), npm/react-scripts (frontend) |

## Prerequisites

- **Java 17** JDK
- **Maven 3.8+**
- **SQL Server** (local or remote, database: `MyUS`)
- **Node.js 18+** with npm 9+

## Quick Start

### 1. Clone & Configure

```bash
git clone <repository-url>
cd Software-Engineering---Group-6
```

**Backend** — configure database in `backend/resources/application.properties` or env vars:

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:sqlserver://localhost:1433;databaseName=MyUS` | SQL Server connection |
| `SPRING_DATASOURCE_USERNAME` | `sa` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | (required) | DB password |
| `JWT_SECRET` | (default in properties) | Base64 JWT signing key |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Frontend origin |

**Frontend** — copy env template:

```bash
cp frontend/.env.example frontend/.env.local
```

### 2. Run Backend

```bash
cd backend
mvn spring-boot:run
# → Starts on http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm start
# → Starts on http://localhost:3000 (proxied to backend)
```

## How to Test

```bash
# Backend unit tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## Project Structure

```
├── backend/
│   ├── pom.xml                         ← Maven config
│   ├── src/
│   │   └── myus/                       ← Java source (package myus.*)
│   │       ├── UniversityPortalApplication.java
│   │       ├── config/                 ← CORS, JWT config
│   │       ├── controller/             ← REST endpoints
│   │       ├── dto/                    ← Data transfer objects
│   │       ├── entity/                 ← JPA entities
│   │       ├── exception/              ← Error handling
│   │       ├── repository/             ← Spring Data repos
│   │       ├── security/               ← JWT auth + SecurityConfig
│   │       └── service/                ← Business logic
│   ├── test/                           ← Unit tests
│   └── resources/
│       ├── application.properties
│       └── db/                         ← SQL schema + migrations + seed data
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/                        ← Axios instance + interceptors
│   │   ├── auth/                       ← Auth context, guards, service
│   │   ├── components/                 ← Layout, Sidebar, shared UI
│   │   ├── pages/                      ← Page components per route
│   │   ├── services/                   ← API service functions
│   │   ├── tests/                      ← Frontend tests
│   │   ├── types/                      ← TypeScript interfaces
│   │   └── utils/                      ← Constants, token utils
│   ├── package.json
│   └── tsconfig.json
├── docs/                               ← Requirements, reports, use cases
├── speckit/                            ← SpecKit specs & constitution
│   └── README.md                       ← SpecKit usage guide
└── README.md
```

## API Endpoints

| Module | Path | Auth |
|--------|------|------|
| Auth | `POST /api/auth/login` | Public |
| Courses | `/api/courses` | Student |
| Enrollments | `/api/registrations` | Student |
| Grades | `/api/v1/grades` | Student |
| Profile | `/api/v1/profile` | Student |
| Finance | `/api/v1/finance` | Student |
| Appeals | `/api/appeals` | Student |
| Admin Appeals | `/api/admin/appeals` | Admin |

## Architecture

```
Controllers (REST) → Services (business logic) → Repositories (JPA) → Entities → SQL Server
                         ↕
                   JWT Security Filter (stateless)
```

Frontend: component-based React with Context for auth state, React Router for SPA navigation.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

## Documentation

- **SpecKit specs**: `speckit/README.md` — Specification-driven development workflow
- **Requirements**: `docs/requirements/`
- **Architecture**: `docs/analysis-and-design/`
- **Reports**: `docs/management/`
- **API contracts**: `speckit/specs/001-university-portal/contracts/`

## License

CS300 — Introduction to Software Engineering. Student project.

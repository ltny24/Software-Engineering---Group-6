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

### 2. Database Setup (Docker — SQL Server)

> **Yêu cầu**: Docker Desktop đang chạy.

```bash
# Bước 1: Khởi tạo SQL Server container
docker run -e "ACCEPT_EULA=Y" \
           -e "MSSQL_SA_PASSWORD=Khoidmh1106" \
           -p 1433:1433 \
           --name myus-sqlserver \
           -d mcr.microsoft.com/mssql/server:2022-latest

# Chờ ~15 giây cho SQL Server khởi động xong

# Bước 2: Tạo database MyUS
docker exec myus-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Khoidmh1106 -N -C \
  -Q "CREATE DATABASE MyUS"

# Bước 3: Import schema
docker cp backend/resources/db/schema.sql myus-sqlserver:/schema.sql
docker exec myus-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Khoidmh1106 -N -C -d MyUS \
  -i /schema.sql

# Bước 4: Thêm cột bổ sung (midtermGrade, finalGrade, expectedGrade)
docker exec myus-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Khoidmh1106 -N -C -d MyUS \
  -Q "ALTER TABLE myus.Grade ADD midtermGrade DECIMAL(4,2) NULL, finalGrade DECIMAL(4,2) NULL; ALTER TABLE myus.Appeal ADD expectedGrade DECIMAL(4,2) NULL;"

# Bước 5: Import mock data (100 students, 5 admins, 15 courses, 1000 grades, ...)
docker cp backend/resources/db/mock_data_myus.sql myus-sqlserver:/mock_data.sql
docker exec myus-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Khoidmh1106 -N -C -d MyUS \
  -i /mock_data.sql
```

**Thông tin kết nối database:**

| Thông số | Giá trị |
|----------|---------|
| Host | `localhost` |
| Port | `1433` |
| Database | `MyUS` |
| Username | `sa` |
| Password | `Khoidmh1106` |
| Schema | `myus` |

**Dữ liệu mock data bao gồm:**

| Bảng | Số lượng |
|------|----------|
| Students | 100 (username: `24127001` → `24127100`) |
| Administrators | 5 (username: `admin001` → `admin005`) |
| Courses | 15 |
| Course Offerings | 30 |
| Grades | 1000 |
| Tuition Accounts | 200 |

**Tài khoản test (password = username + `123` cho student):**

| Role | Username | Password |
|------|----------|----------|
| Student | `24127001` | `24127001123` |
| Admin | `admin001` | `admin001` |

> **Lưu ý**: Nếu container đã tồn tại, chạy `docker start myus-sqlserver` để khởi động lại.

### 3. Run Backend

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dmaven.test.skip=true
# → Starts on http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

### 4. Run Frontend

```bash
cd frontend
npm install --legacy-peer-deps
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

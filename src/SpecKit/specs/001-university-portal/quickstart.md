# Quickstart: MyUS University Portal System

## Prerequisites

- Java 17+ installed
- Node.js 18+ and npm/yarn installed
- SQL Server instance accessible
- Environment variables configured for backend and frontend

## Setup

1. Clone the repository and open the workspace.
2. Create the SQL Server database and apply schema migrations.
3. Configure backend environment variables, including:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION_MS`
4. Configure frontend environment variables, including API base URL.

## Running locally

### Backend

```bash
cd backend
./gradlew bootRun
```

or with Maven:

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Basic workflow

- Open the frontend app and authenticate as a student or administrator.
- Students can update profiles, browse courses, register, view grades, track tuition, submit appeals, and use support resources.
- Administrators can import data, manage class transfers and appeals, and review student records.

## Testing

### Backend tests

```bash
cd backend
./gradlew test
```

### Frontend tests

```bash
cd frontend
npm test
```

## Notes

- Ensure JWT authentication is enabled and frontend routes are protected.
- Use API documentation to validate endpoint contracts before building UI integrations.
- Confirm survey periods and appeal deadlines are configured in the backend before user-facing launch.

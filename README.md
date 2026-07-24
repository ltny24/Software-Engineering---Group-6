# MyUS - University Portal System

A full-stack university portal system built for CSC13002 - Introduction to Software Engineering.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security + JWT, Spring Data JPA, Flyway |
| **Frontend** | React 18, TypeScript, React Router v6, Axios, React Query, Zustand |
| **Database** | Microsoft SQL Server |

## Architecture

The project follows **Clean Architecture** principles with clear separation of concerns:

```
backend/src/main/java/com/myus/
├── domain/          Enterprise business rules (entities, repository interfaces, domain exceptions)
├── application/     Use cases & application services (service interfaces, DTOs, service implementations)
├── infrastructure/  Framework adapters (Spring Security, JWT, CORS config)
└── interfaces/      Inbound adapters (REST controllers, exception handlers)
```

## Prerequisites

- **Java 17+** and **Maven 3.9+**
- **Node.js 18+** and **npm 9+**
- **Microsoft SQL Server** (running on `localhost:1433`)

## Quick Start

### Backend

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Backend API runs at: **http://localhost:8080**\
Swagger UI: **http://localhost:8080/swagger-ui.html**

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

The CRA dev server proxies `/api/*` requests to `http://localhost:8080`.

## Documentation

- [Backend README](backend/README.md) — Backend setup, API docs, and developer guide
- [Frontend README](frontend/README.md) — Frontend setup, coding standards, and API integration
- [API Documentation](backend/src/main/resources/static/api-docs/) — REST API endpoint reference

# MyUS University Portal - Backend

*Performed by: Trần Tường Vi | Reviewed by: Hoàng Trung Kiên | Edited by: Trần Tường Vi*

## Introduction

The backend service is the Spring Boot API server for the MyUS University Portal. It handles authentication, authorization, student and administrator workflows, database persistence, and exposes REST endpoints consumed by the React frontend.

## Tech stack

- Java 17
- Spring Boot 3.2.5
- Maven build tool
- SQL Server database
- Spring Security with JWT authentication
- Spring Data JPA for persistence
- Flyway for database migrations
- SpringDoc / OpenAPI for API documentation

## Prerequisites

- JDK 17 installed
- SQL Server instance accessible from the backend
- Git installed to clone the repository

### Environment variables

The backend uses `src/main/resources/application.properties` with placeholders for local configuration. The following variables are supported:

- `SPRING_DATASOURCE_URL` — SQL Server JDBC URL, default: `jdbc:sqlserver://localhost:1433;databaseName=myus_db;encrypt=true;trustServerCertificate=true`
- `SPRING_DATASOURCE_USERNAME` — database username, default: `sa`
- `SPRING_DATASOURCE_PASSWORD` — database password, default: `changeme`
- `JWT_SECRET` — secret for signing JWT tokens
- `JWT_EXPIRATION_MS` — access token expiration in milliseconds, default: `86400000`
- `JWT_REFRESH_EXPIRATION_MS` — refresh token expiration configuration in milliseconds, default: `604800000` (note: refresh token endpoint and flow may not be fully implemented yet)
- `CORS_ALLOWED_ORIGINS` — allowed frontend origin, default: `http://localhost:3000`

> Note: `src/main/resources/application.properties` is already configured with sensible defaults and environment variable substitution, but secrets should be supplied via environment variables or a local properties file.

## Setup & run locally

Copy and configure the local properties file:

```bash
cd src/backend
cp src/main/resources/application.properties src/main/resources/application-local.properties
```

Edit `src/main/resources/application-local.properties` to set your SQL Server credentials, JWT secret, and CORS origins:

```properties
spring.datasource.url=jdbc:sqlserver://YOUR_HOST:1433;databaseName=myus_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
app.jwt.secret=YOUR_BASE64_ENCODED_SECRET
app.cors.allowed-origins=http://localhost:3000
```

Activate the `local` Spring profile and run the application:

```bash
cd src/backend
export SPRING_PROFILES_ACTIVE=local
mvn clean package
mvn spring-boot:run
```

Alternatively, you can activate the profile via Maven option:

```bash
cd src/backend
mvn clean package
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Or run the packaged jar directly:

```bash
cd src/backend
mvn clean package
java -Dspring.profiles.active=local -jar target/university-portal-backend-0.0.1-SNAPSHOT.jar
```

The backend listens on port `8080` by default. Verify it's running:

```
http://localhost:8080/actuator/health
```

You should see a JSON response indicating the service status.

## Project structure

The main backend source tree is under `src/main/java/com/myus`.

- `controller/` — REST controllers that expose API endpoints
- `service/` — business logic and service layer implementations
- `entity/` — JPA entity classes for the domain model
- `dto/` — data transfer objects used for requests and responses
- `repository/` — Spring Data JPA repositories
- `security/` — JWT token handling and Spring Security configuration
- `config/` — application and CORS configuration classes
- `exception/` — global exception handling and API error models
- `util/` — shared utilities and helper classes

Supporting resources:

- `src/main/resources/application.properties` — application configuration and environment variable bindings
- `src/main/resources/db/migration/` — Flyway SQL migration scripts
- `src/main/resources/static/api-docs/` — scaffolded API documentation and OpenAPI artifacts

## Authentication

The backend uses JWT-based authentication with role-based access control for `Student` and `Administrator` roles.

- Clients authenticate via the login endpoint and receive a JWT access token.
- The token is sent on protected requests in the `Authorization` header:

```http
Authorization: Bearer <token>
```

- Security is enforced by Spring Security and custom JWT filters.
- Endpoints are restricted based on user role, so student and administrator operations are separated by RBAC rules.

## API documentation reference

Scaffolded API documentation is available in `src/main/resources/static/api-docs/`.

- OpenAPI spec: `src/main/resources/static/api-docs/openapi.json`
- Markdown guide files: `authentication.md`, `endpoints.md`, `models.md`, `best-practices.md`, `getting-started.md`, `errors.md`

If the application is running, the Swagger UI path is configured at:

```text
http://localhost:8080/swagger-ui.html
```

And the OpenAPI JSON endpoint is typically available at:

```text
http://localhost:8080/api-docs
```

## Test suite

The test suite will be added starting in Phase 3 (T026). Currently, `src/test/java/com/myus/` contains only the default Spring Boot test scaffold (`UniversityPortalApplicationTests.java`).

Once tests are implemented, run them with:

```bash
cd src/backend
mvn test
```


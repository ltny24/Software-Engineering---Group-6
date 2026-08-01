# Research: MyUS University Portal System

## Decision: Architecture and stack

- Chosen architecture: React frontend + Spring Boot backend with JWT-based authentication.
- Rationale: This stack matches the requested technology choices and supports a clean separation between UI, business logic, and data persistence.
- Alternatives considered: A monolithic Java web app or a full-stack JavaScript solution; rejected because the user explicitly requested React and Spring Boot.

## Decision: Database design

- Chosen database: SQL Server with normalized relational schema and strong referential integrity.
- Rationale: SQL Server supports the university data domain well and was specifically requested.
- Alternatives considered: PostgreSQL or MySQL; rejected due to the explicit SQL Server requirement.

## Decision: Authentication and authorization

- Chosen auth model: JWT authentication with role-based authorization for Student and Administrator.
- Rationale: JWT fits modern SPA authentication patterns and supports the required role separation.
- Alternatives considered: session-based auth or OAuth/OIDC; rejected because the prompt requested JWT.

## Decision: AI chatbot integration

- Chosen approach: backend adapter for an AI recommendation service that uses completed credits, degree progress, and course data.
- Rationale: Provides guidance without coupling the frontend directly to an external AI provider.
- Alternatives considered: client-side chatbot only; rejected because server-side integration simplifies data security and authorization.

## Decision: Interface contracts

- Chosen contract style: RESTful API endpoints for frontend-backend communication.
- Rationale: The architecture principle explicitly requires RESTful APIs and the frontend is React-based.
- Alternatives considered: GraphQL or gRPC; rejected because the requested modules and technology stack align best with RESTful services.

## Decision: Testing strategy

- Chosen testing strategy: unit tests for backend services and frontend components, integration tests for API endpoints, and user acceptance testing for core workflows.
- Rationale: Provides sufficient coverage for data validation, business rules, and end-to-end user journeys.
- Alternatives considered: E2E-only testing; rejected because unit and integration tests are essential for backend and frontend quality.

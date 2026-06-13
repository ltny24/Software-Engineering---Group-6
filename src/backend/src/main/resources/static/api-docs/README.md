# MyUS University Portal - API Documentation

## Overview

Welcome to the **MyUS University Portal API Documentation**. This directory contains comprehensive documentation for the backend API endpoints, authentication, and integration guides.

---

## 📚 Documentation Structure

### Core Documentation
- **[Authentication](./authentication.md)** - JWT authentication setup and token management
- **[Endpoints](./endpoints.md)** - Complete list of API endpoints and usage examples
- **[Data Models](./models.md)** - Data structures and entity relationships
- **[Error Handling](./errors.md)** - Error codes and response formats

### Technical References
- **[OpenAPI Specification](./openapi.json)** - Machine-readable API specification (Swagger/OpenAPI 3.0)
- **[WebAPI Reference](./openapi.html)** - Interactive Swagger UI

### Developer Guides
- **[Getting Started](./getting-started.md)** - Quick start guide for API integration
- **[Best Practices](./best-practices.md)** - API usage best practices and conventions

---

## 🚀 Quick Links

### Interactive Documentation
- **Swagger UI**: [/swagger-ui.html](/swagger-ui.html)
- **OpenAPI JSON**: [/v3/api-docs](/v3/api-docs)

### Base URL
```
http://localhost:8080/api
```

### Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 API Endpoints Categories

### Public Endpoints (No Authentication Required)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/public/*` - Public resources

### Protected Endpoints (Authentication Required)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/user/profile` - Get user profile
- `GET /api/user/roles` - Get user roles

---

## 📋 API Specifications

| Property | Value |
|----------|-------|
| **Base URL** | `http://localhost:8080/api` |
| **Version** | `1.0.0` |
| **Format** | REST JSON |
| **Authentication** | JWT Bearer Token |
| **Content-Type** | `application/json` |

---

## 🛠️ Setup Instructions

### 1. Start the Backend Server
```bash
cd src/backend
mvn clean install
mvn spring-boot:run
```

### 2. Access API Documentation
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **API Docs**: http://localhost:8080/api-docs/

### 3. Test Endpoints
Use tools like:
- **Postman** - Import OpenAPI spec: http://localhost:8080/v3/api-docs
- **cURL** - Command-line testing
- **Swagger UI** - Interactive testing

---

## 📝 Example: Authenticate and Call Protected Endpoint

### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

### 2. Call Protected Endpoint
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔄 Refresh Token

When access token expires, use refresh token to get a new one:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## 📖 Common Use Cases

### Use Case 1: User Registration and Login
1. Register new user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Receive access & refresh tokens
4. Use access token for subsequent requests

### Use Case 2: Token Refresh
1. Access token expires
2. Call: `POST /api/auth/refresh` with refresh token
3. Get new access token
4. Continue with protected endpoints

### Use Case 3: Access Protected Resource
1. Get valid access token (from login or refresh)
2. Add to Authorization header
3. Call protected endpoint
4. Handle 401 Unauthorized if token invalid

---

## ❌ Error Handling

### Common Error Responses

**401 Unauthorized** - Invalid or missing token
```json
{
  "status": 401,
  "message": "Unauthorized: Invalid token",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

**403 Forbidden** - Insufficient permissions
```json
{
  "status": 403,
  "message": "Forbidden: Access denied",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

**404 Not Found** - Resource not found
```json
{
  "status": 404,
  "message": "Not found: User not found",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

## 🔗 Related Resources

- **Specification**: [SpecKit - University Portal](../../../../../../SpecKit/specs/001-university-portal/)
- **Source Code**: [Backend Source](../../../)
- **Build Tools**: Maven 3.9.16
- **Java Version**: 17 LTS
- **Spring Boot**: 3.2.5

---

## 📞 Support

For API documentation updates or issues:
- Check the [OpenAPI spec](./openapi.json)
- Review [Authentication guide](./authentication.md)
- See [Best Practices](./best-practices.md)

---

**Last Updated**: 2026-06-12  
**Version**: 1.0.0  
**Status**: ✅ Initial Scaffolding Complete

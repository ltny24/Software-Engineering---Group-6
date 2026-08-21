# Error Handling Guide

## Overview

This guide explains how the API handles errors, the error response format, and how to properly handle different error scenarios.

---

## HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| **200** | OK | Request successful |
| **201** | Created | Resource created successfully |
| **204** | No Content | Request successful, no content returned |
| **400** | Bad Request | Invalid request parameters or body |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Authenticated but insufficient permissions |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Request conflicts with existing data |
| **422** | Unprocessable Entity | Validation error |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Server temporarily unavailable |

---

## Error Response Format

### Standard Error Response

```json
{
  "status": 400,
  "message": "Bad request",
  "code": "INVALID_REQUEST",
  "errors": [
    {
      "field": "username",
      "message": "Username is required",
      "code": "FIELD_REQUIRED"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "code": "FIELD_VALIDATION_FAILED"
    }
  ],
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/auth/register",
  "traceId": "abc123def456"
}
```

### Error Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | integer | HTTP status code |
| `message` | string | User-friendly error message |
| `code` | string | Machine-readable error code |
| `errors` | array | Field validation errors |
| `timestamp` | string | ISO 8601 timestamp |
| `path` | string | Request path |
| `traceId` | string | Request trace ID for support |

---

## Authentication Errors (401)

### Missing Authorization Header

**Request:**
```bash
GET /api/user/profile
# (no Authorization header)
```

**Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized: Missing authentication token",
  "code": "MISSING_TOKEN",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/user/profile"
}
```

---

### Invalid Token Format

**Request:**
```bash
GET /api/user/profile
Authorization: InvalidTokenFormat
```

**Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized: Invalid token format",
  "code": "INVALID_TOKEN_FORMAT",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/user/profile"
}
```

---

### Expired Token

**Request:**
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (expired)
```

**Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized: Token has expired",
  "code": "TOKEN_EXPIRED",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/user/profile"
}
```

**Recommended Action**: Use refresh token to get new access token.

---

### Invalid Signature

**Request:**
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (tampered)
```

**Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Unauthorized: Invalid token signature",
  "code": "INVALID_SIGNATURE",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/user/profile"
}
```

---

## Authorization Errors (403)

### Insufficient Permissions

**Request:**
```bash
GET /api/admin/users
Authorization: Bearer <student_token>
```

**Response (403 Forbidden):**
```json
{
  "status": 403,
  "message": "Forbidden: Insufficient permissions. Required role: ADMIN",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRole": "ADMIN",
  "userRole": "STUDENT",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/admin/users"
}
```

---

## Validation Errors (422)

### Invalid Request Body

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "st",
  "email": "invalid-email",
  "password": "123"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "status": 422,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "username",
      "message": "Username must be between 3 and 50 characters",
      "code": "FIELD_LENGTH_INVALID",
      "value": "st"
    },
    {
      "field": "email",
      "message": "Email format is invalid",
      "code": "FIELD_FORMAT_INVALID",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters",
      "code": "FIELD_LENGTH_INVALID",
      "value": "123"
    }
  ],
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/auth/register"
}
```

---

### Missing Required Fields

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "student@example.com"
  # password is missing
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "status": 422,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "password",
      "message": "Password is required",
      "code": "FIELD_REQUIRED"
    }
  ],
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/auth/login"
}
```

---

## 404 Not Found Errors

### Resource Not Found

**Request:**
```bash
GET /api/courses/invalid-course-id
Authorization: Bearer <token>
```

**Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "Not found: Course not found with ID 'invalid-course-id'",
  "code": "COURSE_NOT_FOUND",
  "resourceType": "Course",
  "resourceId": "invalid-course-id",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/courses/invalid-course-id"
}
```

---

## 409 Conflict Errors

### Duplicate Username

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "student@example.com",
  "email": "different@example.com",
  "password": "securepassword123"
}
# (student@example.com already exists)
```

**Response (409 Conflict):**
```json
{
  "status": 409,
  "message": "Conflict: Username 'student@example.com' already exists",
  "code": "DUPLICATE_USERNAME",
  "field": "username",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/auth/register"
}
```

---

### Already Enrolled

**Request:**
```bash
POST /api/courses/course001/enroll
Authorization: Bearer <token>
# (user already enrolled)
```

**Response (409 Conflict):**
```json
{
  "status": 409,
  "message": "Conflict: Already enrolled in this course",
  "code": "ALREADY_ENROLLED",
  "courseId": "course001",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/courses/course001/enroll"
}
```

---

## 500 Server Errors

### Internal Server Error

**Response (500 Internal Server Error):**
```json
{
  "status": 500,
  "message": "Internal server error",
  "code": "INTERNAL_SERVER_ERROR",
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/courses",
  "traceId": "abc123def456"
}
```

**Recommended Action**: 
- Contact support with trace ID
- Retry after a moment
- Check system status

---

## Error Codes Reference

| Code | Meaning | HTTP Status | Recommended Action |
|------|---------|-------------|-------------------|
| `MISSING_TOKEN` | No authorization token provided | 401 | Add Authorization header |
| `INVALID_TOKEN_FORMAT` | Token format incorrect | 401 | Use correct Bearer token format |
| `TOKEN_EXPIRED` | Token has expired | 401 | Refresh token using refresh endpoint |
| `INVALID_SIGNATURE` | Token was tampered | 401 | Re-authenticate and get new token |
| `INSUFFICIENT_PERMISSIONS` | User lacks required role | 403 | Use account with higher privileges |
| `VALIDATION_ERROR` | Input validation failed | 422 | Fix validation errors and retry |
| `FIELD_REQUIRED` | Required field missing | 422 | Provide the required field |
| `FIELD_LENGTH_INVALID` | Field length invalid | 422 | Check field length constraints |
| `FIELD_FORMAT_INVALID` | Field format invalid | 422 | Check field format requirements |
| `RESOURCE_NOT_FOUND` | Resource doesn't exist | 404 | Verify resource ID and try again |
| `DUPLICATE_USERNAME` | Username already exists | 409 | Use different username |
| `ALREADY_ENROLLED` | Already enrolled in course | 409 | Check current enrollments |
| `INTERNAL_SERVER_ERROR` | Server error | 500 | Retry or contact support |

---

## Error Handling Examples

### JavaScript/Fetch

```javascript
async function fetchProtectedResource() {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 401) {
        // Token expired or invalid
        if (error.code === 'TOKEN_EXPIRED') {
          // Refresh token
          await refreshAccessToken();
          return fetchProtectedResource(); // Retry
        } else {
          // Re-authenticate
          window.location.href = '/login';
        }
      } else if (response.status === 403) {
        // Insufficient permissions
        showError('You do not have permission to access this resource');
      } else if (response.status === 422) {
        // Validation error
        error.errors.forEach(err => {
          console.error(`${err.field}: ${err.message}`);
        });
      } else {
        // Other errors
        showError(error.message);
      }
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

### Java/Spring

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(TokenExpiredException ex) {
        ErrorResponse error = new ErrorResponse(
            401,
            "Unauthorized: Token has expired",
            "TOKEN_EXPIRED",
            LocalDateTime.now()
        );
        return ResponseEntity.status(401).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationError(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(fe -> 
            fieldErrors.add(new FieldError(
                fe.getField(),
                fe.getDefaultMessage(),
                "FIELD_VALIDATION_FAILED"
            ))
        );
        
        ErrorResponse error = new ErrorResponse(
            422,
            "Validation failed",
            "VALIDATION_ERROR",
            fieldErrors,
            LocalDateTime.now()
        );
        return ResponseEntity.status(422).body(error);
    }
}
```

---

## Related Documentation

- [Authentication Guide](./authentication.md)
- [API Endpoints](./endpoints.md)
- [Data Models](./models.md)
- [Best Practices](./best-practices.md)

---

**Last Updated**: 2026-06-12  
**Status**: Error Handling Guide Complete

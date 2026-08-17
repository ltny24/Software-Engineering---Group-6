# API Endpoints Reference

## Overview

Complete documentation of all API endpoints for the MyUS University Portal backend. All endpoints follow RESTful conventions.

---

## Endpoint Categories

1. **Authentication Endpoints** - User login, registration, token refresh
2. **User Endpoints** - Profile management, role queries
3. **Course Endpoints** - Course information and enrollment
4. **Admin Endpoints** - Administrative operations
5. **Public Endpoints** - Publicly accessible resources

---

## Authentication Endpoints

### 1. User Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "student@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "token_type": "Bearer",
  "user": {
    "id": "user123",
    "username": "student@example.com",
    "email": "student@example.com",
    "roles": ["STUDENT"]
  }
}
```

**Error (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Invalid username or password",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

### 2. User Registration

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newstudent@example.com",
  "email": "newstudent@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Response (201 Created):**
```json
{
  "id": "user124",
  "username": "newstudent@example.com",
  "email": "newstudent@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "createdAt": "2026-06-12T10:30:00Z"
}
```

---

### 3. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "token_type": "Bearer"
}
```

---

### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

## User Endpoints (Protected)

### 5. Get User Profile

```http
GET /api/user/profile
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "user123",
  "username": "student@example.com",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "createdAt": "2026-06-12T10:30:00Z",
  "lastLogin": "2026-06-12T10:30:00Z"
}
```

---

### 6. Update User Profile

```http
PUT /api/user/profile
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "email": "newstudent@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "user123",
  "username": "student@example.com",
  "email": "newstudent@example.com",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "role": "STUDENT",
  "updatedAt": "2026-06-12T10:30:00Z"
}
```

---

### 7. Get User Roles

```http
GET /api/user/roles
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "userId": "user123",
  "roles": ["STUDENT"],
  "permissions": [
    "view_courses",
    "enroll_courses",
    "view_grades"
  ]
}
```

---

### 8. Change Password

```http
POST /api/user/change-password
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

## Course Endpoints (Protected)

### 9. Get All Courses

```http
GET /api/courses
Authorization: Bearer <access_token>

Query Parameters:
  - page: number (default: 0)
  - size: number (default: 20)
  - sort: string (default: "id,asc")
  - search: string (optional)
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "course001",
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "description": "Basics of CS",
      "credits": 3,
      "semester": "Fall 2026",
      "instructor": "Dr. Smith"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 20
}
```

---

### 10. Get Course Details

```http
GET /api/courses/{courseId}
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "course001",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Basics of CS",
  "credits": 3,
  "semester": "Fall 2026",
  "instructor": {
    "id": "user001",
    "name": "Dr. Smith",
    "email": "smith@example.com"
  },
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "time": "10:00 AM - 11:30 AM",
    "location": "Room 201"
  },
  "capacity": 50,
  "enrolled": 45,
  "startDate": "2026-08-01",
  "endDate": "2026-12-15"
}
```

---

### 11. Enroll in Course

```http
POST /api/courses/{courseId}/enroll
Authorization: Bearer <access_token>
```

**Response (201 Created):**
```json
{
  "enrollmentId": "enroll001",
  "courseId": "course001",
  "userId": "user123",
  "status": "ACTIVE",
  "enrolledAt": "2026-06-12T10:30:00Z"
}
```

---

### 12. Unenroll from Course

```http
DELETE /api/courses/{courseId}/enroll
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Successfully unenrolled from course",
  "courseId": "course001",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

### 13. Get Enrolled Courses

```http
GET /api/user/courses
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "enrolledCourses": [
    {
      "enrollmentId": "enroll001",
      "courseId": "course001",
      "courseCode": "CS101",
      "courseTitle": "Introduction to Computer Science",
      "status": "ACTIVE",
      "enrolledAt": "2026-06-12T10:30:00Z",
      "grade": null
    }
  ]
}
```

---

## Admin Endpoints (Protected - ADMIN role required)

### 14. Get All Users

```http
GET /api/admin/users
Authorization: Bearer <access_token>

Query Parameters:
  - page: number (default: 0)
  - size: number (default: 20)
  - role: string (optional)
  - search: string (optional)
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "user001",
      "username": "admin@example.com",
      "email": "admin@example.com",
      "role": "ADMIN",
      "createdAt": "2026-06-12T10:30:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0
}
```

---

### 15. Delete User (ADMIN only)

```http
DELETE /api/admin/users/{userId}
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully",
  "userId": "user124",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

## Public Endpoints (No Authentication Required)

### 16. Health Check

```http
GET /api/public/health
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2026-06-12T10:30:00Z",
  "version": "1.0.0"
}
```

---

### 17. Get API Documentation

```http
GET /api/public/docs
```

**Response (200 OK):**
```json
{
  "title": "MyUS University Portal API",
  "version": "1.0.0",
  "description": "REST API for MyUS University Portal",
  "baseUrl": "http://localhost:8080/api"
}
```

---

## Response Format

### Success Response (2xx)

```json
{
  "data": { /* response data */ },
  "timestamp": "2026-06-12T10:30:00Z",
  "status": 200
}
```

### Error Response (4xx, 5xx)

```json
{
  "status": 400,
  "message": "Bad request",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ],
  "timestamp": "2026-06-12T10:30:00Z",
  "path": "/api/auth/register"
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (0-indexed)
- `size`: Page size (max 100)
- `sort`: Sort field and direction (e.g., `id,asc` or `createdAt,desc`)

**Response:**
```json
{
  "content": [/* items */],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 20,
  "hasNext": true,
  "hasPrevious": false
}
```

---

## Filtering and Searching

Endpoints support filtering and searching via query parameters:

```
GET /api/courses?search=CS&semester=Fall 2026&credits=3
```

---

## Related Documentation

- [Authentication Guide](./authentication.md)
- [Error Handling](./errors.md)
- [Data Models](./models.md)
- [Best Practices](./best-practices.md)

---

**Last Updated**: 2026-06-12  
**Status**: Endpoints Documentation Complete

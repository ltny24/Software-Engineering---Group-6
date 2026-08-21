# Data Models Reference

## Overview

This document describes the data models and entity relationships used in the MyUS University Portal API.

---

## User Model

### User Entity

```json
{
  "id": "user123",
  "username": "student@example.com",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2026-06-12T10:30:00Z",
  "updatedAt": "2026-06-12T10:30:00Z",
  "lastLogin": "2026-06-12T10:30:00Z"
}
```

### User Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Unique user identifier | Yes |
| `username` | string | Unique username (email format) | Yes |
| `email` | string | User email address | Yes |
| `firstName` | string | User first name | Yes |
| `lastName` | string | User last name | Yes |
| `role` | enum | User role (ADMIN, STAFF, STUDENT, FACULTY) | Yes |
| `status` | enum | User status (ACTIVE, INACTIVE, SUSPENDED) | Yes |
| `password` | string | Hashed password (not returned in API) | Yes |
| `createdAt` | timestamp | Account creation timestamp | Auto |
| `updatedAt` | timestamp | Last update timestamp | Auto |
| `lastLogin` | timestamp | Last login timestamp | Auto |

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **ADMIN** | System administrator | Full system access |
| **STAFF** | University staff | User management, course management |
| **STUDENT** | Student | View courses, enroll, view grades |
| **FACULTY** | Faculty member | Create courses, grade students |

---

## Course Model

### Course Entity

```json
{
  "id": "course001",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Basics of Computer Science concepts",
  "credits": 3,
  "semester": "Fall 2026",
  "instructor": {
    "id": "user001",
    "name": "Dr. Smith",
    "email": "smith@example.com"
  },
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "startTime": "10:00 AM",
    "endTime": "11:30 AM",
    "location": "Room 201"
  },
  "capacity": 50,
  "enrolled": 45,
  "startDate": "2026-08-01",
  "endDate": "2026-12-15",
  "status": "ACTIVE",
  "createdAt": "2026-06-12T10:30:00Z",
  "updatedAt": "2026-06-12T10:30:00Z"
}
```

### Course Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Unique course identifier | Yes |
| `code` | string | Course code (e.g., CS101) | Yes |
| `title` | string | Course title | Yes |
| `description` | string | Course description | No |
| `credits` | integer | Credit hours | Yes |
| `semester` | string | Semester offered | Yes |
| `instructor` | object | Instructor information | Yes |
| `schedule` | object | Course schedule details | Yes |
| `capacity` | integer | Maximum enrollment capacity | Yes |
| `enrolled` | integer | Current enrollment count | Auto |
| `startDate` | date | Course start date | Yes |
| `endDate` | date | Course end date | Yes |
| `status` | enum | Course status (ACTIVE, ARCHIVED, DRAFT) | Yes |
| `createdAt` | timestamp | Creation timestamp | Auto |
| `updatedAt` | timestamp | Last update timestamp | Auto |

### Schedule Object

```json
{
  "days": ["Monday", "Wednesday", "Friday"],
  "startTime": "10:00 AM",
  "endTime": "11:30 AM",
  "location": "Room 201"
}
```

---

## Enrollment Model

### Enrollment Entity

```json
{
  "id": "enroll001",
  "enrollmentId": "enroll001",
  "userId": "user123",
  "courseId": "course001",
  "courseName": "Introduction to Computer Science",
  "courseCode": "CS101",
  "status": "ACTIVE",
  "enrolledAt": "2026-06-12T10:30:00Z",
  "grade": null,
  "gradedAt": null,
  "attendance": {
    "total": 30,
    "attended": 28,
    "percentage": 93.33
  }
}
```

### Enrollment Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | string | Unique enrollment identifier | Yes |
| `userId` | string | User ID | Yes |
| `courseId` | string | Course ID | Yes |
| `status` | enum | Enrollment status (ACTIVE, COMPLETED, DROPPED, WITHDRAWN) | Yes |
| `enrolledAt` | timestamp | Enrollment date | Auto |
| `grade` | string | Final grade (A, B, C, D, F) | No |
| `gradedAt` | timestamp | Grade assignment date | No |
| `attendance` | object | Attendance information | No |

### Attendance Object

```json
{
  "total": 30,
  "attended": 28,
  "percentage": 93.33
}
```

---

## Authentication Models

### Login Request

```json
{
  "username": "student@example.com",
  "password": "securepassword123"
}
```

### Authentication Response

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
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

### Refresh Request

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### JWT Token Claims

```json
{
  "sub": "user123",
  "iss": "myus-university-portal",
  "aud": "myus-portal-users",
  "iat": 1686556200,
  "exp": 1686642600,
  "roles": ["STUDENT"]
}
```

---

## Pagination Model

### Paginated Response

```json
{
  "content": [
    { /* item 1 */ },
    { /* item 2 */ },
    { /* item 3 */ }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 20,
    "totalElements": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Pagination Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number (0-indexed) | 0 |
| `size` | integer | Page size (max 100) | 20 |
| `sort` | string | Sort field and direction | "id,asc" |

---

## Institution Models

### Semester Model

```json
{
  "id": "semester001",
  "code": "FALL2026",
  "name": "Fall 2026",
  "startDate": "2026-08-01",
  "endDate": "2026-12-15",
  "registrationStart": "2026-07-15",
  "registrationEnd": "2026-08-10",
  "status": "ACTIVE"
}
```

### Department Model

```json
{
  "id": "dept001",
  "code": "CS",
  "name": "Computer Science",
  "description": "Department of Computer Science",
  "head": {
    "id": "user002",
    "name": "Dr. Johnson",
    "email": "johnson@example.com"
  }
}
```

---

## Entity Relationships

### Relationship Diagram

```
User (STUDENT)
  ↓
  └─→ Enrollment ←─ Course (taught by Faculty/Staff)
  
User (ADMIN/STAFF)
  ↓
  └─→ User Management
  
User (FACULTY)
  ↓
  └─→ Course Creation & Grade Management
```

### One-to-Many Relationships

- **User → Enrollment**: One user can have multiple enrollments
- **Course → Enrollment**: One course can have multiple enrollments
- **Department → Course**: One department can have multiple courses
- **Faculty → Course**: One faculty can teach multiple courses

### Many-to-Many Relationships

- **User ↔ Course**: Through Enrollment
- **User ↔ Role**: User can have multiple roles

---

## Data Constraints

### User Constraints

- `username`: 3-50 characters, unique, must be valid email
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, hashed before storage
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters

### Course Constraints

- `code`: 3-10 characters, unique, alphanumeric
- `title`: 1-200 characters
- `credits`: 1-4 (typically)
- `capacity`: Minimum 1

### Enrollment Constraints

- One user cannot enroll in same course twice
- Enrollment allowed only if course capacity not exceeded
- Must occur within registration period

---

## Enums Reference

### User Status

```
ACTIVE: User account is active
INACTIVE: User account is inactive (not deleted)
SUSPENDED: User account is suspended/locked
DELETED: User account is deleted (soft delete)
```

### Course Status

```
DRAFT: Course is in draft state
ACTIVE: Course is currently active/open
ARCHIVED: Course is archived (past semester)
CANCELLED: Course was cancelled
```

### Enrollment Status

```
ACTIVE: Student is actively enrolled
COMPLETED: Course completed
DROPPED: Student dropped course
WITHDRAWN: Student withdrew from course
```

### Grade

```
A: Excellent (90-100)
B: Good (80-89)
C: Satisfactory (70-79)
D: Passing (60-69)
F: Failing (<60)
```

---

## Related Documentation

- [API Endpoints](./endpoints.md)
- [Authentication Guide](./authentication.md)
- [Error Handling](./errors.md)
- [Best Practices](./best-practices.md)

---

**Last Updated**: 2026-06-12  
**Status**: Data Models Documentation Complete

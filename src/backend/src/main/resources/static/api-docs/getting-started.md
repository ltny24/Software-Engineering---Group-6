# Getting Started with MyUS University Portal API

## Quick Start Guide

This guide will help you get started with the MyUS University Portal API in 5 minutes.

---

## Prerequisites

- API base URL: `http://localhost:8080/api`
- Valid user credentials (for authentication)
- HTTP client (Postman, cURL, JavaScript Fetch, etc.)

---

## Step 1: Get Access Token (Login)

### Using cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student@example.com",
    "password": "securepassword123"
  }'
```

### Using JavaScript

```javascript
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'student@example.com',
    password: 'securepassword123'
  })
});

const auth = await loginResponse.json();
const accessToken = auth.access_token;
```

### Using Postman

1. Open Postman
2. Create new request: `POST` to `http://localhost:8080/api/auth/login`
3. Go to Body → Raw → JSON
4. Paste:
```json
{
  "username": "student@example.com",
  "password": "securepassword123"
}
```
5. Click Send

**Response:**
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

---

## Step 2: Call Protected Endpoint

### Using cURL

```bash
# Save the access token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Call protected endpoint
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:8080/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const profile = await response.json();
console.log(profile);
```

### Using Postman

1. Create new request: `GET` to `http://localhost:8080/api/user/profile`
2. Go to "Authorization" tab
3. Select Type: **Bearer Token**
4. Paste token in Token field
5. Click Send

**Response:**
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

## Step 3: List Courses

### Using cURL

```bash
curl -X GET "http://localhost:8080/api/courses?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:8080/api/courses?page=0&size=10', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

const coursesData = await response.json();
console.log(coursesData.content); // List of courses
```

**Response:**
```json
{
  "content": [
    {
      "id": "course001",
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "credits": 3,
      "semester": "Fall 2026",
      "instructor": {
        "name": "Dr. Smith"
      },
      "capacity": 50,
      "enrolled": 45
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 10,
    "totalElements": 50,
    "totalPages": 5,
    "hasNext": true
  }
}
```

---

## Step 4: Enroll in Course

### Using cURL

```bash
curl -X POST http://localhost:8080/api/courses/course001/enroll \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Using JavaScript

```javascript
const enrollResponse = await fetch(
  'http://localhost:8080/api/courses/course001/enroll',
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const enrollment = await enrollResponse.json();
console.log(enrollment);
```

**Response:**
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

## Step 5: Refresh Token (Optional but Important)

When your access token expires (after 24 hours):

### Using cURL

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Using JavaScript

```javascript
const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refresh_token: refreshToken
  })
});

const newAuth = await refreshResponse.json();
// Update accessToken with new token
```

---

## Common API Flows

### Flow 1: User Registration & Login

```
1. POST /api/auth/register (create account)
   ↓
2. POST /api/auth/login (get tokens)
   ↓
3. Store tokens
   ↓
4. Use access_token for API calls
```

### Flow 2: Course Enrollment

```
1. Get access token (login)
   ↓
2. GET /api/courses (list courses)
   ↓
3. GET /api/courses/{id} (view course details)
   ↓
4. POST /api/courses/{id}/enroll (enroll)
   ↓
5. GET /api/user/courses (verify enrollment)
```

### Flow 3: Token Refresh

```
1. API returns 401 (Token Expired)
   ↓
2. POST /api/auth/refresh (get new token)
   ↓
3. Retry original request with new token
   ↓
4. Continue as normal
```

---

## Tools for API Testing

### 1. **Postman** (GUI)
- Download: https://www.postman.com
- Import OpenAPI spec: `http://localhost:8080/v3/api-docs`
- Test endpoints interactively
- Save requests for reuse

### 2. **cURL** (Command Line)
```bash
# Built into most systems
curl -X GET http://localhost:8080/api/resource \
  -H "Authorization: Bearer <token>"
```

### 3. **JavaScript/Fetch** (Frontend)
```javascript
const response = await fetch('/api/resource', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 4. **Python/Requests** (Backend)
```python
import requests

headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8080/api/resource', headers=headers)
```

### 5. **Swagger UI** (Interactive)
- Access: `http://localhost:8080/swagger-ui.html`
- Interactive API documentation
- Try endpoints directly in browser

---

## Common Mistakes to Avoid

### 1. Forgetting Authorization Header
**Wrong:**
```bash
curl http://localhost:8080/api/user/profile
```

**Correct:**
```bash
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### 2. Wrong Bearer Token Format
**Wrong:**
```bash
Authorization: <token>
Authorization: JWT <token>
Authorization: Token <token>
```

**Correct:**
```bash
Authorization: Bearer <token>
```

### 3. Using Expired Token
**Wrong:**
```javascript
// 24 hours later...
await fetch('/api/resource', {
  headers: { 'Authorization': `Bearer ${oldToken}` }
});
// Returns 401 Unauthorized
```

**Correct:**
```javascript
if (tokenExpired()) {
  await refreshToken();
}
await fetch('/api/resource', {
  headers: { 'Authorization': `Bearer ${newToken}` }
});
```

### 4. Sending Credentials as Query Parameters
**Wrong:**
```bash
GET /api/user/profile?token=abc123
```

**Correct:**
```bash
GET /api/user/profile
Authorization: Bearer abc123
```

### 5. Not Setting Content-Type Header
**Wrong:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -d '{"username":"user","password":"pass"}'
```

**Correct:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

---

## Troubleshooting

### Problem: 401 Unauthorized

**Causes:**
- Missing Authorization header
- Invalid token format (not Bearer format)
- Token expired
- Token signature invalid

**Solutions:**
1. Check Authorization header is present
2. Verify token format: `Bearer <token>`
3. Refresh token if expired
4. Re-authenticate if token invalid

### Problem: 403 Forbidden

**Causes:**
- Insufficient permissions
- User role doesn't have access

**Solutions:**
1. Check user role in login response
2. Verify endpoint requires lower privilege
3. Use admin account for admin endpoints
4. Check role-based access control

### Problem: 422 Unprocessable Entity

**Causes:**
- Missing required fields
- Invalid field format
- Field validation failed

**Solutions:**
1. Check error message for details
2. Verify all required fields provided
3. Check field format (e.g., email format)
4. Review [Error Handling](./errors.md) guide

### Problem: 404 Not Found

**Causes:**
- Resource doesn't exist
- Wrong endpoint path
- Wrong resource ID

**Solutions:**
1. Verify resource ID is correct
2. Check endpoint path spelling
3. Verify resource exists (list endpoints)
4. Check API documentation

---

## Next Steps

1. **Read Authentication Guide**: [authentication.md](./authentication.md)
2. **Explore All Endpoints**: [endpoints.md](./endpoints.md)
3. **Understand Data Models**: [models.md](./models.md)
4. **Handle Errors Properly**: [errors.md](./errors.md)
5. **Follow Best Practices**: [best-practices.md](./best-practices.md)

---

## Useful Links

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/api/public/health
- **API Docs Home**: http://localhost:8080/api-docs/

---

**Last Updated**: 2026-06-12  
**Status**: Getting Started Guide Complete

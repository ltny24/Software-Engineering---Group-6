# Authentication Guide

## Overview

The MyUS University Portal API uses **JWT (JSON Web Tokens)** for authentication. All protected endpoints require a valid JWT token in the `Authorization` header.

---

## JWT Token Structure

A JWT token consists of three parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Parts:
1. **Header**: Algorithm and token type
2. **Payload**: Claims (user data, expiration, etc.)
3. **Signature**: Cryptographic signature for verification

---

##Token Configuration

| Property | Value | Environment Variable |
|----------|-------|----------------------|
| **Algorithm** | HS256 | `app.jwt.algorithm` |
| **Expiration** | 24 hours (86,400 seconds) | `JWT_EXPIRATION_MS` |
| **Refresh Token Expiration** | 7 days (604,800 seconds) | `JWT_REFRESH_EXPIRATION_MS` |
| **Issuer** | `myus-university-portal` | `app.jwt.issuer` |
| **Audience** | `myus-portal-users` | `app.jwt.audience` |
| **Secret Key** | 256-bit Base64 encoded | `JWT_SECRET` or `app.jwt.secret` |

---

##Authentication Workflow

### 1. User Login

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "student@example.com",
  "password": "securepassword123"
}
```

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
    "roles": ["STUDENT"]
  }
}
```

---

### 2. Use Access Token in Requests

**Authorization Header Format:**
```
Authorization: Bearer <access_token>
```

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Token Refresh

When access token expires (after 24 hours), use refresh token to get a new one:

**Request:**
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
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

**Request:**
```bash
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Environment Configuration

### Properties File: `application.properties`

```properties
# JWT Configuration
app.jwt.secret=${JWT_SECRET:replace-with-a-secure-256-bit-base64-encoded-secret}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
app.jwt.refresh-expiration-ms=${JWT_REFRESH_EXPIRATION_MS:604800000}
app.jwt.algorithm=HS256
app.jwt.issuer=myus-university-portal
app.jwt.audience=myus-portal-users
```

### Environment Variables

Set these in your deployment environment:

```bash
# Production: Use a strong 256-bit Base64 encoded secret
JWT_SECRET=ac678b9730130f73864979bc8616a8f7772d2f29151f26e91d1ef3d9a4800da7

# Token Expiration: 24 hours in milliseconds
JWT_EXPIRATION_MS=86400000

# Refresh Token Expiration: 7 days in milliseconds
JWT_REFRESH_EXPIRATION_MS=604800000
```

---

## 🛡️ Security Best Practices

### 1. JWT Secret Management
- ✅ Use a strong 256-bit Base64 encoded secret
- ✅ Store in environment variables, never hardcode
- ✅ Rotate secrets periodically
- ❌ Never commit secrets to version control

### 2. Token Storage (Frontend)
- ✅ Store in HTTP-only cookies (most secure)
- ✅ Store in memory (for sensitive apps)
- ❌ Store in localStorage (vulnerable to XSS)
- ❌ Store in sessionStorage (vulnerable to XSS)

### 3. Token Transmission
- ✅ Always use HTTPS (never HTTP)
- ✅ Use Authorization header with Bearer scheme
- ✅ Implement CORS properly
- ❌ Send tokens in URL query parameters
- ❌ Send tokens in request body without need

### 4. Token Expiration
- ✅ Keep access tokens short-lived (24 hours)
- ✅ Keep refresh tokens longer-lived (7 days)
- ✅ Implement token refresh mechanism
- ❌ Issue tokens that never expire

### 5. HTTPS/TLS
- ✅ Always use HTTPS in production
- ✅ Use valid SSL/TLS certificates
- ✅ Implement security headers (HSTS, CSP)
- ❌ Use HTTP for production APIs

---

## Role-Based Access Control (RBAC)

### Available Roles

| Role | Description | Access |
|------|-------------|--------|
| **ADMIN** | System administrator | All endpoints |
| **STAFF** | University staff | Staff endpoints |
| **STUDENT** | Students | Student endpoints |
| **FACULTY** | Faculty members | Faculty endpoints |

### Using @PreAuthorize

```java
@GetMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> adminDashboard() {
    // Only ADMIN users can access
    return ResponseEntity.ok("Welcome Admin");
}

@GetMapping("/student/courses")
@PreAuthorize("hasRole('STUDENT')")
public ResponseEntity<?> getStudentCourses() {
    // Only STUDENT users can access
    return ResponseEntity.ok("Student Courses");
}
```

---

## Error Responses

### 400 Bad Request - Invalid Credentials

```json
{
  "status": 400,
  "message": "Invalid username or password",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

### 401 Unauthorized - Missing Token

```json
{
  "status": 401,
  "message": "Unauthorized: Missing or invalid token",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

### 401 Unauthorized - Expired Token

```json
{
  "status": 401,
  "message": "Unauthorized: Token has expired",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

### 403 Forbidden - Insufficient Permissions

```json
{
  "status": 403,
  "message": "Forbidden: Insufficient permissions",
  "timestamp": "2026-06-12T10:30:00Z"
}
```

---

## Testing Authentication

### Using cURL

```bash
# 1. Login
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student@example.com",
    "password": "password123"
  }')

# Extract token
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

# 2. Use token
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Using Postman

1. **Login Request**:
   - Method: POST
   - URL: `http://localhost:8080/api/auth/login`
   - Body: Raw JSON
   ```json
   {
     "username": "student@example.com",
     "password": "password123"
   }
   ```

2. **Set Authorization**:
   - Copy `access_token` from response
   - Go to "Authorization" tab
   - Type: Bearer Token
   - Paste token

3. **Protected Request**:
   - Method: GET
   - URL: `http://localhost:8080/api/user/profile`
   - Authorization automatically included

---

## Token Lifecycle

```
┌──────────────┐
│   LOGIN      │
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────┐
│ Issue Access Token (24 hours)       │
│ Issue Refresh Token (7 days)        │
└──────┬──────────────────────────────┘
       │
       ├─→  Use for API calls (< 24 hours)
       │
       ├─→  Access Token Expires (24 hours)
       │     Use Refresh Token → Get New Access Token
       │
       └─→  Refresh Token Expires (7 days)
             → Re-login Required
```

---

## Implementation Example

```java
// Login endpoint
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // Authenticate user
    // Generate tokens using JwtProvider
    String accessToken = jwtProvider.generateToken(userId, claims);
    String refreshToken = jwtProvider.generateRefreshToken(userId);
    
    return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
}

// Protected endpoint
@GetMapping("/profile")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> getProfile() {
    // User automatically extracted from JWT
    String userId = SecurityContextHolder.getContext()
        .getAuthentication().getName();
    
    return ResponseEntity.ok(userService.getUser(userId));
}

// Refresh token endpoint
@PostMapping("/refresh")
public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest request) {
    String userId = jwtProvider.getUserIdFromToken(request.getRefreshToken());
    String newAccessToken = jwtProvider.generateToken(userId, new HashMap<>());
    
    return ResponseEntity.ok(new AuthResponse(newAccessToken, request.getRefreshToken()));
}
```

---

## Related Documentation

- [API Endpoints](./endpoints.md)
- [Error Handling](./errors.md)
- [Best Practices](./best-practices.md)
- [Data Models](./models.md)

---

**Last Updated**: 2026-06-12  
**Status**: Authentication Guide Complete

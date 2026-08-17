# API Best Practices

## Overview

This guide outlines best practices for consuming the MyUS University Portal API to ensure secure, reliable, and maintainable integrations.

---

## Security Best Practices

### 1. Token Management

**DO:**
- Store tokens securely (HTTP-only cookies for web)
- Use HTTPS exclusively (never HTTP)
- Implement token refresh before expiration
- Validate token signature on backend
- Implement logout (token invalidation)
- Rotate tokens regularly

**DON'T:**
- Store tokens in localStorage (XSS vulnerable)
- Hardcode tokens in code
- Transmit tokens over HTTP
- Use tokens that never expire
- Log sensitive token data
- Share tokens between users

### 2. Password Security

**DO:**
- Enforce minimum 8 character passwords
- Require mixed character types (upper, lower, numbers, symbols)
- Implement rate limiting on login attempts
- Hash passwords with strong algorithms (bcrypt, scrypt)
- Require password change on first login
- Implement password reset via email

**DON'T:**
- Accept weak passwords
- Store passwords in plain text
- Log passwords anywhere
- Allow unlimited login attempts
- Use outdated hashing (MD5, SHA1)
- Transmit passwords over HTTP

### 3. API Key/Token Rotation

```
Current Token
     ↓
Monitor Expiration (24 hours)
     ↓
Refresh 1 hour before expiration
     ↓
New Token
     ↓
Continue using new token
```

### 4. HTTPS/TLS

**DO:**
- Use HTTPS for all requests
- Use TLS 1.2 or higher
- Keep SSL certificates up to date
- Implement HSTS header
- Pin certificates in mobile apps

**DON'T:**
- Use HTTP in production
- Ignore certificate validation
- Use expired certificates
- Disable security warnings

---

## API Call Best Practices

### 1. Error Handling

**DO:**

```javascript
// Proper error handling
try {
  const response = await fetch('/api/resource', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 401) {
      // Token expired - refresh and retry
      await refreshToken();
      return retryRequest();
    } else if (response.status === 422) {
      // Validation error - show to user
      displayValidationErrors(error.errors);
    } else {
      throw new Error(error.message);
    }
  }
  
  return await response.json();
} catch (error) {
  // Log and handle error appropriately
  console.error('API error:', error);
  showErrorNotification('An error occurred. Please try again.');
}
```

**DON'T:**

```javascript
// Improper error handling
const data = await fetch('/api/resource').then(r => r.json());
// No error checking - will crash if request fails!
```

### 2. Request Timeouts

**DO:**

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

try {
  const response = await fetch('/api/resource', {
    signal: controller.signal,
    headers: { 'Authorization': `Bearer ${token}` }
  });
} finally {
  clearTimeout(timeoutId);
}
```

**DON'T:**
- Send requests without timeout
- Wait indefinitely for responses

### 3. Retry Logic

**DO:**

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Use it
const data = await retryWithBackoff(() => 
  fetch('/api/resource', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
);
```

**DON'T:**
- Retry immediately (hammer the server)
- Retry indefinitely
- Retry all requests (only for idempotent operations)

### 4. Connection Management

**DO:**
- Reuse HTTP connections (keep-alive)
- Close connections properly
- Implement connection pooling
- Monitor connection health
- Implement circuit breaker pattern

**DON'T:**
- Create new connection per request
- Leave connections hanging
- Exceed connection limits

---

## Request/Response Best Practices

### 1. Request Structure

**DO:**

```bash
# Include required headers
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

# Include request body for POST/PUT
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@example.com",
    "password": "securepassword"
  }'
```

### 2. Content Negotiation

**DO:**
- Always specify `Content-Type: application/json`
- Always specify `Accept: application/json`
- Handle different response types gracefully

### 3. Request Body

**DO:**
- Validate input before sending
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Include all required fields
- Use snake_case or camelCase consistently
- Send minimal required data

**DON'T:**
- Send unnecessary fields
- Mix naming conventions
- Send invalid data types
- Use GET for state-changing operations

### 4. Response Handling

**DO:**

```javascript
const response = await fetch('/api/resource');
const data = await response.json();

// Check status
if (response.ok) {
  // Handle success (2xx)
  console.log('Success:', data);
} else if (response.status === 401) {
  // Handle unauthorized
  redirectToLogin();
} else if (response.status === 422) {
  // Handle validation error
  showErrors(data.errors);
} else {
  // Handle other errors
  showError(data.message);
}
```

---

## Pagination Best Practices

### 1. Pagination Query

**DO:**

```bash
# Request page 2, 20 items per page
GET /api/courses?page=1&size=20&sort=createdAt,desc

# Use reasonable defaults
GET /api/courses  # Uses default page=0, size=20
```

### 2. Pagination Handling

**DO:**

```javascript
async function* getAllItems(endpoint) {
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${endpoint}?page=${page}&size=20`);
    const data = await response.json();
    
    yield* data.content; // Yield each item
    
    hasMore = data.pagination.hasNext;
    page++;
  }
}

// Usage
for await (const item of getAllItems('/api/courses')) {
  console.log(item);
}
```

**DON'T:**
- Request all items at once
- Parse large response bodies
- Load all items into memory

---

## Filtering and Searching

### 1. Query Parameters

**DO:**

```bash
# Proper query format
GET /api/courses?search=CS&semester=Fall%202026&credits=3

# URL encode special characters
GET /api/courses?search=Advanced%20CS
```

**DON'T:**
- Use multiple APIs for filtering
- Pass unsanitized input
- Use very restrictive filters that return no results

### 2. Filtering Strategy

**DO:**
- Use server-side filtering (not client-side on large datasets)
- Implement full-text search for text fields
- Support multiple filter criteria
- Document all supported filters

---

## Performance Best Practices

### 1. Request Optimization

**DO:**
- Batch multiple requests when possible
- Use pagination for large datasets
- Implement caching strategies
- Use conditional requests (ETag, Last-Modified)
- Compress request/response bodies

### 2. Caching Strategy

**DO:**

```javascript
// Implement client-side cache
class APICache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  set(key, value, ttl = this.ttl) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }
}

// Usage
const cache = new APICache();
const courses = cache.get('courses') || 
  await fetch('/api/courses').then(r => r.json());
cache.set('courses', courses);
```

### 3. Batch Operations

**DO:**

```javascript
// Instead of multiple requests
// DO THIS:
const enrollments = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    users: ['user1', 'user2', 'user3'],
    courseId: 'course001'
  })
});

// NOT THIS:
await fetch('/api/users/user1/enroll', { method: 'POST' });
await fetch('/api/users/user2/enroll', { method: 'POST' });
await fetch('/api/users/user3/enroll', { method: 'POST' });
```

---

## Monitoring and Logging

### 1. Request Logging

**DO:**

```javascript
// Log important information
logger.info({
  timestamp: new Date(),
  endpoint: '/api/user/profile',
  method: 'GET',
  status: response.status,
  duration: endTime - startTime,
  userId: 'user123'
});
```

**DON'T:**
- Log sensitive data (passwords, tokens)
- Log large request bodies
- Log unnecessarily verbose information

### 2. Error Monitoring

**DO:**
- Track error rates by endpoint
- Monitor 5xx errors separately from 4xx
- Implement alerting for critical errors
- Track response times
- Monitor token expiration

### 3. Metrics to Track

```
- Request count per endpoint
- Average response time
- Error rate (4xx and 5xx)
- Token refresh rate
- Cache hit rate
- Pagination distribution
```

---

## Testing Best Practices

### 1. Unit Tests

**DO:**

```javascript
describe('API Client', () => {
  it('should refresh token on 401', async () => {
    fetchMock.mockResponseOnce({ status: 401 }, { status: 401 });
    fetchMock.mockResponseOnce(authResponse);
    
    const result = await apiClient.get('/protected');
    
    expect(fetchMock.callCount()).toBe(2); // Initial + retry
  });
  
  it('should handle validation errors', async () => {
    fetchMock.mockResponseOnce(validationError, { status: 422 });
    
    await expect(apiClient.post('/register', data))
      .rejects.toThrow('Validation failed');
  });
});
```

### 2. Integration Tests

**DO:**
- Test full authentication flow
- Test protected endpoint access
- Test token refresh mechanism
- Test error scenarios
- Test with real server (staging environment)

### 3. Load Testing

**DO:**
- Test with realistic load
- Monitor rate limiting
- Test pagination performance
- Test connection limits

---

## Related Documentation

- [Authentication Guide](./authentication.md)
- [API Endpoints](./endpoints.md)
- [Error Handling](./errors.md)
- [Data Models](./models.md)

---

**Last Updated**: 2026-06-12  
**Status**: Best Practices Guide Complete

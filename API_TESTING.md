# API Testing Guide

Use these examples to test your API endpoints with curl or Postman.

## Authentication

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isPremium": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Sessions

### Create Session
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "task": "Writing project report",
    "duration": 1800,
    "mood": "focused"
  }'
```

### Get All Sessions
```bash
curl http://localhost:5000/api/sessions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Session Statistics
```bash
curl http://localhost:5000/api/sessions/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Session
```bash
curl -X PUT http://localhost:5000/api/sessions/SESSION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "task": "Updated task name",
    "mood": "calm"
  }'
```

### Delete Session
```bash
curl -X DELETE http://localhost:5000/api/sessions/SESSION_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Tasks

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Complete assignment",
    "description": "Finish the database design",
    "priority": "high"
  }'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Tasks by Status
```bash
curl "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "in-progress",
    "priority": "medium"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Payment

### Create Checkout Session
```bash
curl -X POST http://localhost:5000/api/payment/create-checkout-session \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Verify Payment
```bash
curl -X POST http://localhost:5000/api/payment/verify-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sessionId": "cs_test_..."
  }'
```

### Check Premium Status
```bash
curl http://localhost:5000/api/payment/premium-status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Postman

### Setup
1. Create a new environment in Postman
2. Add variable: `baseURL` = `http://localhost:5000`
3. Add variable: `token` = (will be set after login)

### Collection Structure

**Authentication Folder:**
- POST {{baseURL}}/api/auth/register
- POST {{baseURL}}/api/auth/login
- GET {{baseURL}}/api/auth/me

**Sessions Folder:**
- GET {{baseURL}}/api/sessions
- GET {{baseURL}}/api/sessions/stats
- POST {{baseURL}}/api/sessions
- PUT {{baseURL}}/api/sessions/:id
- DELETE {{baseURL}}/api/sessions/:id

**Tasks Folder:**
- GET {{baseURL}}/api/tasks
- POST {{baseURL}}/api/tasks
- PUT {{baseURL}}/api/tasks/:id
- DELETE {{baseURL}}/api/tasks/:id

**Payment Folder:**
- POST {{baseURL}}/api/payment/create-checkout-session
- POST {{baseURL}}/api/payment/verify-session
- GET {{baseURL}}/api/payment/premium-status

### Auto-Set Token

In Login request, add this to Tests tab:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

Then use `{{token}}` in Authorization header for other requests.

## Common Response Codes

- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid data
- 401 Unauthorized - No/invalid token
- 404 Not Found - Resource not found
- 500 Server Error - Server problem

## Error Response Format

```json
{
  "message": "Error description here"
}
```

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login
- Replace `SESSION_ID` and `TASK_ID` with actual IDs from database
- All protected endpoints require Authorization header
- Dates are in ISO 8601 format
- Durations are in seconds

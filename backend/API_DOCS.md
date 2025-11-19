# API Documentation

Complete reference for the Momentum Goal Tracking API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-11-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Email already registered or validation errors
- `500`: Server error

---

### Login

Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**
- `401`: Invalid email or password
- `500`: Server error

---

### Get Current User

Get the profile of the authenticated user.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-11-15T10:30:00.000Z",
    "lastLogin": "2025-11-15T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: No token or invalid token
- `404`: User not found
- `500`: Server error

---

## Goals Endpoints

### Get All Goals

Retrieve all goals for the authenticated user.

**Endpoint:** `GET /goals`

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters (Optional):**
- `category`: Filter by category (`fitness`, `nutrition`, `job_search`)
- `status`: Filter by status (`active`, `completed`, `paused`, `abandoned`)

**Example:**
```
GET /goals?category=fitness&status=active
```

**Success Response (200):**
```json
{
  "goals": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "category": "fitness",
      "title": "Run 100 miles this month",
      "description": "Monthly running goal",
      "targetValue": 100,
      "targetUnit": "miles",
      "startDate": "2025-11-01",
      "endDate": "2025-11-30",
      "status": "active",
      "createdAt": "2025-11-01T08:00:00.000Z",
      "updatedAt": "2025-11-01T08:00:00.000Z"
    }
  ]
}
```

---

### Get Single Goal

Retrieve a specific goal by ID.

**Endpoint:** `GET /goals/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "goal": {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "category": "fitness",
    "title": "Run 100 miles this month",
    "description": "Monthly running goal",
    "targetValue": 100,
    "targetUnit": "miles",
    "startDate": "2025-11-01",
    "endDate": "2025-11-30",
    "status": "active",
    "createdAt": "2025-11-01T08:00:00.000Z",
    "updatedAt": "2025-11-01T08:00:00.000Z"
  }
}
```

**Error Responses:**
- `404`: Goal not found
- `500`: Server error

---

### Create Goal

Create a new goal.

**Endpoint:** `POST /goals`

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "category": "fitness",
  "title": "Run 100 miles this month",
  "description": "Monthly running goal",
  "targetValue": 100,
  "targetUnit": "miles",
  "startDate": "2025-11-01",
  "endDate": "2025-11-30"
}
```

**Required Fields:**
- `category`: One of `fitness`, `nutrition`, `job_search`
- `title`: String
- `startDate`: ISO 8601 date

**Optional Fields:**
- `description`: String
- `targetValue`: Number
- `targetUnit`: String
- `endDate`: ISO 8601 date

**Success Response (201):**
```json
{
  "message": "Goal created successfully",
  "goal": {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "category": "fitness",
    "title": "Run 100 miles this month",
    "description": "Monthly running goal",
    "targetValue": 100,
    "targetUnit": "miles",
    "startDate": "2025-11-01",
    "endDate": "2025-11-30",
    "status": "active",
    "createdAt": "2025-11-01T08:00:00.000Z",
    "updatedAt": "2025-11-01T08:00:00.000Z"
  }
}
```

---

### Update Goal

Update an existing goal.

**Endpoint:** `PUT /goals/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Request Body (all fields optional):**
```json
{
  "title": "Run 120 miles this month",
  "targetValue": 120,
  "status": "completed"
}
```

**Allowed Status Values:**
- `active`
- `completed`
- `paused`
- `abandoned`

**Success Response (200):**
```json
{
  "message": "Goal updated successfully",
  "goal": { ... }
}
```

---

### Delete Goal

Delete a goal and all its progress entries.

**Endpoint:** `DELETE /goals/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "message": "Goal deleted successfully"
}
```

---

## Progress Entries Endpoints

### Get Progress Entries

Get all progress entries for a specific goal.

**Endpoint:** `GET /progress?goalId=:goalId`

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `goalId` (required): UUID of the goal
- `startDate` (optional): Filter entries from this date
- `endDate` (optional): Filter entries until this date

**Example:**
```
GET /progress?goalId=650e8400-e29b-41d4-a716-446655440000&startDate=2025-11-01&endDate=2025-11-15
```

**Success Response (200):**
```json
{
  "entries": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "goalId": "650e8400-e29b-41d4-a716-446655440000",
      "entryDate": "2025-11-15",
      "value": 5.2,
      "unit": "miles",
      "notes": "Morning run in the park",
      "createdAt": "2025-11-15T09:00:00.000Z",
      "updatedAt": "2025-11-15T09:00:00.000Z"
    }
  ]
}
```

---

### Get Single Progress Entry

Retrieve a specific progress entry.

**Endpoint:** `GET /progress/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "entry": {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "goalId": "650e8400-e29b-41d4-a716-446655440000",
    "entryDate": "2025-11-15",
    "value": 5.2,
    "unit": "miles",
    "notes": "Morning run in the park",
    "createdAt": "2025-11-15T09:00:00.000Z",
    "updatedAt": "2025-11-15T09:00:00.000Z"
  }
}
```

---

### Create Progress Entry

Log progress for a goal.

**Endpoint:** `POST /progress`

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "goalId": "650e8400-e29b-41d4-a716-446655440000",
  "entryDate": "2025-11-15",
  "value": 5.2,
  "unit": "miles",
  "notes": "Morning run in the park"
}
```

**Required Fields:**
- `goalId`: UUID
- `entryDate`: ISO 8601 date
- `value`: Number

**Optional Fields:**
- `unit`: String
- `notes`: String

**Success Response (201):**
```json
{
  "message": "Progress entry created successfully",
  "entry": { ... }
}
```

**Error Responses:**
- `400`: Duplicate entry (one entry per goal per date)
- `404`: Goal not found

---

### Update Progress Entry

Update an existing progress entry.

**Endpoint:** `PUT /progress/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Request Body (all optional):**
```json
{
  "value": 6.0,
  "notes": "Updated: Actually ran 6 miles"
}
```

**Success Response (200):**
```json
{
  "message": "Progress entry updated successfully",
  "entry": { ... }
}
```

---

### Delete Progress Entry

Delete a progress entry.

**Endpoint:** `DELETE /progress/:id`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "message": "Progress entry deleted successfully"
}
```

---

## Analytics Endpoints

### Dashboard Statistics

Get overall dashboard statistics.

**Endpoint:** `GET /analytics/dashboard`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "dashboard": {
    "goals": {
      "total": 15,
      "active": 10,
      "completed": 5,
      "byCategory": {
        "fitness": 6,
        "nutrition": 5,
        "jobSearch": 4
      }
    },
    "progressEntries": {
      "total": 145,
      "lastSevenDays": 12
    }
  }
}
```

---

### Goal Analytics

Get detailed analytics for a specific goal.

**Endpoint:** `GET /analytics/goal/:goalId`

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters (Optional):**
- `period`: Time period (`7d`, `30d`, `90d`, `all`) - default: `30d`

**Example:**
```
GET /analytics/goal/650e8400-e29b-41d4-a716-446655440000?period=30d
```

**Success Response (200):**
```json
{
  "goalId": "650e8400-e29b-41d4-a716-446655440000",
  "goalTitle": "Run 100 miles this month",
  "targetValue": 100,
  "targetUnit": "miles",
  "period": "30d",
  "statistics": {
    "count": 15,
    "average": 5.5,
    "min": 2.1,
    "max": 8.7,
    "latest": 6.2,
    "progressPercentage": 85.5,
    "trend": "increasing"
  },
  "data": [
    {
      "date": "2025-11-01",
      "value": 5.0,
      "unit": "miles",
      "notes": "Easy run"
    }
  ]
}
```

**Trend Values:**
- `increasing`: Progress is improving
- `decreasing`: Progress is declining
- `stable`: Progress is consistent

---

### Trends Analysis

Get trend analysis across all goals by category.

**Endpoint:** `GET /analytics/trends`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "period": "30 days",
  "trends": {
    "fitness": [
      {
        "date": "2025-11-01",
        "entriesCount": 3,
        "avgValue": 5.2
      }
    ],
    "nutrition": [...],
    "job_search": [...]
  }
}
```

---

### Streak Analysis

Get current and longest streak of consecutive days with progress entries.

**Endpoint:** `GET /analytics/streak`

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "currentStreak": 7,
  "longestStreak": 15
}
```

---

## Error Responses

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Goal not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting in production using packages like `express-rate-limit`.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## Example Workflows

### Complete User Journey

1. **Register**
   ```bash
   POST /api/auth/register
   ```

2. **Create a Fitness Goal**
   ```bash
   POST /api/goals
   {
     "category": "fitness",
     "title": "Daily Steps",
     "targetValue": 10000,
     "targetUnit": "steps",
     "startDate": "2025-11-01"
   }
   ```

3. **Log Daily Progress**
   ```bash
   POST /api/progress
   {
     "goalId": "...",
     "entryDate": "2025-11-15",
     "value": 8500,
     "unit": "steps"
   }
   ```

4. **Check Analytics**
   ```bash
   GET /api/analytics/dashboard
   GET /api/analytics/goal/:goalId?period=7d
   GET /api/analytics/streak
   ```

---

## Testing with Postman

Import these endpoints into Postman:
1. Create a new collection "Momentum API"
2. Add environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: Your JWT token
3. Set Authorization header: `Bearer {{token}}`

## Testing with cURL

See examples throughout this document, or check `QUICKSTART.md` for more examples.

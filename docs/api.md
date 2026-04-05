# Sales Goals Tracker — API Documentation

**Base URL (production):** `https://<your-railway-app>.railway.app`  
**Base URL (local):** `http://localhost:3000`

All protected endpoints require a `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/login

Authenticate a promoter and receive a JWT.

**Request body:**
```json
{
  "email": "ana@example.com",
  "password": "password123"
}
```

**Validation rules:**
- `email` — required, valid email format
- `password` — required, minimum 6 characters

**Success `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "Ana",
    "email": "ana@example.com"
  }
}
```

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Missing or malformed fields |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |

**JWT details:**
- Algorithm: `HS256`
- Expiry: `8h` (configurable via `JWT_EXPIRES_IN`)
- Payload: `{ sub: userId, email, iat, exp }`

---

## Sales

### POST /ventas

Register a new sale. **Auth required.**

**Request headers:**
```
Authorization: Bearer <token>
```

**Request body:**
```json
{
  "amount": 1500.00,
  "description": "Enterprise client deal",
  "date": "2026-04-04"
}
```

**Validation rules:**
- `amount` — required, positive number
- `description` — optional string
- `date` — required, format `YYYY-MM-DD`

**Success `201`:**
```json
{
  "id": 3,
  "user_id": 1,
  "amount": 1500,
  "description": "Enterprise client deal",
  "date": "2026-04-04",
  "created_at": "2026-04-04 17:45:00"
}
```

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Missing or malformed fields |
| 401 | `MISSING_TOKEN` | No Authorization header |
| 401 | `INVALID_TOKEN` | Token expired or tampered |

---

### GET /ventas/:userId

Get all sales for a user, ordered by date descending. **Auth required.**

**Path param:** `userId` — integer user ID

**Success `200`:**
```json
[
  {
    "id": 3,
    "user_id": 1,
    "amount": 1500,
    "description": "Enterprise client deal",
    "date": "2026-04-04",
    "created_at": "2026-04-04 17:45:00"
  },
  {
    "id": 1,
    "user_id": 1,
    "amount": 2000,
    "description": "Retail batch",
    "date": "2026-04-01",
    "created_at": "2026-04-01 09:10:00"
  }
]
```

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 401 | `MISSING_TOKEN` | No Authorization header |
| 401 | `INVALID_TOKEN` | Token expired or tampered |
| 404 | `NOT_FOUND` | User does not exist |

---

## Progress

### GET /progreso/:userId

Get progress toward all goals for a user. Each goal shows sales total within its date range, percentage achieved, active status, and unlocked milestones. **Auth required.**

**Path param:** `userId` — integer user ID

**Success `200`:**
```json
[
  {
    "goalId": 1,
    "title": "Monthly Goal",
    "target": 10000,
    "start_date": "2026-04-01",
    "end_date": "2026-04-30",
    "total": 3500,
    "percentage": 35,
    "isActive": true,
    "milestones": []
  },
  {
    "goalId": 2,
    "title": "Q1 Sprint",
    "target": 5000,
    "start_date": "2026-01-01",
    "end_date": "2026-03-31",
    "total": 5200,
    "percentage": 104,
    "isActive": false,
    "milestones": [
      { "id": "50pct",  "name": "50%",  "achieved": 50 },
      { "id": "80pct",  "name": "80%",  "achieved": 80 },
      { "id": "100pct", "name": "100%", "achieved": 100 }
    ]
  }
]
```

Returns an empty array `[]` if the user has no goals.

**Milestone thresholds:** `50`, `80`, `100`

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| 401 | `MISSING_TOKEN` | No Authorization header |
| 401 | `INVALID_TOKEN` | Token expired or tampered |

---

## Health Check

### GET /health

Returns server status. No auth required. Used by Railway for health checks.

**Success `200`:**
```json
{ "status": "ok" }
```

---

## Error Response Format

All errors follow this consistent shape:
```json
{
  "error": "Human readable message",
  "code": "ERROR_CODE"
}
```

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `MISSING_TOKEN` | 401 | No Bearer token in Authorization header |
| `INVALID_TOKEN` | 401 | Token is expired, malformed, or tampered |
| `UNAUTHORIZED` | 401 | Generic unauthorized |
| `NOT_FOUND` | 404 | Resource does not exist |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Deployment

### Backend (Railway)

1. Push the `backend/` folder to a GitHub repo (or the monorepo root)
2. Create a new Railway project → **Deploy from GitHub repo**
3. Set environment variables in Railway dashboard:
   ```
   JWT_SECRET=<strong-random-secret>
   JWT_EXPIRES_IN=8h
   NODE_ENV=production
   PORT=3000
   ```
4. Railway detects the `Dockerfile` automatically
5. Verify: `GET https://<app>.railway.app/health` → `{ "status": "ok" }`
6. Run seed via Railway shell if needed: `node -e "require('./dist/db/seed.js')"`

### Frontend (Vercel)

1. Push the `frontend/` folder (or monorepo root) to GitHub
2. Import project in Vercel → set **Root Directory** to `frontend`
3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://<your-backend>.railway.app
   ```
4. Vercel auto-detects Vite; `vercel.json` handles SPA routing fallback
5. Deploy and verify login at the Vercel URL

# Sales Goals Tracking Module — Implementation Plan

## Overview
Build a full-stack Sales Goals Tracking app where promoters can log in, record daily sales, track progress toward a monthly goal, and unlock milestone recognitions at 50%, 80%, and 100%.

**Stack:**
- Backend: Node.js + Express + TypeScript + SQLite (`better-sqlite3`)
- Frontend: React + TypeScript + Redux Toolkit + HeroUI (or Shadcn/Radix)
- Deployment: Railway (backend), Vercel (frontend)

---

## Project Structure

```
SalesTracker/
├── backend/
│   ├── src/
│   │   ├── db/             # SQLite setup & seed data
│   │   ├── routes/         # Express route files
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (progress calc, milestones)
│   │   ├── models/         # DB query functions
│   │   └── middleware/     # Auth (JWT), error handling
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # AppButton, ProgressCard, BadgeAchievement
│   │   ├── design-system/    # tokens.ts + theme config
│   │   ├── pages/            # Dashboard, SalesForm, Login
│   │   ├── store/            # Redux slices (auth, sales, progress)
│   │   ├── services/         # API client (axios) + service modules
│   │   └── types/            # TypeScript interfaces
│   ├── tailwind.config.ts    # (or UI library theme config)
│   └── package.json
└── docs/
    └── api.md
```

---

## Phase 1 — Backend

### 1.1 Project Setup
- Init Node.js project with Express and TypeScript
- Dependencies: `express`, `better-sqlite3`, `bcryptjs`, `jsonwebtoken`, `zod`, `dotenv`
- Dev dependencies: `typescript`, `ts-node`, `@types/*`, `nodemon`
- Configure `tsconfig.json`, ESLint, and folder structure

### 1.2 Database (SQLite)

```sql
users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
)

goals (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,          -- e.g. 'Q2 April Push'
  target     REAL NOT NULL,          -- numeric target, e.g. 10000.00
  start_date TEXT NOT NULL,          -- ISO date: '2026-04-01'
  end_date   TEXT NOT NULL,          -- ISO date: '2026-04-30'
  created_at TEXT DEFAULT (datetime('now')),
  CHECK(end_date > start_date)       -- end must be after start
)

sales (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      REAL NOT NULL,
  description TEXT,
  date        TEXT NOT NULL,         -- ISO date string: '2026-04-04'
  created_at  TEXT DEFAULT (datetime('now'))
)
```

**Goals logic:**
- A user can have multiple goals, each with its own `start_date`, `end_date`, and `target`.
- Goals may overlap in date range (no uniqueness constraint on dates).
- Progress for a goal = sum of `sales.amount` where `sales.date BETWEEN goal.start_date AND goal.end_date` and `sales.user_id = goal.user_id`.
- `GET /progreso/:userId` returns progress for **all** of that user's goals (active and past).
- A goal is considered **active** if `current_date BETWEEN start_date AND end_date`.
- If a user has no goals, return an empty array (not a 404).

Seed at least one test user + one goal with a date range covering today for development.

### 1.3 Authentication

#### `POST /auth/login`

**Request body:**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Validation rules (zod):**
- `email` — required, valid email format
- `password` — required, min 6 characters

**Logic (service layer):**
1. Look up user by `email` in the DB → 401 `INVALID_CREDENTIALS` if not found
2. Compare plain-text password against `password_hash` using `bcrypt.compare` → 401 `INVALID_CREDENTIALS` if mismatch (same error as step 1 — do not reveal which field failed)
3. Sign a JWT with payload `{ sub: user.id, email: user.email }`
4. Return token + user info

**Success response `200`:**
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "username": "Ana", "email": "user@example.com" }
}
```

**Error responses:**
| Status | Code | Trigger |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Missing or malformed fields |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |

**JWT settings:**
- Algorithm: `HS256`
- Payload: `{ sub, email, iat, exp }`
- Expiry: `8h` (configurable via `JWT_EXPIRES_IN` env var)
- Secret: `JWT_SECRET` env var (required, no default)

#### Auth Middleware (`requireAuth`)
- Reads `Authorization: Bearer <token>` header → 401 `MISSING_TOKEN` if absent
- Verifies and decodes JWT → 401 `INVALID_TOKEN` if expired or tampered
- Attaches decoded payload to `req.user` for downstream handlers
- Applied to all routes except `POST /auth/login` and `GET /health`

#### Notes
- No registration endpoint (users are seeded; out of scope per design doc)
- Passwords hashed with bcrypt, 10 salt rounds

### 1.4 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Log in, receive JWT |
| POST | `/ventas` | Yes | Register a new sale |
| GET | `/progreso/:userId` | Yes | Progress for all user goals (total, %, milestones) |
| GET | `/ventas/:userId` | Yes | User's full sales history |
| GET | `/health` | No | Health check for deployment |

### 1.5 Business Logic (services layer)

**`calculateProgress(userId)`**
- Fetch all goals for `userId`
- For each goal, sum `sales.amount` where `sales.date BETWEEN goal.start_date AND goal.end_date`
- Return array:
  ```ts
  [{
    goalId, title, target,
    start_date, end_date,
    total,           // sum of sales in range
    percentage,      // (total / target) * 100, capped display at 100 for UI
    isActive,        // today is within start_date–end_date
    milestones: [...]
  }]
  ```

**`getUnlockedMilestones(percentage)`**
- Returns array of unlocked milestone objects where `threshold <= percentage`
- Each object contains only:
  ```ts
  {
    id: string,        // '50pct' | '80pct' | '100pct'
    name: string,      // '50%' | '80%' | '100%'
    achieved: number,  // the threshold value at which this unlocked, e.g. 50
  }
  ```
- Defined thresholds: `50`, `80`, `100`

### 1.6 Error Handling

Global Express error middleware. Typed error classes:
- `ValidationError` (400)
- `UnauthorizedError` (401)
- `NotFoundError` (404)

All errors return:
```json
{ "error": "Human readable message", "code": "ERROR_CODE" }
```

---

## Phase 2 — Frontend

### 2.1 Project Setup
- Init with `vite` + React + TypeScript template
- Dependencies: chosen UI library, `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `axios`
- Configure `VITE_API_BASE_URL` in `.env`

### 2.2 Design System Tokens

Defined in `src/design-system/tokens.ts` and wired into the UI library's theme config:

**Colors (semantic names only — no raw color values in components):**
```ts
brand-primary       // main CTA color
brand-secondary     // accent
success-subtle      // light green background
success-base        // green text/icon
warning-base        // amber alerts
warning-subtle      // amber background
error-base          // red errors
neutral-100 … 900   // grays
```

**Typography scale:**
```ts
text-heading-lg     // page titles
text-heading-md     // section headers
text-heading-sm     // card titles
text-body-md        // default body
text-body-sm        // secondary text
text-caption        // labels, hints
```

**Spacing & Radii:**
- Base unit: 4px (0.25rem)
- Scale: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24...
- Radii: `radius-sm` (4px), `radius-md` (8px), `radius-lg` (12px), `radius-full` (9999px)

### 2.3 Wrapper Components

> Rules live inside the component — not scattered across every view.

**`AppButton`**
```tsx
// Usage
<AppButton variant="primary" size="md" loading={false} onClick={...}>
  Register Sale
</AppButton>
// Variants: primary | secondary | ghost | danger
```

**`ProgressCard`**
```tsx
// Usage
<ProgressCard
  label="Monthly Goal"
  current={7500}
  goal={10000}
  percentage={75}
/>
// Shows progress bar, absolute values, and color based on percentage
```

**`BadgeAchievement`**
```tsx
// Usage
<BadgeAchievement
  label="Goal Reached!"
  icon="🏆"
  unlocked={true}
/>
// Locked badges appear greyed out; unlocked badges are styled with success-subtle
```

### 2.4 Redux Store

**Slices:**
- `authSlice` — `{ token, user }`, actions: `login`, `logout`
- `salesSlice` — `{ sales[], loading, error }`, async thunks for fetch + create
- `progressSlice` — `{ total, goal, percentage, milestones[], loading, error }`

### 2.5 Pages

#### Login (`/login`)
- Email + password inputs
- Calls `POST /auth/login`
- Stores token in Redux + `localStorage`
- Redirects to `/dashboard` on success

#### Dashboard (`/dashboard`)
- `ProgressCard` — monthly progress (fetched from `GET /progreso/:userId`)
- `BadgeAchievement` row — milestones at 50%, 80%, 100%
- Sales list — recent entries (fetched from `GET /ventas/:userId`)
- Link/button to navigate to sales form

#### Sales Registration Form (`/ventas/nueva`)
- Fields: amount (number), description (text), date (date picker)
- Zod or manual validation with inline error messages
- Calls `POST /ventas`
- On success: redirect to `/dashboard`, trigger progress refresh

### 2.6 API Service Layer
```
src/services/
├── api.ts             # axios instance + auth interceptor
├── authService.ts     # login()
├── salesService.ts    # createSale(), getSales()
└── progressService.ts # getProgress()
```

---

## Phase 3 — Deployment

### 3.1 Backend → Railway
- Add `Dockerfile` (or rely on Nixpacks auto-detect)
- Environment variables to configure: `JWT_SECRET`, `PORT`, `NODE_ENV`
- Verify `GET /health` returns 200 before considering deploy successful
- Update CORS to allow Vercel frontend origin

### 3.2 Frontend → Vercel
- Set `VITE_API_BASE_URL` to the Railway backend URL
- Add `vercel.json` with SPA fallback:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- Verify full end-to-end flow after deploy

---

## Phase 4 — Documentation

### `docs/api.md`
- Intro and base URL
- Authentication section (how to obtain and use JWT)
- Each endpoint documented with:
  - Method + path
  - Request headers / body (with JSON example)
  - Success response (with JSON example)
  - Error responses (codes + messages)
- Error codes reference table

---

## Implementation Order

| # | Todo ID | Description | Depends On |
|---|---------|-------------|------------|
| 1 | `backend-setup` | Scaffold backend project | — |
| 2 | `backend-auth` | Login endpoint + JWT middleware | backend-setup |
| 3 | `backend-sales-endpoint` | POST /ventas | backend-auth |
| 4 | `backend-progress-endpoint` | GET /progreso/:userId | backend-sales-endpoint |
| 5 | `backend-history-endpoint` | GET /ventas/:userId | backend-setup |
| 6 | `backend-error-handling` | Typed errors + global handler | backend-setup |
| 7 | `frontend-setup` | Scaffold frontend project | — |
| 8 | `frontend-design-system` | Tokens + theme config | frontend-setup |
| 9 | `frontend-components` | AppButton, ProgressCard, BadgeAchievement | frontend-design-system |
| 10 | `frontend-auth` | Login page + authSlice | frontend-setup |
| 11 | `frontend-dashboard` | Dashboard page | frontend-components, frontend-auth |
| 12 | `frontend-sales-form` | Sales registration form | frontend-components, frontend-auth |
| 13 | `deploy-backend` | Deploy to Railway | backend-* all done |
| 14 | `deploy-frontend` | Deploy to Vercel | frontend-* all done, deploy-backend |
| 15 | `docs` | Write docs/api.md | deploy-backend |

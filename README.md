# SalesTracker 🎯

> **⚠️ Demo Project** — This is a portfolio/demo application. It ships with a seeded demo user and is not intended for production use as-is.

A full-stack sales goals tracker where users can set monetary and unit-based goals, log sales, and earn achievements as they hit milestones.

---

## Features

- 📊 **Dashboard** — live goal progress with a donut stats chart and achievement badges
- 🗒️ **History tab** — sales log and completed goals overview
- 🛒 **Register Sale** — log monetary or unit sales against active goals
- 🏆 **Achievements** — user-level badges unlocked automatically (e.g. *Goal Completed*, *Super Fast!*)
- 🌙 **Dark mode** — full light/dark theme support via CSS variables
- 🌐 **i18n** — English and Spanish, switchable at runtime
- 🔐 **JWT auth** — token-based login; demo credentials shown on the login page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, React Router v7, Tailwind CSS v3, i18next |
| Backend | Node.js, Express 5, TypeScript, SQLite (better-sqlite3), Zod, JWT |
| Deployment | Vercel (frontend) + Render / Railway (backend) |

---

## Project Structure

```
SalesTracker/
├── frontend/          # Vite + React + TypeScript SPA
├── backend/           # Express REST API
├── docs/
│   ├── api.md         # API endpoint reference
│   └── design-system.md  # Tokens, components, usage rules
└── DesignDocument.md  # Original feature spec
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
cp .env.example .env        # fill in JWT_SECRET
npm install
npm run seed                # creates SQLite DB + demo user
npm run dev                 # http://localhost:3000
```

### Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:3000
npm install
npm run dev                 # http://localhost:5173
```

### Demo credentials

```
Email:    ana@example.com
Password: password123
```

These are displayed on the login page — no need to memorise them.

---

## Deployment

See [`docs/api.md`](docs/api.md) for the full API reference and the [Design System](docs/design-system.md) for token/component docs.

### Frontend → Vercel

1. Import the repo, set **Root Directory** to `frontend`
2. Framework preset: **Vite**
3. Add env var: `VITE_API_BASE_URL=https://your-backend.url`

### Backend → Render / Railway

1. Set **Root Directory** to `backend`
2. Build: `npm run build` · Start: `node dist/app.js`
3. Add env vars from `backend/.env.example` (set a strong `JWT_SECRET`)
4. Set `CORS_ORIGIN` to your Vercel frontend URL

---

## Demo Notes

- The SQLite database is ephemeral on free-tier hosts — it resets on redeploy. This is intentional for a demo.
- Run `npm run seed` locally (or as part of the deploy start command) to restore the demo user if the DB is wiped.
- There are no sign-up flows; the demo user is the only account.

# SalesTracker 🎯

> **⚠️ Demo Project** — This is a portfolio/demo application. It ships with a seeded demo user and is not intended for production use as-is.

A full-stack sales goals tracker where users can set monetary and unit-based goals, log sales, and earn achievements as they hit milestones.

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### Quick start (1 command)

```bash
npm start
```

`npm start` handles everything: installing dependencies, creating `.env` files,
seeding the demo database, and launching both servers concurrently.

| Server | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |


### Demo credentials

```
Email:    ana@example.com
Password: password123
```

These are also displayed on the login page.

### Manual setup (optional)

<details>
<summary>Expand for step-by-step instructions</summary>

**Backend**
```bash
cd backend
cp .env.example .env        # fill in JWT_SECRET (min 32 chars)
npm install
npm run seed                # creates SQLite DB + demo user
npm run dev                 # http://localhost:3000
```

**Frontend**
```bash
cd frontend
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:3000
npm install
npm run dev                 # http://localhost:5173
```
</details>

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

## Documentation

- [`docs/api.md`](docs/api.md) — full API endpoint reference
- [`docs/design-system.md`](docs/design-system.md) — design tokens and component usage

---

## Deployment

### Frontend → Vercel

1. Import the repo, set **Root Directory** to `frontend`
2. Framework preset: **Vite**
3. Add env var: `VITE_API_BASE_URL=https://your-backend.url`

### Backend → Render / Railway

1. Set **Root Directory** to `backend`
2. Build: `npm run build` · Start: `npm start`
3. Add env vars from `backend/.env.example` (set a strong `JWT_SECRET`)
4. Set `CORS_ORIGIN` to your Vercel frontend URL

---

## Demo Notes

- The SQLite database is ephemeral on free-tier hosts — it resets on redeploy. This is intentional for a demo.
- Run `npm run seed` locally (or as part of the deploy start command) to restore the demo user if the DB is wiped.
- There are no sign-up flows; the demo user is the only account.

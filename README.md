# HemoLink Ethiopia — MVP

Web-based blood donation management prototype for emergency response: donor registration, hospital requests, smart matching (blood type + location + 8-week eligibility), and simulated alerts.

## Structure

- `backend/` — Express, TypeScript, Prisma, PostgreSQL (Neon)
- `frontend/` — React, Vite, TypeScript, Tailwind CSS, PWA

## Prerequisites

- Node.js 20+
- A Neon (or any PostgreSQL) database and `DATABASE_URL`

## Backend

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET (16+ chars), and optional ADMIN_EMAIL / ADMIN_PASSWORD for seeding
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

API base: `http://localhost:4000`

- `GET /health`
- `POST /api/auth/login` — body: `{ "email", "password" }` → `{ token, admin }`
- `POST /api/auth/register` — body: `{ "email", "password" (min 8), "registerSecret"? }` → `{ token, admin }` — first admin allowed when the `Admin` table is empty; further admins require `ADMIN_REGISTER_SECRET` in `.env` and the same value in `registerSecret`
- `GET /api/auth/me` — `Authorization: Bearer <token>` → `{ admin }`
- `POST /api/donors` — register donor (Zod-validated) — public
- `GET /api/donors` — list donors (`?search=` optional) — public
- `POST /api/requests` — create hospital request — **admin JWT required**
- `GET /api/requests` — list requests — **admin JWT required**
- `POST /api/match` — body: `{ "bloodType", "location" }` — **admin JWT required**
- `GET /api/analytics` — `{ totalDonors, totalRequests }` — public (landing metrics)

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:4000`.

Optional: `frontend/.env` with `VITE_API_URL=http://localhost:4000` if you prefer not to use the proxy.

## Admin / hospital console

1. Set **`JWT_SECRET`** (16+ characters). Optionally run `npm run db:seed` for a default admin, or use **`/admin`** → **Register admin** when the database has no admins yet.
2. Open **`/admin`**, use **Sign in** or **Register admin**, then you are redirected to **`/hospital`** (or the `?redirect=` path).
3. To add more admins after the first, set **`ADMIN_REGISTER_SECRET`** in `.env` and enter that key when registering.
4. The JWT is stored in `localStorage` and sent as `Authorization: Bearer …` for protected APIs. Use **Sign out** in the hospital sidebar to clear the session.

## Demo flow

1. **Donate** — register a donor (blood type + **location** string must match the hospital form later, character-for-character in this MVP).
2. **Admin** — sign in at `/admin/login`, open **Hospitals**, submit a blood request, then **Find donors**.
3. **Match results** — see eligible donors and the alert message; toast shows the emergency alert simulation.

Matching rules: same `bloodType`, same `location`, and `lastDonation` null or at least **56 days** ago.

## PWA

Production build registers a service worker and exposes a web app manifest for installable behavior (`npm run build` then `npm run preview`).

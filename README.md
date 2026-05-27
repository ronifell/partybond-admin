# Partybond — Admin Panel

Next.js 14 + TailwindCSS web admin for the Partybond mobile app.

It uses the **same backend** as the mobile app (`Backend/`) via REST + Bearer JWT under
`/api/v1/admin/*`. Mobile API endpoints are untouched. The visual style mirrors the mobile
app: dark UI with the pink → purple → cyan neon gradient.

## Features

- **Dashboard** — totals, growth (24h / 7d), active matches, pending reports, and a 7-day
  bar chart of matches started/ended.
- **Users** — search by name/email/ID, filter by status (active / banned / admin), ban /
  unban, promote / revoke admin, delete user, and a detailed user page with game profiles
  + reports received.
- **Reports** — triage user reports (open / reviewed / dismissed), one-click ban of the
  reported user, optional internal admin note.
- **Games** — create, edit, activate / mark as “coming soon” or remove games (guards
  against deleting games still in use).
- **Sessions** — filter by status and game, delete sessions.
- **Matches** — filter by status, force-finish active matches, inspect interactions.
- **Settings** — toggle between English and Portuguese (Brazilian).

The whole UI is responsive (works from ~360 px wide up to 4K).

## Stack

- Next.js 14 (App Router)
- TailwindCSS (with the mobile app’s design tokens mirrored in `tailwind.config.ts`)
- Axios + Bearer JWT
- `react-hot-toast` for notifications
- Lightweight in-house i18n (`src/i18n/`) with `en.json` + `pt.json`

No additional databases or services are introduced — the panel talks to the same Postgres
through the existing backend.

## Setup

```bash
cd Admin
cp .env.example .env.local
# edit .env.local and point NEXT_PUBLIC_API_URL at your backend (defaults to http://localhost:4000)

npm install
npm run dev    # → http://localhost:3000
```

### 1. Apply the admin database migration

The admin panel relies on three new fields on `users` and a `ReportStatus` enum on
`user_reports`. From the **Backend** folder:

```bash
cd ../Backend
npx prisma generate
npx prisma migrate deploy   # or `npx prisma migrate dev` in dev
```

The migration file is `prisma/migrations/20260527120000_admin_panel/migration.sql` and is
idempotent (`ADD COLUMN IF NOT EXISTS`).

### 2. Promote a user to admin (one-time bootstrap)

From the **Backend** folder:

```bash
# Promote an existing user (created via the mobile app or any other way):
npm run admin:promote -- admin@partybond.com

# Or create a brand-new admin user from scratch:
npm run admin:promote -- admin@partybond.com 'a-strong-password' 'Admin Name' 30
```

Now log into the panel with that email + password.

### 3. Production build

```bash
npm run build
npm start
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Origin of the Backend API (e.g. `https://api.partybond.com`). The panel calls `<URL>/api/v1/*`. |

CORS: make sure the panel’s origin (e.g. `http://localhost:3000`) is included in the
backend’s `CLIENT_ORIGINS` env var.

## Project layout

```
Admin/
├── src/
│   ├── app/
│   │   ├── (panel)/         # protected routes wrapped by AppShell
│   │   │   ├── dashboard/
│   │   │   ├── users/[id]/
│   │   │   ├── reports/
│   │   │   ├── games/
│   │   │   ├── sessions/
│   │   │   ├── matches/
│   │   │   └── settings/
│   │   ├── login/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/          # AppShell, Sidebar, Topbar, PageHeader
│   │   └── ui/              # Button, Card, Modal, Table, Input, etc.
│   ├── i18n/                # en.json + pt.json + I18nProvider
│   └── lib/                 # api client, auth context, formatters, types
├── tailwind.config.ts
└── package.json
```

## Backend additions (kept minimal)

To enable admin operations the backend was extended with **additive** changes only:

- New columns on `users`: `is_admin` (boolean), `banned_at` (timestamp), `ban_reason` (text).
- New columns on `user_reports`: `status` (enum `open|reviewed|dismissed`), `admin_note`,
  `resolved_at`, `resolved_by_id`.
- `POST /api/v1/auth/admin/login` — same credentials as the mobile login but requires
  `is_admin = true`. Mobile users keep using the existing `/auth/login`.
- `requireAdmin` middleware gating all `POST/PATCH/DELETE/GET /api/v1/admin/*` routes.
- A small ban check is also enforced on mobile login — banned users can no longer sign in.

No existing mobile endpoint contract was broken.

## Image / asset notes

The panel uses **no external image assets** — the “P” mark in the sidebar and the favicon
are generated from the gradient defined in CSS, exactly like the mobile app. If at any
point you’d like a custom illustration on the empty states or the login background, this
is a good time to drop a PNG into `Admin/public/` and let me know — I’ll wire it in.

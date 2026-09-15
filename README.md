# Client Lead Management System — Mini CRM

A full-stack CRM for managing sales leads end to end: capture a lead, track it through
**New → Contacted → Converted**, log follow-up notes, and watch dashboard stats update
in real time.

Built as a portfolio-quality submission for the Future Interns Full Stack Web Development
Task 2 (2026).

## Features

- **Secure admin auth** — JWT stored in an httpOnly cookie (not localStorage), bcrypt-hashed
  passwords, rate-limited login
- **Dashboard** — total/new/contacted/converted counts, conversion rate, and a leads-by-status
  chart, all computed server-side
- **Full lead CRUD** — create, view, edit, delete, with confirmation before destructive actions
- **Follow-up notes** — a timeline of dated notes per lead, not a single overwritten text field
- **Search, filter, sort, pagination** — all server-side, so the frontend never loads more than
  one page of leads at a time
- **Responsive** — the lead table becomes a stacked card list on mobile, with the same
  status-colored accent carried through
- **Real UI states** — loading, empty, error, and success feedback everywhere data is fetched
  or mutated

## Tech Stack

**Frontend:** React 19 + TypeScript, Vite, React Router, Axios, Tailwind CSS v4, Recharts,
lucide-react

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, Helmet, express-rate-limit

## Project Structure

```text
mini-crm/
├── client/                  # React + TypeScript frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI: table, modals, badges, cards, form controls
│       ├── pages/            # LoginPage, DashboardPage
│       ├── layouts/          # DashboardLayout (sidebar + topbar)
│       ├── context/          # AuthContext, ToastContext
│       ├── hooks/             # useLeads, useDashboardStats
│       ├── services/          # api.ts + one service module per resource
│       ├── types/              # Shared TypeScript types
│       └── utils/               # Formatting, error messages, status color mapping
│
└── server/                   # Express + MongoDB backend
    ├── config/                # Database connection
    ├── controllers/           # auth, leads, dashboard
    ├── middleware/             # JWT auth guard, centralized error handler
    ├── models/                  # Admin, Lead (with validation + indexes)
    ├── routes/                   # REST endpoints
    ├── seed/                      # Demo data seeding script
    └── server.js                  # App entry point
```

## Installation

```bash
git clone <repository-url>
cd mini-crm
```

### Backend setup

```bash
cd server
npm install
cp .env.example .env   
npm run seed            
npm run dev              
```

### Frontend setup

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL should point at your running backend
npm run dev               # starts the app on http://localhost:5173
```


## Environment Variables

### `server/.env`

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used only by `npm run seed` |
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_ORIGIN` | Comma-separated list of allowed frontend origins (CORS) |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, including `/api` |

Neither `.env` file is committed — see `.gitignore` in each folder. Copy the provided
`.env.example` files and fill in your own values.

## Database Setup

Use a local MongoDB instance (`mongodb://localhost:27017/mini-crm`) or a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster — either works with `MONGODB_URI`
as-is. `npm run seed` is idempotent for the admin user (won't duplicate it on re-run) and
resets the leads collection to the 15 demo leads each time it's run.

## Running the Project

Run backend and frontend in separate terminals (`npm run dev` in each of `server/` and
`client/`). The frontend proxies API calls to `VITE_API_URL`; the backend accepts requests
only from the origin(s) listed in `CLIENT_ORIGIN`.

## API Endpoints

```text
POST   /api/auth/login          Log in, sets an httpOnly JWT cookie
POST   /api/auth/logout         Clear the session cookie
GET    /api/auth/me             Get the current admin (used on app load)

GET    /api/leads               List leads — supports search, status, source, sort, page, limit
GET    /api/leads/:id           Get one lead
POST   /api/leads               Create a lead
PUT    /api/leads/:id           Update a lead
DELETE /api/leads/:id           Delete a lead
POST   /api/leads/:id/notes     Add a follow-up note

GET    /api/dashboard/stats     Total/new/contacted/converted counts + conversion rate
```

All `/api/leads` and `/api/dashboard` routes require authentication. Responses follow
`{ success: true, data }` or `{ success: false, message }`.

## Future Improvements

- Bulk actions (multi-select delete / status change)
- CSV export of filtered leads
- Role-based access if more than one admin is needed
- Email notifications on status change



# Township Capital — full-stack app

A Next.js app (frontend + backend API routes in one project) for DNS Homes'
Rajgir & Bihta plot listings — public site, user accounts, a personal
dashboard, and an admin panel, backed by MongoDB.

## Why one Next.js app instead of a separate Express backend?

The original brief asked for Node/Express + a separate frontend. This app
gets the same result — REST-style API endpoints, JWT auth, MongoDB CRUD —
using Next.js **API routes** instead, which are also Node.js functions under
the hood. The difference is deployment: everything ships as **one app to one
place (Vercel)** instead of two apps you'd have to deploy, configure CORS
between, and keep in sync. For a solo part-time maintainer, that's the
difference between "deploy and forget" and "manage two services forever."

If you outgrow this later, the logic in every `app/api/**/route.js` file is
plain Node.js and can be lifted into an Express app almost line-for-line.

## Folder structure

```
township-app/
├── app/
│   ├── api/                  # Backend — every route.js here is a REST endpoint
│   │   ├── auth/              register, login, logout, me
│   │   ├── contact/            public — saves a Lead
│   │   ├── projects/           public GET, admin-only POST/PUT/DELETE
│   │   ├── leads/               admin-only
│   │   ├── users/                admin-only
│   │   └── favorites/            logged-in user only
│   ├── (pages)                # Frontend — one folder per route
│   │   ├── page.js             home
│   │   ├── about/               about
│   │   ├── contact/             contact form
│   │   ├── login/, signup/       auth pages
│   │   ├── dashboard/            protected — saved projects
│   │   ├── projects/             listing + /projects/[slug] detail
│   │   ├── calculator/           future-value calculator
│   │   └── admin/                protected, admin role only
│   ├── layout.js               shared shell (navbar, footer, fonts)
│   └── globals.css             Tailwind + shared classes
├── components/                # Reusable React components (client + server)
├── lib/
│   ├── db.js                   MongoDB connection (cached for serverless)
│   ├── auth.js                 JWT sign/verify (edge-compatible, used by middleware too)
│   ├── hash.js                 bcrypt password hashing
│   └── pricing.js               shared price/projection math
├── models/                     Mongoose schemas: User, Project, Lead, Favorite
├── middleware.js               blocks /dashboard and /admin for unauthorized users
├── scripts/seed.js             loads Mountain Bliss + Shuvida Enclave + an admin account
└── .env.example                required environment variables
```

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get a free MongoDB database**
   - Sign up at https://www.mongodb.com/cloud/atlas (free M0 tier is enough)
   - Create a cluster, add a database user, and allow network access from
     anywhere (0.0.0.0/0) for development
   - Copy the connection string

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local`:
   - `MONGODB_URI` — the connection string from step 2
   - `JWT_SECRET` — generate one with `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the admin account
     the seed script creates

4. **Seed the database** (loads Mountain Bliss, Shuvida Enclave, and your admin account)
   ```bash
   npm run seed
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000. Log in at `/login` with the admin
   credentials from step 3 to reach `/admin`.

## How auth works

- Passwords are hashed with bcrypt before being stored — never in plain text.
- On login/signup, a JWT is signed and stored in an `httpOnly` cookie (not
  readable by JavaScript in the browser — protects against XSS token theft).
- `middleware.js` checks that cookie on every request to `/dashboard/*` and
  `/admin/*` and redirects if it's missing or the role doesn't match.
- API routes that need to know "who is this?" or "are they an admin?" read
  the same cookie via `getUserFromCookies()`.

## Deployment

### Database — MongoDB Atlas
Already set up in step 2 above. For production, restrict network access to
Vercel's IP ranges or use Atlas's "allow access from anywhere" if that's not
practical, and use a strong, unique `JWT_SECRET`.

### App — Vercel
1. Push this project to a GitHub repository.
2. Go to https://vercel.com, import the repository.
3. In the Vercel project settings → Environment Variables, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (only needed if you re-run the seed script)
4. Deploy. Vercel builds and hosts both the frontend and the `/api/*` routes
   automatically — no separate backend deployment needed.
5. After the first deploy, run the seed script once from your local machine
   pointed at the production `MONGODB_URI` (or add a temporary admin manually
   in Atlas) to get your first admin account.

### If you later want a separate Express backend
Each file in `app/api/**/route.js` maps to one Express route handler with
almost no changes — the `req.json()` / `NextResponse.json()` calls become
`req.body` / `res.json()`, and `lib/db.js`, `lib/auth.js`, and `models/*.js`
can be reused as-is. Deploy that Express app to Render or Railway, and point
the frontend's `fetch()` calls at its URL instead of relative `/api/...`
paths.

## What's included vs. what's still a placeholder

**Real:** the two DNS Homes projects (Mountain Bliss, Shuvida Enclave) with
their actual current per-sq-ft rates, plot sizes from the site plan, real
infrastructure points, and real payment plan terms.

**Still generic, on purpose:** the growth-rate scenarios (6/10/15%) in the
calculator and price tables are editable assumptions, not predictions — there
isn't yet a real historical price series for either project to base a trend
line on. As you track real prices over time, that can be added as a proper
trends feature.

# PathFinder — Curated Learning Roadmap Platform

PathFinder is a unified, production-grade learning roadmap application built with **React 18 + Vite**, **Express 4**, and **MongoDB with Mongoose**.

It provides learners with sequenced engineering curricula, server-enforced progress tracking, and deterministic resume actions, while offering curriculum curators a dedicated studio to maintain and publish learning roadmaps.

---

## Architecture & Design Principles

- **Warm, Calm Design System:** Tailored editorial theme featuring an off-white canvas (`#FAF9F6`), deep slate ink (`#18181B`), deep teal primary accents (`#0F766E`), and warm amber secondary cues (`#D97706`).
- **Core-Only Progress Denominator:** Roadmap completion percentages and progress fractions reflect active core curriculum topics exclusively (`4 of 11 core topics`). Optional and stretch topics are tracked distinctly without skewing the core completion baseline.
- **Deterministic Next Action:** The learner dashboard calculates the deterministic next step using strict precedence:
  1. Most recently touched topic in `in_progress` status.
  2. The next incomplete core topic in canonical curriculum sequence.
  3. If all core topics are mastered, the first incomplete optional/stretch extension.
- **Enterprise-Grade Security:**
  - JWT tokens stored strictly in HTTP-only, `sameSite: 'lax'` cookies.
  - Double-submit CSRF verification with custom headers (`x-csrf-token`) on all state-changing HTTP requests.
  - Rate limiting on authentication routes (20 requests per 15 minutes) and API endpoints.
  - Role-based authorization enforced on the database layer (`requireAuth`, `requireAdmin`). Non-admin users are strictly barred from `/api/v1/admin/*` with HTTP 403.
- **Safe Curriculum Archival:** Topics and modules are never hard-deleted; soft archival (`status: 'archived'`) preserves student study records and completion history.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18.3, React Router DOM 6.30, Tailwind CSS 3.4, Lucide React, Vite 6.4 |
| **Backend** | Node.js, Express 4.21, Mongoose 8.9, MongoDB |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |
| **Security** | `helmet`, `cors`, `express-rate-limit`, double-submit CSRF |
| **Orchestration** | `concurrently` (concurrent client + server development) |

---

## Directory Structure

```
unified-workspace/
├── client/                     # React 18 Vite Single Page Application
│   ├── src/
│   │   ├── app/                # App router, ProtectedRoute guard
│   │   ├── components/
│   │   │   ├── dashboard/      # Weekly pace configuration modal
│   │   │   ├── layout/         # Responsive Navbar, Footer, PageContainer
│   │   │   ├── roadmap/        # RoadmapCard, ProgressFraction bar
│   │   │   ├── topic/          # ReportIssueModal
│   │   │   └── ui/             # Reusable UI primitives (Badge, Button, Card, Modal, etc.)
│   │   ├── context/            # AuthContext (state, login, register, logout)
│   │   ├── pages/              # Landing, Catalogue, Preview, Topic, Dashboard, Admin views
│   │   ├── services/           # Unified API client with CSRF and error envelopes
│   │   └── styles/             # Tailwind utility styles & color tokens
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express REST API
│   ├── seeds/                  # Idempotent curriculum seed runner (DSA & DBMS)
│   ├── scripts/                # CLI administration tools (makeAdmin.js)
│   ├── src/
│   │   ├── config/             # Strict environment validation & MongoDB connection
│   │   ├── controllers/        # Auth, Roadmap, Progress, Topic, Report, Admin controllers
│   │   ├── middleware/         # Auth, CSRF verification, rate limiting, error handling
│   │   ├── models/             # Mongoose models (User, Roadmap, Module, Topic, Enrolment, etc.)
│   │   ├── routes/v1/          # Versioned API routes
│   │   ├── services/           # Pure progress calculation & deterministic resume engine
│   │   ├── utils/              # Standard JSON response envelopes
│   │   └── validators/         # Input sanitization and registration/login validators
│   ├── src/app.js              # Express application assembly & SPA static serving
│   └── src/index.js            # Server entrypoint
│
├── docs/                       # Operational guides (ADMIN_SETUP.md)
├── .env.example                # Documented environment template
└── package.json                # Root orchestration scripts
```

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: A running local instance (`mongodb://127.0.0.1:27017`) or a remote MongoDB Atlas URI.

### 2. Installation
Install all root, server, and client dependencies:
```bash
# In the unified-workspace directory:
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Environment Configuration
Copy the environment template to `server/.env`:
```bash
cp .env.example server/.env
```
Ensure `JWT_SECRET` and `COOKIE_SECRET` are distinct strings of at least 32 characters in production.

### 4. Seed Verified Roadmaps
Populate the database with the verified **Data Structures & Algorithms** and **Database Management Systems** tracks:
```bash
npm run seed
```
*Note: The seed script uses idempotent upsert logic — running it multiple times preserves all existing user enrollments and progress records.*

### 5. Start the Application
Run both the frontend and backend concurrently in development mode:
```bash
npm run dev
```
- **Web Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api/v1`
- **API Health Check:** `http://localhost:5000/api/v1/health`

---

## Curator & Administrator Setup

By default, all public sign-ups are assigned the `student` role for security. To grant administrator privileges to an account:

1. Register an account through the UI at `http://localhost:5173/register`.
2. Run the secure CLI promotion tool from the workspace root:
   ```bash
   npm run make-admin -- your_email@example.com
   ```
3. Refresh your browser or log back in. The **Curator Studio** link (`/admin`) will now be accessible in your navigation bar.

---

## Production Deployment

To build the client SPA and serve it directly from the Express backend in production:

```bash
# 1. Build the production client bundle
npm run build

# 2. Set environment to production
NODE_ENV=production

# 3. Start the unified production server
npm start
```
Express will automatically serve the compiled frontend from `client/dist` and route all non-API requests to the client-side router.

---

## API Response Format

All API responses adhere to standard JSON response envelopes:

### Success Response (`200 / 201`)
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 24 }
}
```

### Error Response (`400 / 401 / 403 / 404 / 500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description.",
    "fields": [{ "path": "email", "message": "Invalid email address format." }],
    "requestId": "uuid-v4-string"
  }
}
```

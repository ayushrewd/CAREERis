<div align="center">
  <a href="https://careeris.vercel.app">
    <img src="public/icon.svg" width="132" alt="CAREERIS logo" />
  </a>

  <h1>CAREERIS</h1>

  <p><strong>India's evidence-based career, skill, and workforce intelligence platform.</strong></p>
  <p>Connecting Industry Demand → Skills → Training → Employment</p>

  <p>
    <a href="https://careeris.vercel.app"><strong>Explore the live platform ↗</strong></a>
    ·
    <a href="https://careeris.vercel.app/login">Create an account</a>
    ·
    <a href="#run-locally">Run locally</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
    <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-270_tests-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
    <img alt="Vercel" src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
  </p>
</div>

---

## One skill language. One connected ecosystem.

India's career and workforce systems often operate in isolation. Candidates cannot clearly prove what they can do, employers struggle to express demand as skills, training providers react slowly to the market, and planners lack a dependable view of local gaps.

CAREERIS closes that loop. It connects every participant through a shared skill intelligence layer and turns real activity—assessments, projects, job requirements, applications, placements, employer feedback, and training outcomes—into evidence that can guide the next decision.

```text
Industry demand → Skill requirements → Candidate evidence
        ↑                                  ↓
Workforce insight ← Outcomes & feedback ← Employment
        ↓
Training plans → Courses, trainers & infrastructure
```

## Built for the whole workforce ecosystem

| Experience | What CAREERIS enables |
| --- | --- |
| **Candidates** | Build a skill passport, verify abilities through assessments and projects, discover gaps, compare careers, receive explainable job matches, and track applications. |
| **Companies** | Register an organization, publish skill-first jobs, review candidates, manage the hiring pipeline, create offers, and submit post-hire feedback. |
| **Training providers** | Align curriculum with demand, manage courses, trainers, equipment, capacity, and measure training relevance. |
| **Government & district planners** | Inspect demand-supply gaps, emerging skills, district performance, programme outcomes, budgets, risks, and create evidence-backed training plans. |

## What makes it different

- **Evidence over self-declaration** — skills can be backed by assessments, projects, credentials, institute verification, or employer feedback.
- **Explainable matching** — job recommendations expose matched skills, missing skills, evidence strength, and scoring components.
- **Closed-loop intelligence** — hiring and post-hire outcomes flow back into workforce and training decisions.
- **Skill-first data model** — jobs, candidates, courses, trainers, demand signals, and supply signals connect through canonical skills and aliases.
- **Role-scoped operations** — authenticated workflows isolate company, candidate, provider, and planner data.
- **Progressive Web App** — installable, responsive, and designed to work across desktop and mobile surfaces.
- **Auditable decisions** — operational actions produce persistent audit records and provenance-aware intelligence signals.

## Platform at a glance

| Layer | Technology |
| --- | --- |
| Application | Next.js 14 App Router, React 18, TypeScript |
| UI | Tailwind CSS, reusable accessible components, Lucide icons |
| API | Next.js route handlers with Zod validation and role-based access control |
| Data | PostgreSQL on Neon with Prisma ORM and committed migrations |
| Identity | Signed HTTP-only sessions backed by PostgreSQL |
| Quality | Vitest, Testing Library, TypeScript checks, end-to-end verification scripts |
| Delivery | Vercel production deployment and installable PWA assets |

The current codebase contains **173 application pages**, **297 API route handlers**, and **270 automated tests across 121 test files**.

## Core product flows

### Candidate journey

Create profile → declare and verify skills → set career goals → assess readiness → discover jobs and learning → apply → interview → placement → portable skill passport.

### Employer journey

Register company → publish a skill-first role → receive candidates → inspect evidence and match explanations → manage interviews and offers → hire → submit post-hire skill feedback.

### Workforce intelligence loop

CAREERIS captures source provenance and separates observed evidence from forecasts and simulations. Demand signals from genuine company jobs can be compared with candidate and training supply, then aggregated for district and national planning.

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database, or the bundled local PostgreSQL runtime supported by this project

### Quick start

```bash
git clone https://github.com/ayushrewd/CAREERis.git
cd CAREERis
npm install
cp .env.example .env
```

Configure the required values in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
```

Apply the schema and start the app:

```bash
npm run db:setup
npm run dev
```

Open [https://careeris.vercel.app/](https://careeris.vercel.app/).

For the bundled persistent local database on Windows:

```bash
npm run dev:local
```

This command starts PostgreSQL, applies committed migrations, and launches CAREERIS.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run dev:local` | Start local PostgreSQL, migrate it, and run the app |
| `npm run build` | Create a production build |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run the complete automated test suite |
| `npm run verify:auth` | Verify registration, sessions, duplicate-email handling, and login |
| `npm run verify:jobs` | Verify company registration, job publishing, visibility, isolation, and authorization |
| `npm run db:migrate` | Apply committed Prisma migrations |

## Repository map

```text
CAREERis/
├── prisma/                 # PostgreSQL schema and reproducible migrations
├── public/                 # PWA icons, manifest assets, and CAREERIS branding
├── scripts/                # Local database, validation, seed, and verification tools
└── src/
    ├── app/                # Product pages and API route handlers
    ├── components/         # Shared UI and application shell
    ├── data/               # Reference and demonstration datasets
    ├── lib/                # Auth, RBAC, geography, i18n, and client utilities
    ├── server/             # Database, repositories, services, and middleware
    └── types/              # Shared TypeScript domain types
```

## Data and security principles

- Passwords are hashed before persistence.
- Sessions use signed, HTTP-only cookies and are verified against active database sessions for protected operations.
- Role checks and entity ownership protect company and candidate workflows.
- Server input is parsed and bounded with Zod before database writes.
- Multi-record registration and job publishing use database transactions.
- Audit records preserve important operational actions.
- Secrets stay in server-side environment variables and must never use the `NEXT_PUBLIC_` prefix.

## Testing philosophy

The suite covers domain services, repositories, role and scope enforcement, skill normalization, intelligence quality, candidate and employer journeys, programme operations, and UI primitives. Critical production flows also have database-backed verification scripts that create temporary records, assert the complete behavior, and clean them up afterward.

```bash
npm run typecheck
npm test
npm run verify:auth
npm run verify:jobs
```

## Contributing

Issues and pull requests are welcome. Keep changes focused, preserve evidence provenance, add meaningful tests for behavioral changes, and run the validation commands before opening a pull request.

<div align="center">
  <br />
  <img src="public/icon.svg" width="48" alt="CAREERIS" />
  <p><strong>Everything connects through skills.</strong></p>
  <p>
    <a href="https://careeris.vercel.app">Live platform</a>
    ·
    <a href="https://github.com/ayushrewd/CAREERis/issues">Report an issue</a>
  </p>
</div>

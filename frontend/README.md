# DevOpsGPT — Frontend

An enterprise-grade React frontend for **DevOpsGPT**, an AI-powered assistant that helps
developers troubleshoot Git, GitHub, Docker, Kubernetes, and CI/CD issues using LLM +
RAG technology. This repository contains **only the frontend**. It runs fully on mock
data today and is structured so a Flask REST API can be dropped in later with minimal
changes.

## Table of contents

- [Overview](#overview)
- [Technology stack](#technology-stack)
- [Folder structure](#folder-structure)
- [Installation](#installation)
- [Development commands](#development-commands)
- [Environment variables](#environment-variables)
- [Available routes](#available-routes)
- [Mock authentication](#mock-authentication)
- [Mock data & future API integration](#mock-data--future-api-integration)
- [Design system](#design-system)
- [Known limitations](#known-limitations)

## Overview

DevOpsGPT presents a single pane of glass across five DevOps surfaces:

- **Git** — authentication failures, merge conflicts, detached HEAD, rejected pushes
- **GitHub repositories** — health, security, and code-quality scanning
- **Docker** — Dockerfile security, size, and optimization analysis
- **Kubernetes** — cluster/pod monitoring with AI remediation commands
- **CI/CD** — pipeline log analysis for GitHub Actions, GitLab CI, and Jenkins

All AI responses, charts, and tables in this build are backed by realistic **mock data**.
No LLM, RAG, or authentication logic is implemented yet — that's intentionally left for
the upcoming Flask backend.

## Technology stack

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Language | TypeScript (strict) |
| UI library | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| HTTP client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Server-state (future) | TanStack Query |

## Folder structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/            # Sidebar, Navbar
│   │   ├── charts/            # ChartCard wrapper for Recharts
│   │   ├── common/            # MetricCard, Modal, Toast, badges, states, etc.
│   │   ├── chat/               # ChatInterface
│   │   ├── debugger/           # AnalysisTabs (Analysis/Reasoning/Sources/Fix History)
│   │   ├── repositories/       # RepositoryHealthCard
│   │   ├── routing/            # ProtectedRoute / PublicOnlyRoute
│   │   ├── landing/            # TerminalPreview hero visual
│   │   └── tables/             # Generic DataTable
│   ├── pages/                  # One folder per route (see below)
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   └── AppLayout.tsx       # Sidebar + Navbar shell for authenticated routes
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   └── useMediaQuery.ts
│   ├── services/                # One file per feature; mock now, Axios-ready later
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── debuggerService.ts
│   │   ├── repositoryService.ts
│   │   ├── dockerService.ts
│   │   ├── kubernetesService.ts
│   │   ├── cicdService.ts
│   │   ├── dashboardService.ts
│   │   ├── historyService.ts
│   │   ├── knowledgeBaseService.ts
│   │   └── analyticsService.ts
│   ├── mocks/                   # Realistic mock data per feature
│   ├── types/                   # Strict TypeScript interfaces per domain
│   ├── lib/
│   │   └── utils.ts             # cn(), date/number formatting, mockDelay, clipboard
│   ├── App.tsx                  # Route definitions
│   ├── main.tsx                 # App bootstrap (providers)
│   └── index.css                # Tailwind v4 theme + component classes
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

## Installation

```bash
cd frontend
npm install
```

## Development commands

```bash
npm run dev         # start the Vite dev server (http://localhost:5173)
npm run build        # type-check + production build to dist/
npm run typecheck    # run the TypeScript compiler in --noEmit mode
npm run lint          # run ESLint
npm run preview       # preview the production build locally
```

## Environment variables

Copy `.env.example` to `.env` (already done for local development):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCKS=true
```

`VITE_API_BASE_URL` is already wired into `src/services/apiClient.ts` and will be used
automatically once real endpoints replace the mock service functions.

## Available routes

**Public**

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Login (mock auth) |
| `/signup` | Signup (mock auth) |

**Protected** (require mock login; redirect to `/login` otherwise)

| Route | Description |
|---|---|
| `/dashboard` | Metrics, charts, recent issues |
| `/debugger` | AI Debugger — paste/upload an error, get an AI analysis |
| `/git-analyzer` | Git-specific error analysis |
| `/github-repository` | Repository health/security/quality scanner |
| `/docker-analyzer` | Dockerfile analysis |
| `/kubernetes` | Cluster & pod monitoring |
| `/cicd` | CI/CD pipeline log analysis |
| `/knowledge-base` | RAG document management |
| `/history` | Filterable, paginated error history |
| `/analytics` | Team-wide analytics |
| `/settings` | Profile, API keys, LLM config, notifications, appearance |

Any unmatched path renders a `404` page.

## Mock authentication

- Login succeeds for **any syntactically valid email** and a password of **6+ characters**.
- Signup always succeeds and logs the new user in immediately.
- Auth state (`user`, mock `token`) is persisted in `localStorage` under
  `devopsgpt_user` / `devopsgpt_token`.
- `AuthContext` (`src/context/AuthContext.tsx`) exposes `login`, `signup`, `logout`,
  `user`, and `isAuthenticated` — this is the seam where Flask JWT auth will plug in.
- `ProtectedRoute` redirects unauthenticated users to `/login`; `PublicOnlyRoute`
  redirects authenticated users away from `/login` and `/signup`.

## Mock data & future API integration

Every feature has three layers:

1. **`src/types/*`** — the TypeScript contract (request/response shapes).
2. **`src/mocks/*`** — realistic static/generated mock data matching those types.
3. **`src/services/*`** — async functions the UI calls. They currently resolve mock
   data after a simulated network delay (`mockDelay`), and each function has a
   `TODO(flask-integration)` comment showing exactly what the real Axios call should
   look like, e.g.:

   ```ts
   // TODO(flask-integration): replace with:
   // const { data } = await apiClient.post<AnalysisResult>('/debugger/analyze', request);
   // return data;
   ```

To connect the real Flask backend later:

1. Set `VITE_API_BASE_URL` to the Flask server URL.
2. Replace the body of each function in `src/services/*` with the corresponding
   `apiClient` call (the Axios instance already attaches the mock JWT bearer token
   from `localStorage` and centralizes error handling).
3. Delete or keep `src/mocks/*` for local development/demo fallback.

No component code should need to change — pages only import from `services/*`, never
from `mocks/*` directly.

## Design system

- Dark theme only, enterprise SaaS aesthetic (inspired by Datadog / Grafana / Linear).
- Color tokens are defined once via Tailwind v4's CSS-first `@theme` block in
  `src/index.css` (`bg`, `primary`, `secondary`, `success`, `warning`, `danger`,
  `text-*`, `border`).
- Reusable primitives live in `src/components/common` — buttons (`.btn-primary`,
  `.btn-secondary`, `.btn-ghost`, `.btn-danger`), `.card`, `.input-field`, `.skeleton`.
- All interactive elements have visible focus states, `aria-label`s where needed, and
  keyboard support (Escape closes modals, Tab order is logical).

## Known limitations

- No real LLM, RAG, or authentication logic — everything is mock data with simulated
  network delays.
- No persistence beyond `localStorage` for auth; refreshing keeps you logged in, but
  there is no real session/token refresh flow yet.
- Charts and tables use static mock datasets rather than live/streaming data.
- The production JS bundle is a single chunk (~910 KB / ~263 KB gzipped); code-splitting
  by route is a good next optimization once real API integration adds more weight.

---

## Next command to run

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` and log in with any email/password (6+ characters).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Openomy is an open-source economic platform that visualizes and tracks all forms of open-source contributions (not just commits) — PRs, issues, discussions, comments, and reactions. It generates embeddable SVG charts and provides contributor analytics for GitHub repositories.

## Commands

```bash
# Install dependencies (requires pnpm, Node >= 22)
pnpm install

# Run development server (port 3100)
pnpm dev

# Build all packages
pnpm build

# Type checking
pnpm check-types

# Linting
pnpm lint

# Format code
pnpm format
```

### Web app scripts (run from apps/web/)
```bash
pnpm gen:party-poster-bubble-template  # Generate party poster bubble position templates
tsx scripts/check-svg.ts               # Validate SVG rendering
tsx scripts/recache-svg.ts             # Refresh SVG cache in Vercel Blob
```

**Testing:** No testing framework is currently configured.

## Architecture

### Monorepo Structure (pnpm + Turborepo)
- **apps/web** — Next.js 15 app (App Router, React 19, TypeScript 5)
- **packages/ui** — 50+ shared UI components (shadcn/ui + Radix UI primitives)
- **packages/eslint-config** — Shared ESLint configs (base, next-js, react-internal)
- **packages/typescript-config** — Shared TypeScript configs

### URL Routing & Middleware
`middleware.ts` rewrites clean URLs to internal routes:
- `/{owner}` → `/github/{owner}`
- `/{owner}/{repo}` → `/github/{owner}/{repo}`

Protected paths (`/github`, `/party`, `/svg`, `/openexpo`, `/api`, `/`) are excluded from rewriting.

### Data Flow
All backend data fetching goes through `process.env.API_BASE_URL`. The web app is a frontend-only layer — no database, all data comes from the external API.

- **Server-side:** `fetch()` in API route handlers (`app/api/`)
- **Client-side:** React Query (TanStack Query v5) hooks; some hooks call GitHub's public API directly (`api.github.com`)
- **Validation:** Zod schemas in `lib/schema.ts` validate all API request/response data

### SVG Generation Pipeline
Server-side chart rendering at `app/svg/route.ts` (maxDuration: 300s):
1. Parse query params (repo, chart type, legend, exclude list, date range)
2. Check Vercel Blob cache using MD5 hash of params, with ETag/Last-Modified validation
3. Fetch data from backend API
4. Generate SVG using linkedom (virtual DOM) + D3.js + opentype.js (font metrics)
5. Store result in Vercel Blob for future cache hits

Chart types (`app/svg/charts/`): `list`, `histogram`, `podium`, `bubble`
Bubble chart legend types: `pr`, `issue`, `discussion`

### API Route Structure
- `/api/repos/*` — Repository data (contributions, issues, PRs, discussions, comments, weights)
- `/api/parties/*` — Event/party contributor data
- `/api/statistics` — Overall statistics
- `/api/search/contributors` — Contributor search
- `/api/waitlist` — Waitlist management
- `/api/contact` — Contact form

### Key Directories (apps/web/)
- `components/repo-contributors/` — Data tables and columns for contributor lists (TanStack Table)
- `components/contributor-*/` — Feature-specific contributor components (issues, PRs, discussions)
- `hooks/` — Custom hooks (`use-github-repo`, `use-github-user`, `use-mobile`, `use-contribution-counts`)
- `lib/schema.ts` — Zod validation schemas
- `providers/` — React Query client + theme provider (next-themes)
- `services/` — Service layer for products and AntV data
- `types/` — TypeScript definitions (product types, OSCP types)

### Key Technical Stack
- **Visualization:** D3.js for data processing, custom SVG generation
- **3D Graphics:** Three.js + React Three Fiber (particle animations in `ParticleScene.tsx`)
- **Styling:** Tailwind CSS v4 with CSS variables, dark/light theme via next-themes
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Storage:** Vercel Blob for SVG caching
- **Dates:** dayjs with UTC support

## Environment Variables

```bash
API_BASE_URL=<backend API URL>
BLOB_READ_WRITE_TOKEN=<Vercel Blob token>
```

## Code Style

- kebab-case for files, PascalCase for components
- Named exports for components
- Server components by default; client components only when needed
- Single quotes in TypeScript (configured in `.prettierrc`), double quotes in JSX
- 2-space indentation, LF line endings

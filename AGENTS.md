# Repository Guidelines

Monorepo using pnpm workspaces and Turborepo; Node 22+ required.

## Project Structure & Module Organization
- `apps/web`: Next.js 15 (App Router). Routes in `app/`, API in `app/api/*`, SVG chart endpoints in `app/svg/*`, static assets in `public/`.
- `packages/ui`: Shared React UI (shadcn-based) in `src/components/ui/*`; hooks in `src/hooks/*`; utils in `src/lib/*`.
- `packages/eslint-config`, `packages/typescript-config`: Shared configs consumed across the monorepo.
- Tooling: pnpm workspace + Turborepo (`turbo.json`).

## Build, Test, and Development Commands
- `pnpm install`: Install workspace dependencies.
- `pnpm dev`: Run all app/package dev tasks.
- `pnpm --filter @openomy/website dev`: Start the web app at `http://localhost:3100`.
- `pnpm build`: Build all packages/apps.
- `pnpm --filter @openomy/website start`: Serve the built web app.
- `pnpm lint` / `pnpm check-types`: ESLint and TypeScript checks.
- `pnpm format`: Run Prettier on `*.{ts,tsx,md}`.

## Coding Style & Naming Conventions
- Formatting: Prettier (single quotes); 2-space indentation via `.editorconfig`.
- TypeScript: strict mode; prefer explicit types for public APIs.
- ESLint: Next.js/React rules; keep `apps/web/eslint.config.mjs` and shared configs in sync.
- Naming: PascalCase for React components (e.g., `SupportedProjectCard.tsx`); kebab-case for folders/utilities (e.g., `components/contributor-issues/*`, `utils/flatten.ts`).

## Testing Guidelines
- No formal test suite yet. If adding tests, colocate as `*.test.ts(x)` or `__tests__/` near source.
- Prioritize logic in `apps/web/app/svg/*` and `apps/web/utils/*`.
- Keep tests deterministic; avoid network calls—stub GitHub responses where needed.
- Before PRs, ensure `pnpm check-types` and `pnpm lint` pass.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). Example: `feat(web): add SVG chart legend`.
- PRs: Clear description, linked issues, and screenshots for UI changes.
- Pre-flight: run `pnpm lint`, `pnpm check-types`, and `pnpm build` locally.

## Security & Configuration Tips
- Copy `apps/web/env.example` to `apps/web/.env.local`; set `BLOB_READ_WRITE_TOKEN`, `API_BASE_URL`. Never commit secrets.
- Turborepo reads env vars during `build` (see `turbo.json`).
- Prefer adding shared UI to `packages/ui` rather than duplicating in `apps/web`.


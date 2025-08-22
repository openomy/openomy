# Repository Guidelines

## Project Structure & Module Organization
- `apps/web`: Next.js 15 app (App Router). Routes in `app/`, API in `app/api/*`, SVG chart endpoints in `app/svg/*`, public assets in `public/`.
- `packages/ui`: Shared React UI (shadcn-based) in `src/components/ui/*`, plus hooks and utils in `src/hooks/*`, `src/lib/*`.
- `packages/eslint-config`, `packages/typescript-config`: Shared configs consumed across the monorepo.
- Tooling: pnpm workspace, Turborepo (`turbo.json`). Node `>=22`.

## Build, Test, and Development Commands
- `pnpm install`: Install workspace deps.
- `pnpm dev`: Run all app/package dev tasks via Turborepo.
- `pnpm --filter @openomy/website dev`: Run the web app at `http://localhost:3100`.
- `pnpm build`: Build all packages/apps.
- `pnpm --filter @openomy/website start`: Start the built web app.
- `pnpm lint` / `pnpm check-types`: ESLint and TypeScript checks.
- `pnpm format`: Prettier on `*.{ts,tsx,md}`.

## Coding Style & Naming Conventions
- Formatting: Prettier (single quotes); 2-space indentation via `.editorconfig`.
- TypeScript: strict mode; prefer explicit types for public APIs.
- ESLint: Next.js/React rules; keep `apps/web/eslint.config.mjs` and shared configs in sync.
- Naming: PascalCase for React components (e.g., `SupportedProjectCard.tsx`); kebab-case for folders and utilities (e.g., `components/contributor-issues/*`, `utils/flatten.ts`).

## Testing Guidelines
- No formal test suite yet. Ensure `pnpm check-types` and `pnpm lint` pass.
- If adding tests, colocate as `*.test.ts(x)` or `__tests__` near source. Prioritize logic in `apps/web/app/svg/*` and `apps/web/utils/*`.
- Aim for deterministic tests without network calls; stub GitHub responses where needed.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` (see `git log`).
- PRs: include a clear description, linked issues, and screenshots for UI changes.
- Before opening: run `pnpm lint`, `pnpm check-types`, and `pnpm build` locally.

## Security & Configuration Tips
- Copy `apps/web/env.example` to `apps/web/.env.local`; set `BLOB_READ_WRITE_TOKEN`, `API_BASE_URL`. Do not commit secrets.
- Turborepo reads env vars during `build` (see `turbo.json`).
- Prefer adding shared UI to `packages/ui` rather than duplicating in `apps/web`.

> For a deeper architecture overview and common tasks, see `CLAUDE.md`.


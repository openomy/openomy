# Repository Guidelines

## Project Structure & Module Organization
This repo is a pnpm workspace monorepo managed with Turborepo.
- `apps/web`: Next.js 15 app (App Router). Routes live in `app/`, API handlers in `app/api/*`, SVG endpoints in `app/svg/*`, static assets in `public/`.
- `packages/ui`: shared React UI components (`src/components/ui/*`), hooks (`src/hooks/*`), and utilities (`src/lib/*`).
- `packages/eslint-config` and `packages/typescript-config`: shared lint and TS configs used across packages.

## Build, Test, and Development Commands
- `pnpm install`: install all workspace dependencies (Node `>=22`).
- `pnpm dev`: run all workspace dev tasks via Turbo.
- `pnpm --filter @openomy/website dev`: run web app locally at `http://localhost:3100`.
- `pnpm build`: build all apps/packages.
- `pnpm --filter @openomy/website start`: run the built web app.
- `pnpm lint`: run ESLint across the monorepo.
- `pnpm check-types`: run TypeScript checks.
- `pnpm format`: run Prettier on `*.{ts,tsx,md}`.

## Coding Style & Naming Conventions
- Use TypeScript with strict settings; prefer explicit types for exported/public APIs.
- Formatting: Prettier + `.editorconfig` (2-space indentation, single quotes).
- Naming: React components in PascalCase (for example, `SupportedProjectCard.tsx`); folders/utilities in kebab-case (for example, `utils/flatten.ts`).
- Prefer shared UI in `packages/ui` instead of duplicating components in `apps/web`.

## Testing Guidelines
There is no formal test suite yet.
- Add tests as `*.test.ts(x)` or in `__tests__/` near implementation.
- Prioritize deterministic tests for logic-heavy areas such as `apps/web/app/svg/*` and `apps/web/utils/*`.
- Avoid live network calls; stub GitHub/API responses.
- Before opening a PR, run `pnpm lint` and `pnpm check-types` (and `pnpm build` for integration confidence).

## Commit & Pull Request Guidelines
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` (example: `feat(web): add SVG chart legend`).
- PRs should include a clear summary, linked issue(s), and screenshots for UI changes.
- Keep PRs focused; include validation steps/commands in the description.

## Security & Configuration Tips
- Copy `apps/web/env.example` to `apps/web/.env.local`.
- Set required vars like `BLOB_READ_WRITE_TOKEN` and `API_BASE_URL` locally.
- Never commit secrets; Turborepo reads env vars during `build`.

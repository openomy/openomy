# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Openomy is an Open-Source Economic platform that combines blockchain technology and AI to provide comprehensive visualization and tracking for open-source contributions. The project focuses on showcasing all types of contributions (not just code) through various chart types and data visualizations.

## Commands

### Development
```bash
# Install dependencies (requires pnpm)
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

### Working with specific packages
```bash
# Run commands in the web app
cd apps/web && pnpm dev

# Generate party poster templates
cd apps/web && pnpm gen:party-poster-bubble-template
```

## Architecture

### Monorepo Structure
- **apps/web**: Main Next.js 15 application using App Router
- **packages/ui**: Shared UI component library based on shadcn/ui
- **packages/eslint-config**: Shared ESLint configurations
- **packages/typescript-config**: Shared TypeScript configurations

### Key Technical Decisions
1. **Data Fetching**: Uses server components with direct GitHub API calls in API routes
2. **Visualization**: Multiple chart implementations (bubble, histogram, podium) with SVG generation
3. **State Management**: React Query for server state, local state with React hooks
4. **Styling**: Tailwind CSS v4 with CSS variables for theming
5. **Component Architecture**: Compound components pattern with shadcn/ui primitives

### API Route Structure
- `/api/github/*`: GitHub data fetching endpoints
- `/api/party/*`: Party/event related endpoints
- `/svg/*`: Server-side SVG generation for embeddable charts

### Important Patterns
1. **GitHub Data Processing**: All GitHub API calls go through `services/GithubService.ts`
2. **Chart Components**: Located in `components/github/contributors/*`, each chart type has its own component
3. **SVG Generation**: Server-side rendering in `app/svg/*` routes for embedding
4. **Form Validation**: Uses Zod schemas with React Hook Form
5. **Error Handling**: Consistent error boundaries and fallback UI

## Development Notes

### When adding new features:
1. Follow the existing monorepo structure - shared code goes in packages/
2. Use the UI components from packages/ui before creating new ones
3. API routes should follow RESTful conventions in app/api/
4. Maintain TypeScript strict mode compliance
5. Use server components by default, client components only when needed

### Common Tasks:
- Adding a new chart type: Create component in `components/github/contributors/`, add API route if needed
- Modifying UI components: Edit in `packages/ui/src/components/ui/`
- Adding new GitHub data: Extend `services/GithubService.ts`
- Creating embeddable widgets: Add new route in `app/svg/`

### Code Style:
- TypeScript with strict mode
- Functional components with hooks
- Named exports for components
- Consistent file naming: kebab-case for files, PascalCase for components
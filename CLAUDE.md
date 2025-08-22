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

# Check SVG rendering
cd apps/web && tsx scripts/check-svg.ts

# Recache SVG
cd apps/web && tsx scripts/recache-svg.ts
```

## Architecture

### Monorepo Structure
- **apps/web**: Main Next.js 15 application using App Router
- **packages/ui**: Shared UI component library based on shadcn/ui
- **packages/eslint-config**: Shared ESLint configurations
- **packages/typescript-config**: Shared TypeScript configurations

### Key Technical Decisions
1. **Framework**: Next.js 15 with App Router, React 19, TypeScript 5
2. **Package Manager**: pnpm with Turborepo for monorepo management
3. **Data Fetching**: Server components with external API calls to `process.env.API_BASE_URL`
4. **Visualization**: D3.js for data processing, custom SVG generation for charts
5. **3D Graphics**: Three.js with React Three Fiber for particle animations
6. **State Management**: React Query (TanStack Query) for server state, React hooks for local state
7. **Styling**: Tailwind CSS v4 with CSS variables for theming
8. **Component Architecture**: Compound components pattern with shadcn/ui primitives
9. **Storage**: Vercel Blob for SVG caching

### API Route Structure
- `/api/repos/*`: Repository data endpoints (contributions, issues, PRs, discussions)
- `/api/parties/*`: Event/party related endpoints
- `/api/statistics`: Overall statistics endpoint
- `/api/search/*`: Search functionality
- `/api/waitlist`: Waitlist management
- `/svg/*`: Server-side SVG generation for embeddable charts

### Important Patterns
1. **External API Integration**: All data fetching goes through `process.env.API_BASE_URL`
2. **Chart Components**: Located in `components/repo-contributors/` and party-specific components
3. **SVG Generation**: Server-side rendering in `app/svg/*` routes with caching via Vercel Blob
4. **Data Tables**: Reusable data table components using TanStack Table
5. **Form Validation**: Zod schemas defined in `lib/schema.ts`
6. **Error Handling**: Try-catch blocks with appropriate HTTP status codes
7. **Date Handling**: dayjs configured with UTC and locale support

## Development Notes

### Environment Variables
```bash
API_BASE_URL=<backend API URL>
BLOB_READ_WRITE_TOKEN=<Vercel Blob token>
```

### When adding new features:
1. Follow the existing monorepo structure - shared code goes in packages/
2. Use the UI components from packages/ui before creating new ones
3. API routes should follow RESTful conventions in app/api/
4. Maintain TypeScript strict mode compliance
5. Use server components by default, client components only when needed
6. Include proper loading states and error handling

### Common Tasks:
- **Adding a new chart type**: Create SVG generation logic in `app/svg/charts/`, update route handler
- **Modifying UI components**: Edit in `packages/ui/src/components/ui/`
- **Adding new API endpoints**: Create route handler in `app/api/`, use schema validation
- **Creating embeddable widgets**: Add new route in `app/svg/`, implement caching
- **Working with contributor data**: Use existing data table components and columns

### Code Style:
- TypeScript with strict mode
- Functional components with hooks
- Named exports for components
- Consistent file naming: kebab-case for files, PascalCase for components
- Async/await for promises
- Early returns for error conditions
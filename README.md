
![](public/banner.gif)

# TanStack Start + Convex + Clerk Starter

A Typescript production-ready starter template with authentication, real-time backend, and a clean slate-themed dashboard.

## Stack

- **TanStack Start** — Full-stack React framework (SSR, file-based routing)
- **Convex** — Real-time backend (database, server functions)
- **Clerk** — Authentication (sign-in/up, user management)
- **shadcn/ui** — Component library (sidebar, cards, buttons)
- **Tailwind CSS v4** — Styling with OKLCH slate theme
- **Geist font** — Via `@fontsource`, self-hosted

## Quick Start

```bash
# Install dependencies
pnpm i

# Copy environment variables
cp .env.example .env

# Fill in your Clerk and Convex credentials in .env, then:
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Features

- Landing page with auth-aware CTA
- Clerk sign-in/sign-up pages with hash-based SSO routing
- Authenticated dashboard with collapsible icon sidebar
- Task CRUD with real-time updates via Convex
- User settings page with Clerk profile
- Slate OKLCH color palette (light & dark)
- Geist Sans + Mono fonts

## Project Structure

```
src/
  routes/          # File-based routing (TanStack Start)
  components/      # App components + shadcn/ui primitives
  styles/          # Tailwind CSS + theme variables
  lib/             # Utilities
convex/            # Backend schema, queries, mutations
docs/              # Documentation
```

## Documentation

See the [docs/](./docs/README.md) directory for:

- [Getting Started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [Stack](./docs/stack.md)
- [Customization](./docs/customization.md)

## License

MIT

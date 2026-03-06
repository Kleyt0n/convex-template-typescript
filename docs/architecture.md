# Architecture

## Provider Hierarchy

The app wraps content in providers in this order:

```
ClerkProvider (authentication context)
  └─ ConvexProviderWithClerk (authenticated Convex client)
       └─ QueryClientProvider (TanStack Query caching)
            └─ RouterProvider (TanStack Router)
```

This order ensures:
- Clerk provides auth state to all children
- Convex receives auth tokens from Clerk automatically
- TanStack Query can cache Convex subscriptions
- The router has access to all contexts

## Authentication Flow

1. **Server middleware** (`src/start.ts`): `clerkMiddleware` processes Clerk session cookies on every request
2. **Route guard** (`_authenticated/route.tsx`): `beforeLoad` checks auth state and redirects to `/sign-in` if unauthenticated. Sign-in/sign-up pages use `routing="hash"` so SSO callbacks use hash fragments (e.g., `/sign-in#/sso-callback`) instead of path suffixes, avoiding 404s with TanStack Router's exact route matching
3. **Convex auth** (`convex/auth.config.ts`): Convex validates Clerk JWTs to authenticate server-side queries/mutations
4. **User identity**: Convex functions access `ctx.auth.getUserIdentity()` to scope data per user

## Data Flow

```
User Action
  → React Component (useMutation)
    → Convex Mutation (server-side, authenticated)
      → Database Write
        → Real-time Subscription Update
          → React Component Re-render (useQuery)
```

All queries are real-time subscriptions — when data changes in Convex, connected clients update automatically.

## File-Based Routing

TanStack Start uses file-based routing in `src/routes/`:

- `__root.tsx` — HTML shell, shared across all routes
- `index.tsx` — `/` (public landing)
- `sign-in.tsx` — `/sign-in`
- `sign-up.tsx` — `/sign-up`
- `_authenticated/route.tsx` — Layout for all authenticated routes (prefix `_` = pathless layout)
  - `dashboard.tsx` — `/dashboard`
  - `tasks.tsx` — `/tasks`
  - `settings.tsx` — `/settings`

## Directory Structure

- `convex/` — Backend: schema, queries, mutations
- `src/routes/` — Pages and layouts
- `src/components/` — Reusable React components
- `src/components/ui/` — shadcn/ui primitives
- `src/lib/` — Utilities
- `src/styles/` — CSS and theme

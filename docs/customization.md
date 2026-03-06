# Customization

## Theme

The theme is defined in `src/styles/app.css` using OKLCH CSS variables. The default palette uses the **slate** color scale (subtle blue hue at ~257-265 on the OKLCH hue axis).

### Changing the palette

To switch to a different color palette, adjust the chroma and hue values. The three OKLCH values are: `lightness chroma hue`.

```css
/* Slate (current) */
--primary: oklch(0.208 0.042 265.755);

/* Zinc (neutral) */
--primary: oklch(0.208 0.014 285.823);

/* Stone (warm) */
--primary: oklch(0.216 0.006 56.043);
```

Increase chroma (0–0.4) for more saturation, set hue (0–360) to change the color.

### Dark mode

Toggle the `dark` class on the `<html>` element. The `.dark` selector in `app.css` provides the dark palette.

## Adding Routes

1. Create a file in `src/routes/`:
   - Public route: `src/routes/about.tsx`
   - Authenticated route: `src/routes/_authenticated/projects.tsx`

2. Export a route:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  return <div>Projects</div>;
}
```

3. Add navigation in `src/components/nav-main.tsx`:

```tsx
const items = [
  // ... existing items
  { title: "Projects", to: "/projects", icon: FolderIcon },
];
```

## Adding Convex Tables

1. Define the table in `convex/schema.ts`:

```ts
export default defineSchema({
  tasks: defineTable({ /* existing */ }),
  projects: defineTable({
    name: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
```

2. Create queries/mutations in `convex/projects.ts`:

```ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});
```

3. Use in components:

```tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const projects = useQuery(api.projects.list);
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add dialog table tabs
```

Components are installed to `src/components/ui/` and are fully editable.

## Environment Variables

- **Clerk**: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Convex**: `CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL`
- **Convex env vars** (set in Convex dashboard): `CLERK_JWT_ISSUER_DOMAIN`

Client-accessible variables must be prefixed with `VITE_`.

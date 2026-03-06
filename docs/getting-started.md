# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- A [Clerk](https://clerk.com/) account (free tier works)
- A [Convex](https://www.convex.dev/) account (free tier works)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd <repo-name>
pnpm install
```

### 2. Configure Clerk

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Copy your **Publishable Key** and **Secret Key**
3. In Clerk dashboard, go to **JWT Templates** and create a "Convex" template
4. Copy `.env.example` to `.env` and fill in:

```bash
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Configure Convex

1. Run `npx convex dev` — this will prompt you to create a project or link an existing one
2. In the Convex dashboard, go to **Settings > Environment Variables** and add:
   - `CLERK_JWT_ISSUER_DOMAIN` — your Clerk JWT issuer domain (e.g., `https://your-app.clerk.accounts.dev`)
3. Your `.env` should now also have:

```bash
CONVEX_DEPLOYMENT=dev:your-project-name
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### 4. Run the dev server

```bash
pnpm dev
```

This starts both the Convex dev server and the Vite dev server concurrently. Visit [http://localhost:3000](http://localhost:3000).

## Verifying the setup

1. The landing page should render at `/`
2. Clicking "Get Started" should redirect to Clerk sign-in
3. After signing in, you should see the dashboard with sidebar navigation
4. Navigate to Tasks and create a task — it should appear in real-time
5. The dashboard stats should update to reflect your tasks

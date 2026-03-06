import type { QueryClient } from "@tanstack/react-query";
import type { ConvexClient } from "convex/browser";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/tanstack-react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import appCss from "@/styles/app.css?url";

const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const clerkAuth = await auth();
  let token: string | null = null;
  try {
    token = await clerkAuth.getToken({ template: "convex" });
  } catch {
    // Convex JWT template may not be configured in Clerk
  }
  return {
    userId: clerkAuth.userId,
    sessionId: clerkAuth.sessionId,
    orgId: clerkAuth.orgId,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Start + Convex + Clerk" },
      {
        name: "description",
        content:
          "A production-ready starter template with TanStack Start, Convex, Clerk, and shadcn/ui",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const clerkAuth = await fetchClerkAuth();
    if (clerkAuth.token) {
      context.convexQueryClient.serverHttpClient?.setAuth(clerkAuth.token);
    }
    return { auth: clerkAuth };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk
        client={Route.useRouteContext().convexClient}
        useAuth={useAuth}
      >
        <html lang="en" suppressHydrationWarning>
          <head>
            <HeadContent />
          </head>
          <body>
            <Outlet />
            <Scripts />
          </body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

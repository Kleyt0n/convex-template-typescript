import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const authGuard = createServerFn({ method: "GET" }).handler(async () => {
  const clerkAuth = await auth();
  if (!clerkAuth.userId) {
    throw redirect({ to: "/sign-in" });
  }
  return { userId: clerkAuth.userId };
});

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => authGuard(),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

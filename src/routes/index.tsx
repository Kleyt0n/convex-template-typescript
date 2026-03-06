import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import { CursorGlow } from "@/components/cursor-glow";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <CursorGlow />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <img
          src="/logo.svg"
          alt="Logo"
          className="mx-auto mb-8 h-16 w-16"
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Build faster with
          <br />
          <span className="text-muted-foreground">real-time</span> full-stack
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A production-ready starter template with TanStack Start, Convex,
          Clerk, and shadcn/ui. Authentication, real-time data, and beautiful
          components — ready to go.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

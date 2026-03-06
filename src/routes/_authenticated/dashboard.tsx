import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardCards } from "@/components/dashboard-cards";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const stats = useQuery(api.tasks.getStats);

  return (
    <div className="space-y-6">
      <DashboardCards
        stats={stats ?? { total: 0, completed: 0, pending: 0 }}
      />
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodoIcon, CheckCircle2Icon, CircleDotIcon } from "lucide-react";

interface DashboardCardsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

const cards = [
  { key: "total" as const, title: "Total Tasks", icon: ListTodoIcon },
  { key: "completed" as const, title: "Completed", icon: CheckCircle2Icon },
  { key: "pending" as const, title: "Pending", icon: CircleDotIcon },
];

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats[card.key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

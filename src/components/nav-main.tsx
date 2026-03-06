import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboardIcon,
  ListTodoIcon,
  SettingsIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Tasks", to: "/tasks", icon: ListTodoIcon },
  { title: "Settings", to: "/settings", icon: SettingsIcon },
] as const;

export function NavMain() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={pathname === item.to}>
              <Link to={item.to}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

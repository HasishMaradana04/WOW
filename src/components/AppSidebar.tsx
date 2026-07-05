import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, Route, Building2, BarChart3,
  Settings, Wind, AlertTriangle, FileText, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Map", url: "/map", icon: Map },
  { title: "Streets", url: "/streets", icon: Route },
  { title: "Report", url: "/report", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
];
const admin = [
  { title: "Municipal", url: "/municipal", icon: Building2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (s) => s.location.pathname });
  const auth = useAuth();
  const user = auth.user;
  const displayName = auth.profile?.name ?? auth.user?.email?.split("@")[0] ?? "";
  const role = auth.role;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-aqi-hazard/70 shadow-[var(--shadow-glow)]">
            <Wind className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight tracking-tight">CleanAir</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">& Clear Streets</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url}>
                    <Link to={item.url}><item.icon /> <span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Command</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {admin.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url}>
                    <Link to={item.url}><item.icon /> <span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={path === "/settings"}>
              <Link to="/settings"><Settings /> <span>Settings</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut}>
                <LogOut /> <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        {user && !collapsed && (
          <div className={cn("mx-2 mt-1 rounded-lg glass-soft p-2.5")}>
            <div className="flex items-center gap-2">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand/80 to-aqi-hazard/60 text-xs font-semibold text-primary-foreground">
                {displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium">{displayName}</div>
                <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{role}</div>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

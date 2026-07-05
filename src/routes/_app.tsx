import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AIAssistant } from "@/components/AIAssistant";
import { Bell, Search } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger />
            <div className="relative ml-2 hidden max-w-md flex-1 md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search streets, reports, officers, cases…"
                className="h-9 w-full rounded-lg border border-border bg-secondary/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full border border-aqi-good/30 bg-aqi-good/10 px-2.5 py-1 text-[11px] font-semibold text-aqi-good md:flex">
                <span className="size-1.5 rounded-full bg-aqi-good animate-pulse" /> LIVE
              </div>
              <button className="relative grid size-9 place-items-center rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground">
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-aqi-poor" />
              </button>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
          <AIAssistant />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

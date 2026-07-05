import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, Flame, School, Siren, Factory } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { STREETS, REPORTS, topPollutedStreets } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({ meta: [{ title: "Alerts — CleanAir" }] }),
  component: Alerts,
});

const rules = [
  { icon: AlertTriangle, tone: "aqi-unhealthy", label: "AQI > 150", subtitle: "Orange alert" },
  { icon: AlertTriangle, tone: "aqi-poor", label: "AQI > 200", subtitle: "Red alert" },
  { icon: Siren, tone: "aqi-severe", label: "AQI > 300", subtitle: "Emergency" },
  { icon: School, tone: "aqi-hazard", label: "Smoke near school", subtitle: "Emergency" },
  { icon: Flame, tone: "aqi-poor", label: "Garbage fire", subtitle: "Notify municipality" },
  { icon: Factory, tone: "aqi-severe", label: "Industrial leak", subtitle: "Highest priority" },
];

function Alerts() {
  const active = topPollutedStreets(6);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
        <p className="text-sm text-muted-foreground">Real-time threshold breaches and AI-detected emergencies</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {rules.map((r) => (
          <GlassCard key={r.label} className="flex items-start gap-3">
            <div className={cn("grid size-10 place-items-center rounded-xl border", `bg-${r.tone}/10 border-${r.tone}/30 text-${r.tone}`)}>
              <r.icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-xs text-muted-foreground">{r.subtitle}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Active alerts</div>
            <div className="text-lg font-semibold">Live threshold breaches</div>
          </div>
          <Bell className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          {active.map((s) => (
            <div key={s.id} className={cn("flex items-center gap-3 rounded-xl border p-3",
              s.aqi > 300 ? "border-aqi-severe/40 bg-aqi-severe/5" : s.aqi > 200 ? "border-aqi-poor/30 bg-aqi-poor/5" : "border-aqi-unhealthy/30 bg-aqi-unhealthy/5")}>
              <div className="relative">
                <span className={cn("block size-2.5 rounded-full",
                  s.aqi > 300 ? "bg-aqi-severe" : s.aqi > 200 ? "bg-aqi-poor" : "bg-aqi-unhealthy")} />
                <span className={cn("absolute inset-0 size-2.5 rounded-full animate-ping opacity-60",
                  s.aqi > 300 ? "bg-aqi-severe" : s.aqi > 200 ? "bg-aqi-poor" : "bg-aqi-unhealthy")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.zone} · AQI {s.aqi} · PM2.5 {s.pm25} µg/m³</div>
              </div>
              <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {s.aqi > 300 ? "Emergency" : s.aqi > 200 ? "Red" : "Orange"}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground">Notification center</div>
        <div className="divide-y divide-border">
          {REPORTS.slice(0, 8).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{r.category} · {r.street}</div>
                <div className="text-xs text-muted-foreground">Reported by {r.reporter} · {formatDistanceToNow(new Date(r.reportedAt), { addSuffix: true })}</div>
              </div>
              <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{r.severity}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

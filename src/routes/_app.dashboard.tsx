import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, Camera, FileBarChart2, MapPin, TrendingUp, Bot, Wind } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AqiBadge } from "@/components/AqiBadge";
import { Counter } from "@/components/Counter";
import { Sparkline } from "@/components/Sparkline";
import { WeatherWidget } from "@/components/WeatherWidget";
import { CITY_AQI_HISTORY, PREDICTIONS, REPORTS, STREETS, topPollutedStreets, WEATHER } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Overview — CleanAir Console" }] }),
  component: Dashboard,
});

function Dashboard() {
  const cityAqi = Math.round(STREETS.reduce((a, s) => a + s.aqi, 0) / STREETS.length);
  const alertsToday = STREETS.filter((s) => s.aqi > 150).length;
  const nearby = topPollutedStreets(5);
  const cityTrend = CITY_AQI_HISTORY.map((c) => c.aqi);
  const openReports = REPORTS.filter((r) => r.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Regional air quality across the metropolitan network</p>
        </div>
        <Link to="/report" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90">
          <Camera className="size-4" /> Report incident
        </Link>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "My Reports", value: 24, sub: "+3 this week", icon: FileBarChart2 },
          { label: "Nearby AQI", value: 84, badge: <AqiBadge aqi={84} />, icon: Wind },
          { label: "City AQI", value: cityAqi, badge: <AqiBadge aqi={cityAqi} />, icon: TrendingUp },
          { label: "Today's alerts", value: alertsToday, sub: `${openReports} cases open`, icon: AlertTriangle },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard variant="elevated" className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
                <k.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="text-4xl font-semibold tracking-tight"><Counter to={k.value} /></div>
                {k.badge}
              </div>
              {k.sub && <div className="mt-2 text-xs text-muted-foreground">{k.sub}</div>}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* City AQI chart */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">City AQI · last 24h</div>
              <div className="mt-1 text-2xl font-semibold">{cityAqi} <span className="text-sm font-normal text-muted-foreground">avg AQI</span></div>
            </div>
            <AqiBadge aqi={cityAqi} />
          </div>
          <div className="h-48"><Sparkline data={cityTrend} height={192} aqi={cityAqi} /></div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span>
          </div>
        </GlassCard>

        {/* Weather */}
        <GlassCard>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Weather</div>
              <div className="mt-1 text-3xl font-semibold">{WEATHER.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{WEATHER.condition}</div>
            </div>
            <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-brand/25 to-aqi-hazard/20 border border-brand/30">
              <Wind className="size-5 text-brand" />
            </div>
          </div>
          <WeatherWidget />
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Predictions */}
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">AI prediction engine</div>
            <div className="text-[10px] font-mono text-muted-foreground">v2.4 · gemini-vision</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {PREDICTIONS.map((p) => (
              <div key={p.horizon} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.horizon}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-3xl font-semibold">{p.aqi}</div>
                  <AqiBadge aqi={p.aqi} showLabel={false} />
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground"><span>Spread</span><span className="font-mono text-foreground">{p.spread}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Hotspots</span><span className="font-mono text-foreground">{p.hotspots}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Health risk</span><span className="text-foreground">{p.healthRisk}</span></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-secondary/70">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${p.confidence}%` }} />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">{p.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Quick actions</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { icon: Camera, label: "Report", to: "/report" },
              { icon: MapPin, label: "Nearby", to: "/map" },
              { icon: FileBarChart2, label: "My reports", to: "/dashboard" },
              { icon: Bot, label: "AI Assistant", to: "/dashboard" },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-secondary/30 p-3 transition hover:border-brand/40 hover:bg-secondary/60">
                <a.icon className="size-4 text-muted-foreground group-hover:text-brand" />
                <span className="text-xs font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Nearby hotspots */}
      <GlassCard>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Nearby hotspots</div>
            <div className="text-lg font-semibold">Streets requiring attention</div>
          </div>
          <Link to="/streets" className="text-xs text-brand hover:underline">View all streets →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {nearby.map((s) => (
            <Link key={s.id} to="/streets" className="group rounded-xl border border-border bg-secondary/30 p-3 transition hover:border-brand/40">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{s.name}</div>
                <AqiBadge aqi={s.aqi} showLabel={false} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.zone}</div>
              <div className="mt-2 h-8"><Sparkline data={s.trend} height={32} aqi={s.aqi} /></div>
              {s.delta > 15 && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-aqi-poor">
                  <TrendingUp className="size-3" /> Rising fast
                </div>
              )}
            </Link>
          ))}
        </div>
      </GlassCard>

      {/* Recent reports */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Recent reports</div>
          <Bell className="size-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border">
          {REPORTS.slice(0, 6).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="text-sm font-medium">{r.category}</span>
                </div>
                <div className="text-xs text-muted-foreground">{r.street} · {r.reporter} · {formatDistanceToNow(new Date(r.reportedAt), { addSuffix: true })}</div>
              </div>
              <div className="flex items-center gap-2">
                <AqiBadge aqi={r.aqiBefore} showLabel={false} />
                <span className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AqiBadge } from "@/components/AqiBadge";
import { Sparkline } from "@/components/Sparkline";
import { STREETS, aqiBand } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/streets")({
  head: () => ({ meta: [{ title: "Street AQI — CleanAir Console" }] }),
  component: Streets,
});

const filters = ["All", "Critical", "Rising", "Good", "Steel Plant", "Gajuwaka", "Old Town"];

function Streets() {
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");

  const list = useMemo(() => {
    return STREETS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      switch (f) {
        case "Critical": return s.aqi > 200;
        case "Rising": return s.delta > 15;
        case "Good": return s.aqi <= 50;
        case "Steel Plant": case "Gajuwaka": case "Old Town": return s.zone === f;
        default: return true;
      }
    }).sort((a, b) => b.aqi - a.aqi);
  }, [q, f]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Live street-wise AQI</h1>
        <p className="text-sm text-muted-foreground">{STREETS.length} streets · updated continuously from citizen reports and sensor network</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search streets…"
            className="h-10 w-full rounded-lg border border-border bg-secondary/40 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-secondary/30 p-1">
          {filters.map((x) => (
            <button key={x} onClick={() => setF(x)}
              className={cn("rounded-md px-3 py-1.5 text-xs font-medium",
                f === x ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{x}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.slice(0, 60).map((s) => {
          const rising = s.delta > 15;
          const falling = s.delta < -10;
          const band = aqiBand(s.aqi);
          const critical = s.aqi > 200;
          return (
            <GlassCard key={s.id} variant="elevated" className={cn("relative overflow-hidden", critical && "border-aqi-severe/40")}>
              {critical && <div className="absolute -inset-1 -z-10 rounded-3xl bg-aqi-severe/10 blur-2xl" />}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.zone}</div>
                  <div className="text-lg font-semibold">{s.name}</div>
                </div>
                <AqiBadge aqi={s.aqi} />
              </div>

              <div className="mt-3 h-12"><Sparkline data={s.trend} height={48} aqi={s.aqi} /></div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                {[
                  ["Temp", `${s.temperature}°`],
                  ["Humidity", `${s.humidity}%`],
                  ["Wind", `${s.wind} km/h`],
                  ["PM2.5", s.pm25],
                  ["PM10", s.pm10],
                  ["NO₂", s.no2],
                  ["CO", s.co],
                  ["SO₂", s.so2],
                  ["O₃", s.ozone],
                ].map(([l, v]) => (
                  <div key={l as string} className="rounded-md border border-border bg-secondary/30 p-2">
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
                    <div className="font-mono text-xs">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Risk meter</span>
                  <span>{s.predicted6h} predicted 6h</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <div className={`h-full rounded-full bg-aqi-${band}`} style={{ width: `${Math.min(100, s.aqi / 4)}%` }} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {rising && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-aqi-poor/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-aqi-poor">
                    <TrendingUp className="size-3" /> Increasing rapidly
                  </span>
                )}
                {falling && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-aqi-good/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-aqi-good">
                    <TrendingDown className="size-3" /> Improving
                  </span>
                )}
                {s.aqi > 150 && (
                  <span className="rounded-md bg-aqi-unhealthy/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-aqi-unhealthy">
                    ⚠ High pollution
                  </span>
                )}
                {s.predicted6h > s.aqi + 30 && (
                  <span className="rounded-md bg-aqi-hazard/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-aqi-hazard">
                    ⚠ Predicted spike
                  </span>
                )}
                {s.humidity > 80 && s.wind < 4 && (
                  <span className="rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Weather may worsen pollution
                  </span>
                )}
              </div>

              <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Updated {formatDistanceToNow(new Date(s.updatedAt), { addSuffix: true })}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

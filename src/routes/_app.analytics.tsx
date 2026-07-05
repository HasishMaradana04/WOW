import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { Sparkline } from "@/components/Sparkline";
import { AqiBadge } from "@/components/AqiBadge";
import { CITY_AQI_HISTORY, DAILY_REPORTS, POLLUTION_TYPE_STATS, topPollutedStreets, aqiColorVar } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — CleanAir" }] }),
  component: Analytics,
});

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs"><span>{label}</span><span className="font-mono text-muted-foreground">{value}</span></div>
      <div className="mt-1 h-2 rounded-full bg-secondary/60">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color ?? "var(--brand)" }} />
      </div>
    </div>
  );
}

function Analytics() {
  const typeMax = Math.max(...POLLUTION_TYPE_STATS.map((s) => s.count));
  const dailyMax = Math.max(...DAILY_REPORTS.map((d) => d.reports));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Distribution, trends and impact metrics across the network</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">City AQI trend · 24h</div>
              <div className="text-2xl font-semibold">City breath curve</div>
            </div>
            <AqiBadge aqi={Math.round(CITY_AQI_HISTORY.reduce((a, c) => a + c.aqi, 0) / CITY_AQI_HISTORY.length)} />
          </div>
          <div className="h-56"><Sparkline data={CITY_AQI_HISTORY.map((c) => c.aqi)} height={224} aqi={110} /></div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Pollution types</div>
          <div className="mt-3 space-y-3">
            {POLLUTION_TYPE_STATS.map((s) => (
              <BarRow key={s.type} label={s.type} value={s.count} max={typeMax} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Daily reports vs resolved (14d)</div>
          <div className="mt-4 flex h-48 items-end gap-2">
            {DAILY_REPORTS.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end gap-0.5">
                  <div className="flex-1 rounded-t bg-brand/70" style={{ height: `${(d.reports / dailyMax) * 160}px` }} />
                  <div className="flex-1 rounded-t bg-aqi-good/70" style={{ height: `${(d.resolved / dailyMax) * 160}px` }} />
                </div>
                <div className="text-[9px] text-muted-foreground">{d.day}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded bg-brand" /> Reported</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded bg-aqi-good" /> Resolved</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Top polluted streets</div>
          <div className="mt-3 space-y-3">
            {topPollutedStreets(8).map((s) => (
              <BarRow key={s.id} label={s.name} value={s.aqi} max={400} color={aqiColorVar(s.aqi)} />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {[
          { label: "Avg response time", value: "51 min" },
          { label: "Cleanups this month", value: "942" },
          { label: "PM2.5 reduction", value: "34%" },
          { label: "Citizen participation", value: "12.4K" },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold">{s.value}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

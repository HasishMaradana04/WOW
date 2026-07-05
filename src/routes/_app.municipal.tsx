import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, Clock, Search, Users } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AqiBadge } from "@/components/AqiBadge";
import { Counter } from "@/components/Counter";
import { REPORTS, REPORT_STATUSES, STREETS, type Report } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/municipal")({
  head: () => ({ meta: [{ title: "Municipal Console — CleanAir" }] }),
  component: Municipal,
});

const priorityChips = ["All", "Critical", "High", "Medium", "Low"];

function Municipal() {
  const [q, setQ] = useState("");
  const [prio, setPrio] = useState("All");
  const [selected, setSelected] = useState<Report>(REPORTS[0]);

  const filtered = useMemo(() =>
    REPORTS.filter((r) =>
      (prio === "All" || r.severity === prio) &&
      (!q || r.street.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
    ).slice(0, 30), [q, prio]);

  const open = REPORTS.filter((r) => r.status !== "Resolved").length;
  const resolved = REPORTS.filter((r) => r.status === "Resolved").length;
  const critical = REPORTS.filter((r) => r.severity === "Critical").length;
  const avgAqi = Math.round(STREETS.reduce((a, s) => a + s.aqi, 0) / STREETS.length);
  const currentIdx = REPORT_STATUSES.indexOf(selected.status);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Municipal command console</h1>
          <p className="text-sm text-muted-foreground">Prioritized citizen reports, live dispatch, cleanup verification</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Open cases", value: open, icon: Clock, tone: "text-brand" },
          { label: "Resolved", value: resolved, icon: CheckCircle2, tone: "text-aqi-good" },
          { label: "Critical alerts", value: critical, icon: AlertTriangle, tone: "text-aqi-poor" },
          { label: "City AQI", value: avgAqi, icon: Users, tone: "text-foreground", badge: <AqiBadge aqi={avgAqi} showLabel={false} /> },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard variant="elevated">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k.label}</div>
                <k.icon className={cn("size-4", k.tone)} />
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div className="text-4xl font-semibold"><Counter to={k.value} /></div>
                {k.badge}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Cases table */}
        <GlassCard className="lg:col-span-3 !p-0">
          <div className="flex flex-wrap items-center gap-2 p-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case ID, street…" className="h-9 w-full rounded-lg border border-border bg-secondary/40 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div className="flex rounded-lg border border-border bg-secondary/30 p-1">
              {priorityChips.map((p) => (
                <button key={p} onClick={() => setPrio(p)}
                  className={cn("rounded-md px-2.5 py-1 text-[11px] font-medium",
                    prio === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{p}</button>
              ))}
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto border-t border-border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-card/80 backdrop-blur">
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-4 py-3">Case</th>
                  <th className="px-4 py-3">Street</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Officer</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setSelected(r)}
                    className={cn("cursor-pointer hover:bg-secondary/40", selected.id === r.id && "bg-secondary/50")}>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.street}</div>
                      <div className="text-[10px] text-muted-foreground">{r.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                        r.severity === "Critical" && "bg-aqi-severe/20 text-aqi-severe",
                        r.severity === "High" && "bg-aqi-poor/15 text-aqi-poor",
                        r.severity === "Medium" && "bg-aqi-unhealthy/15 text-aqi-unhealthy",
                        r.severity === "Low" && "bg-aqi-good/15 text-aqi-good")}>{r.severity}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">{r.status}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.officer ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.reportedAt), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Case detail */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs text-muted-foreground">{selected.id}</div>
              <div className="text-lg font-semibold">{selected.category} · {selected.street}</div>
            </div>
            <AqiBadge aqi={selected.aqiBefore} />
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-secondary/30 p-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Before</div>
              <div className="mt-1 aspect-square rounded-lg bg-gradient-to-br from-aqi-poor/40 to-aqi-severe/30" />
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">AQI</span><span className="font-mono">{selected.aqiBefore}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">After</div>
              <div className="mt-1 aspect-square rounded-lg bg-gradient-to-br from-aqi-good/40 to-brand/30" />
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">AQI</span><span className="font-mono">{selected.aqiAfter ?? "—"}</span>
              </div>
            </div>
          </div>

          {selected.aqiAfter && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-aqi-good/30 bg-aqi-good/5 p-3 text-center">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Improvement</div>
                <div className="font-mono text-sm text-aqi-good">{Math.round((1 - selected.aqiAfter / selected.aqiBefore) * 100)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">PM2.5 ↓</div>
                <div className="font-mono text-sm text-aqi-good">42%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</div>
                <div className="font-mono text-sm">2h 14m</div>
              </div>
            </div>
          )}

          {/* Progress timeline */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Status timeline</div>
            <div className="mt-3 space-y-2">
              {REPORT_STATUSES.map((s, i) => {
                const done = i <= currentIdx;
                const current = i === currentIdx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    {done ? <CheckCircle2 className={cn("size-4", current ? "text-brand" : "text-aqi-good")} /> : <Circle className="size-4 text-muted-foreground" />}
                    <span className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground", current && "font-semibold")}>{s}</span>
                    {current && <span className="ml-auto text-[10px] uppercase tracking-widest text-brand">In progress</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Assign team</button>
            <button className="flex-1 rounded-xl border border-border bg-secondary/40 py-2 text-sm font-semibold hover:bg-secondary/60">Escalate</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

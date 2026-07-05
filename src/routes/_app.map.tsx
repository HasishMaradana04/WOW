import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { AqiBadge } from "@/components/AqiBadge";
import { REPORTS, STREETS } from "@/lib/mock-data";
import { Building2, Factory, GraduationCap, HardHat, Hospital, Home as HomeIcon, Layers } from "lucide-react";

export const Route = createFileRoute("/_app/map")({
  head: () => ({ meta: [{ title: "Live Map — CleanAir Console" }] }),
  ssr: false,
  component: LiveMap,
});

const MapView = lazy(() => import("@/components/MapView"));

const overlays = [
  { key: "reports", label: "Citizen reports", icon: Building2 },
  { key: "sensors", label: "Gov sensors", icon: Factory },
  { key: "industrial", label: "Industrial zones", icon: Factory },
  { key: "construction", label: "Construction", icon: HardHat },
  { key: "schools", label: "Schools", icon: GraduationCap },
  { key: "hospitals", label: "Hospitals", icon: Hospital },
  { key: "residential", label: "Residential", icon: HomeIcon },
];

function LiveMap() {
  const [active, setActive] = useState<Record<string, boolean>>({
    reports: true, sensors: true, industrial: true, construction: false, schools: false, hospitals: false, residential: false,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-border">
      {mounted ? (
        <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading map…</div>}>
          <MapView active={active} />
        </Suspense>
      ) : (
        <div className="grid h-full place-items-center text-sm text-muted-foreground">Initializing map…</div>
      )}

      <div className="absolute left-4 top-4 z-[500] w-56 rounded-2xl glass-panel p-3">
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <Layers className="size-3.5" /> Layers
        </div>
        <div className="space-y-1">
          {overlays.map((o) => (
            <button key={o.key} onClick={() => setActive((a) => ({ ...a, [o.key]: !a[o.key] }))}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs ${active[o.key] ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}>
              <span className="flex items-center gap-2"><o.icon className="size-3.5" /> {o.label}</span>
              <span className={`size-2 rounded-full ${active[o.key] ? "bg-brand" : "bg-border"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-[500] rounded-2xl glass-panel px-4 py-3">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">AQI Legend</div>
        <div className="flex items-center gap-3 text-[10px]">
          {[
            ["Good", "aqi-good"], ["Moderate", "aqi-moderate"], ["Unhealthy", "aqi-unhealthy"],
            ["Poor", "aqi-poor"], ["Severe", "aqi-severe"], ["Hazard", "aqi-hazard"],
          ].map(([label, cls]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full bg-${cls}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 top-4 z-[500] w-64 rounded-2xl glass-panel p-4">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Live network</div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div><div className="text-2xl font-semibold">{STREETS.length}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sensors</div></div>
          <div><div className="text-2xl font-semibold">{REPORTS.length}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Reports</div></div>
        </div>
        <div className="mt-3 h-px bg-border" />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">City AQI</span>
          <AqiBadge aqi={Math.round(STREETS.reduce((a, s) => a + s.aqi, 0) / STREETS.length)} />
        </div>
      </div>
      
    </div>
  );
}

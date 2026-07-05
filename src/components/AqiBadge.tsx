import { aqiBand, aqiLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const bandStyles: Record<string, string> = {
  good: "bg-aqi-good/15 text-aqi-good border-aqi-good/30",
  moderate: "bg-aqi-moderate/15 text-aqi-moderate border-aqi-moderate/30",
  unhealthy: "bg-aqi-unhealthy/15 text-aqi-unhealthy border-aqi-unhealthy/30",
  poor: "bg-aqi-poor/15 text-aqi-poor border-aqi-poor/30",
  severe: "bg-aqi-severe/20 text-aqi-severe border-aqi-severe/40",
  hazard: "bg-aqi-hazard/20 text-aqi-hazard border-aqi-hazard/40",
};

export function AqiBadge({ aqi, showLabel = true, className }: { aqi: number; showLabel?: boolean; className?: string }) {
  const band = aqiBand(aqi);
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
      bandStyles[band],
      className,
    )}>
      <span className="font-mono tabular-nums">{aqi}</span>
      {showLabel && <span>{aqiLabel(aqi)}</span>}
    </span>
  );
}

export function AqiDot({ aqi, pulse }: { aqi: number; pulse?: boolean }) {
  const band = aqiBand(aqi);
  return (
    <span className={cn(
      "relative inline-flex size-2.5 rounded-full",
      `bg-aqi-${band}`,
    )}>
      {pulse && <span className={cn("absolute inset-0 rounded-full animate-ping opacity-70", `bg-aqi-${band}`)} />}
    </span>
  );
}

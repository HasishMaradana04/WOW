import { WEATHER } from "@/lib/mock-data";
import { CloudFog, Droplets, Eye, Gauge, Sun, Wind } from "lucide-react";

const stats = [
  { icon: Droplets, label: "Humidity", value: `${WEATHER.humidity}%` },
  { icon: Wind, label: "Wind", value: `${WEATHER.wind} km/h` },
  { icon: Gauge, label: "Pressure", value: `${WEATHER.pressure} hPa` },
  { icon: Eye, label: "Visibility", value: `${WEATHER.visibility} km` },
  { icon: Sun, label: "UV Index", value: `${WEATHER.uv}` },
  { icon: CloudFog, label: "Rain", value: `${WEATHER.rainChance}%` },
];

export function WeatherWidget() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-secondary/30 p-3">
          <s.icon className="size-4 text-muted-foreground" />
          <div className="mt-2 text-sm font-semibold">{s.value}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

import { aqiColorVar } from "@/lib/mock-data";

export function Sparkline({ data, height = 40, aqi }: { data: number[]; height?: number; aqi?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`)
    .join(" ");
  const stroke = aqi != null ? aqiColorVar(aqi) : "var(--brand)";
  const gid = `spark-${Math.round(aqi ?? Math.random() * 1000)}-${data.length}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      width="100%"
      height={height}
      style={{ display: "block" }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: stroke, stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: stroke, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${w},${height}`} style={{ fill: `url(#${gid})` }} />
      <polyline
        points={points}
        fill="none"
        style={{ stroke }}
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

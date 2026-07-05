import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from "react-leaflet";
import { AqiBadge } from "@/components/AqiBadge";
import { aqiColorVar, REPORTS, STREETS } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

type Active = Record<string, boolean>;

export default function MapView({ active }: { active: Active }) {
  const center: [number, number] = [17.6868, 83.2185];
  const sensors = STREETS.slice(0, 40);
  const industrial = STREETS.filter((s) => s.zone === "Steel Plant" || s.zone === "Gajuwaka").slice(0, 8);

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />

      {active.industrial && industrial.map((s) => (
        <Circle key={s.id} center={[s.lat, s.lng]} radius={600}
          pathOptions={{ color: aqiColorVar(s.aqi), fillColor: aqiColorVar(s.aqi), fillOpacity: 0.15, weight: 1 }} />
      ))}

      {active.sensors && sensors.map((s) => (
        <CircleMarker key={`sens-${s.id}`} center={[s.lat, s.lng]} radius={8}
          pathOptions={{ color: aqiColorVar(s.aqi), fillColor: aqiColorVar(s.aqi), fillOpacity: 0.7, weight: 1.5 }}>
          <Popup>
            <div className="min-w-[180px]">
              <div className="text-xs font-mono opacity-60">Sensor · {s.zone}</div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="mt-2 flex items-center justify-between text-xs"><span>AQI</span><span className="font-mono">{s.aqi}</span></div>
              <div className="flex items-center justify-between text-xs"><span>PM2.5</span><span className="font-mono">{s.pm25} µg/m³</span></div>
              <div className="flex items-center justify-between text-xs"><span>Wind</span><span className="font-mono">{s.wind} km/h</span></div>
              <div className="mt-2"><AqiBadge aqi={s.aqi} /></div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {active.reports && REPORTS.slice(0, 80).map((r) => (
        <CircleMarker key={r.id} center={[r.lat, r.lng]} radius={5}
          pathOptions={{ color: aqiColorVar(r.aqiBefore), fillColor: aqiColorVar(r.aqiBefore), fillOpacity: 0.9, weight: 1 }}>
          <Popup>
            <div className="min-w-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs opacity-60">{r.id}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">{r.severity}</span>
              </div>
              <div className="mt-1 text-sm font-semibold">{r.category}</div>
              <div className="text-xs opacity-70">{r.street} · {r.zone}</div>
              <div className="mt-2 text-xs">
                <div>Reporter: {r.reporter}</div>
                <div>Status: {r.status}</div>
                <div>AI confidence: {r.confidence}%</div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

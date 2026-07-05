// Deterministic mock data for CleanAir & Clear Streets.

export type AqiBand = "good" | "moderate" | "unhealthy" | "poor" | "severe" | "hazard";

export function aqiBand(aqi: number): AqiBand {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy";
  if (aqi <= 200) return "poor";
  if (aqi <= 300) return "severe";
  return "hazard";
}

export function aqiLabel(aqi: number): string {
  return {
    good: "Good",
    moderate: "Moderate",
    unhealthy: "Unhealthy",
    poor: "Poor",
    severe: "Very Poor",
    hazard: "Hazardous",
  }[aqiBand(aqi)];
}

export function aqiColorVar(aqi: number): string {
  return `var(--aqi-${aqiBand(aqi)})`;
}

// Simple deterministic PRNG so map/data render the same each visit.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Street {
  id: string;
  name: string;
  zone: string;
  aqi: number;
  trend: number[]; // last 12 readings
  delta: number; // % change vs 1h ago
  pm25: number; pm10: number; co: number; no2: number; so2: number; ozone: number;
  temperature: number; humidity: number; wind: number;
  lat: number; lng: number;
  updatedAt: string;
  predicted6h: number;
}

const zones = ["Beach Road", "Dwaraka Nagar", "MVP Colony", "Gajuwaka", "Steel Plant", "Madhurawada", "Rushikonda", "Old Town"];
const nameParts1 = ["Beach", "RK", "Siripuram", "Jagadamba", "Dondaparthy", "Asilmetta", "Kailasagiri", "Rushikonda", "Yarada", "Simhachalam",
  "Gajuwaka", "Kurmannapalem", "Scindia", "NAD", "Pendurthi", "Anakapalle", "Bheemili", "Sagar Nagar", "MVP", "Seethammadhara",
  "Waltair", "Lawson's Bay", "Convent", "Ram Nagar", "Maharani Peta", "Allipuram", "Kancharapalem", "Malkapuram", "Duvvada", "Sriharipuram"];
const nameParts2 = ["Road", "Street", "Junction", "Nagar", "Circle", "Marg", "Colony", "Beach Road", "Layout", "Lane"];

function makeStreets(count = 120): Street[] {
  const rand = mulberry32(42);
  const centerLat = 17.6868, centerLng = 83.2185; // Visakhapatnam
  return Array.from({ length: count }, (_, i) => {
    const zone = zones[i % zones.length];
    const name = `${nameParts1[(i * 7) % nameParts1.length]} ${nameParts2[(i * 3) % nameParts2.length]}`;
    // Skew AQI higher near heavy industry (Steel Plant, Gajuwaka)
    const base = zone === "Steel Plant" ? 190 + rand() * 160
              : zone === "Gajuwaka" ? 150 + rand() * 130
              : zone === "Old Town" ? 120 + rand() * 100
              : zone === "Dwaraka Nagar" ? 90 + rand() * 90
              : zone === "Beach Road" ? 40 + rand() * 60
              : 30 + rand() * 120;
    const aqi = Math.round(base);
    const trend = Array.from({ length: 12 }, (_, k) => Math.max(10, Math.round(aqi + Math.sin(k / 2 + i) * 20 + (rand() - 0.5) * 25)));
    const delta = Math.round((trend[11] - trend[6]) / trend[6] * 1000) / 10;
    return {
      id: `str_${i + 1}`,
      name,
      zone,
      aqi,
      trend,
      delta,
      pm25: Math.round(aqi * 0.4 + rand() * 8),
      pm10: Math.round(aqi * 0.7 + rand() * 12),
      co: Math.round((rand() * 4 + 0.4) * 10) / 10,
      no2: Math.round(aqi * 0.3 + rand() * 10),
      so2: Math.round(aqi * 0.15 + rand() * 6),
      ozone: Math.round(20 + rand() * 60),
      temperature: Math.round(22 + rand() * 12),
      humidity: Math.round(35 + rand() * 55),
      wind: Math.round(rand() * 22 * 10) / 10,
      lat: centerLat + (rand() - 0.5) * 0.16,
      lng: centerLng + (rand() - 0.5) * 0.16,
      updatedAt: new Date(Date.now() - Math.floor(rand() * 3600_000)).toISOString(),
      predicted6h: Math.round(aqi * (0.85 + rand() * 0.4)),
    };
  });
}

export const STREETS: Street[] = makeStreets();

export type ReportCategory =
  | "Smoke" | "Garbage Burning" | "Industrial Pollution"
  | "Construction Dust" | "Traffic" | "Waste Dump" | "Chemical Leak";

export type ReportStatus =
  | "Pending" | "Verified" | "In Progress" | "Team Assigned"
  | "Cleanup Started" | "Cleanup Completed" | "AI Verification" | "Resolved";

export const REPORT_STATUSES: ReportStatus[] = [
  "Pending", "Verified", "In Progress", "Team Assigned",
  "Cleanup Started", "Cleanup Completed", "AI Verification", "Resolved",
];

export interface Report {
  id: string;
  category: ReportCategory;
  street: string;
  zone: string;
  lat: number; lng: number;
  reporter: string;
  reportedAt: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  aqiBefore: number;
  aqiAfter?: number;
  status: ReportStatus;
  officer?: string;
  description: string;
  imagePrompt: string;
}

const categories: ReportCategory[] = [
  "Smoke", "Garbage Burning", "Industrial Pollution",
  "Construction Dust", "Traffic", "Waste Dump", "Chemical Leak",
];
const severities = ["Low", "Medium", "High", "Critical"] as const;
const reporters = ["A. Rao", "P. Iyer", "S. Kumar", "M. Fernandes", "R. Nair", "K. Sharma",
  "J. Menon", "V. Pillai", "N. Das", "L. Gupta", "T. Reddy", "H. Singh"];
const officers = ["Insp. Devi", "Off. Bhatt", "Insp. Khan", "Off. Lima", "Insp. Verma", "Off. Rao"];

function makeReports(count = 320): Report[] {
  const rand = mulberry32(7);
  return Array.from({ length: count }, (_, i) => {
    const street = STREETS[i % STREETS.length];
    const cat = categories[Math.floor(rand() * categories.length)];
    const sev = severities[Math.min(3, Math.floor(rand() * rand() * 4 + 0.4))];
    const aqiBefore = Math.round(street.aqi * (0.9 + rand() * 0.6));
    const status = REPORT_STATUSES[Math.floor(rand() * REPORT_STATUSES.length)];
    const resolved = status === "Resolved" || status === "Cleanup Completed";
    return {
      id: `RPT-${(4000 + i).toString()}`,
      category: cat,
      street: street.name,
      zone: street.zone,
      lat: street.lat + (rand() - 0.5) * 0.008,
      lng: street.lng + (rand() - 0.5) * 0.008,
      reporter: reporters[Math.floor(rand() * reporters.length)],
      reportedAt: new Date(Date.now() - Math.floor(rand() * 7 * 86400_000)).toISOString(),
      severity: sev,
      confidence: Math.round(70 + rand() * 29),
      aqiBefore,
      aqiAfter: resolved ? Math.round(aqiBefore * (0.4 + rand() * 0.3)) : undefined,
      status,
      officer: status !== "Pending" ? officers[Math.floor(rand() * officers.length)] : undefined,
      description: `${cat} observed near ${street.name}. Air quality noticeably degraded and residents concerned.`,
      imagePrompt: `${cat.toLowerCase()} on ${street.name}`,
    };
  });
}

export const REPORTS: Report[] = makeReports();

export interface Weather {
  temperature: number; humidity: number; wind: number;
  pressure: number; visibility: number; rainChance: number; uv: number;
  condition: "Clear" | "Partly Cloudy" | "Hazy" | "Rain" | "Foggy";
}
export const WEATHER: Weather = {
  temperature: 28, humidity: 62, wind: 8, pressure: 1012,
  visibility: 6.5, rainChance: 24, uv: 7, condition: "Hazy",
};

const _hrand = mulberry32(2026);
export const CITY_AQI_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  aqi: Math.round(60 + Math.sin(i / 3) * 40 + (i > 16 ? 30 : 0) + _hrand() * 10),
  pm25: Math.round(30 + Math.sin(i / 3) * 20 + _hrand() * 5),
}));

export const PREDICTIONS = [
  { horizon: "Next 6 hours", aqi: 128, spread: "1.2 km", hotspots: 3, healthRisk: "Moderate", trafficImpact: "Medium", confidence: 94 },
  { horizon: "Next 12 hours", aqi: 165, spread: "2.8 km", hotspots: 6, healthRisk: "Unhealthy", trafficImpact: "High", confidence: 88 },
  { horizon: "Next 24 hours", aqi: 142, spread: "1.9 km", hotspots: 4, healthRisk: "Moderate", trafficImpact: "Medium", confidence: 79 },
];

export const LEADERBOARD = [
  { name: "Aarav Sharma", reports: 84, verified: 78, score: 1240 },
  { name: "Priya Iyer", reports: 71, verified: 69, score: 1180 },
  { name: "Rohan Nair", reports: 63, verified: 58, score: 1015 },
  { name: "Meera Kapoor", reports: 55, verified: 52, score: 962 },
  { name: "Vikram Rao", reports: 49, verified: 45, score: 890 },
  { name: "Ananya Das", reports: 42, verified: 39, score: 812 },
  { name: "Karan Menon", reports: 38, verified: 34, score: 745 },
  { name: "Nisha Gupta", reports: 31, verified: 28, score: 690 },
];

export const MUNI_TEAMS = [
  { name: "Central Sanitation Team", resolved: 142, avgTime: "48 min" },
  { name: "Industrial Zone Response", resolved: 118, avgTime: "62 min" },
  { name: "Old Town Rapid Unit", resolved: 96, avgTime: "39 min" },
  { name: "Riverside Cleanup", resolved: 81, avgTime: "55 min" },
];

const _prand = mulberry32(99);
export const POLLUTION_TYPE_STATS = categories.map((c, i) => ({
  type: c,
  count: 60 - i * 6 + Math.floor(_prand() * 15),
}));

const _drand = mulberry32(11);
export const DAILY_REPORTS = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  reports: Math.round(30 + Math.sin(i / 2) * 12 + _drand() * 10),
  resolved: Math.round(20 + Math.sin(i / 2) * 10 + _drand() * 6),
}));

export function topPollutedStreets(n = 10): Street[] {
  return [...STREETS].sort((a, b) => b.aqi - a.aqi).slice(0, n);
}

export function nearbyReports(lat: number, lng: number, n = 8): Report[] {
  return [...REPORTS].sort((a, b) => {
    const da = Math.hypot(a.lat - lat, a.lng - lng);
    const db = Math.hypot(b.lat - lat, b.lng - lng);
    return da - db;
  }).slice(0, n);
}

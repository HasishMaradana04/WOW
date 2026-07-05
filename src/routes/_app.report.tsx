import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bot, CheckCircle2, Cloud, Crosshair, ImageOff, Loader2, Sparkles, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { GlassCard } from "@/components/GlassCard";
import { AqiBadge } from "@/components/AqiBadge";
import type { ReportCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { classifyEnvironmentImage } from "@/lib/analyze-image.functions";

export const Route = createFileRoute("/_app/report")({
  head: () => ({ meta: [{ title: "Report pollution — CleanAir" }] }),
  component: Report,
});

const categories: ReportCategory[] = [
  "Smoke", "Garbage Burning", "Industrial Pollution",
  "Construction Dust", "Traffic", "Waste Dump", "Chemical Leak",
];

interface AiResult {
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  aqi: number;
  action: string;
  spread: string;
  timeCritical: string;
}

const labelToCategory: Record<string, ReportCategory> = {
  smoke: "Smoke",
  traffic: "Traffic",
  garbage: "Waste Dump",
  dust: "Construction Dust",
  industrial: "Industrial Pollution",
  chemical: "Chemical Leak",
};

function runFakeAnalysis(cat: ReportCategory): AiResult {
  const map: Record<ReportCategory, Partial<AiResult>> = {
    "Smoke": { severity: "High", aqi: 178, spread: "0.9 km", timeCritical: "45 min", action: "Dispatch fire and sanitation team." },
    "Garbage Burning": { severity: "High", aqi: 192, spread: "1.1 km", timeCritical: "30 min", action: "Deploy waste management crew immediately." },
    "Industrial Pollution": { severity: "Critical", aqi: 262, spread: "2.4 km", timeCritical: "20 min", action: "Issue emission notice to nearby industrial units." },
    "Construction Dust": { severity: "Medium", aqi: 132, spread: "0.5 km", timeCritical: "2 h", action: "Notify contractor; enforce dust suppression." },
    "Traffic": { severity: "Medium", aqi: 118, spread: "0.4 km", timeCritical: "3 h", action: "Deploy traffic re-routing near hotspot." },
    "Waste Dump": { severity: "High", aqi: 158, spread: "0.6 km", timeCritical: "1 h", action: "Assign cleanup team; schedule collection." },
    "Chemical Leak": { severity: "Critical", aqi: 305, spread: "3.1 km", timeCritical: "immediate", action: "Emergency: evacuate 500m radius, dispatch hazmat." },
  };
  const base = map[cat];
  return {
    type: cat,
    severity: base.severity!,
    confidence: 82 + Math.floor(Math.random() * 15),
    aqi: base.aqi!,
    action: base.action!,
    spread: base.spread!,
    timeCritical: base.timeCritical!,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

type Validation =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid"; label: string }
  | { status: "invalid"; reason: string };

function Report() {
  const [cat, setCat] = useState<ReportCategory>("Smoke");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Visakhapatnam");
  const [pincode, setPincode] = useState("530001");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [validation, setValidation] = useState<Validation>({ status: "idle" });
  const [locLoading, setLocLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const classify = useServerFn(classifyEnvironmentImage);

  const analyze = () => {
    if (validation.status !== "valid") return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(runFakeAnalysis(cat));
      setLoading(false);
    }, 1400);
  };

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setResult(null);
    setValidation({ status: "checking" });
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      const res = await classify({ data: { imageDataUrl: dataUrl } });
      if (res.valid) {
        setValidation({ status: "valid", label: res.label });
        const mapped = labelToCategory[res.label];
        if (mapped) setCat(mapped);
      } else {
        setValidation({ status: "invalid", reason: res.reason || "This image doesn't look like an environmental incident. Please upload a photo of smoke, traffic, garbage, dust, or pollution." });
      }
    } catch {
      setValidation({ status: "invalid", reason: "Could not analyze image. Try another photo." });
    }
  };

  const useMyLocation = async () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
            headers: { Accept: "application/json" },
          });
          const j = await r.json();
          const a = j.address ?? {};
          const streetName = [a.road, a.neighbourhood, a.suburb].filter(Boolean).join(", ") || a.pedestrian || a.hamlet || "";
          setStreet(streetName);
          if (a.city || a.town || a.village) setCity(a.city || a.town || a.village);
          if (a.postcode) setPincode(a.postcode);
        } catch {
          /* keep coords only */
        } finally {
          setLocLoading(false);
        }
      },
      () => setLocLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const canSubmit = validation.status === "valid";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand">New report</div>
        <h1 className="text-3xl font-semibold tracking-tight">Report a pollution incident</h1>
        <p className="text-sm text-muted-foreground">Upload an environmental photo — smoke, traffic, garbage, dust or industrial emissions. AI will validate and classify it.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 space-y-6 p-6">
          {/* Photo */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Evidence photo</label>
              {validation.status === "checking" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><Loader2 className="size-3 animate-spin" /> Validating…</span>
              )}
              {validation.status === "valid" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-aqi-good"><CheckCircle2 className="size-3.5" /> Verified · {validation.label}</span>
              )}
              {validation.status === "invalid" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-aqi-severe"><XCircle className="size-3.5" /> Invalid image</span>
              )}
            </div>

            <label className={cn(
              "group relative mt-2 flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition",
              validation.status === "invalid"
                ? "border-aqi-severe/50 bg-aqi-severe/5"
                : validation.status === "valid"
                  ? "border-aqi-good/40 bg-aqi-good/5"
                  : "border-dashed border-border bg-secondary/20 hover:border-brand/50",
            )}>
              {photo ? (
                <>
                  <img src={photo} alt="preview" className={cn("h-full w-full object-cover", validation.status === "invalid" && "opacity-40 blur-[1px]")} />
                  {validation.status === "invalid" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 p-6 text-center backdrop-blur-sm">
                      <ImageOff className="size-8 text-aqi-severe" />
                      <div className="text-sm font-semibold">Invalid image</div>
                      <div className="max-w-md text-xs text-muted-foreground">{validation.reason}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Upload className="size-5" />
                  </div>
                  <div className="text-sm font-medium">Upload environment photo</div>
                  <div className="mt-1 text-xs text-muted-foreground">Only smoke, traffic, garbage, dust or pollution photos accepted</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Category</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    cat === c ? "border-brand bg-brand/15 text-foreground" : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground")}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Location</label>
              <button onClick={useMyLocation} disabled={locLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-brand/40 hover:text-foreground disabled:opacity-60">
                {locLoading ? <Loader2 className="size-3 animate-spin" /> : <Crosshair className="size-3" />}
                {locLoading ? "Fetching address…" : "Use my location"}
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-3">
                <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street / area"
                  className="h-11 w-full rounded-xl border border-border bg-secondary/40 px-3.5 text-sm outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/30" />
              </div>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"
                className="h-11 w-full rounded-xl border border-border bg-secondary/40 px-3.5 text-sm outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/30" />
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode"
                className="h-11 w-full rounded-xl border border-border bg-secondary/40 px-3.5 text-sm outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/30" />
              <div className="flex items-center rounded-xl border border-border bg-secondary/20 px-3.5 text-[11px] font-mono text-muted-foreground">
                {coords ? `${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°` : "17.6868°N, 83.2185°E"}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Describe what you're seeing…"
              className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand/50 focus:ring-2 focus:ring-brand/30" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={analyze} disabled={loading || !canSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? "Analyzing…" : "Run AI analysis"}
            </button>
            <button className="rounded-xl border border-border bg-secondary/30 px-5 py-2.5 text-sm font-semibold hover:bg-secondary/60">
              Save draft
            </button>
            {!canSubmit && validation.status !== "idle" && validation.status !== "checking" && (
              <span className="self-center text-[11px] text-muted-foreground">Upload a valid environment photo to continue.</span>
            )}
          </div>
        </GlassCard>

        {/* AI Analysis panel */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-brand">
              <Bot className="size-3.5" /> Gemini Vision · Analysis
            </div>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl border border-dashed border-border bg-secondary/20 p-6 text-center text-sm text-muted-foreground">
                  Upload evidence and run analysis to see AI classification.
                </motion.div>
              )}
              {loading && (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mt-4 space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-secondary/40" />
                  ))}
                </motion.div>
              )}
              {result && (
                <motion.div key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3">
                  <div className="rounded-xl border border-border bg-secondary/30 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Detected type</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-lg font-semibold">{result.type}</div>
                      <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                        result.severity === "Critical" ? "bg-aqi-severe/20 text-aqi-severe" :
                        result.severity === "High" ? "bg-aqi-poor/15 text-aqi-poor" :
                        result.severity === "Medium" ? "bg-aqi-unhealthy/15 text-aqi-unhealthy" :
                        "bg-aqi-good/15 text-aqi-good")}>{result.severity}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-secondary/60"><div className="h-full rounded-full bg-brand" style={{ width: `${result.confidence}%` }} /></div>
                      <span className="font-mono text-[11px] text-muted-foreground">{result.confidence}% confidence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-secondary/30 p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Estimated AQI</div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <div className="text-2xl font-semibold">{result.aqi}</div>
                        <AqiBadge aqi={result.aqi} showLabel={false} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Spread radius</div>
                      <div className="mt-1 text-2xl font-semibold">{result.spread}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Time to critical</div>
                      <div className="mt-1 text-2xl font-semibold">{result.timeCritical}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Health risk</div>
                      <div className="mt-1 text-sm font-semibold">Sensitive groups</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-brand/30 bg-brand/10 p-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand">
                      <AlertTriangle className="size-3.5" /> Recommended action
                    </div>
                    <div className="mt-1.5 text-sm">{result.action}</div>
                  </div>

                  <button 
                    onClick={() => {
                      toast.success("Report submitted successfully to the municipality!");
                      setResult(null);
                      setPhoto(null);
                      setValidation({ status: "idle" });
                    }}
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                    Submit to municipality
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <Cloud className="size-3.5" /> Weather context
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Wind</span><span className="font-mono">8 km/h SW</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Humidity</span><span className="font-mono">62%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Visibility</span><span className="font-mono">6.5 km</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dispersion</span><span className="text-aqi-unhealthy">Poor</span></div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

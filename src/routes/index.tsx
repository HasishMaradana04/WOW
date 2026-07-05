import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bot, LayoutDashboard, MapPin, ShieldCheck, Sparkles, Wind, Zap, Activity } from "lucide-react";
import { AqiBadge } from "@/components/AqiBadge";
import { GlassCard } from "@/components/GlassCard";
import { Counter } from "@/components/Counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CleanAir & Clear Streets | AI Pollution Monitoring" },
      { name: "description", content: "Hyperlocal AI monitoring that helps citizens report pollution and municipalities respond faster with live AQI trends and predictive alerts." },
      { property: "og:title", content: "CleanAir & Clear Streets | AI Pollution Monitoring" },
      { property: "og:description", content: "A modern civic intelligence layer for air quality reporting, forecasting, and rapid cleanup coordination." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Bot, title: "AI Vision Detection", desc: "Gemini-grade vision classifies pollution type, severity, spread and confidence from a single photo." },
  { icon: Activity, title: "Live Street AQI", desc: "Every street tracked in real-time — PM2.5, PM10, NO₂, ozone, wind, humidity — with trend and risk meter." },
  { icon: Zap, title: "Predictive Alerts", desc: "6h / 12h / 24h AQI forecasts. Municipalities are warned before pollution turns dangerous." },
  { icon: ShieldCheck, title: "Cleanup Workflow", desc: "Verified reports flow from citizen → officer → cleanup crew → AI verification with before/after proof." },
];

const flow = [
  { step: "01", title: "Report", desc: "Citizens snap a photo, tag the street and submit." },
  { step: "02", title: "Analyze", desc: "AI classifies pollution and predicts spread within seconds." },
  { step: "03", title: "Dispatch", desc: "Municipalities receive prioritized alerts and assign teams." },
  { step: "04", title: "Verify", desc: "AI compares before/after imagery and confirms resolution." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-aqi-hazard/70 shadow-[var(--shadow-glow)]">
              <Wind className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">CleanAir <span className="text-muted-foreground font-normal">& Clear Streets</span></span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#network" className="text-sm text-muted-foreground hover:text-foreground">Network</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link to="/dashboard" className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90">
              Launch console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -left-40 top-40 size-96 rounded-full bg-brand/20 blur-[120px] animate-float" />
        <div className="absolute right-0 top-10 size-[500px] rounded-full bg-aqi-hazard/15 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-glass px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-aqi-good opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-aqi-good" />
              </span>
              Live monitoring across 120+ streets, 42 sectors
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-7xl">
              The city's <span className="text-gradient-brand">breath</span>,<br />visualized in real-time.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              AI-powered hyperlocal pollution monitoring platform. Detect, predict and mitigate air quality risks before they become public health emergencies.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/report" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-90">
                Report pollution <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border bg-glass px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-secondary/40">
                <LayoutDashboard className="size-4" /> View dashboard
              </Link>
            </div>
          </motion.div>

          {/* Floating stat cards */}
          <div className="mt-20 grid gap-4 md:grid-cols-4">
            {[
              { label: "Live AQI (city avg)", value: 84, badge: <AqiBadge aqi={84} /> },
              { label: "Reports today", value: 128, sub: "+12% vs yesterday" },
              { label: "Cleanups resolved", value: 942, sub: "This month" },
              { label: "Predicted alerts", value: 17, sub: "Next 24 hours" },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}>
                <GlassCard variant="elevated" className="relative overflow-hidden">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-4xl font-semibold tracking-tight"><Counter to={s.value} /></div>
                    {s.badge}
                  </div>
                  {s.sub && <div className="mt-2 text-xs text-muted-foreground">{s.sub}</div>}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/60 bg-background/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <div className="text-[11px] uppercase tracking-widest text-brand">Pipeline</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">From citizen report to cleaned street in one loop.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {flow.map((f, i) => (
              <GlassCard key={f.step} className="relative">
                <div className="font-mono text-xs text-muted-foreground">{f.step}</div>
                <div className="mt-2 text-lg font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{f.desc}</div>
                {i < flow.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground md:block" />
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-widest text-brand">Capabilities</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">A civic-grade intelligence layer for air quality.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <GlassCard key={f.title} variant="elevated" className="flex gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/25 to-aqi-hazard/20 border border-brand/30">
                  <f.icon className="size-5 text-brand" />
                </div>
                <div>
                  <div className="text-base font-semibold">{f.title}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Network showcase */}
      <section id="network" className="relative overflow-hidden border-t border-border/60 py-24">
        <div className="absolute inset-0 hero-bg opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6">
          <GlassCard className="p-10 md:p-16">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-brand">
                  <Sparkles className="size-3.5" /> AI Municipality Console
                </div>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Command centers, powered by air.</h3>
                <p className="mt-4 text-muted-foreground">
                  Municipal officers see prioritized cases with photo evidence, AI severity, predicted spread and recommended actions — all on one glass console.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link to="/municipal" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                    Municipal console
                  </Link>
                  <Link to="/map" className="rounded-xl border border-border bg-glass px-4 py-2.5 text-sm font-semibold hover:bg-secondary/40">
                    <MapPin className="mr-1.5 inline size-4" /> Open map
                  </Link>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  { name: "MG Road", aqi: 42 },
                  { name: "Industrial Park B", aqi: 305 },
                  { name: "Temple Street", aqi: 162 },
                  { name: "Market Chowk", aqi: 118 },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3">
                    <div className="text-sm font-medium">{s.name}</div>
                    <AqiBadge aqi={s.aqi} />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center">
          <div className="text-sm text-muted-foreground">© 2026 CleanAir & Clear Streets · Civic Air Intelligence</div>
          <div className="flex gap-6 text-xs uppercase tracking-widest text-muted-foreground">
            <a href="#">Privacy</a><a href="#">API</a><a href="#">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { STREETS, topPollutedStreets, PREDICTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; text: string };

const suggestions = [
  "Which area has the highest AQI?",
  "Show today's critical alerts",
  "Predict tomorrow's pollution",
  "Which street needs immediate cleaning?",
];

function respond(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("highest") || s.includes("worst")) {
    const top = topPollutedStreets(1)[0];
    return `The highest AQI right now is on **${top.name}** (${top.zone}) at **${top.aqi}** — ${top.aqi > 300 ? "hazardous" : "very poor"}. PM2.5 is ${top.pm25} µg/m³ with wind at ${top.wind} km/h.`;
  }
  if (s.includes("critical") || s.includes("alert")) {
    const crit = STREETS.filter((x) => x.aqi > 200).length;
    return `There are **${crit} critical zones** with AQI > 200. Top priority: ${topPollutedStreets(3).map((s) => s.name).join(", ")}.`;
  }
  if (s.includes("predict") || s.includes("tomorrow") || s.includes("forecast")) {
    return `AI forecast: **AQI ${PREDICTIONS[2].aqi}** in 24h (${PREDICTIONS[2].healthRisk}). Confidence ${PREDICTIONS[2].confidence}%. Expect ${PREDICTIONS[2].hotspots} hotspots spreading ~${PREDICTIONS[2].spread}.`;
  }
  if (s.includes("clean") || s.includes("immediate")) {
    const t = topPollutedStreets(3);
    return `Dispatch recommendation:\n1. **${t[0].name}** — AQI ${t[0].aqi}\n2. **${t[1].name}** — AQI ${t[1].aqi}\n3. **${t[2].name}** — AQI ${t[2].aqi}`;
  }
  if (s.includes("report")) {
    return `Generated cleanup report snapshot: 42 open incidents, 128 resolved this week, average response time 51 min, improvement of 34% PM2.5 in cleaned zones.`;
  }
  return `I can help with AQI hotspots, predictions, alerts and cleanup priorities. Try one of the suggested prompts.`;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi — I'm the CleanAir AI. Ask me about pollution hotspots, predictions or dispatch priorities." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const t = text.trim(); if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "assistant", text: respond(t) }]), 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full",
          "bg-gradient-to-br from-brand to-aqi-hazard/70 text-primary-foreground shadow-[var(--shadow-glow)]",
          "transition-transform hover:scale-105 active:scale-95",
        )}
        aria-label="AI assistant"
      >
        {open ? <X className="size-5" /> : <Sparkles className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl glass-panel"
          >
            <div className="flex items-center gap-2 border-b border-border p-4">
              <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-aqi-hazard/70">
                <Bot className="size-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">CleanAir AI</div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-aqi-good animate-pulse" /> Online
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm",
                  m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary")}>
                  {m.text.split("\n").map((line, j) => <div key={j}>{line}</div>)}
                </div>
              ))}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground">{s}</button>
                ))}
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about AQI, hotspots…"
                className="flex-1 rounded-lg bg-secondary/60 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-brand" />
              <button type="submit" className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

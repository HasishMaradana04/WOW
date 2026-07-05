import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Globe, Moon, Palette, Sun, User } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — CleanAir" }] }),
  component: Settings,
});

function Settings() {
  const user = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("light") ? "light" : "dark");
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(false);
  const [lang, setLang] = useState("English");

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences and personalization</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground"><User className="size-3.5" /> Profile</div>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand to-aqi-hazard/60 text-lg font-semibold text-primary-foreground">
              {((user?.profile?.name ?? user?.user?.email ?? "U")).split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.profile?.name ?? user?.user?.email?.split("@")[0] ?? "Guest"}</div>
              <div className="text-xs text-muted-foreground">{user?.user?.email ?? "not signed in"}</div>
              <div className="mt-1 inline-flex rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                {user?.role ?? "guest"}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground"><Palette className="size-3.5" /> Appearance</div>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/30 p-1">
            <button onClick={() => setTheme("dark")}
              className={cn("flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm",
                theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Moon className="size-4" /> Dark
            </button>
            <button onClick={() => setTheme("light")}
              className={cn("flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm",
                theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Sun className="size-4" /> Light
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground"><Bell className="size-3.5" /> Notifications</div>
          <div className="mt-4 space-y-3">
            <Row label="Push notifications" checked={notif} onChange={setNotif} />
            <Row label="Alert sound" checked={sound} onChange={setSound} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground"><Globe className="size-3.5" /> Language</div>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            className="mt-4 h-10 w-full rounded-lg border border-border bg-secondary/40 px-3 text-sm outline-none focus:ring-2 focus:ring-brand">
            {["English", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "मराठी", "Español"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm">
      <span>{label}</span>
      <span className={cn("relative inline-block h-5 w-9 rounded-full transition", checked ? "bg-primary" : "bg-secondary")}>
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition", checked ? "left-4" : "left-0.5")} />
      </span>
    </button>
  );
}

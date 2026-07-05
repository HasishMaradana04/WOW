import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "solid" | "elevated";
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all",
        variant === "default" && "glass-panel",
        variant === "solid" && "bg-card border border-border",
        variant === "elevated" && "glass-panel hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-30px_oklch(0_0_0/0.7)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

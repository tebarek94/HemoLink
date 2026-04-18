import type { ReactNode } from "react";

type Tone = "success" | "neutral" | "urgent";

const tones: Record<Tone, string> = {
  success: "bg-accent/15 text-accent ring-1 ring-accent/30",
  neutral: "bg-surface text-text-muted ring-1 ring-black/5",
  urgent: "bg-primary/10 text-primary ring-1 ring-primary/25",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

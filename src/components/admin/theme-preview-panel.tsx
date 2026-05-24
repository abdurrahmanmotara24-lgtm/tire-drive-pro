import type { CSSProperties } from "react";
import { resolveBrandPalette } from "@/lib/brand-colors";
import type { ThemeContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type Props = {
  theme: ThemeContent;
  mode: "light" | "dark";
  className?: string;
};

export function ThemePreviewPanel({ theme, mode, className }: Props) {
  const palette = resolveBrandPalette(theme, mode);
  const glowPct = mode === "light" ? (theme.glow_intensity_light ?? 35) : (theme.glow_intensity_dark ?? 50);

  const previewStyle = {
    "--primary": palette.primary,
    "--ring": palette.primary,
    "--shadow-glow": `0 0 32px -4px color-mix(in oklch, ${palette.primary} ${glowPct}%, transparent)`,
    borderRadius: theme.radius || "0.5rem",
  } as CSSProperties;

  return (
    <div
      className={cn(
        "rounded-md border border-border p-4",
        mode === "light" ? "light bg-background text-foreground" : "dark bg-background text-foreground",
        className,
      )}
      style={previewStyle}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {mode === "light" ? "Light mode preview" : "Dark mode preview"}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-glow"
        >
          Primary button
        </button>
        <button
          type="button"
          className="rounded-sm border border-border bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
        >
          Outline
        </button>
        <a href="#preview" className="text-sm font-semibold text-primary hover:underline" onClick={(e) => e.preventDefault()}>
          Accent link
        </a>
      </div>
      <div
        className="mt-4 flex h-14 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 text-xs text-muted-foreground"
        style={{ boxShadow: `var(--shadow-glow)` }}
      >
        Glow sample
      </div>
    </div>
  );
}

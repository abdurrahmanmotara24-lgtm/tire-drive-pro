import type { HeroContent } from "@/lib/site-content";
import { parseStatValue } from "@/lib/media";
import { useCountUp } from "@/hooks/use-count-up";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

function StatCell({
  value,
  label,
  compact,
  animateCount,
}: {
  value: string;
  label: string;
  compact?: boolean;
  /** When set, drives count-up without per-cell scroll reveal (stagger parent). */
  animateCount?: boolean;
}) {
  const reveal = useReveal<HTMLDivElement>();
  const { prefix, number, suffix } = parseStatValue(value);
  const visible = animateCount ?? reveal.visible;
  const count = useCountUp(number, visible);

  const display =
    number > 0 ? (
      <>
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </>
    ) : (
      value
    );

  if (compact) {
    return (
      <div className="flex items-baseline gap-2 text-sm">
        <span className="font-display font-semibold tabular-nums text-primary">{display}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    );
  }

  return (
    <div ref={reveal.ref} className={cn("hover-stat px-4 py-2 text-center sm:px-8", reveal.className)}>
      <div className="stat-value font-display text-3xl text-primary sm:text-4xl">{display}</div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatStrip({
  stats,
  variant = "default",
}: {
  stats: HeroContent["stats"];
  variant?: "default" | "compact";
}) {
  const sectionReveal = useReveal<HTMLElement>();

  if (variant === "compact") {
    return (
      <section
        ref={sectionReveal.ref}
        className={cn("border-b border-border/60 bg-muted/20", sectionReveal.className)}
        aria-label="Highlights"
      >
        <div className="stagger-children container-tny grid grid-cols-2 gap-x-4 gap-y-3 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-2 sm:py-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-center sm:px-6 sm:first:pl-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-border"
            >
              <StatCell value={s.value} label={s.label} compact animateCount={sectionReveal.visible} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border bg-card">
      <div className="container-tny grid grid-cols-1 gap-4 py-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        {stats.map((s) => (
          <StatCell key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}

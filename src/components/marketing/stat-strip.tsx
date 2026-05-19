import type { HeroContent } from "@/lib/site-content";
import { parseStatValue } from "@/lib/media";
import { useCountUp } from "@/hooks/use-count-up";
import { useReveal } from "@/hooks/use-reveal";

function StatCell({
  value,
  label,
  compact,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  const reveal = useReveal<HTMLDivElement>();
  const { prefix, number, suffix } = parseStatValue(value);
  const count = useCountUp(number, reveal.visible);

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
      <div ref={reveal.ref} className={`flex items-baseline gap-2 text-sm ${reveal.className}`}>
        <span className="font-display font-semibold tabular-nums text-primary">{display}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    );
  }

  return (
    <div ref={reveal.ref} className={`hover-stat px-4 py-2 text-center sm:px-8 ${reveal.className}`}>
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
  if (variant === "compact") {
    return (
      <section className="border-b border-border/60 bg-muted/20" aria-label="Highlights">
        <div className="container-tny flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 sm:gap-x-10">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-6 sm:gap-10">
              {i > 0 && (
                <span className="hidden h-3 w-px shrink-0 bg-border sm:block" aria-hidden />
              )}
              <StatCell value={s.value} label={s.label} compact />
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

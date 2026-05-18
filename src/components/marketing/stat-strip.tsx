import type { HeroContent } from "@/lib/site-content";
import { parseStatValue } from "@/lib/media";
import { useCountUp } from "@/hooks/use-count-up";
import { useReveal } from "@/hooks/use-reveal";

function StatCell({ value, label }: { value: string; label: string }) {
  const reveal = useReveal<HTMLDivElement>();
  const { prefix, number, suffix } = parseStatValue(value);
  const count = useCountUp(number, reveal.visible);

  return (
    <div ref={reveal.ref} className={`hover-stat px-4 py-2 text-center sm:px-8 ${reveal.className}`}>
      <div className="stat-value font-display text-3xl text-primary sm:text-4xl">
        {prefix}
        {number > 0 ? count.toLocaleString() : value}
        {number > 0 ? suffix : ""}
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatStrip({ stats }: { stats: HeroContent["stats"] }) {
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

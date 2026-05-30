import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { SpecialItem } from "@/lib/site-content";
import { getIcon } from "@/lib/icons";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

function SpecialBadge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SpecialsGrid({ specials }: { specials: SpecialItem[] }) {
  const reveal = useReveal<HTMLElement>();
  if (specials.length === 0) return null;

  return (
    <section
      id="specials"
      ref={reveal.ref}
      className={cn("section border-y border-border bg-card/40 pb-12 md:pb-16", reveal.className)}
    >
      <div className="container-tny">
        <SectionHeading
          eyebrow="Specials"
          title="Deals this week"
          subtitle="Limited offers on fitment, alignment, and fleet packages — ask us what's in stock today."
        />
        <div className="stagger-children mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specials.map((item) => {
            const service = item.quote_service?.trim() || item.title;
            const Icon = getIcon(item.icon);
            return (
              <article
                key={item.title}
                className="special-card hover-lift group glass-panel flex h-full flex-col overflow-hidden rounded-sm"
              >
                {item.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border/80 bg-muted">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {item.badge ? (
                      <SpecialBadge className="absolute left-3 top-3 border-primary/35 bg-background/90 backdrop-blur-sm">
                        {item.badge}
                      </SpecialBadge>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-primary transition-colors group-hover:bg-primary/25 group-hover:shadow-[0_0_20px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
                          item.image && "h-9 w-9",
                        )}
                      >
                        <Icon className="h-4 w-4 group-icon-bump" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        {!item.image && item.badge ? <SpecialBadge className="mb-1.5">{item.badge}</SpecialBadge> : null}
                        <h3 className="font-display text-lg leading-tight transition-colors group-hover:text-primary sm:text-xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    {item.price ? (
                      <p className="shrink-0 font-display text-lg text-primary sm:text-xl">{item.price}</p>
                    ) : null}
                  </div>
                  {item.desc ? (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  ) : null}
                  {item.valid_until ? (
                    <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.valid_until}
                    </p>
                  ) : null}
                  <Link
                    to="/"
                    search={{ service }}
                    hash="quote"
                    className="mt-4 inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary"
                  >
                    Get a quote <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

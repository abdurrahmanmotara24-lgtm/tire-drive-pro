import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { HeroOffering } from "@/lib/site-content";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  offerings: HeroOffering[];
  className?: string;
  centered?: boolean;
};

export function HeroOfferings({ offerings, className, centered }: Props) {
  if (!offerings.length) return null;

  return (
    <ul
      className={cn(
        "hero-offerings animate-in-view mt-6 grid list-none gap-2 p-0 sm:mt-8 sm:grid-cols-3 sm:gap-3",
        centered && "max-w-3xl",
        className,
      )}
    >
      {offerings.map((o) => {
        const Icon = getIcon(o.icon);
        const service = o.quote_service?.trim() || o.label;
        return (
          <li key={o.label}>
            <Link
              to="/"
              hash="quote"
              search={{ service }}
              className="hero-offering-card hover-lift group flex h-full flex-col rounded-sm border border-border/80 bg-background/75 p-4 text-left backdrop-blur-md transition-colors hover:border-primary/45 sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-3 font-display text-base leading-tight text-foreground sm:text-lg">{o.label}</span>
              <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{o.description}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                Get a quote <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

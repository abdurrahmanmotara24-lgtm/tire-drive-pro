import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketingCardProps = {
  title: string;
  description: string;
  tag?: string;
  icon?: LucideIcon;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export function MarketingCard({
  title,
  description,
  tag,
  icon: Icon,
  href,
  linkLabel,
  className,
}: MarketingCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-red-accent/30 hover:shadow-elegant",
        className,
      )}
    >
      {tag && (
        <span className="inline-block rounded-full bg-brand-red-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-red-accent">
          {tag}
        </span>
      )}
      {Icon && (
        <div className="icon-soft mt-3 h-9 w-9">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <h3 className={cn("font-bold text-primary", tag || Icon ? "mt-3 text-lg" : "text-lg")}>{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {href && linkLabel && (
        <a
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red-accent transition-all hover:gap-2"
        >
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

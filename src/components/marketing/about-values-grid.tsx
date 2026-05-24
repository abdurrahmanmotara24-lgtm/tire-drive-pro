import { Award, Clock, Heart, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import type { AboutValue } from "@/lib/site-content";
import { SectionHeading } from "@/components/marketing/section-heading";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const VALUE_ICONS: Record<string, LucideIcon> = {
  craft: Wrench,
  honesty: ShieldCheck,
  speed: Clock,
  care: Heart,
};

function iconForValue(title: string): LucideIcon {
  const key = title.trim().toLowerCase();
  return VALUE_ICONS[key] ?? Award;
}

export function AboutValuesGrid({ values }: { values: AboutValue[] }) {
  const reveal = useReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className={cn("section border-t border-border bg-card", reveal.className)}>
      <div className="container-tny">
        <SectionHeading
          eyebrow="Values"
          title="What we stand for"
          subtitle="How we work on every vehicle that comes through our bay."
          align="center"
          className="mx-auto"
        />
        <ul className="stagger-children mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:mt-12 lg:gap-6">
          {values.map((v) => {
            const Icon = iconForValue(v.title);
            return (
              <li
                key={v.title}
                className="hover-glass glass-panel group rounded-sm p-5 sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="font-display mt-4 text-lg tracking-wide text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

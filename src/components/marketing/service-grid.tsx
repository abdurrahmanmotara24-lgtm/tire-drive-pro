import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ServiceItem } from "@/lib/site-content";
import { getServiceIcon } from "@/lib/icons";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";

export function ServiceGrid({ services }: { services: ServiceItem[] }) {
  const reveal = useReveal<HTMLElement>();

  return (
    <section id="services" ref={reveal.ref} className={`section pb-12 md:pb-16 ${reveal.className}`}>
      <div className="container-tny">
        <SectionHeading
          eyebrow="Services"
          title="Precision for every drive"
          subtitle="From daily commuters to performance builds — fitted right, every time."
        />
        <div className="stagger-children mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = getServiceIcon(s);
            return (
              <div
                key={s.title}
                className="service-card-spotlight hover-lift group glass-panel rounded-sm p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/15 text-primary transition-colors group-hover:bg-primary/25 group-hover:shadow-[0_0_20px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
                  <Icon className="group-icon-bump h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg transition-colors group-hover:text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <Link
                  to="/"
                  search={{ service: s.title }}
                  hash="quote"
                  className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  Get a quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

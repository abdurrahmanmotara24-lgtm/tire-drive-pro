import { BadgeCheck } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";

const perks = ["Same-day fitment available", "Best price guarantee", "Full safety inspection included"];

export function QuotePanel({ serviceHint }: { serviceHint?: string }) {
  const reveal = useReveal<HTMLElement>();

  return (
    <section
      id="quote"
      ref={reveal.ref}
      className={`section-dark section scroll-pad-quote border-t border-border ${reveal.className}`}
    >
      <div className="container-tny grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Quote"
            title="Ready when you are"
            subtitle="Tell us about your vehicle. We respond fast during business hours."
          />
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm">
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hover-glass glass-panel rounded-sm p-1">
          <QuoteForm serviceHint={serviceHint} />
        </div>
      </div>
    </section>
  );
}

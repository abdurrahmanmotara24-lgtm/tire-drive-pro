import type { CSSProperties } from "react";
import type { ProcessStep } from "@/lib/site-content";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const BADGE_STAGGER_S = 0.12;

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const reveal = useReveal<HTMLElement>();
  const animated = reveal.visible;

  return (
    <section
      id="process"
      ref={reveal.ref}
      className={cn("section border-t border-border bg-card", reveal.className)}
    >
      <div className="container-tny">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          subtitle="Four steps from quote to confident driving."
          align="center"
        />
        <ol
          className={cn(
            "process-timeline stagger-children mt-12 grid list-none gap-6 p-0 max-sm:gap-5 md:mt-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-6",
            animated && "process-timeline--animated",
          )}
        >
          {steps.map((s, i) => (
            <li
              key={s.step}
              className="hover-process process-step group"
              style={
                {
                  animationDelay: `${i * 0.08}s`,
                  "--process-badge-delay": `${0.15 + i * BADGE_STAGGER_S}s`,
                } as CSSProperties
              }
            >
              <div className="process-step-badge shrink-0" aria-hidden>
                <span className="process-step-num font-display text-lg leading-none">{s.step}</span>
              </div>
              <div className="process-step-body min-w-0 flex-1">
                <h3 className="font-display text-lg tracking-wide text-foreground">{s.title}</h3>
                <p className="process-step-desc mt-1.5 text-sm leading-relaxed sm:mt-2">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

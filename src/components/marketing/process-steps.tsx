import type { ProcessStep } from "@/lib/site-content";
import { SectionHeading } from "./section-heading";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const reveal = useReveal<HTMLElement>();

  return (
    <section id="process" ref={reveal.ref} className={cn("section-dark section border-t border-border", reveal.className)}>
      <div className="container-tny">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          subtitle="Four steps from quote to confident driving."
          align="center"
        />
        <ol className="process-timeline stagger-children mt-12 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li
              key={s.step}
              className="hover-process process-step group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="process-step-badge" aria-hidden>
                <span className="process-step-num font-display text-lg leading-none">{s.step}</span>
              </div>
              <h3 className="font-display mt-4 text-lg tracking-wide">{s.title}</h3>
              <p className="process-step-desc mt-2 text-sm leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

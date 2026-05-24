import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { SectionHeading } from "./section-heading";

type Props = { brands: string[]; priority?: boolean };

export function BrandMarquee({ brands, priority }: Props) {
  const reducedMotion = usePrefersReducedMotion();

  const row1 = [...brands, ...brands];
  const row2 = [...[...brands].reverse(), ...[...brands].reverse()];

  const sectionClass = cn(
    "section-dark border-y border-border",
    priority ? "border-t-0 py-12" : "py-14",
  );

  if (reducedMotion) {
    return (
      <section id="brands" className={sectionClass}>
        <div className="container-tny mb-10">
          <SectionHeading
            eyebrow="Partners"
            title="Brands we stock"
            subtitle="Trusted names — fitted with factory-spec precision."
            align="center"
          />
        </div>
        <ul className="container-tny flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4">
          {brands.map((b) => (
            <li key={b} className="font-display text-lg tracking-[0.12em] text-muted-foreground sm:text-xl">
              {b}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id="brands" className={cn(sectionClass, "overflow-hidden")}>
      <div className="container-tny mb-10">
        <SectionHeading
          eyebrow="Partners"
          title="Brands we stock"
          subtitle="Trusted names — fitted with factory-spec precision."
          align="center"
        />
      </div>
      <div className="marquee-fade space-y-3 sm:space-y-4">
        <div className="overflow-hidden">
          <div className="marquee-track gap-10 px-4 sm:gap-16">
            {row1.map((b, i) => (
              <span
                key={`a-${b}-${i}`}
                className="brand-marquee__brand hover-brand font-display shrink-0 text-xl tracking-[0.12em] text-muted-foreground sm:text-2xl md:text-3xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track marquee-track-reverse gap-10 px-4 sm:gap-16">
            {row2.map((b, i) => (
              <span
                key={`b-${b}-${i}`}
                className="brand-marquee__brand hover-brand font-display shrink-0 text-lg tracking-[0.12em] text-muted-foreground/70 sm:text-xl md:text-2xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

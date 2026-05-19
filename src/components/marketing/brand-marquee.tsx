import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

type Props = { brands: string[]; priority?: boolean };

export function BrandMarquee({ brands, priority }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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
        <ul className="container-tny flex flex-wrap justify-center gap-x-8 gap-y-4">
          {brands.map((b) => (
            <li key={b} className="font-display text-xl tracking-[0.12em] text-muted-foreground">
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
      <div className="marquee-fade space-y-4">
        <div className="overflow-hidden">
          <div className="marquee-track gap-16 px-4">
            {row1.map((b, i) => (
              <span
                key={`a-${b}-${i}`}
                className="hover-brand font-display shrink-0 text-2xl tracking-[0.12em] text-muted-foreground sm:text-3xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track marquee-track-reverse gap-16 px-4">
            {row2.map((b, i) => (
              <span
                key={`b-${b}-${i}`}
                className="hover-brand font-display shrink-0 text-xl tracking-[0.12em] text-muted-foreground/70 sm:text-2xl"
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

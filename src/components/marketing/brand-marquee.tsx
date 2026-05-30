import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import type { BrandItem } from "@/lib/site-content";
import { SectionHeading } from "./section-heading";

type Props = { brands: BrandItem[]; priority?: boolean };

function BrandMark({ brand, nameClassName }: { brand: BrandItem; nameClassName?: string }) {
  if (brand.logo) {
    return (
      <span className="brand-marquee__logo-frame" title={brand.name}>
        <img
          src={brand.logo}
          alt={brand.name}
          className="brand-marquee__logo"
          loading="lazy"
          decoding="async"
        />
      </span>
    );
  }
  return (
    <span className={cn("brand-marquee__name font-display tracking-[0.12em] text-muted-foreground", nameClassName)}>
      {brand.name}
    </span>
  );
}

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
        <ul className="container-tny flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10">
          {brands.map((b) => (
            <li key={b.name} className="brand-marquee__brand hover-brand shrink-0">
              <BrandMark brand={b} nameClassName="text-lg sm:text-xl" />
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
      <div className="marquee-fade space-y-4 sm:space-y-5">
        <div className="overflow-hidden">
          <div className="marquee-track gap-8 px-4 sm:gap-12 md:gap-16">
            {row1.map((b, i) => (
              <span key={`a-${b.name}-${i}`} className="brand-marquee__brand hover-brand shrink-0">
                <BrandMark brand={b} nameClassName="text-xl sm:text-2xl md:text-3xl" />
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track marquee-track-reverse gap-8 px-4 sm:gap-12 md:gap-16">
            {row2.map((b, i) => (
              <span key={`b-${b.name}-${i}`} className="brand-marquee__brand hover-brand shrink-0">
                <BrandMark brand={b} nameClassName="text-lg sm:text-xl md:text-2xl" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

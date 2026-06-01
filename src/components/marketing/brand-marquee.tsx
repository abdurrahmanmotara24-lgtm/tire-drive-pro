import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import type { BrandItem } from "@/lib/site-content";
import { MarqueeTrack } from "./marquee-track";
import { SectionHeading } from "./section-heading";

type Props = { brands: BrandItem[]; priority?: boolean };

function BrandLogo({ brand }: { brand: BrandItem }) {
  if (!brand.logo) return null;

  if (brand.logoDark) {
    return (
      <>
        <img
          src={brand.logo}
          alt=""
          aria-hidden
          className="brand-marquee__logo brand-marquee__logo--on-light"
          loading="lazy"
          decoding="async"
        />
        <img
          src={brand.logoDark}
          alt={brand.name}
          className="brand-marquee__logo brand-marquee__logo--on-dark"
          loading="lazy"
          decoding="async"
        />
      </>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="brand-marquee__logo"
      loading="lazy"
      decoding="async"
    />
  );
}

function BrandMark({
  brand,
  nameClassName,
  ariaHidden,
}: {
  brand: BrandItem;
  nameClassName?: string;
  ariaHidden?: boolean;
}) {
  const inner = brand.logo ? (
    <span className="brand-marquee__logo-frame" title={brand.name}>
      <BrandLogo brand={brand} />
    </span>
  ) : (
    <span
      className={cn(
        "brand-marquee__name hover-brand font-display tracking-[0.12em] text-muted-foreground",
        nameClassName,
      )}
    >
      {brand.name}
    </span>
  );

  const mark = brand.href ? (
    <a
      href={brand.href}
      className="brand-marquee__brand brand-marquee__link shrink-0"
      aria-label={brand.name}
      {...(ariaHidden ? { "aria-hidden": true as const, tabIndex: -1 } : {})}
    >
      {inner}
    </a>
  ) : (
    <span
      className="brand-marquee__brand shrink-0"
      {...(ariaHidden ? { "aria-hidden": true as const } : {})}
    >
      {inner}
    </span>
  );

  return mark;
}

export function BrandMarquee({ brands, priority }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const sectionClass = cn(
    "section-dark border-y border-border",
    priority ? "border-t-0 py-12" : "py-14",
  );

  const heading = (
    <div className="container-tny mb-10">
      <SectionHeading
        eyebrow="Partners"
        title="Brands we stock"
        subtitle="Trusted names — fitted with factory-spec precision."
        align="center"
      />
    </div>
  );

  if (reducedMotion) {
    return (
      <section id="brands" ref={sectionRef} className={sectionClass}>
        {heading}
        <ul className="container-tny flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10">
          {brands.map((b) => (
            <li key={b.name}>
              <BrandMark brand={b} nameClassName="text-lg sm:text-xl" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id="brands" ref={sectionRef} className={cn(sectionClass, "overflow-hidden")}>
      {heading}
      <div
        className={cn("marquee-fade", inView && "marquee-fade--in-view")}
      >
        <MarqueeTrack
          items={brands}
          getItemKey={(b) => b.name}
          renderItem={(b, _i, { duplicate }) => (
            <BrandMark
              brand={b}
              nameClassName="text-xl sm:text-2xl md:text-3xl"
              ariaHidden={duplicate}
            />
          )}
        />
      </div>
    </section>
  );
}

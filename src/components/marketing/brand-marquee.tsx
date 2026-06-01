import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { useReveal } from "@/hooks/use-reveal";
import type { BrandItem } from "@/lib/site-content";
import { MarqueeTrack } from "./marquee-track";
import { SectionHeading } from "./section-heading";

type Props = { brands: BrandItem[]; priority?: boolean };

function BrandLogo({ brand, priority }: { brand: BrandItem; priority?: boolean }) {
  if (!brand.logo) return null;

  const imgProps = {
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  if (brand.logoDark) {
    return (
      <>
        <img
          src={brand.logo}
          alt=""
          aria-hidden
          className="brand-marquee__logo brand-marquee__logo--on-light"
          {...imgProps}
        />
        <img
          src={brand.logoDark}
          alt={brand.name}
          className="brand-marquee__logo brand-marquee__logo--on-dark"
          {...imgProps}
        />
      </>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="brand-marquee__logo"
      {...imgProps}
    />
  );
}

function BrandMark({
  brand,
  nameClassName,
  ariaHidden,
  priority,
}: {
  brand: BrandItem;
  nameClassName?: string;
  ariaHidden?: boolean;
  priority?: boolean;
}) {
  const inner = brand.logo ? (
    <span className="brand-marquee__logo-frame" title={brand.name}>
      <BrandLogo brand={brand} priority={priority} />
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

  const href = brand.href?.trim();
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");

  const mark = href ? (
    <a
      href={href}
      className="brand-marquee__brand brand-marquee__link shrink-0"
      aria-label={brand.name}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
  const reveal = useReveal<HTMLElement>();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;
    const el = reveal.ref.current;
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
    !reducedMotion && reveal.className,
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
      <section id="brands" ref={reveal.ref} className={sectionClass}>
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
    <section id="brands" ref={reveal.ref} className={cn(sectionClass, "overflow-hidden")}>
      {heading}
      <div className={cn("marquee-fade space-y-4 sm:space-y-5", inView && "marquee-fade--in-view")}>
        <MarqueeTrack
          items={brands}
          getItemKey={(b, i) => `row1-${b.name}-${i}`}
          renderItem={(b, i, { duplicate }) => (
            <BrandMark
              brand={b}
              nameClassName="text-xl sm:text-2xl md:text-3xl"
              ariaHidden={duplicate}
              priority={!duplicate && i < 6}
            />
          )}
        />
        <MarqueeTrack
          items={[...brands].reverse()}
          reverse
          getItemKey={(b, i) => `row2-${b.name}-${i}`}
          renderItem={(b, _i, { duplicate }) => (
            <BrandMark
              brand={b}
              nameClassName="text-lg sm:text-xl md:text-2xl"
              ariaHidden={duplicate}
            />
          )}
        />
      </div>
    </section>
  );
}

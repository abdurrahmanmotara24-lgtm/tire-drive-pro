import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Phone, Truck, ShieldCheck, BadgeCheck } from "lucide-react";
import type { HeroContent } from "@/lib/site-content";
import heroWarehouse from "@/assets/hero-warehouse.png";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { HeroBackground } from "./hero-background";

const trustPills = [
  { icon: Truck, label: "Fast fitment" },
  { icon: ShieldCheck, label: "Trusted brands" },
  { icon: BadgeCheck, label: "Best price guarantee" },
];

type Props = {
  hero: HeroContent;
  callHref?: string;
  fallbackImage?: string;
  bleedUnderHeader?: boolean;
};

export function CinematicHero({ hero, callHref, fallbackImage = heroWarehouse, bleedUnderHeader }: Props) {
  const bg = hero.background_image || fallbackImage;
  const overlay = (hero.overlay_opacity ?? 62) / 100;
  const isWarehouse = !hero.background_image || bg === fallbackImage;
  const focal = `${hero.focal_x ?? 36}% ${hero.focal_y ?? 46}%`;

  return (
    <section
      className={cn(
        "hero-cinematic relative isolate flex min-h-[100svh] overflow-hidden md:min-h-[100svh]",
        bleedUnderHeader ? "hero-cinematic--home max-md:items-stretch md:items-end" : "items-end",
        isWarehouse && "hero-cinematic--warehouse",
      )}
      style={
        {
          "--hero-overlay-opacity": overlay,
          "--hero-tint-opacity": overlay,
        } as CSSProperties
      }
    >
      <HeroBackground src={bg} variant={isWarehouse ? "warehouse" : "default"} objectPosition={focal} />
      <div className="hero-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-glow-orb pointer-events-none absolute -right-20 top-1/4 z-[1] h-96 w-96 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="hero-overlay-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-overlay-scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-overlay-tint pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div
        className={cn(
          "hero-cinematic-inner container-tny relative z-10 w-full pb-20 md:pb-16 md:pt-28 lg:pb-24 lg:pt-32 max-md:pb-24",
          bleedUnderHeader ? "max-md:pt-0" : "pt-24",
          bleedUnderHeader && "flex flex-col items-center text-center max-md:justify-end",
        )}
      >
        {bleedUnderHeader ? (
          <Link
            to="/"
            className="hero-brand-logo hover-logo animate-in-view mb-5 sm:mb-6 md:mb-8"
            aria-label="Tires Near You — Home"
          >
            <img
              src={logo}
              alt="Tires Near You"
              width={480}
              height={144}
              className="hero-brand-logo__img h-auto w-[min(88vw,18rem)] sm:w-[min(80vw,22rem)] md:w-[min(62vw,28rem)] lg:w-[min(48vw,32rem)]"
              fetchPriority="high"
            />
          </Link>
        ) : null}
        <p className="hero-badge animate-in-view text-xs font-semibold uppercase tracking-[0.2em]">
          {hero.badge}
        </p>
        <h1
          className={cn(
            "animate-in-view font-display text-balance text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.92] tracking-tight",
            bleedUnderHeader ? "mt-4 max-w-4xl sm:mt-6" : "mt-6 max-w-4xl",
          )}
        >
          {hero.title_line1}
          <span className="hero-title-glow block text-primary">{hero.title_line2}</span>
        </h1>
        <p
          className={cn(
            "hero-subtitle animate-in-view mt-5 text-lg sm:text-xl",
            bleedUnderHeader ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {hero.subtitle}
        </p>
        <div
          className={cn(
            "animate-in-view mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
            bleedUnderHeader && "w-full justify-center",
          )}
        >
          <a
            href={hero.cta_primary_link || "#quote"}
            className="hover-btn-primary hover-icon-bump inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow sm:w-auto"
          >
            {hero.cta_primary_text} <ArrowRight className="icon-bump h-4 w-4" />
          </a>
          {callHref && (
            <a
              href={hero.cta_secondary_link || callHref}
              className="hero-cta-ghost hover-btn-outline hover-icon-bump inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border px-6 py-3 text-sm font-bold uppercase tracking-wider backdrop-blur-sm sm:w-auto"
            >
              <Phone className="icon-bump h-4 w-4" /> {hero.cta_secondary_text}
            </a>
          )}
        </div>
        <div
          className={cn(
            "animate-in-view mt-8 flex flex-wrap gap-2",
            bleedUnderHeader && "justify-center",
          )}
        >
          {trustPills.map((p) => (
            <span
              key={p.label}
              className="hero-trust-pill hover-scale inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <p.icon className="h-3.5 w-3.5 text-primary" />
              {p.label}
            </span>
          ))}
        </div>
      </div>
      <a
        href="#content"
        className="hover-scale absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary sm:bottom-6 sm:block md:bottom-6"
        aria-label="Scroll to content"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}

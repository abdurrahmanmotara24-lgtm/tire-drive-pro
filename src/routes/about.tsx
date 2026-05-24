import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { FALLBACK_IMAGES, resolveSiteImage } from "@/lib/site-images";
import { PageIntro } from "@/components/marketing/page-intro";
import { SeoMeta } from "@/components/seo-meta";
import { useReveal } from "@/hooks/use-reveal";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";
import { StatStrip } from "@/components/marketing/stat-strip";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { AboutValuesGrid } from "@/components/marketing/about-values-grid";
import { AboutTrustBar } from "@/components/marketing/about-trust-bar";
import { PublicButton, PublicOutlineButton } from "@/components/public-button";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";
import { brandPageTitle } from "@/lib/brand";

const PAGE_DESC =
  "Single-bay tyre and wheel fitment — passenger, truck, and mag wheels. Honest advice, laser alignment, and safety checks included.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: brandPageTitle("About") },
      { name: "description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const cmsReady = usePublicContentReady();
  const { contact, telHref, hasPhone } = useContactContent();
  const { data: about = DEFAULTS.about } = useQuery({
    queryKey: ["content", "about"],
    queryFn: () => fetchContent("about"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.about,
  });
  const { data: hero = DEFAULTS.hero } = useQuery({
    queryKey: ["content", "hero"],
    queryFn: () => fetchContent("hero"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.hero,
  });
  const { data: process = DEFAULTS.process } = useQuery({
    queryKey: ["content", "process"],
    queryFn: () => fetchContent("process"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.process,
  });
  const { data: homepage = DEFAULTS.homepage } = useQuery({
    queryKey: ["content", "homepage"],
    queryFn: () => fetchContent("homepage"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.homepage,
  });

  const storyImage = resolveSiteImage(
    homepage.about_story_image || homepage.technician_band.image,
    FALLBACK_IMAGES.technician,
  );
  const storyReveal = useReveal<HTMLElement>();

  return (
    <>
      <SeoMeta title={brandPageTitle("About")} description={PAGE_DESC} />
      <PageIntro eyebrow="About" title={about.headline} subtitle={about.intro} />

      <StatStrip stats={hero.stats} variant="compact" />

      <section ref={storyReveal.ref} className={cn("section", storyReveal.className)}>
        <div className="container-tny grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="hover-img-zoom order-2 overflow-hidden rounded-sm lg:order-1">
            <img
              src={storyImage}
              alt="Technician fitting tyres"
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="aspect-[4/3] w-full rounded-sm object-cover object-[58%_38%]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our story</p>
            <h2 className="font-display mt-2 text-3xl leading-tight sm:text-4xl">Local shop. Premium standard.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{about.story}</p>
            {about.story_bullets.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {about.story_bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <PublicButton asChild>
                <Link to="/contact" className="inline-flex items-center gap-2">
                  Get in touch <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </PublicButton>
              <PublicOutlineButton asChild>
                <Link to="/locations" className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden /> Visit us
                </Link>
              </PublicOutlineButton>
              {hasPhone && telHref && (
                <PublicOutlineButton asChild>
                  <a href={telHref} className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden /> Call
                  </a>
                </PublicOutlineButton>
              )}
            </div>
          </div>
        </div>
      </section>

      <AboutTrustBar />

      <ProcessSteps
        steps={process}
        showBookCta={false}
        subtitle="From walk-in or quote to driving away confident — here’s how we work."
      />

      <AboutValuesGrid values={about.values} />

      <section className="border-t border-border bg-primary py-14">
        <div className="container-tny text-center">
          <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/85">
            {contact.hours ? `${contact.hours} · ` : ""}
            Walk in or request a quote — we’ll recommend the right tyres for how you drive.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PublicButton asChild className="bg-background text-primary hover:bg-background/90">
              <Link to="/" hash="quote">
                Request a quote
              </Link>
            </PublicButton>
            <PublicOutlineButton
              asChild
              className="border-primary-foreground/35 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/locations">Visit our store</Link>
            </PublicOutlineButton>
            {hasPhone && telHref && (
              <PublicOutlineButton
                asChild
                className="border-primary-foreground/35 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href={telHref}>Call now</a>
              </PublicOutlineButton>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import { SeoMeta } from "@/components/seo-meta";
import { HomePageSkeleton } from "@/components/home-page-skeleton";
import { CinematicHero } from "@/components/marketing/cinematic-hero";
import { StatStrip } from "@/components/marketing/stat-strip";
import { ServiceGrid } from "@/components/marketing/service-grid";
import { BrandMarquee } from "@/components/marketing/brand-marquee";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { QuotePanel } from "@/components/marketing/quote-panel";
import { FinalCta } from "@/components/marketing/final-cta";
import { TrustBar } from "@/components/marketing/trust-bar";
import { ImageBand } from "@/components/marketing/image-band";
import { FALLBACK_IMAGES, resolveSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tires Near You — Premium Tires & Performance Fitment" },
      {
        name: "description",
        content: "Premium tires, precision fitment, laser alignment and balancing. Performance service for drivers who expect more.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { telHref, hasPhone, contact } = useContactContent();
  const callHref = hasPhone ? telHref : undefined;

  const heroQuery = useQuery({
    queryKey: ["content", "hero"],
    queryFn: () => fetchContent("hero"),
    placeholderData: DEFAULTS.hero,
  });
  const { data: hero = DEFAULTS.hero } = heroQuery;
  const { data: sections = DEFAULTS.sections } = useQuery({
    queryKey: ["content", "sections"],
    queryFn: () => fetchContent("sections"),
    placeholderData: DEFAULTS.sections,
  });
  const { data: services = DEFAULTS.services } = useQuery({
    queryKey: ["content", "services"],
    queryFn: () => fetchContent("services"),
    placeholderData: DEFAULTS.services,
  });
  const { data: brands = DEFAULTS.brands } = useQuery({
    queryKey: ["content", "brands"],
    queryFn: () => fetchContent("brands"),
    placeholderData: DEFAULTS.brands,
  });
  const { data: process = DEFAULTS.process } = useQuery({
    queryKey: ["content", "process"],
    queryFn: () => fetchContent("process"),
    placeholderData: DEFAULTS.process,
  });
  const { data: testimonials = DEFAULTS.testimonials } = useQuery({
    queryKey: ["content", "testimonials"],
    queryFn: () => fetchContent("testimonials"),
    placeholderData: DEFAULTS.testimonials,
  });
  const { data: homepage = DEFAULTS.homepage } = useQuery({
    queryKey: ["content", "homepage"],
    queryFn: () => fetchContent("homepage"),
    placeholderData: DEFAULTS.homepage,
  });

  if (heroQuery.isPending && !heroQuery.data) {
    return (
      <>
        <SeoMeta />
        <HomePageSkeleton />
      </>
    );
  }

  return (
  <>
      <SeoMeta />
      <CinematicHero hero={hero} callHref={callHref} bleedUnderHeader />
      <div id="content">
        {sections.brands_enabled && <BrandMarquee brands={brands} priority />}
        <TrustBar />
        <StatStrip stats={hero.stats} variant="compact" />
        {sections.why_us_enabled && <ServiceGrid services={services} />}
        {sections.why_us_enabled && (
          <ImageBand
            src={resolveSiteImage(homepage.technician_band.image, FALLBACK_IMAGES.technician)}
            eyebrow={homepage.technician_band.eyebrow}
            title={homepage.technician_band.title}
            subtitle={homepage.technician_band.subtitle}
          />
        )}
        {sections.process_enabled && <ProcessSteps steps={process} />}
        {sections.why_us_enabled &&
          !sections.process_enabled &&
          (sections.process_enabled || sections.brands_enabled) && (
            <div
              className="section border-y border-border bg-card py-10 md:py-12"
              role="presentation"
              aria-hidden
            />
          )}
        {(sections.process_enabled || sections.brands_enabled) && (
          <ImageBand
            src={resolveSiteImage(homepage.inventory_band.image, FALLBACK_IMAGES.inventory)}
            eyebrow={homepage.inventory_band.eyebrow}
            title={homepage.inventory_band.title}
            subtitle={homepage.inventory_band.subtitle}
            align="right"
          />
        )}
        {sections.testimonials_enabled && <TestimonialCarousel testimonials={testimonials} />}
        {sections.quote_enabled && <QuotePanel />}
        {sections.final_cta_enabled && <FinalCta callHref={callHref} hours={contact.hours} />}
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import { SeoMeta } from "@/components/seo-meta";
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
import { useBrandSlideshow } from "@/hooks/use-brand-slideshow";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";
import { FALLBACK_IMAGES, resolveSiteImage } from "@/lib/site-images";
import { HomePageSubnav } from "@/components/marketing/home-page-subnav";
import { BRAND_FULL_TITLE } from "@/lib/brand";

type HomeSearch = { service?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const raw = search.service;
    return {
      service: typeof raw === "string" && raw.trim() ? raw.trim() : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: BRAND_FULL_TITLE },
      {
        name: "description",
        content: "Premium tyres, precision fitment, laser alignment and balancing. Performance service for drivers who expect more.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { service: serviceHint } = Route.useSearch();
  const cmsReady = usePublicContentReady();
  const { telHref, hasPhone, contact } = useContactContent();
  const callHref = hasPhone ? telHref : undefined;
  const { data: brandSlideshow, isLoading: slideshowLoading } = useBrandSlideshow();

  const heroQuery = useQuery({
    queryKey: ["content", "hero"],
    queryFn: () => fetchContent("hero"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.hero,
  });
  const { data: hero = DEFAULTS.hero } = heroQuery;
  const { data: sections = DEFAULTS.sections } = useQuery({
    queryKey: ["content", "sections"],
    queryFn: () => fetchContent("sections"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.sections,
  });
  const { data: services = DEFAULTS.services } = useQuery({
    queryKey: ["content", "services"],
    queryFn: () => fetchContent("services"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.services,
  });
  const { data: brands = DEFAULTS.brands } = useQuery({
    queryKey: ["content", "brands"],
    queryFn: () => fetchContent("brands"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.brands,
  });
  const { data: process = DEFAULTS.process } = useQuery({
    queryKey: ["content", "process"],
    queryFn: () => fetchContent("process"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.process,
  });
  const { data: testimonials = DEFAULTS.testimonials } = useQuery({
    queryKey: ["content", "testimonials"],
    queryFn: () => fetchContent("testimonials"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.testimonials,
  });
  const { data: homepage = DEFAULTS.homepage } = useQuery({
    queryKey: ["content", "homepage"],
    queryFn: () => fetchContent("homepage"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.homepage,
  });

  // Render immediately using placeholderData; avoid a dark-mode skeleton that
  // looks like a blank page during the initial ~1s of content fetches.
  void heroQuery;

  return (
    <>
      <SeoMeta />
      <CinematicHero hero={hero} callHref={callHref} bleedUnderHeader />
      <div id="content">
        <HomePageSubnav sections={sections} />
        {sections.brands_enabled && <BrandMarquee brands={brands} priority />}
        <TrustBar />
        <StatStrip stats={hero.stats} variant="compact" />
        {sections.why_us_enabled && (
          <div className="section-below-fold">
            <ServiceGrid services={services} />
          </div>
        )}
        {sections.why_us_enabled && (
          <div className="section-below-fold">
          <ImageBand
            src={resolveSiteImage(homepage.technician_band.image, FALLBACK_IMAGES.technician)}
            eyebrow={homepage.technician_band.eyebrow}
            title={homepage.technician_band.title}
            subtitle={homepage.technician_band.subtitle}
          />
          </div>
        )}
        {sections.process_enabled && (
          <div className="section-below-fold">
            <ProcessSteps steps={process} />
          </div>
        )}
        {sections.why_us_enabled &&
          !sections.process_enabled &&
          sections.brands_enabled && (
            <div
              className="section border-y border-border bg-card py-10 md:py-12"
              role="presentation"
              aria-hidden
            />
          )}
        {(sections.process_enabled || sections.brands_enabled) && (
          <div id="inventory-band">
          <ImageBand
            src={resolveSiteImage(homepage.inventory_band.image, FALLBACK_IMAGES.inventory)}
            slideshowSlides={brandSlideshow?.slides}
            slideshowSettings={brandSlideshow?.settings}
            slideshowLoading={slideshowLoading}
            eyebrow={homepage.inventory_band.eyebrow}
            title={homepage.inventory_band.title}
            subtitle={homepage.inventory_band.subtitle}
            align="left"
          />
          </div>
        )}
        {sections.testimonials_enabled && (
          <div className="section-below-fold">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        )}
        {sections.quote_enabled && <QuotePanel serviceHint={serviceHint} />}
        {sections.final_cta_enabled && <FinalCta callHref={callHref} hours={contact.hours} />}
      </div>
    </>
  );
}

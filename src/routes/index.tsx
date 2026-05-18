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
import mechanic from "@/assets/mechanic.jpg";
import tireStack from "@/assets/tire-stack.jpg";

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
        <StatStrip stats={hero.stats} />
        <TrustBar />
        {sections.why_us_enabled && <ServiceGrid services={services} />}
        {sections.why_us_enabled && (
          <ImageBand
            src={mechanic}
            eyebrow="Craft"
            title="Technicians who care"
            subtitle="Factory-spec torque, laser alignment, and a full safety check on every job."
          />
        )}
        {sections.brands_enabled && <BrandMarquee brands={brands} />}
        {sections.brands_enabled && sections.process_enabled && (
          <ImageBand
            src={tireStack}
            eyebrow="Inventory"
            title="Premium brands in stock"
            subtitle="From daily commuters to performance builds — honest recommendations, no pressure."
            align="right"
          />
        )}
        {sections.process_enabled && <ProcessSteps steps={process} />}
        {sections.testimonials_enabled && <TestimonialCarousel testimonials={testimonials} />}
        {sections.quote_enabled && <QuotePanel />}
        {sections.final_cta_enabled && <FinalCta callHref={callHref} hours={contact.hours} />}
      </div>
    </>
  );
}

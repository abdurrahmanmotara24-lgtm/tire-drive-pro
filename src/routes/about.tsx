import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { FALLBACK_IMAGES, resolveSiteImage } from "@/lib/site-images";
import { PageIntro } from "@/components/marketing/page-intro";
import { SeoMeta } from "@/components/seo-meta";
import { useReveal } from "@/hooks/use-reveal";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tires Near You" },
      { name: "description", content: "Premium tire fitment centre built on craft, honesty, and performance." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const cmsReady = usePublicContentReady();
  const { data: about = DEFAULTS.about } = useQuery({
    queryKey: ["content", "about"],
    queryFn: () => fetchContent("about"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.about,
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
  const bannerImage = resolveSiteImage(
    homepage.about_banner_image || homepage.inventory_band.image,
    FALLBACK_IMAGES.inventory,
  );
  const reveal = useReveal<HTMLElement>();

  return (
    <>
      <SeoMeta title="About — Tires Near You" description="Premium tire fitment centre built on craft, honesty, and performance." />
      <PageIntro eyebrow="About" title={about.headline} subtitle={about.intro} />
      <section ref={reveal.ref} className={`section ${reveal.className}`}>
        <div className="container-tny grid items-center gap-12 lg:grid-cols-2">
          <div className="hover-img-zoom rounded-sm">
            <img
              src={storyImage}
              alt="Technician at work"
              width={1200}
              height={900}
              loading="eager"
              decoding="async"
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Our story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{about.story}</p>
            <Link
              to="/contact"
              className="hover-link hover-icon-bump mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary"
            >
              Get in touch <ArrowRight className="icon-bump h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section-dark section border-t border-border">
        <div className="container-tny">
          <div className="hover-img-zoom mb-12 rounded-sm">
            <img
              src={bannerImage}
              alt="Premium tires"
              width={1200}
              height={500}
              loading="lazy"
              className="aspect-[21/9] w-full rounded-sm object-cover opacity-90"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <div key={v.title} className="hover-process border-l-2 border-primary pl-4">
                <h3 className="font-display text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-primary py-14 text-center">
        <div className="container-tny">
          <h2 className="font-display text-3xl text-primary-foreground">Experience the difference</h2>
          <a
            href="/#quote"
            className="hover-btn-primary mt-6 inline-flex rounded-sm bg-background px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary"
          >
            Request a quote
          </a>
        </div>
      </section>
    </>
  );
}

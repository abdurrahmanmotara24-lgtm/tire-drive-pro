import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/marketing/page-intro";
import { ContactPanel } from "@/components/marketing/contact-panel";
import { useContactContent } from "@/hooks/use-contact-content";
import { SeoMeta } from "@/components/seo-meta";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: brandPageTitle("Contact") },
      { name: "description", content: "Call, email, or message our fitment team." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { contact } = useContactContent();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.address || "tyre shop")}&output=embed`;

  return (
    <>
      <SeoMeta title={brandPageTitle("Contact")} description="Call, email, or message our fitment team." />
      <PageIntro
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Questions, quotes, or same-day booking — we're here to help."
      />
      <ContactPanel />
      <section className="container-tny pb-16">
        <div className="overflow-hidden rounded-sm border border-border">
          <iframe
            title={`Map to ${BRAND_NAME}`}
            src={mapSrc}
            className="h-[min(360px,50vh)] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

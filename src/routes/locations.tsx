import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/site-content";
import { resolvePublicStore } from "@/lib/store";
import { PageIntro } from "@/components/marketing/page-intro";
import { BranchCard } from "@/components/marketing/branch-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeoMeta } from "@/components/seo-meta";
import { LocalBusinessJsonLd } from "@/components/local-business-json-ld";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";
import { useContactContent } from "@/hooks/use-contact-content";
import { brandPageTitle } from "@/lib/brand";

const PAGE_TITLE = brandPageTitle("Visit us");
const PAGE_DESC = "Address, hours, directions, and map for our fitment centre.";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: Locations,
});

function LocationSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <div className="grid lg:grid-cols-2">
        <div className="space-y-3 p-8">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-[280px]" />
      </div>
    </div>
  );
}

function Locations() {
  const cmsReady = usePublicContentReady();
  const { contact } = useContactContent();
  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["locations", "public"],
    queryFn: () => fetchLocations(false),
    enabled: cmsReady,
  });

  const store = useMemo(() => resolvePublicStore(stores, contact), [stores, contact]);

  return (
    <>
      <SeoMeta title={PAGE_TITLE} description={PAGE_DESC} />
      <LocalBusinessJsonLd />
      <PageIntro
        eyebrow="Visit us"
        title="Our store"
        subtitle="Drive in for fitment, alignment, and same-day service — one convenient location."
      />
      <section className="section">
        <div className="container-tny space-y-8">
          {isLoading && <LocationSkeleton />}
          {!isLoading && !store && (
            <p className="rounded-sm border border-border bg-card p-10 text-center text-muted-foreground">
              Store details coming soon.{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Contact us
              </Link>{" "}
              for directions and hours.
            </p>
          )}
          {!isLoading && store && <BranchCard branch={store} />}
          {!isLoading && store && (
            <p className="text-center text-sm text-muted-foreground">
              Need to reach us? See{" "}
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                contact
              </Link>{" "}
              or{" "}
              <Link to="/hours" className="font-semibold text-primary hover:underline">
                opening hours
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </>
  );
}

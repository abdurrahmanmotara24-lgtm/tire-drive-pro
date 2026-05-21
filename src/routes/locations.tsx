import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/site-content";
import { PageIntro } from "@/components/marketing/page-intro";
import { BranchCard } from "@/components/marketing/branch-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeoMeta } from "@/components/seo-meta";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Tires Near You" },
      { name: "description", content: "Find your nearest premium fitment centre." },
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
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["locations", "public"],
    queryFn: () => fetchLocations(false),
    enabled: cmsReady,
  });

  return (
    <>
      <SeoMeta title="Locations — Tires Near You" description="Find your nearest premium fitment centre." />
      <PageIntro
        eyebrow="Locations"
        title="Our branches"
        subtitle="Find your nearest fitment centre and drive in today."
      />
      <section className="section">
        <div className="container-tny space-y-8">
          {isLoading && Array.from({ length: 2 }).map((_, i) => <LocationSkeleton key={i} />)}
          {!isLoading && branches.length === 0 && (
            <p className="rounded-sm border border-border bg-card p-10 text-center text-muted-foreground">
              Branches coming soon — contact us for service areas.
            </p>
          )}
          {!isLoading && branches.map((b) => <BranchCard key={b.id} branch={b} />)}
        </div>
      </section>
    </>
  );
}

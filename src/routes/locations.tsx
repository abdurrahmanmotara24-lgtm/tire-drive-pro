import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Clock } from "lucide-react";
import { fetchLocations } from "@/lib/site-content";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Tires Near You" },
      { name: "description", content: "Find a Tires Near You fitment centre near you. Multiple branches, expert teams." },
      { property: "og:title", content: "Our Locations — Tires Near You" },
      { property: "og:description", content: "Find your nearest branch." },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: Locations,
});

function Locations() {
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["locations", "public"],
    queryFn: () => fetchLocations(false),
  });

  return (
    <>
      <section className="relative isolate overflow-hidden -mt-14 pt-14 bg-hero-gradient">
        <div className="container-tny py-12 text-center text-primary-foreground lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Locations</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">Our branches</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            Find your nearest fitment centre and drop in today.
          </p>
        </div>
      </section>

      <section className="container-tny section space-y-6">
        {!isLoading && branches.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No branches listed yet — please check back soon.
          </div>
        )}
        {branches.map((b) => {
          const mapQ = b.address || b.name;
          const mapSrc = b.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(mapQ)}&output=embed`;
          const directions = `https://www.google.com/maps?q=${encodeURIComponent(mapQ)}`;
          const tel = b.phone ? `tel:${b.phone.replace(/[^+\d]/g, "")}` : undefined;
          return (
            <div key={b.id} className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:grid-cols-2">
              <div className="p-6">
                <h2 className="text-lg font-bold">{b.name}</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-foreground">
                  {b.address && <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-brand-red" />{b.address}</li>}
                  {b.phone && <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 text-brand-red" /><a href={tel} className="hover:text-brand-red">{b.phone}</a></li>}
                  {b.hours && <li className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 text-brand-red" />{b.hours}</li>}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a href={directions} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105">Get Directions</a>
                  {tel && <a href={tel} className="inline-flex rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-brand-red-foreground shadow-red transition-transform hover:scale-105">Call Branch</a>}
                </div>
              </div>
              <iframe
                title={b.name}
                src={mapSrc}
                className="h-[260px] w-full border-0 lg:h-full"
                loading="lazy"
              />
            </div>
          );
        })}
      </section>
    </>
  );
}

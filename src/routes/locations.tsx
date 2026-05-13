import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";

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

const branches = [
  { name: "Main Street Branch", address: "123 Main Street, Your City", phone: "+1 (000) 000-0000", hours: "Mon–Sat 8:00–18:00", mapQ: "tire+shop+main+street" },
  { name: "Northside Branch", address: "45 North Avenue, Your City", phone: "+1 (000) 000-1111", hours: "Mon–Sat 8:00–18:00", mapQ: "tire+shop+north" },
  { name: "Westgate Branch", address: "9 Westgate Road, Your City", phone: "+1 (000) 000-2222", hours: "Mon–Sat 8:00–18:00", mapQ: "tire+shop+west" },
];

function Locations() {
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
        {branches.map((b) => (
          <div key={b.name} className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-soft lg:grid-cols-2">
            <div className="p-6">
              <h2 className="text-lg font-bold">{b.name}</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground">
                <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-brand-red" />{b.address}</li>
                <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 text-brand-red" /><a href={`tel:${b.phone}`} className="hover:text-brand-red">{b.phone}</a></li>
                <li className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 text-brand-red" />{b.hours}</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a href={`https://www.google.com/maps?q=${b.mapQ}`} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105">Get Directions</a>
                <a href={`tel:${b.phone}`} className="inline-flex rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-brand-red-foreground shadow-red transition-transform hover:scale-105">Call Branch</a>
              </div>
            </div>
            <iframe
              title={b.name}
              src={`https://www.google.com/maps?q=${b.mapQ}&output=embed`}
              className="h-[260px] w-full border-0 lg:h-full"
              loading="lazy"
            />
          </div>
        ))}
      </section>
    </>
  );
}

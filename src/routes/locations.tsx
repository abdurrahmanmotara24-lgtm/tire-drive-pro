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
      <section className="bg-hero-gradient py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">Our Locations</h1>
          <p className="mt-3 text-lg text-primary-foreground/90">Find your nearest fitment centre and drop in today.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        {branches.map((b) => (
          <div key={b.name} className="grid gap-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-extrabold">{b.name}</h2>
              <ul className="mt-6 space-y-3 text-foreground">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-brand-red" />{b.address}</li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 text-brand-red" /><a href={`tel:${b.phone}`} className="hover:text-brand-red">{b.phone}</a></li>
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 text-brand-red" />{b.hours}</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a href={`https://www.google.com/maps?q=${b.mapQ}`} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Get Directions</a>
                <a href={`tel:${b.phone}`} className="inline-flex rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-brand-red-foreground">Call Branch</a>
              </div>
            </div>
            <iframe
              title={b.name}
              src={`https://www.google.com/maps?q=${b.mapQ}&output=embed`}
              className="h-[320px] w-full border-0 lg:h-full"
              loading="lazy"
            />
          </div>
        ))}
      </section>
    </>
  );
}

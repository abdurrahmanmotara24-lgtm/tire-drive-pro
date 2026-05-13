import { createFileRoute } from "@tanstack/react-router";
import { Target, Heart, Users, Award } from "lucide-react";
import mechanic from "@/assets/mechanic.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tires Near You" },
      { name: "description", content: "Family-owned tire and fitment centre serving local drivers with honest pricing and expert service." },
      { property: "og:title", content: "About Tires Near You" },
      { property: "og:description", content: "Honest pricing. Expert fitment. Trusted by thousands." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Target, title: "Our Mission", text: "Make safer driving accessible with premium tires and honest service." },
  { icon: Heart, title: "Our Values", text: "Integrity, expertise, and care for every customer who walks in." },
  { icon: Users, title: "Our Team", text: "Certified technicians with decades of automotive experience." },
  { icon: Award, title: "Our Promise", text: "If we wouldn't put it on our own car, we won't sell it to you." },
];

function About() {
  return (
    <>
      <section className="relative isolate overflow-hidden -mt-14 pt-14 bg-hero-gradient">
        <div className="container-tny py-12 text-center text-primary-foreground lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">About Us</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Built on trust & expertise
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">
            A local fitment centre built on trust, expertise, and a love for what we do.
          </p>
        </div>
      </section>

      <section className="container-tny section">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <img
            src={mechanic}
            alt="Our team at work"
            width={1200}
            height={900}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-elegant lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Our Story</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Drivers trust us. Here's why.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tires Near You started with a simple goal: give every driver access to premium tires at fair prices, fitted by people who actually care. From everyday commuters to performance enthusiasts, we've built our reputation one satisfied customer at a time.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Today we stock all the leading brands, run state-of-the-art alignment and balancing equipment, and back every fitment with a full safety inspection — at no extra charge.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-12 lg:py-16">
        <div className="container-tny">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-background p-5 ring-1 ring-border shadow-soft transition-transform hover:-translate-y-0.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-brand-red-foreground">
                  <v.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-bold">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

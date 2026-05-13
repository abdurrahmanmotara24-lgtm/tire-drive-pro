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
  { icon: Heart, title: "Our Values", text: "Integrity, expertise, and care for every customer who walks through our doors." },
  { icon: Users, title: "Our Team", text: "Certified technicians with decades of combined automotive experience." },
  { icon: Award, title: "Our Promise", text: "If we wouldn't put it on our own car, we won't sell it to you." },
];

function About() {
  return (
    <>
      <section className="bg-hero-gradient py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">About Tires Near You</h1>
          <p className="mt-4 text-lg text-primary-foreground/90">A local fitment centre built on trust, expertise, and a love for what we do.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <img src={mechanic} alt="Our team at work" width={1200} height={900} loading="lazy" className="rounded-3xl object-cover shadow-elegant" />
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Drivers trust us. Here's why.</h2>
            <p className="mt-4 text-muted-foreground">
              Tires Near You started with a simple goal: give every driver access to premium tires at fair prices, fitted by people who actually care. From everyday commuters to performance enthusiasts, we've built our reputation one satisfied customer at a time.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today we stock all the leading brands, run state-of-the-art alignment and balancing equipment, and back every fitment with a full safety inspection — at no extra charge.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-background p-6 shadow-sm ring-1 ring-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-brand-red-foreground"><v.icon className="h-6 w-6" /></div>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

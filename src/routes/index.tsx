import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Wrench, Gauge, Truck, Star, Phone, ArrowRight, BadgeCheck } from "lucide-react";
import heroTire from "@/assets/hero-tire.jpg";
import tireStack from "@/assets/tire-stack.jpg";
import mechanic from "@/assets/mechanic.jpg";
import { QuoteForm } from "@/components/quote-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tires Near You — Premium Tires & Fitment Centre" },
      { name: "description", content: "Top brand tires, expert fitment, wheel alignment & balancing. Get a free quote today." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const promos = [
  { title: "Buy 3 Get 1 FREE", desc: "On selected premium tire brands.", tag: "Limited Time" },
  { title: "Free Wheel Alignment", desc: "With every set of 4 tires fitted.", tag: "This Month" },
  { title: "10% Off SUV Tires", desc: "Save big on full SUV tire sets.", tag: "Hot Deal" },
];

const brands = ["Michelin", "Bridgestone", "Goodyear", "Pirelli", "Continental", "Dunlop", "Hankook", "Yokohama"];

const services = [
  { icon: Wrench, title: "Expert Fitment", desc: "Certified technicians and modern equipment." },
  { icon: Gauge, title: "Wheel Alignment", desc: "Precision laser alignment for safer drives." },
  { icon: ShieldCheck, title: "Quality Guarantee", desc: "Genuine tires with full manufacturer warranty." },
  { icon: Truck, title: "Mobile Service", desc: "We come to you for select services." },
];

const reviews = [
  { name: "Sarah M.", text: "Quick service and the best prices in town. Got my tires fitted in 30 minutes!", rating: 5 },
  { name: "James O.", text: "Professional team. They explained every option and didn't upsell.", rating: 5 },
  { name: "Priya K.", text: "Honest, fast, friendly. My new go-to tire shop.", rating: 5 },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-red-foreground shadow-red">
              <BadgeCheck className="h-4 w-4" /> #1 Local Fitment Centre
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-primary-foreground text-balance sm:text-5xl lg:text-6xl">
              Premium Tires.<br />
              <span className="text-brand-red">Unbeatable Prices.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/90">
              Top brand tires, expert fitment, and same-day service. Drive safer, save more — with the team your neighbours trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 font-bold text-brand-red-foreground shadow-red transition-transform hover:scale-105">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </a>
              <a href="tel:+10000000000" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-bold text-primary transition-transform hover:scale-105">
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[["10K+", "Happy drivers"], ["20+", "Top brands"], ["4.9★", "Customer rating"]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-2xl font-extrabold text-brand-red">{k}</div>
                  <div className="text-xs text-primary-foreground/80">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={heroTire} alt="Premium car tire on alloy wheel" width={1600} height={1024} className="h-[420px] w-full rounded-3xl object-cover shadow-elegant lg:h-[520px]" />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-background p-4 shadow-elegant ring-1 ring-border sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-brand-red-foreground"><Star className="h-6 w-6" /></div>
                <div>
                  <div className="text-sm font-bold text-primary">4.9 / 5 Rating</div>
                  <div className="text-xs text-muted-foreground">From 1,200+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">This Month's Specials</h2>
          <p className="mt-3 text-muted-foreground">Limited-time offers you don't want to miss.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {promos.map((p) => (
            <div key={p.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-elegant">
              <span className="inline-block rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-red-foreground">{p.tag}</span>
              <h3 className="mt-4 text-2xl font-extrabold">{p.title}</h3>
              <p className="mt-2 text-muted-foreground">{p.desc}</p>
              <a href="#quote" className="mt-6 inline-flex items-center gap-1 font-bold text-brand-red hover:gap-2 transition-all">
                Claim offer <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Featured Tire Brands</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {brands.map((b) => (
              <div key={b} className="flex h-20 items-center justify-center rounded-xl bg-background font-bold text-primary shadow-sm ring-1 ring-border">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <img src={mechanic} alt="Professional mechanic inspecting a tire" width={1200} height={900} loading="lazy" className="rounded-3xl object-cover shadow-elegant" />
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Why Drivers Choose Us</h2>
            <p className="mt-4 text-muted-foreground">More than tires — we deliver peace of mind on every kilometre.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red text-brand-red-foreground">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">What Our Customers Say</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-background p-8 shadow-sm ring-1 ring-border">
                <div className="flex gap-1 text-brand-red">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="mt-4 text-foreground">"{r.text}"</p>
                <div className="mt-6 font-bold text-primary">— {r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE / CTA */}
      <section id="quote" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Roll?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get a fast, no-obligation quote on the perfect set of tires for your vehicle. Our team responds within minutes during business hours.
            </p>
            <ul className="mt-6 space-y-3">
              {["Same-day fitment available", "Best price guarantee", "Free safety inspection"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-brand-red" />
                  <span className="font-semibold">{f}</span>
                </li>
              ))}
            </ul>
            <img src={tireStack} alt="Tire inventory" width={1200} height={900} loading="lazy" className="mt-8 hidden rounded-2xl object-cover lg:block" />
          </div>
          <QuoteForm />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-accent-gradient py-16 text-brand-red-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold text-brand-red-foreground sm:text-4xl">Need tires today?</h2>
            <p className="mt-2 text-brand-red-foreground/90">Call us now or visit your nearest branch.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+10000000000" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-bold text-brand-red"><Phone className="h-4 w-4" /> Call Now</a>
            <Link to="/locations" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Find a Branch <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

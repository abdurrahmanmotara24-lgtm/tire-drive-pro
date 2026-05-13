import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Wrench, Gauge, Truck, Star, Phone, ArrowRight, BadgeCheck } from "lucide-react";
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
  { title: "Buy 3 Get 1 Free", desc: "On selected premium brands.", tag: "Limited" },
  { title: "Free Alignment", desc: "With every set of 4 tires.", tag: "This Month" },
  { title: "10% Off SUV Tires", desc: "Save big on full sets.", tag: "Hot Deal" },
];

const brands = ["Michelin", "Bridgestone", "Goodyear", "Pirelli", "Continental", "Dunlop", "Hankook", "Yokohama"];

const services = [
  { icon: Wrench, title: "Expert Fitment", desc: "Certified technicians, modern equipment." },
  { icon: Gauge, title: "Wheel Alignment", desc: "Precision laser alignment for safer drives." },
  { icon: ShieldCheck, title: "Quality Guarantee", desc: "Genuine tires with full warranty." },
  { icon: Truck, title: "Mobile Service", desc: "We come to you for select services." },
];

const reviews = [
  { name: "Sarah M.", text: "Quick service and the best prices in town. Fitted in 30 minutes.", rating: 5 },
  { name: "James O.", text: "Professional team. Explained every option, no upsell.", rating: 5 },
  { name: "Priya K.", text: "Honest, fast, friendly. My new go-to tire shop.", rating: 5 },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden -mt-14 pt-14">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${tireStack})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/95" aria-hidden />
        <div className="container-tny grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-24">
          <div className="lg:col-span-7 text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-red-foreground shadow-red">
              <BadgeCheck className="h-3.5 w-3.5" /> #1 Local Fitment Centre
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Premium Tires.
              <br />
              <span className="text-brand-red">Unbeatable Prices.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Top brand tires, expert fitment, and same-day service. Drive safer, save more — with the team your neighbours trust.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="#quote"
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red-foreground shadow-red transition-transform hover:scale-105"
              >
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+10000000000"
                className="inline-flex items-center gap-2 rounded-full bg-background/95 px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:scale-105"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
              {[["10K+", "Happy drivers"], ["20+", "Top brands"], ["4.9★", "Customer rating"]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xl font-bold text-brand-red sm:text-2xl">{k}</div>
                  <div className="text-[11px] uppercase tracking-wider text-primary-foreground/75">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-brand-red-foreground">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">4.9 / 5 Rating</div>
                  <div className="text-xs text-primary-foreground/75">From 1,200+ reviews</div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {services.slice(0, 3).map((s) => (
                  <div key={s.title} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-red text-brand-red-foreground">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary-foreground">{s.title}</div>
                      <div className="text-xs text-primary-foreground/75">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="container-tny section">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">This Month</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Specials You'll Love</h2>
          </div>
          <a href="#quote" className="hidden text-sm font-semibold text-primary hover:text-brand-red sm:inline-flex sm:items-center sm:gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-elegant"
            >
              <span className="inline-block rounded-full bg-brand-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-red">
                {p.tag}
              </span>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <a href="#quote" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red transition-all hover:gap-2">
                Claim offer <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="border-y border-border bg-secondary/60 py-10">
        <div className="container-tny">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted Brands We Stock
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {brands.map((b) => (
              <div
                key={b}
                className="flex h-12 items-center justify-center rounded-lg bg-background text-sm font-semibold text-primary ring-1 ring-border transition-colors hover:text-brand-red"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-tny section">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <img
              src={mechanic}
              alt="Professional mechanic inspecting a tire"
              width={1200}
              height={900}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-elegant"
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Why Us</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Drivers Trust Us</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              More than tires — we deliver peace of mind on every kilometre.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.title} className="flex gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-red/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-red text-brand-red-foreground">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{s.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/60 py-12 lg:py-16">
        <div className="container-tny">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Reviews</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">What Drivers Say</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-xl bg-background p-5 ring-1 ring-border shadow-soft">
                <div className="flex gap-0.5 text-brand-red">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground">"{r.text}"</p>
                <div className="mt-4 text-sm font-semibold text-primary">— {r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE / CTA */}
      <section id="quote" className="container-tny section">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Free Quote</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Ready to Roll?</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Fast, no-obligation quote on the perfect tires for your vehicle. Replies in minutes during business hours.
            </p>
            <ul className="mt-5 space-y-2.5">
              {["Same-day fitment available", "Best price guarantee", "Free safety inspection"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <BadgeCheck className="h-4 w-4 text-brand-red" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <QuoteForm />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-accent-gradient py-10 text-brand-red-foreground">
        <div className="container-tny flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-brand-red-foreground sm:text-2xl">Need tires today?</h2>
            <p className="mt-1 text-sm text-brand-red-foreground/90">Call us now or visit your nearest branch.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            <a href="tel:+10000000000" className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-brand-red">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <Link to="/locations" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Find a Branch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

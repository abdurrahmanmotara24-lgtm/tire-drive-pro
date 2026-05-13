import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Clock, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tires Near You" },
      { name: "description", content: "Call, email or message us on WhatsApp. Visit our fitment centre — open Mon to Sat." },
      { property: "og:title", content: "Contact Tires Near You" },
      { property: "og:description", content: "Get in touch — call, email, or WhatsApp." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <>
      <section className="relative isolate overflow-hidden -mt-14 pt-14 bg-hero-gradient">
        <div className="container-tny py-12 text-center text-primary-foreground lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Contact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            We're here to help — drop a message or visit us today.
          </p>
        </div>
      </section>

      <section className="container-tny section">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {[
              { icon: Phone, title: "Phone", value: "+1 (000) 000-0000", href: "tel:+10000000000" },
              { icon: Mail, title: "Email", value: "hello@tiresnearyou.com", href: "mailto:hello@tiresnearyou.com" },
              { icon: MessageCircle, title: "WhatsApp", value: "Chat with us", href: "https://wa.me/10000000000" },
              { icon: Clock, title: "Hours", value: "Mon–Sat: 8:00–18:00 · Sun: Closed" },
              { icon: MapPin, title: "Address", value: "123 Main Street, Your City" },
            ].map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-soft"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-red text-brand-red-foreground">
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
            <h2 className="text-lg font-bold">Send us a message</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold">Name</label>
                <input name="name" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary" />
                {errors.name && <p className="mt-1 text-[11px] text-brand-red">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold">Email</label>
                <input name="email" type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary" />
                {errors.email && <p className="mt-1 text-[11px] text-brand-red">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold">Message</label>
              <textarea name="message" rows={4} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary" />
              {errors.message && <p className="mt-1 text-[11px] text-brand-red">{errors.message}</p>}
            </div>
            <button type="submit" className="mt-1 inline-flex justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-brand-red-foreground shadow-red transition-transform hover:scale-[1.02]">
              Send Message
            </button>
            {sent && <p className="text-xs font-semibold text-primary">✓ Message sent — we'll be in touch soon.</p>}
          </form>
        </div>
      </section>

      <section className="container-tny pb-12">
        <div className="overflow-hidden rounded-2xl ring-1 ring-border shadow-soft">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=tire+shop&output=embed"
            className="h-[320px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

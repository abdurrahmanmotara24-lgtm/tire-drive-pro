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
      <section className="bg-hero-gradient py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 text-lg text-primary-foreground/90">We're here to help — drop a message or visit us today.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { icon: Phone, title: "Phone", value: "+1 (000) 000-0000", href: "tel:+10000000000" },
              { icon: Mail, title: "Email", value: "hello@tiresnearyou.com", href: "mailto:hello@tiresnearyou.com" },
              { icon: MessageCircle, title: "WhatsApp", value: "Chat with us", href: "https://wa.me/10000000000" },
              { icon: Clock, title: "Hours", value: "Mon–Sat: 8:00 – 18:00 · Sun: Closed" },
              { icon: MapPin, title: "Address", value: "123 Main Street, Your City" },
            ].map((c) => (
              <a key={c.title} href={c.href} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red text-brand-red-foreground"><c.icon className="h-6 w-6" /></div>
                <div>
                  <div className="font-bold text-primary">{c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-2 grid gap-4 rounded-2xl bg-card p-8 shadow-elegant ring-1 ring-border">
            <h2 className="text-2xl font-extrabold">Send us a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input name="name" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
                {errors.name && <p className="mt-1 text-xs text-brand-red">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input name="email" type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
                {errors.email && <p className="mt-1 text-xs text-brand-red">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <textarea name="message" rows={5} className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" />
              {errors.message && <p className="mt-1 text-xs text-brand-red">{errors.message}</p>}
            </div>
            <button type="submit" className="inline-flex justify-center rounded-full bg-brand-red px-6 py-3 font-bold text-brand-red-foreground shadow-red transition-transform hover:scale-[1.02]">
              Send Message
            </button>
            {sent && <p className="text-sm font-semibold text-primary">✓ Message sent — we'll be in touch soon.</p>}
          </form>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-elegant ring-1 ring-border">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=tire+shop&output=embed"
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

import { useRef, useState } from "react";
import { z } from "zod";
import { Phone, Mail, Clock, MessageCircle, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicField } from "@/components/public-field";
import { PublicButton } from "@/components/public-button";
import { useContactContent } from "@/hooks/use-contact-content";
import { submitLead } from "@/lib/site-content";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(1, "Message required").max(1000),
});

type Card = { icon: LucideIcon; title: string; value: string; href?: string };

export function ContactPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const { contact, telHref, waHref, waQuoteHref, mailHref } = useContactContent();

  const cards: Card[] = [
    { icon: Phone, title: "Phone", value: contact.phone, href: telHref },
    { icon: Mail, title: "Email", value: contact.email, href: mailHref },
    { icon: MessageCircle, title: "WhatsApp", value: "Get a quote", href: waQuoteHref ?? waHref },
    { icon: Clock, title: "Hours", value: contact.hours },
    { icon: MapPin, title: "Address", value: contact.address },
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    setErrorMsg("");
    setStatus("submitting");
    try {
      await submitLead({
        type: "contact",
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      });
      setStatus("ok");
      formRef.current?.reset();
    } catch (err) {
      setStatus("err");
      setErrorMsg((err as Error).message || "Could not send. Try email or phone instead.");
    }
  }

  return (
    <section className="section">
      <div className="container-tny grid gap-8 lg:grid-cols-3">
        <div className="space-y-3">
          {cards.map((c) => {
            const inner = (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 text-primary transition-colors hover:bg-primary/25">
                  <c.icon className="icon-bump h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </div>
              </>
            );
            const cls =
              "hover-lift hover-icon-bump flex items-start gap-3 rounded-sm border border-border bg-card p-4 hover:border-primary/40";
            return c.href ? (
              <a key={c.title} href={c.href} className={cls}>
                {inner}
              </a>
            ) : (
              <div key={c.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
        <form ref={formRef} onSubmit={onSubmit} className="hover-glass glass-panel grid gap-3 rounded-sm p-6 lg:col-span-2">
          <h2 className="font-display text-xl">Send a message</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <PublicField id="contact-name" label="Name" name="name" error={errors.name} disabled={status === "submitting"} />
            <PublicField id="contact-email" label="Email" name="email" type="email" error={errors.email} disabled={status === "submitting"} />
          </div>
          <PublicField id="contact-message" label="Message" name="message" as="textarea" error={errors.message} disabled={status === "submitting"} />
          <PublicButton type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send message"}
          </PublicButton>
          {status === "ok" && <p className="text-xs font-semibold text-primary">Message sent — we&apos;ll reply soon.</p>}
          {status === "err" && errorMsg && <p className="text-xs font-semibold text-destructive">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}

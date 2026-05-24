import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  const { contact, telHref, mailHref, waHref, hasPhone } = useContactContent();
  const { data: services = DEFAULTS.services } = useQuery({
    queryKey: ["content", "services"],
    queryFn: () => fetchContent("services"),
    staleTime: 60_000,
  });

  const socials = [
    { icon: Facebook, href: contact.facebook, label: "Facebook" },
    { icon: Instagram, href: contact.instagram, label: "Instagram" },
    { icon: Twitter, href: contact.twitter, label: "Twitter" },
  ].filter((s) => s.href);

  const serviceLinks = services.filter((s) => s.title.trim()).slice(0, 6);

  return (
    <footer className={cn("border-t border-border bg-card", className)}>
      <div className="container-tny py-8 md:py-10">
        <div
          className={cn(
            "grid gap-8",
            socials.length > 0
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10",
          )}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover-link">
                  About
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover-link">
                  Visit us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {serviceLinks.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Services</p>
              <ul className="mt-3 space-y-2 text-sm">
                {serviceLinks.map((s) => (
                  <li key={s.title}>
                    <Link to="/" search={{ service: s.title }} hash="quote" className="hover-link">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              {contact.phone && (
                <li className="flex gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {telHref ? (
                    <a href={telHref} className="hover-link">
                      {contact.phone}
                    </a>
                  ) : (
                    contact.phone
                  )}
                </li>
              )}
              {contact.email && (
                <li className="flex gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={mailHref} className="hover-link">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {contact.address}
                </li>
              )}
              {contact.hours && (
                <li className="flex gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  {contact.hours}
                </li>
              )}
            </ul>
          </div>
          {socials.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Follow</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="hover-social touch-target flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        {(hasPhone || waHref) && (
          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 sm:hidden">
            {hasPhone && telHref && (
              <a
                href={telHref}
                className="hover-btn-primary flex min-h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
            )}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="hover-btn-outline flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 text-sm font-bold uppercase tracking-wider"
              >
                <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
              </a>
            )}
          </div>
        )}
        <p className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground md:mt-8">
          © {new Date().getFullYear()} Tyres Near Me. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

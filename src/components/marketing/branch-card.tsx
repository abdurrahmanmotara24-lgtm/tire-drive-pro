import { MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";
import type { LocationRow } from "@/lib/site-content";
import { useContactContent } from "@/hooks/use-contact-content";
import { buildWaMeUrl, WHATSAPP_QUOTE_MESSAGE } from "@/lib/phone-utils";

export function BranchCard({ branch }: { branch: LocationRow }) {
  const { contact, waHref: siteWa, telHref: siteTel } = useContactContent();
  const mapQ = branch.address || branch.name;
  const mapSrc = branch.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(mapQ)}&output=embed`;
  const directions = `https://www.google.com/maps?q=${encodeURIComponent(mapQ)}`;
  const phone = branch.phone || contact.phone;
  const tel = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : siteTel;
  const storeWa =
    phone && siteWa
      ? buildWaMeUrl(phone, WHATSAPP_QUOTE_MESSAGE)
      : siteWa;

  return (
    <article className="hover-lift overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-colors hover:border-primary/30">
      <div className="hover-img-zoom grid lg:grid-cols-2">
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-2xl">{branch.name}</h2>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {branch.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {branch.address}
              </li>
            )}
            {phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {tel ? (
                  <a href={tel} className="hover-link">
                    {phone}
                  </a>
                ) : (
                  phone
                )}
              </li>
            )}
            {branch.hours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {branch.hours}
              </li>
            )}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className="hover-btn-primary inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden />
              Directions
            </a>
            {tel && (
              <a
                href={tel}
                className="hover-btn-outline inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                <Phone className="h-3.5 w-3.5 text-primary" aria-hidden />
                Call
              </a>
            )}
            {storeWa && (
              <a
                href={storeWa}
                target="_blank"
                rel="noreferrer"
                className="hover-btn-outline inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                <MessageCircle className="h-3.5 w-3.5 text-primary" aria-hidden />
                WhatsApp
              </a>
            )}
          </div>
        </div>
        <iframe title={branch.name} src={mapSrc} className="h-[min(280px,45vh)] w-full border-0 lg:h-full" loading="lazy" />
      </div>
    </article>
  );
}

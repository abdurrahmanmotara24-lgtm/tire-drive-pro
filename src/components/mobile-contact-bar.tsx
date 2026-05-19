import { Link } from "@tanstack/react-router";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";

export function MobileContactBar({ className }: { className?: string }) {
  const { telHref, waHref, hasPhone } = useContactContent();

  if (!hasPhone && !waHref) return null;

  return (
    <nav
      className={cn(
        "mobile-contact-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden",
        className,
      )}
      aria-label="Quick contact"
    >
      <div className="container-tny flex items-stretch gap-1 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {hasPhone && telHref && (
          <a
            href={telHref}
            className="mobile-contact-bar__action hover-btn-primary flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-sm bg-primary px-2 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            <span>Call</span>
          </a>
        )}
        <Link
          to="/"
          hash="quote"
          className="mobile-contact-bar__action hover-btn-outline flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-sm border border-border bg-card px-2 py-2 text-[0.65rem] font-bold uppercase tracking-wider"
        >
          <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>Quote</span>
        </Link>
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mobile-contact-bar__action hover-btn-outline flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-sm border border-border bg-card px-2 py-2 text-[0.65rem] font-bold uppercase tracking-wider"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </nav>
  );
}

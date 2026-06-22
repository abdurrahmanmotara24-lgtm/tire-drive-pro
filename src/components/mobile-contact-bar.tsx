import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { OpenNowChip } from "@/components/open-now-chip";
import { useSyncCssVar } from "@/hooks/use-sync-css-var";
import { cn } from "@/lib/utils";

export function MobileContactBar({ className }: { className?: string }) {
  const barRef = useRef<HTMLElement>(null);
  const { telHref, waQuoteHref, hasPhone } = useContactContent();

  useSyncCssVar(barRef, "--site-contact-bar-height", true);

  if (!hasPhone && !waQuoteHref) return null;

  return (
    <nav
      ref={barRef}
      className={cn(
        "mobile-contact-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden",
        className,
      )}
      aria-label="Quick contact"
    >
      <div className="container-tny flex flex-col gap-1.5 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-center">
          <OpenNowChip />
        </div>
        <div className="flex items-stretch gap-1.5">
          {hasPhone && telHref && (
            <a
              href={telHref}
              className="mobile-contact-bar__action hover-btn-primary flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-sm bg-primary px-2 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <span>Call</span>
            </a>
          )}
          <Link
            to="/"
            hash="quote"
            className="mobile-contact-bar__action hover-btn-outline flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-sm border border-border bg-card px-2 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>Quote</span>
          </Link>
          {waQuoteHref && (
            <a
              href={waQuoteHref}
              target="_blank"
              rel="noreferrer"
              className="mobile-contact-bar__action hover-btn-outline flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-sm border border-border bg-card px-2 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

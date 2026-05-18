import { Phone, MessageCircle } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { cn } from "@/lib/utils";

export function MobileContactBar() {
  const { telHref, waHref, hasPhone } = useContactContent();
  if (!hasPhone && !waHref) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
      )}
      aria-label="Quick contact"
    >
      <div className="container-tny flex gap-2 px-3 py-2">
        {hasPhone && telHref && (
          <a
            href={telHref}
            className="hover-btn-primary flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="hover-btn-outline flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm border border-border py-3 text-xs font-bold uppercase tracking-wider"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

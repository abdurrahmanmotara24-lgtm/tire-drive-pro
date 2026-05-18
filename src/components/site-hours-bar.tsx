import { Clock } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";

export function SiteHoursBar() {
  const { contact } = useContactContent();
  if (!contact.hours) return null;

  return (
    <div className="border-b border-border/60 bg-secondary/80 text-center text-xs text-muted-foreground">
      <div className="container-tny flex items-center justify-center gap-1.5 py-1.5">
        <Clock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <span>Family-owned fitment centre · {contact.hours}</span>
      </div>
    </div>
  );
}

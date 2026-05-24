import { Clock } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { getHoursStatusFromSchedule, normalizeHoursSchedule } from "@/lib/hours-schedule";
import { cn } from "@/lib/utils";

export function OpenNowChip({ className }: { className?: string }) {
  const { contact } = useContactContent();
  const status = getHoursStatusFromSchedule(normalizeHoursSchedule(contact.hours_schedule));
  if (status.open === null) return null;

  return (
    <span
      className={cn(
        "open-now-chip inline-flex max-w-[11rem] items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
        status.open
          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
      title={status.label}
    >
      <Clock className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{status.label}</span>
    </span>
  );
}

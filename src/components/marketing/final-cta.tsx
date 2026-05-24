import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Phone } from "lucide-react";
import { useContactContent } from "@/hooks/use-contact-content";
import { getHoursStatusFromSchedule, normalizeHoursSchedule } from "@/lib/hours-schedule";
import { cn } from "@/lib/utils";

type Props = { callHref?: string; hours?: string };

export function FinalCta({ callHref, hours }: Props) {
  const { contact } = useContactContent();
  const status = getHoursStatusFromSchedule(normalizeHoursSchedule(contact.hours_schedule));

  return (
    <section id="final-cta" className="bg-accent-gradient py-14">
      <div className="container-tny flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">Need tyres today?</h2>
          <p className="mt-2 text-primary-foreground/85">
            {hours ? `${hours} · ` : ""}
            Call or visit our store today.
          </p>
          {status.open !== null && (
            <p
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                status.open
                  ? "border-emerald-300/50 bg-emerald-500/20 text-emerald-50"
                  : "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground/90",
              )}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {status.label}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          {callHref && (
            <a
              href={callHref}
              className="hover-btn-primary hover-icon-bump inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-background px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary sm:w-auto"
            >
              <Phone className="icon-bump h-4 w-4" /> Call now
            </a>
          )}
          <Link
            to="/"
            hash="quote"
            className="hover-btn-outline hover-icon-bump inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-primary-foreground/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground sm:w-auto"
          >
            Get a quote <ArrowRight className="icon-bump h-4 w-4" />
          </Link>
          <Link
            to="/locations"
            className="hover-btn-outline inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-primary-foreground/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground/90 sm:w-auto"
          >
            Visit us
          </Link>
          <Link
            to="/hours"
            className="hover-btn-outline inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-primary-foreground/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground/90 sm:w-auto"
          >
            Hours
          </Link>
        </div>
      </div>
    </section>
  );
}

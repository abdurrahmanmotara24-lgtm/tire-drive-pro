import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import {
  DAY_KEYS,
  DAY_LABELS,
  formatHoursSummary,
  getHoursStatusFromSchedule,
  normalizeHoursSchedule,
  type DayKey,
} from "@/lib/hours-schedule";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";

export const Route = createFileRoute("/hours")({
  head: () => ({
    meta: [
      { title: brandPageTitle("Operating Hours") },
      { name: "description", content: `When we're open. Daily operating hours and current status for ${BRAND_NAME}.` },
      { property: "og:title", content: brandPageTitle("Operating Hours") },
      { property: "og:description", content: "When we're open. Daily operating hours and current status." },
    ],
  }),
  component: HoursPage,
});

const JS_DAY_TO_KEY: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function formatTime12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return m ? `${hour12}:${String(m).padStart(2, "0")} ${suffix}` : `${hour12} ${suffix}`;
}

function HoursPage() {
  const cmsReady = usePublicContentReady();
  const { data: contact = DEFAULTS.contact } = useQuery({
    queryKey: ["content", "contact"],
    queryFn: () => fetchContent("contact"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.contact,
  });

  const schedule = normalizeHoursSchedule(contact.hours_schedule);
  const status = getHoursStatusFromSchedule(schedule);
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];

  const statusTone =
    status.open === true
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      : status.open === false
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : "bg-muted text-muted-foreground border-border";

  return (
    <div>
      <PageHero
        eyebrow="Operating Hours"
        title="When we're open"
        subtitle={formatHoursSummary(schedule)}
      />

      <section className="container-tny py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className={cn("mb-8 flex items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-semibold uppercase tracking-wider", statusTone)}>
            <Clock className="h-4 w-4" aria-hidden />
            {status.label}
          </div>

          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {DAY_KEYS.map((key) => {
                const day = schedule[key];
                const isToday = key === todayKey;
                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 sm:px-6",
                      isToday && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm font-semibold sm:text-base", isToday && "text-primary")}>
                        {DAY_LABELS[key]}
                      </span>
                      {isToday && (
                        <span className="rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                          Today
                        </span>
                      )}
                    </div>
                    <span className={cn("text-sm tabular-nums sm:text-base", day.closed ? "text-muted-foreground" : "font-medium")}>
                      {day.closed ? "Closed" : `${formatTime12h(day.open)} – ${formatTime12h(day.close)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {contact.address && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Visit us at <span className="text-foreground">{contact.address}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

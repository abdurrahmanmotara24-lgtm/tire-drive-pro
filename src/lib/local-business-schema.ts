import { BRAND_NAME, BRAND_DEFAULT_EMAIL } from "@/lib/brand";
import { DAY_KEYS, normalizeHoursSchedule, type HoursSchedule } from "@/lib/hours-schedule";
import type { ContactContent, LocationRow } from "@/lib/site-content";

const SCHEMA_DAY = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
} as const;

function buildOpeningHours(schedule: HoursSchedule) {
  const specs: { dayOfWeek: string[]; opens: string; closes: string }[] = [];
  let groupStart: (typeof DAY_KEYS)[number] | null = null;
  let groupEnd: (typeof DAY_KEYS)[number] | null = null;
  let groupOpens = "";
  let groupCloses = "";

  const flush = () => {
    if (!groupStart || !groupEnd) return;
    const days: string[] = [];
    let active = false;
    for (const key of DAY_KEYS) {
      if (key === groupStart) active = true;
      if (active) days.push(SCHEMA_DAY[key]);
      if (key === groupEnd) break;
    }
    specs.push({ dayOfWeek: days, opens: groupOpens, closes: groupCloses });
    groupStart = null;
    groupEnd = null;
  };

  for (const key of DAY_KEYS) {
    const day = schedule[key];
    if (day.closed) {
      flush();
      continue;
    }
    if (groupStart && day.open === groupOpens && day.close === groupCloses) {
      groupEnd = key;
      continue;
    }
    flush();
    groupStart = key;
    groupEnd = key;
    groupOpens = day.open;
    groupCloses = day.close;
  }
  flush();
  return specs;
}

export type LocalBusinessSchemaInput = {
  siteUrl: string;
  contact: ContactContent;
  store: LocationRow | null;
  description?: string;
  image?: string;
};

/** Schema.org LocalBusiness + AutoRepair for rich results. */
export function buildLocalBusinessSchema({
  siteUrl,
  contact,
  store,
  description,
  image,
}: LocalBusinessSchemaInput) {
  const name = store?.name?.trim() || BRAND_NAME;
  const phone = (store?.phone || contact.phone || "").trim();
  const email = (store?.email || contact.email || BRAND_DEFAULT_EMAIL).trim();
  const address = (store?.address || contact.address || "").trim();
  const schedule = normalizeHoursSchedule(contact.hours_schedule);

  if (!address && !phone) return null;

  const openingHoursSpecification = buildOpeningHours(schedule).map((row) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: row.dayOfWeek,
    opens: row.opens,
    closes: row.closes,
  }));

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRepair"],
    "@id": `${siteUrl.replace(/\/$/, "")}/#business`,
    name,
    description:
      description?.trim() ||
      "Premium tyres, mount and balance, laser alignment, mag wheels, and fleet fitment with honest advice.",
    url: siteUrl.replace(/\/$/, "") || siteUrl,
    telephone: phone || undefined,
    email: email || undefined,
    image: image?.trim() || undefined,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: address,
          addressCountry: "AU",
        }
      : undefined,
    openingHoursSpecification: openingHoursSpecification.length ? openingHoursSpecification : undefined,
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
  };
}

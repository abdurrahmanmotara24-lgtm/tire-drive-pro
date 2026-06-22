import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";
import { buildWaMeUrl, WHATSAPP_QUOTE_MESSAGE } from "@/lib/phone-utils";

export function useContactContent() {
  const cmsReady = usePublicContentReady();
  const { data: contact = DEFAULTS.contact } = useQuery({
    queryKey: ["content", "contact"],
    queryFn: () => fetchContent("contact"),
    enabled: cmsReady,
    placeholderData: DEFAULTS.contact,
  });

  const phoneDigits = contact.phone.replace(/[^+\d]/g, "");
  const telHref = phoneDigits ? `tel:${phoneDigits}` : undefined;
  const waRaw = contact.whatsapp.trim() || contact.phone.trim();
  const waHref = buildWaMeUrl(waRaw);
  const waQuoteHref = buildWaMeUrl(waRaw, WHATSAPP_QUOTE_MESSAGE);
  const mailHref = contact.email ? `mailto:${contact.email}` : undefined;
  const hasPhone = Boolean(phoneDigits && !phoneDigits.includes("0000000"));

  const hoursSchedule = contact.hours_schedule;

  return { contact, telHref, waHref, waQuoteHref, mailHref, hasPhone, hoursSchedule };
}

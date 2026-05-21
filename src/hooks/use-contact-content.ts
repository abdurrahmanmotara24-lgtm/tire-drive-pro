import { useQuery } from "@tanstack/react-query";
import { DEFAULTS, fetchContent } from "@/lib/site-content";
import { usePublicContentReady } from "@/hooks/use-public-content-ready";

function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

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
  const waDigits = digitsOnly(contact.whatsapp);
  const waHref = waDigits ? `https://wa.me/${waDigits}` : undefined;
  const mailHref = contact.email ? `mailto:${contact.email}` : undefined;
  const hasPhone = Boolean(phoneDigits && !phoneDigits.includes("0000000"));

  const hoursSchedule = contact.hours_schedule;

  return { contact, telHref, waHref, mailHref, hasPhone, hoursSchedule };
}

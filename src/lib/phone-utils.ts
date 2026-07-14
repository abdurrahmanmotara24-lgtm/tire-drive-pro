/** Default dial code for local numbers (South Africa). */
export const DEFAULT_COUNTRY_CODE = "27";

/** Strip to digits for tel:/wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/**
 * Normalize a phone/WhatsApp number for wa.me (international digits, no +).
 * Accepts local SA formats (082…), national (82…), or international (2782…).
 */
export function normalizeWhatsAppDigits(
  raw: string,
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
): string | undefined {
  let digits = digitsOnly(raw);
  if (!digits) return undefined;

  if (digits.startsWith("00")) digits = digits.slice(2);

  const cc = digitsOnly(defaultCountryCode);
  if (!cc) return undefined;

  // Already includes country code (e.g. 27821234567)
  if (digits.startsWith(cc) && digits.length >= cc.length + 8) {
    return digits;
  }

  // Local format with leading 0 (e.g. 082 123 4567)
  if (digits.startsWith("0") && digits.length >= 9) {
    return cc + digits.slice(1);
  }

  // National number without leading 0 (e.g. 82 123 4567)
  if (digits.length >= 8 && digits.length <= 10) {
    return cc + digits;
  }

  // Full international number for another region
  if (digits.length >= 11) {
    return digits;
  }

  return undefined;
}

export function buildWaMeUrl(raw: string, message?: string): string | undefined {
  const digits = normalizeWhatsAppDigits(raw);
  if (!digits) return undefined;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_QUOTE_MESSAGE =
  "Hi, I'd like a quote for tyres. Could you help me with pricing and availability?";

export type QuoteWhatsAppDetails = {
  name: string;
  phone: string;
  vehicle?: string;
  tireSize?: string;
  quantity?: number;
  service?: string;
};

/** Pre-filled message sent when a customer requests a quote via WhatsApp. */
export function buildQuoteWhatsAppMessage(details: QuoteWhatsAppDetails): string {
  const lines = [
    "Hi, I'd like a quote for tyres.",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
  ];
  if (details.vehicle?.trim()) lines.push(`Vehicle: ${details.vehicle.trim()}`);
  if (details.tireSize?.trim()) lines.push(`Tyre size: ${details.tireSize.trim()}`);
  if (details.quantity && details.quantity > 0)
    lines.push(`Quantity: ${details.quantity} ${details.quantity === 1 ? "tyre" : "tyres"}`);
  if (details.service?.trim()) lines.push(`Service: ${details.service.trim()}`);
  return lines.join("\n");
}

export function buildQuoteWaMeUrl(raw: string, details: QuoteWhatsAppDetails): string | undefined {
  return buildWaMeUrl(raw, buildQuoteWhatsAppMessage(details));
}

/** Human-readable hint for admin fields. */
export function formatWhatsAppPreview(raw: string): string | undefined {
  const digits = normalizeWhatsAppDigits(raw);
  return digits ? `+${digits}` : undefined;
}

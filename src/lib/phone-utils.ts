/** Strip to digits for tel:/wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, "");
}

/**
 * Normalize a phone/WhatsApp number for wa.me (international digits, no +).
 * Handles AU local numbers (04… → 614…).
 */
export function normalizeWhatsAppDigits(raw: string, defaultCountryCode = "61"): string | undefined {
  let digits = digitsOnly(raw);
  if (!digits) return undefined;

  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("0") && digits.length >= 9) {
    digits = defaultCountryCode + digits.slice(1);
  } else if (digits.length === 9 && digits.startsWith("4")) {
    digits = defaultCountryCode + digits;
  }

  return digits.length >= 10 ? digits : undefined;
}

export function buildWaMeUrl(raw: string, message?: string): string | undefined {
  const digits = normalizeWhatsAppDigits(raw);
  if (!digits) return undefined;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_QUOTE_MESSAGE =
  "Hi, I'd like a quote for tyres. Could you help me with pricing and availability?";

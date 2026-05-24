import type { ContactContent, LocationRow } from "@/lib/site-content";

/** This business operates a single physical store. */
export const MAX_STORE_LOCATIONS = 1;

export function pickPrimaryStore(stores: LocationRow[]): LocationRow | null {
  return stores.find((s) => s.is_active) ?? stores[0] ?? null;
}

/** When no row exists in `locations`, fall back to global contact details. */
export function contactAsStore(contact: ContactContent): LocationRow | null {
  if (!contact.address?.trim() && !contact.phone?.trim()) return null;
  return {
    id: "contact-fallback",
    name: "Our store",
    address: contact.address?.trim() || null,
    phone: contact.phone?.trim() || null,
    email: contact.email?.trim() || null,
    hours: contact.hours?.trim() || null,
    map_embed_url: null,
    sort_order: 0,
    is_active: true,
  };
}

export function resolvePublicStore(
  stores: LocationRow[],
  contact: ContactContent,
): LocationRow | null {
  return pickPrimaryStore(stores) ?? contactAsStore(contact);
}

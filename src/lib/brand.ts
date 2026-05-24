/** Public-facing business name and shared page titles. */
export const BRAND_NAME = "Tyres Near Me";

export const BRAND_TAGLINE = "Premium Tyres & Performance Fitment";

export const BRAND_FULL_TITLE = `${BRAND_NAME} — ${BRAND_TAGLINE}`;

export const BRAND_DEFAULT_EMAIL = "hello@tyresnearme.com";

export const ADMIN_APP_NAME = "Tyres Near Me Admin";

/** e.g. `About — Tyres Near Me` */
export function brandPageTitle(page: string): string {
  return `${page} — ${BRAND_NAME}`;
}

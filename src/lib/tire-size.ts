/** Common passenger tyre size format: 225/45R18 or 225/45 R18 */
const TIRE_SIZE_PATTERN = /^\d{3}\/\d{2}\s*R?\s?\d{2}$/i;

export function isValidTireSize(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return TIRE_SIZE_PATTERN.test(trimmed);
}

/** Normalize for display/storage: 225/45R18 */
export function normalizeTireSize(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  const match = trimmed.match(/^(\d{3}\/\d{2})R?(\d{2})$/i);
  if (match) return `${match[1]}R${match[2]}`;
  return trimmed.toUpperCase();
}

export const TIRE_SIZE_PLACEHOLDER = "e.g. 225/45R18";
export const TIRE_SIZE_HINT =
  "Width / aspect ratio / rim diameter — check the sidewall of your current tyres.";

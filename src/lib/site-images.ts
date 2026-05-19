import mechanic from "@/assets/mechanic.jpg";
import tireStack from "@/assets/tire-stack.jpg";

/** Bundled fallbacks when no custom URL is stored in the CMS. */
export const FALLBACK_IMAGES = {
  technician: mechanic,
  inventory: tireStack,
} as const;

export function resolveSiteImage(stored: string | undefined, fallback: string): string {
  const trimmed = stored?.trim();
  return trimmed || fallback;
}

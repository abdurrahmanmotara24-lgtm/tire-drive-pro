import type { QueryClient } from "@tanstack/react-query";

/** Refetch CMS data on the public site after admin saves or Cloud keys load. */
export function invalidatePublicContentQueries(qc: QueryClient): void {
  void qc.invalidateQueries({ queryKey: ["content"] });
  void qc.invalidateQueries({ queryKey: ["brand_slideshow"] });
  void qc.invalidateQueries({ queryKey: ["locations"] });
}

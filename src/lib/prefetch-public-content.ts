import type { QueryClient } from "@tanstack/react-query";
import { fetchContent, type ContentMap } from "@/lib/site-content";

const HOME_CONTENT_KEYS = [
  "hero",
  "sections",
  "services",
  "specials",
  "brands",
  "process",
  "testimonials",
  "homepage",
] as const satisfies readonly (keyof ContentMap)[];

/** SSR / route loader — fetch CMS from Lovable Cloud using server credentials on Vercel. */
export async function prefetchHomeContent(queryClient: QueryClient): Promise<void> {
  await Promise.all(
    HOME_CONTENT_KEYS.map((key) =>
      queryClient.ensureQueryData({
        queryKey: ["content", key],
        queryFn: () => fetchContent(key),
      }),
    ),
  );
}

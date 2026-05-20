import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { readServerSupabasePublicEnv } from "@/lib/env";

/** Exposes Lovable Cloud public credentials to the browser when Vite env is empty in preview. */
export const Route = createFileRoute("/api/cloud-public-config")({
  server: {
    handlers: {
      GET: () => {
        const { url, key } = readServerSupabasePublicEnv();
        return new Response(
          JSON.stringify(url && key ? { configured: true, url, key } : { configured: false }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});

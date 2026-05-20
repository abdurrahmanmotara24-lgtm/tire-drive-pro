import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function readServerPublicEnv(): { url?: string; key?: string } {
  if (typeof process === "undefined" || !process.env) return {};
  const e = process.env;
  const url = e.VITE_SUPABASE_URL || e.SUPABASE_URL;
  const key =
    e.VITE_SUPABASE_PUBLISHABLE_KEY ||
    e.VITE_SUPABASE_ANON_KEY ||
    e.SUPABASE_PUBLISHABLE_KEY ||
    e.SUPABASE_ANON_KEY;
  if (url && key) return { url, key };

  const projectId = e.VITE_SUPABASE_PROJECT_ID || e.SUPABASE_PROJECT_ID;
  const anon =
    e.VITE_SUPABASE_PUBLISHABLE_KEY ||
    e.VITE_SUPABASE_ANON_KEY ||
    e.SUPABASE_ANON_KEY ||
    e.SUPABASE_PUBLISHABLE_KEY;
  if (projectId && anon) {
    return { url: `https://${projectId}.supabase.co`, key: anon };
  }

  return {};
}

/** Exposes Lovable Cloud public credentials to the browser when Vite env is empty in preview. */
export const Route = createFileRoute("/api/cloud-public-config")({
  server: {
    handlers: {
      GET: () => {
        const { url, key } = readServerPublicEnv();
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

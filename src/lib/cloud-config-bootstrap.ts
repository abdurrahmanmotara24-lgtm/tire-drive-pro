import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { resetSupabaseClientCache } from "@/integrations/supabase/client";

let bootstrapPromise: Promise<boolean> | null = null;

/**
 * When Lovable Cloud injects secrets on the server but not into the client bundle,
 * fetch public URL + key once from /api/cloud-public-config.
 */
export function ensureCloudPublicEnv(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(isSupabasePublicEnvConfigured());
  if (isSupabasePublicEnvConfigured()) return Promise.resolve(true);

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        const res = await fetch("/api/cloud-public-config", { cache: "no-store" });
        if (!res.ok) return false;
        const data = (await res.json()) as { configured?: boolean; url?: string; key?: string };
        if (!data.configured || !data.url || !data.key) return false;
        window.__TNY_SUPABASE_PUBLIC__ = { url: data.url, key: data.key };
        resetSupabaseClientCache();
        return true;
      } catch {
        return false;
      }
    })();
  }

  return bootstrapPromise;
}

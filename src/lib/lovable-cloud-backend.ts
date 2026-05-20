import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { resetSupabaseClientCache } from "@/integrations/supabase/client";

export type CloudBackendStatus = "loading" | "ready" | "unavailable";

let bootstrapPromise: Promise<boolean> | null = null;

function readProjectId(): string | undefined {
  const meta = import.meta.env as Record<string, string | undefined>;
  const id = meta.VITE_SUPABASE_PROJECT_ID || meta.SUPABASE_PROJECT_ID;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

/** If Lovable only injects project id, derive the standard Supabase URL. */
export function tryDeriveCloudCredentials(): boolean {
  if (isSupabasePublicEnvConfigured()) return true;

  const projectId = readProjectId();
  if (!projectId || typeof window === "undefined") return false;

  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    (import.meta.env as Record<string, string | undefined>).SUPABASE_PUBLISHABLE_KEY ||
    (import.meta.env as Record<string, string | undefined>).SUPABASE_ANON_KEY;

  if (typeof key !== "string" || !key) return false;

  window.__TNY_SUPABASE_PUBLIC__ = {
    url: `https://${projectId}.supabase.co`,
    key,
  };
  resetSupabaseClientCache();
  return true;
}

async function fetchCloudConfigFromServer(): Promise<boolean> {
  try {
    const res = await fetch("/api/cloud-public-config", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { configured?: boolean; url?: string; key?: string };
    if (!data.configured || !data.url || !data.key || typeof window === "undefined") return false;
    window.__TNY_SUPABASE_PUBLIC__ = { url: data.url, key: data.key };
    resetSupabaseClientCache();
    return true;
  } catch {
    return false;
  }
}

/** Resolve Lovable Cloud credentials into the browser (SSR script, API, or project id). */
export async function ensureLovableCloudBackend(): Promise<boolean> {
  if (isSupabasePublicEnvConfigured()) return true;
  if (tryDeriveCloudCredentials()) return true;

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      for (let i = 0; i < 8; i++) {
        if (isSupabasePublicEnvConfigured()) return true;
        if (tryDeriveCloudCredentials()) return true;
        if (await fetchCloudConfigFromServer()) return true;
        await new Promise((r) => setTimeout(r, 120));
      }
      return isSupabasePublicEnvConfigured();
    })();
  }

  return bootstrapPromise;
}

export const LOVABLE_CLOUD_CREDENTIALS_HINT =
  "Cloud is enabled, but this preview has not loaded your backend keys yet. Restart the preview, or refresh the page. Keys are automatic — no separate Supabase connection.";

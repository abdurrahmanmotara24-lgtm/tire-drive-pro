import { isSupabasePublicEnvConfigured, resolveSupabasePublicEnv } from "@/lib/env";
import { resetContentSupabaseClient } from "@/lib/supabase-content";
import { resetSupabaseBrowserClient } from "@/lib/supabase-browser";

export type CloudBackendStatus = "loading" | "ready" | "unavailable";

export const CLOUD_CREDENTIALS_READY_EVENT = "tny-cloud-credentials-ready";

let bootstrapPromise: Promise<boolean> | null = null;

export function notifyCloudCredentialsReady(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CLOUD_CREDENTIALS_READY_EVENT));
  }
}

function applyCloudCredentials(url: string, key: string): boolean {
  if (typeof window === "undefined") return false;
  window.__TNY_SUPABASE_PUBLIC__ = { url, key };
  resetSupabaseBrowserClient();
  resetContentSupabaseClient();
  notifyCloudCredentialsReady();
  return true;
}

/** If Lovable only injects project id, derive the standard Supabase URL. */
export function tryDeriveCloudCredentials(): boolean {
  if (isSupabasePublicEnvConfigured()) return true;

  const { url, key } = resolveSupabasePublicEnv("client");
  if (!url || !key) return false;

  return applyCloudCredentials(url, key);
}

async function fetchCloudConfigFromServer(): Promise<boolean> {
  try {
    const res = await fetch("/api/cloud-public-config", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { configured?: boolean; url?: string; key?: string };
    if (!data.configured || !data.url || !data.key) return false;
    return applyCloudCredentials(data.url, data.key);
  } catch {
    return false;
  }
}

export function resetLovableCloudBootstrap(): void {
  bootstrapPromise = null;
}

/** Resolve Lovable Cloud credentials into the browser (SSR script, API, or project id). */
export async function ensureLovableCloudBackend(): Promise<boolean> {
  if (isSupabasePublicEnvConfigured()) return true;
  if (tryDeriveCloudCredentials()) return true;

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      for (let i = 0; i < 25; i++) {
        if (isSupabasePublicEnvConfigured()) return true;
        if (tryDeriveCloudCredentials()) return true;
        if (await fetchCloudConfigFromServer()) return true;
        await new Promise((r) => setTimeout(r, 200));
      }
      return isSupabasePublicEnvConfigured();
    })();
  }

  const ok = await bootstrapPromise;
  if (ok) notifyCloudCredentialsReady();
  return ok;
}

export const LOVABLE_CLOUD_CREDENTIALS_HINT =
  "Supabase keys are injected by Lovable Cloud automatically (not listed in Secrets). If you only see LOVABLE_API_KEY, that is normal. Restart the preview, or check Cloud → Overview that the backend is active.";

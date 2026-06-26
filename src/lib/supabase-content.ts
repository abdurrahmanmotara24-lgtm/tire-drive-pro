import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { readServerSupabasePublicEnv, readSupabasePublicEnv } from "@/lib/env";

type ContentClient = SupabaseClient<Database>;

let cachedClient: ContentClient | null | undefined;

function readPublicEnv(): { url?: string; key?: string } {
  if (typeof window === "undefined") {
    return readServerSupabasePublicEnv();
  }
  return readSupabasePublicEnv();
}

/** True when this runtime can read Lovable Cloud / Supabase (server env on Vercel SSR, or browser keys). */
export function isCloudContentReadable(): boolean {
  const { url, key } = readPublicEnv();
  return Boolean(url && key);
}

export function getContentSupabaseClient(): ContentClient | null {
  const { url, key } = readPublicEnv();
  if (!url || !key) return null;

  if (cachedClient) return cachedClient;

  cachedClient = createClient<Database>(url, key, {
    auth: {
      storageKey: "tny-public-content-no-auth",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cachedClient;
}

export function resetContentSupabaseClient(): void {
  cachedClient = undefined;
}

/** On Vercel the server has SUPABASE_*; the browser may need /api/cloud-public-config first. */
export async function ensureCloudContentReadable(): Promise<boolean> {
  if (isCloudContentReadable()) return true;

  if (typeof window === "undefined") return false;

  const { ensureLovableCloudBackend } = await import("@/lib/lovable-cloud-backend");
  const ok = await ensureLovableCloudBackend();
  if (ok) resetContentSupabaseClient();
  return ok && isCloudContentReadable();
}

/**
 * Read Supabase public credentials without touching `process` in the browser bundle
 * (avoids ReferenceError in Lovable preview when process is undefined).
 */
export function readSupabasePublicEnv(): { url?: string; key?: string } {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (typeof url === "string" && url.length > 0 && typeof key === "string" && key.length > 0) {
    return { url, key };
  }

  if (import.meta.env.SSR && typeof process !== "undefined" && process.env) {
    const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } =
      process.env;
    return {
      url: SUPABASE_URL || VITE_SUPABASE_URL,
      key: SUPABASE_PUBLISHABLE_KEY || VITE_SUPABASE_PUBLISHABLE_KEY,
    };
  }

  return {};
}

export function isSupabasePublicEnvConfigured(): boolean {
  const { url, key } = readSupabasePublicEnv();
  return Boolean(url && key);
}

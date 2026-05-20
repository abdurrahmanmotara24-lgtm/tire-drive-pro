type EnvBag = Record<string, string | undefined>;

const SUPABASE_URL_KEYS = ["VITE_SUPABASE_URL", "SUPABASE_URL"] as const;

/** Lovable Cloud / Supabase use both publishable and legacy anon key names. */
const SUPABASE_KEY_KEYS = [
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
] as const;

function pickEnv(env: EnvBag, keys: readonly string[]): string | undefined {
  for (const name of keys) {
    const value = env[name];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

/**
 * Read Supabase public credentials without touching `process` in the browser bundle
 * (avoids ReferenceError in Lovable preview when process is undefined).
 */
export function readSupabasePublicEnv(): { url?: string; key?: string } {
  const meta = import.meta.env as EnvBag;
  const url = pickEnv(meta, SUPABASE_URL_KEYS);
  const key = pickEnv(meta, SUPABASE_KEY_KEYS);

  if (url && key) return { url, key };

  if (import.meta.env.SSR && typeof process !== "undefined" && process.env) {
    const proc = process.env as EnvBag;
    return {
      url: pickEnv(proc, SUPABASE_URL_KEYS),
      key: pickEnv(proc, SUPABASE_KEY_KEYS),
    };
  }

  return {};
}

export const SUPABASE_PUBLIC_ENV_HINT =
  "Set VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY) in Lovable Cloud → Secrets.";

export function isSupabasePublicEnvConfigured(): boolean {
  const { url, key } = readSupabasePublicEnv();
  return Boolean(url && key);
}

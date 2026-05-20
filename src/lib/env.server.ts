/** Server-only env helpers (safe to use process.env). */

type EnvBag = Record<string, string | undefined>;

const SUPABASE_URL_KEYS = ["VITE_SUPABASE_URL", "SUPABASE_URL"] as const;
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

function readFromEnvBag(env: EnvBag): { url?: string; key?: string } {
  const url = pickEnv(env, SUPABASE_URL_KEYS);
  const key = pickEnv(env, SUPABASE_KEY_KEYS);
  return url && key ? { url, key } : {};
}

export function readFromProcessEnv(): { url?: string; key?: string } {
  if (typeof process === "undefined" || !process.env) return {};
  return readFromEnvBag(process.env as EnvBag);
}

type EnvBag = Record<string, string | undefined>;

const SUPABASE_URL_KEYS = ["VITE_SUPABASE_URL", "SUPABASE_URL"] as const;

/** Lovable Cloud / Supabase use both publishable and legacy anon key names. */
const SUPABASE_KEY_KEYS = [
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
] as const;

declare global {
  interface Window {
    /** Injected from SSR when Lovable Cloud secrets exist server-side only. */
    __TNY_SUPABASE_PUBLIC__?: { url: string; key: string };
  }
}

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

function readFromProcessEnv(): { url?: string; key?: string } {
  if (typeof process === "undefined" || !process.env) return {};
  return readFromEnvBag(process.env as EnvBag);
}

/**
 * Read Supabase public credentials without touching `process` in the browser bundle
 * (avoids ReferenceError in Lovable preview when process is undefined).
 */
export function readSupabasePublicEnv(): { url?: string; key?: string } {
  if (typeof window !== "undefined" && window.__TNY_SUPABASE_PUBLIC__) {
    const { url, key } = window.__TNY_SUPABASE_PUBLIC__;
    if (url && key) return { url, key };
  }

  const fromMeta = readFromEnvBag(import.meta.env as EnvBag);
  if (fromMeta.url && fromMeta.key) return fromMeta;

  if (import.meta.env.SSR) {
    return readFromProcessEnv();
  }

  return {};
}

/**
 * Inline script for RootShell: copies Lovable Cloud server secrets into `window`
 * so the admin client can authenticate after hydration.
 */
export function buildSupabaseRuntimeScript(): string | null {
  if (typeof window !== "undefined") return null;

  const fromProcess = readFromProcessEnv();
  const fromMeta = readFromEnvBag(import.meta.env as EnvBag);
  const url = fromProcess.url ?? fromMeta.url;
  const key = fromProcess.key ?? fromMeta.key;

  if (!url || !key) return null;

  const payload = JSON.stringify({ url, key });
  return `(function(){try{window.__TNY_SUPABASE_PUBLIC__=${payload}}catch(e){}})();`;
}

export const SUPABASE_PUBLIC_ENV_HINT =
  "Set VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY) in Lovable Cloud → Secrets.";

export function isSupabasePublicEnvConfigured(): boolean {
  const { url, key } = readSupabasePublicEnv();
  return Boolean(url && key);
}

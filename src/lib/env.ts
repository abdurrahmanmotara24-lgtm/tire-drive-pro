/**
 * Lovable Cloud runs a managed Supabase backend and auto-injects public URL + key into the app.
 * There is no separate "Connect Supabase" integration when Cloud is enabled on the project.
 */
type EnvBag = Record<string, string | undefined>;

const SUPABASE_URL_KEYS = ["VITE_SUPABASE_URL", "SUPABASE_URL"] as const;

/** Auto-injected by Lovable Cloud (publishable + legacy anon key names). */
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

/** Safe read — Lovable inlines process.env.* at build time; guard when process is missing in browser. */
function readProcessEnv(key: string): string | undefined {
  try {
    if (typeof process !== "undefined" && process.env) {
      const value = process.env[key];
      if (typeof value === "string" && value.length > 0) return value;
    }
  } catch {
    /* preview sandbox */
  }
  return undefined;
}

/**
 * Read Lovable Cloud public credentials for the browser bundle.
 * Matches the pre-regression pattern (import.meta.env + process.env fallbacks) from when admin worked.
 */
export function readSupabasePublicEnv(): { url?: string; key?: string } {
  const url =
    import.meta.env.VITE_SUPABASE_URL ||
    readProcessEnv("SUPABASE_URL") ||
    readProcessEnv("VITE_SUPABASE_URL");
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    readProcessEnv("SUPABASE_PUBLISHABLE_KEY") ||
    readProcessEnv("VITE_SUPABASE_PUBLISHABLE_KEY");

  if (typeof url === "string" && url && typeof key === "string" && key) {
    return { url, key };
  }

  if (typeof window !== "undefined" && window.__TNY_SUPABASE_PUBLIC__) {
    const injected = window.__TNY_SUPABASE_PUBLIC__;
    if (injected.url && injected.key) return injected;
  }

  const fromMeta = readFromEnvBag(import.meta.env as EnvBag);
  if (fromMeta.url && fromMeta.key) return fromMeta;

  return {};
}

/** Shown when Lovable Cloud credentials are not reaching the browser preview. */
export const LOVABLE_CLOUD_BACKEND_HINT =
  "Open the Cloud tab and confirm Cloud is enabled, then restart the preview. For local npm run dev, copy the auto-generated URL and publishable key from Cloud → Secrets into a .env file.";

/** @deprecated Use LOVABLE_CLOUD_BACKEND_HINT */
export const SUPABASE_PUBLIC_ENV_HINT = LOVABLE_CLOUD_BACKEND_HINT;

export function isSupabasePublicEnvConfigured(): boolean {
  const { url, key } = readSupabasePublicEnv();
  return Boolean(url && key);
}

/** Inline script for RootShell — must live in env.ts (not env.server) so __root does not import server-only modules. */
export function buildSupabaseRuntimeScript(): string | null {
  if (typeof window !== "undefined") return null;

  const { url, key } = readSupabasePublicEnv();
  if (!url || !key) return null;

  const payload = JSON.stringify({ url, key });
  return `(function(){try{window.__TNY_SUPABASE_PUBLIC__=${payload}}catch(e){}})();`;
}

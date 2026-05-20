/**
 * Lovable Cloud runs a managed Supabase backend and auto-injects public URL + key into the app.
 * There is no separate "Connect Supabase" integration when Cloud is enabled on the project.
 */
type EnvBag = Record<string, string | undefined>;

export type SupabaseEnvSource = "client" | "server";

const SUPABASE_URL_KEYS = ["VITE_SUPABASE_URL", "SUPABASE_URL"] as const;

/** Auto-injected by Lovable Cloud (publishable + legacy anon key names). */
const SUPABASE_KEY_KEYS = [
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
] as const;

const SUPABASE_PROJECT_ID_KEYS = ["VITE_SUPABASE_PROJECT_ID", "SUPABASE_PROJECT_ID"] as const;

const ALL_ENV_KEY_NAMES = [
  ...SUPABASE_URL_KEYS,
  ...SUPABASE_KEY_KEYS,
  ...SUPABASE_PROJECT_ID_KEYS,
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

function getProcessEnvBag(): EnvBag {
  if (typeof process === "undefined" || !process.env) return {};
  return process.env as EnvBag;
}

/** Merge Vite client env with guarded process.env fallbacks (init-style). */
function buildClientEnvBag(): EnvBag {
  const bag: EnvBag = { ...(import.meta.env as EnvBag) };
  for (const name of ALL_ENV_KEY_NAMES) {
    const v = readProcessEnv(name);
    if (v) bag[name] = v;
  }
  return bag;
}

/**
 * Single resolver for Lovable Cloud public credentials.
 */
export function resolveSupabasePublicEnv(source: SupabaseEnvSource): { url?: string; key?: string } {
  const bag = source === "server" ? getProcessEnvBag() : buildClientEnvBag();

  const direct = readFromEnvBag(bag);
  if (direct.url && direct.key) return direct;

  const projectId = pickEnv(bag, SUPABASE_PROJECT_ID_KEYS);
  const key = pickEnv(bag, SUPABASE_KEY_KEYS);
  if (projectId && key) {
    return { url: `https://${projectId}.supabase.co`, key };
  }

  return {};
}

/** Server-only — API routes and SSR injection. */
export function readServerSupabasePublicEnv(): { url?: string; key?: string } {
  return resolveSupabasePublicEnv("server");
}

/** Credentials for SSR inline script (server runtime + build-time import.meta.env). */
function readEnvForSsrInjection(): { url?: string; key?: string } {
  const server = readServerSupabasePublicEnv();
  if (server.url && server.key) return server;
  return resolveSupabasePublicEnv("client");
}

/**
 * Read Lovable Cloud public credentials for the browser bundle.
 */
export function readSupabasePublicEnv(): { url?: string; key?: string } {
  if (typeof window !== "undefined" && window.__TNY_SUPABASE_PUBLIC__) {
    const injected = window.__TNY_SUPABASE_PUBLIC__;
    if (injected.url && injected.key) return injected;
  }

  return resolveSupabasePublicEnv("client");
}

export const LOVABLE_CLOUD_BACKEND_HINT =
  "Lovable injects Supabase keys automatically — you cannot add them in Secrets (only LOVABLE_API_KEY shows there). Open Cloud → Overview and confirm the backend is connected, then restart preview. For local npm run dev, use a .env file (see .env.example).";

/** @deprecated Use LOVABLE_CLOUD_BACKEND_HINT */
export const SUPABASE_PUBLIC_ENV_HINT = LOVABLE_CLOUD_BACKEND_HINT;

export function isSupabasePublicEnvConfigured(): boolean {
  const { url, key } = readSupabasePublicEnv();
  return Boolean(url && key);
}

/** Inline script for RootShell — injects keys before React hydrates. */
export function buildSupabaseRuntimeScript(): string | null {
  if (typeof window !== "undefined") return null;

  const { url, key } = readEnvForSsrInjection();
  if (!url || !key) return null;

  const payload = JSON.stringify({ url, key });
  return `(function(){try{window.__TNY_SUPABASE_PUBLIC__=${payload}}catch(e){}})();`;
}

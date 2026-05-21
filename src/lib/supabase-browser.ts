import { createClient, type SupabaseClient as RealSupabaseClient } from "@supabase/supabase-js";
import { isSupabasePublicEnvConfigured, readSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/integrations/supabase/types";

export type SupabaseClient = RealSupabaseClient<Database>;

const CLOUD_UNAVAILABLE_MESSAGE = "Lovable Cloud backend is not available in this preview";

export function isSupabaseConfigured(): boolean {
  return isSupabasePublicEnvConfigured();
}

export function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(CLOUD_UNAVAILABLE_MESSAGE);
  }
}

function createLiveClient(): SupabaseClient | null {
  const { url, key } = readSupabasePublicEnv();
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function createStubClient(): SupabaseClient {
  const emptyResult = { data: null, error: null };
  const emptyList = { data: [] as unknown[], error: null };

  const makeQuery = <T,>(result: { data: T; error: null } = emptyList as { data: T; error: null }) => {
    const promise = Promise.resolve(result);
    return Object.assign(promise, {
      select: () => makeQuery(result),
      eq: () => makeQuery(result),
      neq: () => makeQuery(result),
      order: () => makeQuery(result),
      limit: () => makeQuery(result),
      update: () => makeQuery(result),
      delete: () => makeQuery(result),
      filter: () => makeQuery(result),
      maybeSingle: () => Promise.resolve(emptyResult),
      single: () => Promise.resolve(emptyResult),
      insert: () => Promise.resolve(emptyResult),
      upsert: () => Promise.resolve(emptyResult),
    });
  };

  const auth = {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getClaims: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: { user: null, session: null }, error: { message: CLOUD_UNAVAILABLE_MESSAGE } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: CLOUD_UNAVAILABLE_MESSAGE } }),
  };

  const storageFrom = () => ({
    getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
    list: () => Promise.resolve(emptyList),
    upload: () => Promise.resolve({ data: null, error: { message: CLOUD_UNAVAILABLE_MESSAGE } }),
    remove: () => Promise.resolve(emptyResult),
  });

  const channel = () => {
    const ch: Record<string, unknown> = {};
    ch.on = () => ch;
    ch.subscribe = () => ch;
    return ch;
  };

  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === "auth") return auth;
      if (prop === "from") return () => makeQuery();
      if (prop === "storage") return { from: storageFrom };
      if (prop === "channel") return channel;
      if (prop === "removeChannel") return () => undefined;
      return () => emptyResult;
    },
  });
}

let client: SupabaseClient | null | undefined;

export function resetSupabaseBrowserClient(): void {
  client = undefined;
}

function getClient(): SupabaseClient {
  if (client !== undefined) return client ?? createStubClient();
  client = createLiveClient();
  return client ?? createStubClient();
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
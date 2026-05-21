import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase-browser";
import {
  CLOUD_CREDENTIALS_READY_EVENT,
  ensureLovableCloudBackend,
} from "@/lib/lovable-cloud-backend";

/**
 * True when the browser can read from Lovable Cloud / Supabase.
 * Public pages should not fetch CMS data before this (or they cache built-in defaults).
 */
export function usePublicContentReady(): boolean {
  const [ready, setReady] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    const sync = () => setReady(isSupabaseConfigured());
    sync();
    if (isSupabaseConfigured()) return;

    window.addEventListener(CLOUD_CREDENTIALS_READY_EVENT, sync);
    void ensureLovableCloudBackend().then(() => sync());

    return () => window.removeEventListener(CLOUD_CREDENTIALS_READY_EVENT, sync);
  }, []);

  return ready;
}

import { useEffect, useState } from "react";
import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { CLOUD_CREDENTIALS_READY_EVENT } from "@/lib/lovable-cloud-backend";

/**
 * True when the browser can read from Lovable Cloud / Supabase.
 * Public pages should not fetch CMS data before this (or they cache built-in defaults).
 */
export function usePublicContentReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setReady(isSupabasePublicEnvConfigured());
    sync();
    if (isSupabasePublicEnvConfigured()) return;

    const onReady = () => sync();
    window.addEventListener(CLOUD_CREDENTIALS_READY_EVENT, onReady);

    void import("@/lib/lovable-cloud-backend").then(({ ensureLovableCloudBackend }) => {
      void ensureLovableCloudBackend().then(() => sync());
    });

    return () => window.removeEventListener(CLOUD_CREDENTIALS_READY_EVENT, onReady);
  }, []);

  return ready;
}

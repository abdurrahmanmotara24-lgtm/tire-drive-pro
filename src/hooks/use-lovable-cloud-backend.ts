import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase-browser";
import {
  CLOUD_CREDENTIALS_READY_EVENT,
  ensureLovableCloudBackend,
  type CloudBackendStatus,
} from "@/lib/lovable-cloud-backend";

export function useLovableCloudBackend(): CloudBackendStatus {
  const [status, setStatus] = useState<CloudBackendStatus>(() =>
    isSupabaseConfigured() ? "ready" : "loading",
  );

  useEffect(() => {
    const sync = () => {
      if (isSupabaseConfigured()) setStatus("ready");
    };

    sync();
    if (isSupabaseConfigured()) return;

    window.addEventListener(CLOUD_CREDENTIALS_READY_EVENT, sync);

    const poll = window.setInterval(sync, 250);

    let cancelled = false;
    void ensureLovableCloudBackend().then((ok) => {
      if (cancelled) return;
      setStatus(ok || isSupabaseConfigured() ? "ready" : "unavailable");
    });

    return () => {
      cancelled = true;
      window.removeEventListener(CLOUD_CREDENTIALS_READY_EVENT, sync);
      window.clearInterval(poll);
    };
  }, []);

  if (isSupabaseConfigured()) return "ready";
  return status;
}

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { ensureLovableCloudBackend, type CloudBackendStatus } from "@/lib/lovable-cloud-backend";

export function useLovableCloudBackend(): CloudBackendStatus {
  const [status, setStatus] = useState<CloudBackendStatus>(() =>
    isSupabaseConfigured() ? "ready" : "loading",
  );

  useEffect(() => {
    if (isSupabaseConfigured()) {
      setStatus("ready");
      return;
    }

    let cancelled = false;
    void ensureLovableCloudBackend().then((ok) => {
      if (cancelled) return;
      setStatus(ok ? "ready" : "unavailable");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isSupabaseConfigured()) return "ready";
  return status;
}

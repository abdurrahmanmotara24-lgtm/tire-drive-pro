import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isSupabasePublicEnvConfigured } from "@/lib/env";
import { CLOUD_CREDENTIALS_READY_EVENT } from "@/lib/lovable-cloud-backend";
import { invalidatePublicContentQueries } from "@/lib/invalidate-public-content";

/** Loads Lovable Cloud keys, then refetches public CMS queries from the database. */
export function CloudConfigBootstrap() {
  const qc = useQueryClient();

  useEffect(() => {
    const onReady = () => invalidatePublicContentQueries(qc);

    window.addEventListener(CLOUD_CREDENTIALS_READY_EVENT, onReady);

    if (isSupabasePublicEnvConfigured()) {
      onReady();
      return () => window.removeEventListener(CLOUD_CREDENTIALS_READY_EVENT, onReady);
    }

    void import("@/lib/lovable-cloud-backend").then(({ ensureLovableCloudBackend }) => {
      void ensureLovableCloudBackend().then((ok) => {
        if (ok) onReady();
      });
    });

    return () => window.removeEventListener(CLOUD_CREDENTIALS_READY_EVENT, onReady);
  }, [qc]);

  return null;
}

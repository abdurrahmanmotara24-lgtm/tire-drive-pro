import { useEffect, useState } from "react";
import { ensureCloudPublicEnv } from "@/lib/cloud-config-bootstrap";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

/** Loads Lovable Cloud public credentials into the browser when SSR injection is unavailable. */
export function CloudConfigBootstrap() {
  const [, tick] = useState(0);

  useEffect(() => {
    if (isSupabaseConfigured()) return;
    void ensureCloudPublicEnv().then((ok) => {
      if (ok) tick((n) => n + 1);
    });
  }, []);

  return null;
}

import { useEffect, useState } from "react";
import { ensureLovableCloudBackend } from "@/lib/lovable-cloud-backend";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

/** Loads Lovable Cloud keys into the browser, then refreshes Supabase client consumers. */
export function CloudConfigBootstrap() {
  const [, tick] = useState(0);

  useEffect(() => {
    if (isSupabaseConfigured()) return;
    void ensureLovableCloudBackend().then((ok) => {
      if (ok) tick((n) => n + 1);
    });
  }, []);

  return null;
}

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to changes on site_content and locations so the public site
 * refreshes whenever an admin saves something in the CMS.
 */
export function useContentRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel("public-content")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        (payload) => {
          const key = (payload.new as { key?: string } | null)?.key
            ?? (payload.old as { key?: string } | null)?.key;
          if (key) {
            qc.invalidateQueries({ queryKey: ["content", key] });
            if (key === "brand_slideshow") qc.invalidateQueries({ queryKey: ["brand_slideshow"] });
          } else {
            qc.invalidateQueries({ queryKey: ["content"] });
            qc.invalidateQueries({ queryKey: ["brand_slideshow"] });
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "locations" },
        () => qc.invalidateQueries({ queryKey: ["locations"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}

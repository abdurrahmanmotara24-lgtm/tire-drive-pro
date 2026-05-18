import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeads } from "@/lib/site-content";

export function useLeadNotifications(enabled: boolean) {
  const prevCount = useRef<number | null>(null);

  const { data: newCount = 0 } = useQuery({
    queryKey: ["leads", "new-count"],
    queryFn: async () => (await fetchLeads("new")).length,
    refetchInterval: 45_000,
    enabled,
  });

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || Notification.permission !== "granted") return;
    if (prevCount.current !== null && newCount > prevCount.current) {
      const diff = newCount - prevCount.current;
      new Notification("New lead", {
        body: diff === 1 ? "You have a new quote or message." : `${diff} new leads waiting.`,
        icon: "/favicon.ico",
      });
    }
    prevCount.current = newCount;
  }, [newCount, enabled]);
}

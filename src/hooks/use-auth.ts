import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { ensureCloudPublicEnv } from "@/lib/cloud-config-bootstrap";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: { subscription: { unsubscribe: () => void } } | undefined;
    let cancelled = false;

    void (async () => {
      await ensureCloudPublicEnv();
      if (cancelled) return;

    const { data: subData } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    sub = subData;
    const { data } = await supabase.auth.getSession();
    if (cancelled) return;
    setSession(data.session);
    setUser(data.session?.user ?? null);
    setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setIsStaff(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setIsStaff(!!data?.some((r) => r.role === "admin" || r.role === "editor"));
      });
  }, [user]);

  return { session, user, isStaff, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
}

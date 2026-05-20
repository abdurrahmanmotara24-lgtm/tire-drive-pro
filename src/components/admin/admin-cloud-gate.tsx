import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ensureLovableCloudBackend,
  LOVABLE_CLOUD_CREDENTIALS_HINT,
  resetLovableCloudBootstrap,
  type CloudBackendStatus,
} from "@/lib/lovable-cloud-backend";

type Props = {
  status: CloudBackendStatus;
  children: React.ReactNode;
};

/** Blocks admin/login until Lovable Cloud credentials are in the browser. */
export function AdminCloudGate({ status, children }: Props) {
  const [retrying, setRetrying] = useState(false);

  if (status === "loading") {
    return (
      <div className="admin-light flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Connecting to Lovable Cloud…</p>
      </div>
    );
  }

  if (status === "unavailable") {
    const retry = async () => {
      setRetrying(true);
      try {
        resetLovableCloudBootstrap();
        await ensureLovableCloudBackend();
        window.location.reload();
      } finally {
        setRetrying(false);
      }
    };

    return (
      <div className="admin-light flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Cloud backend not ready</h1>
          <p className="mt-2 text-sm text-muted-foreground">{LOVABLE_CLOUD_CREDENTIALS_HINT}</p>
          {typeof window !== "undefined" &&
            (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
              <p className="mt-3 text-xs text-muted-foreground">
                Running locally: create a <code className="text-foreground">.env</code> file with{" "}
                <code className="text-foreground">VITE_SUPABASE_URL</code> and{" "}
                <code className="text-foreground">VITE_SUPABASE_PUBLISHABLE_KEY</code> (from Cloud → Database / project settings in
                Lovable, not Secrets), then restart <code className="text-foreground">npm run dev</code>.
              </p>
            )}
          {typeof window !== "undefined" &&
            !window.location.hostname.includes("localhost") &&
            !window.location.hostname.includes("127.0.0.1") && (
              <p className="mt-3 text-xs text-muted-foreground">
                In Lovable preview you cannot add Supabase to Secrets — they are platform-managed. Use Cloud → Overview (not Secrets) and
                restart preview.
              </p>
            )}
          <Button type="button" className="mt-6" onClick={retry} disabled={retrying}>
            {retrying ? "Retrying…" : "Retry connection"}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

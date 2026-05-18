import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  previewPath?: string;
  previewHash?: string;
};

export function AdminPreviewLayout({ children, previewPath = "/", previewHash }: Props) {
  const src = `${previewPath}${previewHash ? `#${previewHash}` : ""}`;
  const openUrl = typeof window !== "undefined" ? `${window.location.origin}${src}` : src;

  return (
    <div className="mt-4 hidden min-h-[calc(100vh-10rem)] lg:block">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-10rem)] rounded-lg border border-border">
        <ResizablePanel defaultSize={52} minSize={32}>
          <div className="h-full overflow-y-auto p-1">{children}</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={48} minSize={28}>
          <div className="flex h-full flex-col bg-secondary/30">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live preview</p>
              <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 text-xs" asChild>
                <a href={openUrl} target="_blank" rel="noreferrer">
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <iframe title="Site preview" src={openUrl} className="min-h-0 flex-1 w-full border-0 bg-background" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export function AdminPreviewMobileLink({ previewPath = "/", previewHash }: { previewPath?: string; previewHash?: string }) {
  const src = `${previewPath}${previewHash ? `#${previewHash}` : ""}`;
  return (
    <p className="mt-2 text-xs text-muted-foreground lg:hidden">
      <a href={src} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
        Preview on site ↗
      </a>
    </p>
  );
}

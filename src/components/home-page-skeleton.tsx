import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("rounded-sm bg-muted", className)} />;
}

/** Layout-shaped placeholder while homepage CMS content loads. */
export function HomePageSkeleton({ bleedUnderHeader }: { bleedUnderHeader?: boolean }) {
  return (
    <div aria-hidden className="home-page-skeleton animate-pulse">
      {/* Hero */}
      <div
        className={cn(
          "relative min-h-[100svh] bg-muted",
          bleedUnderHeader && "pt-[var(--site-header-height,4rem)]",
        )}
      >
        <div className="container-tny flex min-h-[calc(100svh-var(--site-header-height,4rem))] flex-col justify-end pb-12 max-md:min-h-[calc(100svh-var(--site-header-height,4rem))] md:justify-center md:pb-16">
          <Bone className="mx-auto h-16 w-48 max-w-[70vw] md:h-20 md:w-64" />
          <Bone className="mt-6 h-3 w-28" />
          <Bone className="mt-4 h-10 w-full max-w-md" />
          <Bone className="mt-3 h-10 w-4/5 max-w-sm" />
          <Bone className="mt-4 h-4 w-full max-w-lg" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Bone className="h-11 w-36" />
            <Bone className="h-11 w-28" />
          </div>
        </div>
      </div>

      <div id="content">
        {/* Brand marquee */}
        <div className="border-y border-border py-12">
          <div className="container-tny mb-8 space-y-2 text-center">
            <Bone className="mx-auto h-3 w-20" />
            <Bone className="mx-auto h-8 w-56" />
          </div>
          <Bone className="mx-auto h-6 w-[min(90%,48rem)]" />
        </div>

        {/* Trust + stats */}
        <div className="border-b border-border/60 bg-muted/20 py-4">
          <div className="container-tny flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-baseline gap-2">
                <Bone className="h-5 w-12" />
                <Bone className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Services grid */}
        <div className="section">
          <div className="container-tny">
            <Bone className="h-3 w-16" />
            <Bone className="mt-3 h-9 w-72 max-w-full" />
            <Bone className="mt-2 h-4 w-96 max-w-full" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Bone key={i} className="h-44 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Image band */}
        <div className="relative min-h-[min(40vh,20rem)] bg-muted md:min-h-[min(52vh,28rem)]">
          <div className="container-tny flex min-h-[inherit] items-end py-10 md:items-center md:py-16">
            <div className="max-w-lg space-y-3">
              <Bone className="h-3 w-24" />
              <Bone className="h-10 w-full max-w-sm" />
              <Bone className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="section border-t border-border bg-card">
          <div className="container-tny">
            <Bone className="h-3 w-20" />
            <Bone className="mt-3 h-9 w-64" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Bone className="h-14 w-14 shrink-0 rounded-sm" />
                  <div className="flex-1 space-y-2">
                    <Bone className="h-4 w-28" />
                    <Bone className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory slideshow band */}
        <div className="relative min-h-[min(40vh,20rem)] bg-muted/80 md:min-h-[min(52vh,28rem)]">
          <div className="container-tny flex min-h-[inherit] items-end justify-end py-10 md:items-center md:py-16">
            <div className="max-w-lg space-y-3 md:text-right">
              <Bone className="ml-auto h-3 w-24" />
              <Bone className="ml-auto h-10 w-full max-w-sm" />
              <Bone className="ml-auto h-4 w-4/5" />
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="section border-t border-border">
          <div className="container-tny grid gap-10 lg:grid-cols-2">
            <div className="space-y-3">
              <Bone className="h-3 w-16" />
              <Bone className="h-9 w-56" />
              <Bone className="h-4 w-full max-w-md" />
            </div>
            <Bone className="h-80 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[70vh] bg-muted" />
      <div className="container-tny space-y-6 py-16">
        <div className="mx-auto h-4 w-32 rounded bg-muted" />
        <div className="h-28 rounded-sm bg-muted" />
        <div className="h-32 rounded-sm bg-muted" />
        <div className="mx-auto h-3 w-64 rounded bg-muted" />
      </div>
    </div>
  );
}

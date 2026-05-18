export function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[70vh] bg-muted" />
      <div className="container-tny space-y-6 py-16">
        <div className="mx-auto h-4 w-32 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-sm bg-muted" />
          ))}
        </div>
        <div className="h-48 rounded-sm bg-muted" />
      </div>
    </div>
  );
}

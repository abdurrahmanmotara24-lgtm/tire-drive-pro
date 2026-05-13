import { createFileRoute } from "@tanstack/react-router";
import { MediaLibraryGrid } from "@/components/admin/media-picker";

export const Route = createFileRoute("/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="text-sm text-muted-foreground">Upload and manage images used across the site.</p>
      <div className="mt-6">
        <MediaLibraryGrid />
      </div>
    </div>
  );
}

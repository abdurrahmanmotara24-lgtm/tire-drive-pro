// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/** Vercel sets VERCEL=1 during builds. Lovable preview uses Cloudflare Workers instead. */
const isVercel = process.env.VERCEL === "1";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig({
  tanstackStart: {
    server: { entry: "./src/server.ts" },
  },
  // On Vercel, force-on Nitro with the vercel preset. On Lovable, leave undefined
  // so the plugin's auto-detection wires up Cloudflare Workers.
  nitro: isVercel ? { preset: "vercel" } : undefined,
  // Lovable Cloud injects SUPABASE_* on the server; expose public keys to the client bundle too.
  vite: {
    envPrefix: ["VITE_", "SUPABASE_"],
  },
});

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

/** Vercel sets VERCEL=1 during builds. Lovable preview uses Cloudflare Workers instead. */
const isVercel = process.env.VERCEL === "1";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
//
// IMPORTANT: src/routeTree.gen.ts must end with the `declare module '@tanstack/react-start'`
// Register block. If that block is removed, Lovable preview fails with "Worker bundle not found".
export default defineConfig({
  // Cloudflare worker output for Lovable; Nitro (Vercel preset) for Vercel deployments.
  cloudflare: isVercel ? false : undefined,
  tanstackStart: {
    server: { entry: "./src/server.ts" },
  },
  plugins: isVercel ? [nitro({ preset: "vercel" })] : [],
  // Lovable Cloud injects SUPABASE_* on the server; expose public keys to the client bundle too.
  vite: {
    envPrefix: ["VITE_", "SUPABASE_"],
  },
});

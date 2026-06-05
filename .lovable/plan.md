## Diagnosis

Your live site at `www.tyres-near-me.co.za` is rendering built-in default content instead of your CMS edits because the Vercel deployment has no Supabase/Lovable Cloud credentials. Without these env vars:

- The server-side render (Vercel SSR) cannot read `site_content` or `locations` from the database, so it falls back to defaults.
- The browser then can't reach the backend either, so realtime updates and admin login don't work.
- The Lovable preview works because Lovable injects these keys automatically — Vercel does not.

The codebase is already correctly wired (`src/lib/supabase-content.ts`, `src/lib/lovable-cloud-backend.ts`, `vite.config.ts` exposes `SUPABASE_*` to the client bundle). Nothing in the code needs to change.

## Fix — add 4 environment variables in Vercel

Go to **Vercel → your project → Settings → Environment Variables** and add these for **Production, Preview, and Development**:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://irriknbiynvdyigwssdr.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycmlrbmJpeW52ZHlpZ3dzc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzAxMjUsImV4cCI6MjA5NDI0NjEyNX0.yVFsl8NplVN8khUgRn6xEyWBJr3n5N_t9k81eKzYFic` |
| `SUPABASE_URL` | `https://irriknbiynvdyigwssdr.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | (same key as above) |

These are public/anon keys — safe to expose. Row-Level Security protects your data.

## Then redeploy

1. Vercel → **Deployments** → latest deployment → **⋯ → Redeploy** (uncheck "Use existing build cache").
2. Wait for the build to finish (~1–2 min).
3. Hard-refresh `www.tyres-near-me.co.za` (Ctrl/Cmd+Shift+R).

## Verify

- Homepage shows your CMS-edited content (hero, sections, brands, locations).
- `/admin` loads the login screen without the "Lovable Cloud is not enabled" error.
- Browser DevTools → Network: request to `irriknbiynvdyigwssdr.supabase.co/rest/v1/site_content` returns 200 with your data.

## If it still shows defaults after redeploy

Tell me and I'll inspect the Vercel build logs / response to narrow down whether it's an env var typo, build-cache issue, or something else.

## No code changes in this plan

The repo is already correct. The only action is configuration in Vercel.
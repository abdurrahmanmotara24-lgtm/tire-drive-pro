import { readFileSync } from "node:fs";
import { join } from "node:path";

const path = join(process.cwd(), "src", "routeTree.gen.ts");
const src = readFileSync(path, "utf8");

if (!src.includes("declare module '@tanstack/react-start'")) {
  console.error("routeTree.gen.ts: missing @tanstack/react-start module declaration");
  process.exit(1);
}

if (!src.includes("interface Register")) {
  console.error(
    "routeTree.gen.ts: missing Register block — Lovable preview returns 404 until this is restored. Re-run npm run build.",
  );
  process.exit(1);
}

console.log("routeTree.gen.ts: Register block OK");

// Rewrites the registry's own origin inside the built static files.
//
// The registry items in public/r/*.json reference each other (and the GoFive
// fonts) by ABSOLUTE url, so those urls must match the domain the registry is
// actually served from — otherwise `npx shadcn add` can't resolve cross
// dependencies and @font-face urls 404.
//
// Usage:  NEXT_PUBLIC_REGISTRY_URL=https://your-domain node scripts/set-registry-url.mjs
//
// No-ops when NEXT_PUBLIC_REGISTRY_URL is unset, so it's safe to always run.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OLD = "https://registry.gofive.co.th";
const next = process.env.NEXT_PUBLIC_REGISTRY_URL;

if (!next) {
  console.log("[set-registry-url] NEXT_PUBLIC_REGISTRY_URL not set — skipping.");
  process.exit(0);
}

const target = next.replace(/\/+$/, ""); // drop trailing slash

if (target === OLD) {
  console.log("[set-registry-url] target equals default — nothing to do.");
  process.exit(0);
}

const dir = "public/r";
const entries = await readdir(dir);
let changed = 0;

for (const name of entries) {
  if (!name.endsWith(".json")) continue;
  const path = join(dir, name);
  const before = await readFile(path, "utf8");
  if (!before.includes(OLD)) continue;
  await writeFile(path, before.split(OLD).join(target));
  changed++;
}

console.log(`[set-registry-url] rewrote ${OLD} -> ${target} in ${changed} file(s).`);

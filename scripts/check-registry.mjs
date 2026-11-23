// Catches registry drift that tsc/eslint can't: run with `npm run check:registry`.
import { existsSync, readFileSync } from "node:fs"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
const url = (name) => `https://ui.go5.online/r/${name}.json`

const all = registry.items.find((i) => i.name === "all")
const errors = []

for (const item of registry.items) {
  for (const f of item.files ?? []) {
    if (!existsSync(f.path)) errors.push(`${item.name}: missing file ${f.path}`)
  }
  if (item.type !== "registry:ui" || item === all) continue
  if (!all.registryDependencies.includes(url(item.name)))
    errors.push(`${item.name}: not in the "all" item's registryDependencies`)
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(`registry OK (${registry.items.length} items)`)

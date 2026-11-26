import { execFileSync } from "node:child_process"
import { lstatSync } from "node:fs"

const raw = execFileSync(
  "git",
  ["diff", "--cached", "--name-only", "--no-renames", "-z"],
  { encoding: "utf8" },
)
const paths = raw.split("\0").filter(Boolean)

if (paths.length === 0) throw new Error("Patch contains no changes")

for (const path of paths) {
  if (
    path === "AGENTS.md" ||
    path === "CLAUDE.md" ||
    path === ".gitmodules" ||
    path === ".codex-issue.md" ||
    path.startsWith(".github/") ||
    path.startsWith(".agents/") ||
    path.startsWith(".codex/") ||
    path.startsWith(".git/")
  ) {
    throw new Error(`Patch changes a protected path: ${path}`)
  }
  try {
    if (lstatSync(path).isSymbolicLink()) {
      throw new Error(`Patch creates a symlink: ${path}`)
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }
}

console.log(`Checked ${paths.length} changed path(s)`)

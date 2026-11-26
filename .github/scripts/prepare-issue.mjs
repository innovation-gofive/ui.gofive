import { readFileSync, writeFileSync } from "node:fs"

const [source, destination] = process.argv.slice(2)
if (!source || !destination) {
  throw new Error("Usage: node prepare-issue.mjs <issue.json> <output.md>")
}

const issue = JSON.parse(readFileSync(source, "utf8"))
if (!Number.isSafeInteger(issue.number) || issue.number < 1 || issue.pull_request) {
  throw new Error("Expected a GitHub issue")
}

const clean = (value, limit) => String(value ?? "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .slice(0, limit)

const title = clean(issue.title, 500)
const body = clean(issue.body, 20_000)
const url = `https://github.com/${process.env.GITHUB_REPOSITORY}/issues/${issue.number}`

writeFileSync(destination, `# Issue #${issue.number}\n\nURL: ${url}\nTitle: ${title}\n\n## Description\n\n${body || "(No description provided.)"}\n`)

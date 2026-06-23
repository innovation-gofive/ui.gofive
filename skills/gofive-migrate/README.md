# GoFive Migrate — Agent Skill (slash command)

A user-invoked `/gofive-migrate` command for AI coding agents (Claude Code, …) that **migrates existing UI components in a React project to their GoFive equivalents** (`@gofive/*`) — it gates on the required dependencies, detects what you're using, installs the GoFive targets via the shadcn CLI, and rewrites imports and props.

## What it does

```
/gofive-migrate badge      # migrate just the badge → GoFive Tag
/gofive-migrate            # scan the whole project and migrate everything mappable
```

The command will:
1. **Gate on dependencies** — React, `components.json`, Tailwind v4, and the `@gofive` registry. If anything is missing it stops and tells you what to fix.
2. **Auto-detect** components from shadcn/ui, other libraries (MUI / Ant Design / Chakra), or your own custom components.
3. **Propose a plan** (what maps, what gets skipped, what needs install) and **wait for your OK** before editing.
4. **Install** the GoFive targets (`npx shadcn add @gofive/<name>`).
5. **Rewrite** imports + props, flagging anything that needs manual review with `// TODO(gofive-migrate)`.
6. **Verify** (typecheck / build) and print a summary.

It never deletes components that have no GoFive equivalent (e.g. Button, Card) — those are reported as skipped.

## Install

**Recommended — via the Skills CLI:**

```bash
npx skills add innovation-gofive/ui.gofive@gofive-migrate
```

Add `-g` to install globally (all projects) and `-a claude-code` to target a specific agent. Once installed it appears as the slash command **`/gofive-migrate`**.

Find it on skills.sh:

```bash
npx skills find gofive
```

**Manual install:** copy this `gofive-migrate/` folder into your project's `.claude/skills/` (or `.agents/skills/`) directory.

## Prerequisite — register the GoFive registry

Migration installs components via the shadcn CLI, so your project must register the GoFive registry once (the command checks this and reminds you):

```bash
npx shadcn@latest registry add @gofive=https://ui.coolify.tks.co.th/r/{name}.json
```

Your project must be a shadcn project (`components.json` present — run `npx shadcn@latest init` if not) using React + Tailwind CSS v4.

> Tip: commit or stash your work first so the rewrite is easy to review and revert.

## Pairs with the `gofive-ui` skill

Install the [`gofive-ui`](../gofive-ui/README.md) skill too so the agent has the full component catalog, exact props, and theming reference — the migrate command reads it for precise target APIs when present:

```bash
npx skills add innovation-gofive/ui.gofive@gofive-ui
```

## Contents

- `SKILL.md` — the `/gofive-migrate` command: dependency gate, detect, map, install, rewrite, verify.
- `references/migration-map.md` — source → GoFive mapping, import/export exceptions, and prop deltas.

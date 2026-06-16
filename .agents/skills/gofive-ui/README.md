# GoFive UI — Agent Skill

An [agent skill](https://skills.sh) that teaches AI coding agents (Claude Code, Cursor, etc.) how to install and use [GoFive](https://gofive.co.th) UI components correctly — the right `npx shadcn add @gofive/*` commands, import paths, exports, props, and theming — instead of guessing.

## What it does

Once installed, ask your agent things like:

> "Add a GoFive status tag and a date picker to this form."
> "Use the GoFive sheet for the details panel."
> "Switch the theme to the `venio` brand palette."

The agent will run the correct install commands (`npx shadcn add @gofive/badge`, `@gofive/datetime-picker`, …) and import from the right paths (`@/components/ui/gofive/tag-badge`, …) with accurate props.

It covers all 45 components, the theme (with runtime `data-brand` product palettes), fonts, and typography.

## Install

**Recommended — via the Skills CLI:**

```bash
npx skills add innovation-gofive/ui.gofive@gofive-ui
```

Add `-g` to install globally (all projects) and `-a claude-code` to target a specific agent. This pulls just the `gofive-ui` folder from the repo.

Find it on skills.sh:

```bash
npx skills find gofive
```

**Manual install:** copy this `gofive-ui/` folder into your project's `.claude/skills/` (or `.agents/skills/`) directory.

## Prerequisite — register the GoFive registry

The skill installs components via the shadcn CLI, so your project must register the GoFive registry once (the skill reminds the agent of this, but you can do it up front):

```bash
npx shadcn@latest registry add @gofive=https://ui.coolify.tks.co.th/r/{name}.json
```

Your project must be a shadcn project (`components.json` present — run `npx shadcn@latest init` if not) using React + Tailwind CSS.

## Contents

- `SKILL.md` — entry point: setup, install pattern, and the full component catalog.
- `references/components.md` — every component's exports, props, and a usage snippet.
- `references/theme.md` — theme, `data-brand` brands, semantic tokens, fonts, typography.

---
name: gofive-migrate
description: Migrate existing UI components in a React project to their GoFive equivalents (@gofive/*). Detects shadcn/ui, other libraries (MUI / Ant Design / Chakra), or custom components; checks required dependencies; installs the GoFive target via the shadcn CLI; and rewrites imports and props. Use only when the user explicitly runs /gofive-migrate.
argument-hint: "[component-name]   # optional — empty = scan the whole project"
disable-model-invocation: true
---

# GoFive Migrate

Replace existing UI components in a React project with the equivalent **GoFive** components (`@gofive/*`), end to end: gate on dependencies → detect what's used → map to GoFive → install the targets → rewrite imports and props → verify.

This is a **user-invoked slash command**. It edits source files, so it always **proposes a plan and waits for confirmation before touching anything**.

`$ARGUMENTS` =
- a component name (e.g. `badge`, `input`, `dialog`) → migrate **only** that component, or
- empty → **scan the whole project** and migrate everything that has a GoFive equivalent.

---

## 1. Preflight — dependency gate (do this first, every time)

The project **must** satisfy all of the following. **If any check fails, STOP and tell the user exactly what's missing — do not migrate anything.**

1. **React project** — `package.json` lists `react`.
2. **shadcn configured** — `components.json` exists at the project root. If not, instruct: `npx shadcn@latest init`.
3. **Tailwind CSS v4** — `package.json` has `tailwindcss` at `^4` and the global stylesheet uses `@import "tailwindcss"`. GoFive's theme targets Tailwind v4 — do not proceed on v3.
4. **GoFive registry registered** — `components.json` has a `registries` entry for `@gofive`. If missing, register it once:
   ```bash
   npx shadcn@latest registry add @gofive=https://ui.coolify.tks.co.th/r/{name}.json
   ```

Quick check (1–3):
```bash
test -f components.json && echo "shadcn: ok" || echo "shadcn: MISSING (run npx shadcn@latest init)"
node -e "const p=require('./package.json');const d={...p.dependencies,...p.devDependencies};console.log('react:', d.react?'ok':'MISSING');console.log('tailwind v4:', /^[~^]?4/.test(d.tailwindcss||'')?'ok':'NOT v4 ('+(d.tailwindcss||'absent')+')')"
```
Check 4 — confirm `@gofive` is present under `registries` in `components.json`.

Only when **all four pass** do you continue. Also strongly recommend the user has a **clean git tree** (commit/stash first) so the rewrite is reviewable and revertible.

## 2. Detect source components (auto-detect any source)

Search the project's source dirs (`app/`, `src/`, `components/`, `pages/` — skip `node_modules`, `.next`, `dist`) for component imports and JSX usage. Classify each into one of:

- **shadcn/ui** — imported from the local UI alias, e.g. `@/components/ui/<name>` (button, badge, input, dialog, …). Highest-confidence mapping (GoFive is a shadcn superset).
- **Other UI library** — `@mui/material`, `antd`, `@chakra-ui/react`, `react-bootstrap`, etc. Best-effort mapping — APIs differ a lot.
- **Custom / hand-rolled** — a local component that re-implements a primitive (e.g. a bespoke `Badge`/`Pill`). Judge case by case.

Build an **inventory**: for each detected component record `{ source library, component name, files, usage count }`. If `$ARGUMENTS` names one component, filter the inventory to just that.

## 3. Map source → GoFive

Read **`references/migration-map.md`** (bundled with this skill) — it is the source of truth for `source → @gofive/<install>`, the correct **import path** and **export name** (some differ, e.g. `badge` installs the `tag-badge` file and exports `Tag`), and the **prop deltas**.

For exact target props, also read the `gofive-ui` skill's `references/components.md` if that skill is installed; otherwise read the GoFive component source after it's added in step 5 (it lands in `@/components/ui/gofive/<file>.tsx`).

Bucket every inventory item into:
- **Direct** — same shape, only the import path changes (e.g. dialog, tooltip, tabs, avatar).
- **Prop change** — import path + some prop renames/values (e.g. badge→Tag with `warning`→`warn`; input `size`→`inputSize`).
- **Structural** — API shape differs enough to need a real rewrite, flag for review (e.g. shadcn composable `Select`/`Alert` → GoFive's `options`-prop / `status`-prop forms).
- **No GoFive equivalent → SKIP** — GoFive has **no** Button, Card, Accordion, Table, Popover, etc. **Never delete or break these** — leave them untouched and report them as skipped.

## 4. Propose the plan — and wait for confirmation

Show a concise table and **stop for the user's go-ahead** before editing:

| Source | → GoFive | Bucket | Files / usages | Needs install? | Notes |
|---|---|---|---|---|---|
| shadcn `Badge` | `@gofive/badge` (`Tag`) | prop change | 4 files / 11 | yes | `variant="secondary"`→`color`; `warning`→`warn` |
| shadcn `Button` | — | **skipped** | — | — | no GoFive equivalent |

List the GoFive components that will be installed, and call out every Structural item as "needs manual review."

## 5. Install the missing GoFive targets

For each mapped target not already present at `@/components/ui/gofive/<file>.tsx`:
```bash
npx shadcn@latest add @gofive/<name>
```
The shadcn CLI installs each component's npm deps (e.g. `radix-ui`, `lucide-react`) automatically. Install `@gofive/theme` if the project doesn't have the GoFive theme tokens yet (components depend on the semantic tokens / `--gf-*` ramp).

## 6. Rewrite usages

Per affected file:
- **Imports** — repoint to `@/components/ui/gofive/<file>` and fix export names (e.g. `Badge` → `Tag`). Watch the import-vs-install exceptions in the map (badge → `tag-badge`).
- **Props** — apply the prop deltas from the map (rename keys, remap enum values like `warning`→`warn`, `size`→`inputSize`).
- **Structural** — perform the rewrite (e.g. convert a composable `<Select><SelectItem/></Select>` into GoFive's `<Select options={[…]} />`). When a prop/behavior has no faithful mapping, **do not guess** — keep the closest equivalent and leave a `// TODO(gofive-migrate): <what to check>` comment, then flag it in the report.

## 7. Verify & report

- Run whatever the project has: `npx tsc --noEmit`, then `npm run lint` / `npm run build` if present. Fix obvious breakage you introduced.
- Print a summary:
  - **Migrated** — N components across M files
  - **Skipped** — list each + reason (no equivalent)
  - **Needs review** — every `TODO(gofive-migrate)` location + structural conversions
  - **Files changed** — full list
- Remind the user to review the diff (`git diff`) and run the app before committing.

---

## References
- `references/migration-map.md` — source → GoFive mapping, import/export exceptions, and prop deltas.
- (if installed) the `gofive-ui` skill's `references/components.md` — exact target exports/props, and `references/theme.md` for tokens.

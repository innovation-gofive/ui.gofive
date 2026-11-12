# Gofive Registry

Custom [shadcn](https://ui.shadcn.com) component registry by Gofive — plug-and-play UI components for any React + Tailwind project.

## Setup

Register the Gofive registry once in your project:

```bash
npx shadcn@latest registry add @gofive=https://ui.go5.online/r/{name}.json
```

After that, install any component with:

```bash
npx shadcn@latest add @gofive/<component-name>
```

Or install **every** component, theme, and font at once:

```bash
npx shadcn@latest add @gofive/all
```

---

## AI Agent Skill

Using an AI coding agent (Claude Code, Cursor, …)? Install the **Gofive UI** agent skill so your agent knows the full catalog, the correct `@gofive/*` install commands, import paths, props, and theming:

```bash
npx skills add innovation-gofive/ui.gofive@gofive-ui
```

Then just ask — e.g. *"add a Gofive status tag and a date picker"* — and the agent runs the right commands and imports. Discover it with `npx skills find gofive`. See [`skills/gofive-ui/README.md`](skills/gofive-ui/README.md) for details and manual install.

### Migrate command — `/gofive-migrate`

Already have a UI built on shadcn/ui, MUI, Ant Design, Chakra, or custom components? Install the **Gofive Migrate** skill to get a `/gofive-migrate` slash command that swaps your existing components for Gofive equivalents — it checks the required dependencies, installs the Gofive targets, and rewrites imports and props (and reports anything with no Gofive equivalent instead of breaking it):

```bash
npx skills add innovation-gofive/ui.gofive@gofive-migrate
```

```
/gofive-migrate badge      # migrate one component
/gofive-migrate            # scan and migrate the whole project
```

See [`skills/gofive-migrate/README.md`](skills/gofive-migrate/README.md) for details.

---

## Components

### AI, Collaboration & Motion

Full props and live examples on each component's docs page.

| Component | Group | What it is | Install |
| --- | --- | --- | --- |
| Tool Call | AI | A collapsible AI-agent tool-invocation row with live timer, status, pretty-printed arguments and result, copy, retry, and a ToolCallGroup that folds several calls into one line. | `npx shadcn@latest add @gofive/tool-call` |
| Thinking Indicator | AI | A small status pill for AI replies with an animated spinner, a shimmering label that rolls through caller-supplied phases (timer-driven or controlled), and a check plus completion message when done. | `npx shadcn@latest add @gofive/thinking-indicator` |
| Message Actions | AI | The quiet icon toolbar under an AI answer: copy with confirmation, regenerate with busy state and version pager, thumbs up/down with a portalled reasons popover, and read-aloud toggle, with every label localizable. | `npx shadcn@latest add @gofive/message-actions` |
| Decision Inbox | AI | A tray of open decisions, each a card with a title, optional detail and two quick answers, that confirms briefly then folds away, with a live pending count and an all-clear empty state. | `npx shadcn@latest add @gofive/decision-inbox` |
| Email Draft | AI | An agent-written email held for human review, with recipient chips, editable subject and body, a streaming state, and send / edit / discard with sent and discarded receipts. | `npx shadcn@latest add @gofive/email-draft` |
| Recommendation Card | AI | A suggestion card with a recommended option, a reason, a low/medium/high confidence signal, switchable alternatives, accept with a timed undo, and dismiss. | `npx shadcn@latest add @gofive/recommendation-card` |
| Change Summary | AI | A "what changed since last time" panel with a headline and grouped added/changed/removed items, optional before-to-after values and timestamps, collapsible when long. | `npx shadcn@latest add @gofive/change-summary` |
| Agent Tree | AI | Live tree of an orchestrator agent and its sub-agents with status, task, time, cost and tool tiles per card, rolled-up branch costs, folding, selection, and a resolve dialog for agents that need a person or failed. | `npx shadcn@latest add @gofive/agent-tree` |
| Trace Waterfall | AI | One agent run as a foldable waterfall of agent, sub-agent, LLM and tool spans on a shared time axis, with a live now line, per-row tokens and cost, a slowest-call tag, and keyboard-navigable details. | `npx shadcn@latest add @gofive/trace-waterfall` |
| Agent Handoff | AI | Relay view of a task passed between AI agents: one column per agent, handoff cards listing what was passed along (and lost), a task board, and forward-only assignment by drag or keyboard. | `npx shadcn@latest add @gofive/agent-handoff` |
| Thinking Steps | AI | Collapsible AI reasoning panel with a live elapsed timer and an ordered trail of search steps (source chips with tooltips) and thought steps, driven by a stream or a timed demo. | `npx shadcn@latest add @gofive/thinking-steps` |
| AI Answer | AI | An assistant answer with source cards, hover-preview citation chips, a streaming typewriter, follow-up questions and a copy/regenerate/feedback bar. | `npx shadcn@latest add @gofive/ai-answer` |
| Chat Composer | AI | An auto-growing AI chat input with Enter-to-send, IME-safe composition, model, folder and app pickers, Web Speech dictation and an optional busy-aware secondary action. | `npx shadcn@latest add @gofive/chat-composer` |
| Assistant Chat | AI | Compact AI assistant chat card with welcome suggestions, streaming replies, inline retry, IME-safe input and optional voice dictation. | `npx shadcn@latest add @gofive/assistant-chat` |
| Comment Thread | Collaboration | One comment with nested replies, a collapsible reply group, an optional resolve action, and a multiline reply composer that submits on Ctrl/Cmd + Enter. | `npx shadcn@latest add @gofive/comment-thread` |
| Reaction Bar | Collaboration | A compact set of toggleable social actions (like, comment, repost, share) with animated compact counts, controlled or uncontrolled state, and localizable labels. | `npx shadcn@latest add @gofive/reaction-bar` |
| Notification Stack | Collaboration | Inline, declarative stack of dismissible notice cards layered with scale/offset that expands on hover, focus or click to a full list, with semantic tones and a hidden-count summary. | `npx shadcn@latest add @gofive/notification-stack` |
| Profile Menu | Collaboration | Account trigger (avatar + name) that opens a portalled menu with a user header, profile-setup progress row with next-step CTA, grouped actions with icons, badges and shortcut hints, and a destructive sign-out item. | `npx shadcn@latest add @gofive/profile-menu` |
| Checklist | Collaboration | An onboarding task card with an animated progress bar, self-drawing checks, optional descriptions and actions, and a current-item highlight, fully controlled via completedIds and onToggle. | `npx shadcn@latest add @gofive/checklist` |
| Tips Panel | Collaboration | A container-query responsive grid of short tip cards with icon tile, one action, done confirmation, optional per-tip and bulk dismiss, and a scrolling body. | `npx shadcn@latest add @gofive/tips-panel` |
| Number Ticker | Motion | Odometer-style animated number with Intl.NumberFormat formatting, per-digit rolling columns, count-in on first view, and reduced-motion support. | `npx shadcn@latest add @gofive/number-ticker` |
| Text Reveal | Motion | Text that arrives word by word or letter by letter with a staggered fade, blur and rise, with Thai-aware segmentation, mount or scroll trigger and reduced-motion support. | `npx shadcn@latest add @gofive/text-reveal` |
| Grid Background | Motion | A decorative hairline grid that drifts behind its children, fades toward the edges, and can be uncovered by a growing circle on first view. | `npx shadcn@latest add @gofive/grid-background` |

### Gofive Font

Custom font family with four weights.

```bash
npx shadcn@latest add @gofive/fonts
```

This installs `lib/gofive-font.css` into your project. Import it in your root layout:

```tsx
// app/layout.tsx
import "@/lib/gofive-font.css"
```

Then use the font in your CSS:

```css
body {
  font-family: "Gofive", sans-serif;
}
```

| Weight | Value |
|--------|-------|
| Text | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |

---

### Tag & Badge

Semantic status tags, count badges, avatar chips, and typing indicators.

```bash
npx shadcn@latest add @gofive/badge
```

This installs `components/ui/gofive/tag-badge.tsx`. Requires `lucide-react` for icons.

#### Exports

```tsx
import { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip } from "@/components/ui/tag-badge"
```

---

#### `<Tag>`

The main building block. Renders a pill-shaped status tag.

```tsx
<Tag color="success" variant="soft">Active</Tag>
<Tag color="danger" variant="solid"><TagIcon><X /></TagIcon>Rejected</Tag>
<Tag color="info" variant="outline" size="lg">In Review</Tag>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `"success" \| "warn" \| "danger" \| "info" \| "neutral"` | `"neutral"` | Semantic color |
| `variant` | `"soft" \| "solid" \| "outline"` | `"soft"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height and text size |
| `square` | `boolean` | `false` | Use rounded-square instead of pill shape |
| `animation` | `"spin" \| "shimmer" \| "pop"` | — | Entry or loop animation |
| `className` | `string` | — | Extra Tailwind classes |
| `style` | `CSSProperties` | — | Inline style override |

**Colors**

| Color | When to use |
|-------|-------------|
| `success` | Active, approved, online, completed |
| `warn` | Pending, away, warning, expiring soon |
| `danger` | Error, rejected, busy, recording |
| `info` | In progress, new, syncing, informational |
| `neutral` | Draft, offline, archived, disabled |

**Variants**

| Variant | When to use |
|---------|-------------|
| `soft` | Default — low-emphasis status in tables, lists |
| `solid` | High-emphasis — alerts, live indicators, CTAs |
| `outline` | Subtle — secondary labels, action tags |

**Animations**

| Animation | Description |
|-----------|-------------|
| `spin` | Rotates the inner `<TagIcon>` continuously — good for loading states |
| `shimmer` | Light sweep across the tag — good for "New" or featured labels |
| `pop` | Scale-in entrance animation — good for just-saved or just-updated states |

```tsx
// Loading state
<Tag color="info" variant="soft" animation="spin">
  <TagIcon><Clock /></TagIcon>Syncing…
</Tag>

// New label
<Tag color="info" variant="solid" animation="shimmer">
  <TagIcon><Sparkles /></TagIcon>NEW
</Tag>

// Just saved
<Tag color="success" variant="solid" animation="pop">
  <TagIcon><Check /></TagIcon>Just saved
</Tag>
```

---

#### `<TagDot>`

A small filled circle that inherits `currentColor`. Use inside `<Tag>`.

```tsx
<Tag color="success" variant="soft">
  <TagDot />Online
</Tag>

// With pulse animation (live indicator)
<Tag color="danger" variant="solid">
  <TagDot pulse />Recording
</Tag>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pulse` | `boolean` | `false` | Pulsing ring animation for live/active states |

---

#### `<TagIcon>`

Wraps a Lucide (or any SVG) icon inside a `<Tag>`. Handles sizing and the `spin` animation target.

```tsx
<Tag color="warn" variant="soft">
  <TagIcon><AlertTriangle /></TagIcon>Warning
</Tag>

// Icon after text (action tag)
<Tag color="info" variant="outline">
  Continue<TagIcon><ArrowRight /></TagIcon>
</Tag>
```

Icons are automatically sized to `12×12px` (`size-3`).

---

#### `<TypingTag>`

Three-dot animated typing indicator. Accepts the same color/variant/size props as `<Tag>`.

```tsx
<TypingTag color="info">Somchai is typing</TypingTag>

// Without label
<TypingTag color="neutral" variant="outline" />
```

**Props** — same as `TagProps` minus `animation` (animation is built-in).

---

#### `<BadgeCount>`

Circular notification count badge. Typically overlaid on an icon or avatar.

```tsx
// Unread dot (no number)
<BadgeCount size="dot" />

// Small count
<BadgeCount size="sm">3</BadgeCount>

// Default
<BadgeCount>12</BadgeCount>

// Custom color
<BadgeCount bgColor="#0A66E0">99+</BadgeCount>
<BadgeCount bgColor="#F88411">NEW</BadgeCount>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"dot" \| "sm" \| "md"` | `"md"` | `dot` = 8px indicator with no text |
| `bgColor` | `string` | `"#D93A1A"` | Background color (any CSS color) |

---

#### `<AvatarChip>`

Pill with a circular avatar + name label + optional dismiss button. Used for multi-select person pickers and selected filter chips.

```tsx
<AvatarChip initials="AS" onDismiss={() => remove("AS")}>
  Anong Srisuk
</AvatarChip>

// Custom colors
<AvatarChip
  initials="NK"
  avatarBg="#0A66E0"
  style={{ backgroundColor: "#DDEAFC", color: "#063F89" }}
  onDismiss={() => remove("NK")}
>
  Nirut K.
</AvatarChip>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initials` | `string` | — | 1–2 letter abbreviation shown in the avatar circle |
| `avatarBg` | `string` | `"#F88411"` | Avatar circle background color |
| `avatarColor` | `string` | `"#ffffff"` | Avatar circle text color |
| `onDismiss` | `() => void` | — | If provided, shows an × button that calls this handler |
| `children` | `ReactNode` | — | Display name next to the avatar |
| `style` | `CSSProperties` | — | Override chip background/text color |

---

## Full Example

```tsx
import { Check, Clock, X, Sparkles } from "lucide-react"
import { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip } from "@/components/ui/tag-badge"

export function StatusRow() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status tags */}
      <Tag color="success" variant="soft"><TagDot />Active</Tag>
      <Tag color="warn" variant="soft"><TagIcon><Clock /></TagIcon>Pending</Tag>
      <Tag color="danger" variant="solid"><TagDot pulse />Live</Tag>

      {/* Loading */}
      <Tag color="info" variant="soft" animation="spin">
        <TagIcon><Clock /></TagIcon>Syncing…
      </Tag>

      {/* Featured */}
      <Tag color="info" variant="solid" animation="shimmer">
        <TagIcon><Sparkles /></TagIcon>NEW
      </Tag>

      {/* Typing indicator */}
      <TypingTag color="info">Somchai is typing</TypingTag>

      {/* Notification badge */}
      <BadgeCount>5</BadgeCount>

      {/* Person chip */}
      <AvatarChip initials="AS" onDismiss={() => {}}>
        Anong Srisuk
      </AvatarChip>
    </div>
  )
}
```

---

## Contributing

Components live in `registry/new-york/ui/` and `registry/new-york/lib/`. After editing, rebuild the registry JSON:

```bash
npx shadcn build
```

This regenerates the static files under `public/r/`.

# GoFive Registry

Custom [shadcn](https://ui.shadcn.com) component registry by GoFive — plug-and-play UI components for any React + Tailwind project.

## Setup

Register the GoFive registry once in your project:

```bash
npx shadcn@latest registry add @gofive=https://registry.gofive.co.th
```

After that, install any component with:

```bash
npx shadcn@latest add @gofive/<component-name>
```

---

## Components

### GoFive Font

Custom font family with four weights.

```bash
npx shadcn@latest add @gofive/gofive-font
```

This installs `lib/gofive-font.css` into your project. Import it in your root layout:

```tsx
// app/layout.tsx
import "@/lib/gofive-font.css"
```

Then use the font in your CSS:

```css
body {
  font-family: "GoFive", sans-serif;
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
npx shadcn@latest add @gofive/tag-badge
```

This installs `components/ui/tag-badge.tsx`. Requires `lucide-react` for icons.

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

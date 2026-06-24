# Gofive theme, brands, fonts & typography

## Theme — `@gofive/theme`

```bash
npx shadcn@latest add @gofive/theme
```

Installs `app/gofive-theme.css`. Import it in your global stylesheet **after** the Tailwind import:

```css
/* app/globals.css */
@import "tailwindcss";
@import "./gofive-theme.css";
```

The theme defines CSS variables consumed by every Gofive component. It includes light and dark mode (`.dark` class on an ancestor / `<html>`).

## Runtime brand switching — `data-brand`

Gofive ships per-product semantic palettes. Switch the active palette at runtime by setting `data-brand` on `<html>` (or any ancestor). Omit it for the base Gofive (orange) palette.

```html
<html data-brand="venio"> … </html>
```

Available brands: `empeo`, `calendio`, `venio`, `desk`, `shipx`, `salesbear`, `etaxgo`, `emconnect`.

```tsx
// Toggle a product theme dynamically
document.documentElement.dataset.brand = "calendio"
```

## Semantic tokens

Use the Tailwind color utilities backed by these variables (don't hard-code hex). Each semantic family has a base, a `-foreground`, a `-soft`, and a `-soft-foreground` variant:

- `primary` — brand accent (changes with `data-brand`)
- `success`, `warning`, `danger`, `info` — status colors (+ each `*-soft`)

Neutral ramp (raw CSS vars): text `--gf-fg-1 … --gf-fg-6`, borders `--gf-line-1/2/4`, surfaces `--gf-bg-2/3/4`, plus `--gf-white` / `--gf-black`.

```tsx
<div className="bg-success-soft text-success-soft-foreground">Saved</div>
<button className="bg-primary text-primary-foreground">Action</button>
```

See `registry/new-york/theme/gofive-theme.css` in the registry for the full token list and exact values.

## Font — `@gofive/fonts`

```bash
npx shadcn@latest add @gofive/fonts
```

Installs `lib/gofive-font.css` (weights: Text 400, Medium 500, SemiBold 600, Bold 700). Import it in your root layout, then apply the family:

```tsx
// app/layout.tsx
import "@/lib/gofive-font.css"
```
```css
body { font-family: "Gofive", sans-serif; }
```

## Typography — `@gofive/typography`

Depends on `@gofive/fonts` (the shadcn CLI pulls it in automatically). A single variant-driven component for the Gofive type scale:

```tsx
import { Typography } from "@/components/ui/gofive/typography"

<Typography variant="display">Hero</Typography>
<Typography variant="h2">Section</Typography>
<Typography variant="body">Paragraph copy.</Typography>
<Typography variant="caption" as="span">Footnote</Typography>
```

Variants: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `small`, `caption`. Use `as` / `asChild` to change the rendered element while keeping the styles.

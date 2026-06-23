# Migration map — source component → GoFive

Source of truth for `/gofive-migrate`. For each source component: the `@gofive/<install>` target, the **import path** + **export name** to use, the **bucket**, and the **prop deltas**.

**Install/import exceptions to remember**
- `@gofive/badge` installs the file **`tag-badge`** and the main export is **`Tag`** (not `Badge`).
- `@gofive/theme` / `@gofive/fonts` are **CSS**, not React imports.
- All GoFive components import from `@/components/ui/gofive/<file>` and are client components (`"use client"`).

**Buckets**
- **Direct** — same shape; only the import path (and sometimes export name) changes.
- **Prop change** — import path + rename some prop keys/values.
- **Structural** — API shape differs; needs a real rewrite. Always flag for manual review.
- **Skip** — no GoFive equivalent. **Never delete or break it.** Report it as skipped.

For exact target props always cross-check the `gofive-ui` skill's `references/components.md` (or the installed component source).

---

## 1. shadcn/ui → GoFive  (highest confidence — GoFive is a shadcn superset)

| shadcn (`@/components/ui/*`) | → GoFive install | Import / export | Bucket | Prop deltas / notes |
|---|---|---|---|---|
| `dialog` | `@gofive/dialog` | `@/components/ui/gofive/dialog` (same parts) | Direct | Same Radix parts (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`). |
| `sheet` | `@gofive/sheet` | `…/gofive/sheet` | Direct | Same parts; GoFive adds `SheetBody`. `SheetContent side="top\|right\|bottom\|left"`. |
| `drawer` | `@gofive/drawer` | `…/gofive/drawer` | Direct | Vaul-based like shadcn. Same parts. |
| `tooltip` | `@gofive/tooltip` | `…/gofive/tooltip` | Direct | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`. |
| `menubar` | `@gofive/menubar` | `…/gofive/menubar` | Direct | Same Radix parts. |
| `context-menu` | `@gofive/context-menu` | `…/gofive/context-menu` | Direct | Same Radix parts. |
| `tabs` | `@gofive/tabs` | `…/gofive/tabs` | Direct | `Tabs`,`TabsList`,`TabsTrigger`,`TabsContent`. GoFive adds `variant="underline\|pill\|segmented\|vertical"`. |
| `avatar` | `@gofive/avatar` | `…/gofive/avatar` | Direct | `Avatar`,`AvatarImage`,`AvatarFallback`. GoFive adds `size`, `status`, `AvatarStatusDot`, `AvatarGroup`. |
| `skeleton` | `@gofive/skeleton` | `…/gofive/skeleton` | Direct | GoFive adds `variant="shimmer\|pulse"`, `circle`. |
| `progress` | `@gofive/progress` | `…/gofive/progress` | Direct | `value` 0–100. GoFive adds `color`, `size`, and `ProgressRing`. |
| `radio-group` | `@gofive/radio-group` | `…/gofive/radio-group` | Direct | `RadioGroup`,`RadioGroupItem`. |
| `checkbox` | `@gofive/checkbox` | `…/gofive/checkbox` | Prop change | `checked`/`onCheckedChange` compatible (supports `"indeterminate"`). GoFive adds `size`. |
| `switch` | `@gofive/switch` | `…/gofive/switch` | Prop change | `checked`/`onCheckedChange` compatible. GoFive adds `size`. |
| `slider` | `@gofive/slider` | `…/gofive/slider` | Prop change | Radix array `value`/`defaultValue`, `min`/`max`/`step`. GoFive adds `showLabel`. |
| `textarea` | `@gofive/textarea` | `…/gofive/textarea` | Prop change | GoFive adds `state="error\|success"`, `maxLength` (counter), `autoResize`. |
| `input` | `@gofive/input` | `…/gofive/input` (`Input`) | Prop change | `size`→**`inputSize`** (`xs\|sm\|md\|lg`). GoFive adds `variant="filled\|underline"`, `state="error\|success"`, `leading`/`trailing`, `prefix`/`suffix`, `clearable`. Also `PasswordInput`, `NumberInput`. |
| `badge` | `@gofive/badge` | **`…/gofive/tag-badge`** (`Badge`→**`Tag`**) | Prop change | See §3. `variant` enum changes; add `color`; `destructive`→`color="danger"`. |
| `input-otp` | `@gofive/otp-input` | `…/gofive/otp-input` (`OTPInput`) | Structural | Composable `InputOTP/InputOTPGroup/InputOTPSlot` → single `<OTPInput length onChange />`. |
| `calendar` | `@gofive/calendar` | `…/gofive/calendar` | Structural | react-day-picker (`selected`/`onSelect`) → GoFive `mode`/`value`/`onChange` (plain JS dates). |
| `select` | `@gofive/select` | `…/gofive/select` (`Select`,`MultiSelect`) | Structural | See §3. Composable items → `options={[{label,value}]}`. |
| `alert` | `@gofive/alert` | `…/gofive/alert` (`Alert`) | Structural | See §3. `variant`+`AlertTitle`/`AlertDescription` → `status` + children. |
| `sonner` / `toast` | `@gofive/toast` | `…/gofive/toast` (`Toaster`,`toast`,`useToast`) | Structural | `toast(msg)` → `toast({ status, title, description })`; render `<Toaster/>` once. |
| `sidebar` | `@gofive/sidebar` | `…/gofive/sidebar` | Structural | shadcn's large provider system → GoFive's simpler `Sidebar`/`SidebarBrand`/`SidebarLabel`/`SidebarItem`/`SidebarRail`. |
| `toggle-group` | `@gofive/segmented` | `…/gofive/segmented` (`Segmented`,`SegmentedItem`) | Structural | Concept map. `value`/`onValueChange`, `fullWidth`. |
| `command` | `@gofive/search` | `…/gofive/search` (`CommandPalette`,`SearchInput`) | Structural | Concept map — controlled `open`/`onOpenChange`. |
| `navigation-menu` | `@gofive/navbar` | `…/gofive/navbar` | Structural | Concept map — different API. |

### shadcn components with NO GoFive equivalent → **SKIP** (leave untouched, report)
`button`, `card`, `accordion`, `alert-dialog`, `aspect-ratio`, `breadcrumb`, `carousel`, `chart`, `collapsible`, `dropdown-menu`, `form`, `hover-card`, `label`, `pagination`, `popover`, `resizable`, `scroll-area`, `separator`, `table`, `toggle`.

> `dropdown-menu`/`popover`: GoFive exposes no standalone version (it uses popovers internally). Only convert by hand if `menubar`/`context-menu` truly fits — otherwise skip.

---

## 2. Other libraries → GoFive  (best-effort — flag everything for review)

APIs differ substantially; treat all of these as **Structural** and leave `// TODO(gofive-migrate)` notes. Always confirm against `gofive-ui` `references/components.md`.

### MUI (`@mui/material`)
`Chip`→`@gofive/badge` (`Tag`) · `TextField`→`@gofive/input` · `Select`/`MenuItem`→`@gofive/select` · `Checkbox`→`@gofive/checkbox` · `Switch`→`@gofive/switch` · `Slider`→`@gofive/slider` · `Radio`/`RadioGroup`→`@gofive/radio-group` · `Dialog`→`@gofive/dialog` · `Drawer`→`@gofive/sheet` or `@gofive/drawer` · `Tooltip`→`@gofive/tooltip` · `Tabs`/`Tab`→`@gofive/tabs` · `Avatar`→`@gofive/avatar` · `LinearProgress`→`@gofive/progress`, `CircularProgress`→`@gofive/spinner` · `Skeleton`→`@gofive/skeleton` · `Alert`→`@gofive/alert` · `Snackbar`→`@gofive/toast`. **Skip:** `Button`, `Card`, `Paper`, `Box`, `Grid`, `Typography`(use `@gofive/typography` by hand), `Table`.

### Ant Design (`antd`)
`Tag`→`@gofive/badge` (`Tag`) · `Badge`→`@gofive/badge` (`BadgeCount`) · `Input`→`@gofive/input`, `Input.OTP`→`@gofive/otp-input` · `Select`→`@gofive/select`, `TreeSelect`→`@gofive/tree-select` · `Checkbox`→`@gofive/checkbox` · `Switch`→`@gofive/switch` · `Slider`→`@gofive/slider` · `Radio.Group`→`@gofive/radio-group` · `Rate`→`@gofive/rating` · `DatePicker`→`@gofive/datetime-picker`, `Calendar`→`@gofive/calendar`/`@gofive/scheduler` · `Modal`→`@gofive/dialog` · `Drawer`→`@gofive/sheet`/`@gofive/drawer` · `Tooltip`→`@gofive/tooltip` · `Tabs`→`@gofive/tabs` · `Steps`→`@gofive/stepper` · `Avatar`→`@gofive/avatar` · `Progress`→`@gofive/progress` · `Skeleton`→`@gofive/skeleton` · `Spin`→`@gofive/spinner` · `Alert`→`@gofive/alert` · `message`/`notification`→`@gofive/toast` · `Empty`→`@gofive/empty-state` · `Segmented`→`@gofive/segmented`. **Skip:** `Button`, `Card`, `Table`, `Form`, `Layout`, `Menu` (convert to `@gofive/sidebar`/`@gofive/navbar` by hand).

### Chakra UI (`@chakra-ui/react`)
`Tag`/`Badge`→`@gofive/badge` · `Input`→`@gofive/input`, `PinInput`→`@gofive/otp-input` · `Select`→`@gofive/select` · `Checkbox`→`@gofive/checkbox` · `Switch`→`@gofive/switch` · `Slider`→`@gofive/slider` · `Radio`/`RadioGroup`→`@gofive/radio-group` · `Modal`→`@gofive/dialog` · `Drawer`→`@gofive/sheet`/`@gofive/drawer` · `Tooltip`→`@gofive/tooltip` · `Tabs`→`@gofive/tabs` · `Avatar`→`@gofive/avatar` · `Progress`/`CircularProgress`→`@gofive/progress` · `Spinner`→`@gofive/spinner` · `Skeleton`→`@gofive/skeleton` · `Alert`→`@gofive/alert` · `useToast`→`@gofive/toast` · `Menu`→`@gofive/menubar`/`@gofive/context-menu`. **Skip:** `Button`, `Card`, `Box`, `Stack`, `Flex`, `Table`.

---

## 3. Detailed prop deltas (the tricky ones)

### `badge` → `@gofive/badge` (`Tag`)  — import from `tag-badge`
shadcn `<Badge variant="…">` → GoFive `<Tag color variant>`:

| shadcn | GoFive |
|---|---|
| `variant="default"` | `color="info"` (or brand) `variant="solid"` |
| `variant="secondary"` | `variant="soft"` + pick a `color` (`neutral` if unknown) |
| `variant="destructive"` | `color="danger" variant="solid"` |
| `variant="outline"` | `variant="outline"` |

Semantic value rename anywhere it appears: **`warning` → `warn`** (GoFive uses `warn` for amber). GoFive `Tag` colors: `success \| warn \| danger \| info \| neutral`; variants: `soft \| solid \| outline`; plus `size`, `square`, `animation`. Related exports: `TagDot`, `TagIcon`, `TypingTag`, `BadgeCount`, `AvatarChip`.

### `select` → `@gofive/select`
shadcn is composable:
```tsx
<Select value={v} onValueChange={setV}>
  <SelectTrigger><SelectValue placeholder="Pick…" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Apple</SelectItem>
    <SelectItem value="b">Banana</SelectItem>
  </SelectContent>
</Select>
```
GoFive uses an `options` prop:
```tsx
<Select
  options={[{ label: "Apple", value: "a" }, { label: "Banana", value: "b" }]}
  value={v} onValueChange={setV} searchable placeholder="Pick…"
/>
```
Collect every `<SelectItem>` into the `options` array. Multi-select → `MultiSelect`. Flag for review.

### `alert` → `@gofive/alert`
shadcn `<Alert variant="destructive"><AlertTitle/><AlertDescription/></Alert>` → GoFive `<Alert status="danger">…</Alert>` (`status: info | success | warn | danger`, plus `onDismiss`). Fold title/description into children. `destructive`→`danger`, `warning`→`warn`.

### `input-otp` → `@gofive/otp-input`
`<InputOTP maxLength={6}>…slots…</InputOTP>` → `<OTPInput length={6} value onChange mask />`. Drop the slot/group markup.

### toast / sonner → `@gofive/toast`
Render `<Toaster />` once near the root, then `toast({ status: "success", title, description })`. Map sonner's `toast.success(msg)` → `toast({ status: "success", title: msg })`.

---

## 4. Custom / hand-rolled components
Inspect the implementation. If it re-creates a GoFive primitive (a bespoke pill/tag, status chip, spinner, empty state…), map it to the closest `@gofive/*` from §1 and rewrite call sites. If it has bespoke behavior with no faithful GoFive match, **leave it as-is** and note it. Never silently drop custom props.

## 5. GoFive-only components (no common source — adopt by hand)
GoFive ships extras with no 1:1 source equivalent — suggest them when relevant but don't auto-migrate to them: `tag-input`, `scale` (NPS/CSAT), `validation`, `tree-select`, `person-picker`, `datetime-picker`, `picker` (color/emoji/icon), `media-picker`, `filter`, `search`, `empty-state`, `stepper`, `bottom-nav`, `attachment`, `scheduler`, `typography`, `rating`.

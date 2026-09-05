# Migration map — source component → Gofive

Source of truth for `/gofive-migrate`. For each source component: the `@gofive/<install>` target, the **import path** + **export name** to use, the **bucket**, and the **prop deltas**.

**Install/import exceptions to remember**
- `@gofive/badge` installs the file **`tag-badge`** and the main export is **`Tag`** (not `Badge`).
- `@gofive/theme` / `@gofive/fonts` are **CSS**, not React imports.
- All Gofive components import from `@/components/ui/gofive/<file>` and are client components (`"use client"`).

**Buckets**
- **Direct** — same shape; only the import path (and sometimes export name) changes.
- **Prop change** — import path + rename some prop keys/values.
- **Structural** — API shape differs; needs a real rewrite. Always flag for manual review.
- **Skip** — no Gofive equivalent. **Never delete or break it.** Report it as skipped.

For exact target props always cross-check the `gofive-ui` skill's `references/components.md` (or the installed component source).

---

## 1. shadcn/ui → Gofive  (highest confidence — Gofive is a shadcn superset)

| shadcn (`@/components/ui/*`) | → Gofive install | Import / export | Bucket | Prop deltas / notes |
|---|---|---|---|---|
| `dialog` | `@gofive/dialog` | `@/components/ui/gofive/dialog` (same parts) | Direct | Same Radix parts (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`). |
| `sheet` | `@gofive/sheet` | `…/gofive/sheet` (same parts) | Direct | Same Radix-Dialog parts. **Gofive adds `SheetBody`** (flex-1, scrollable, padded). `SheetContent`: `side="top\|right\|bottom\|left"` (default `right`), `showCloseButton` (default `true`). Layout: `SheetHeader` → `SheetBody` (scroll) → `SheetFooter`; put long content in `SheetBody`. |
| `drawer` | `@gofive/drawer` | `…/gofive/drawer` | Direct | Vaul-based like shadcn. Same parts. |
| `tooltip` | `@gofive/tooltip` | `…/gofive/tooltip` | Direct | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`. |
| `menubar` | `@gofive/menubar` | `…/gofive/menubar` | Direct | Same Radix parts. |
| `context-menu` | `@gofive/context-menu` | `…/gofive/context-menu` | Direct | Same Radix parts. |
| `tabs` | `@gofive/tabs` | `…/gofive/tabs` | Prop change | See §3. **Not Radix** (custom context). `value`/`defaultValue`/`onValueChange` match shadcn. `orientation="vertical"`→**`variant="vertical"`**; adds `variant` + `TabsTrigger badge`; no arrow-key nav / `asChild` / `forceMount`. |
| `avatar` | `@gofive/avatar` | `…/gofive/avatar` | Direct | `Avatar`,`AvatarImage`,`AvatarFallback` (drop-in). Gofive adds `Avatar` `size="xs\|sm\|md\|lg\|xl"` (default `md`) + `status="online\|away\|busy\|offline"`; `AvatarFallback` `color`/`gradient`; exports `AvatarStatusDot`, `AvatarGroup` (`max`→+N chip). All additive; status keeps full words (no `warning`→`warn`). |
| `skeleton` | `@gofive/skeleton` | `…/gofive/skeleton` | Direct | Gofive adds `variant="shimmer\|pulse"`, `circle`. |
| `progress` | `@gofive/progress` | `…/gofive/progress` | Direct | See §3. `value` (0–100) + `className` carry 1:1. Gofive adds `color` (enum **`warn`**, not `warning`) and `size="sm\|md\|lg"`; plus a separate **`ProgressRing`** (`size` = px number, not the enum). |
| `radio-group` | `@gofive/radio-group` | `…/gofive/radio-group` | Direct | `RadioGroup`,`RadioGroupItem`. |
| `checkbox` | `@gofive/checkbox` | `…/gofive/checkbox` (`Checkbox`) | Prop change | Drop-in Radix API (`checked`/`onCheckedChange`/`defaultChecked`/`disabled`/`name` carry 1:1). Indeterminate via **`checked="indeterminate"`** (no separate prop). Gofive adds `size="sm\|md\|lg"` (default `md`). |
| `switch` | `@gofive/switch` | `…/gofive/switch` (`Switch`) | Prop change | See §3. `checked`/`onCheckedChange` compatible. Gofive adds `size` plus built-in `label`/`description`/`withStateLabel` (`onLabel`/`offLabel`) — setting `label` wraps the control in its own `<label>`. |
| `slider` | `@gofive/slider` | `…/gofive/slider` (`Slider`) | Direct | Same API as shadcn — array `value`/`defaultValue`, `min`(0)/`max`(100)/`step`, `onValueChange`, `orientation`, `disabled`. No renames. Gofive adds one prop: **`showValue`** (boolean, default `false`) — NOT `showLabel`. |
| `textarea` | `@gofive/textarea` | `…/gofive/textarea` (`Textarea`) | Prop change | See §3. **No `onChange`** — use **`onValueChange(value:string)`** (`value`/`defaultValue` are `string`). Gofive adds `state="error\|success"`, `showCount`+`maxLength` (counter), `autoResize`, `containerClassName`. Default `placeholder="Write something…"`, `rows={4}`. |
| `input` | `@gofive/input` | `…/gofive/input` (`Input`) | Prop change | See §3. `size`→**`inputSize`** (`xs\|sm\|md\|lg`). **`onChange`→`onValueChange`** (native `onChange` omitted; callback gets the **string**, not an event); `value`/`defaultValue` are `string`-only. Gofive adds `variant="filled\|underline"`, `state="error\|success"`, `leading`/`trailing`, `prefix`/`suffix`, `clearable`, `containerClassName`. Also `PasswordInput`, `NumberInput` (numeric). |
| `badge` | `@gofive/badge` | **`…/gofive/tag-badge`** (`Badge`→**`Tag`**) | Prop change | See §3. `variant` enum changes; add `color`; `destructive`→`color="danger"`. |
| `input-otp` | `@gofive/otp-input` | `…/gofive/otp-input` (`OTPInput`) | Structural | See §3. Composable `InputOTP/…Slot` → single `<OTPInput length onValueChange />` (NOT `onChange`). |
| `calendar` | `@gofive/calendar` | `…/gofive/calendar` (`Calendar`) | Structural | See §3. rdp (`selected`/`onSelect`) → Gofive `mode`/`value`/`onChange` (plain dates); `disabled` matcher → predicate; no `mode="multiple"`. |
| `select` | `@gofive/select` | `…/gofive/select` (`Select`,`MultiSelect`) | Structural | See §3. Composable items → `options={[{label,value}]}`. |
| `alert` | `@gofive/alert` | `…/gofive/alert` (`Alert`) | Structural | See §3. `variant`+`AlertTitle`/`AlertDescription` → `status` + children. |
| `sonner` / `toast` | `@gofive/toast` | `…/gofive/toast` (`Toaster`,`toast`,`useToast`) | Structural | `toast(msg)` → `toast({ status, title, description })`; render `<Toaster/>` once. |
| `sidebar` | `@gofive/sidebar` | `…/gofive/sidebar` | Structural | shadcn's large provider system → Gofive's simpler `Sidebar`/`SidebarBrand`/`SidebarLabel`/`SidebarItem`/`SidebarRail`. |
| `toggle-group` | `@gofive/toggle-group` | `…/gofive/toggle` (`ToggleGroup`,`ToggleGroupItem`) | Drop-in | Same `ToggleGroupPrimitive.Root` props as shadcn — both `type="single"` and `type="multiple"` work. Ships in the same file as `toggle`; either name installs both. See §3 before reaching for `@gofive/segmented` instead. |
| `command` | `@gofive/search` | `…/gofive/search` (`CommandPalette`,`SearchInput`) | Structural | See §3. Flatten items → `items={SearchItem[]}`; controlled `open`/`onOpenChange`. |
| `navigation-menu` | `@gofive/navbar` | `…/gofive/navbar` (`Navbar`,`NavbarBrand`,`NavbarNav`,`NavbarItem`,`NavbarSpacer`,`NavbarActions`,`NavbarIconButton`) | Structural | See §3. Floating bar — needs an app-shell; `NavbarItem` is a `<button>`, no dropdown equiv. |

### shadcn components with NO Gofive equivalent → **SKIP** (leave untouched, report)
`button`, `card`, `accordion`, `alert-dialog`, `aspect-ratio`, `breadcrumb`, `carousel`, `chart`, `collapsible`, `dropdown-menu`, `form`, `hover-card`, `label`, `pagination`, `popover`, `resizable`, `scroll-area`, `separator`, `table`.

> `dropdown-menu`/`popover`: Gofive exposes no standalone version (it uses popovers internally). Only convert by hand if `menubar`/`context-menu` truly fits — otherwise skip.

---

## 2. Other libraries → Gofive  (best-effort — flag everything for review)

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
`@gofive/badge` installs the file **`tag-badge`**; the main export is **`Tag`** (not `Badge`). shadcn `<Badge variant="…">` → Gofive `<Tag color variant>`:

| shadcn | Gofive |
|---|---|
| `variant="default"` | `color="info"` (or brand) `variant="solid"` |
| `variant="secondary"` | `variant="soft"` + pick a `color` (`neutral` if unknown) |
| `variant="destructive"` | `color="danger" variant="solid"` |
| `variant="outline"` | `variant="outline"` |

**Real props / enums (from source):** `color?: success \| warn \| danger \| info \| neutral` (default **`neutral`**) · `variant?: soft \| solid \| outline` (default **`soft`**) · `size?: sm \| md \| lg` (default `md`) · `square?: boolean` · `animation?: spin \| shimmer \| pop`. Gofive has **no** `default`/`secondary` variant and **no** `primary`/`destructive` color — don't copy those values verbatim, map them per the table.

**Default trap:** a bare shadcn `<Badge>Text</Badge>` is solid/primary; a bare Gofive `<Tag>Text</Tag>` is a low-emphasis **grey soft** pill (`neutral`/`soft`). Always set `color`+`variant` explicitly when porting a default or primary badge.

**Icons must be wrapped in `<TagIcon>`** — a raw lucide/svg child renders unsized and won't animate:
```tsx
// shadcn
<Badge><Check />Active</Badge>
// gofive
<Tag color="success" variant="soft"><TagIcon><Check /></TagIcon>Active</Tag>
```
`animation="spin"` rotates the `<TagIcon>`; for a pulsing status dot use the separate boolean on `TagDot`: `<Tag color="danger"><TagDot pulse />Live</Tag>` (**not** `animation="pulse"`).

Semantic value rename anywhere it appears: **`warning` → `warn`** (Gofive uses `warn` for amber). Related exports: `TagDot`, `TagIcon`, `TypingTag`, `BadgeCount` (numeric/notification badge — where a shadcn count `Badge` goes), `AvatarChip`.

### `select` → `@gofive/select` (`Select`, `MultiSelect`, type `SelectOption`)
shadcn is composable:
```tsx
<Select value={v} onValueChange={setV}>
  <SelectTrigger><SelectValue placeholder="Pick…" /></SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruit</SelectLabel>
      <SelectItem value="a">🍎 Apple</SelectItem>
      <SelectItem value="b" disabled>Banana</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```
Gofive collapses the markup into a single `options` array of `SelectOption`:
```tsx
const options: SelectOption[] = [
  { value: "a", label: "Apple", icon: "🍎", group: "Fruit" },
  { value: "b", label: "Banana", disabled: true, group: "Fruit" },
]
<Select options={options} value={v} onValueChange={setV} placeholder="Pick…" />
```
Conversion rules — collect **every** `<SelectItem>` into one flat array:
- `<SelectItem value=…>Text</SelectItem>` → `{ value, label: "Text" }` (the item's children become `label`).
- `disabled` on an item → `{ disabled: true }`; an icon/emoji inside the item → `{ icon }`.
- shadcn's `<SelectGroup><SelectLabel>Heading</SelectLabel>…</SelectGroup>` has **no Gofive part** — flatten it: tag each option in that group with `group: "Heading"`. Gofive renders uppercase group headings automatically by the `group` field. **Don't drop the grouping.**
- `SelectOption` full shape: `value, label, description?, disabled?, icon?, dot? (CSS color for a status dot), group?, trailing? (right-aligned ReactNode)`. There is no `SelectTrigger`/`SelectValue`/`SelectContent`/`SelectItem`/`SelectGroup`/`SelectLabel` to import.

Prop deltas:
- `Select`: `value`/`defaultValue`/`onValueChange` are **single-string** (`(value: string) => void`). Added: `searchable` (default `false`), `searchPlaceholder`, `align="start|center|end"`, `triggerClassName`. `placeholder` defaults to `"Select…"`.
- `MultiSelect` (for any hand-rolled multi-select / `string[]` state): `value`/`defaultValue` are `string[]` and `onValueChange` is **`(value: string[]) => void`** — wire the handler to an array. Adds `showFooter` (default `true`), `selectAll` (default `true`); **`searchable` defaults `true`** here (opposite of `Select`).

Self-contained popover — no required shell/provider/parent. Flag for review.

### `alert` → `@gofive/alert`
Only the `Alert` component is exported (plus the `AlertStatus` type). There is **no** `AlertTitle`/`AlertDescription` and **no** `variant` prop.

shadcn:
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Sync failed</AlertTitle>
  <AlertDescription>We couldn't reach the server.</AlertDescription>
</Alert>
```
Gofive — fold title + description into a single children block (title as `<strong>`), map the variant to `status`, and move any explicit leading icon into the `icon` prop:
```tsx
<Alert status="danger" icon={<AlertCircle />} onClose={() => setOpen(false)}>
  <strong>Sync failed.</strong> We couldn't reach the server.
</Alert>
```
Prop deltas:
- `variant` → **`status`**: `default`→`info` (default), `destructive`→`danger`, `warning`→`warn`. Enum is `info | success | warn | danger`, default `info`.
- Dismiss button: pass **`onClose?: () => void`** (NOT `onDismiss`). When set, Gofive renders the trailing X button itself — delete any hand-rolled close button from shadcn.
- `icon?: React.ReactNode`: overrides the auto status icon; pass **`icon={null}`** to hide it. A status icon is shown by default, so don't also leave an explicit icon inside children (it would duplicate).
- `<AlertTitle>`/`<AlertDescription>` have no Gofive equivalent — collapse them into `children` (title as `<strong>…</strong>` inline, per the repo's own usage in `app/docs/alert/page.tsx`).

### `input-otp` → `@gofive/otp-input` (`OTPInput`)
shadcn is composable; Gofive is a single self-contained element (no provider, no parent shell, no slot/group parts):
```tsx
// shadcn
<InputOTP maxLength={6} value={v} onChange={setV}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />{/* … */}
  </InputOTPGroup>
</InputOTP>

// Gofive — drop ALL slot/group markup; one element renders the whole row
<OTPInput length={6} value={v} onValueChange={setV} onComplete={submit} />
```
Prop deltas:
- `maxLength` → **`length`** (default `6`).
- `onChange` → **`onValueChange`** — `OTPInput` *omits* the native `onChange`; this is the only change callback. Add `onComplete?: (value) => void` (fires once every cell is filled) if the source submitted on completion.
- Uncontrolled? use `defaultValue`; controlled? use `value` + `onValueChange`.
- `mask` (boolean) shows `•` per char (Gofive has no per-slot masking markup).
- Other props: `disabled`, `inputMode` (default `"numeric"`), `containerClassName` (styles the visible cell row), `className` (styles the transparent overlaid input — *not* the cells). There is **no** per-cell `index`/`slot` API.
- No layout shell or parent wrapper is required — this is a leaf input, not a composition.

### toast / sonner → `@gofive/toast`
Imports: `import { Toaster, toast } from "@/components/ui/gofive/toast"` (also `useToast`, plus styled primitives `Toast`/`ToastTitle`/… for custom renderers). The model is an imperative store, not composable JSX:
1. Mount **`<Toaster />` exactly once** near the app root (`app/layout.tsx`, after `{children}`). It renders the provider + bottom-right viewport and subscribes to the store. `Toaster` accepts only `swipeDirection="right|left|up|down"` (default `"right"`).
2. Call `toast(options)` from anywhere. `options` is an **object**, never a positional string:
   `toast({ status, title, description?, duration?, action? })`. Returns `{ id, dismiss, update }` for imperative control.

```tsx
// sonner                          // @gofive/toast
toast.success("Saved")            → toast({ status: "success", title: "Saved" })
toast.error("Failed")             → toast({ status: "danger",  title: "Failed" })   // no "error" status — use danger
toast.warning("Heads up")         → toast({ status: "warning", title: "Heads up" }) // full word "warning", NOT "warn"
toast.info("FYI")                 → toast({ status: "info",    title: "FYI" })
toast("Plain")                    → toast({ title: "Plain" })                        // status defaults to "info"
toast(t, { action: { label, onClick } }) → toast({ title: t, action: { label, onClick, altText? } })
toast.promise(...)                → no equivalent — hand-roll with the returned { update, dismiss }; // TODO(gofive-migrate)
```

Prop deltas:
- `status`: **`"success" | "warning" | "danger" | "info" | "neutral"`** (default `"info"`). **Trap:** toast keeps the full word **`warning`** — do **NOT** apply the `warning→warn` rename used for `badge`/`alert`; `status:"warn"` falls off the status map and renders wrong. `error`→`danger`.
- `duration`: number ms, default `5000`; drives the auto-dismiss progress bar.
- `action`: `{ label: string; onClick?: () => void; altText?: string }` (object, replaces sonner's `action: { label, onClick }`).
- `title`/`description` are `ReactNode`; description is optional.

Wiring is the only structural requirement (single `<Toaster/>` root) — there is no layout shell to rebuild. **Mirror the `<Toaster/>` mount in `app/docs/toast/page.tsx` (the `ToastDemo` wrapper) for the canonical placement.**

### `sidebar` → `@gofive/sidebar`  (the structural work is the layout shell, not the import)
Gofive's sidebar is **presentational and floating** — a `<Sidebar>` card (`rounded-xl border bg-background p-2.5`) plus `SidebarBrand`/`SidebarLabel`/`SidebarItem`/`SidebarSub`/`SidebarSubItem` and the icon-only `SidebarRail`/`SidebarRailItem`/`SidebarSeparator`. It has **none** of shadcn's machinery: no `SidebarProvider`/`useSidebar` context, no `SidebarInset`, no `SidebarTrigger`, no `collapsible="icon"`, no mobile sheet, no Cmd+B shortcut, no cookie-persisted state, and no `SidebarContent`/`SidebarGroup`/`SidebarMenu*` wrappers. **The consumer owns the layout shell** — that, not the import swap, is the real migration.

Recommended shell — a fixed-height app shell where the sidebar + header stay put and only the content scrolls. **Mirror `components/blocks/app-shell.tsx` if it exists** (this is exactly how the repo's own blocks do it):
```tsx
<div className="flex h-svh overflow-hidden">
  <Sidebar className="m-3 h-[calc(100svh-1.5rem)] shrink-0 overflow-y-auto max-md:hidden">
    <SidebarBrand logo="A">App</SidebarBrand>
    <SidebarLabel>Section</SidebarLabel>
    <SidebarItem icon={<Home />} active>Home</SidebarItem>
  </Sidebar>
  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
    <header className="shrink-0">…</header>
    <main className="flex-1 overflow-y-auto">{children}</main>
  </div>
</div>
```
- **Keep the floating card** — add `m-3 h-[calc(100svh-1.5rem)] overflow-y-auto`; **don't** strip `rounded`/`border` into a flush full-height panel.
- The shell being `h-svh overflow-hidden` is what makes the sidebar "sticky" (it never scrolls away) **and** gives the content its own scroll — you don't need `position: sticky`.
- Part mapping: `SidebarGroupLabel`→`SidebarLabel`; `SidebarMenu`/`SidebarMenuItem`/`SidebarMenuButton`→`SidebarItem` (drop the wrappers); `SidebarContent`/`SidebarGroup`/`SidebarGroupContent`→plain `div`s.
- `SidebarItem` is a `<button>`, **not** a link — there is no `asChild`. Use `onClick`/`router.push`, accept losing prefetch / open-in-new-tab / the collapsed-mode tooltip, and leave a `// TODO(gofive-migrate)`.
- Removing `SidebarProvider`/`SidebarInset`/`SidebarTrigger` drops collapse + the mobile drawer. Render the sidebar `max-md:hidden` (or rebuild a toggle by hand) and `// TODO(gofive-migrate)` the lost behaviors.

### `calendar` → `@gofive/calendar`
shadcn wraps **react-day-picker**; Gofive ships a self-contained `Calendar` on plain JS `Date` (no `date-fns`/rdp dependency). Remove the `react-day-picker` import.

shadcn (rdp):
```tsx
<Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} />
```
Gofive (controlled, plain dates):
```tsx
const [date, setDate] = useState<Date | null>(new Date())
<Calendar mode="single" value={date} onChange={(v) => setDate(v as Date)} />
```

Prop deltas (real props — `CalendarProps`, calendar.tsx):
- `selected` → **`value`**; `onSelect` → **`onChange`**. `onChange` returns the union `Date | CalendarRange | null`, so **cast at the call site** (`v as Date`, or `v as CalendarRange`).
- `mode="single" | "range"` (default `"single"`) — **`mode="multiple"` is NOT supported**; flag and drop it.
- Range: `value` is **`CalendarRange = { from: Date | null; to: Date | null }`** (not rdp's `DateRange`). Seed state as `useState<CalendarRange>({ from: null, to: null })`. No `numberOfMonths`/`showOutsideDays`/`fixedWeeks`.
- `disabled` is a **predicate** `(date: Date) => boolean`, not an rdp matcher — rewrite `disabled={{ before: x }}` → `disabled={(d) => d < x}`.
- `month`/`onMonthChange` (controlled view) → only **uncontrolled `defaultMonth?: Date`** (default: today).
- Gofive-only `calendar="day" | "month" | "year" | "quarter"` (default `"day"`, type `CalendarType`) selects granularity; clicking the header title drills up — no rdp equivalent.
- Also exports `isSameDay`, `startOfDay`, `MONTHS`, `MONTHS_SHORT`, `WEEKDAYS`, and types `CalendarRange`/`CalendarType`.

Mirror the controlled wiring in `app/docs/calendar/page.tsx` (single + range). For an input/popover trigger, the granularity flow is shown via `DatePicker`'s `calendar` prop in `app/docs/datetime-picker/page.tsx`. Bucket: **Structural** — flag for review.

### `toggle-group` → `@gofive/toggle-group`
**Drop-in — import swap only.** Gofive's `ToggleGroup`/`ToggleGroupItem` are built on the same
`ToggleGroupPrimitive.Root` as shadcn's and take the same props, so `type="single"`,
`type="multiple"`, `value`/`onValueChange` and per-item `variant`/`size` all carry over unchanged:
```diff
-import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
+import { ToggleGroup, ToggleGroupItem } from "@/components/ui/gofive/toggle"
```
Both live in the `toggle` item, so `shadcn add @gofive/toggle-group` and `shadcn add @gofive/toggle`
install the same file and give you `Toggle`, `toggleVariants`, `ToggleGroup` and `ToggleGroupItem`.

#### Alternative: `@gofive/segmented` (a design choice, not a migration target)
Reach for this only when you actually want Gofive's segmented-control look. It is a **different
component** — not Radix-based, single-select only — so converting to it is a structural rewrite that
costs you `type="multiple"`. Prefer the drop-in above unless the segmented styling is the point.

shadcn's composable toggle-group → Gofive's `Segmented`/`SegmentedItem` (same children-based shape, just renamed parts):
```tsx
// before (shadcn)
<ToggleGroup type="single" value={v} onValueChange={setV}>
  <ToggleGroupItem value="grid"><LayoutGrid/></ToggleGroupItem>
  <ToggleGroupItem value="list"><List/></ToggleGroupItem>
</ToggleGroup>

// after (Gofive)
<Segmented value={v} onValueChange={setV}>
  <SegmentedItem value="grid"><LayoutGrid/>Grid</SegmentedItem>
  <SegmentedItem value="list"><List/>List</SegmentedItem>
</Segmented>
```
Prop deltas:
- `ToggleGroupItem` → **`SegmentedItem`**; keep each item's `value`. `SegmentedItem` takes only `value`, `children`, `className` — drop any per-item `variant`/`size`/`pressed`.
- `value`/`onValueChange` carry over for the **single-select** case; `defaultValue` is supported (uncontrolled). `onValueChange` is `(value: string) => void`.
- Drop the `type` prop. Add `size="sm" | "md" | "lg"` (default `"md"`) and `fullWidth` on `<Segmented>` as needed.
- **Single-select only — the structural gap.** `Segmented`'s value is one `string` (no array, no `type="multiple"`). A `<ToggleGroup type="multiple">` cannot be faithfully converted: it silently loses multi-select. Keep the original multi-toggle, or model it as checkboxes/`@gofive/badge` toggles, and leave a `// TODO(gofive-migrate)`.
- **Don't confuse with `SegmentedControl`** — that's a separate, `options={[{value,label}]}`-array component exported from `@gofive/filter`, not `@gofive/segmented`.

Mirror the canonical usage in `app/docs/segmented/page.tsx` (controlled + `size`/`fullWidth`/icon examples).

### `command` → `@gofive/search` (`CommandPalette`)
shadcn's `command` is a **composable** subtree; Gofive's `CommandPalette` is a **controlled overlay driven by a flat data array** (it renders its own fixed overlay + dialog, returns `null` when `!open`, and groups/filters/highlights/keyboard-navigates internally). Flatten the markup into `items`:
```tsx
// shadcn (composable)
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={…}><Plus/> Create task…</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>

// Gofive (data-driven, controlled)
const items: SearchItem[] = [
  { id: "create-task", group: "Suggestions", title: "Create task…", icon: <Plus />, meta: "T", keywords: "new add todo" },
]
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  items={items}
  placeholder="Type a command…"
  emptyMessage="No results."
  onSelect={(item) => { /* run the command for item.id */ }}
/>
```
- **Collect every `<CommandItem>` into one `SearchItem[]`** (same idea as select's `options`): `<CommandGroup heading="X">` → `group: "X"` on each item; item label → `title`; leading icon → `icon`; trailing shortcut/badge → `meta`. `SearchItem` = `{ id, group, title, subtitle?, meta?, icon?, iconClassName?, avatar?, keywords? }` (`keywords` is matched but not shown).
- Per-item `onSelect` from `<CommandItem>` moves to the palette-level `onSelect(item)`; branch on `item.id`. `CommandEmpty` text → `emptyMessage`.
- **Drop the composable parts** — there is no `Command`/`CommandInput`/`CommandList`/`CommandGroup`/`CommandItem`/`CommandEmpty`/`CommandDialog`. Filtering, query highlighting, and ↑/↓/↵/Esc are built in — do not hand-roll them.
- `CommandPalette` requires controlled `open` + `onOpenChange` (closes on Esc, overlay click, or selection); wire a `useState(false)` and a ⌘K trigger. **Mirror the controlled wiring in `app/docs/search/page.tsx` (`PaletteExample`).** (Note: `components/blocks/app-shell.tsx` is NOT a reference — its search is a plain `<input>`, not this component.)
- For an inline (non-overlay) search box instead, use `SearchInput` (`value`/`onValueChange`, `kbdHint`, `pill`, `clearable`); for a dropdown results panel, compose `SearchResults` + `SearchGroup` + `SearchResult` + `SearchFooter`/`SearchSkeleton`/`SearchEmpty`. Other exports: `SearchScope`, `RecentSearches`, `SearchKbd`.

### `navigation-menu` → `@gofive/navbar`  (the structural work is the app-shell, not the import)

Gofive ships a **compound, presentational top bar** — no Radix navigation-menu machinery. Import these 7 parts from `…/gofive/navbar`:
`Navbar`, `NavbarBrand`, `NavbarNav`, `NavbarItem`, `NavbarSpacer`, `NavbarActions`, `NavbarIconButton` (type: `NavbarItemProps`).

Canonical composition:
```tsx
<Navbar>
  <NavbarBrand>App</NavbarBrand>
  <NavbarNav>
    <NavbarItem active>Workspace</NavbarItem>
    <NavbarItem>Records</NavbarItem>
  </NavbarNav>
  <NavbarSpacer />            {/* flex-1 — pushes actions to the right */}
  <NavbarActions>
    <NavbarIconButton aria-label="Notifications"><Bell /></NavbarIconButton>
    {/* search input / avatar are hand-composed children, not props */}
  </NavbarActions>
</Navbar>
```

Part mapping from shadcn navigation-menu:
- `NavigationMenu`/`NavigationMenuList` → `Navbar` + `NavbarNav` (the menu *is* the bar; there's no separate viewport).
- `NavigationMenuItem` → `NavbarItem` (label only).
- `NavigationMenuLink` → `NavbarItem`, but it's a `<button>` (`type="button"`, sets `aria-current="page"` when `active`) — **not a link**. No `href`/`asChild`. Use `onClick`/`router.push`; accept losing prefetch / open-in-new-tab and leave a `// TODO(gofive-migrate)`.
- `NavigationMenuTrigger` + `NavigationMenuContent` (dropdown panels) → **no equivalent**. Gofive navbar has no submenu/viewport. Rebuild with a `@gofive/menubar`/`@gofive/context-menu` or a popover by hand and `// TODO(gofive-migrate)`.

Prop deltas: `NavbarItem` takes only `active?: boolean` (default `false`); all other parts take just `className`/`children`. No `variant`/`size`/`orientation` enums.

**Layout is the real migration.** `Navbar` is a **floating fixed-height card** (`h-[52px] rounded-xl border bg-background px-4`), not a flush bar — keep it inside a gutter wrapper and an app shell so it floats and stays put while content scrolls. **Mirror `components/blocks/app-shell.tsx` if it exists** (its `AppTopbar` is exactly this):
```tsx
<div className="flex h-svh overflow-hidden">
  <Sidebar … />
  <div className="flex min-w-0 flex-1 flex-col">
    <div className="shrink-0 px-4 pt-3 sm:px-6">   {/* floating gutter for the bar */}
      <Navbar> … </Navbar>
    </div>
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
</div>
```
- **Don't** strip `rounded`/`border` to make it flush full-width — keep the floating card and the matching gutter (`px-4 pt-3`).
- The shell being `h-svh overflow-hidden` (not `position: sticky`) is what pins the bar while only `<main>` scrolls. Same shell as `sidebar` — share it.

### `input` → `@gofive/input` (`Input`, `PasswordInput`, `NumberInput`)
Same visual role as shadcn's input, but the **change handler and value types differ** — `InputProps` does `Omit<…"input", "size" | "prefix" | "value" | "defaultValue" | "onChange">`.

Prop deltas (`Input`):
- **`onChange` → `onValueChange`** — the native `onChange` is *removed* from the type and never fires. `onValueChange?: (value: string) => void` is the only change callback, and it receives the **raw string value, not a `ChangeEvent`**:
```tsx
// shadcn
<Input value={v} onChange={(e) => setV(e.target.value)} />
// Gofive — value is already the string
<Input value={v} onValueChange={setV} />
```
- `size` (native) → **`inputSize`** (`"xs" | "sm" | "md" | "lg"`, default `"md"`).
- `value`/`defaultValue` are **`string`-only** (native numeric/array omitted) — for numeric state use `NumberInput`.
- `state="error" | "success"` (also auto-derives from `aria-invalid`), `variant="filled" | "underline"` (default `"filled"`), `clearable` (X reset). `prefix`/`suffix` are static affixes; `leading`/`trailing` are icon slots inside the border. `containerClassName` styles the wrapper; `className` the inner `<input>`.

`NumberInput` — **different signature** (numeric): `value?: number` / `defaultValue?: number` (default `0`) / `onValueChange?: (value: number) => void` (fires the **clamped number**), plus `min`/`max`/`step` (default `step={1}`). `PasswordInput` — adds `defaultVisible?: boolean` (default `false`); owns the eye toggle. Self-contained leaf input — no provider/parent.

### `textarea` → `@gofive/textarea` (`Textarea`)
`TextareaProps` does `Omit<ComponentProps<"textarea">, "onChange" | "value" | "defaultValue">` and redefines them — the native event-based API is gone.

| shadcn | Gofive |
| --- | --- |
| `onChange={e => setX(e.target.value)}` | `onValueChange={setX}` (raw `string`, no event) |
| `value` / `defaultValue` (native) | `value?: string` / `defaultValue?: string` |
| `className` (only node) | `className` → inner `<textarea>`; **`containerClassName`** → bordered wrapper |
| (no validation prop) | `state="error" \| "success"` |
| `maxLength` only truncates | `maxLength` + **`showCount`** → live `used / max` counter |
| fixed height | `autoResize` grows to fit content |

Gotchas: a bare `<Textarea/>` is not empty — `placeholder` defaults to `"Write something…"`, `rows` to `4`. The counter needs **both** `showCount` and `maxLength`.

### `tabs` → `@gofive/tabs`
Exports match shadcn (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) and the `value`/`defaultValue`/`onValueChange` API is the same, so the common case is close to a drop-in. **But it's a hand-rolled context impl, not `@radix-ui/react-tabs`** — watch for:
- **`orientation` → `variant`.** There is **no `orientation` prop**; vertical tabs are `variant="vertical"` (an `orientation="vertical"` is silently ignored). Full enum `variant="underline | pill | segmented | vertical"`, default **`"underline"`**.
- **`TabsTrigger badge`** — Gofive-only `badge?: React.ReactNode` renders a count pill: `<TabsTrigger value="files" badge={3}>Files</TabsTrigger>`.
- **No keyboard nav** — triggers switch on `onClick` only (Radix's arrow-key/roving-tabindex is gone). No `asChild`/`forceMount`/`activationMode`/`dir`. `TabsContent` returns `null` while inactive (inactive-panel state is unmounted).

### `switch` → `@gofive/switch` (`Switch`)
Drop-in for the Radix-based shadcn `Switch` (`checked`/`defaultChecked`/`onCheckedChange`/`disabled`/`required`/`name` carry over). The deltas are additive props + a conditional wrapper:
- `size?: "sm" | "md" | "lg"` (default `"md"`, type `SwitchSize`); `label?`/`description?: ReactNode` (clickable text beside it); `withStateLabel?: boolean` (ON/OFF inside a wider track, words via `onLabel`/`offLabel`).
- **Wrapper gotcha:** when `label`/`description` is set, `Switch` wraps the Root in a `<div>` + associated `<label htmlFor>` (auto `id` via `useId()`). Fold a hand-rolled label in:
```tsx
// shadcn — hand-rolled wrapper
<label className="flex items-center gap-2.5"><Switch checked={v} onCheckedChange={setV} /> Email</label>
// Gofive — fold the text in, drop the wrapper
<Switch checked={v} onCheckedChange={setV} label="Email" />
```
Keeping your own `<label>`? leave `label`/`description` unset so it renders the bare control.

### `progress` → `@gofive/progress`
Base `<Progress value className />` is a drop-in. Two deltas:
- **`color` enum is `"primary" | "success" | "warn" | "danger" | "info"`** — it is **`warn`, not `warning`** (an unknown value silently yields no fill). Same rename as toast.
- **`size` is overloaded:** `<Progress size="sm" | "md" | "lg" />` (default `"md"`) is an enum (track height 4/6/10px), but `<ProgressRing size={number} />` (default `56`) is the **diameter in px**.

`ProgressRing` is a standalone circular meter (plain SVG, `role="progressbar"` — not a Radix part):
```tsx
<Progress value={60} color="warn" size="sm" />
<ProgressRing value={72} size={56} strokeWidth={4} color="success" />  // "72%" centered
<ProgressRing value={72}><Check className="size-4" /></ProgressRing>    // custom center content
```
`ProgressRing` props: `value` (0–100), `size` (px, default `56`), `strokeWidth` (default `4`), `color` (same enum), `showValue` (default `true`), `children` (overrides `showValue`).

---

## 4. Custom / hand-rolled components
Inspect the implementation. If it re-creates a Gofive primitive (a bespoke pill/tag, status chip, spinner, empty state…), map it to the closest `@gofive/*` from §1 and rewrite call sites. If it has bespoke behavior with no faithful Gofive match, **leave it as-is** and note it. Never silently drop custom props.

## 5. Gofive-only components (no common source — adopt by hand)
Gofive ships extras with no 1:1 source equivalent — suggest them when relevant but don't auto-migrate to them: `tag-input`, `scale` (NPS/CSAT), `validation`, `tree-select`, `person-picker`, `datetime-picker`, `picker` (color/emoji/icon), `media-picker`, `filter`, `search`, `empty-state`, `stepper`, `bottom-nav`, `attachment`, `scheduler`, `typography`, `rating`, `spinner` (loading indicator — also the `@gofive/spinner` target for MUI `CircularProgress` / antd `Spin` in §2).

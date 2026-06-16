# GoFive components reference

Every component: install command, import path, exported names (exact), key props, and a minimal usage snippet. Install with `npx shadcn@latest add @gofive/<name>` **before** importing. All components are client components (`"use client"`).

Common semantic colors across components: `success | warning | danger | info | neutral` (some use `warn` — see each entry).

---

## Inputs & Forms

### Input — `@gofive/input`
`import { Input, PasswordInput, NumberInput } from "@/components/ui/gofive/input"`
Props: `variant?: "filled" | "underline"`, `inputSize?: "xs" | "sm" | "md" | "lg"`, `state?: "error" | "success"`, `leading`/`trailing` icons, `prefix`/`suffix`, `clearable`.
```tsx
<Input placeholder="Email" leading={<Mail />} clearable />
<PasswordInput placeholder="Password" />
<NumberInput defaultValue={1} min={0} max={10} />
```

### Textarea — `@gofive/textarea`
`import { Textarea } from "@/components/ui/gofive/textarea"`
Props: `state?: "error" | "success"`, `maxLength` (shows counter), `autoResize`.
```tsx
<Textarea placeholder="Notes" maxLength={200} autoResize />
```

### OTP Input — `@gofive/otp-input`
`import { OTPInput } from "@/components/ui/gofive/otp-input"`
Props: `length` (default 6), `value`, `onChange`, `mask`.
```tsx
<OTPInput length={6} onChange={(code) => console.log(code)} />
```

### Checkbox — `@gofive/checkbox`
`import { Checkbox } from "@/components/ui/gofive/checkbox"`
Props: `size?: "sm" | "md" | "lg"`, `checked` (supports `"indeterminate"`), `onCheckedChange`.
```tsx
<Checkbox defaultChecked /> <Checkbox checked="indeterminate" />
```

### Radio Group — `@gofive/radio-group`
`import { RadioGroup, RadioGroupItem } from "@/components/ui/gofive/radio-group"`
```tsx
<RadioGroup defaultValue="a">
  <RadioGroupItem value="a" id="a" /> <RadioGroupItem value="b" id="b" />
</RadioGroup>
```

### Switch — `@gofive/switch`
`import { Switch } from "@/components/ui/gofive/switch"`
Props: `size?: "sm" | "md" | "lg"`, `checked`, `onCheckedChange`.
```tsx
<Switch defaultChecked />
```

### Slider — `@gofive/slider`
`import { Slider } from "@/components/ui/gofive/slider"`
Props (Radix-based): `value`/`defaultValue` (array), `min`, `max`, `step`, `orientation`, `showLabel`.
```tsx
<Slider defaultValue={[40]} max={100} step={1} showLabel />
<Slider defaultValue={[20, 80]} max={100} />   {/* two-thumb range */}
```

### Segmented Control — `@gofive/segmented`
`import { Segmented, SegmentedItem } from "@/components/ui/gofive/segmented"`
Props: `size?: "sm" | "md" | "lg"`, `fullWidth`, controlled `value`/`onValueChange`.
```tsx
<Segmented defaultValue="list">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</Segmented>
```

### Rating — `@gofive/rating`
`import { Rating } from "@/components/ui/gofive/rating"`
Props: `value`/`defaultValue`, `onChange`, `size?: "sm" | "md" | "lg"`, `readOnly`.
```tsx
<Rating defaultValue={3} onChange={setValue} />
```

### Tag Input — `@gofive/tag-input`
`import { TagInput } from "@/components/ui/gofive/tag-input"`
Props: `value`/`defaultValue` (string[]), `onChange`, `maxTags`, `placeholder`. Enter/comma adds, Backspace removes.
```tsx
<TagInput defaultValue={["react"]} onChange={setTags} maxTags={5} />
```

### Scale (NPS / CSAT) — `@gofive/scale`
`import { NPSScale, CSATScale } from "@/components/ui/gofive/scale"`
Props: `value`/`defaultValue`, `onChange`.
```tsx
<NPSScale onChange={setScore} />      {/* 0–10 numeric */}
<CSATScale onChange={setRating} />    {/* emoji selector */}
```

### Validation — `@gofive/validation`
`import { ValidationMessage, RuleList, Rule } from "@/components/ui/gofive/validation"`
`ValidationMessage` status: `error | warn | success | info`. `RuleList`/`Rule` for pass/fail checklists.
```tsx
<ValidationMessage status="error">Email is required</ValidationMessage>
<RuleList>
  <Rule passed>At least 8 characters</Rule>
  <Rule>One uppercase letter</Rule>
</RuleList>
```

---

## Selection & Pickers

### Select / MultiSelect — `@gofive/select`
`import { Select, MultiSelect } from "@/components/ui/gofive/select"`
Props: `options: SelectOption[]`, `value`/`defaultValue`, `onValueChange`, `searchable`, `placeholder`, `align`. `MultiSelect` adds chips, select-all, apply footer.
```tsx
<Select options={[{ label: "Apple", value: "a" }]} searchable placeholder="Pick…" />
<MultiSelect options={opts} onChange={setValues} />
```

### Tree Select — `@gofive/tree-select`
`import { TreeSelect, TreeMultiSelect } from "@/components/ui/gofive/tree-select"`
Props: `data: TreeNode[]`, `value`, `onChange`. `TreeMultiSelect` cascades parent/child with indeterminate state + apply footer.
```tsx
<TreeSelect data={tree} onChange={setNode} />
```

### Person Picker — `@gofive/person-picker`
`import { PersonPicker, PersonMultiPicker, ReviewerStack, PersonAvatar } from "@/components/ui/gofive/person-picker"`
Props: `people: Person[]`, `value`, `onChange`, invite-by-email fallback. `ReviewerStack` shows stacked avatars + review status.
```tsx
<PersonMultiPicker people={people} onChange={setAssignees} />
<ReviewerStack reviewers={reviewers} />
```

### DateTime Picker — `@gofive/datetime-picker`  (depends on `@gofive/calendar`)
`import { DatePicker, TimePicker, DateTimePicker, formatDate, formatTime } from "@/components/ui/gofive/datetime-picker"`
`DatePicker` props: `mode?: "single" | "range"`, `calendar?: "day" | "month" | "year" | "quarter"`, `value`, `onChange`, `footer`, `presets`, `error`.
```tsx
<DatePicker mode="single" value={date} onChange={setDate} />
<DatePicker mode="range" presets footer onChange={setRange} />
<DateTimePicker value={dt} onChange={setDt} />
```

### Calendar — `@gofive/calendar`
`import { Calendar, isSameDay, startOfDay, MONTHS, WEEKDAYS } from "@/components/ui/gofive/calendar"`
Self-contained month calendar (plain JS dates). Props: `mode?: "single" | "range"`, `value`, `onChange`.
```tsx
<Calendar mode="single" value={date} onChange={setDate} />
```

### Picker (color / emoji / icon) — `@gofive/picker`
`import { ColorPicker, ColorPanel, EmojiPicker, EmojiGrid, IconPicker, IconGrid } from "@/components/ui/gofive/picker"`
Each pairs a trigger with a Radix popover; `*Grid`/`*Panel` variants render inline.
```tsx
<ColorPicker value={color} onChange={setColor} />
<EmojiPicker onSelect={setEmoji} />
<IconPicker variant="outline" onSelect={setIcon} />
```

### Media Picker — `@gofive/media-picker`
`import { MediaPicker, MediaPanel, MediaPanelClose, MediaThumb } from "@/components/ui/gofive/media-picker"`
Tabs: Library, Upload, From URL, Unsplash. Available as popover (`MediaPicker`) or standalone (`MediaPanel`).
```tsx
<MediaPicker onInsert={(item) => setImage(item)} />
```

### Filter — `@gofive/filter`
`import { FilterChip, AddFilterChip, FilterBar, FilterButton, SegmentedControl, FilterBuilder, SavedViews, AppliedSummary } from "@/components/ui/gofive/filter"`
Toggle chips, a dropdown filter bar, an AND/OR condition builder, saved views, and an applied-result summary.
```tsx
<FilterBar>
  <FilterChip active>Active</FilterChip>
  <AddFilterChip onClick={openMenu} />
</FilterBar>
```

### Search — `@gofive/search`
`import { SearchInput, SearchScope, RecentSearches, CommandPalette, SearchResults, SearchResult, SearchGroup, SearchFooter, SearchSkeleton, SearchEmpty } from "@/components/ui/gofive/search"`
Styled search input (⌘K hint, clear), grouped results dropdown, and a controlled command palette.
```tsx
<SearchInput placeholder="Search…" onClear={() => setQ("")} />
<CommandPalette open={open} onOpenChange={setOpen} />
```

---

## Overlays & Menus

### Dialog — `@gofive/dialog`
`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/gofive/dialog"`
```tsx
<Dialog>
  <DialogTrigger asChild><button>Open</button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Confirm</DialogTitle></DialogHeader>
    <DialogDescription>Are you sure?</DialogDescription>
    <DialogFooter><DialogClose asChild><button>Cancel</button></DialogClose></DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet — `@gofive/sheet`
`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/gofive/sheet"`
Slides in from any edge. `SheetContent` takes a `side` prop (`top | right | bottom | left`).
```tsx
<Sheet>
  <SheetTrigger asChild><button>Details</button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Detail</SheetTitle></SheetHeader>
    <SheetBody>…</SheetBody>
  </SheetContent>
</Sheet>
```

### Drawer — `@gofive/drawer`  (bottom sheet, Vaul)
`import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/gofive/drawer"`
Drag-to-dismiss bottom sheet for mobile-style menus.
```tsx
<Drawer>
  <DrawerTrigger asChild><button>Open</button></DrawerTrigger>
  <DrawerContent><DrawerHeader><DrawerTitle>Actions</DrawerTitle></DrawerHeader></DrawerContent>
</Drawer>
```

### Tooltip — `@gofive/tooltip`
`import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/gofive/tooltip"`
Wrap the app once in `TooltipProvider`.
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><button>?</button></TooltipTrigger>
    <TooltipContent>Help text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Menubar — `@gofive/menubar`
`import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent } from "@/components/ui/gofive/menubar"`
```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### Context Menu — `@gofive/context-menu`
`import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from "@/components/ui/gofive/context-menu"`
```tsx
<ContextMenu>
  <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
  <ContextMenuContent><ContextMenuItem>Copy</ContextMenuItem></ContextMenuContent>
</ContextMenu>
```

### Toast — `@gofive/toast`
`import { Toaster, toast, useToast } from "@/components/ui/gofive/toast"`
Render `<Toaster />` once near the root, then call the imperative `toast()`.
```tsx
// layout: <Toaster />
toast({ status: "success", title: "Saved", description: "Your changes are live." })
```

---

## Feedback & Status

### Tag & Badge — `@gofive/badge`  ⚠️ imports from `tag-badge`
`import { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip } from "@/components/ui/gofive/tag-badge"`
`Tag` props: `color?: "success" | "warn" | "danger" | "info" | "neutral"`, `variant?: "soft" | "solid" | "outline"`, `size?: "sm" | "md" | "lg"`, `square`, `animation?: "spin" | "shimmer" | "pop"`.
```tsx
<Tag color="success" variant="soft"><TagDot />Active</Tag>
<Tag color="danger" variant="solid"><TagDot pulse />Live</Tag>
<Tag color="info" variant="soft" animation="spin"><TagIcon><Clock /></TagIcon>Syncing…</Tag>
<TypingTag color="info">Somchai is typing</TypingTag>
<BadgeCount>5</BadgeCount>  <BadgeCount size="dot" />
<AvatarChip initials="AS" onDismiss={() => {}}>Anong Srisuk</AvatarChip>
```
> `Tag` uses `warn` (not `warning`) for the amber color.

### Alert — `@gofive/alert`
`import { Alert } from "@/components/ui/gofive/alert"`
Props: `status?: "info" | "success" | "warn" | "danger"`, `onDismiss`.
```tsx
<Alert status="warn" onDismiss={() => {}}>Your trial ends in 3 days.</Alert>
```

### Empty State — `@gofive/empty-state`
`import { EmptyState } from "@/components/ui/gofive/empty-state"`
Props: `tone?: "neutral" | "info" | "success" | "warn" | "danger"`, `icon`, `title`, `description`, `action`.
```tsx
<EmptyState title="No results" description="Try another search." action={<button>Reset</button>} />
```

### Progress — `@gofive/progress`
`import { Progress, ProgressRing } from "@/components/ui/gofive/progress"`
Props: `value` (0–100), `color?`, `size?` (bar) / `diameter` (ring).
```tsx
<Progress value={60} color="success" />
<ProgressRing value={75} diameter={48}>75%</ProgressRing>
```

### Spinner — `@gofive/spinner`
`import { Spinner, LoadingDots } from "@/components/ui/gofive/spinner"`
Props: `size?`, `color?`.
```tsx
<Spinner size="md" /> <LoadingDots />
```

### Skeleton — `@gofive/skeleton`
`import { Skeleton } from "@/components/ui/gofive/skeleton"`
Props: `variant?: "shimmer" | "pulse"`, `circle`.
```tsx
<Skeleton className="h-4 w-32" /> <Skeleton circle className="size-10" />
```

### Stepper — `@gofive/stepper`
`import { Stepper } from "@/components/ui/gofive/stepper"`
Props: `steps: StepItem[]`, `current`, `orientation?: "horizontal" | "vertical"`.
```tsx
<Stepper current={1} steps={[{ title: "Cart" }, { title: "Pay" }, { title: "Done" }]} />
```

---

## Navigation

### Tabs — `@gofive/tabs`
`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/gofive/tabs"`
`Tabs` props: `variant?: "underline" | "pill" | "segmented" | "vertical"`, controlled `value`/`onValueChange`.
```tsx
<Tabs defaultValue="a" variant="underline">
  <TabsList><TabsTrigger value="a">One</TabsTrigger><TabsTrigger value="b">Two</TabsTrigger></TabsList>
  <TabsContent value="a">…</TabsContent>
</Tabs>
```

### Navbar — `@gofive/navbar`
`import { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarSpacer, NavbarActions, NavbarIconButton } from "@/components/ui/gofive/navbar"`
```tsx
<Navbar>
  <NavbarBrand>GoFive</NavbarBrand>
  <NavbarNav><NavbarItem active>Home</NavbarItem><NavbarItem>Docs</NavbarItem></NavbarNav>
  <NavbarSpacer /><NavbarActions><NavbarIconButton><Bell /></NavbarIconButton></NavbarActions>
</Navbar>
```

### Bottom Navigation — `@gofive/bottom-nav`
`import { BottomNav, BottomNavItem } from "@/components/ui/gofive/bottom-nav"`
```tsx
<BottomNav>
  <BottomNavItem active icon={<Home />}>Home</BottomNavItem>
  <BottomNavItem icon={<User />}>Me</BottomNavItem>
</BottomNav>
```

### Sidebar — `@gofive/sidebar`
`import { Sidebar, SidebarBrand, SidebarLabel, SidebarItem, SidebarSub, SidebarSubItem, SidebarRail, SidebarRailItem, SidebarSeparator } from "@/components/ui/gofive/sidebar"`
`SidebarRail`/`SidebarRailItem` give the collapsed icon-only variant.
```tsx
<Sidebar>
  <SidebarBrand>GoFive</SidebarBrand>
  <SidebarLabel>Main</SidebarLabel>
  <SidebarItem icon={<Home />} active>Home</SidebarItem>
</Sidebar>
```

---

## Display & Media

### Avatar — `@gofive/avatar`
`import { Avatar, AvatarImage, AvatarFallback, AvatarStatusDot, AvatarGroup } from "@/components/ui/gofive/avatar"`
Props: `size?: "xs" | "sm" | "md" | "lg" | "xl"`, `status?: "online" | "away" | "busy" | "offline"`. `AvatarGroup` overlaps with `max` + `+N` overflow.
```tsx
<Avatar size="md" status="online">
  <AvatarImage src="/a.jpg" /><AvatarFallback>AS</AvatarFallback>
</Avatar>
<AvatarGroup max={3}>{/* avatars */}</AvatarGroup>
```

### Attachment & Link — `@gofive/attachment`
`import { Dropzone, FileItem, LinkCard, RichLinkCard, MediaThumb, kindFromName, formatBytes } from "@/components/ui/gofive/attachment"`
File dropzone, uploaded-file rows (type icon, size, progress, remove), and link preview cards.
```tsx
<Dropzone onFiles={handleFiles} />
<FileItem name="report.pdf" size={482000} progress={100} onRemove={() => {}} />
```

### Scheduler — `@gofive/scheduler`
`import { Scheduler } from "@/components/ui/gofive/scheduler"`
Event calendar with Month/Week/Day views. Props: `events: SchedulerEvent[]`, `view?: "month" | "week" | "day"`.
```tsx
<Scheduler events={events} view="month" />
```

---

## Foundations

### Typography — `@gofive/typography`  (depends on `@gofive/fonts`)
`import { Typography } from "@/components/ui/gofive/typography"`
Props: `variant?: "display" | "h1" | "h2" | "h3" | "body-lg" | "body" | "small" | "caption"`, `as`, `asChild`.
```tsx
<Typography variant="h1">Title</Typography>
<Typography variant="body">Paragraph text.</Typography>
```

### Theme & Fonts
See `theme.md` — installing `@gofive/theme`, runtime `data-brand` product palettes, semantic tokens, and `@gofive/fonts`.

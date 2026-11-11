"use client"

import * as React from "react"
import { ArrowRight, ChevronDown, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Progress } from "./progress"
import { Tag } from "./tag-badge"

// ── Types ───────────────────────────────────────────────────────────
export interface ProfileMenuItem {
  /** Stable identity. Combined with the index for the React key. */
  id?: string
  label: string
  /** Leading icon. The slot is always reserved so labels line up. */
  icon?: React.ReactNode
  /** Short trailing pill, e.g. "New". */
  badge?: string
  /** Keyboard hint shown at the trailing edge (display only). */
  shortcut?: string
  destructive?: boolean
  disabled?: boolean
  /** Runs before the menu closes. Call `event.preventDefault()` to keep it open. */
  onSelect?: (event: Event) => void
}

export interface ProfileMenuGroup {
  id?: string
  /** Optional small heading for the group. */
  label?: string
  items: ProfileMenuItem[]
}

export interface ProfileMenuSetup {
  done: number
  total: number
  /** Name of the next open step. The CTA shows only while steps remain. */
  next?: string
  /** Runs before the menu closes. Call `event.preventDefault()` to keep it open. */
  onContinue?: (event: Event) => void
}

export interface ProfileMenuLabels {
  /** Names the trigger (after the user's name) and the open panel. */
  account: string
  /** Title of the setup block, also the progress bar's accessible name. */
  setupTitle: string
  /** Lead-in before the next step's name in the CTA. */
  nextStep: string
}

const DEFAULT_LABELS: ProfileMenuLabels = {
  account: "Account menu",
  setupTitle: "Finish your profile",
  nextStep: "Next step",
}

export interface ProfileMenuProps
  extends Omit<React.ComponentProps<"button">, "children" | "name" | "role"> {
  name?: string
  email: string
  /** Role or plan shown as a small tag in the header. */
  role?: string
  /** Avatar image URL. Falls back to the default glyph if it fails to load. */
  avatarSrc?: string
  /** Custom avatar content (initials, icon). Replaces the default glyph. */
  avatar?: React.ReactNode
  /** Flat actions, or groups separated by hairlines. Entries may be mixed. */
  items?: Array<ProfileMenuItem | ProfileMenuGroup>
  setup?: ProfileMenuSetup
  labels?: Partial<ProfileMenuLabels>
  /** Locale for the setup count. Defaults to the runtime locale. */
  locale?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"]
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"]
  /** Class for the portalled panel. `className` itself lands on the trigger. */
  panelClassName?: string
  /** Hide the name beside the trigger avatar (avatar-only trigger). */
  compact?: boolean
}

// ── Helpers ─────────────────────────────────────────────────────────
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null

type NormalGroup = { key: string; label?: string; items: ProfileMenuItem[] }

// Lenient on purpose: bad entries are dropped, consecutive bare items share a
// group, empty groups vanish so no stray separators are left behind.
function normalize(entries: ProfileMenuProps["items"]): NormalGroup[] {
  if (!Array.isArray(entries)) return []
  const out: NormalGroup[] = []
  let loose: NormalGroup | null = null
  entries.forEach((entry, i) => {
    if (!isObject(entry)) return
    if (Array.isArray((entry as ProfileMenuGroup).items)) {
      loose = null
      const g = entry as ProfileMenuGroup
      const items = g.items.filter(isObject)
      if (items.length) out.push({ key: g.id ?? `g${i}`, label: g.label, items })
      return
    }
    if (!loose) {
      loose = { key: `g${i}`, items: [] }
      out.push(loose)
    }
    loose.items.push(entry as ProfileMenuItem)
  })
  return out
}

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "")

// ── Header ──────────────────────────────────────────────────────────
function Header({
  name,
  email,
  role,
  avatarSrc,
  avatar,
}: Pick<ProfileMenuProps, "email" | "role" | "avatarSrc" | "avatar"> & {
  name: string
}) {
  return (
    <div
      data-slot="profile-menu-header"
      className="flex items-center gap-3 px-3 py-3"
    >
      <UserAvatar size="md" src={avatarSrc} avatar={avatar} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {(name || role) && (
          <div className="flex min-w-0 items-center gap-2">
            {name && (
              <span
                data-slot="profile-menu-name"
                dir="auto"
                title={name}
                className="min-w-0 truncate text-sm font-semibold text-popover-foreground"
              >
                {name}
              </span>
            )}
            {role && (
              <Tag
                data-slot="profile-menu-role"
                size="sm"
                color="neutral"
                title={role}
                className="max-w-[45%] shrink-0 truncate"
              >
                <span className="truncate">{role}</span>
              </Tag>
            )}
          </div>
        )}
        <span
          data-slot="profile-menu-email"
          dir="auto"
          title={email}
          className="truncate text-xs text-muted-foreground"
        >
          {email}
        </span>
      </div>
    </div>
  )
}

function UserAvatar({
  size,
  src,
  avatar,
}: {
  size: "sm" | "md"
  src?: string
  avatar?: React.ReactNode
}) {
  return (
    <Avatar
      data-slot="profile-menu-avatar"
      size={size}
      aria-hidden
      className="bg-primary-soft text-primary-soft-foreground"
    >
      {avatar ?? (
        <>
          {src && <AvatarImage src={src} alt="" />}
          <AvatarFallback className="bg-primary-soft text-primary-soft-foreground">
            <User className={size === "sm" ? "size-4" : "size-5"} aria-hidden />
          </AvatarFallback>
        </>
      )}
    </Avatar>
  )
}

// ── Setup progress ──────────────────────────────────────────────────
function Setup({
  setup,
  labels,
  locale,
}: {
  setup: ProfileMenuSetup
  labels: ProfileMenuLabels
  locale?: string
}) {
  const total = Number.isFinite(setup.total) ? Math.max(0, Math.floor(setup.total)) : 0
  const done = Number.isFinite(setup.done)
    ? Math.min(total, Math.max(0, Math.floor(setup.done)))
    : 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const complete = total > 0 && done >= total
  const next = clean(setup.next)
  const showCta = !!next && !complete

  // The panel mounts on every open, so the bar grows from empty each time.
  // Reduced motion skips straight to the final value.
  const [shown, setShown] = React.useState(false)
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const t = window.setTimeout(() => setShown(true), reduce ? 0 : 150)
    return () => window.clearTimeout(t)
  }, [])

  const fmt = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale)
    } catch {
      return new Intl.NumberFormat() // malformed locale tag
    }
  }, [locale])

  return (
    <div data-slot="profile-menu-setup" className="px-3 pb-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
        <span className="min-w-0 truncate font-medium text-popover-foreground">
          {labels.setupTitle}
        </span>
        <span
          data-slot="profile-menu-setup-count"
          className="shrink-0 tabular-nums text-muted-foreground"
        >
          {fmt.format(done)} / {fmt.format(total)}
        </span>
      </div>
      <Progress
        size="sm"
        value={shown ? pct : 0}
        aria-label={labels.setupTitle}
        aria-valuenow={pct}
        className="[&_[data-slot=progress-indicator]]:bg-primary [&_[data-slot=progress-indicator]]:duration-700 [&_[data-slot=progress-indicator]]:ease-out motion-reduce:[&_[data-slot=progress-indicator]]:transition-none"
      />
      {showCta && (
        // A real menu item, so arrow keys and typeahead reach it.
        <DropdownMenuItem
          data-slot="profile-menu-cta"
          onSelect={(e) => setup.onContinue?.(e)}
          className="group/cta mt-2 -mx-1 min-h-8 text-xs pointer-coarse:min-h-9"
        >
          <span dir="auto" className="min-w-0 flex-1 truncate">
            <span className="text-muted-foreground">{labels.nextStep}: </span>
            <span className="font-medium">{next}</span>
          </span>
          <ArrowRight
            aria-hidden
            className="transition-transform duration-200 group-focus/cta:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180 rtl:group-focus/cta:-translate-x-0.5"
          />
        </DropdownMenuItem>
      )}
    </div>
  )
}

// ── Action row ──────────────────────────────────────────────────────
function Row({ item }: { item: ProfileMenuItem }) {
  const label = clean(item.label)
  const badge = clean(item.badge)
  return (
    <DropdownMenuItem
      data-slot="profile-menu-item"
      variant={item.destructive ? "destructive" : "default"}
      disabled={item.disabled}
      onSelect={(e) => item.onSelect?.(e)}
      className="gap-2.5 pointer-coarse:min-h-10"
    >
      <span
        data-slot="profile-menu-item-icon"
        aria-hidden
        className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
      >
        {item.icon}
      </span>
      <span dir="auto" title={label} className="min-w-0 flex-1 truncate">
        {label}
      </span>
      {badge && (
        <Tag
          data-slot="profile-menu-item-badge"
          size="sm"
          color="info"
          title={badge}
          className="max-w-[50%] shrink-0"
        >
          <span className="truncate">{badge}</span>
        </Tag>
      )}
      {item.shortcut && (
        <DropdownMenuShortcut aria-hidden className="shrink-0 tracking-normal">
          {item.shortcut}
        </DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  )
}

// ── Group (optional heading) ────────────────────────────────────────
function Group({ group }: { group: NormalGroup }) {
  const headingId = React.useId()
  return (
    <DropdownMenuGroup
      data-slot="profile-menu-group"
      aria-labelledby={group.label ? headingId : undefined}
    >
      {group.label && (
        <DropdownMenuLabel
          id={headingId}
          data-slot="profile-menu-group-label"
          className="px-2 pt-1.5 pb-1 text-[11px] font-medium text-muted-foreground"
        >
          {group.label}
        </DropdownMenuLabel>
      )}
      {group.items.map((item, i) => (
        <Row key={`${item.id ?? "item"}-${i}`} item={item} />
      ))}
    </DropdownMenuGroup>
  )
}

// ── ProfileMenu ─────────────────────────────────────────────────────
function ProfileMenu({
  name,
  email,
  role,
  avatarSrc,
  avatar,
  items,
  setup,
  labels: labelsProp,
  locale,
  open,
  defaultOpen,
  onOpenChange,
  side,
  align = "end",
  panelClassName,
  compact = false,
  className,
  ...props
}: ProfileMenuProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const displayName = clean(name)
  const groups = normalize(items)
  const triggerText = displayName || email

  return (
    <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="profile-menu-trigger"
          aria-label={`${triggerText}, ${labels.account}`}
          className={cn(
            "group/trigger inline-flex h-10 max-w-full items-center gap-2 rounded-full border bg-background py-1 pr-3 pl-1 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-muted motion-reduce:transition-none",
            compact && "pr-1",
            className,
          )}
          {...props}
        >
          <UserAvatar size="sm" src={avatarSrc} avatar={avatar} />
          {!compact && (
            <>
              <span dir="auto" className="min-w-0 max-w-40 truncate">
                {triggerText}
              </span>
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-slot="profile-menu"
        aria-label={labels.account}
        side={side}
        align={align}
        collisionPadding={8}
        className={cn(
          "flex w-72 max-w-[calc(100vw-1rem)] flex-col overflow-hidden p-0",
          panelClassName,
        )}
      >
        <Header
          name={displayName}
          email={email}
          role={clean(role)}
          avatarSrc={avatarSrc}
          avatar={avatar}
        />
        {setup && isObject(setup) && (
          <Setup setup={setup} labels={labels} locale={locale} />
        )}
        {groups.length > 0 && (
          <div
            data-slot="profile-menu-list"
            className="min-h-0 max-h-80 overflow-y-auto overscroll-contain border-t p-1"
          >
            {groups.map((g, i) => (
              <React.Fragment key={g.key}>
                {i > 0 && <DropdownMenuSeparator className="mx-1" />}
                <Group group={g} />
              </React.Fragment>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProfileMenu }

"use client"

import * as React from "react"
import { Popover as RadixPopover } from "radix-ui"
import { ResponsivePopover as PopoverPrimitive, useIsBottomSheet } from "./responsive-popover"
import { Check, ChevronDown, Search, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Shared popover panel (matches picker.tsx PANEL_CLASS) ───────────
const PANEL_CLASS =
  "z-50 origin-(--radix-popover-content-transform-origin) rounded-xl border bg-popover p-0 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

const TRIGGER_CLASS =
  "flex w-full items-center gap-2.5 rounded-[10px] border bg-card px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

// ── Data model ──────────────────────────────────────────────────────
export interface Person {
  id: string
  name: string
  email?: string
  role?: string
  avatarColor?: string
  initials?: string
  presence?: "online" | "away" | "offline"
  group?: string
  /** Per-person status text used by ReviewerStack rows. */
  status?: string
  statusTone?: "success" | "warning" | "danger" | "muted"
}

// ── Helpers ─────────────────────────────────────────────────────────
const HASH_COLORS = [
  "#F88411", "#0A66E0", "#1DA577", "#5E5EED",
  "#D93A1A", "#7A5800", "#116DFC", "#E677B7",
  "#0891B2", "#52525F",
]

function computeInitials(person: Person): string {
  if (person.initials) return person.initials
  const parts = person.name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function avatarColor(person: Person): string {
  if (person.avatarColor) return person.avatarColor
  let hash = 0
  for (let i = 0; i < person.id.length; i++) {
    hash = (hash * 31 + person.id.charCodeAt(i)) | 0
  }
  return HASH_COLORS[Math.abs(hash) % HASH_COLORS.length]
}

const PRESENCE_COLOR: Record<NonNullable<Person["presence"]>, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  offline: "var(--muted-foreground)",
}

const PRESENCE_LABEL: Record<NonNullable<Person["presence"]>, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
}

const PRESENCE_TEXT: Record<NonNullable<Person["presence"]>, string> = {
  online: "text-success",
  away: "text-warning",
  offline: "text-muted-foreground",
}

const TONE_TEXT: Record<NonNullable<Person["statusTone"]>, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-muted-foreground",
}

function firstNameShort(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

function matches(person: Person, q: string): boolean {
  const haystack = `${person.name} ${person.email ?? ""} ${person.role ?? ""} ${person.group ?? ""}`.toLowerCase()
  return haystack.includes(q.trim().toLowerCase())
}

function groupPeople(people: Person[]): { label: string | null; items: Person[] }[] {
  const order: (string | null)[] = []
  const map = new Map<string | null, Person[]>()
  for (const p of people) {
    const key = p.group ?? null
    if (!map.has(key)) {
      map.set(key, [])
      order.push(key)
    }
    map.get(key)!.push(p)
  }
  return order.map((label) => ({ label, items: map.get(label)! }))
}

// ── PersonAvatar (self-contained colored-initials circle) ──────────
export interface PersonAvatarProps {
  person: Person
  size?: number
  showPresence?: boolean
  className?: string
}

function PersonAvatar({
  person,
  size = 26,
  showPresence = false,
  className,
}: PersonAvatarProps) {
  const dot = Math.max(7, Math.round(size * 0.3))
  return (
    <span
      data-slot="person-avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: avatarColor(person),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {computeInitials(person)}
      {showPresence && person.presence && (
        <span
          aria-label={PRESENCE_LABEL[person.presence]}
          className="absolute bottom-0 right-0 rounded-full border-[1.5px] border-card"
          style={{
            width: dot,
            height: dot,
            backgroundColor: PRESENCE_COLOR[person.presence],
          }}
        />
      )}
    </span>
  )
}

// ── Search box ──────────────────────────────────────────────────────
function PickerSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  // Autofocus in a bottom sheet pops the keyboard over the options.
  const autoFocus = !useIsBottomSheet()

  return (
    <div className="flex items-center gap-2 border-b px-3 py-2.5">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  )
}

// ── useControllable ─────────────────────────────────────────────────
function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void,
): [T, (v: T) => void] {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const current = isControlled ? (value as T) : internal
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )
  return [current, set]
}

// ── PersonPicker (single) ───────────────────────────────────────────
export interface PersonPickerProps {
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  people: Person[]
  placeholder?: string
  searchable?: boolean
  onInvite?: (query: string) => void
  className?: string
}

function PersonPicker({
  value,
  defaultValue,
  onValueChange,
  people,
  placeholder = "Select a person…",
  searchable = true,
  onInvite,
  className,
}: PersonPickerProps) {
  const [selectedId, setSelectedId] = useControllable(value, defaultValue ?? "", onValueChange)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const selected = people.find((p) => p.id === selectedId)
  const filtered = React.useMemo(
    () => (query ? people.filter((p) => matches(p, query)) : people),
    [people, query],
  )
  const groups = React.useMemo(() => groupPeople(filtered), [filtered])

  const choose = (id: string) => {
    setSelectedId(id)
    setOpen(false)
    setQuery("")
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setQuery("")
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="person-picker-trigger"
          className={cn(TRIGGER_CLASS, "py-1.5 text-left", className)}
        >
          {selected ? (
            <>
              <PersonAvatar person={selected} showPresence />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-semibold">{selected.name}</span>
                {(selected.role || selected.email) && (
                  <span className="truncate text-[11px] text-muted-foreground">
                    {selected.role ?? selected.email}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="person-picker-popover"
          align="start"
          sideOffset={6}
          className={cn(PANEL_CLASS, "w-[var(--radix-popover-trigger-width)] min-w-[280px]")}
        >
          {searchable && (
            <PickerSearch
              value={query}
              onChange={setQuery}
              placeholder="Search by name, email, team…"
            />
          )}
          <div className="max-h-[300px] overflow-y-auto py-1.5">
            {filtered.length === 0 && <EmptyState>No people found</EmptyState>}
            {groups.map((g, gi) => (
              <div key={g.label ?? `g-${gi}`}>
                {g.label && <GroupHeading>{g.label}</GroupHeading>}
                {g.items.map((person) => {
                  const isSelected = person.id === selectedId
                  return (
                    <button
                      key={person.id}
                      type="button"
                      data-slot="person-picker-option"
                      onClick={() => choose(person.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-accent",
                        isSelected && "bg-accent",
                      )}
                    >
                      <PersonAvatar person={person} showPresence />
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate text-sm font-medium">{person.name}</span>
                        {(person.email || person.role) && (
                          <span className="truncate text-[11.5px] text-muted-foreground">
                            {person.email ?? person.role}
                          </span>
                        )}
                      </span>
                      {isSelected ? (
                        <Check className="ml-auto size-4 shrink-0 text-primary" />
                      ) : person.presence ? (
                        <span
                          className={cn(
                            "ml-auto shrink-0 text-[11.5px] font-semibold",
                            PRESENCE_TEXT[person.presence],
                          )}
                        >
                          {PRESENCE_LABEL[person.presence]}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          {onInvite && (
            <button
              type="button"
              data-slot="person-picker-invite"
              onClick={() => {
                onInvite(query)
                setOpen(false)
                setQuery("")
              }}
              className="flex w-full items-center gap-2.5 border-t px-3 py-2.5 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Plus className="size-4" />
              </span>
              Invite someone by email…
            </button>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ── PersonMultiPicker ───────────────────────────────────────────────
export interface PersonMultiPickerProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (ids: string[]) => void
  people: Person[]
  placeholder?: string
  searchable?: boolean
  showFooter?: boolean
  className?: string
}

function PersonMultiPicker({
  value,
  defaultValue,
  onValueChange,
  people,
  placeholder = "Add assignees…",
  searchable = true,
  showFooter = true,
  className,
}: PersonMultiPickerProps) {
  const [selectedIds, setSelectedIds] = useControllable<string[]>(
    value,
    defaultValue ?? [],
    onValueChange,
  )
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const selected = people.filter((p) => selectedIds.includes(p.id))
  const filtered = React.useMemo(
    () => (query ? people.filter((p) => matches(p, query)) : people),
    [people, query],
  )

  const toggle = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setQuery("")
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="person-multi-trigger"
          className={cn(
            TRIGGER_CLASS,
            "min-h-[42px] flex-wrap py-1.5",
            className,
          )}
        >
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map((person) => (
              <span
                key={person.id}
                data-slot="person-chip"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent py-0.5 pl-0.5 pr-1.5 text-xs font-medium text-accent-foreground"
              >
                <PersonAvatar person={person} size={18} />
                {firstNameShort(person.name)}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${person.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(person.id)
                  }}
                  className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </span>
              </span>
            ))
          )}
          {selected.length > 0 && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {selected.length} {selected.length === 1 ? "assignee" : "assignees"}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              selected.length === 0 && "ml-auto",
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="person-multi-popover"
          align="start"
          sideOffset={6}
          className={cn(PANEL_CLASS, "w-[var(--radix-popover-trigger-width)] min-w-[300px]")}
        >
          {searchable && (
            <PickerSearch
              value={query}
              onChange={setQuery}
              placeholder="Search people…"
            />
          )}
          <div className="max-h-[280px] overflow-y-auto py-1.5">
            {filtered.length === 0 && <EmptyState>No people found</EmptyState>}
            {filtered.map((person) => {
              const checked = selectedIds.includes(person.id)
              return (
                <button
                  key={person.id}
                  type="button"
                  data-slot="person-multi-option"
                  onClick={() => toggle(person.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-accent"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background",
                    )}
                  >
                    {checked && <Check className="size-3" />}
                  </span>
                  <PersonAvatar person={person} />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">{person.name}</span>
                    {(person.role || person.email) && (
                      <span className="truncate text-[11.5px] text-muted-foreground">
                        {person.role ?? person.email}
                      </span>
                    )}
                  </span>
                  {person.presence && (
                    <span
                      className={cn(
                        "ml-auto shrink-0 text-[11.5px] font-semibold",
                        PRESENCE_TEXT[person.presence],
                      )}
                    >
                      {person.presence === "offline" ? "" : "● "}
                      {PRESENCE_LABEL[person.presence]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {showFooter && (
            <div className="flex items-center justify-between gap-2 border-t px-3 py-2.5">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Assign ({selectedIds.length})
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ── ReviewerStack ───────────────────────────────────────────────────
export interface ReviewerStackProps {
  people: Person[]
  max?: number
  className?: string
}

function ReviewerStack({ people, max = 3, className }: ReviewerStackProps) {
  const [open, setOpen] = React.useState(false)
  const visible = people.slice(0, max)
  const overflow = people.length - visible.length

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          type="button"
          data-slot="reviewer-stack-trigger"
          className={cn(TRIGGER_CLASS, "gap-2 py-1.5", className)}
        >
          <span className="flex items-center">
            {visible.map((person, i) => (
              <span
                key={person.id}
                className={cn("rounded-full ring-2 ring-card", i > 0 && "-ml-2")}
              >
                <PersonAvatar person={person} size={24} />
              </span>
            ))}
            {overflow > 0 && (
              <span className="-ml-2 inline-flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-card">
                +{overflow}
              </span>
            )}
          </span>
          <span className="text-[12.5px] text-muted-foreground">
            {people.length} {people.length === 1 ? "reviewer" : "reviewers"}
          </span>
          <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          data-slot="reviewer-stack-popover"
          align="start"
          sideOffset={6}
          className={cn(PANEL_CLASS, "min-w-[280px]")}
        >
          <div className="flex items-center justify-between px-3 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
            <span>Reviewers</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto pb-1.5">
            {people.map((person) => (
              <div
                key={person.id}
                data-slot="reviewer-stack-row"
                className="flex items-center gap-2.5 px-3 py-1.5"
              >
                <PersonAvatar person={person} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {person.name}
                </span>
                {person.status && (
                  <span
                    className={cn(
                      "shrink-0 text-[12px] font-semibold",
                      TONE_TEXT[person.statusTone ?? "muted"],
                    )}
                  >
                    {person.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}

export {
  PersonPicker,
  PersonMultiPicker,
  ReviewerStack,
  PersonAvatar,
}

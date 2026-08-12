"use client"

import * as React from "react"
import {
  ResponsivePopover as PopoverPrimitive,
  useIsBottomSheet,
} from "./responsive-popover"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Shared option model ─────────────────────────────────────────────
export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  icon?: React.ReactNode
  /** CSS color for a leading status dot. */
  dot?: string
  /** Group heading this option belongs to. */
  group?: string
  /** Trailing content (e.g. a count) shown on the right of the row. */
  trailing?: React.ReactNode
}

// ── Shared popover panel ────────────────────────────────────────────
const TRIGGER_CLASS =
  "flex h-[38px] w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm outline-none transition-[color,box-shadow] data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"

const PANEL_CLASS =
  "z-50 max-h-64 w-[var(--radix-popover-trigger-width)] origin-(--radix-popover-content-transform-origin) overflow-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

// ── filtering / grouping helpers ────────────────────────────────────
function filterOptions(options: SelectOption[], query: string): SelectOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return options
  return options.filter((o) => o.label.toLowerCase().includes(q))
}

function groupOptions(
  options: SelectOption[],
): { group: string | undefined; options: SelectOption[] }[] {
  const order: (string | undefined)[] = []
  const map = new Map<string | undefined, SelectOption[]>()
  for (const o of options) {
    if (!map.has(o.group)) {
      map.set(o.group, [])
      order.push(o.group)
    }
    map.get(o.group)!.push(o)
  }
  return order.map((group) => ({ group, options: map.get(group)! }))
}

// ── Sub-pieces ──────────────────────────────────────────────────────
function MenuSearch({
  value,
  onValueChange,
  placeholder = "Search…",
}: {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
}) {
  // Autofocus in a bottom sheet pops the keyboard over the options.
  const autoFocus = !useIsBottomSheet()

  return (
    <div
      data-slot="select-search"
      className="mb-1 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5"
    >
      <Search className="size-3.5 shrink-0 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div
      data-slot="select-empty"
      className="px-3 py-6 text-center"
    >
      <div className="text-sm font-semibold text-foreground">No matches</div>
      <div className="mt-1 text-[12.5px] text-muted-foreground">
        Try a different keyword.
      </div>
    </div>
  )
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

// ── Select (single) ─────────────────────────────────────────────────
export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  align?: "start" | "center" | "end"
}

function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  searchable = false,
  searchPlaceholder = "Search…",
  disabled,
  className,
  triggerClassName,
  align = "start",
}: SelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const current = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  // Every open/close path routes through here so the search query never leaks
  // into the next open.
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (!next) setQuery("")
  }

  const selected = React.useMemo(
    () => options.find((o) => o.value === current),
    [options, current],
  )

  const filtered = React.useMemo(
    () => (searchable ? filterOptions(options, query) : options),
    [options, query, searchable],
  )
  const groups = React.useMemo(() => groupOptions(filtered), [filtered])

  const choose = (opt: SelectOption) => {
    if (opt.disabled) return
    if (!isControlled) setInternal(opt.value)
    onValueChange?.(opt.value)
    changeOpen(false)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="select-trigger"
          disabled={disabled}
          className={cn(TRIGGER_CLASS, className, triggerClassName)}
        >
          {selected?.dot && (
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: selected.dot }}
            />
          )}
          {selected?.icon && (
            <span className="flex shrink-0 [&_svg]:size-4">{selected.icon}</span>
          )}
          <span
            className={cn(
              "flex-1 truncate text-left",
              !selected && "text-muted-foreground",
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="select-content"
          align={align}
          sideOffset={6}
          className={PANEL_CLASS}
        >
          {searchable && (
            <MenuSearch
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
            />
          )}
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            groups.map((g, gi) => (
              <div key={g.group ?? `__nogroup-${gi}`} data-slot="select-group">
                {g.group && <GroupHeading>{g.group}</GroupHeading>}
                {g.options.map((opt) => {
                  const isSelected = opt.value === current
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      data-slot="select-option"
                      data-selected={isSelected || undefined}
                      data-disabled={opt.disabled || undefined}
                      disabled={opt.disabled}
                      onClick={() => choose(opt)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                        "hover:bg-accent",
                        isSelected && "bg-primary/10 font-medium",
                        opt.disabled &&
                          "pointer-events-none text-muted-foreground opacity-60",
                      )}
                    >
                      {opt.dot && (
                        <span
                          aria-hidden
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: opt.dot }}
                        />
                      )}
                      {opt.icon && (
                        <span className="flex shrink-0 [&_svg]:size-4">
                          {opt.icon}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{opt.label}</span>
                        {opt.description && (
                          <span className="block truncate text-[11.5px] font-normal text-muted-foreground">
                            {opt.description}
                          </span>
                        )}
                      </span>
                      {opt.trailing != null && (
                        <span className="shrink-0 text-[11.5px] text-muted-foreground">
                          {opt.trailing}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ── MultiSelect ─────────────────────────────────────────────────────
export interface MultiSelectProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  showFooter?: boolean
  selectAll?: boolean
  disabled?: boolean
  className?: string
  triggerClassName?: string
  align?: "start" | "center" | "end"
}

function MultiSelect({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  searchable = true,
  searchPlaceholder = "Search…",
  showFooter = true,
  selectAll = true,
  disabled,
  className,
  triggerClassName,
  align = "start",
}: MultiSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const current = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  // Every open/close path routes through here so the search query never leaks
  // into the next open.
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (!next) setQuery("")
  }

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const selectedOptions = React.useMemo(
    () => options.filter((o) => current.includes(o.value)),
    [options, current],
  )

  const filtered = React.useMemo(
    () => (searchable ? filterOptions(options, query) : options),
    [options, query, searchable],
  )

  const selectableValues = React.useMemo(
    () => options.filter((o) => !o.disabled).map((o) => o.value),
    [options],
  )
  const allSelected =
    selectableValues.length > 0 &&
    selectableValues.every((v) => current.includes(v))

  const toggle = (opt: SelectOption) => {
    if (opt.disabled) return
    const next = current.includes(opt.value)
      ? current.filter((v) => v !== opt.value)
      : [...current, opt.value]
    commit(next)
  }

  const toggleAll = () => {
    if (allSelected) {
      commit(current.filter((v) => !selectableValues.includes(v)))
    } else {
      const merged = new Set([...current, ...selectableValues])
      commit([...merged])
    }
  }

  const clearAll = () => commit([])
  const removeChip = (val: string) => commit(current.filter((v) => v !== val))

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          data-slot="multi-select-trigger"
          disabled={disabled}
          className={cn(
            TRIGGER_CLASS,
            "h-auto min-h-[38px] flex-wrap py-1.5",
            className,
            triggerClassName,
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="flex-1 text-left text-muted-foreground">
              {placeholder}
            </span>
          ) : (
            <>
              {selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  data-slot="multi-select-chip"
                  className="inline-flex items-center gap-1 rounded-full bg-primary/15 py-0.5 pl-2 pr-1 text-[11.5px] font-medium text-[#7A3A00] dark:text-primary"
                >
                  {opt.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${opt.label}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeChip(opt.value)
                    }}
                    className="inline-flex opacity-70 transition-opacity hover:opacity-100 [&_svg]:size-3"
                  >
                    <X />
                  </span>
                </span>
              ))}
              <span className="ml-auto shrink-0 self-center pl-1 text-[11px] text-muted-foreground">
                {selectedOptions.length} selected
              </span>
            </>
          )}
          <ChevronDown className="size-4 shrink-0 self-center text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="multi-select-content"
          align={align}
          sideOffset={6}
          className={PANEL_CLASS}
        >
          {searchable && (
            <MenuSearch
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
            />
          )}

          <div className="flex items-center justify-between px-2.5 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
            <span>{options.length} options</span>
            {selectAll && (
              <button
                type="button"
                onClick={toggleAll}
                className="font-semibold normal-case tracking-normal text-primary transition-opacity hover:opacity-80"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((opt) => {
              const isSelected = current.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  data-slot="multi-select-option"
                  data-selected={isSelected || undefined}
                  data-disabled={opt.disabled || undefined}
                  disabled={opt.disabled}
                  onClick={() => toggle(opt)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    "hover:bg-accent",
                    opt.disabled &&
                      "pointer-events-none text-muted-foreground opacity-60",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-background",
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </span>
                  {opt.dot && (
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: opt.dot }}
                    />
                  )}
                  {opt.icon && (
                    <span className="flex shrink-0 [&_svg]:size-4">
                      {opt.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="block truncate text-[11.5px] text-muted-foreground">
                        {opt.description}
                      </span>
                    )}
                  </span>
                  {opt.trailing != null && (
                    <span className="shrink-0 text-[11.5px] text-muted-foreground">
                      {opt.trailing}
                    </span>
                  )}
                </button>
              )
            })
          )}

          {showFooter && (
            <div className="mt-1 flex items-center justify-between border-t px-2 py-2 text-[12px]">
              <button
                type="button"
                onClick={clearAll}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => changeOpen(false)}
                className="inline-flex h-7 items-center rounded-md bg-primary px-3 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply ({current.length})
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Select, MultiSelect }

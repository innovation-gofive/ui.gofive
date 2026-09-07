"use client"

import * as React from "react"
import {
  ResponsivePopover as PopoverPrimitive,
  useIsBottomSheet,
} from "./responsive-popover"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Check, ChevronDown, Loader2, Plus, Search, X } from "lucide-react"
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

// ── Shared form-control contract ────────────────────────────────────
// What <Controller> (react-hook-form) and <FormControl> (a Radix Slot, so it
// needs a real ref) expect from a field. Every picker in the registry should
// accept this same set so callers never have to hand-wire validation state.
export interface PickerFieldProps {
  /** Emitted in a hidden input so the value reaches a native form submit. */
  name?: string
  /** Fires when the panel closes — the moment the field is actually left. */
  onBlur?: () => void
  /** Paints the invalid state and sets aria-invalid on the trigger. */
  error?: boolean
  required?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  "aria-describedby"?: string
  "aria-labelledby"?: string
}

// ── Shared async-options contract ───────────────────────────────────
export interface PickerAsyncProps {
  /**
   * Receives the query as the user types. Providing it hands option filtering
   * to the caller (server-side search) — the built-in client filter steps aside.
   */
  onSearchChange?: (query: string) => void
  /** Show a loading row instead of the empty state while options are in flight. */
  loading?: boolean
  /** Replaces the built-in "No matches" panel. */
  emptyState?: React.ReactNode
  /**
   * Hard ceiling on how many options the panel will list at all. Off by
   * default: the list is virtualized, so a few thousand options cost the same
   * as a few dozen and truncating them only hides data. Set it when the list
   * itself is the problem — an unbounded API response you would rather cut off
   * than scroll through.
   */
  maxRenderedOptions?: number
}

const DEFAULT_MAX_RENDERED = Number.POSITIVE_INFINITY

const TRIGGER_INVALID_CLASS =
  "border-danger data-[state=open]:border-danger data-[state=open]:ring-danger/30"

function LoadingRow() {
  return (
    <div
      data-slot="select-loading"
      className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground"
    >
      <Loader2 className="size-4 animate-spin" />
      Searching…
    </div>
  )
}

function TruncatedRow({ shown, total }: { shown: number; total: number }) {
  return (
    <div
      data-slot="select-truncated"
      className="border-t px-2.5 py-2 text-center text-[11.5px] text-muted-foreground"
    >
      Showing {shown} of {total} — refine your search to narrow it down.
    </div>
  )
}

/** Hidden mirror of the value so a native <form> submit still carries it. */
function HiddenField({ name, value }: { name?: string; value: string | string[] }) {
  if (!name) return null
  const values = Array.isArray(value) ? value : [value]
  return (
    <>
      {values
        .filter((v) => v !== "" && v != null)
        .map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}
    </>
  )
}

// ── Shared popover panel ────────────────────────────────────────────
const TRIGGER_CLASS =
  "flex h-[38px] w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm outline-none transition-[color,box-shadow] data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"

const PANEL_CLASS =
  "z-50 flex max-h-80 w-[var(--radix-popover-trigger-width)] flex-col origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

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

// ── Virtualized listbox ─────────────────────────────────────────────
// Only the rows in view exist in the DOM, so a 1,500-option list costs about
// what a 20-option one does. Two consequences drive the shape below:
//
//  · Headings and options share one virtualizer. Interleaving two would need
//    the heights of the other's rows to place its own, so the list is flattened
//    into a single row array first.
//  · A screen reader can no longer count the options it can see, so every
//    option carries aria-setsize / aria-posinset. Without them the list
//    announces itself as however many rows happen to be rendered.

type OptionRow =
  | { kind: "heading"; key: string; label: string }
  | { kind: "option"; key: string; option: SelectOption; position: number }

/** Flattens groups into the row list the virtualizer measures. */
function toRows(
  groups: { group: string | undefined; options: SelectOption[] }[],
): OptionRow[] {
  const rows: OptionRow[] = []
  let position = 0
  for (const g of groups) {
    if (g.group) rows.push({ kind: "heading", key: `heading:${g.group}`, label: g.group })
    for (const option of g.options) {
      rows.push({ kind: "option", key: option.value, option, position: ++position })
    }
  }
  return rows
}

// A plain option is 36px; one with a description is taller and a heading is
// shorter. This is the starting guess only — every row is measured once it
// mounts, which is what keeps the scrollbar honest on a mixed list.
const ROW_ESTIMATE = 36

function OptionList({
  id,
  rows,
  total,
  placeholder,
  multiselectable,
  children,
}: {
  id: string
  rows: OptionRow[]
  /** Option count for aria-setsize — headings do not count. */
  total: number
  /** Rendered instead of the rows: the loading, empty or error state. */
  placeholder?: React.ReactNode
  multiselectable?: boolean
  children: (row: OptionRow, total: number) => React.ReactNode
}) {
  // The virtualizer hands back functions the React Compiler cannot memoize
  // safely, so this component opts out of it. Harmless where the compiler is
  // off; required where a consumer has turned it on.
  "use no memo"

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 8,
    getItemKey: (i) => rows[i].key,
  })

  return (
    <div
      ref={scrollRef}
      id={id}
      role="listbox"
      aria-multiselectable={multiselectable}
      data-slot="select-viewport"
      // An explicit cap, not `flex-1`: the bottom-sheet layout does not apply
      // PANEL_CLASS, and an unbounded scroll container renders every row.
      className="max-h-64 min-h-0 flex-1 overflow-y-auto"
    >
      {placeholder ?? (
        <div
          role="presentation"
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              role="presentation"
              // measureElement reads this to know which row it just measured.
              data-index={item.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${item.start}px)` }}
            >
              {children(rows[item.index], total)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
export interface SelectProps extends PickerFieldProps, PickerAsyncProps {
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

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
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
    name,
    onBlur,
    error,
    required,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    onSearchChange,
    loading,
    emptyState,
    maxRenderedOptions = DEFAULT_MAX_RENDERED,
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const current = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const invalid = error || (ariaInvalid != null && ariaInvalid !== "false")
  const panelId = React.useId()

  const runSearch = (q: string) => {
    setQuery(q)
    onSearchChange?.(q)
  }

  // Every open/close path routes through here so the search query never leaks
  // into the next open — including the caller's copy of it when the options are
  // fetched remotely. Closing is also the moment the field is left, which is
  // what react-hook-form counts as a blur; the guard keeps that from firing on
  // the initial render.
  const opened = React.useRef(false)
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (next) {
      opened.current = true
      return
    }
    if (query) runSearch("")
    if (opened.current) onBlur?.()
  }

  const selected = React.useMemo(
    () => options.find((o) => o.value === current),
    [options, current],
  )

  // With onSearchChange the caller owns the list, so filtering here would apply
  // the query a second time to results that already match it.
  const filtered = React.useMemo(
    () => (searchable && !onSearchChange ? filterOptions(options, query) : options),
    [options, query, searchable, onSearchChange],
  )
  const capped = React.useMemo(
    () => filtered.slice(0, maxRenderedOptions),
    [filtered, maxRenderedOptions],
  )
  const groups = React.useMemo(() => groupOptions(capped), [capped])
  const rows = React.useMemo(() => toRows(groups), [groups])

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
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={panelId}
          data-slot="select-trigger"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            TRIGGER_CLASS,
            invalid && TRIGGER_INVALID_CLASS,
            className,
            triggerClassName,
          )}
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
              onValueChange={runSearch}
              placeholder={searchPlaceholder}
            />
          )}
          <OptionList
            id={panelId}
            rows={rows}
            total={capped.length}
            placeholder={
              loading ? (
                <LoadingRow />
              ) : filtered.length === 0 ? (
                (emptyState ?? <EmptyState />)
              ) : undefined
            }
          >
            {(row, total) => {
              if (row.kind === "heading")
                return <GroupHeading>{row.label}</GroupHeading>
              const opt = row.option
              const isSelected = opt.value === current
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-setsize={total}
                  aria-posinset={row.position}
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
            }}
          </OptionList>
          {filtered.length > capped.length && (
            <TruncatedRow shown={capped.length} total={filtered.length} />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
      <HiddenField name={name} value={current ?? ""} />
    </PopoverPrimitive.Root>
  )
})

// ── MultiSelect ─────────────────────────────────────────────────────
export interface MultiSelectProps extends PickerFieldProps, PickerAsyncProps {
  /**
   * Let the user commit what they typed as a new value — an email that is not
   * in the directory yet, say. The created value is added to the selection and
   * reported through `onCreate` so the caller can persist it.
   */
  creatable?: boolean
  /** Reject a typed value; return `false` or a message. */
  validate?: (value: string) => boolean | string
  /** Fires with each accepted new value. */
  onCreate?: (value: string) => void
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

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  function MultiSelect(
    {
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
      name,
      onBlur,
      error,
      required,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      onSearchChange,
      loading,
      emptyState,
      maxRenderedOptions = DEFAULT_MAX_RENDERED,
      creatable,
      validate,
      onCreate,
    },
    ref,
  ) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const current = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const invalid = error || (ariaInvalid != null && ariaInvalid !== "false")
  const panelId = React.useId()

  const runSearch = (q: string) => {
    setQuery(q)
    onSearchChange?.(q)
  }

  // See <Select> for why close resets the query, notifies the caller, and is
  // what counts as the blur.
  const opened = React.useRef(false)
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (next) {
      opened.current = true
      return
    }
    if (query) runSearch("")
    if (opened.current) onBlur?.()
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
    () => (searchable && !onSearchChange ? filterOptions(options, query) : options),
    [options, query, searchable, onSearchChange],
  )
  const capped = React.useMemo(
    () => filtered.slice(0, maxRenderedOptions),
    [filtered, maxRenderedOptions],
  )

  // MultiSelect does not group, so the whole list is one nameless group.
  const rows = React.useMemo(
    () => toRows([{ group: undefined, options: capped }]),
    [capped],
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

  // ── creatable ──────────────────────────────────────────────────
  const typed = query.trim()
  const [rejected, setRejected] = React.useState<string | null>(null)
  const exactMatch = React.useMemo(
    () =>
      options.some(
        (o) => o.label.toLowerCase() === typed.toLowerCase() || o.value === typed,
      ),
    [options, typed],
  )
  const canCreate = Boolean(creatable) && typed.length > 0 && !exactMatch

  const create = () => {
    const verdict = validate ? validate(typed) : true
    if (verdict !== true) {
      setRejected(typeof verdict === "string" ? verdict : "Invalid entry")
      return
    }
    setRejected(null)
    if (!current.includes(typed)) commit([...current, typed])
    onCreate?.(typed)
    runSearch("")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={panelId}
          data-slot="multi-select-trigger"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            TRIGGER_CLASS,
            "h-auto min-h-[38px] flex-wrap py-1.5",
            invalid && TRIGGER_INVALID_CLASS,
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
                  className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2 pr-1 text-[11.5px] font-medium text-primary-soft-foreground"
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
              onValueChange={runSearch}
              placeholder={searchPlaceholder}
            />
          )}

          <div className="flex shrink-0 items-center justify-between px-2.5 pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
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

          <OptionList
            id={panelId}
            rows={rows}
            total={capped.length}
            multiselectable
            placeholder={
              loading ? (
                <LoadingRow />
              ) : filtered.length === 0 ? (
                (emptyState ?? <EmptyState />)
              ) : undefined
            }
          >
            {(row, total) => {
              if (row.kind === "heading")
                return <GroupHeading>{row.label}</GroupHeading>
              const opt = row.option
              const isSelected = current.includes(opt.value)
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-setsize={total}
                  aria-posinset={row.position}
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
            }}
          </OptionList>

          {canCreate && (
            <>
              <button
                type="button"
                data-slot="multi-select-create"
                onClick={create}
                className="flex w-full items-center gap-2 rounded-lg border-t px-2.5 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
              >
                <Plus className="size-4 shrink-0" />
                Add &ldquo;{typed}&rdquo;
              </button>
              {rejected && (
                <p
                  data-slot="multi-select-create-error"
                  className="px-2.5 pb-1 text-[11.5px] text-danger"
                >
                  {rejected}
                </p>
              )}
            </>
          )}

          {filtered.length > capped.length && (
            <TruncatedRow shown={capped.length} total={filtered.length} />
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
      <HiddenField name={name} value={current} />
    </PopoverPrimitive.Root>
  )
  },
)

export { Select, MultiSelect }

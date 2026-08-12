"use client"

import * as React from "react"
import { Search, CornerDownLeft, ArrowUp, ArrowDown, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Kbd ───────────────────────────────────────────────────────────
function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      data-slot="search-kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded-[5px] border bg-muted px-1.5 font-mono text-[11px] leading-none text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

// ── SearchInput ───────────────────────────────────────────────────
export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "defaultValue"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  kbdHint?: React.ReactNode
  clearable?: boolean
  pill?: boolean
  containerClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    defaultValue,
    onValueChange,
    kbdHint,
    clearable = true,
    pill = false,
    className,
    containerClassName,
    placeholder = "Search…",
    disabled,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const current = isControlled ? value : internal
  const innerRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const hasValue = current.length > 0
  const showClear = clearable && hasValue
  const showKbd = kbdHint != null && !hasValue

  return (
    <div
      data-slot="search-input"
      data-pill={pill || undefined}
      className={cn(
        "flex h-10 items-center gap-2 rounded-[10px] border bg-card px-3 text-sm transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        pill && "h-9 rounded-full border-transparent bg-muted hover:bg-muted/70",
        disabled && "pointer-events-none opacity-50",
        containerClassName,
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={innerRef}
        data-slot="search-input-field"
        value={current}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("")
            innerRef.current?.focus()
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
      {showKbd && (
        <Kbd className="shrink-0 bg-muted">{kbdHint}</Kbd>
      )}
    </div>
  )
})

// ── SearchScope ───────────────────────────────────────────────────
export interface SearchScopeProps {
  scopes: string[]
  value?: string
  defaultValue?: string
  onValueChange?: (scope: string) => void
  className?: string
}

function SearchScope({ scopes, value, defaultValue, onValueChange, className }: SearchScopeProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? scopes[0])
  const current = isControlled ? value : internal

  const select = (scope: string) => {
    if (!isControlled) setInternal(scope)
    onValueChange?.(scope)
  }

  return (
    <div
      data-slot="search-scope"
      role="tablist"
      className={cn("flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px]", className)}
    >
      {scopes.map((scope) => {
        const active = scope === current
        return (
          <button
            key={scope}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active || undefined}
            onClick={() => select(scope)}
            className={cn(
              "rounded-[5px] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors",
              active && "bg-card font-semibold text-foreground shadow-sm",
            )}
          >
            {scope}
          </button>
        )
      })}
    </div>
  )
}

// ── RecentSearches ────────────────────────────────────────────────
export interface RecentSearchesProps {
  items: string[]
  label?: string
  onSelect?: (term: string) => void
  className?: string
}

function RecentSearches({ items, label = "Recent searches", onSelect, className }: RecentSearchesProps) {
  if (items.length === 0) return null
  return (
    <div data-slot="recent-searches" className={cn("p-1.5", className)}>
      {label && (
        <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 px-2.5 pb-1.5">
        {items.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onSelect?.(term)}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
          >
            <Clock className="size-3 text-muted-foreground/70" />
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Highlight helper ──────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-[3px] bg-primary px-0.5 font-bold text-primary-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

// ── Result data model ─────────────────────────────────────────────
export interface SearchItem {
  id: string
  group: string
  title: string
  subtitle?: string
  meta?: string
  icon?: React.ReactNode
  /** Extra classes for the icon tile (e.g. colored backgrounds). */
  iconClassName?: string
  /** Initials avatar shown instead of the icon tile (e.g. people results). */
  avatar?: { initials: string; className?: string }
  keywords?: string
}

// ── SearchGroup ───────────────────────────────────────────────────
export interface SearchGroupProps {
  label: string
  count?: number | string
  children: React.ReactNode
}

function SearchGroup({ label, count, children }: SearchGroupProps) {
  return (
    <div data-slot="search-group" className="p-1.5">
      <div className="flex items-center justify-between px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
        <span>{label}</span>
        {count != null && (
          <span className="font-mono text-[10.5px] font-normal normal-case tracking-normal text-muted-foreground/70">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

// ── SearchResult ──────────────────────────────────────────────────
export interface SearchResultProps {
  item: SearchItem
  query?: string
  active?: boolean
  onSelect?: (item: SearchItem) => void
}

function SearchResult({ item, query = "", active = false, onSelect }: SearchResultProps) {
  return (
    <button
      type="button"
      data-slot="search-result"
      data-active={active || undefined}
      onClick={() => onSelect?.(item)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
        "hover:bg-muted",
        active && "border border-primary/25 bg-primary/15",
      )}
    >
      {item.avatar ? (
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B88E8] to-[#E677B7] text-[10.5px] font-semibold text-white",
            item.avatar.className,
          )}
        >
          {item.avatar.initials}
        </span>
      ) : (
        item.icon && (
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-muted text-muted-foreground [&_svg]:size-3.5",
              item.iconClassName,
              active && "bg-primary text-primary-foreground",
            )}
          >
            {item.icon}
          </span>
        )
      )}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[13.5px] font-semibold text-foreground",
            active && "text-foreground",
          )}
        >
          <Highlight text={item.title} query={query} />
        </span>
        {item.subtitle && (
          <span className="block truncate text-[11.5px] text-muted-foreground">
            {item.subtitle}
          </span>
        )}
      </span>
      {item.meta && (
        <span className="ml-1.5 shrink-0 font-mono text-[10.5px] text-muted-foreground/70">
          {item.meta}
        </span>
      )}
      {active && (
        <Kbd className="ml-auto shrink-0 border-primary bg-primary text-primary-foreground">
          <CornerDownLeft className="size-3" />
        </Kbd>
      )}
    </button>
  )
}

// ── SearchResults (standalone dropdown panel) ─────────────────────
export interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  footer?: React.ReactNode
}

function SearchResults({ footer, className, children, ...props }: SearchResultsProps) {
  return (
    <div
      data-slot="search-results"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-[0_16px_48px_rgba(20,20,43,0.12)]",
        className,
      )}
      {...props}
    >
      {children}
      {footer}
    </div>
  )
}

// ── SearchFooter (keyboard hints + result count) ──────────────────
export interface SearchFooterProps {
  count?: number
  hints?: React.ReactNode
  className?: string
}

const DEFAULT_HINTS = (
  <>
    <span className="inline-flex items-center gap-1">
      <b className="font-semibold text-foreground/80">↑↓</b> navigate
    </span>
    <span className="inline-flex items-center gap-1">
      <b className="font-semibold text-foreground/80">↵</b> open
    </span>
    <span className="inline-flex items-center gap-1">
      <b className="font-semibold text-foreground/80">⌘↵</b> open in new tab
    </span>
  </>
)

function SearchFooter({ count, hints = DEFAULT_HINTS, className }: SearchFooterProps) {
  return (
    <div
      data-slot="search-footer"
      className={cn(
        "flex items-center gap-2.5 border-t bg-muted/50 px-3 py-2 font-mono text-[11px] text-muted-foreground",
        className,
      )}
    >
      {hints}
      <span className="flex-1" />
      {count != null && <span>{count} results</span>}
    </div>
  )
}

// ── SearchSkeleton (loading rows) ─────────────────────────────────
const SEARCH_SKELETON_CSS = `
  .gf-search-shim{background:linear-gradient(90deg,#ECECF0 0%,#F4F4F6 50%,#ECECF0 100%);background-size:200% 100%;animation:gf-search-shim 1.4s linear infinite;}
  @keyframes gf-search-shim{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
`

export interface SearchSkeletonProps {
  rows?: number
  label?: string
  className?: string
}

function SearchSkeleton({ rows = 3, label = "Searching…", className }: SearchSkeletonProps) {
  return (
    <div data-slot="search-skeleton" className={cn("p-1.5", className)}>
      <style href="gf-search-shim" precedence="low">{SEARCH_SKELETON_CSS}</style>
      {label && (
        <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 px-2.5 py-2" aria-hidden>
          <span className="size-7 shrink-0 rounded-[7px] bg-muted" />
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              className="gf-search-shim h-2.5 rounded-full"
              style={{ width: `${60 - i * 8}%` }}
            />
            <span
              className="gf-search-shim h-2 rounded-full"
              style={{ width: `${40 - i * 4}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

// ── SearchEmpty (rich no-results state) ───────────────────────────
export interface SearchEmptyProps {
  query?: string
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

function SearchEmpty({
  query,
  title,
  description = "Try a different keyword or broaden the scope.",
  actions,
  className,
}: SearchEmptyProps) {
  return (
    <div
      data-slot="search-empty"
      className={cn("flex flex-col items-center px-5 py-8 text-center", className)}
    >
      <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Search className="size-[22px]" />
      </div>
      <div className="text-sm font-semibold text-foreground">
        {title ?? (query ? `No results for “${query}”` : "No results")}
      </div>
      {description && (
        <div className="mt-1 text-[12.5px] text-muted-foreground">{description}</div>
      )}
      {actions && <div className="mt-3 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  )
}

// ── filtering ─────────────────────────────────────────────────────
function filterItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((it) => {
    const haystack = `${it.title} ${it.subtitle ?? ""} ${it.keywords ?? ""}`.toLowerCase()
    return haystack.includes(q)
  })
}

function groupItems(items: SearchItem[]): { label: string; items: SearchItem[] }[] {
  const order: string[] = []
  const map = new Map<string, SearchItem[]>()
  for (const it of items) {
    if (!map.has(it.group)) {
      map.set(it.group, [])
      order.push(it.group)
    }
    map.get(it.group)!.push(it)
  }
  return order.map((label) => ({ label, items: map.get(label)! }))
}

// ── CommandPalette ────────────────────────────────────────────────
export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: SearchItem[]
  placeholder?: string
  onSelect?: (item: SearchItem) => void
  emptyMessage?: string
}

function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Type a command or search…",
  onSelect,
  emptyMessage,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [storedIndex, setStoredIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => filterItems(items, query), [items, query])
  const groups = React.useMemo(() => groupItems(filtered), [filtered])

  // `open` is a prop, so reset during render when it flips rather than in an
  // effect — no wasted render pass and no stale frame.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setQuery("")
      setStoredIndex(0)
    }
  }

  // Derived, so shrinking results can never leave the index out of range.
  const activeIndex =
    filtered.length === 0 ? 0 : Math.min(storedIndex, filtered.length - 1)

  React.useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  const choose = React.useCallback(
    (item: SearchItem) => {
      onSelect?.(item)
      onOpenChange(false)
    },
    [onSelect, onOpenChange],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      // step from the clamped index, not the stored one
      setStoredIndex(filtered.length === 0 ? 0 : (activeIndex + 1) % filtered.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setStoredIndex(
        filtered.length === 0
          ? 0
          : (activeIndex - 1 + filtered.length) % filtered.length,
      )
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filtered[activeIndex]
      if (item) choose(item)
    } else if (e.key === "Escape") {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  if (!open) return null

  return (
    <div
      data-slot="command-palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[16vh]"
    >
      <div
        data-slot="command-palette-overlay"
        className="fixed inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        onKeyDown={onKeyDown}
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[14px] border bg-card shadow-2xl"
      >
        {/* input */}
        <div className="flex items-center gap-2.5 border-b px-4 py-3.5">
          <Search className="size-[18px] shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>ESC</Kbd>
        </div>

        {/* results */}
        <div className="max-h-[380px] overflow-auto p-1">
          {filtered.length === 0 ? (
            <SearchEmpty query={query} title={emptyMessage} />
          ) : (
            groups.map((g) => (
              <SearchGroup key={g.label} label={g.label} count={g.items.length}>
                {g.items.map((item) => {
                  const idx = filtered.indexOf(item)
                  return (
                    <SearchResult
                      key={item.id}
                      item={item}
                      query={query}
                      active={idx === activeIndex}
                      onSelect={choose}
                    />
                  )
                })}
              </SearchGroup>
            ))
          )}
        </div>

        {/* footer */}
        <SearchFooter
          count={filtered.length}
          hints={
            <>
              <span className="inline-flex items-center gap-1">
                <Kbd>
                  <ArrowUp className="size-3" />
                </Kbd>
                <Kbd>
                  <ArrowDown className="size-3" />
                </Kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <Kbd>
                  <CornerDownLeft className="size-3" />
                </Kbd>
                select
              </span>
            </>
          }
          className="px-3.5"
        />
      </div>
    </div>
  )
}

export {
  SearchInput,
  SearchScope,
  RecentSearches,
  CommandPalette,
  SearchResults,
  SearchResult,
  SearchGroup,
  SearchFooter,
  SearchSkeleton,
  SearchEmpty,
  Kbd as SearchKbd,
}

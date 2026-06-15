"use client"

import * as React from "react"
import { Search, CornerDownLeft, ArrowUp, ArrowDown, X } from "lucide-react"
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
  keywords?: string
}

// ── SearchGroup ───────────────────────────────────────────────────
export interface SearchGroupProps {
  label: string
  count?: number
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
      {item.icon && (
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-muted text-muted-foreground [&_svg]:size-3.5",
            active && "bg-primary text-primary-foreground",
          )}
        >
          {item.icon}
        </span>
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
  emptyMessage = "No results found.",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => filterItems(items, query), [items, query])
  const groups = React.useMemo(() => groupItems(filtered), [filtered])

  // reset on open
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  // keep active index in range when results change
  React.useEffect(() => {
    setActiveIndex((i) => (filtered.length === 0 ? 0 : Math.min(i, filtered.length - 1)))
  }, [filtered.length])

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
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length))
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
            <div className="px-5 py-10 text-center">
              <div className="text-sm font-semibold text-foreground">{emptyMessage}</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">
                Try a different keyword.
              </div>
            </div>
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
        <div className="flex items-center gap-2.5 border-t bg-muted/50 px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
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
          <span className="flex-1" />
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  )
}

export {
  SearchInput,
  CommandPalette,
  SearchResult,
  SearchGroup,
  Kbd as SearchKbd,
}

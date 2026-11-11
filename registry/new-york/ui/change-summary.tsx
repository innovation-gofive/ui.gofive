"use client"

import * as React from "react"
import {
  ArrowRight,
  ChevronDown,
  History,
  Pencil,
  Plus,
  Minus,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// Row entrance: fade + rise, staggered by index (set through --gf-cs-delay).
// Hoisted by React 19 and deduplicated via href. Colours come from utilities.
const CHANGE_SUMMARY_CSS = `
  .gf-change-summary-row{animation:gf-change-summary-in 480ms cubic-bezier(.16,1,.3,1) both;animation-delay:var(--gf-cs-delay,0ms);}
  @keyframes gf-change-summary-in{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){.gf-change-summary-row{animation:none;}}
`

export type ChangeKind = "added" | "changed" | "removed"

export interface ChangeItem {
  /** Stable key. Falls back to index + label. */
  id?: string
  label: string
  kind: ChangeKind
  /** Previous value, shown struck through before the arrow. */
  before?: string
  /** New value. */
  after?: string
  /** Free-form explanation under the label. */
  description?: React.ReactNode
  /** Display text for the time, already formatted/localized by the caller. */
  timestamp?: string
  /** Machine-readable time (ISO 8601) for the <time> element. */
  datetime?: string
}

export interface ChangeSummaryLabels {
  title: string
  added: string
  changed: string
  removed: string
  /** Shown when `items` is empty. */
  empty: string
  /** Toggle label while collapsed; receives the number of hidden rows. */
  showMore: (hidden: number) => string
  showLess: string
}

const DEFAULT_LABELS: ChangeSummaryLabels = {
  title: "What changed",
  added: "Added",
  changed: "Changed",
  removed: "Removed",
  empty: "Nothing has changed since last time.",
  showMore: (n) => `Show ${n} more`,
  showLess: "Collapse",
}

const KINDS: ChangeKind[] = ["added", "changed", "removed"]

const KIND_STYLE: Record<ChangeKind, { icon: LucideIcon; mark: string }> = {
  added: { icon: Plus, mark: "bg-success-soft text-success-soft-foreground" },
  changed: { icon: Pencil, mark: "bg-info-soft text-info-soft-foreground" },
  removed: { icon: Minus, mark: "bg-danger-soft text-danger-soft-foreground" },
}

// Rows past this index share the last stagger step so long lists stay snappy.
const MAX_STAGGER = 11

export interface ChangeSummaryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Heading. Defaults to `labels.title`. */
  title?: React.ReactNode
  /** Short sentence under the heading, e.g. "12 updates across 3 areas". */
  headline?: React.ReactNode
  /** Time window shown at the far end of the heading, e.g. "this week". */
  period?: string
  /** Replaces the default heading icon. */
  icon?: React.ReactNode
  items: ChangeItem[]
  /** Group rows under Added / Changed / Removed headings. */
  grouped?: boolean
  /** Rows shown while collapsed. Lists at or under this size never collapse. */
  collapseAfter?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  labels?: Partial<ChangeSummaryLabels>
}

function ChangeSummary({
  title,
  headline,
  period,
  icon,
  items,
  grouped = true,
  collapseAfter = 5,
  open,
  defaultOpen = false,
  onOpenChange,
  labels: labelsProp,
  className,
  ...props
}: ChangeSummaryProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const uid = React.useId()
  const titleId = `${uid}-title`
  const listId = `${uid}-list`

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const expanded = isControlled ? open : internalOpen
  function toggle() {
    const next = !expanded
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  // Display order: by kind when grouped, caller order otherwise.
  const ordered = grouped
    ? KINDS.flatMap((k) => items.filter((i) => i.kind === k))
    : items
  const collapsible = ordered.length > collapseAfter
  const visible = collapsible && !expanded ? ordered.slice(0, collapseAfter) : ordered
  const hidden = ordered.length - visible.length

  const order = new Map(ordered.map((item, i) => [item, i]))
  const groups: { kind: ChangeKind | null; rows: ChangeItem[] }[] = grouped
    ? KINDS.map((kind) => ({ kind, rows: visible.filter((i) => i.kind === kind) }))
    : [{ kind: null, rows: visible }]

  return (
    <section
      data-slot="change-summary"
      aria-labelledby={titleId}
      className={cn(
        "@container w-full overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <style href="gf-change-summary" precedence="low">{CHANGE_SUMMARY_CSS}</style>

      <header data-slot="change-summary-header" className="flex flex-col gap-1 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span
            data-slot="change-summary-icon"
            aria-hidden
            className="flex size-5 shrink-0 items-center justify-center overflow-hidden text-primary [&>svg]:size-4 [&>img]:size-4 [&>img]:object-contain"
          >
            {icon ?? <History />}
          </span>
          <h2
            id={titleId}
            data-slot="change-summary-title"
            dir="auto"
            className="min-w-0 flex-1 truncate text-sm font-semibold"
          >
            {title ?? labels.title}
          </h2>
          {period && (
            <span
              data-slot="change-summary-period"
              dir="auto"
              title={period}
              className="max-w-1/2 shrink-0 truncate text-xs text-muted-foreground"
            >
              {period}
            </span>
          )}
        </div>
        {headline && (
          <p data-slot="change-summary-headline" className="text-sm text-muted-foreground">
            {headline}
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <p
          data-slot="change-summary-empty"
          className="border-t px-4 py-6 text-center text-sm text-muted-foreground"
        >
          {labels.empty}
        </p>
      ) : (
        <div id={listId} data-slot="change-summary-body" className="border-t">
          {groups.map(({ kind, rows }) =>
            rows.length === 0 ? null : (
              <div
                key={kind ?? "all"}
                data-slot="change-summary-group"
                role={kind ? "group" : undefined}
                aria-labelledby={kind ? `${uid}-g-${kind}` : undefined}
              >
                {kind && (
                  <div
                    id={`${uid}-g-${kind}`}
                    data-slot="change-summary-group-label"
                    className="flex items-center gap-2 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {labels[kind]}
                    <span className="tabular-nums">
                      {items.filter((i) => i.kind === kind).length}
                    </span>
                  </div>
                )}
                <ul className="divide-y">
                  {rows.map((item) => (
                    <ChangeRow
                      key={item.id ?? `${order.get(item)}:${item.label}`}
                      item={item}
                      index={order.get(item) ?? 0}
                      srKind={grouped ? undefined : labels[item.kind]}
                    />
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}

      {collapsible && (
        <button
          type="button"
          data-slot="change-summary-toggle"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggle}
          className="flex w-full items-center justify-center gap-1 border-t px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset"
        >
          {expanded ? labels.showLess : labels.showMore(hidden)}
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
          />
        </button>
      )}
    </section>
  )
}

function ChangeRow({
  item,
  index,
  srKind,
}: {
  item: ChangeItem
  index: number
  srKind?: string
}) {
  const { icon: Icon, mark } = KIND_STYLE[item.kind]
  const hasValues = item.before !== undefined || item.after !== undefined
  return (
    <li
      data-slot="change-summary-item"
      data-kind={item.kind}
      style={{ "--gf-cs-delay": `${120 + Math.min(index, MAX_STAGGER) * 70}ms` } as React.CSSProperties}
      className="gf-change-summary-row flex items-start gap-3 px-4 py-3 hover:bg-muted/40"
    >
      <span
        data-slot="change-summary-mark"
        aria-hidden
        className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md", mark)}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 @sm:flex-row @sm:items-start @sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            data-slot="change-summary-label"
            dir="auto"
            title={item.label}
            className="truncate text-sm font-medium"
          >
            {srKind && <span className="sr-only">{srKind}: </span>}
            {item.label}
          </span>
          {hasValues && (
            <span
              data-slot="change-summary-values"
              className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs tabular-nums"
            >
              {item.before !== undefined && (
                <del data-slot="change-summary-before" className="text-muted-foreground">
                  {item.before}
                </del>
              )}
              {item.before !== undefined && item.after !== undefined && (
                <ArrowRight aria-hidden className="size-3 text-muted-foreground" />
              )}
              {item.after !== undefined && (
                <ins data-slot="change-summary-after" className="font-medium no-underline">
                  {item.after}
                </ins>
              )}
            </span>
          )}
          {item.description && (
            <span
              data-slot="change-summary-description"
              className="line-clamp-3 text-xs whitespace-pre-line text-muted-foreground"
            >
              {item.description}
            </span>
          )}
        </div>
        {item.timestamp && (
          <time
            data-slot="change-summary-time"
            dateTime={item.datetime}
            className="shrink-0 text-xs text-muted-foreground tabular-nums"
          >
            {item.timestamp}
          </time>
        )}
      </div>
    </li>
  )
}

export { ChangeSummary }

"use client"

import * as React from "react"
import {
  AlertCircle,
  Bot,
  ChevronRight,
  GitBranch,
  Sparkles,
  Wrench,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverAnchor, PopoverClose, PopoverContent } from "./popover"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "./sheet"
import { Tag } from "./tag-badge"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours come from theme tokens only. Everything that moves is switched off
// in the reduced-motion block at the bottom.
const TRACE_CSS = `
  .gf-trace-waterfall-bar{transition:width .12s linear,inset-inline-start .12s linear;}
  .gf-trace-waterfall-run{background-image:linear-gradient(90deg,transparent 0,color-mix(in oklab,var(--foreground) 14%,transparent) 50%,transparent 100%);background-size:200% 100%;animation:gf-trace-waterfall-run 1.4s linear infinite;}
  @keyframes gf-trace-waterfall-run{from{background-position:200% 0;}to{background-position:-200% 0;}}
  .gf-trace-waterfall-live{animation:gf-trace-waterfall-pulse 1.4s ease-in-out infinite;}
  @keyframes gf-trace-waterfall-pulse{50%{opacity:.35;}}
  @media (prefers-reduced-motion: reduce){
    .gf-trace-waterfall-bar{transition:none;}
    .gf-trace-waterfall-run,.gf-trace-waterfall-live{animation:none;}
  }
`

// ── Types ──────────────────────────────────────────────────────────

export type TraceSpanKind = "agent" | "subagent" | "llm" | "tool"
export type TraceSpanStatus = "running" | "done" | "failed"
export type TraceRunState = "live" | "done" | "failed"

export interface TraceSpan {
  id: string
  name: string
  kind: TraceSpanKind
  status: TraceSpanStatus
  /** Milliseconds from the start of the run. */
  start: number
  /** Milliseconds from the start of the run. Leave out while `status` is "running". */
  end?: number
  /** Muted text after the name, e.g. the model or the tool argument. */
  detail?: string
  /** Leading glyph; defaults to one per kind. */
  icon?: React.ReactNode
  /** This span's own cost. Branch totals are summed by the component. */
  cost?: number
  tokensIn?: number
  tokensOut?: number
  /** Short previews shown in the details panel. */
  input?: string
  output?: string
  error?: string
  children?: TraceSpan[]
}

/** Every user-facing string. Functions receive the values to interpolate. */
export interface TraceWaterfallLabels {
  title: string
  live: string
  done: string
  failed: string
  /** Screen-reader announcement when the run state changes. */
  announce: (state: TraceRunState) => string
  treeLabel: string
  empty: string
  now: string
  slowest: string
  kindAgent: string
  kindSubagent: string
  kindLlm: string
  kindTool: string
  statusRunning: string
  statusDone: string
  statusFailed: string
  /** Accessible name of a row. Values are already formatted. */
  rowLabel: (p: {
    name: string
    kind: string
    status: string
    duration: string
    cost?: string
  }) => string
  tokens: (tokensIn: number, tokensOut: number) => string
  metricStart: string
  metricEnd: string
  metricDuration: string
  metricCost: string
  metricTokensIn: string
  metricTokensOut: string
  input: string
  output: string
  error: string
  close: string
}

const DEFAULT_LABELS: TraceWaterfallLabels = {
  title: "Agent run",
  live: "Live",
  done: "Done",
  failed: "Failed",
  announce: (s) =>
    s === "live" ? "Run in progress" : s === "done" ? "Run finished" : "Run failed",
  treeLabel: "Trace spans",
  empty: "No spans yet.",
  now: "now",
  slowest: "Slowest",
  kindAgent: "Agent",
  kindSubagent: "Sub-agent",
  kindLlm: "LLM call",
  kindTool: "Tool call",
  statusRunning: "Running",
  statusDone: "Done",
  statusFailed: "Failed",
  rowLabel: (p) =>
    [p.name, p.kind, p.status, p.duration, p.cost].filter(Boolean).join(", "),
  tokens: (i, o) => `${TOKENS.format(i)} in · ${TOKENS.format(o)} out`,
  metricStart: "Started",
  metricEnd: "Ended",
  metricDuration: "Duration",
  metricCost: "Cost",
  metricTokensIn: "Tokens in",
  metricTokensOut: "Tokens out",
  input: "Input",
  output: "Output",
  error: "Error",
  close: "Close",
}

// ── Helpers ────────────────────────────────────────────────────────

const TOKENS = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
const USD = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})
const defaultFormatCost = (n: number) => USD.format(n)

/** Compact duration for bars and axis ticks: 420 ms, 3.4s, 12s, 2m 05s. */
export function formatTraceDuration(ms: number): string {
  const v = Math.max(0, ms)
  if (v < 1000) return `${Math.round(v)} ms`
  if (v < 60_000) {
    const s = v < 10_000 ? (v / 1000).toFixed(1) : String(Math.round(v / 1000))
    return `${s.replace(/\.0$/, "")}s`
  }
  const m = Math.floor(v / 60_000)
  const s = Math.floor((v % 60_000) / 1000)
  if (m < 60) return s ? `${m}m ${String(s).padStart(2, "0")}s` : `${m}m`
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`
}

function mergeLabels(p?: Partial<TraceWaterfallLabels>): TraceWaterfallLabels {
  const l: TraceWaterfallLabels = { ...DEFAULT_LABELS }
  if (p) {
    for (const k of Object.keys(p) as (keyof TraceWaterfallLabels)[]) {
      if (p[k] !== undefined) (l as unknown as Record<string, unknown>)[k] = p[k]
    }
  }
  return l
}

const KIND_ICON: Record<TraceSpanKind, React.ReactNode> = {
  agent: <Bot />,
  subagent: <GitBranch />,
  llm: <Sparkles />,
  tool: <Wrench />,
}

// Soft bar tones per kind; failed overrides with danger.
const KIND_BAR: Record<TraceSpanKind, string> = {
  agent: "border-primary/50 bg-primary-soft",
  subagent: "border-warning/60 bg-warning-soft",
  llm: "border-info/50 bg-info-soft",
  tool: "border-success/50 bg-success-soft",
}
const FAILED_BAR = "border-danger/60 bg-danger-soft"

const NICE_STEPS = [
  100, 200, 500, 1000, 2000, 5000, 10_000, 15_000, 30_000, 60_000, 120_000,
  300_000, 600_000, 1_800_000, 3_600_000,
]

/** Pick a tick step (≈5 ticks) and round the range up to a whole step. */
function niceAxis(target: number) {
  const raw = target / 5
  const step =
    NICE_STEPS.find((s) => s >= raw) ??
    Math.ceil(raw / 3_600_000) * 3_600_000
  return { step, range: Math.ceil(target / step) * step }
}

type Metrics = { cost?: number; tin?: number; tout?: number }

function ownMetrics(s: TraceSpan): Metrics {
  return { cost: s.cost, tin: s.tokensIn, tout: s.tokensOut }
}

function addMetrics(a: Metrics, b: Metrics): Metrics {
  const add = (x?: number, y?: number) =>
    x === undefined && y === undefined ? undefined : (x ?? 0) + (y ?? 0)
  return { cost: add(a.cost, b.cost), tin: add(a.tin, b.tin), tout: add(a.tout, b.tout) }
}

function rollup(s: TraceSpan): Metrics {
  return (s.children ?? []).reduce((acc, c) => addMetrics(acc, rollup(c)), ownMetrics(s))
}

function flatten(spans: TraceSpan[], out: TraceSpan[] = []): TraceSpan[] {
  for (const s of spans) {
    out.push(s)
    if (s.children) flatten(s.children, out)
  }
  return out
}

interface Row {
  span: TraceSpan
  depth: number
  parentId: string | null
  hasChildren: boolean
  expanded: boolean
  setSize: number
  pos: number
}

function buildRows(spans: TraceSpan[], collapsed: Set<string>): Row[] {
  const rows: Row[] = []
  const visit = (list: TraceSpan[], depth: number, parentId: string | null) => {
    list.forEach((span, i) => {
      const hasChildren = (span.children?.length ?? 0) > 0
      const expanded = hasChildren && !collapsed.has(span.id)
      rows.push({ span, depth, parentId, hasChildren, expanded, setSize: list.length, pos: i + 1 })
      if (expanded) visit(span.children as TraceSpan[], depth + 1, span.id)
    })
  }
  visit(spans, 0, null)
  return rows
}

/** Controlled when `value !== undefined`, otherwise internal state. */
function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void,
) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? (value as T) : inner
  const set = (next: T) => {
    if (!controlled) setInner(next)
    onChange?.(next)
  }
  return [current, set] as const
}

const NARROW_QUERY = "(max-width: 639px)"

function useIsNarrow(enabled: boolean) {
  const [narrow, setNarrow] = React.useState(false)
  React.useEffect(() => {
    if (!enabled) return
    const mql = window.matchMedia(NARROW_QUERY)
    const onChange = () => setNarrow(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [enabled])
  return narrow
}

// Two-column layout above the container breakpoint; stacked below it.
const COLS = "@[520px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
const INDENT = 14

// ── Details panel ──────────────────────────────────────────────────

function Preview({ label, text, tone }: { label: string; text: string; tone?: "danger" }) {
  return (
    <section data-slot="trace-waterfall-preview" className="flex flex-col gap-1">
      <h4 className="text-xs font-medium text-muted-foreground">{label}</h4>
      <pre
        dir="auto"
        className={cn(
          "m-0 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md p-2 font-mono text-xs/5",
          tone === "danger"
            ? "bg-danger-soft text-danger-soft-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {text}
      </pre>
    </section>
  )
}

function Details({
  span,
  now,
  l,
  kind,
  status,
  formatCost,
}: {
  span: TraceSpan
  now: number
  l: TraceWaterfallLabels
  kind: string
  status: string
  formatCost: (n: number) => string
}) {
  const running = span.status === "running"
  const end = running ? now : (span.end ?? span.start)
  const metrics: [string, string][] = [
    [l.metricStart, formatTraceDuration(span.start)],
    [l.metricEnd, running ? l.statusRunning : formatTraceDuration(end)],
    [l.metricDuration, formatTraceDuration(end - span.start)],
  ]
  if (span.cost !== undefined) metrics.push([l.metricCost, formatCost(span.cost)])
  if (span.tokensIn !== undefined) metrics.push([l.metricTokensIn, TOKENS.format(span.tokensIn)])
  if (span.tokensOut !== undefined) metrics.push([l.metricTokensOut, TOKENS.format(span.tokensOut)])
  return (
    <div data-slot="trace-waterfall-details" className="flex flex-col gap-3 text-sm">
      <p className="text-xs text-muted-foreground">
        {kind} · {status}
      </p>
      {span.detail && (
        <p dir="auto" className="break-words text-muted-foreground">
          {span.detail}
        </p>
      )}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        {metrics.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="font-medium tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {span.error && <Preview label={l.error} text={span.error} tone="danger" />}
      {span.input && <Preview label={l.input} text={span.input} />}
      {span.output && <Preview label={l.output} text={span.output} />}
    </div>
  )
}

// ── TraceWaterfall ─────────────────────────────────────────────────

export interface TraceWaterfallProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** Top-level spans (usually one agent span with children). */
  spans: TraceSpan[]
  /** Header title; defaults to `labels.title`. */
  title?: React.ReactNode
  /** "Now" in ms from run start. Omit to let the component tick its own clock while a span runs. */
  now?: number
  /** Smallest time axis, in ms. The axis grows past it as the run lengthens. */
  minRange?: number
  /** Tag the slowest finished llm/tool span (needs at least two). */
  markSlowest?: boolean
  /** Formats costs. Default: USD, "en". */
  formatCost?: (cost: number) => string
  /** Ids of folded branches. */
  collapsed?: string[]
  defaultCollapsed?: string[]
  onCollapsedChange?: (ids: string[]) => void
  /** Id of the span whose details are open (`null` = none). */
  openId?: string | null
  defaultOpenId?: string | null
  onOpenIdChange?: (id: string | null) => void
  /** Details container: popover on wide screens and a bottom sheet on narrow ones by default. */
  detailsMode?: "auto" | "popover" | "sheet"
  labels?: Partial<TraceWaterfallLabels>
}

function TraceWaterfall({
  spans,
  title,
  now: nowProp,
  minRange = 10_000,
  markSlowest = true,
  formatCost = defaultFormatCost,
  collapsed: collapsedProp,
  defaultCollapsed,
  onCollapsedChange,
  openId: openIdProp,
  defaultOpenId = null,
  onOpenIdChange,
  detailsMode = "auto",
  labels: labelsProp,
  className,
  ...props
}: TraceWaterfallProps) {
  const l = mergeLabels(labelsProp)
  const [collapsedIds, setCollapsedIds] = useControllable<string[]>(
    collapsedProp,
    defaultCollapsed ?? [],
    onCollapsedChange,
  )
  const [openId, setOpenId] = useControllable<string | null>(
    openIdProp,
    defaultOpenId,
    onOpenIdChange,
  )
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>())
  const lastOpened = React.useRef<string | null>(null)

  // ── Clock ──
  const all = React.useMemo(() => flatten(spans), [spans])
  const latest = React.useMemo(
    () => all.reduce((m, s) => Math.max(m, s.start, s.end ?? 0), 0),
    [all],
  )
  const running = all.some((s) => s.status === "running")
  const live = running && nowProp === undefined
  const latestRef = React.useRef(latest)
  React.useEffect(() => {
    latestRef.current = latest
  })
  const [clock, setClock] = React.useState(0)
  React.useEffect(() => {
    if (!live) return
    // The clock continues from the latest time the data knows about.
    const base = latestRef.current
    const t0 = performance.now()
    const id = setInterval(() => setClock(base + performance.now() - t0), 100)
    return () => clearInterval(id)
  }, [live])
  const now = nowProp ?? Math.max(clock, latest)

  // ── Derived data ──
  const collapsedSet = React.useMemo(() => new Set(collapsedIds), [collapsedIds])
  const rows = React.useMemo(() => buildRows(spans, collapsedSet), [spans, collapsedSet])
  const endOf = (s: TraceSpan) => (s.status === "running" ? now : (s.end ?? s.start))
  const total = all.reduce((m, s) => Math.max(m, endOf(s)), 0)
  const { step, range } = niceAxis(Math.max(minRange, total * 1.08))
  const ticks = Array.from({ length: Math.round(range / step) + 1 }, (_, i) => i * step)
  const pct = (ms: number) => Math.min(100, Math.max(0, Math.round((ms / range) * 1000) / 10))
  const nowPct = pct(now)

  const slowestId = React.useMemo(() => {
    if (!markSlowest) return null
    const done = all.filter(
      (s) => (s.kind === "llm" || s.kind === "tool") && s.status !== "running",
    )
    if (done.length < 2) return null
    const dur = (s: TraceSpan) => (s.end ?? s.start) - s.start
    return done.reduce((a, b) => (dur(b) > dur(a) ? b : a)).id
  }, [all, markSlowest])

  const totals = all.reduce(
    (acc, s) => addMetrics(acc, ownMetrics(s)),
    {} as Metrics,
  )
  const runState: TraceRunState = running
    ? "live"
    : spans.some((s) => s.status === "failed")
      ? "failed"
      : "done"
  const stateLabel = { live: l.live, done: l.done, failed: l.failed }[runState]
  const stateTone = {
    live: "info",
    done: "success",
    failed: "danger",
  }[runState] as "info" | "success" | "danger"

  const kindLabel: Record<TraceSpanKind, string> = {
    agent: l.kindAgent,
    subagent: l.kindSubagent,
    llm: l.kindLlm,
    tool: l.kindTool,
  }
  const statusLabel: Record<TraceSpanStatus, string> = {
    running: l.statusRunning,
    done: l.statusDone,
    failed: l.statusFailed,
  }

  // ── Details container ──
  const narrow = useIsNarrow(detailsMode === "auto")
  const asSheet = detailsMode === "sheet" || (detailsMode === "auto" && narrow)
  const openSpan = openId === null ? undefined : all.find((s) => s.id === openId)
  const anchor = React.useMemo(
    () => ({
      current: {
        getBoundingClientRect: () =>
          rowRefs.current.get(openId ?? "")?.getBoundingClientRect() ?? new DOMRect(),
      },
    }),
    [openId],
  )
  const restoreFocus = (e: Event) => {
    e.preventDefault()
    rowRefs.current.get(lastOpened.current ?? "")?.focus()
  }
  const toggleDetails = (id: string) => {
    lastOpened.current = id
    setOpenId(openId === id ? null : id)
  }
  const setFold = (id: string, fold: boolean) => {
    const rest = collapsedIds.filter((c) => c !== id)
    setCollapsedIds(fold ? [...rest, id] : rest)
  }

  // ── Keyboard (roving tabindex) ──
  const tabId = rows.some((r) => r.span.id === activeId) ? activeId : rows[0]?.span.id
  const focusAt = (i: number) => {
    const r = rows[Math.max(0, Math.min(rows.length - 1, i))]
    if (!r) return
    setActiveId(r.span.id)
    rowRefs.current.get(r.span.id)?.focus()
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, i: number) => {
    // Keys from inside the row (or a portalled panel) are not ours.
    if (e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return
    const row = rows[i]
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const key =
      rtl && (e.key === "ArrowRight" || e.key === "ArrowLeft")
        ? e.key === "ArrowRight"
          ? "ArrowLeft"
          : "ArrowRight"
        : e.key
    if (key === "ArrowDown") focusAt(i + 1)
    else if (key === "ArrowUp") focusAt(i - 1)
    else if (key === "Home") focusAt(0)
    else if (key === "End") focusAt(rows.length - 1)
    else if (key === "ArrowRight") {
      if (!row.hasChildren) return
      if (!row.expanded) setFold(row.span.id, false)
      else focusAt(i + 1)
    } else if (key === "ArrowLeft") {
      if (row.expanded) setFold(row.span.id, true)
      else if (row.parentId) focusAt(rows.findIndex((r) => r.span.id === row.parentId))
      else return
    } else if (key === "Enter" || key === " ") toggleDetails(row.span.id)
    else if (key === "Escape" && openId !== null) setOpenId(null)
    else return
    e.preventDefault()
  }

  const detailsBody = openSpan && (
    <Details
      span={openSpan}
      now={now}
      l={l}
      kind={kindLabel[openSpan.kind]}
      status={statusLabel[openSpan.status]}
      formatCost={formatCost}
    />
  )

  return (
    <div
      data-slot="trace-waterfall"
      data-state={runState}
      className={cn(
        "@container w-full overflow-hidden rounded-xl border bg-card text-sm text-card-foreground",
        className,
      )}
      {...props}
    >
      <style href="gf-trace-waterfall" precedence="low">{TRACE_CSS}</style>
      <span role="status" aria-live="polite" className="sr-only">
        {l.announce(runState)}
      </span>

      {/* Header */}
      <div
        data-slot="trace-waterfall-header"
        className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-3"
      >
        <h3 className="min-w-0 truncate font-semibold">{title ?? l.title}</h3>
        <Tag color={stateTone} size="sm" data-slot="trace-waterfall-state" className="gap-1.5">
          <span
            aria-hidden
            className={cn("size-1.5 rounded-full bg-current", runState === "live" && "gf-trace-waterfall-live")}
          />
          {stateLabel}
        </Tag>
        <p
          data-slot="trace-waterfall-totals"
          className="ms-auto flex flex-wrap items-center gap-x-3 text-xs tabular-nums text-muted-foreground"
        >
          <span>{formatTraceDuration(total)}</span>
          {totals.cost !== undefined && <span>{formatCost(totals.cost)}</span>}
          {totals.tin !== undefined || totals.tout !== undefined ? (
            <span>{l.tokens(totals.tin ?? 0, totals.tout ?? 0)}</span>
          ) : null}
        </p>
      </div>

      {/* Time axis */}
      <div
        aria-hidden
        data-slot="trace-waterfall-axis"
        className={cn("grid gap-x-3 border-b px-4 py-1 text-[11px] tabular-nums text-muted-foreground", COLS)}
      >
        <div className="hidden @[520px]:block" />
        <div className="relative h-4">
          {ticks.map((t) => {
            const p = pct(t)
            if (live && Math.abs(p - nowPct) < 8) return null
            return (
              <span
                key={t}
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap rtl:translate-x-1/2"
                style={{ insetInlineStart: `${p}%` }}
              >
                {formatTraceDuration(t)}
              </span>
            )
          })}
          {running && (
            <span
              data-slot="trace-waterfall-now"
              className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 text-primary-foreground rtl:translate-x-1/2"
              style={{ insetInlineStart: `${nowPct}%` }}
            >
              {l.now}
            </span>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="relative">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-muted-foreground">{l.empty}</p>
        )}
        <div role="tree" aria-label={l.treeLabel} data-slot="trace-waterfall-tree" className="py-1">
          {rows.map((r, i) => {
            const { span, depth } = r
            const id = span.id
            const isRunning = span.status === "running"
            const end = endOf(span)
            const left = pct(span.start)
            const width = Math.min(pct(end) - left, 100 - left)
            // Label goes after the bar, else before it, else (a bar spanning
            // nearly the whole axis) inside its end — never over the name column.
            const labelPos = left + width <= 72 ? "after" : left >= 12 ? "before" : "inside"
            const durText = formatTraceDuration(end - span.start)
            const m = r.hasChildren && !r.expanded ? rollup(span) : ownMetrics(span)
            const costText = m.cost !== undefined ? formatCost(m.cost) : undefined
            const tokText =
              m.tin !== undefined || m.tout !== undefined
                ? l.tokens(m.tin ?? 0, m.tout ?? 0)
                : undefined
            return (
              <div
                key={id}
                ref={(el) => {
                  if (el) rowRefs.current.set(id, el)
                  else rowRefs.current.delete(id)
                }}
                role="treeitem"
                tabIndex={id === tabId ? 0 : -1}
                aria-level={depth + 1}
                aria-setsize={r.setSize}
                aria-posinset={r.pos}
                aria-expanded={r.hasChildren ? r.expanded : undefined}
                aria-haspopup="dialog"
                aria-selected={openId === id}
                aria-label={l.rowLabel({
                  name: span.name,
                  kind: kindLabel[span.kind],
                  status: statusLabel[span.status],
                  duration: durText,
                  cost: costText,
                })}
                data-slot="trace-waterfall-row"
                data-kind={span.kind}
                data-status={span.status}
                data-open={openId === id ? "" : undefined}
                onFocus={(e) => {
                  if (e.target === e.currentTarget) setActiveId(id)
                }}
                onClick={() => {
                  setActiveId(id)
                  toggleDetails(id)
                }}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "grid cursor-pointer gap-x-3 gap-y-1 px-4 py-1.5 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60 data-[open]:bg-muted",
                  COLS,
                )}
              >
                {/* Label cell */}
                <div data-slot="trace-waterfall-label" className="flex min-w-0 flex-col">
                  <div
                    className="flex min-w-0 items-center gap-1.5"
                    style={{ paddingInlineStart: depth * INDENT }}
                  >
                    <span
                      aria-hidden
                      data-slot="trace-waterfall-fold"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground",
                        r.hasChildren && "hover:bg-muted-foreground/15 hover:text-foreground",
                      )}
                      onClick={
                        r.hasChildren
                          ? (e) => {
                              e.stopPropagation()
                              setActiveId(id)
                              setFold(id, r.expanded)
                            }
                          : undefined
                      }
                    >
                      {r.hasChildren && (
                        <ChevronRight
                          className={cn("size-4 transition-transform rtl:-scale-x-100", r.expanded && "rotate-90 rtl:rotate-90")}
                        />
                      )}
                    </span>
                    <span
                      aria-hidden
                      data-slot="trace-waterfall-icon"
                      className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
                    >
                      {span.icon ?? KIND_ICON[span.kind]}
                    </span>
                    <span
                      data-slot="trace-waterfall-name"
                      title={span.name}
                      className="min-w-0 max-w-[60%] shrink-0 truncate font-medium"
                    >
                      {span.name}
                    </span>
                    {id === slowestId && (
                      <Tag color="warn" size="sm" data-slot="trace-waterfall-slowest" className="shrink-0">
                        {l.slowest}
                      </Tag>
                    )}
                    {span.status === "failed" && (
                      <AlertCircle aria-hidden className="size-3.5 shrink-0 text-danger-soft-foreground" />
                    )}
                    {span.detail && (
                      <span
                        data-slot="trace-waterfall-detail"
                        dir="auto"
                        title={span.detail}
                        className="min-w-0 flex-1 truncate text-xs text-muted-foreground"
                      >
                        {span.detail}
                      </span>
                    )}
                  </div>
                  {(tokText || costText) && (
                    <p
                      data-slot="trace-waterfall-meta"
                      className="truncate text-[11px] tabular-nums text-muted-foreground"
                      style={{ paddingInlineStart: depth * INDENT + 52 }}
                    >
                      {[tokText, costText].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>

                {/* Timeline cell */}
                <div
                  aria-hidden
                  data-slot="trace-waterfall-track"
                  className="relative h-5 self-center"
                >
                  <span
                    data-slot="trace-waterfall-bar"
                    className={cn(
                      "gf-trace-waterfall-bar absolute inset-y-0.5 min-w-[3px] rounded-sm border",
                      span.status === "failed" ? FAILED_BAR : KIND_BAR[span.kind],
                      isRunning && "gf-trace-waterfall-run",
                    )}
                    style={{ insetInlineStart: `${left}%`, width: `${width}%` }}
                  />
                  <span
                    data-slot="trace-waterfall-duration"
                    className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] tabular-nums text-muted-foreground"
                    style={
                      labelPos === "after"
                        ? { insetInlineStart: `calc(${left + width}% + 4px)` }
                        : labelPos === "before"
                          ? { insetInlineEnd: `calc(${100 - left}% + 4px)` }
                          : { insetInlineEnd: `calc(${100 - left - width}% + 6px)` }
                    }
                  >
                    {durText}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gridlines and the now line (wide layout only) */}
        <div
          aria-hidden
          data-slot="trace-waterfall-grid"
          className={cn("pointer-events-none absolute inset-0 hidden gap-x-3 px-4 @[520px]:grid", COLS)}
        >
          <div />
          <div className="relative">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute inset-y-0 w-px bg-border/60"
                style={{ insetInlineStart: `${pct(t)}%` }}
              />
            ))}
            {running && (
              <span
                className="absolute inset-y-0 w-px bg-primary"
                style={{ insetInlineStart: `${nowPct}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Details: one popover or sheet, anchored to the open row */}
      <Popover
        open={!!openSpan && !asSheet}
        onOpenChange={(o) => {
          if (!o) setOpenId(null)
        }}
      >
        <PopoverAnchor virtualRef={anchor} />
        {openSpan && (
          <PopoverContent
            aria-label={openSpan.name}
            align="center"
            collisionPadding={8}
            className="w-80 max-w-[calc(100vw-1rem)] p-0"
            onCloseAutoFocus={restoreFocus}
            onInteractOutside={(e) => {
              // A click on the open row toggles it shut; don't also dismiss here.
              if (rowRefs.current.get(openSpan.id)?.contains(e.target as Node)) e.preventDefault()
            }}
          >
            <div className="flex items-start gap-2 border-b px-4 py-3">
              <h4 dir="auto" className="min-w-0 flex-1 break-words font-semibold">
                {openSpan.name}
              </h4>
              <PopoverClose
                aria-label={l.close}
                className="-me-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <X aria-hidden className="size-4" />
              </PopoverClose>
            </div>
            <div className="max-h-[min(24rem,60vh)] overflow-auto p-4">{detailsBody}</div>
          </PopoverContent>
        )}
      </Popover>
      <Sheet
        open={!!openSpan && asSheet}
        onOpenChange={(o) => {
          if (!o) setOpenId(null)
        }}
      >
        {openSpan && (
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="max-h-[85vh] gap-0 rounded-t-xl"
            onCloseAutoFocus={restoreFocus}
          >
            <div className="flex items-start gap-2 border-b px-4 py-3">
              <div className="min-w-0 flex-1">
                <SheetTitle dir="auto" className="break-words">
                  {openSpan.name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {kindLabel[openSpan.kind]} · {statusLabel[openSpan.status]}
                </SheetDescription>
              </div>
              <SheetClose
                aria-label={l.close}
                className="-me-1 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <X aria-hidden className="size-4" />
              </SheetClose>
            </div>
            <div className="overflow-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {detailsBody}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}

export { TraceWaterfall }

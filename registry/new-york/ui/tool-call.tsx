"use client"

import * as React from "react"
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
  Wrench,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"
import { Spinner } from "./spinner"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours come from theme tokens only (`var(--muted)` etc.), so dark mode and
// `data-brand` follow the host app. Everything that moves is switched off or
// shortened in the reduced-motion block at the bottom.
const TOOL_CALL_CSS = `
  .gf-tool-call-body[data-state="open"]{animation:gf-tool-call-open .32s cubic-bezier(.22,1,.36,1);}
  .gf-tool-call-body[data-state="closed"]{animation:gf-tool-call-close .28s cubic-bezier(.22,1,.36,1);}
  @keyframes gf-tool-call-open{from{height:0;opacity:0;}to{height:var(--radix-collapsible-content-height);opacity:1;}}
  @keyframes gf-tool-call-close{from{height:var(--radix-collapsible-content-height);opacity:1;}to{height:0;opacity:0;}}
  .gf-tool-call-chevron{transition:transform .3s cubic-bezier(.22,1,.36,1);}
  button[data-state="open"]>.gf-tool-call-chevron{transform:rotate(180deg);}
  .gf-tool-call-status{animation:gf-tool-call-in .3s cubic-bezier(.22,1,.36,1);}
  @keyframes gf-tool-call-in{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:none;}}
  .gf-tool-call-pop{animation:gf-tool-call-pop .36s cubic-bezier(.34,1.56,.64,1) backwards;}
  @keyframes gf-tool-call-pop{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:none;}}
  .gf-tool-call-code{transition:max-height .36s cubic-bezier(.22,1,.36,1);}
  .gf-tool-call-fade{background:linear-gradient(to top,var(--muted),transparent);transition:opacity .24s;}
  .gf-tool-call-shimmer{color:transparent;-webkit-background-clip:text;background-clip:text;background-image:linear-gradient(90deg,var(--muted-foreground) 35%,var(--foreground) 50%,var(--muted-foreground) 65%);background-size:250% 100%;animation:gf-tool-call-shim 1.8s linear infinite;}
  @keyframes gf-tool-call-shim{from{background-position:100% 0;}to{background-position:-100% 0;}}
  @media (prefers-reduced-motion: reduce){
    .gf-tool-call-body,.gf-tool-call-status,.gf-tool-call-pop{animation-duration:.01ms !important;}
    .gf-tool-call-chevron,.gf-tool-call-code,.gf-tool-call-fade{transition-duration:.01ms !important;}
    .gf-tool-call-shimmer{animation:none;color:var(--muted-foreground);background:none;}
  }
`

// ── Types ──────────────────────────────────────────────────────────

export type ToolCallStatus = "running" | "success" | "error"

/** Every user-facing string. Functions receive the values to interpolate. */
export interface ToolCallLabels {
  /** Short text beside the error glyph in the header. */
  failed: string
  /** Screen-reader announcements. */
  announceRunning: (name: string) => string
  announceSuccess: (name: string) => string
  announceError: (name: string, error?: string) => string
  /** Shown in the error panel when no `error` text was supplied. */
  errorFallback: string
  retry: string
  args: string
  result: string
  /** Placeholder in the Result section while still running. */
  waiting: string
  /** Body text for a successful call with no args and no result. */
  empty: string
  /** Copy button name; receives the section label. */
  copy: (section: string) => string
  copied: string
  showAll: string
  showLess: string
}

const DEFAULT_LABELS: ToolCallLabels = {
  failed: "Failed",
  announceRunning: (n) => `${n} is running`,
  announceSuccess: (n) => `${n} finished`,
  announceError: (n, e) => `${n} failed${e ? `: ${e}` : ""}`,
  errorFallback: "This step did not complete.",
  retry: "Retry",
  args: "Input",
  result: "Output",
  waiting: "Waiting for output…",
  empty: "Nothing to show for this call.",
  copy: (s) => `Copy ${s.toLowerCase()}`,
  copied: "Copied",
  showAll: "Expand",
  showLess: "Collapse",
}

// ── Helpers ────────────────────────────────────────────────────────

/** Compact duration: 420 ms, 3.4s, 2m 05s, 1h 07m, 2d 3h. */
export function formatDuration(ms: number, live = false): string {
  const v = Math.max(0, ms)
  if (v < 1000 && !live) return `${Math.max(1, Math.round(v))} ms`
  if (v < 60_000) return `${(v / 1000).toFixed(1)}s`
  const pad = (n: number) => String(n).padStart(2, "0")
  const m = Math.floor(v / 60_000)
  if (m < 60) return `${m}m ${pad(Math.floor((v % 60_000) / 1000))}s`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ${pad(m % 60)}m`
  return `${Math.floor(h / 24)}d ${h % 24}h`
}

/**
 * Stopwatch that ticks every 100 ms while `running`. The value freezes when
 * running stops. With `accumulate`, a later running stretch adds to the earlier
 * ones instead of restarting from zero.
 */
function useElapsed(running: boolean, startedAt?: number, accumulate = false) {
  const [elapsed, setElapsed] = React.useState<number | undefined>(undefined)
  const last = React.useRef(0)
  const base = React.useRef(0)
  const startRef = React.useRef(startedAt)
  // A `startedAt` that changes mid-run must not restart an accumulating timer
  // (the group's earliest running child changes as children finish), so the
  // effect below reads it from a ref and only re-runs for non-accumulating use.
  const restartKey = accumulate ? undefined : startedAt
  React.useEffect(() => {
    startRef.current = startedAt
  })

  React.useEffect(() => {
    if (!running) return
    const start = startRef.current ?? Date.now()
    const offset = accumulate ? base.current : 0
    const tick = () => {
      last.current = offset + Date.now() - start
      setElapsed(last.current)
    }
    tick()
    const id = setInterval(tick, 100)
    return () => {
      clearInterval(id)
      if (accumulate) base.current = last.current
    }
  }, [running, accumulate, restartKey])

  return elapsed
}

/** Turn any value into display text; `json` says whether it may be coloured. */
function toText(value: unknown): { text: string; json: boolean } {
  if (typeof value === "string") {
    const t = value.trimStart()
    if (t.startsWith("{") || t.startsWith("[")) {
      try {
        return { text: JSON.stringify(JSON.parse(value), null, 2), json: true }
      } catch {
        /* not JSON — fall through to plain text */
      }
    }
    return { text: value, json: false }
  }
  try {
    const s = JSON.stringify(value, null, 2)
    if (s !== undefined) return { text: s, json: true }
  } catch {
    /* circular / BigInt — fall through */
  }
  return { text: String(value), json: false }
}

const TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

/** Minimal JSON colouriser: keys, strings, numbers and literals. */
function colorize(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    const tone = m[1]
      ? m[2]
        ? "text-info-soft-foreground"
        : "text-success-soft-foreground"
      : m[3]
        ? "text-primary-soft-foreground"
        : "text-warning-soft-foreground"
    if (m[1] && m[2]) {
      out.push(
        <span key={i++} className={tone}>{m[1]}</span>,
        m[2],
      )
    } else {
      out.push(
        <span key={i++} className={tone}>{m[0]}</span>,
      )
    }
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.setAttribute("readonly", "")
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

const SMALL_BTN =
  "inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"

// ── Internal: copy button ──────────────────────────────────────────

function CopyButton({
  text,
  name,
  copiedName,
}: {
  text: string
  name: string
  copiedName: string
}) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const alive = React.useRef(true)
  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      clearTimeout(timer.current)
    }
  }, [])

  const label = copied ? copiedName : name
  return (
    <>
    <span role="status" aria-live="polite" className="sr-only">
      {copied ? copiedName : ""}
    </span>
    <button
      type="button"
      data-slot="tool-call-copy"
      aria-label={label}
      title={label}
      className={cn(SMALL_BTN, "size-7 justify-center px-0", copied && "text-success")}
      onClick={async () => {
        if (!(await copyText(text)) || !alive.current) return
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 1400)
      }}
    >
      {copied ? (
        <Check key="ok" aria-hidden className="gf-tool-call-pop size-3.5" />
      ) : (
        <Copy key="copy" aria-hidden className="size-3.5" />
      )}
    </button>
    </>
  )
}

// ── Internal: labelled code block ──────────────────────────────────

// Beyond this the block scrolls instead of growing.
const HARD_MAX = 640
// Blocks barely over the cap are shown in full — no pointless toggle.
const TOLERANCE = 24

function CodeSection({
  label,
  value,
  maxHeight,
  labels,
}: {
  label: string
  value: unknown
  maxHeight: number
  labels: ToolCallLabels
}) {
  const { text, json } = React.useMemo(() => toText(value), [value])
  const inner = React.useRef<HTMLPreElement>(null)
  const [natural, setNatural] = React.useState(0)
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setNatural(el.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text])

  const capped = natural > maxHeight + TOLERANCE
  const folded = capped && !expanded
  const scrollable = !folded && natural > HARD_MAX

  return (
    <section data-slot="tool-call-section" className="px-3 py-2">
      <div className="flex items-center justify-between">
        <h4
          data-slot="tool-call-section-label"
          className="text-xs font-medium text-muted-foreground"
        >
          {label}
        </h4>
        <CopyButton
          text={text}
          name={labels.copy(label)}
          copiedName={labels.copied}
        />
      </div>
      <div className="relative mt-1">
        <div
          data-slot="tool-call-code"
          {...(scrollable ? { tabIndex: 0, role: "region", "aria-label": label } : {})}
          className={cn(
            "gf-tool-call-code rounded-md bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
            folded ? "overflow-hidden" : "overflow-y-auto overscroll-contain",
          )}
          style={{ maxHeight: folded ? maxHeight : HARD_MAX }}
        >
          <pre
            ref={inner}
            className="m-0 whitespace-pre-wrap break-words p-2.5 font-mono text-xs/5 text-foreground"
          >
            {json ? colorize(text) : text}
          </pre>
        </div>
        <div
          aria-hidden
          className="gf-tool-call-fade pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-md"
          style={{ opacity: folded ? 1 : 0 }}
        />
      </div>
      {capped && (
        <button
          type="button"
          data-slot="tool-call-toggle"
          aria-expanded={expanded}
          className={cn(SMALL_BTN, "mt-1")}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? labels.showLess : labels.showAll}
        </button>
      )}
    </section>
  )
}

// ── Open-state helper (controlled / uncontrolled) ──────────────────

function useOpen(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [inner, setInner] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const value = controlled ? open : inner
  const set = (next: boolean) => {
    if (!controlled) setInner(next)
    onOpenChange?.(next)
  }
  return { value, controlled, set, setInner }
}

// ── ToolCall ───────────────────────────────────────────────────────

export interface ToolCallProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Tool identifier as the agent calls it. */
  name: string
  /** One-line description of what the call did. */
  summary?: React.ReactNode
  /** Leading glyph; defaults to a wrench. Also used by `ToolCallGroup`. */
  icon?: React.ReactNode
  status: ToolCallStatus
  /** Arguments passed to the tool. `undefined` hides the section. */
  args?: unknown
  /** Tool output. `undefined` hides the section (or shows a placeholder while running). */
  result?: unknown
  /** Error message for `status="error"`. */
  error?: string
  /** Epoch ms the live timer counts from; defaults to when the card first sees `running`. */
  startedAt?: number
  /** Final duration in ms, shown once the call is no longer running. */
  duration?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Open automatically when the status turns to error (uncontrolled only). */
  openOnError?: boolean
  /** Shows a Retry button in the error panel. */
  onRetry?: () => void
  /** Code blocks taller than this (px) fold behind the expand toggle. */
  maxCodeHeight?: number
  labels?: Partial<ToolCallLabels>
}

function ToolCall({
  name,
  summary,
  icon,
  status,
  args,
  result,
  error,
  startedAt,
  duration,
  defaultOpen = false,
  open,
  onOpenChange,
  openOnError = true,
  onRetry,
  maxCodeHeight = 220,
  labels: labelsProp,
  className,
  ...props
}: ToolCallProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const o = useOpen(open, defaultOpen, onOpenChange)

  // Auto-open on a transition into error; auto-close on leaving it, but only
  // while the user has not toggled the card themselves (`auto` is cleared then).
  const [prev, setPrev] = React.useState(status)
  const [auto, setAuto] = React.useState(false)
  if (prev !== status) {
    setPrev(status)
    if (!o.controlled && openOnError) {
      if (status === "error" && !o.value) {
        o.setInner(true)
        setAuto(true)
      } else if (prev === "error" && auto) {
        o.setInner(false)
        setAuto(false)
      }
    }
  }

  const running = status === "running"
  const elapsed = useElapsed(running, startedAt)
  const time = running
    ? formatDuration(elapsed ?? 0, true)
    : (duration ?? elapsed) !== undefined
      ? formatDuration((duration ?? elapsed) as number)
      : null

  const hasArgs = args !== undefined
  const hasResult = result !== undefined
  const announce =
    status === "running"
      ? labels.announceRunning(name)
      : status === "success"
        ? labels.announceSuccess(name)
        : labels.announceError(name, error)

  return (
    <div
      data-slot="tool-call"
      data-status={status}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <style href="gf-tool-call" precedence="low">{TOOL_CALL_CSS}</style>
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
      <Collapsible
        open={o.value}
        onOpenChange={(next) => {
          setAuto(false)
          o.set(next)
        }}
      >
        <CollapsibleTrigger
          data-slot="tool-call-header"
          className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60 pointer-coarse:min-h-12"
        >
          <span
            data-slot="tool-call-icon"
            aria-hidden
            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
          >
            {icon ?? <Wrench />}
          </span>
          <span
            data-slot="tool-call-name"
            title={name}
            className="min-w-0 max-w-[50%] truncate font-mono text-[13px] font-medium"
          >
            {name}
          </span>
          {summary != null && (
            <span
              data-slot="tool-call-summary"
              dir="auto"
              title={typeof summary === "string" ? summary : undefined}
              className="min-w-0 flex-1 truncate text-muted-foreground"
            >
              {summary}
            </span>
          )}
          <span
            key={status}
            data-slot="tool-call-status"
            className={cn(
              "gf-tool-call-status ml-auto flex shrink-0 items-center gap-1.5 text-xs tabular-nums",
              status === "running" && "text-info-soft-foreground",
              status === "success" && "text-success-soft-foreground",
              status === "error" && "text-danger-soft-foreground",
            )}
          >
            {status === "running" && (
              <Spinner color="current" size="sm" label="" aria-hidden role="presentation" />
            )}
            {status === "success" && <Check aria-hidden className="size-3.5" />}
            {status === "error" && <AlertCircle aria-hidden className="size-3.5" />}
            {status === "error" ? labels.failed : time}
          </span>
          <ChevronDown
            aria-hidden
            className="gf-tool-call-chevron size-4 shrink-0 text-muted-foreground"
          />
        </CollapsibleTrigger>

        <CollapsibleContent
          data-slot="tool-call-body"
          className="gf-tool-call-body"
        >
          <div className="divide-y divide-border border-t border-border">
            {status === "error" && (
              <div
                data-slot="tool-call-error"
                className="flex items-start gap-2 bg-danger-soft px-3 py-2.5 text-sm text-danger-soft-foreground"
              >
                <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p
                  dir="auto"
                  className="max-h-[15lh] min-w-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words"
                >
                  {error || labels.errorFallback}
                </p>
                {onRetry && (
                  <button
                    type="button"
                    data-slot="tool-call-retry"
                    onClick={onRetry}
                    className={cn(
                      SMALL_BTN,
                      "shrink-0 text-danger-soft-foreground hover:bg-danger/10 hover:text-danger-soft-foreground [&:active_svg]:-rotate-60",
                    )}
                  >
                    <RotateCcw aria-hidden className="size-3.5 transition-transform" />
                    {labels.retry}
                  </button>
                )}
              </div>
            )}
            {hasArgs && (
              <CodeSection
                label={labels.args}
                value={args}
                maxHeight={maxCodeHeight}
                labels={labels}
              />
            )}
            {hasResult ? (
              <CodeSection
                label={labels.result}
                value={result}
                maxHeight={maxCodeHeight}
                labels={labels}
              />
            ) : running ? (
              <section data-slot="tool-call-section" className="px-3 py-2">
                <h4 className="text-xs font-medium text-muted-foreground">
                  {labels.result}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{labels.waiting}</p>
              </section>
            ) : null}
            {status === "success" && !hasArgs && !hasResult && (
              <p
                data-slot="tool-call-empty"
                className="px-3 py-2.5 text-sm text-muted-foreground"
              >
                {labels.empty}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// ── ToolCallGroup ──────────────────────────────────────────────────

export interface ToolCallGroupLabels {
  /** Title once all calls settled. Receives the number of calls. */
  used: (count: number) => string
  /** Suffix with the failed count (shown only when idle). */
  failed: (count: number) => string
}

const DEFAULT_GROUP_LABELS: ToolCallGroupLabels = {
  used: (n) => `Ran ${n} ${n === 1 ? "tool" : "tools"}`,
  failed: (n) => `${n} failed`,
}

export interface ToolCallGroupProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** `ToolCall` elements. Their props feed the summary, so do not wrap them. */
  children?: React.ReactNode
  /** Title once nothing is running; overrides `labels.used`. */
  label?: string
  /** Title while any child is running. */
  runningLabel?: string
  /** Explicit total (ms); otherwise the children's sum, else the measured time. */
  duration?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  labels?: Partial<ToolCallGroupLabels>
}

function ToolCallGroup({
  children,
  label,
  runningLabel = "Working…",
  duration,
  defaultOpen = false,
  open,
  onOpenChange,
  labels: labelsProp,
  className,
  ...props
}: ToolCallGroupProps) {
  const labels = { ...DEFAULT_GROUP_LABELS, ...labelsProp }
  const o = useOpen(open, defaultOpen, onOpenChange)

  const calls = React.Children.toArray(children)
    .filter((c): c is React.ReactElement<ToolCallProps> => React.isValidElement(c))
    .map((c) => c.props)
  const running = calls.some((c) => c.status === "running")
  const failed = calls.filter((c) => c.status === "error").length
  // The group never shows less than any child that is still running.
  const starts = calls
    .filter((c) => c.status === "running" && c.startedAt !== undefined)
    .map((c) => c.startedAt as number)
  const measured = useElapsed(
    running,
    starts.length ? Math.min(...starts) : undefined,
    true,
  )
  const total =
    duration ??
    (calls.length > 0 && calls.every((c) => c.duration !== undefined)
      ? calls.reduce((sum, c) => sum + (c.duration as number), 0)
      : measured)

  const title = running
    ? runningLabel
    : (label ?? labels.used(calls.length))
  const showFailed = !running && failed > 0

  return (
    <div
      data-slot="tool-call-group"
      className={cn("text-sm", className)}
      {...props}
    >
      <style href="gf-tool-call" precedence="low">{TOOL_CALL_CSS}</style>
      <span role="status" aria-live="polite" className="sr-only">
        {showFailed ? `${title}, ${labels.failed(failed)}` : title}
      </span>
      <Collapsible open={o.value} onOpenChange={o.set}>
        <CollapsibleTrigger
          data-slot="tool-call-group-header"
          className="flex min-h-9 w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <span aria-hidden className="flex shrink-0 -space-x-1.5">
            {calls.slice(-3).map((c, i) => (
              <span
                key={calls.length - Math.min(3, calls.length) + i}
                className="gf-tool-call-pop flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground [&_svg]:size-3"
              >
                {c.icon ?? <Wrench />}
              </span>
            ))}
          </span>
          <span
            key={running ? "running" : "done"}
            data-slot="tool-call-group-title"
            className={cn(
              "gf-tool-call-status min-w-0 truncate",
              running && "gf-tool-call-shimmer",
            )}
          >
            {title}
          </span>
          {showFailed && (
            <span className="shrink-0 text-danger-soft-foreground">· {labels.failed(failed)}</span>
          )}
          {total !== undefined && (
            <span className="shrink-0 text-xs tabular-nums">
              · {formatDuration(total, running)}
            </span>
          )}
          <ChevronDown
            aria-hidden
            className="gf-tool-call-chevron ml-auto size-4 shrink-0"
          />
        </CollapsibleTrigger>
        <CollapsibleContent
          data-slot="tool-call-group-list"
          className="gf-tool-call-body"
        >
          <div className="flex flex-col gap-2 pt-2">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export { ToolCall, ToolCallGroup }

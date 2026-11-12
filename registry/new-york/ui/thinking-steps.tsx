"use client"

import * as React from "react"
import { CheckCircle2, ChevronDown, ExternalLink, Globe, Lightbulb, Loader2, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { formatElapsed, type ThinkingIndicatorUnits } from "./thinking-indicator"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours come from theme tokens only, so dark mode and `data-brand` follow the
// host app. Everything that moves is switched off in the reduced-motion block.
const THINKING_STEPS_CSS = `
  .gf-thinking-steps-body[data-state="open"]{animation:gf-thinking-steps-open .32s cubic-bezier(.22,1,.36,1);}
  .gf-thinking-steps-body[data-state="closed"]{animation:gf-thinking-steps-close .28s cubic-bezier(.22,1,.36,1);}
  @keyframes gf-thinking-steps-open{from{height:0;opacity:0;}to{height:var(--radix-collapsible-content-height);opacity:1;}}
  @keyframes gf-thinking-steps-close{from{height:var(--radix-collapsible-content-height);opacity:1;}to{height:0;opacity:0;}}
  .gf-thinking-steps-chevron{transition:transform .3s cubic-bezier(.22,1,.36,1);}
  button[data-state="open"]>.gf-thinking-steps-chevron{transform:rotate(180deg);}
  .gf-thinking-steps-enter{animation:gf-thinking-steps-in .42s cubic-bezier(.22,1,.36,1) both;}
  @keyframes gf-thinking-steps-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
  .gf-thinking-steps-spin{animation:gf-thinking-steps-rot .8s linear infinite;}
  @keyframes gf-thinking-steps-rot{to{transform:rotate(360deg);}}
  .gf-thinking-steps-shimmer{color:transparent;-webkit-background-clip:text;background-clip:text;background-image:linear-gradient(100deg,var(--muted-foreground) 42%,var(--foreground) 50%,var(--muted-foreground) 58%);background-size:250% 100%;animation:gf-thinking-steps-sweep 1.7s linear infinite;}
  @keyframes gf-thinking-steps-sweep{from{background-position:100% 0;}to{background-position:-100% 0;}}
  @media (prefers-reduced-motion: reduce){
    .gf-thinking-steps-body,.gf-thinking-steps-enter,.gf-thinking-steps-spin{animation:none !important;}
    .gf-thinking-steps-chevron{transition:none;}
    .gf-thinking-steps-shimmer{animation:none;color:var(--muted-foreground);background:none;}
  }
`

// ── Types ──────────────────────────────────────────────────────────

export interface ThinkingSource {
  /** Page or document title; also the chip text and tooltip heading. */
  title: string
  /** Short site / system name shown in the tooltip. Derived from `url` when omitted. */
  domain?: string
  /** When set the chip is an external link (new tab, `rel="noopener noreferrer"`). */
  url?: string
  /** Image URL for the chip glyph. Wins over `icon`. */
  favicon?: string
  /** Lucide (or any) glyph for the chip when there is no `favicon`. Defaults to a globe. */
  icon?: React.ReactNode
  /** Excerpt shown in the tooltip. */
  snippet?: string
}

export type ThinkingStep =
  | {
      id?: string | number
      kind: "search"
      /** What was searched for. */
      query: string
      sources?: ThinkingSource[]
    }
  | {
      id?: string | number
      kind: "thought"
      /** Short reasoning note. */
      text: string
    }

/** Every user-facing string. Functions receive the values to interpolate. */
export interface ThinkingStepsLabels {
  /** Header title while working. */
  working: string
  /** Header title once done; receives the formatted elapsed time. */
  doneTitle: (time: string) => string
  /** Muted step count in the header. */
  steps: (count: number) => string
  /** Caption above a search step's query. */
  search: string
  /** Caption above a thought step. */
  thought: string
  /** Chip that reveals hidden sources. */
  moreSources: (count: number) => string
  /** Same chip after expanding. */
  fewerSources: string
  /** Screen-reader suffix for external links. */
  newTab: string
  /** `aria-label` of the steps list. */
  list: string
  /** Live-region text for a new step. */
  announceStep: (step: ThinkingStep, index: number) => string
  /** Live-region text when finished; receives the formatted time. */
  announceDone: (time: string) => string
  /** Unit suffixes for the timer (`s`, `m`, `h`, `d`). */
  units: ThinkingIndicatorUnits
}

const DEFAULT_LABELS: ThinkingStepsLabels = {
  working: "Thinking…",
  doneTitle: (t) => `Thought for ${t}`,
  steps: (n) => (n === 1 ? "1 step" : `${n} steps`),
  search: "Search",
  thought: "Thought",
  moreSources: (n) => `+${n} more`,
  fewerSources: "Show fewer",
  newTab: "(opens in a new tab)",
  list: "Reasoning steps",
  announceStep: (s, i) => `Step ${i + 1}: ${s.kind === "search" ? `searching for ${s.query}` : s.text}`,
  announceDone: (t) => `Finished thinking after ${t}`,
  units: { s: "s", m: "m", h: "h", d: "d" },
}

function mergeLabels(labels?: Partial<ThinkingStepsLabels>): ThinkingStepsLabels {
  const l = { ...DEFAULT_LABELS }
  if (labels) {
    for (const k of Object.keys(labels) as (keyof ThinkingStepsLabels)[]) {
      if (labels[k] !== undefined) (l as Record<string, unknown>)[k] = labels[k]
    }
  }
  return l
}

// ── Helpers ────────────────────────────────────────────────────────

function hostOf(url?: string): string | undefined {
  if (!url) return undefined
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return undefined
  }
}

const CHIP =
  "inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-xs text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"

// ── Internal: source chip ──────────────────────────────────────────

function SourceChip({ source, labels }: { source: ThinkingSource; labels: ThinkingStepsLabels }) {
  const domain = source.domain ?? hostOf(source.url)
  const glyph = source.favicon ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={source.favicon} alt="" loading="lazy" className="size-3.5 shrink-0 rounded-sm object-cover" />
  ) : (
    <span aria-hidden className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-3.5">
      {source.icon ?? <Globe />}
    </span>
  )
  const text = (
    <span className="min-w-0 truncate" dir="auto">
      {source.title}
    </span>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {source.url ? (
          <a
            data-slot="thinking-steps-source"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={CHIP}
          >
            {glyph}
            {text}
            <ExternalLink aria-hidden className="size-3 shrink-0 text-muted-foreground" />
            <span className="sr-only">{labels.newTab}</span>
          </a>
        ) : (
          <span data-slot="thinking-steps-source" tabIndex={0} className={cn(CHIP, "cursor-default")}>
            {glyph}
            {text}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64">
        <span className="block font-medium" dir="auto">{source.title}</span>
        {domain && <span className="block opacity-80">{domain}</span>}
        {source.snippet && (
          <span className="mt-1 block line-clamp-4 opacity-80" dir="auto">{source.snippet}</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Internal: one step ─────────────────────────────────────────────

function StepBody({
  step,
  maxSources,
  labels,
}: {
  step: ThinkingStep
  maxSources: number
  labels: ThinkingStepsLabels
}) {
  const [expanded, setExpanded] = React.useState(false)

  if (step.kind === "thought") {
    return (
      <>
        <p className="text-xs font-medium text-muted-foreground">{labels.thought}</p>
        <p data-slot="thinking-steps-text" dir="auto" className="mt-0.5 text-sm text-foreground">
          {step.text}
        </p>
      </>
    )
  }

  const sources = step.sources ?? []
  const cap = Math.max(0, Math.floor(maxSources))
  const hidden = sources.length - cap
  const shown = expanded || hidden <= 0 ? sources : sources.slice(0, cap)

  return (
    <>
      <p className="text-xs font-medium text-muted-foreground">{labels.search}</p>
      <p data-slot="thinking-steps-query" dir="auto" className="mt-0.5 text-sm text-foreground">
        {step.query}
      </p>
      {sources.length > 0 && (
        <div data-slot="thinking-steps-sources" className="mt-2 flex flex-wrap gap-1.5">
          {shown.map((s, i) => (
            <SourceChip key={`${s.url ?? s.title}-${i}`} source={s} labels={labels} />
          ))}
          {hidden > 0 && (
            <button
              type="button"
              data-slot="thinking-steps-more"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className={cn(CHIP, "text-muted-foreground hover:text-foreground")}
            >
              {expanded ? labels.fewerSources : labels.moreSources(hidden)}
            </button>
          )}
        </div>
      )}
    </>
  )
}

// ── ThinkingSteps ──────────────────────────────────────────────────

export interface ThinkingStepsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onToggle"> {
  /**
   * Controlled mode: the steps revealed so far (e.g. from a stream).
   * Demo mode (`demo`): the full script that gets revealed one by one.
   */
  steps: ThinkingStep[]
  /** Controlled mode: work has finished. Stops the timer and shows the completion row. Ignored in demo mode. */
  done?: boolean
  /** Reveal `steps` one by one on a timer instead of reading `steps`/`done` as live state. */
  demo?: boolean
  /** Demo mode: milliseconds between reveals (floor 150). */
  delay?: number
  /** Demo mode: restart from the beginning after finishing. */
  loop?: boolean
  /** Demo mode: pause before a loop restarts, in ms. */
  loopDelay?: number
  /** Text of the completion row. */
  doneLabel?: string
  /** Seconds to show when `done` was true on mount (nothing was timed here), e.g. a saved transcript. */
  elapsed?: number
  /** Fires once per run when work finishes, with the whole seconds elapsed. */
  onDone?: (seconds: number) => void
  /** Sources shown per search step before the "+N more" chip. */
  maxSources?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  labels?: Partial<ThinkingStepsLabels>
  ref?: React.Ref<HTMLDivElement>
}

function ThinkingSteps({
  steps,
  done = false,
  demo = false,
  delay = 1600,
  loop = false,
  loopDelay = 2400,
  doneLabel = "Finished thinking",
  elapsed,
  onDone,
  maxSources = 4,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  labels: labelsProp,
  className,
  ref,
  ...props
}: ThinkingStepsProps) {
  const l = mergeLabels(labelsProp)
  const id = React.useId()
  const bodyId = `${id}-body`

  // ── Open state (controlled / uncontrolled) ──────────────────────
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const toggle = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  // ── Demo driver: count 0..total reveals steps, total+1 means done ──
  const total = steps.length
  const [count, setCount] = React.useState(0)
  const ms = Number.isFinite(delay) ? Math.max(150, delay) : 1600
  React.useEffect(() => {
    if (!demo) return
    if (count <= total) {
      const t = setTimeout(() => setCount((c) => c + 1), ms)
      return () => clearTimeout(t)
    }
    if (loop) {
      const t = setTimeout(() => setCount(0), Math.max(0, loopDelay))
      return () => clearTimeout(t)
    }
  }, [demo, count, total, ms, loop, loopDelay])

  const visible = demo ? steps.slice(0, Math.min(count, total)) : steps
  const finished = demo ? count > total : done

  // ── Timer: ticks while working, freezes on done ─────────────────
  const [seconds, setSeconds] = React.useState(elapsed ?? 0)
  const [prevFinished, setPrevFinished] = React.useState(finished)
  if (prevFinished !== finished) {
    // Reset in render so a restart never flashes the previous run's time.
    setPrevFinished(finished)
    if (!finished) setSeconds(0)
  }
  const startRef = React.useRef<number | null>(null)
  const firedRef = React.useRef(false)
  const onDoneRef = React.useRef(onDone)
  React.useEffect(() => {
    onDoneRef.current = onDone
  })
  React.useEffect(() => {
    if (!finished) {
      const start = Date.now()
      startRef.current = start
      firedRef.current = false
      const t = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000)
      return () => clearInterval(t)
    }
    if (startRef.current !== null && !firedRef.current) {
      firedRef.current = true
      const s = Math.round((Date.now() - startRef.current) / 1000)
      setSeconds(s)
      onDoneRef.current?.(s)
    }
  }, [finished])

  const time = formatElapsed(seconds, l.units)

  // Only steps that arrive after mount animate in.
  const [initialCount] = React.useState(visible.length)
  const [initialFinished] = React.useState(finished)

  const last = visible.length - 1
  const announcement = finished
    ? l.announceDone(time)
    : last >= 0
      ? l.announceStep(visible[last], last)
      : ""

  return (
    <div
      ref={ref}
      data-slot="thinking-steps"
      data-state={finished ? "done" : "working"}
      className={cn("w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground", className)}
      {...props}
    >
      <style href="gf-thinking-steps" precedence="low">{THINKING_STEPS_CSS}</style>
      <Collapsible open={open} onOpenChange={toggle}>
        <CollapsibleTrigger
          data-slot="thinking-steps-header"
          aria-controls={bodyId}
          className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-start text-sm outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60 pointer-coarse:min-h-12"
        >
          <span data-slot="thinking-steps-status-icon" aria-hidden className="flex size-4 shrink-0 items-center justify-center">
            {finished ? (
              <CheckCircle2 className="size-4 text-success" />
            ) : (
              <Loader2 className="gf-thinking-steps-spin size-4 text-primary" />
            )}
          </span>
          <span
            data-slot="thinking-steps-title"
            className={cn("min-w-0 truncate font-medium", finished ? "text-foreground" : "gf-thinking-steps-shimmer")}
          >
            {finished ? l.doneTitle(time) : l.working}
          </span>
          {visible.length > 0 && (
            <span data-slot="thinking-steps-count" className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
              {l.steps(visible.length)}
            </span>
          )}
          <span
            data-slot="thinking-steps-timer"
            className="ms-auto shrink-0 text-xs text-muted-foreground tabular-nums"
          >
            {time}
          </span>
          <ChevronDown aria-hidden className="gf-thinking-steps-chevron size-4 shrink-0 text-muted-foreground" />
        </CollapsibleTrigger>

        <CollapsibleContent id={bodyId} data-slot="thinking-steps-body" className="gf-thinking-steps-body">
          <ol
            data-slot="thinking-steps-list"
            aria-label={l.list}
            className="border-t border-border px-3 py-3"
          >
            {visible.map((step, i) => {
              const active = !finished && i === last
              const Icon = step.kind === "search" ? Search : Lightbulb
              return (
                <li
                  key={step.id ?? i}
                  data-slot="thinking-steps-step"
                  data-kind={step.kind}
                  className={cn(
                    "relative min-w-0 ps-8 pb-4 last:pb-0",
                    "before:absolute before:start-3 before:top-7 before:bottom-0 before:w-px before:bg-border last:before:hidden",
                    i >= initialCount && "gf-thinking-steps-enter",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute start-0 top-0 flex size-6 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground [&_svg]:size-3.5",
                      active && "border-primary/40 bg-primary-soft text-primary-soft-foreground",
                    )}
                  >
                    {active ? <Loader2 className="gf-thinking-steps-spin" /> : <Icon />}
                  </span>
                  <div className="pt-0.5">
                    <StepBody step={step} maxSources={maxSources} labels={l} />
                  </div>
                </li>
              )
            })}
            {finished && (
              <li
                data-slot="thinking-steps-done"
                className={cn(
                  "relative flex min-h-6 items-center ps-8 text-sm font-medium text-success-soft-foreground",
                  !initialFinished && "gf-thinking-steps-enter",
                )}
              >
                <span
                  aria-hidden
                  className="absolute start-0 top-0 flex size-6 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground"
                >
                  <CheckCircle2 className="size-3.5" />
                </span>
                {doneLabel}
              </li>
            )}
          </ol>
        </CollapsibleContent>
      </Collapsible>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}

export { ThinkingSteps }

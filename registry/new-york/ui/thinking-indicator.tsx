"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colors come from theme variables / Tailwind utilities, never literals, so light,
// dark and data-brand all follow the tokens. Everything that moves is guarded by
// the reduced-motion block at the bottom.
const THINKING_INDICATOR_CSS = `
  .gf-thinking-indicator{--gf-thinking-indicator-ease:cubic-bezier(.22,1,.36,1);}
  .gf-thinking-indicator-ray{opacity:.25;animation:gf-thinking-indicator-ray .8s linear infinite;}
  @keyframes gf-thinking-indicator-ray{from{opacity:1;}to{opacity:.25;}}
  .gf-thinking-indicator-check path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 360ms var(--gf-thinking-indicator-ease);}
  .gf-thinking-indicator[data-done="true"] .gf-thinking-indicator-check path{stroke-dashoffset:0;transition-delay:120ms;}
  .gf-thinking-indicator-shimmer{
    background-image:linear-gradient(100deg,var(--muted-foreground) 42%,var(--foreground) 50%,var(--muted-foreground) 58%);
    background-size:250% 100%;-webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;
    animation:gf-thinking-indicator-sweep 1.7s linear infinite;
  }
  @keyframes gf-thinking-indicator-sweep{from{background-position:0% 0;}to{background-position:100% 0;}}
  .gf-thinking-indicator-enter{animation:gf-thinking-indicator-in 460ms var(--gf-thinking-indicator-ease) both;}
  .gf-thinking-indicator-leave{animation:gf-thinking-indicator-out 320ms var(--gf-thinking-indicator-ease) both;}
  @keyframes gf-thinking-indicator-in{from{opacity:0;transform:translateY(70%);filter:blur(3px);}to{opacity:1;transform:none;filter:none;}}
  @keyframes gf-thinking-indicator-out{from{opacity:1;transform:none;filter:none;}to{opacity:0;transform:translateY(-70%);filter:blur(3px);}}
  @media (prefers-reduced-motion: reduce){
    .gf-thinking-indicator-ray{animation:none;opacity:.55;}
    .gf-thinking-indicator-shimmer{animation:none;background-image:none;-webkit-text-fill-color:currentColor;color:var(--muted-foreground);}
    .gf-thinking-indicator-enter,.gf-thinking-indicator-leave{animation:none;}
    .gf-thinking-indicator-leave{display:none;}
    .gf-thinking-indicator *{transition-duration:1ms !important;transition-delay:0s !important;}
  }
`

export type ThinkingIndicatorSize = "sm" | "md"
export type ThinkingIndicatorVariant = "pill" | "plain"

export interface ThinkingIndicatorUnits {
  s: string
  m: string
  h: string
  d: string
}

const DEFAULT_UNITS: ThinkingIndicatorUnits = { s: "s", m: "m", h: "h", d: "d" }

const DEFAULT_PHASES = [
  "Reading your request",
  "Looking up company data",
  "Cross-checking the details",
  "Drafting a reply",
]

const DEFAULT_INTERVAL = 2200
const MIN_INTERVAL = 200

/** Compact duration: `42s`, `3m 05s`… seconds, minutes+seconds, hours+MM, days+hours. Pass localized `units` for Thai etc. */
function formatElapsed(totalSeconds: number, units: ThinkingIndicatorUnits = DEFAULT_UNITS) {
  const s = Math.max(0, Math.floor(totalSeconds))
  if (s < 60) return `${s}${units.s}`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}${units.m} ${s % 60}${units.s}`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}${units.h} ${String(m % 60).padStart(2, "0")}${units.m}`
  return `${Math.floor(h / 24)}${units.d} ${h % 24}${units.h}`
}

const defaultDoneLabel = (seconds: number) => `Finished in ${formatElapsed(seconds)}`

const SIZE = {
  sm: { root: "gap-1.5 text-xs leading-4", pill: "h-7 px-2.5", icon: "size-3.5", line: "h-4" },
  md: { root: "gap-2 text-sm leading-5", pill: "h-8 px-3", icon: "size-4", line: "h-5" },
} as const

export interface ThinkingIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Ordered phase labels shown while working. Empty / missing falls back to the built-in HR-flavoured list. */
  phases?: string[]
  /** Milliseconds each phase stays before the timer advances (floor 200). */
  interval?: number
  /** Controlled phase index. A finite number disables the internal timer. */
  phase?: number
  /** Timer mode: wrap to the first phase after the last instead of holding. */
  loop?: boolean
  /** Work finished: spinner becomes a check, shimmer stops, label becomes `doneLabel`. */
  done?: boolean
  /** Text once done. A function receives the whole seconds elapsed (min 1). */
  doneLabel?: string | ((seconds: number) => string)
  size?: ThinkingIndicatorSize
  variant?: ThinkingIndicatorVariant
}

function ThinkingIndicator({
  phases,
  interval,
  phase,
  loop = false,
  done = false,
  doneLabel = defaultDoneLabel,
  size = "md",
  variant = "pill",
  className,
  ...props
}: ThinkingIndicatorProps) {
  // Cheap to rebuild each render: only `count` and the text feed the effects below,
  // so a fresh array identity never restarts the timer.
  const cleaned = Array.isArray(phases) ? phases.filter((p) => p != null).map(String) : []
  const list = cleaned.length ? cleaned : DEFAULT_PHASES
  const count = list.length

  const ms =
    typeof interval === "number" && Number.isFinite(interval) && interval > 0
      ? Math.max(MIN_INTERVAL, interval)
      : DEFAULT_INTERVAL
  const controlled = typeof phase === "number" && Number.isFinite(phase)

  // ── Timer step (kept in the background while controlled) ─────────────
  const [step, setStep] = React.useState(0)
  const [elapsed, setElapsed] = React.useState<number | null>(done ? 1 : null)
  const [prevDone, setPrevDone] = React.useState(done)
  if (prevDone !== done) {
    // Reset in render (not an effect) so the restart never flashes a stale label.
    setPrevDone(done)
    setElapsed(null)
    if (!done) setStep(0)
  }

  const startRef = React.useRef<number | null>(null)
  React.useLayoutEffect(() => {
    if (!done) startRef.current = Date.now()
    else if (startRef.current !== null) {
      setElapsed(Math.max(1, Math.round((Date.now() - startRef.current) / 1000)))
    }
  }, [done])

  React.useEffect(() => {
    if (done || controlled || count < 2) return
    const id = setInterval(() => {
      setStep((s) => {
        const cur = Math.min(s, count - 1)
        return cur + 1 < count ? cur + 1 : loop ? 0 : cur
      })
    }, ms)
    return () => clearInterval(id)
  }, [done, controlled, count, ms, loop])

  const index = controlled
    ? Math.min(count - 1, Math.max(0, Math.floor(phase)))
    : Math.min(step, count - 1)

  const resolvedDone =
    elapsed === null
      ? null
      : String((typeof doneLabel === "function" ? doneLabel(elapsed) : doneLabel) ?? "")
  const text = done && resolvedDone !== null ? resolvedDone : list[index]

  // ── Label roll: keep the previous text around just long enough to animate out ──
  const [roll, setRoll] = React.useState<{ shown: string; prev: string | null; n: number }>({
    shown: text,
    prev: null,
    n: 0,
  })
  if (roll.shown !== text) setRoll({ shown: text, prev: roll.shown, n: roll.n + 1 })

  React.useEffect(() => {
    if (roll.prev === null) return
    const n = roll.n
    // Timeout rather than animationend so it also clears when motion is disabled.
    const id = setTimeout(() => setRoll((r) => (r.n === n ? { ...r, prev: null } : r)), 500)
    return () => clearTimeout(id)
  }, [roll.n, roll.prev])

  // ── Width fit: the viewport glides to the current label's natural width ──
  const viewportRef = React.useRef<HTMLSpanElement>(null)
  const labelRef = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => {
    let cancelled = false
    const fit = () => {
      const vp = viewportRef.current
      const label = labelRef.current
      // scrollWidth is in layout pixels, not scaled by zoom or transforms; +1 absorbs rounding.
      if (!cancelled && vp && label) vp.style.width = `${label.scrollWidth + 1}px`
    }
    fit()
    // Late-loading fonts change the natural width after the first measurement.
    document.fonts?.ready.then(fit)
    return () => {
      cancelled = true
    }
  }, [roll.shown, size])

  const s = SIZE[size]

  return (
    <>
      <style href="gf-thinking-indicator" precedence="low">{THINKING_INDICATOR_CSS}</style>
      <span
        data-slot="thinking-indicator"
        data-size={size}
        data-variant={variant}
        data-done={done}
        role="status"
        aria-live="polite"
        className={cn(
          "gf-thinking-indicator inline-flex max-w-full items-center align-middle select-none",
          s.root,
          variant === "pill" && cn("box-border rounded-full border border-border bg-card shadow-xs", s.pill),
          className,
        )}
        {...props}
      >
        <span
          data-slot="thinking-indicator-icon"
          aria-hidden
          className={cn("relative grid shrink-0 place-items-center", s.icon)}
        >
          <svg
            data-slot="thinking-indicator-spinner"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            className={cn(
              "col-start-1 row-start-1 size-full text-primary transition-[opacity,scale,rotate] duration-[420ms] ease-[var(--gf-thinking-indicator-ease)]",
              done && "scale-[.6] -rotate-45 opacity-0",
            )}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={i}
                x1="12"
                y1="3"
                x2="12"
                y2="7"
                transform={`rotate(${i * 45} 12 12)`}
                className="gf-thinking-indicator-ray"
                style={{ animationDelay: `${i * 100 - 800}ms` }}
              />
            ))}
          </svg>
          <svg
            data-slot="thinking-indicator-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "gf-thinking-indicator-check col-start-1 row-start-1 size-full text-success transition-[opacity,scale,rotate] duration-[420ms] ease-[var(--gf-thinking-indicator-ease)]",
              !done && "scale-[.6] opacity-0",
            )}
          >
            <path d="M5 12.5 10 17.5 19 7" pathLength={1} />
          </svg>
        </span>
        <span
          ref={viewportRef}
          data-slot="thinking-indicator-viewport"
          className={cn(
            "relative block min-w-0 overflow-hidden whitespace-nowrap transition-[width] duration-[460ms] ease-[var(--gf-thinking-indicator-ease)]",
            s.line,
          )}
        >
          {roll.prev !== null && (
            <span
              key={`leave-${roll.n}`}
              data-slot="thinking-indicator-leaving"
              aria-hidden
              dir="auto"
              className="gf-thinking-indicator-leave pointer-events-none absolute top-0 left-0 block w-max text-muted-foreground"
            >
              {roll.prev}
            </span>
          )}
          <span
            key={roll.n}
            ref={labelRef}
            data-slot="thinking-indicator-label"
            dir="auto"
            title={roll.shown}
            className={cn(
              "block w-max max-w-full truncate transition-colors duration-[420ms]",
              roll.n > 0 && "gf-thinking-indicator-enter",
              done ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {/* Shimmer lives on an inner span: the enter animation on the label would otherwise override it. */}
            <span data-slot="thinking-indicator-text" className={cn(!done && "gf-thinking-indicator-shimmer")}>
              {roll.shown}
            </span>
          </span>
        </span>
      </span>
    </>
  )
}

export { ThinkingIndicator, formatElapsed }

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// The roll itself is driven frame-by-frame from JS (so an interrupted roll can resume
// from the exact fractional position). Only the soft edge fade and the entrance of a
// newly added digit column live here. The fade mask only reads alpha, so `black` is
// just an opaque stop (currentColor would double-dim text styled with an alpha colour).
const NUMBER_TICKER_CSS = `
  .gf-number-ticker-col{-webkit-mask-image:linear-gradient(to bottom,transparent,black 14%,black 86%,transparent);mask-image:linear-gradient(to bottom,transparent,black 14%,black 86%,transparent);}
  .gf-number-ticker-enter{animation:gf-number-ticker-in 450ms cubic-bezier(.22,1,.36,1) both;}
  @keyframes gf-number-ticker-in{from{opacity:0;transform:translateY(-33%);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){.gf-number-ticker-enter{animation:none;}}
`

// Digits 0-9 plus a trailing extra 0: lets a roll from 9 onward continue in the same
// direction instead of rewinding the strip.
const DIGIT_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

type Column = { el: HTMLElement; pos: number }

const wrap = (n: number) => ((n % 10) + 10) % 10
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

function paint(col: Column, pos: number) {
  col.pos = pos
  col.el.style.transform = `translateY(${-(pos * 100) / DIGIT_CELLS.length}%)`
}

export interface NumberTickerProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** The number to display. A change rolls the digits; NaN / ±Infinity show `placeholder`. */
  value: number
  /** Passed to `Intl.NumberFormat` (currency, percent, compact, fraction digits…). Compared by content. */
  format?: Intl.NumberFormatOptions
  /** BCP 47 locale. Defaults to "en" so server and client render the same digits. */
  locale?: string
  /** Length of one roll, in ms. */
  duration?: number
  /** Wait before the first count-in, in ms (counted from becoming visible). */
  delay?: number
  /** Wait until ~30% of the number is on screen before the first count-in. */
  animateOnView?: boolean
  /** Make the root a polite live region so changes are announced. Off by default — noisy with many tickers. */
  announce?: boolean
  /** Glyph shown instead of digits when `value` is not a finite number. */
  placeholder?: string
  /** Text read by screen readers when `value` is not a finite number. */
  emptyLabel?: string
}

/**
 * Odometer-style number. Each digit is its own clipped column that rolls to the new
 * digit; every other glyph (currency, separators, signs) is static. Digits are matched
 * from the right so the ones place keeps its identity as the number grows. Only ASCII
 * digits roll — numbering is forced to Latin by default (`format.numberingSystem` to
 * override, in which case those digits are shown without rolling).
 */
function NumberTicker({
  ref,
  value,
  format,
  locale = "en",
  duration = 900,
  delay = 0,
  animateOnView = true,
  announce = false,
  placeholder = "–",
  emptyLabel = "No value",
  className,
  ...props
}: NumberTickerProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null)
  React.useImperativeHandle(ref, () => rootRef.current as HTMLSpanElement)

  // Compare options by content so an inline object literal doesn't re-format every render.
  const formatKey = JSON.stringify(format ?? {})
  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        numberingSystem: "latn",
        ...(JSON.parse(formatKey) as Intl.NumberFormatOptions),
      }),
    [locale, formatKey],
  )

  const finite = Number.isFinite(value)
  const text = finite ? formatter.format(value) : ""
  const chars = React.useMemo(() => Array.from(text), [text])

  // Columns that mount after the first commit get the entrance animation.
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // ── Start trigger: visibility (once), then the optional delay ──
  const [started, setStarted] = React.useState(false)
  React.useEffect(() => {
    if (started) return
    const el = rootRef.current
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = (ms: number) => {
      timer = setTimeout(() => setStarted(true), ms)
    }
    const instant =
      !animateOnView ||
      !el ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia(REDUCED_MOTION).matches
    if (instant) {
      start(window.matchMedia(REDUCED_MOTION).matches ? 0 : delay)
      return () => clearTimeout(timer)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        start(delay)
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [started, animateOnView, delay])

  // ── Roll engine ──
  const columns = React.useRef(new Map<number, Column>())
  const register = React.useCallback((id: number, el: HTMLElement | null) => {
    if (el) columns.current.set(id, { el, pos: 0 })
    else columns.current.delete(id)
  }, [])

  // Direction follows the numeric comparison, not the formatted strings; equal keeps the last.
  const prevValue = React.useRef<number | undefined>(undefined)
  const direction = React.useRef<1 | -1>(1)
  const hasRolled = React.useRef(false)
  React.useLayoutEffect(() => {
    if (!Number.isFinite(value)) {
      // Columns unmount for a non-finite value; the next number counts in upward from zero.
      prevValue.current = undefined
      direction.current = 1
      return
    }
    const prev = prevValue.current
    if (prev !== undefined && value !== prev) direction.current = value > prev ? 1 : -1
    prevValue.current = value
  }, [value])

  React.useLayoutEffect(() => {
    if (!started) return
    const dir = hasRolled.current ? direction.current : 1 // first count-in always rises
    hasRolled.current = true
    const instant = duration <= 0 || window.matchMedia(REDUCED_MOTION).matches

    const jobs: { col: Column; from: number; dist: number; to: number }[] = []
    chars.forEach((ch, i) => {
      if (ch < "0" || ch > "9" || ch.length !== 1) return
      const col = columns.current.get(chars.length - 1 - i)
      if (!col) return
      const to = Number(ch)
      const from = wrap(col.pos)
      const dist = dir > 0 ? wrap(to - from) : wrap(from - to)
      if (instant || dist < 1e-6) paint(col, to)
      else jobs.push({ col, from, dist, to })
    })
    if (!jobs.length) return

    const t0 = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const e = easeOutQuart(p)
      for (const j of jobs) paint(j.col, p < 1 ? wrap(j.from + dir * j.dist * e) : j.to)
      if (p < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [started, chars, duration])

  return (
    <span
      ref={rootRef}
      data-slot="number-ticker"
      aria-live={announce ? "polite" : undefined}
      aria-atomic={announce ? true : undefined}
      className={cn(
        "relative inline-flex whitespace-nowrap tabular-nums [--gf-nt-lh:1.2em]",
        className,
      )}
      {...props}
    >
      <style href="gf-number-ticker" precedence="low">{NUMBER_TICKER_CSS}</style>
      <span data-slot="number-ticker-label" className="sr-only">
        {finite ? text : emptyLabel}
      </span>
      <span data-slot="number-ticker-track" aria-hidden className="inline-flex">
        {finite ? (
          chars.map((ch, i) => {
            const id = chars.length - 1 - i
            return ch >= "0" && ch <= "9" && ch.length === 1 ? (
              <DigitColumn key={id} id={id} register={register} enter={ready} />
            ) : (
              <Glyph key={id}>{ch}</Glyph>
            )
          })
        ) : (
          <Glyph>{placeholder}</Glyph>
        )}
      </span>
    </span>
  )
}

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-slot="number-ticker-char"
      className="block h-(--gf-nt-lh) text-center leading-(--gf-nt-lh) whitespace-pre"
    >
      {children}
    </span>
  )
}

function DigitColumn({
  id,
  register,
  enter,
}: {
  id: number
  register: (id: number, el: HTMLElement | null) => void
  enter: boolean
}) {
  // Captured once: a column that existed at first paint never replays the entrance.
  const [animateIn] = React.useState(enter)
  const setStack = React.useCallback(
    (el: HTMLElement | null) => register(id, el),
    [id, register],
  )
  return (
    <span
      data-slot="number-ticker-digit"
      className={cn(
        "gf-number-ticker-col block h-(--gf-nt-lh) overflow-hidden",
        animateIn && "gf-number-ticker-enter",
      )}
    >
      <span
        ref={setStack}
        data-slot="number-ticker-stack"
        className="flex flex-col will-change-transform"
      >
        {DIGIT_CELLS.map((d, i) => (
          <span
            key={i}
            data-slot="number-ticker-cell"
            className="block h-(--gf-nt-lh) text-center leading-(--gf-nt-lh)"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

export { NumberTicker }

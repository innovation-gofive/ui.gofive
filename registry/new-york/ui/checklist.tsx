"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colors come from theme tokens (utilities below, or var(--primary-foreground)
// for the sweep), so light/dark and data-brand need no `dark:` variants here.
// The stylesheet only owns motion: entrance, counter roll, bar sweep, check
// pop, the drawn tick and the growing strike-through.
const CHECKLIST_CSS = `
  .gf-checklist{animation:gf-checklist-in .5s cubic-bezier(.22,1,.36,1) both;}
  .gf-checklist-row{animation:gf-checklist-row .65s cubic-bezier(.22,1,.36,1) both;}
  .gf-checklist-roll{display:inline-block;animation:gf-checklist-roll .5s cubic-bezier(.22,1,.36,1) both;}
  .gf-checklist-fill{transition:transform 1s cubic-bezier(.22,1,.36,1);}
  .gf-checklist-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--primary-foreground) 45%,transparent),transparent);animation:gf-checklist-sweep 1.5s ease-out both;}
  .gf-checklist-toggle[aria-checked="true"] .gf-checklist-box{animation:gf-checklist-pop .5s cubic-bezier(.34,1.56,.64,1) both;}
  .gf-checklist-tick{stroke-dasharray:1 2;stroke-dashoffset:1;transition:stroke-dashoffset .1s ease-in;}
  .gf-checklist-toggle[aria-checked="true"] .gf-checklist-tick{stroke-dashoffset:0;transition:stroke-dashoffset .4s ease-out .16s;}
  .gf-checklist-text{background:linear-gradient(currentColor,currentColor) 0 55% / 0 1px no-repeat;transition:background-size .4s ease-in;}
  .gf-checklist-text:dir(rtl){background-position:100% 55%;}
  .gf-checklist-toggle[aria-checked="true"] .gf-checklist-text{background-size:100% 1px;transition:background-size .6s ease-out .2s;}
  @keyframes gf-checklist-in{from{opacity:0;transform:translateY(6px);}}
  @keyframes gf-checklist-row{from{opacity:0;transform:translateY(6px);filter:blur(4px);}}
  @keyframes gf-checklist-roll{from{opacity:0;transform:translateY(60%);}}
  @keyframes gf-checklist-sweep{from{transform:translateX(-100%);opacity:1;}to{transform:translateX(100%);opacity:0;}}
  @keyframes gf-checklist-pop{0%{transform:scale(.8);}60%{transform:scale(1.08);}100%{transform:scale(1);}}
  @media (prefers-reduced-motion: reduce){
    .gf-checklist,.gf-checklist-row,.gf-checklist-roll,.gf-checklist-toggle .gf-checklist-box{animation:none !important;}
    .gf-checklist-shine{display:none;}
    .gf-checklist-fill,.gf-checklist-tick,.gf-checklist-text{transition-duration:1ms !important;transition-delay:0s !important;}
  }
`

export interface ChecklistItem {
  /** Stable, unique key — completion is tracked by id. */
  id: string
  label: React.ReactNode
  /** Secondary line under the label (wraps up to three lines). */
  description?: React.ReactNode
  /**
   * Secondary control at the row end (usually a small Button). It is rendered
   * as a sibling of the toggle, so pressing it never toggles the item.
   */
  action?: React.ReactNode
  /** Small decorative node (svg / img) at the end of the toggle. */
  icon?: React.ReactNode
}

export interface ChecklistLabels {
  /** Spoken value of the progress bar. Default: "2 of 5 done". */
  progress?: (completed: number, total: number) => string
  /** Shown instead of the list when there are no items. */
  empty?: React.ReactNode
}

export interface ChecklistProps
  extends Omit<React.ComponentProps<"div">, "title" | "children" | "onToggle"> {
  title?: React.ReactNode
  /** Heading level of the title, so the card fits the page outline. */
  headingLevel?: 2 | 3 | 4
  items: ChecklistItem[]
  /** Controlled set of completed item ids. Unknown ids are ignored. */
  completedIds?: readonly string[] | ReadonlySet<string>
  /** Called with the row's id and the state the user asked for. */
  onToggle?: (id: string, nextChecked: boolean) => void
  /**
   * Highlighted next-up item. Defaults to the first incomplete item; pass
   * `null` to highlight nothing. Unknown or completed ids highlight nothing.
   */
  currentId?: string | null
  /**
   * Demo aid: ticks the next open item through `onToggle` every `interval` ms,
   * stops for good on the first pointer or key press inside the card, and is
   * skipped under reduced motion. Real handlers fire, so use it on demo state.
   */
  autoPlay?: boolean
  /** Pause between automatic ticks, in ms. */
  interval?: number
  /** Called after a finished autoPlay run waits 2× `interval`; reset your state here to loop. */
  onAutoPlayReset?: () => void
  /** Override the progress bar's accessible name (defaults to the title). */
  progressLabel?: string
  /** BCP 47 locale for number formatting. Defaults to the runtime locale. */
  locale?: string
  labels?: ChecklistLabels
}

function Checklist({
  title = "First steps",
  headingLevel = 3,
  items,
  completedIds,
  onToggle,
  currentId,
  autoPlay = false,
  interval = 2200,
  onAutoPlayReset,
  progressLabel,
  locale,
  labels,
  className,
  onPointerDownCapture,
  onKeyDownCapture,
  ...props
}: ChecklistProps) {
  const uid = React.useId()
  const headingId = `${uid}-title`
  const hasTitle = title != null && title !== false && title !== ""
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4"

  const done = React.useMemo(() => new Set(completedIds ?? []), [completedIds])
  const total = items.length
  const count = items.reduce((n, item) => n + (done.has(item.id) ? 1 : 0), 0)
  const complete = total > 0 && count === total
  const fraction = total === 0 ? 0 : count / total

  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale])
  const progressText = (labels?.progress ??
    ((c, t) => `${nf.format(c)} of ${nf.format(t)} done`))(count, total)

  // The current row: explicit id, else the first open one. Completed or
  // unknown ids highlight nothing.
  const activeId =
    currentId === undefined ? items.find((i) => !done.has(i.id))?.id : currentId
  const current = items.find((i) => i.id === activeId && !done.has(i.id))?.id

  // The sweep replays only when progress grows (derive-during-render, no effect).
  const [prevCount, setPrevCount] = React.useState(count)
  const [sweep, setSweep] = React.useState(0)
  if (count !== prevCount) {
    setPrevCount(count)
    if (count > prevCount) setSweep((s) => s + 1)
  }

  // ── Demo autoplay ──
  const [stopped, setStopped] = React.useState(false)
  const live = autoPlay && !stopped
  const toggleRef = React.useRef(onToggle)
  const resetRef = React.useRef(onAutoPlayReset)
  React.useEffect(() => {
    toggleRef.current = onToggle
    resetRef.current = onAutoPlayReset
  })
  const nextOpenId = items.find((i) => !done.has(i.id))?.id
  React.useEffect(() => {
    if (!live || total === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setTimeout(
      () =>
        nextOpenId === undefined
          ? resetRef.current?.()
          : toggleRef.current?.(nextOpenId, true),
      nextOpenId === undefined ? interval * 2 : interval,
    )
    return () => clearTimeout(t)
  }, [live, total, nextOpenId, interval])

  const titleText = typeof title === "string" ? title : undefined

  return (
    <div
      data-slot="checklist"
      data-complete={complete ? "" : undefined}
      onPointerDownCapture={(e) => {
        setStopped(true)
        onPointerDownCapture?.(e)
      }}
      onKeyDownCapture={(e) => {
        setStopped(true)
        onKeyDownCapture?.(e)
      }}
      className={cn(
        "gf-checklist w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      <style href="gf-checklist" precedence="low">{CHECKLIST_CSS}</style>

      <div
        data-slot="checklist-header"
        className="flex items-baseline justify-between gap-3 px-4 pt-4"
      >
        {hasTitle && (
          <Heading
            id={headingId}
            dir="auto"
            title={titleText}
            data-slot="checklist-title"
            className="min-w-0 truncate text-sm font-semibold"
          >
            {title}
          </Heading>
        )}
        {/* The progress bar already announces this. */}
        <span
          aria-hidden
          data-slot="checklist-counter"
          className="ms-auto shrink-0 text-xs text-muted-foreground tabular-nums"
        >
          <span key={count} data-slot="checklist-counter-value" className="gf-checklist-roll font-medium text-foreground">
            {nf.format(count)}
          </span>
          /{nf.format(total)}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        aria-valuetext={progressText}
        aria-label={progressLabel}
        aria-labelledby={progressLabel || !hasTitle ? undefined : headingId}
        data-slot="checklist-progress"
        className="relative mx-4 mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          data-slot="checklist-progress-fill"
          className="gf-checklist-fill relative h-full w-full origin-left overflow-hidden rounded-full bg-primary rtl:origin-right"
          style={{ transform: `scaleX(${fraction})` }}
        >
          {sweep > 0 && (
            <span key={sweep} aria-hidden data-slot="checklist-shine" className="gf-checklist-shine" />
          )}
        </div>
      </div>

      {total === 0 ? (
        <p data-slot="checklist-empty" className="px-4 pt-3 pb-4 text-sm text-muted-foreground">
          {labels?.empty ?? "Nothing to do yet."}
        </p>
      ) : (
        <ul
          data-slot="checklist-list"
          className="mt-2 flex min-w-0 flex-col gap-0.5 p-2"
        >
          {items.map((item, i) => {
            const checked = done.has(item.id)
            const isCurrent = item.id === current
            const descId = `${uid}-desc-${i}`
            const text = typeof item.label === "string" ? item.label : undefined
            return (
              <li
                key={item.id}
                data-slot="checklist-item"
                data-checked={checked ? "" : undefined}
                data-current={isCurrent ? "" : undefined}
                className={cn(
                  "gf-checklist-row relative flex items-start rounded-md transition-colors duration-200 motion-reduce:transition-none",
                  isCurrent
                    ? "bg-primary-soft before:absolute before:inset-y-1.5 before:start-0 before:w-0.5 before:rounded-full before:bg-primary"
                    : "hover:bg-muted/60",
                )}
                style={{ animationDelay: `${120 + Math.min(i, 12) * 90}ms` }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-describedby={item.description ? descId : undefined}
                  onClick={() => onToggle?.(item.id, !checked)}
                  data-slot="checklist-toggle"
                  className="gf-checklist-toggle group/item flex min-w-0 flex-1 items-start gap-3 rounded-md px-3 py-2 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span
                    aria-hidden
                    data-slot="checklist-check"
                    className="gf-checklist-box mt-px flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/70 text-primary-foreground transition-colors duration-200 group-aria-checked/item:border-primary group-aria-checked/item:bg-primary motion-reduce:transition-none"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" data-slot="checklist-tick" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline className="gf-checklist-tick" pathLength={1} points="5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </span>

                  <span data-slot="checklist-content" className="min-w-0 flex-1">
                    <span
                      dir="auto"
                      title={text}
                      data-slot="checklist-label"
                      className="block truncate text-sm text-foreground transition-colors duration-300 group-aria-checked/item:text-muted-foreground motion-reduce:transition-none"
                    >
                      <span data-slot="checklist-label-text" className="gf-checklist-text">{text === "" ? " " : item.label}</span>
                    </span>
                    {item.description && (
                      <span
                        id={descId}
                        dir="auto"
                        data-slot="checklist-description"
                        className="mt-0.5 line-clamp-3 block text-xs text-muted-foreground"
                      >
                        {item.description}
                      </span>
                    )}
                  </span>

                  {item.icon && (
                    <span
                      aria-hidden
                      data-slot="checklist-icon"
                      className="size-5 shrink-0 overflow-hidden opacity-100 transition-opacity duration-300 group-aria-checked/item:opacity-40 motion-reduce:transition-none [&>img]:size-full [&>img]:object-contain [&>svg]:size-full"
                    >
                      {item.icon}
                    </span>
                  )}
                </button>

                {item.action && (
                  <span
                    data-slot="checklist-action"
                    className="me-2 flex shrink-0 items-center self-center"
                  >
                    {item.action}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { Checklist }

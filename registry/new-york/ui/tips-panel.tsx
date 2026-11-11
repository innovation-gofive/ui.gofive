"use client"

import * as React from "react"
import { CircleCheck, X, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Tile entrance is staggered through the `--gf-i` custom property (capped in JS),
// the "done" confirmation pops in, and a dismissed tile shrinks away before it is
// removed. All colour comes from utilities, so this sheet is theme-agnostic.
const TIPS_PANEL_CSS = `
  .gf-tips-panel-tile{animation:gf-tips-panel-in 480ms cubic-bezier(.22,1,.36,1) backwards;animation-delay:calc(80ms + var(--gf-i,0) * 50ms);}
  .gf-tips-panel-tile[data-leaving]{animation:gf-tips-panel-out 180ms ease-in forwards;animation-delay:0ms;}
  .gf-tips-panel-pop{animation:gf-tips-panel-pop 360ms cubic-bezier(.22,1,.36,1) backwards;}
  @keyframes gf-tips-panel-in{from{opacity:0;transform:translateY(4px);}}
  @keyframes gf-tips-panel-out{to{opacity:0;transform:scale(.96);}}
  @keyframes gf-tips-panel-pop{from{opacity:0;transform:scale(.94);}}
  @media (prefers-reduced-motion: reduce){.gf-tips-panel-tile,.gf-tips-panel-tile[data-leaving],.gf-tips-panel-pop{animation:none;}}
`

const MAX_STAGGER = 12
const LEAVE_MS = 180

export type TipsPanelTone = "primary" | "info"

export interface TipsPanelTip {
  /** Identity of the tip. Duplicates are tolerated but should be avoided. */
  id: string
  title: string
  /** Short explanation. May contain `TipsPanelKbd` chips and line breaks. */
  description?: React.ReactNode
  /** Label of the single action button. */
  action: string
  /** Shown instead of the button once the action was taken. */
  doneLabel?: string
  /** High-emphasis action button. Use for at most one tip. */
  primary?: boolean
  /** Fired right after the tip is marked done. */
  onAction?: () => void
  /** Decorative lucide icon shown in the tile's icon square. */
  icon?: LucideIcon
  /** Colour of the icon square. */
  tone?: TipsPanelTone
}

export interface TipsPanelLabels {
  /** Counter text. Receives locale-formatted numbers; one pattern, not fragments. */
  progress: (done: string, total: string) => string
  /** Default confirmation text when a tip has no `doneLabel`. */
  done: string
  /** Accessible name of a per-tip dismiss button. */
  dismiss: (title: string) => string
  dismissAll: string
  /** Polite announcement after a single dismissal. */
  dismissed: (title: string) => string
  /** Polite announcement after dismiss-all. */
  dismissedAll: string
  /** Shown when there is nothing left to display. */
  empty: string
}

const DEFAULT_LABELS: TipsPanelLabels = {
  progress: (done, total) => `${done} of ${total} done`,
  done: "Done",
  dismiss: (title) => `Dismiss "${title}"`,
  dismissAll: "Dismiss all",
  dismissed: (title) => `"${title}" dismissed`,
  dismissedAll: "All tips dismissed",
  empty: "No tips right now",
}

const TONE: Record<TipsPanelTone, string> = {
  primary: "bg-primary-soft text-primary-soft-foreground",
  info: "bg-info-soft text-info-soft-foreground",
}

/** Gives later duplicates of an id a derived key so each tile tracks state alone. */
function withKeys(tips: TipsPanelTip[]) {
  const seen = new Map<string, number>()
  return tips.map((tip) => {
    const n = (seen.get(tip.id) ?? 0) + 1
    seen.set(tip.id, n)
    return { tip, key: n === 1 ? tip.id : `${tip.id}\u0000${n}` }
  })
}

export interface TipsPanelProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  /** Heading text and accessible name of the region. */
  title?: string
  tips: TipsPanelTip[]
  /** Renders a footer with a close button. The panel does not hide itself. */
  onClose?: () => void
  closeLabel?: string
  /** Show per-tip dismiss buttons and the header dismiss-all button. */
  dismissible?: boolean
  /** Fired with the tip id when a single tip is dismissed. */
  onDismiss?: (id: string) => void
  /** Fired once when dismiss-all is pressed (not once per tip). */
  onDismissAll?: () => void
  /** Heading level of the title, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Max height of the scrolling body. Number = px. */
  maxHeight?: number | string
  /** BCP 47 locale for the counter's number formatting. */
  locale?: string
  /** Override any of the default (English) strings. */
  labels?: Partial<TipsPanelLabels>
}

function TipsPanel({
  title = "Tips",
  tips,
  onClose,
  closeLabel = "Close",
  dismissible = false,
  onDismiss,
  onDismissAll,
  headingLevel = 3,
  maxHeight = 420,
  locale,
  labels,
  className,
  ...props
}: TipsPanelProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const headingId = React.useId()
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const [done, setDone] = React.useState<ReadonlySet<string>>(new Set())
  const [dismissed, setDismissed] = React.useState<ReadonlySet<string>>(new Set())
  const [leaving, setLeaving] = React.useState<ReadonlySet<string>>(new Set())
  const [announcement, setAnnouncement] = React.useState("")

  // Forget ids the parent no longer passes, so a re-added tip starts fresh.
  const liveKeys = new Set(withKeys(tips).map((t) => t.key))
  const prune = (s: ReadonlySet<string>) => [...s].some((k) => !liveKeys.has(k))
  const keep = (s: ReadonlySet<string>) => new Set([...s].filter((k) => liveKeys.has(k)))
  if (prune(done)) setDone(keep(done))
  if (prune(dismissed)) setDismissed(keep(dismissed))
  if (prune(leaving)) setLeaving(keep(leaving))

  const present = withKeys(tips).filter((t) => !dismissed.has(t.key))
  const active = present.filter((t) => !leaving.has(t.key))
  const doneCount = active.filter((t) => done.has(t.key)).length
  const nf = new Intl.NumberFormat(locale)
  const Heading = `h${headingLevel}` as const

  const add = (set: ReadonlySet<string>, ...keys: string[]) => new Set([...set, ...keys])
  const root = () => bodyRef.current?.closest<HTMLElement>('[data-slot="tips-panel"]')

  const finalize = (key: string) => {
    setDismissed((s) => add(s, key))
    setLeaving((s) => {
      const next = new Set(s)
      next.delete(key)
      return next
    })
  }

  const dismissOne = (key: string, id: string, tipTitle: string, tile: HTMLElement) => {
    // Hand focus to a neighbouring tile before this one goes away.
    const tiles = Array.from(
      bodyRef.current?.querySelectorAll<HTMLElement>('[data-slot="tips-panel-tip"]:not([data-leaving])') ?? [],
    )
    const i = tiles.indexOf(tile)
    const neighbour = tiles[i + 1] ?? tiles[i - 1]
    ;(neighbour?.querySelector<HTMLElement>("button") ?? root())?.focus()

    setAnnouncement(l.dismissed(tipTitle))
    onDismiss?.(id)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finalize(key)
    else setLeaving((s) => add(s, key))
  }

  const dismissAll = () => {
    root()?.focus()
    setDismissed((s) => add(s, ...present.map((t) => t.key)))
    setLeaving(new Set())
    setAnnouncement(l.dismissedAll)
    onDismissAll?.()
  }

  return (
    <section
      data-slot="tips-panel"
      aria-labelledby={headingId}
      tabIndex={-1}
      className={cn(
        "flex w-full max-w-[760px] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs outline-none",
        className,
      )}
      {...props}
    >
      <style href="gf-tips-panel" precedence="low">{TIPS_PANEL_CSS}</style>

      <div
        data-slot="tips-panel-header"
        className="flex items-start justify-between gap-3 border-b px-4 py-3"
      >
        <Heading
          id={headingId}
          data-slot="tips-panel-title"
          dir="auto"
          className="min-w-0 flex-1 text-sm font-semibold break-words [overflow-wrap:anywhere]"
        >
          {title}
        </Heading>
        <div className="flex shrink-0 items-center gap-2">
          {active.length > 0 && (
            <span
              data-slot="tips-panel-progress"
              aria-live="polite"
              className="text-xs whitespace-nowrap text-muted-foreground tabular-nums"
            >
              {l.progress(nf.format(doneCount), nf.format(active.length))}
            </span>
          )}
          {dismissible && active.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-slot="tips-panel-dismiss-all"
              className="-my-1 h-7 px-2 text-xs pointer-coarse:h-10"
              onClick={dismissAll}
            >
              {l.dismissAll}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={bodyRef}
        data-slot="tips-panel-body"
        style={{ maxHeight }}
        className="@container overflow-y-auto p-3 [scrollbar-width:thin]"
      >
        {present.length === 0 ? (
          <p
            data-slot="tips-panel-empty"
            className="py-6 text-center text-sm text-muted-foreground"
          >
            {l.empty}
          </p>
        ) : (
          <ul
            data-slot="tips-panel-list"
            className="grid grid-cols-1 gap-3 @[24rem]:grid-cols-2 @[36rem]:grid-cols-3"
          >
            {present.map(({ tip, key }, index) => (
              <TipTile
                key={key}
                tip={tip}
                index={index}
                done={done.has(key)}
                leaving={leaving.has(key)}
                dismissible={dismissible}
                labels={l}
                onAction={() => {
                  setDone((s) => add(s, key))
                  tip.onAction?.()
                }}
                onDismiss={(tile) => dismissOne(key, tip.id, tip.title, tile)}
                onExited={() => finalize(key)}
              />
            ))}
          </ul>
        )}
      </div>

      {onClose && (
        <div
          data-slot="tips-panel-footer"
          className="flex justify-end border-t px-4 py-3"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-slot="tips-panel-close"
            onClick={onClose}
          >
            {closeLabel}
          </Button>
        </div>
      )}

      <p data-slot="tips-panel-status" aria-live="polite" className="sr-only">{announcement}</p>
    </section>
  )
}

function TipTile({
  tip,
  index,
  done,
  leaving,
  dismissible,
  labels,
  onAction,
  onDismiss,
  onExited,
}: {
  tip: TipsPanelTip
  index: number
  done: boolean
  leaving: boolean
  dismissible: boolean
  labels: TipsPanelLabels
  onAction: () => void
  onDismiss: (tile: HTMLElement) => void
  onExited: () => void
}) {
  const Icon = tip.icon
  const statusRef = React.useRef<HTMLDivElement>(null)
  const hadFocus = React.useRef(false)

  // Remove the tile once its exit animation has had time to play. A timer (not
  // animationend) so it still completes if the animation is skipped or never runs.
  React.useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(onExited, LEAVE_MS)
    return () => window.clearTimeout(t)
  }, [leaving, onExited])

  // The button disappears on activation; keep keyboard users on the tile.
  React.useEffect(() => {
    if (done && hadFocus.current) statusRef.current?.focus()
  }, [done])

  return (
    <li
      data-slot="tips-panel-tip"
      data-done={done || undefined}
      data-leaving={leaving || undefined}
      inert={leaving}
      style={{ "--gf-i": Math.min(index, MAX_STAGGER) } as React.CSSProperties}
      className={cn(
        "gf-tips-panel-tile group/tip flex min-w-0 flex-col items-start gap-2 rounded-lg border p-3 transition-colors duration-300 motion-reduce:transition-none",
        done ? "bg-success-soft/40" : "bg-background",
      )}
    >
      {(Icon || dismissible) && (
        <div
          data-slot="tips-panel-tip-header"
          className="flex min-h-8 w-full items-start gap-2"
        >
          {Icon ? (
            <span
              data-slot="tips-panel-tip-icon"
              aria-hidden
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg",
                TONE[tip.tone ?? "primary"],
              )}
            >
              <Icon className="size-4" />
            </span>
          ) : null}
          {dismissible && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-slot="tips-panel-tip-dismiss"
              aria-label={labels.dismiss(tip.title)}
              onClick={(e) =>
                onDismiss(e.currentTarget.closest<HTMLElement>('[data-slot="tips-panel-tip"]')!)
              }
              className="ms-auto -me-1 -mt-1 size-7 text-muted-foreground transition-opacity pointer-coarse:size-10 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/tip:opacity-100 [@media(hover:hover)]:group-focus-within/tip:opacity-100"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}

      <p
        data-slot="tips-panel-tip-title"
        dir="auto"
        className="w-full text-sm font-medium text-foreground [overflow-wrap:anywhere]"
      >
        {tip.title}
      </p>

      <div
        data-slot="tips-panel-tip-description"
        dir="auto"
        className="w-full flex-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]"
      >
        {tip.description}
      </div>

      {done ? (
        <div
          ref={statusRef}
          role="status"
          tabIndex={-1}
          data-slot="tips-panel-tip-done"
          className="gf-tips-panel-pop flex min-h-8 max-w-full items-center gap-1.5 rounded-md text-sm font-medium text-success-soft-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <CircleCheck aria-hidden className="size-4 shrink-0" />
          <span dir="auto" className="min-w-0 [overflow-wrap:anywhere]">
            {tip.doneLabel ?? labels.done}
          </span>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant={tip.primary ? "default" : "secondary"}
          data-slot="tips-panel-tip-action"
          onClick={(e) => {
            hadFocus.current = document.activeElement === e.currentTarget
            onAction()
          }}
          className="h-auto min-h-8 max-w-full py-1.5 text-start whitespace-normal [overflow-wrap:anywhere] pointer-coarse:min-h-10"
        >
          {tip.action}
        </Button>
      )}
    </li>
  )
}

/** Inline keyboard-key chip for shortcuts inside a tip description. */
function TipsPanelKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="tips-panel-kbd"
      className={cn(
        "mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border border-b-2 bg-muted px-1 align-baseline font-sans text-[11px] leading-none font-medium text-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { TipsPanel, TipsPanelKbd }

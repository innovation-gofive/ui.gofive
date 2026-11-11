"use client"

import * as React from "react"
import {
  Bell,
  ChevronsUpDown,
  CircleCheck,
  ExternalLink,
  Info,
  OctagonAlert,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours all come from Tailwind token utilities on the elements; this sheet
// only owns motion. Cards are positioned with inline `transform`, so the exit
// uses the independent `translate`/`scale` properties to avoid fighting it.
const NOTIFICATION_STACK_CSS = `
  .gf-notification-stack-list{transition:height 460ms cubic-bezier(.22,1,.36,1);}
  .gf-notification-stack-card{transform-origin:50% 100%;--gf-notification-stack-x:40px;transition:transform 460ms cubic-bezier(.22,1,.36,1),height 460ms cubic-bezier(.22,1,.36,1),opacity 300ms ease;}
  .gf-notification-stack-card:dir(rtl){--gf-notification-stack-x:-40px;}
  .gf-notification-stack-content{transition:opacity 260ms ease;}
  .gf-notification-stack-card[data-behind] .gf-notification-stack-content{opacity:0;}
  .gf-notification-stack-card[data-leaving]{animation:gf-notification-stack-out 320ms ease forwards;}
  .gf-notification-stack-footer{animation:gf-notification-stack-in 200ms ease both;}
  @keyframes gf-notification-stack-out{to{opacity:0;translate:var(--gf-notification-stack-x) 0;scale:.98;}}
  @keyframes gf-notification-stack-in{from{opacity:0;transform:translateY(-4px);}}
  @media (prefers-reduced-motion: reduce){
    .gf-notification-stack-list,.gf-notification-stack-card,.gf-notification-stack-content{transition:none;}
    .gf-notification-stack-card[data-leaving]{animation:none;opacity:0;}
    .gf-notification-stack-footer{animation:none;}
  }
`

const PEEK = 12 // px each card behind peeks out below the front card
const SCALE_STEP = 0.05
const GAP = 8 // px between cards when expanded
const EXIT_MS = 320
const CLOSE_DELAY_MS = 150

export type NotificationStackTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"

export interface NotificationStackAction {
  label: string
  /** Renders the action as a link. `onClick` still fires. */
  href?: string
  onClick?: () => void
  /** Open `href` in a new tab and show an external-link glyph. */
  external?: boolean
}

export interface NotificationStackNotice {
  /** Unique and stable. Used for identity, measuring and dismissal memory. */
  id: string
  title: string
  text?: string
  /** Small category pill above the title. */
  badge?: string
  tone?: NotificationStackTone
  action?: NotificationStackAction
}

export interface NotificationStackLabels {
  /** Accessible name of the region landmark. */
  region: string
  /** Accessible name of a card's dismiss button. */
  dismiss: (title: string) => string
  /** Summary of notices not shown in the collapsed stack. */
  hiddenCount: (count: number) => string
  /** Toggle label while collapsed. */
  expand: string
  /** Toggle label while expanded. */
  collapse: string
  /** Screen-reader hint appended to external actions. */
  newTab: string
  /** Polite announcement for notices added after first render. */
  added: (titles: string[]) => string
  /** Screen-reader tone prefix per tone (neutral is silent by default). */
  tones: Record<NotificationStackTone, string>
}

const DEFAULT_LABELS: NotificationStackLabels = {
  region: "Recent notices",
  dismiss: (title) => `Dismiss ${title}`,
  hiddenCount: (n) => (n === 1 ? "1 more notification" : `${n} more notifications`),
  expand: "Expand stack",
  collapse: "Collapse stack",
  newTab: "(opens in a new tab)",
  added: (titles) => `New: ${titles.join(", ")}`,
  tones: {
    neutral: "",
    info: "Information: ",
    success: "Success: ",
    warning: "Warning: ",
    danger: "Error: ",
  },
}

const TONES: Record<
  NotificationStackTone,
  { icon: LucideIcon; accent: string; chip: string }
> = {
  neutral: { icon: Bell, accent: "bg-muted-foreground/40", chip: "bg-muted text-muted-foreground" },
  info: { icon: Info, accent: "bg-info", chip: "bg-info-soft text-info-soft-foreground" },
  success: { icon: CircleCheck, accent: "bg-success", chip: "bg-success-soft text-success-soft-foreground" },
  warning: { icon: TriangleAlert, accent: "bg-warning", chip: "bg-warning-soft text-warning-soft-foreground" },
  danger: { icon: OctagonAlert, accent: "bg-danger", chip: "bg-danger-soft text-danger-soft-foreground" },
}

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

// ── Card ───────────────────────────────────────────────────────────
function NotificationStackCard({
  notice,
  titleId,
  style,
  behind,
  leaving,
  labels,
  onDismiss,
  onMeasure,
}: {
  notice: NotificationStackNotice
  titleId: string
  style: React.CSSProperties
  behind: boolean
  leaving: boolean
  labels: NotificationStackLabels
  onDismiss: (notice: NotificationStackNotice) => void
  onMeasure: (id: string, height: number) => void
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { id } = notice

  // Measure the natural height of the content (not the card, whose height is
  // pinned while it sits behind another one). Runs before paint.
  React.useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => onMeasure(id, el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [id, onMeasure])

  const tone = TONES[notice.tone ?? "neutral"]
  const Icon = tone.icon
  const action = notice.action

  const actionClass = cn(
    "mt-3 inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 text-start text-xs font-medium text-foreground transition-[background-color,scale] duration-150 hover:bg-muted active:scale-[0.97] [@media(pointer:coarse)]:min-h-9",
    FOCUS_RING,
  )
  const actionInner = action && (
    <>
      <span className="[overflow-wrap:anywhere]" dir="auto">{action.label}</span>
      {action.external && (
        <>
          <ExternalLink aria-hidden className="size-3 shrink-0" />
          <span className="sr-only">{labels.newTab}</span>
        </>
      )}
    </>
  )

  return (
    <article
      data-slot="notification-stack-card"
      data-notice-id={id}
      data-tone={notice.tone ?? "neutral"}
      data-behind={behind ? "" : undefined}
      data-leaving={leaving ? "" : undefined}
      aria-labelledby={titleId}
      aria-hidden={behind || leaving || undefined}
      inert={behind || leaving}
      style={style}
      className="gf-notification-stack-card absolute inset-x-0 top-0 overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm ring-1 ring-border"
    >
      <span
        data-slot="notification-stack-accent"
        aria-hidden
        className={cn("absolute inset-y-0 start-0 w-1", tone.accent)}
      />
      <div
        ref={contentRef}
        data-slot="notification-stack-content"
        className="gf-notification-stack-content flex items-start gap-3 p-4 ps-5"
      >
        <span
          data-slot="notification-stack-icon"
          aria-hidden
          className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", tone.chip)}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          {notice.badge && (
            <span
              data-slot="notification-stack-badge"
              dir="auto"
              className={cn(
                "mb-1 block w-fit max-w-full rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide [overflow-wrap:anywhere]",
                tone.chip,
              )}
            >
              {notice.badge}
            </span>
          )}
          <h3
            id={titleId}
            data-slot="notification-stack-title"
            dir="auto"
            className="text-sm font-semibold leading-snug text-foreground [overflow-wrap:anywhere]"
          >
            {labels.tones[notice.tone ?? "neutral"] && (
              <span className="sr-only">{labels.tones[notice.tone ?? "neutral"]}</span>
            )}
            {notice.title}
          </h3>
          {notice.text && (
            <p
              data-slot="notification-stack-text"
              dir="auto"
              className="mt-1 max-w-[38ch] whitespace-pre-line text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
            >
              {notice.text}
            </p>
          )}
          {action &&
            (action.href ? (
              <a
                data-slot="notification-stack-action"
                href={action.href}
                onClick={action.onClick}
                {...(action.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : null)}
                className={actionClass}
              >
                {actionInner}
              </a>
            ) : (
              <button
                data-slot="notification-stack-action"
                type="button"
                onClick={action.onClick}
                className={actionClass}
              >
                {actionInner}
              </button>
            ))}
        </div>
        <button
          data-slot="notification-stack-dismiss"
          type="button"
          aria-label={labels.dismiss(notice.title)}
          onClick={(e) => {
            e.stopPropagation()
            onDismiss(notice)
          }}
          className={cn(
            "-m-1 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground [@media(pointer:coarse)]:size-10",
            FOCUS_RING,
          )}
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </article>
  )
}

// ── Stack ──────────────────────────────────────────────────────────
export interface NotificationStackProps
  extends Omit<React.ComponentProps<"section">, "children"> {
  /** Ordered notices; index 0 is the front card. */
  notices: NotificationStackNotice[]
  /** Fired the moment a card is dismissed (start of its exit). */
  onDismiss?: (notice: NotificationStackNotice) => void
  /** Cards rendered in the collapsed stack: one readable plus the rest peeking. */
  maxVisible?: number
  /** Controlled expansion. Pair with `onExpandedChange`. */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Expand while the pointer hovers or keyboard focus is inside. */
  expandOnHover?: boolean
  /** Override any user-facing string; unspecified keys keep English defaults. */
  labels?: Partial<Omit<NotificationStackLabels, "tones">> & {
    tones?: Partial<NotificationStackLabels["tones"]>
  }
}

function NotificationStack({
  notices,
  onDismiss,
  maxVisible = 3,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  expandOnHover = true,
  labels: labelsProp,
  className,
  ref,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: NotificationStackProps) {
  const labels: NotificationStackLabels = {
    ...DEFAULT_LABELS,
    ...labelsProp,
    tones: { ...DEFAULT_LABELS.tones, ...labelsProp?.tones },
  }
  const uid = React.useId()
  const listId = `${uid}-list`
  const rootRef = React.useRef<HTMLElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)

  const [heights, setHeights] = React.useState<Record<string, number>>({})
  const onMeasure = React.useCallback((id: string, h: number) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }))
  }, [])

  // Dismissed ids are remembered so a notice never returns while the parent
  // keeps passing it. Once the parent drops an id the memory is released.
  const [dismissed, setDismissed] = React.useState<Set<string>>(() => new Set())
  // Cards mid-exit keep their notice (and slot) even if the parent has already
  // removed it, so the exit animation always plays.
  const [leaving, setLeaving] = React.useState<
    Map<string, { notice: NotificationStackNotice; index: number }>
  >(() => new Map())

  const currentIds = new Set(notices.map((n) => n.id))
  if ([...dismissed].some((id) => !currentIds.has(id))) {
    setDismissed(new Set([...dismissed].filter((id) => currentIds.has(id))))
  }

  const list = notices.filter((n) => !dismissed.has(n.id))
  for (const [id, { notice, index }] of leaving) {
    if (!list.some((n) => n.id === id)) list.splice(Math.min(index, list.length), 0, notice)
  }
  const active = list.filter((n) => !leaving.has(n.id))
  const count = active.length

  // ── Announce notices added after first render ──
  const idsKey = notices.map((n) => n.id).join("\u0000")
  const [seenKey, setSeenKey] = React.useState(idsKey)
  const [announcement, setAnnouncement] = React.useState("")
  if (idsKey !== seenKey) {
    setSeenKey(idsKey)
    const before = new Set(seenKey.split("\u0000"))
    const added = notices.filter((n) => !before.has(n.id)).map((n) => n.title)
    setAnnouncement(added.length ? labels.added(added) : "")
  }

  // ── Expansion: hover / focus-visible expand transiently, click pins ──
  const [innerOpen, setInnerOpen] = React.useState(defaultExpanded)
  const open = expandedProp ?? innerOpen
  const expanded = open && count > 1
  const openRef = React.useRef(open)
  React.useEffect(() => {
    openRef.current = open
  }, [open])
  const hoverRef = React.useRef(false)
  const focusRef = React.useRef(false)
  // Set while we move focus ourselves, so that move is not read as "focus entered".
  const muteFocusRef = React.useRef(false)
  // A stack that starts open stays open until the user collapses it.
  const pinnedRef = React.useRef(expandedProp ?? defaultExpanded)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!next) pinnedRef.current = false
      if (expandedProp === undefined) setInnerOpen(next)
      onExpandedChange?.(next)
    },
    [expandedProp, onExpandedChange],
  )
  const cancelClose = () => clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    if (!expandOnHover) return
    closeTimer.current = setTimeout(() => {
      if (!hoverRef.current && !focusRef.current && !pinnedRef.current && openRef.current) {
        setOpen(false)
      }
    }, CLOSE_DELAY_MS)
  }
  const collapse = () => {
    cancelClose()
    pinnedRef.current = false
    setOpen(false)
  }
  const pinOpen = () => {
    cancelClose()
    pinnedRef.current = true
    setOpen(true)
  }

  React.useEffect(() => {
    if (!expanded) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        pinnedRef.current = false
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [expanded, setOpen])

  // A stack that shrinks to a single card has nothing left to expand: release
  // the open flag so it does not spring open when more notices arrive.
  React.useEffect(() => {
    if (count <= 1 && openRef.current) {
      setOpen(false)
    }
  }, [count, setOpen])

  // ── Dismissal ──
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const focusAfter = React.useRef<{ id: string | null } | null>(null)
  React.useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      clearTimeout(closeTimer.current)
    }
  }, [])

  const dismiss = (notice: NotificationStackNotice) => {
    if (leaving.has(notice.id)) return
    const at = active.findIndex((n) => n.id === notice.id)
    if (rootRef.current?.contains(document.activeElement)) {
      // Hand focus to the next card's dismiss button, else the previous one,
      // else the container, once the exit has re-indexed the stack.
      focusAfter.current = { id: (active[at + 1] ?? active[at - 1])?.id ?? null }
    }
    setLeaving((m) => new Map(m).set(notice.id, { notice, index: list.findIndex((n) => n.id === notice.id) }))
    onDismiss?.(notice)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const t = setTimeout(() => {
      timers.current.delete(t)
      setDismissed((s) => new Set(s).add(notice.id))
      setLeaving((m) => {
        const next = new Map(m)
        next.delete(notice.id)
        return next
      })
    }, reduce ? 0 : EXIT_MS)
    timers.current.add(t)
  }

  React.useEffect(() => {
    const target = focusAfter.current
    if (!target) return
    focusAfter.current = null
    const root = rootRef.current
    if (!root) return
    const btn = target.id
      ? root.querySelector<HTMLElement>(
          `[data-notice-id="${CSS.escape(target.id)}"] [data-slot="notification-stack-dismiss"]`,
        )
      : null
    ;(btn ?? root).focus()
  }, [leaving])

  // ── Layout ──
  const frontHeight = active[0] ? heights[active[0].id] : undefined
  const measured = frontHeight !== undefined
  const shown = Math.min(count, Math.max(1, maxVisible))
  const hidden = Math.max(0, count - shown)

  let depth = 0
  let offset = 0
  const cards: React.ReactNode[] = []
  for (const notice of list) {
    const isLeaving = leaving.has(notice.id)
    const h = heights[notice.id]
    const behind = !expanded && !isLeaving && depth > 0
    if (!expanded && !isLeaving && depth > Math.max(1, maxVisible)) {
      depth++
      continue
    }
    const zIndex = isLeaving ? list.length + 1 : list.length - depth
    const style: React.CSSProperties = expanded
      ? { transform: `translateY(${offset}px)`, height: h, zIndex }
      : {
          zIndex,
          transform: `translateY(${depth * PEEK}px) scale(${1 - depth * SCALE_STEP})`,
          height: depth === 0 || isLeaving ? h : frontHeight,
          opacity: !isLeaving && depth >= Math.max(1, maxVisible) ? 0 : undefined,
        }
    cards.push(
      <NotificationStackCard
        key={notice.id}
        notice={notice}
        titleId={`${uid}-title-${notice.id}`}
        style={style}
        behind={behind}
        leaving={isLeaving}
        labels={labels}
        onDismiss={dismiss}
        onMeasure={onMeasure}
      />,
    )
    if (!isLeaving) {
      depth++
      offset += (h ?? 0) + GAP
    }
  }
  const listHeight = expanded
    ? Math.max(0, offset - GAP)
    : (frontHeight ?? 0) + (shown - 1) * PEEK

  return (
    <section
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      tabIndex={-1}
      data-slot="notification-stack"
      data-expanded={expanded ? "" : undefined}
      aria-label={count || leaving.size ? labels.region : undefined}
      onPointerEnter={(e) => {
        onPointerEnter?.(e)
        if (!expandOnHover || e.pointerType !== "mouse") return
        hoverRef.current = true
        cancelClose()
        if (count > 1) setOpen(true)
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        hoverRef.current = false
        if (!pinnedRef.current) scheduleClose()
      }}
      onFocus={(e) => {
        onFocus?.(e)
        if (muteFocusRef.current) return
        if (!expandOnHover || !e.target.matches(":focus-visible")) return
        focusRef.current = true
        cancelClose()
        if (count > 1) setOpen(true)
      }}
      onBlur={(e) => {
        onBlur?.(e)
        if (rootRef.current?.contains(e.relatedTarget as Node | null)) return
        focusRef.current = false
        if (!pinnedRef.current) scheduleClose()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.key !== "Escape" || !expanded) return
        const inside = rootRef.current?.contains(document.activeElement)
        collapse()
        if (inside) {
          muteFocusRef.current = true
          toggleRef.current?.focus()
          muteFocusRef.current = false
        }
      }}
      className={cn("w-full max-w-[380px] outline-none", className)}
      {...props}
    >
      <style href="gf-notification-stack" precedence="low">{NOTIFICATION_STACK_CSS}</style>
      <div role="status" data-slot="notification-stack-announcer" className="sr-only">
        {announcement}
      </div>
      <div
        id={listId}
        data-slot="notification-stack-list"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button,a")) return
          if (!expanded && count > 1) pinOpen()
        }}
        style={{ height: listHeight }}
        className={cn(
          "gf-notification-stack-list relative",
          !measured && "overflow-hidden",
          !expanded && count > 1 && "cursor-pointer",
        )}
      >
        {cards}
      </div>
      {count > 1 && (
        <div
          data-slot="notification-stack-footer"
          className="gf-notification-stack-footer mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground"
        >
          <span data-slot="notification-stack-count" aria-live="polite">
            {!expanded && hidden > 0 ? labels.hiddenCount(hidden) : ""}
          </span>
          <button
            ref={toggleRef}
            data-slot="notification-stack-toggle"
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => (expanded ? collapse() : pinOpen())}
            className={cn(
              "inline-flex min-h-7 items-center gap-1 rounded-md px-2 font-medium text-foreground transition-colors duration-150 hover:bg-muted [@media(pointer:coarse)]:min-h-9",
              FOCUS_RING,
            )}
          >
            <ChevronsUpDown aria-hidden className="size-3.5" />
            {expanded ? labels.collapse : labels.expand}
          </button>
        </div>
      )}
    </section>
  )
}

export { NotificationStack }

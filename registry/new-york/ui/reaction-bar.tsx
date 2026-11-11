"use client"

import * as React from "react"
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colour comes entirely from theme-token utilities on the elements; this sheet
// only holds motion: the icon pop, the digit roll and the count-width glide.
const REACTION_BAR_CSS = `
  .gf-reaction-bar-pop{animation:gf-reaction-bar-pop 320ms cubic-bezier(.65,0,.35,1);}
  .gf-reaction-bar-roll{animation:gf-reaction-bar-roll 400ms cubic-bezier(.83,0,.17,1) both;}
  .gf-reaction-bar-count[data-ready]{transition:width 400ms cubic-bezier(.83,0,.17,1);}
  @keyframes gf-reaction-bar-pop{0%{transform:scale(1);}35%{transform:scale(.75);}70%{transform:scale(1.12);}100%{transform:scale(1);}}
  @keyframes gf-reaction-bar-roll{from{opacity:0;transform:translateY(70%);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){
    .gf-reaction-bar-pop,.gf-reaction-bar-roll{animation:none;}
    .gf-reaction-bar-count[data-ready]{transition:none;}
  }
`

export type ReactionKey = "like" | "comment" | "repost" | "share"
export type ReactionBarVariant = "pill" | "chips"
export type ReactionBarSize = "sm" | "md" | "lg"

export interface ReactionState {
  count: number
  active?: boolean
}
export type ReactionRecord = Partial<Record<ReactionKey, ReactionState>>

export interface ReactionLabel {
  /** Start of the button's accessible name, e.g. "Like". */
  verb: string
  /** Noun for a count of exactly one, e.g. "like". */
  one: string
  /** Noun for any other count, e.g. "likes". */
  other: string
}

export interface ReactionBarLabels {
  /** Accessible name of the whole group. */
  group?: string
  like?: Partial<ReactionLabel>
  comment?: Partial<ReactionLabel>
  repost?: Partial<ReactionLabel>
  share?: Partial<ReactionLabel>
}

const KEYS: ReactionKey[] = ["like", "comment", "repost", "share"]

const DEFAULT_LABELS: Record<ReactionKey, ReactionLabel> = {
  like: { verb: "Like", one: "like", other: "likes" },
  comment: { verb: "Comment", one: "comment", other: "comments" },
  repost: { verb: "Repost", one: "repost", other: "reposts" },
  share: { verb: "Share", one: "share", other: "shares" },
}

const ICONS = { like: Heart, comment: MessageCircle, repost: Repeat2, share: Send }
// Only closed shapes can hold a fill; the others signal "on" by stroke weight.
const FILLABLE: Record<ReactionKey, boolean> = {
  like: true,
  comment: true,
  repost: false,
  share: false,
}

// Full literal class strings so Tailwind can see them.
const ACTIVE_TONE: Record<ReactionKey, string> = {
  like: "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft",
  comment: "bg-info-soft text-info-soft-foreground hover:bg-info-soft",
  repost: "bg-success-soft text-success-soft-foreground hover:bg-success-soft",
  share: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft",
}

const SIZE: Record<ReactionBarSize, { button: string; icon: string }> = {
  sm: { button: "h-7 min-w-7 px-2 text-xs", icon: "size-3.5" },
  md: { button: "h-9 min-w-9 px-2.5 text-sm", icon: "size-[18px]" },
  lg: { button: "h-11 min-w-11 px-3 text-base", icon: "size-5" },
}

/** Coerce anything to a non-negative whole number. */
function cleanCount(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

function readState(record: ReactionRecord | undefined, key: ReactionKey) {
  const s = record?.[key]
  return { count: cleanCount(s?.count), active: s?.active === true }
}

/** Round 10k–999,999 to the nearest thousand so compact output never reads "1000K". */
function shorten(n: number) {
  return n >= 10_000 && n < 1_000_000 ? Math.round(n / 1000) * 1000 : n
}

// ── Count: digits roll in, the slot glides to its new width ──

function Digit({ ch, ready }: { ch: string; ready: boolean }) {
  // Captured once at mount: digits created before the first frame stay still,
  // digits created later (changed characters) roll in.
  const [roll] = React.useState(ready)
  return (
    <span
      data-slot="reaction-bar-digit"
      className={cn("inline-block whitespace-pre", roll && "gf-reaction-bar-roll")}
    >
      {ch}
    </span>
  )
}

function Count({ text }: { text: string }) {
  const outerRef = React.useRef<HTMLSpanElement>(null)
  const innerRef = React.useRef<HTMLSpanElement>(null)
  const [ready, setReady] = React.useState(false)

  // Width is written imperatively so it can be re-measured (text change, late
  // font load) without a render. Before JS runs, the slot is simply unclipped.
  React.useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const measure = () => {
      outer.style.width = `${inner.offsetWidth}px`
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const chars = Array.from(text)
  return (
    <span
      ref={outerRef}
      data-slot="reaction-bar-count"
      data-ready={ready ? "" : undefined}
      aria-hidden
      className="gf-reaction-bar-count inline-flex overflow-hidden tabular-nums"
    >
      <span
        ref={innerRef}
        className={cn("inline-flex w-max whitespace-nowrap", chars.length > 0 && "ps-1.5")}
      >
        {chars.map((ch, i) => (
          <Digit key={`${chars.length - 1 - i}:${ch}`} ch={ch} ready={ready} />
        ))}
      </span>
    </span>
  )
}

// ── One toggle ──

interface ItemProps {
  kind: ReactionKey
  count: number
  active: boolean
  text: string
  name: string
  tooltip?: string
  variant: ReactionBarVariant
  size: ReactionBarSize
  onToggle: () => void
}

function ReactionItem({
  kind,
  count,
  active,
  text,
  name,
  tooltip,
  variant,
  size,
  onToggle,
}: ItemProps) {
  // Bumped on tap only, so the icon pops for user taps and not for outside updates.
  const [taps, setTaps] = React.useState(0)
  const Icon = ICONS[kind]
  const s = SIZE[size]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-slot="reaction-bar-item"
          data-kind={kind}
          data-active={active ? "" : undefined}
          aria-pressed={active}
          aria-label={name}
          onClick={() => {
            setTaps(t => t + 1)
            onToggle()
          }}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium outline-none transition-colors duration-150",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            // Coarse pointers get a 44px target regardless of size.
            "pointer-coarse:min-h-11 pointer-coarse:min-w-11",
            s.button,
            variant === "chips" ? "border" : "border border-transparent",
            active
              ? cn(ACTIVE_TONE[kind], "font-semibold", variant === "chips" && "border-current/25")
              : cn("text-muted-foreground hover:bg-muted hover:text-foreground", variant === "chips" && "border-border"),
          )}
        >
          <span
            key={taps}
            data-slot="reaction-bar-icon"
            aria-hidden
            className={cn("inline-flex", taps > 0 && "gf-reaction-bar-pop")}
          >
            <Icon
              strokeWidth={active ? 2.5 : 2}
              className={cn(
                s.icon,
                "transition-[fill] duration-200",
                FILLABLE[kind] && (active ? "fill-current" : "fill-transparent"),
              )}
            />
          </span>
          <Count text={count > 0 ? text : ""} />
        </button>
      </TooltipTrigger>
      {/* Mounted only when there is something to add, so the button never remounts. */}
      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}

// ── Root ──

export interface ReactionBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** Controlled record — pair with `onReact`, which then only requests the next state. */
  reactions?: ReactionRecord
  /** Initial record when uncontrolled. */
  defaultReactions?: ReactionRecord
  /** Fires on every tap with the key and its next full state. */
  onReact?: (key: ReactionKey, state: Required<ReactionState>) => void
  /** Which actions to show, in order. Unknown keys and duplicates are dropped. */
  actions?: ReactionKey[]
  /** `pill` = one floating container; `chips` = separate bordered chips. */
  variant?: ReactionBarVariant
  size?: ReactionBarSize
  /** BCP 47 locale for number formatting and plural rules. */
  locale?: string | string[]
  /** Override any user-facing string; supply Thai (etc.) here. */
  labels?: ReactionBarLabels
}

function ReactionBar({
  reactions,
  defaultReactions,
  onReact,
  actions = KEYS,
  variant = "pill",
  size = "md",
  locale = "en",
  labels,
  className,
  ...props
}: ReactionBarProps) {
  const isControlled = reactions !== undefined
  const [internal, setInternal] = React.useState<ReactionRecord>(defaultReactions ?? {})
  const record = isControlled ? reactions : internal

  const localeKey = Array.isArray(locale) ? locale.join(",") : locale
  const fmt = React.useMemo(() => {
    const l = localeKey.split(",")
    return {
      compact: new Intl.NumberFormat(l, { notation: "compact", maximumFractionDigits: 1 }),
      exact: new Intl.NumberFormat(l),
      plural: new Intl.PluralRules(l),
    }
  }, [localeKey])

  const visible = Array.isArray(actions)
    ? actions.filter((k, i) => KEYS.includes(k) && actions.indexOf(k) === i)
    : []
  if (visible.length === 0) return null

  function toggle(key: ReactionKey) {
    const cur = readState(record, key)
    const active = !cur.active
    const next = { active, count: Math.max(0, cur.count + (active ? 1 : -1)) }
    if (!isControlled) setInternal(prev => ({ ...prev, [key]: next }))
    onReact?.(key, next)
  }

  return (
    <div
      data-slot="reaction-bar"
      data-variant={variant}
      role="group"
      aria-label={labels?.group ?? "Post actions"}
      className={cn(
        "inline-flex max-w-full flex-wrap items-center",
        variant === "pill"
          ? "gap-0.5 rounded-full border bg-card p-1 shadow-sm"
          : "gap-1.5",
        className,
      )}
      {...props}
    >
      <style href="gf-reaction-bar" precedence="low">{REACTION_BAR_CSS}</style>
      {visible.map(key => {
        const { count, active } = readState(record, key)
        const o = labels?.[key]
        const d = DEFAULT_LABELS[key]
        const l = { verb: o?.verb ?? d.verb, one: o?.one ?? d.one, other: o?.other ?? d.other }
        const exact = fmt.exact.format(count)
        const noun = fmt.plural.select(count) === "one" ? l.one : l.other
        return (
          <ReactionItem
            key={key}
            kind={key}
            count={count}
            active={active}
            text={fmt.compact.format(shorten(count))}
            name={count > 0 ? `${l.verb}, ${exact} ${noun}` : l.verb}
            tooltip={count >= 1000 ? `${exact} ${noun}` : undefined}
            variant={variant}
            size={size}
            onToggle={() => toggle(key)}
          />
        )
      })}
    </div>
  )
}

export { ReactionBar }

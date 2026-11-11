"use client"

import * as React from "react"
import {
  Check,
  ChevronDown,
  Sparkles,
  Undo2,
  ArrowUpDown,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// One tiny "settle" (fade + 2px rise) reused for the reason text, the accepted
// chip and the alternative badge. Fold/chevron/bar transitions are Tailwind
// utilities with `motion-reduce:` guards; the keyframe below is guarded here.
const RECOMMENDATION_CARD_CSS = `
  .gf-recommendation-card-settle{animation:gf-recommendation-card-settle 320ms cubic-bezier(.22,1,.36,1) both;}
  @keyframes gf-recommendation-card-settle{from{opacity:0;transform:translateY(2px);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){.gf-recommendation-card-settle{animation:none;}}
`

export type RecommendationConfidence = "low" | "medium" | "high"

export interface RecommendationOption {
  /** Unique within `options`. Used as the selection value. */
  id: string
  /** Short name shown in the menu, the accept button and the accepted message. */
  label: string
  /** One-sentence rationale. Rich content is fine. */
  reason: React.ReactNode
  /** How sure the suggestion is. Omit to hide the signal for this option. */
  confidence?: RecommendationConfidence
}

export interface RecommendationCardLabels {
  /** Default heading when `title` is not set. */
  title: string
  /** Badge shown while a non-first option is displayed. */
  alternative: string
  /** Trigger of the alternatives menu. */
  alternatives: string
  /** Tag on the first option inside the menu. */
  recommended: string
  /** Accept button text, built from the current option label. */
  accept: (label: string) => string
  /** Status text after accepting. */
  accepted: (label: string) => string
  undo: string
  /** Seconds left in the undo window, shown beside the undo label. */
  undoIn: (seconds: number) => string
  /** Announced (not displayed) when the undo window closes. */
  undoExpired: string
  dismiss: string
  confidence: Record<RecommendationConfidence, string>
}

// Lowercase the first letter only for "Capital + lowercase" words, so
// "AWS backup" and "iPhone" keep their casing.
function lowerFirst(s: string) {
  return /^\p{Lu}\p{Ll}/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

const DEFAULT_LABELS: RecommendationCardLabels = {
  title: "Suggested for you",
  alternative: "Alternative",
  alternatives: "Alternatives",
  recommended: "Recommended",
  accept: (label) => `Accept ${lowerFirst(label)}`,
  accepted: (label) => `${label} accepted`,
  undo: "Undo",
  undoIn: (s) => `${s}s`,
  undoExpired: "Undo is no longer available",
  dismiss: "Dismiss",
  confidence: {
    low: "Low confidence",
    medium: "Medium confidence",
    high: "High confidence",
  },
}

const LEVEL: Record<RecommendationConfidence, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

// Tone per level. The text label carries the meaning; colour only reinforces it.
const TONE: Record<RecommendationConfidence, string> = {
  low: "bg-warning",
  medium: "bg-info",
  high: "bg-success",
}

const BAR_HEIGHT = ["h-1", "h-2", "h-3"]

function SignalBars({
  level,
  label,
  className,
}: {
  level: RecommendationConfidence
  /** When set the glyph is exposed to assistive tech with this name. */
  label?: string
  className?: string
}) {
  return (
    <span
      data-slot="recommendation-card-signal-bars"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex h-3 shrink-0 items-end gap-0.5", className)}
    >
      {BAR_HEIGHT.map((h, i) => (
        <span
          key={h}
          data-slot="recommendation-card-signal-bar"
          className={cn(
            "w-1 rounded-[1px] transition-colors duration-[260ms] motion-reduce:transition-none",
            h,
            i < LEVEL[level] ? TONE[level] : "bg-border",
          )}
        />
      ))}
    </span>
  )
}

type Acceptance = {
  id: string
  /** `pending` = undo window open, `committed` = final. */
  phase: "pending" | "committed"
  expired: boolean
}

export interface RecommendationCardProps
  extends Omit<
    React.ComponentProps<"section">,
    "title" | "defaultValue" | "onChange"
  > {
  /** Heading. Also the accessible name of the region. */
  title?: string
  /** The first entry is the recommendation, the rest are alternatives. */
  options: RecommendationOption[]
  /** Controlled id of the option shown. */
  value?: string
  /** Initial option id when uncontrolled. Defaults to the first option. */
  defaultValue?: string
  onValueChange?: (id: string, option: RecommendationOption) => void
  /** Controlled expanded state of the reason. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Length of the undo window in ms after accepting. The timer pauses while
   * the footer is hovered or focused. `0` accepts immediately with no undo.
   */
  undoTimeout?: number
  /** Fires the moment the user accepts. */
  onAccept?: (option: RecommendationOption) => void
  /** Fires when the user undoes an acceptance inside the window. */
  onUndo?: (option: RecommendationOption) => void
  /** Fires once the acceptance is final (window expired, or no undo window). */
  onCommit?: (option: RecommendationOption) => void
  /** Fires when the user dismisses the card; the card then renders nothing. */
  onDismiss?: (option: RecommendationOption) => void
  /** Show the dismiss action (only before accepting). */
  dismissible?: boolean
  /** Override any of the default English strings. */
  labels?: Partial<Omit<RecommendationCardLabels, "confidence">> & {
    confidence?: Partial<RecommendationCardLabels["confidence"]>
  }
}

function RecommendationCard({
  title,
  options,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  undoTimeout = 6000,
  onAccept,
  onUndo,
  onCommit,
  onDismiss,
  dismissible = true,
  labels: labelsProp,
  className,
  ...props
}: RecommendationCardProps) {
  const l: RecommendationCardLabels = {
    ...DEFAULT_LABELS,
    ...labelsProp,
    confidence: { ...DEFAULT_LABELS.confidence, ...labelsProp?.confidence },
  }
  const uid = React.useId()
  const titleId = `${uid}-title`
  const reasonId = `${uid}-reason`

  const [internalId, setInternalId] = React.useState(defaultValue)
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const [accepted, setAccepted] = React.useState<Acceptance | null>(null)
  const [dismissed, setDismissed] = React.useState(false)
  const [remaining, setRemaining] = React.useState(undoTimeout)
  const [hover, setHover] = React.useState(false)
  const [focus, setFocus] = React.useState(false)
  const remainingRef = React.useRef(undoTimeout)
  const acceptRef = React.useRef<HTMLButtonElement>(null)
  const undoRef = React.useRef<HTMLButtonElement>(null)
  const chipRef = React.useRef<HTMLSpanElement>(null)
  // Set by keyboard-driven accept/undo: the clicked button unmounts, so focus
  // is handed to its replacement instead of falling back to <body>.
  const refocus = React.useRef(false)

  const selectedId = value !== undefined ? value : internalId
  const current = options.find((o) => o.id === selectedId) ?? options[0]
  const open = openProp !== undefined ? openProp : internalOpen

  // The acceptance belongs to one option; drop it when another one is shown.
  if (accepted && accepted.id !== current?.id) setAccepted(null)
  const acc = accepted
  const pending = acc?.phase === "pending"
  const paused = hover || focus

  // Latest-callback ref so the timer below never restarts for a new closure.
  const latest = React.useRef({ current, onCommit })
  React.useEffect(() => {
    latest.current = { current, onCommit }
  })

  // Undo window. Counts down on a clock (not a CSS animation) so pausing is
  // exact and reduced-motion users get the same text countdown.
  React.useEffect(() => {
    if (!pending || paused) return
    const end = Date.now() + remainingRef.current
    const timer = setInterval(() => {
      const left = end - Date.now()
      remainingRef.current = Math.max(0, left)
      if (left > 0) return setRemaining(left)
      clearInterval(timer)
      setAccepted((a) =>
        a?.phase === "pending" ? { ...a, phase: "committed", expired: true } : a,
      )
      latest.current.onCommit?.(latest.current.current)
    }, 200)
    return () => clearInterval(timer)
  }, [pending, paused])

  React.useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    const el = acc ? (undoRef.current ?? chipRef.current) : acceptRef.current
    el?.focus()
  }, [acc])

  if (!current || dismissed) return null

  const isAlt = current !== options[0]

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function select(id: string) {
    const option = options.find((o) => o.id === id)
    if (!option || option.id === current.id) return
    if (value === undefined) setInternalId(id)
    onValueChange?.(id, option)
    if (!open) setOpen(true) // show the new reason
  }

  function accept(byKeyboard: boolean) {
    refocus.current = byKeyboard
    const instant = undoTimeout <= 0
    remainingRef.current = undoTimeout
    setRemaining(undoTimeout)
    setFocus(false) // the accept button unmounts without a blur
    setAccepted({
      id: current.id,
      phase: instant ? "committed" : "pending",
      expired: false,
    })
    onAccept?.(current)
    if (instant) onCommit?.(current)
  }

  function undo(byKeyboard: boolean) {
    refocus.current = byKeyboard
    setAccepted(null)
    onUndo?.(current)
  }

  function dismiss() {
    setDismissed(true)
    onDismiss?.(current)
  }

  const heading = title ?? l.title
  const acceptText = l.accept(current.label)
  const announcement = acc
    ? acc.expired
      ? l.undoExpired
      : l.accepted(current.label)
    : ""

  return (
    <section
      data-slot="recommendation-card"
      data-accepted={acc ? "" : undefined}
      aria-labelledby={titleId}
      className={cn(
        "w-full max-w-[440px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-colors duration-200 motion-reduce:transition-none",
        acc && "border-success/40",
        className,
      )}
      {...props}
    >
      <style href="gf-recommendation-card" precedence="low">
        {RECOMMENDATION_CARD_CSS}
      </style>

      <button
        type="button"
        data-slot="recommendation-card-header"
        aria-expanded={open}
        aria-controls={reasonId}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset motion-reduce:transition-none"
      >
        <Sparkles aria-hidden className="size-4 shrink-0 text-primary" />
        <span
          id={titleId}
          data-slot="recommendation-card-title"
          dir="auto"
          title={heading}
          className="min-w-0 flex-1 truncate text-sm font-medium"
        >
          {heading}
        </span>
        {isAlt && (
          <span
            data-slot="recommendation-card-badge"
            className="gf-recommendation-card-settle shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary-soft-foreground"
          >
            {l.alternative}
          </span>
        )}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
            !open && "-rotate-90",
          )}
        />
      </button>

      <div
        id={reasonId}
        data-slot="recommendation-card-reason"
        data-state={open ? "open" : "closed"}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {/* Re-mounted per option so the settle animation replays. */}
          <div
            key={current.id}
            data-slot="recommendation-card-reason-text"
            dir="auto"
            className="gf-recommendation-card-settle px-4 pb-3 text-sm leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line text-muted-foreground"
          >
            {current.reason}
          </div>
        </div>
      </div>

      <div
        data-slot="recommendation-card-footer"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false)
        }}
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t px-4 py-3"
      >
        {current.confidence ? (
          <span
            data-slot="recommendation-card-signal"
            data-level={current.confidence}
            title={l.confidence[current.confidence]}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <SignalBars level={current.confidence} />
            {l.confidence[current.confidence]}
          </span>
        ) : null}

        <div
          data-slot="recommendation-card-actions"
          className="ml-auto flex min-w-0 max-w-full flex-wrap items-center justify-end gap-2"
        >
          {acc ? (
            <>
              <span
                ref={chipRef}
                tabIndex={-1}
                data-slot="recommendation-card-accepted"
                title={l.accepted(current.label)}
                className="gf-recommendation-card-settle inline-flex min-h-8 outline-none min-w-0 items-center gap-1.5 rounded-md bg-success-soft px-2.5 text-sm font-medium text-success-soft-foreground"
              >
                <Check aria-hidden className="size-4 shrink-0" />
                <span dir="auto" className="truncate">
                  {l.accepted(current.label)}
                </span>
              </span>
              {pending && (
                <Button
                  data-slot="recommendation-card-undo"
                  variant="secondary"
                  size="sm"
                  ref={undoRef}
                  onClick={(e) => undo(e.detail === 0)}
                  className="tabular-nums"
                >
                  <Undo2 aria-hidden />
                  {l.undo}
                  <span aria-hidden className="text-muted-foreground">
                    {l.undoIn(Math.max(1, Math.ceil(remaining / 1000)))}
                  </span>
                </Button>
              )}
            </>
          ) : (
            <>
              {dismissible && (
                <Button
                  data-slot="recommendation-card-dismiss"
                  variant="ghost"
                  size="sm"
                  onClick={dismiss}
                  className="text-muted-foreground"
                >
                  <X aria-hidden />
                  {l.dismiss}
                </Button>
              )}
              {options.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      data-slot="recommendation-card-alternatives"
                      variant="outline"
                      size="sm"
                    >
                      <ArrowUpDown aria-hidden />
                      {l.alternatives}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-slot="recommendation-card-menu"
                    side="top"
                    align="end"
                    className="max-h-80 w-72 max-w-(--radix-dropdown-menu-content-available-width) overscroll-contain"
                  >
                    <DropdownMenuRadioGroup
                      value={current.id}
                      onValueChange={select}
                    >
                      {options.map((o, i) => (
                        <DropdownMenuRadioItem
                          key={o.id}
                          value={o.id}
                          data-slot="recommendation-card-option"
                          className="gap-2 data-[state=checked]:bg-accent"
                        >
                          <span
                            data-slot="recommendation-card-option-label"
                            dir="auto"
                            title={o.label}
                            className="min-w-0 flex-1 truncate"
                          >
                            {o.label}
                          </span>
                          {i === 0 && (
                            <span
                              data-slot="recommendation-card-option-badge"
                              className="shrink-0 rounded-full bg-primary-soft px-1.5 py-px text-[11px] font-medium text-primary-soft-foreground"
                            >
                              {l.recommended}
                            </span>
                          )}
                          {o.confidence && (
                            <SignalBars
                              level={o.confidence}
                              label={l.confidence[o.confidence]}
                            />
                          )}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                data-slot="recommendation-card-accept"
                size="sm"
                ref={acceptRef}
                onClick={(e) => accept(e.detail === 0)}
                title={acceptText}
                className="min-w-0 max-w-full"
              >
                <span dir="auto" className="truncate">
                  {acceptText}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Persistent live region: announces acceptance and the end of undo. */}
      <span
        data-slot="recommendation-card-status"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {announcement}
      </span>
    </section>
  )
}

export { RecommendationCard }

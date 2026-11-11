"use client"

import * as React from "react"
import { CircleCheck, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Only the small "fade + rise" entrance lives here; the fold/expand motion is a
// plain grid-template-rows transition done with Tailwind utilities below.
const DECISION_INBOX_CSS = `
  @keyframes gf-decision-inbox-rise{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:none;}}
  .gf-decision-inbox-rise{animation:gf-decision-inbox-rise 360ms cubic-bezier(.22,1,.36,1) both;}
  .gf-decision-inbox-empty{animation-duration:420ms;animation-delay:300ms;}
  @media (prefers-reduced-motion: reduce){.gf-decision-inbox-rise{animation:none;}}
`

export type DecisionAnswer = "primary" | "secondary"

export interface Decision {
  /** Stable unique id — keys the per-decision state. */
  id: string
  /** The question. Full text when open, one truncated line when folded. */
  title: string
  /** Optional context shown under the title. Newlines are preserved. */
  detail?: string
  /** Label of the emphasised answer. Also shown in the confirmation. */
  primary: string
  /** Label of the lighter answer. Also shown in the confirmation. */
  secondary: string
  /** Start folded to a single line; opens on click or when an earlier row leaves. */
  collapsed?: boolean
}

export interface DecisionInboxLabels {
  /** Header text while decisions are waiting. Receives the raw and the formatted count. */
  pending: (count: number, formatted: string) => string
  /** Header text when nothing is waiting. */
  allClear: string
  /** Message shown once every decision has been answered. */
  empty: string
}

const DEFAULT_LABELS: DecisionInboxLabels = {
  pending: (count, formatted) =>
    count === 1
      ? `${formatted} decision is waiting for you`
      : `${formatted} decisions are waiting for you`,
  allClear: "You're all caught up",
  empty: "Nothing is waiting on you. New decisions will appear here.",
}

interface ItemState {
  open?: boolean
  answer?: DecisionAnswer
  gone?: boolean
}

export interface DecisionInboxProps
  extends Omit<React.ComponentProps<"section">, "children"> {
  decisions: Decision[]
  /** Called once per answer, at the moment the button is pressed. */
  onDecide?: (decision: Decision, answer: DecisionAnswer) => void
  /** Override any of the built-in strings. */
  labels?: Partial<DecisionInboxLabels>
  /** BCP 47 locale used to format the pending count. */
  locale?: string
  /** Milliseconds the confirmation stays before the row folds away. */
  confirmDelay?: number
}

function DecisionInbox({
  decisions,
  onDecide,
  labels,
  locale,
  confirmDelay = 1100,
  className,
  ref,
  ...props
}: DecisionInboxProps) {
  // Per-key fallback so an explicit `undefined` never wipes a default.
  const l: DecisionInboxLabels = {
    pending: labels?.pending ?? DEFAULT_LABELS.pending,
    allClear: labels?.allClear ?? DEFAULT_LABELS.allClear,
    empty: labels?.empty ?? DEFAULT_LABELS.empty,
  }
  const uid = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  React.useImperativeHandle(ref, () => rootRef.current as HTMLElement)
  const [state, setState] = React.useState<Record<string, ItemState>>({})

  // Latest props for use inside timers.
  const decisionsRef = React.useRef(decisions)
  React.useEffect(() => {
    decisionsRef.current = decisions
  })
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  // Set before a state change that unmounts/inerts the focused element:
  // {} = hand focus to the next live answer, { id } = that decision's first answer.
  const refocus = React.useRef<{ id?: string } | null>(null)

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // When the focused element is replaced (row folds away, folded title opens),
  // move focus to a live answer button (or the root) so it never falls to <body>.
  React.useEffect(() => {
    const target = refocus.current
    if (!target) return
    refocus.current = null
    const root = rootRef.current
    const sel = '[data-slot="decision-inbox-item"][data-open] [data-slot="decision-inbox-actions"] button'
    const scope =
      target.id === undefined
        ? root
        : root?.querySelector(`[data-decision-id="${CSS.escape(target.id)}"]`)
    const next = scope?.querySelector<HTMLElement>(sel)
    ;(next ?? root)?.focus({ preventScroll: true })
  }, [state])

  const isOpen = (d: Decision) => state[d.id]?.open ?? !d.collapsed
  const pendingCount = decisions.filter((d) => !state[d.id]?.answer).length
  const clear = pendingCount === 0

  const open = (id: string) => {
    refocus.current = { id }
    setState((s) => ({ ...s, [id]: { ...s[id], open: true } }))
  }

  const answer = (d: Decision, slot: DecisionAnswer) => {
    if (state[d.id]?.answer) return
    setState((s) => ({ ...s, [d.id]: { ...s[d.id], answer: slot } }))
    onDecide?.(d, slot)

    const timer = setTimeout(() => {
      timers.current.delete(timer)
      const row = rootRef.current?.querySelector(
        `[data-decision-id="${CSS.escape(d.id)}"]`,
      )
      if (row?.contains(document.activeElement)) refocus.current = {}
      setState((s) => {
        const next = { ...s, [d.id]: { ...s[d.id], gone: true } }
        // Move attention on: open the first folded, unanswered row.
        const target = decisionsRef.current.find(
          (x) =>
            x.id !== d.id &&
            !(next[x.id]?.open ?? !x.collapsed) &&
            !next[x.id]?.answer,
        )
        if (target) next[target.id] = { ...next[target.id], open: true }
        return next
      })
    }, confirmDelay)
    timers.current.add(timer)
  }

  const count = new Intl.NumberFormat(locale).format(pendingCount)
  const headerId = `${uid}-header`

  return (
    <section
      ref={rootRef}
      data-slot="decision-inbox"
      data-clear={clear || undefined}
      aria-labelledby={headerId}
      tabIndex={-1}
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs outline-none",
        className,
      )}
      {...props}
    >
      <style href="gf-decision-inbox" precedence="low">{DECISION_INBOX_CSS}</style>

      <div
        id={headerId}
        data-slot="decision-inbox-header"
        aria-live="polite"
        className={cn(
          "flex h-11 items-center border-b px-4 text-sm font-medium transition-colors duration-300 motion-reduce:transition-none",
          clear ? "text-success-soft-foreground" : "text-warning-soft-foreground",
        )}
      >
        <span
          key={String(clear)}
          className="gf-decision-inbox-rise flex min-w-0 items-center gap-2"
        >
          {clear ? (
            <CircleCheck aria-hidden className="size-4 shrink-0" />
          ) : (
            <TriangleAlert aria-hidden className="size-4 shrink-0" />
          )}
          <span dir="auto" className="truncate">
            {clear ? l.allClear : l.pending(pendingCount, count)}
          </span>
        </span>
      </div>

      <div data-slot="decision-inbox-list">
        {decisions.map((d, i) => {
          const st = state[d.id]
          const gone = !!st?.gone
          const opened = isOpen(d)
          const bodyId = `${uid}-body-${i}`
          // No hairline above the first row that is still on screen.
          const separated = decisions
            .slice(0, i)
            .some((x) => !state[x.id]?.gone)

          return (
            <div
              key={d.id}
              data-slot="decision-inbox-row"
              data-decision-id={d.id}
              data-gone={gone || undefined}
              inert={gone}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-[460ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                gone ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  data-slot="decision-inbox-item"
                  data-open={opened || undefined}
                  data-answered={st?.answer ? "" : undefined}
                  className={cn("px-4 py-3", separated && "border-t")}
                >
                  {opened ? (
                    <p
                      data-slot="decision-inbox-title"
                      dir="auto"
                      className="text-start text-sm font-medium [overflow-wrap:anywhere]"
                    >
                      {d.title}
                    </p>
                  ) : (
                    <button
                      type="button"
                      data-slot="decision-inbox-title"
                      dir="auto"
                      title={d.title}
                      aria-expanded={false}
                      aria-controls={bodyId}
                      onClick={() => open(d.id)}
                      className="-mx-4 -my-3 block w-[calc(100%+2rem)] cursor-pointer truncate px-4 py-3 text-start text-sm text-muted-foreground outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 motion-reduce:transition-none"
                    >
                      {d.title}
                    </button>
                  )}

                  <div
                    id={bodyId}
                    data-slot="decision-inbox-body"
                    inert={!opened}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                      opened ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    {/* Bleed keeps focus rings from being clipped mid-fold. */}
                    <div className="-m-1 min-h-0 overflow-hidden p-1">
                      {d.detail && (
                        <p
                          data-slot="decision-inbox-detail"
                          dir="auto"
                          className="mt-1 whitespace-pre-line text-start text-sm text-muted-foreground [overflow-wrap:anywhere]"
                        >
                          {d.detail}
                        </p>
                      )}
                      <div
                        data-slot="decision-inbox-actions"
                        className="mt-3 flex min-h-8 flex-wrap items-center gap-2"
                      >
                        {st?.answer ? (
                          <Confirmation>
                            {st.answer === "primary" ? d.primary : d.secondary}
                          </Confirmation>
                        ) : (
                          <>
                            <Button
                              data-slot="decision-inbox-primary"
                              size="sm"
                              dir="auto"
                              onClick={() => answer(d, "primary")}
                              className={ANSWER_CLASS}
                            >
                              {d.primary}
                            </Button>
                            <Button
                              data-slot="decision-inbox-secondary"
                              variant="outline"
                              size="sm"
                              dir="auto"
                              onClick={() => answer(d, "secondary")}
                              className={ANSWER_CLASS}
                            >
                              {d.secondary}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {clear && (
        <p
          data-slot="decision-inbox-empty"
          dir="auto"
          className="gf-decision-inbox-rise gf-decision-inbox-empty px-4 py-6 text-center text-sm text-muted-foreground"
        >
          {l.empty}
        </p>
      )}
    </section>
  )
}

const ANSWER_CLASS =
  "h-auto min-h-8 max-w-full whitespace-normal py-1.5 text-start [overflow-wrap:anywhere] active:scale-[0.97] motion-reduce:active:scale-100"

function Confirmation({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  // The pressed button was just removed; take focus so it isn't lost to <body>.
  React.useEffect(() => {
    if (document.activeElement === document.body) {
      ref.current?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      data-slot="decision-inbox-confirmation"
      dir="auto"
      className="gf-decision-inbox-rise inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-md bg-success-soft px-3 text-sm font-medium text-success-soft-foreground outline-none [overflow-wrap:anywhere]"
    >
      <CircleCheck aria-hidden className="size-4 shrink-0" />
      {children}
    </div>
  )
}

export { DecisionInbox }

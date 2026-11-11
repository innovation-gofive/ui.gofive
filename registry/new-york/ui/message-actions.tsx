"use client"

import * as React from "react"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverAnchor, PopoverContent } from "./popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours never appear here — every colour comes from a theme-token utility on
// the element, so light/dark and data-brand follow the host app. Only motion
// that Tailwind has no utility for lives in this sheet.
const MESSAGE_ACTIONS_CSS = `
  .gf-message-actions-spin{animation:gf-message-actions-spin 640ms cubic-bezier(.2,.7,.2,1) 1;}
  .gf-message-actions-spin-loop{animation:gf-message-actions-spin 900ms linear infinite;}
  @keyframes gf-message-actions-spin{to{transform:rotate(360deg);}}
  .gf-message-actions-pop{animation:gf-message-actions-pop 420ms cubic-bezier(.3,1.4,.5,1) 1;}
  @keyframes gf-message-actions-pop{0%{transform:scale(1) rotate(0);}35%{transform:scale(1.25) rotate(-8deg);}100%{transform:scale(1) rotate(0);}}
  .gf-message-actions-bar{transform-box:fill-box;transform-origin:50% 100%;animation:gf-message-actions-bounce 900ms ease-in-out infinite;}
  .gf-message-actions-bar:nth-child(1){animation-duration:760ms;animation-delay:-240ms;}
  .gf-message-actions-bar:nth-child(2){animation-duration:940ms;animation-delay:-520ms;}
  .gf-message-actions-bar:nth-child(3){animation-duration:820ms;animation-delay:-90ms;}
  .gf-message-actions-bar:nth-child(4){animation-duration:1000ms;animation-delay:-700ms;}
  @keyframes gf-message-actions-bounce{0%,100%{transform:scaleY(.3);}50%{transform:scaleY(1);}}
  @media (prefers-reduced-motion: reduce){
    .gf-message-actions-spin,.gf-message-actions-spin-loop,.gf-message-actions-pop,.gf-message-actions-bar{animation:none;}
    .gf-message-actions-bar:nth-child(odd){transform:scaleY(1);}
    .gf-message-actions-bar:nth-child(even){transform:scaleY(.4);}
  }
`

export type MessageActionsAction = "copy" | "regenerate" | "feedback" | "speak"
export type MessageActionsVote = "up" | "down"

export interface MessageActionsReason {
  /** Stable id reported to `onFeedback` — keep it language-neutral. */
  value: string
  /** Localized text shown on the reason chip. */
  label: string
  /** Selecting this reason reveals an optional free-text field. */
  freeText?: boolean
}

export interface MessageActionsLabels {
  /** Accessible name of the toolbar. */
  group: string
  copy: string
  copied: string
  regenerate: string
  /** Tooltip while `regenerating` is true. */
  regenerating: string
  /** Announcement when regenerate is pressed. */
  regenerateStarted: string
  versionGroup: string
  previousVersion: string
  nextVersion: string
  /** Template — `{current}` and `{total}` are replaced. Also the announcement on change. */
  versionOf: string
  thumbsUp: string
  /** Up-thumb tooltip once voted. */
  thumbsUpThanks: string
  thumbsUpAnnounce: string
  thumbsDown: string
  /** Announcement for a thumbs-down that opens the reasons popover. */
  thumbsDownAnnounce: string
  /** Announcement for a thumbs-down when there is no reasons popover. */
  thumbsDownMarked: string
  voteWithdrawn: string
  feedbackTitle: string
  feedbackClose: string
  feedbackSubmit: string
  feedbackSent: string
  feedbackPlaceholder: string
  feedbackTextName: string
  feedbackThanksAnnounce: string
  speak: string
  stopSpeaking: string
  speakStarted: string
  speakStopped: string
  speakFinished: string
}

const DEFAULT_LABELS: MessageActionsLabels = {
  group: "Reply tools",
  copy: "Copy",
  copied: "Copied",
  regenerate: "Regenerate",
  regenerating: "Regenerating…",
  regenerateStarted: "Regenerating the response.",
  versionGroup: "Response versions",
  previousVersion: "Earlier answer",
  nextVersion: "Later answer",
  versionOf: "Version {current} of {total}",
  thumbsUp: "Helpful answer",
  thumbsUpThanks: "Noted, thank you",
  thumbsUpAnnounce: "Marked as helpful.",
  thumbsDown: "Unhelpful answer",
  thumbsDownAnnounce: "Marked as unhelpful. Tell us why in the dialog that opened.",
  thumbsDownMarked: "Marked as unhelpful.",
  voteWithdrawn: "Feedback withdrawn.",
  feedbackTitle: "What went wrong?",
  feedbackClose: "Close",
  feedbackSubmit: "Send feedback",
  feedbackSent: "Thank you",
  feedbackPlaceholder: "Anything else? (optional)",
  feedbackTextName: "Additional details",
  feedbackThanksAnnounce: "Thank you for your feedback.",
  speak: "Listen",
  stopSpeaking: "Stop playback",
  speakStarted: "Playback started.",
  speakStopped: "Playback stopped.",
  speakFinished: "Playback finished.",
}

const DEFAULT_REASONS: MessageActionsReason[] = [
  { value: "inaccurate", label: "Inaccurate" },
  { value: "too-long", label: "Too wordy" },
  { value: "ignored-instructions", label: "Ignored my instructions" },
  { value: "other", label: "Other", freeText: true },
]

const ACTION_ORDER: MessageActionsAction[] = ["copy", "regenerate", "feedback", "speak"]

export interface MessageActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
  /** Message content — written to the clipboard by Copy and used to estimate read-aloud length. */
  text?: string
  /** Which actions to render, in order. Unknown keys and duplicates are dropped. */
  actions?: MessageActionsAction[]
  /** Number of answer versions, or the versions themselves (only the length is used). */
  versions?: number | unknown[]
  /** Controlled current version (0-based). */
  version?: number
  /** Initial version when uncontrolled (0-based). Defaults to the newest. */
  defaultVersion?: number
  onVersionChange?: (index: number) => void
  onCopy?: (text?: string) => void
  onRegenerate?: () => void
  /** Busy flag — spins the icon, swaps the tooltip and keeps the bar visible. */
  regenerating?: boolean
  /** `null` = vote withdrawn. A thumbs-down is reported at once, then again with the reason. */
  onFeedback?: (vote: MessageActionsVote | null, reason?: string, text?: string) => void
  /** Choices in the thumbs-down popover. An empty list skips the popover entirely. */
  reasons?: MessageActionsReason[]
  onSpeak?: (playing: boolean) => void
  /** Controlled playing state — pair with `onSpeak` and a real speech engine. */
  speaking?: boolean
  /** Uncontrolled simulated playback length in ms. Default: ~380 ms per word, min 2.6 s. */
  speakDuration?: number
  /** Dim the bar until the message (`group/message`), the bar or its focus is active. */
  quiet?: boolean
  /** Override any user-facing string; unset keys keep the English default. */
  labels?: Partial<MessageActionsLabels>
}

function toCount(versions: MessageActionsProps["versions"]) {
  const n = Array.isArray(versions) ? versions.length : typeof versions === "number" ? versions : 1
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1
}

function clampIndex(index: number, count: number) {
  return Number.isFinite(index) ? Math.min(Math.max(Math.floor(index), 0), count - 1) : count - 1
}

function fmt(template: string, current: number, total: number) {
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total))
}

// Cross-fades between two glyphs (copy → check, speaker → equalizer).
function Morph({ on, from, to }: { on: boolean; from: React.ReactNode; to: React.ReactNode }) {
  const layer =
    "absolute inset-0 grid place-items-center transition-[opacity,transform,filter] duration-200 motion-reduce:transition-none"
  const away = "scale-[.6] opacity-0 blur-[2px]"
  return (
    <span aria-hidden className="relative block size-4">
      <span className={cn(layer, on && away)}>{from}</span>
      <span className={cn(layer, !on && away)}>{to}</span>
    </span>
  )
}

function Equalizer() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
      {[2, 5.5, 9, 12.5].map(x => (
        <rect key={x} x={x} y={2} width={1.5} height={12} rx={0.75} className="gf-message-actions-bar" />
      ))}
    </svg>
  )
}

interface ActionButtonProps extends React.ComponentProps<"button"> {
  /** Accessible name. */
  label: string
  /** Tooltip text, when it differs from `label`. */
  tip?: string
  tone?: "success" | "primary"
  /** Hold the tooltip open (the copy confirmation). */
  forceTip?: boolean
}

function ActionButton({ label, tip, tone, forceTip, className, children, ...props }: ActionButtonProps) {
  const [hover, setHover] = React.useState(false)
  return (
    <Tooltip delayDuration={380} open={forceTip || hover} onOpenChange={setHover}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-[color,background-color,transform] duration-150 active:scale-90 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-pressed:bg-muted aria-pressed:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none pointer-coarse:size-9",
            tone === "success" && "text-success hover:text-success",
            tone === "primary" && "text-primary hover:text-primary aria-pressed:bg-primary-soft aria-pressed:text-primary",
            className,
          )}
          {...props}
          data-slot="message-actions-button"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{tip ?? label}</TooltipContent>
    </Tooltip>
  )
}

function MessageActions({
  text,
  actions = ACTION_ORDER,
  versions,
  version,
  defaultVersion,
  onVersionChange,
  onCopy,
  onRegenerate,
  regenerating = false,
  onFeedback,
  reasons = DEFAULT_REASONS,
  onSpeak,
  speaking,
  speakDuration,
  quiet = true,
  labels,
  className,
  ...props
}: MessageActionsProps) {
  const L = { ...DEFAULT_LABELS, ...labels }
  const list = Array.isArray(actions)
    ? [...new Set(actions)].filter(a => ACTION_ORDER.includes(a))
    : ACTION_ORDER
  const reasonList = Array.isArray(reasons) ? reasons : []
  const hasForm = list.includes("feedback") && reasonList.length > 0
  const uid = React.useId()
  const formId = `${uid}-form`
  const titleId = `${uid}-title`

  // ── live region ──
  const [status, setStatus] = React.useState("")
  const flip = React.useRef(false)
  // A trailing nbsp on alternate calls makes an identical message re-announce.
  const announce = React.useCallback((message: string) => {
    flip.current = !flip.current
    setStatus(message + (flip.current ? " " : ""))
  }, [])

  // ── versions ──
  const count = toCount(versions)
  const versionControlled = version !== undefined
  const [internalVersion, setInternalVersion] = React.useState(() =>
    defaultVersion === undefined ? count - 1 : clampIndex(defaultVersion, count),
  )
  const index = clampIndex(versionControlled ? version : internalVersion, count)
  const showPager = count > 1

  // ── feedback ──
  const [votes, setVotes] = React.useState<Record<number, MessageActionsVote | undefined>>({})
  const vote = votes[index] ?? null
  const [formOpen, setFormOpen] = React.useState(false)
  const [reason, setReason] = React.useState<string | null>(null)
  const [freeText, setFreeText] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const downRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const restoreFocus = React.useRef(false)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // A new answer arrived: jump to it and drop any open form (each version keeps its own vote).
  const [prevCount, setPrevCount] = React.useState(count)
  if (prevCount !== count) {
    setPrevCount(count)
    if (count > prevCount) setInternalVersion(count - 1)
    setFormOpen(false)
  }

  function closeForm(restore: boolean) {
    clearTimeout(closeTimer.current)
    restoreFocus.current = restore
    setFormOpen(false)
  }

  // ── copy ──
  const [copied, setCopied] = React.useState(false)
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function handleCopy() {
    try {
      // The Clipboard API may be missing (insecure context) or reject — the confirmation still shows.
      if (text !== undefined) navigator.clipboard?.writeText(text)?.catch(() => {})
    } catch {}
    onCopy?.(text)
    setCopied(true)
    announce(L.copied)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(false), 1600)
  }

  // ── regenerate ──
  const [spinKey, setSpinKey] = React.useState(0)

  function handleRegenerate() {
    if (regenerating) return
    setSpinKey(k => k + 1)
    onRegenerate?.()
    announce(L.regenerateStarted)
  }

  function step(delta: number) {
    const next = clampIndex(index + delta, count)
    if (next === index) return
    if (!versionControlled) setInternalVersion(next)
    closeForm(false)
    onVersionChange?.(next)
    announce(fmt(L.versionOf, next + 1, count))
  }

  // ── vote ──
  function setVote(next: MessageActionsVote | null) {
    setVotes(v => ({ ...v, [index]: next ?? undefined }))
  }

  function handleUp() {
    closeForm(false)
    if (vote === "up") {
      setVote(null)
      onFeedback?.(null)
      announce(L.voteWithdrawn)
      return
    }
    setVote("up")
    onFeedback?.("up")
    announce(L.thumbsUpAnnounce)
  }

  function handleDown() {
    if (vote === "down") {
      closeForm(false)
      setVote(null)
      onFeedback?.(null)
      announce(L.voteWithdrawn)
      return
    }
    setVote("down")
    onFeedback?.("down")
    if (hasForm) {
      restoreFocus.current = false
      setReason(null)
      setFreeText("")
      setSent(false)
      setFormOpen(true)
      announce(L.thumbsDownAnnounce)
    } else {
      announce(L.thumbsDownMarked)
    }
  }

  const selected = reasonList.find(r => r.value === reason)

  function submit() {
    if (!selected || sent) return
    const detail = selected.freeText ? freeText.trim() : ""
    setSent(true)
    onFeedback?.("down", selected.value, detail || undefined)
    announce(L.feedbackThanksAnnounce)
    const quick = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    closeTimer.current = setTimeout(
      () => closeForm(!!contentRef.current?.contains(document.activeElement)),
      quick ? 1200 : 1500,
    )
  }

  // ── read aloud ──
  const speakControlled = speaking !== undefined
  const [speakInternal, setSpeakInternal] = React.useState(false)
  const playing = speakControlled ? speaking : speakInternal
  const onSpeakRef = React.useRef(onSpeak)
  React.useEffect(() => {
    onSpeakRef.current = onSpeak
  })
  const words = text ? text.trim().split(/\s+/).length : 0
  const duration =
    typeof speakDuration === "number" && speakDuration > 0 ? speakDuration : Math.max(2600, words * 380)
  const finishedText = L.speakFinished

  // Depends on state, not on the onSpeak identity, so a new callback never restarts playback.
  React.useEffect(() => {
    if (speakControlled || !speakInternal) return
    const id = setTimeout(() => {
      setSpeakInternal(false)
      onSpeakRef.current?.(false)
      announce(finishedText)
    }, duration)
    return () => clearTimeout(id)
  }, [speakControlled, speakInternal, duration, finishedText, announce])

  function handleSpeak() {
    const next = !playing
    if (!speakControlled) {
      setSpeakInternal(next)
      announce(next ? L.speakStarted : L.speakStopped)
    }
    onSpeak?.(next)
  }

  React.useEffect(
    () => () => {
      clearTimeout(copyTimer.current)
      clearTimeout(closeTimer.current)
    },
    [],
  )

  const active = copied || (hasForm && formOpen) || playing || regenerating

  function renderAction(action: MessageActionsAction) {
    switch (action) {
      case "copy":
        return (
          <ActionButton
            key="copy"
            label={copied ? L.copied : L.copy}
            tone={copied ? "success" : undefined}
            forceTip={copied}
            onClick={handleCopy}
          >
            <Morph on={copied} from={<Copy className="size-4" />} to={<Check className="size-4" />} />
          </ActionButton>
        )
      case "regenerate":
        return (
          <span key="regenerate" data-slot="message-actions-regenerate" className="flex items-center">
            <ActionButton
              label={L.regenerate}
              tip={regenerating ? L.regenerating : undefined}
              tone={regenerating ? "primary" : undefined}
              aria-busy={regenerating || undefined}
              onClick={handleRegenerate}
            >
              <RefreshCw
                key={spinKey}
                aria-hidden
                className={cn(
                  "size-4",
                  regenerating ? "gf-message-actions-spin-loop" : spinKey > 0 && "gf-message-actions-spin",
                )}
              />
            </ActionButton>
            {/* Grid 0fr → 1fr animates the pager's natural width without measuring it. */}
            <div
              data-slot="message-actions-pager"
              role="group"
              aria-label={L.versionGroup}
              inert={!showPager}
              className={cn(
                "grid transition-[grid-template-columns,opacity] duration-300 motion-reduce:transition-none",
                showPager ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
              )}
            >
              <div className="flex min-w-0 items-center overflow-hidden">
                <ActionButton
                  label={L.previousVersion}
                  disabled={index <= 0}
                  onClick={() => step(-1)}
                  className="size-6 focus-visible:ring-inset"
                >
                  <ChevronLeft aria-hidden className="size-3.5" />
                </ActionButton>
                <span
                  data-slot="message-actions-counter"
                  className="px-0.5 text-xs whitespace-nowrap text-muted-foreground tabular-nums"
                >
                  <span aria-hidden>
                    {index + 1} / {count}
                  </span>
                  <span className="sr-only">{fmt(L.versionOf, index + 1, count)}</span>
                </span>
                <ActionButton
                  label={L.nextVersion}
                  disabled={index >= count - 1}
                  onClick={() => step(1)}
                  className="size-6 focus-visible:ring-inset"
                >
                  <ChevronRight aria-hidden className="size-3.5" />
                </ActionButton>
              </div>
            </div>
          </span>
        )
      case "feedback": {
        const down = (
          <ActionButton
            ref={downRef}
            label={L.thumbsDown}
            aria-pressed={vote === "down"}
            aria-haspopup={hasForm ? "dialog" : undefined}
            aria-expanded={hasForm ? formOpen : undefined}
            aria-controls={hasForm && formOpen ? formId : undefined}
            onClick={handleDown}
          >
            <ThumbsDown
              key={vote === "down" ? "on" : "off"}
              aria-hidden
              className={cn("size-4", vote === "down" && "gf-message-actions-pop fill-current")}
            />
          </ActionButton>
        )
        return (
          <React.Fragment key="feedback">
            <ActionButton
              label={L.thumbsUp}
              tip={vote === "up" ? L.thumbsUpThanks : undefined}
              aria-pressed={vote === "up"}
              onClick={handleUp}
            >
              <ThumbsUp
                key={vote === "up" ? "on" : "off"}
                aria-hidden
                className={cn("size-4", vote === "up" && "gf-message-actions-pop fill-current")}
              />
            </ActionButton>
            {hasForm ? (
              <Popover
                open={formOpen}
                onOpenChange={open => {
                  if (!open) closeForm(restoreFocus.current)
                }}
              >
                <PopoverAnchor asChild>{down}</PopoverAnchor>
                <PopoverContent
                  ref={contentRef}
                  side="top"
                  align="start"
                  aria-labelledby={titleId}
                  className="w-80 max-w-[calc(100vw-2rem)] p-3"
                  onOpenAutoFocus={e => {
                    e.preventDefault()
                    contentRef.current
                      ?.querySelector<HTMLElement>('[data-slot="message-actions-reason"]')
                      ?.focus()
                  }}
                  onCloseAutoFocus={e => {
                    // No Popover.Trigger here, so return focus to the thumb ourselves — but only
                    // when the user closed from inside, never after clicking elsewhere.
                    e.preventDefault()
                    if (restoreFocus.current) downRef.current?.focus()
                    restoreFocus.current = false
                  }}
                  onEscapeKeyDown={() => {
                    restoreFocus.current = true
                  }}
                  onInteractOutside={e => {
                    // The thumb's own click handler withdraws the vote and closes the form.
                    if (downRef.current?.contains(e.target as Node)) e.preventDefault()
                  }}
                >
                  <div id={formId} data-slot="message-actions-feedback" className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        id={titleId}
                        data-slot="message-actions-feedback-title"
                        className="text-sm leading-7 font-medium text-foreground"
                      >
                        {L.feedbackTitle}
                      </p>
                      <button
                        type="button"
                        data-slot="message-actions-feedback-close"
                        aria-label={L.feedbackClose}
                        onClick={() => closeForm(true)}
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none pointer-coarse:size-9"
                      >
                        <X aria-hidden className="size-4" />
                      </button>
                    </div>
                    <div data-slot="message-actions-reasons" className="flex flex-wrap gap-1.5">
                      {reasonList.map(r => {
                        const on = r.value === reason
                        return (
                          <button
                            key={r.value}
                            type="button"
                            data-slot="message-actions-reason"
                            aria-pressed={on}
                            disabled={sent}
                            title={r.label}
                            dir="auto"
                            onClick={() => setReason(on ? null : r.value)}
                            className={cn(
                              "max-w-full truncate rounded-full border px-2.5 py-1 text-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none pointer-coarse:py-2",
                              on
                                ? "border-primary bg-primary-soft text-primary-soft-foreground disabled:opacity-100"
                                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {r.label}
                          </button>
                        )
                      })}
                    </div>
                    {selected?.freeText && (
                      <input
                        type="text"
                        data-slot="message-actions-feedback-text"
                        dir="auto"
                        value={freeText}
                        disabled={sent}
                        placeholder={L.feedbackPlaceholder}
                        aria-label={L.feedbackTextName}
                        onChange={e => setFreeText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault()
                            submit()
                          }
                        }}
                        className="h-8 w-full rounded-md border bg-background px-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60 pointer-coarse:h-9"
                      />
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        data-slot="message-actions-feedback-submit"
                        disabled={!reason || sent}
                        onClick={submit}
                        className={cn(
                          "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none pointer-coarse:h-9",
                          sent
                            ? "bg-success-soft text-success-soft-foreground disabled:opacity-100"
                            : "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}
                      >
                        {sent && <Check aria-hidden className="size-4" />}
                        {sent ? L.feedbackSent : L.feedbackSubmit}
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              down
            )}
          </React.Fragment>
        )
      }
      case "speak":
        return (
          <ActionButton
            key="speak"
            label={playing ? L.stopSpeaking : L.speak}
            tone={playing ? "primary" : undefined}
            aria-pressed={playing}
            onClick={handleSpeak}
          >
            <Morph on={playing} from={<Volume2 className="size-4" />} to={<Equalizer />} />
          </ActionButton>
        )
    }
  }

  return (
    <>
      <style href="gf-message-actions" precedence="low">{MESSAGE_ACTIONS_CSS}</style>
      <div
        data-slot="message-actions"
        role="group"
        aria-label={L.group}
        className={cn(
          "flex w-fit flex-wrap items-center gap-0.5 transition-opacity duration-200 motion-reduce:transition-none",
          // Dimmed, never hidden: hover on the bar, on the whole `group/message`, or focus inside restores it.
          quiet &&
            !active &&
            "opacity-60 focus-within:opacity-100 hover:opacity-100 group-focus-within/message:opacity-100 group-hover/message:opacity-100 pointer-coarse:opacity-100",
          className,
        )}
        {...props}
      >
        {list.map(renderAction)}
        <div
          data-slot="message-actions-status"
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {status}
        </div>
      </div>
    </>
  )
}

export { MessageActions }

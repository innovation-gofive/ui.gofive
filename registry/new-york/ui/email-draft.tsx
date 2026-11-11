"use client"

import * as React from "react"
import { Check, Paperclip, Pencil, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./avatar"
import { Button } from "./button"
import { Input } from "./input"
import { Tag, type TagColor } from "./tag-badge"
import { Textarea } from "./textarea"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colors come from utilities in the markup; only motion lives here.
const EMAIL_DRAFT_CSS = `
  .gf-email-draft-glide[data-armed]{transition:height 360ms cubic-bezier(.22,1,.36,1);}
  .gf-email-draft-enter{animation:gf-email-draft-in 320ms ease-out both;}
  @keyframes gf-email-draft-in{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:none;}}
  .gf-email-draft-caret{display:inline-block;width:2px;height:1.05em;margin-inline-start:2px;vertical-align:text-bottom;background:currentColor;animation:gf-email-draft-blink 1s steps(2,start) infinite;}
  @keyframes gf-email-draft-blink{to{visibility:hidden;}}
  @media (prefers-reduced-motion: reduce){
    .gf-email-draft-glide[data-armed]{transition:none;}
    .gf-email-draft-enter{animation:none;}
    .gf-email-draft-caret{animation:none;}
  }
`

// ── Types ──────────────────────────────────────────────────────────
export type EmailDraftPhase = "draft" | "sending" | "sent" | "discarded"

export interface EmailRecipient {
  email: string
  /** Display name; the address is shown when omitted. */
  name?: string
}

export interface EmailDraftPayload {
  to: EmailRecipient[]
  subject: string
  body: string
  /** The attachment still on the draft, or `null` if none / removed. */
  attachment: string | null
}

export interface EmailDraftLabels {
  to: string
  subject: string
  subjectPlaceholder: string
  bodyPlaceholder: string
  /** Accessible name of the body field. */
  body: string
  /** Placeholder and accessible name of the add-recipient field. */
  addRecipient: string
  /** Verb prefix of the remove-recipient button name ("Remove" + name). */
  removeRecipient: string
  invalidRecipient: string
  edit: string
  doneEditing: string
  clickToEdit: string
  /** Verb prefix of the add-back attachment button ("Attach" + file). */
  attach: string
  /** Verb prefix of the remove-attachment button ("Remove" + file). */
  removeAttachment: string
  send: string
  sending: string
  discard: string
  undo: string
  stateWriting: string
  stateReady: string
  stateSent: string
  stateDiscarded: string
  /** Visible hint for the send shortcut; also the Send button's description. */
  sendHint: string
  sendError: string
  /** Receipt text after sending. `recipients` is a comma-joined list. */
  sentMessage: (info: { recipients: string; attachment: string | null }) => string
  discardedMessage: string
}

const DEFAULT_LABELS: EmailDraftLabels = {
  to: "To",
  subject: "Subject",
  subjectPlaceholder: "Add a subject",
  bodyPlaceholder: "Nothing written yet",
  body: "Email body",
  addRecipient: "Add recipient",
  removeRecipient: "Remove",
  invalidRecipient: "Not a valid email address",
  edit: "Edit",
  doneEditing: "Done",
  clickToEdit: "Tap to change",
  attach: "Attach",
  removeAttachment: "Remove",
  send: "Send",
  sending: "Sending…",
  discard: "Discard",
  undo: "Undo",
  stateWriting: "Drafting…",
  stateReady: "Awaiting your review",
  stateSent: "Sent",
  stateDiscarded: "Removed",
  sendHint: "Ctrl + Enter to send",
  sendError: "Couldn't send. Please try again.",
  sentMessage: ({ recipients, attachment }) =>
    `Sent to ${recipients}${attachment ? ` with ${attachment}` : ""}`,
  discardedMessage: "Draft removed",
}

// ── Helpers ────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/
const isValidEmail = (email: string) => EMAIL_RE.test(email)
const displayName = (r: EmailRecipient) => r.name?.trim() || r.email

function initialsOf(r: EmailRecipient) {
  const words = displayName(r).match(/[\p{L}\p{N}]+/gu) ?? []
  return (
    words
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?"
  )
}

/** value/defaultValue + onChange in one place. */
function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [internal, setInternal] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const set = (next: T) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }
  return [current, set] as const
}

// Height glides to the measured content height. The transition is only armed
// after first paint, so mounting never animates.
function SmoothHeight({ children }: { children: React.ReactNode }) {
  const innerRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number>()
  const [armed, setArmed] = React.useState(false)

  React.useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const measure = () => setHeight(el.getBoundingClientRect().height)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const frame = requestAnimationFrame(() => setArmed(true))
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      data-slot="email-draft-glide"
      data-armed={armed || undefined}
      style={{ height }}
      className="gf-email-draft-glide overflow-hidden"
    >
      <div ref={innerRef}>{children}</div>
    </div>
  )
}

// ── EmailDraft ─────────────────────────────────────────────────────
export interface EmailDraftProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Controlled recipients (to). */
  recipients?: EmailRecipient[]
  defaultRecipients?: EmailRecipient[]
  onRecipientsChange?: (recipients: EmailRecipient[]) => void
  subject?: string
  defaultSubject?: string
  onSubjectChange?: (subject: string) => void
  body?: string
  defaultBody?: string
  onBodyChange?: (body: string) => void
  /** The agent is still writing: shows a caret, disables edit and send. */
  streaming?: boolean
  /** Name of the agent that wrote the draft. */
  agent?: string
  /** Proposed attachment file name. Removable and re-attachable. */
  attachment?: string | null
  /** Controlled lifecycle phase; pair with `onPhaseChange`. */
  phase?: EmailDraftPhase
  defaultPhase?: EmailDraftPhase
  onPhaseChange?: (phase: EmailDraftPhase) => void
  /**
   * Called on Send. The card stays in `sending` until the returned promise
   * settles; a rejection returns to `draft` with an error.
   */
  onSend?: (email: EmailDraftPayload) => void | Promise<void>
  onDiscard?: () => void
  /** Called when Undo is pressed on the receipt. It does not recall a sent email. */
  onUndo?: (from: "sent" | "discarded") => void
  /** Externally supplied error (e.g. the stream failed), shown as an alert. */
  error?: React.ReactNode
  /** Override any of the user-facing strings. */
  labels?: Partial<EmailDraftLabels>
}

function EmailDraft({
  recipients: recipientsProp,
  defaultRecipients = [],
  onRecipientsChange,
  subject: subjectProp,
  defaultSubject = "",
  onSubjectChange,
  body: bodyProp,
  defaultBody = "",
  onBodyChange,
  streaming = false,
  agent,
  attachment = null,
  phase: phaseProp,
  defaultPhase = "draft",
  onPhaseChange,
  onSend,
  onDiscard,
  onUndo,
  error,
  labels: labelsProp,
  className,
  onKeyDown,
  ...props
}: EmailDraftProps) {
  const L = { ...DEFAULT_LABELS, ...labelsProp }
  const uid = React.useId()
  const hintId = `${uid}-hint`

  const [recipients, setRecipients] = useControllable(
    recipientsProp,
    defaultRecipients,
    onRecipientsChange,
  )
  const [subject, setSubject] = useControllable(subjectProp, defaultSubject, onSubjectChange)
  const [body, setBody] = useControllable(bodyProp, defaultBody, onBodyChange)
  const [phase, setPhase] = useControllable(phaseProp, defaultPhase, onPhaseChange)

  const [editingRaw, setEditing] = React.useState(false)
  const [attached, setAttached] = React.useState(true)
  const [pending, setPending] = React.useState("")
  const [sendFailed, setSendFailed] = React.useState(false)

  const subjectRef = React.useRef<HTMLInputElement>(null)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const sendRef = React.useRef<HTMLButtonElement>(null)
  const focusTarget = React.useRef<"subject" | "body">("body")
  const sendingRef = React.useRef(false)
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const isDraft = phase === "draft"
  const locked = phase === "sending"
  const editing = editingRaw && isDraft && !streaming
  const file = attachment && attached ? attachment : null

  // Move focus into the field the user chose when edit mode opens.
  React.useEffect(() => {
    if (!editing) return
    const el = focusTarget.current === "subject" ? subjectRef.current : bodyRef.current
    if (!el) return
    el.focus()
    const end = el.value.length
    el.setSelectionRange(end, end)
  }, [editing])

  // A failed send re-enables the form; put focus back on Send so keyboard users can retry.
  React.useEffect(() => {
    if (sendFailed && isDraft) sendRef.current?.focus()
  }, [sendFailed, isDraft])

  const canSend =
    isDraft &&
    !streaming &&
    recipients.length > 0 &&
    recipients.every((r) => isValidEmail(r.email)) &&
    pending.trim() === "" &&
    subject.trim() !== "" &&
    body.trim() !== ""

  const startEdit = (target: "subject" | "body", el: HTMLElement) => {
    if (!isDraft || streaming) return
    // Let users select text inside the field without flipping into edit mode.
    const sel = window.getSelection()
    if (sel && !sel.isCollapsed && el.contains(sel.anchorNode)) return
    focusTarget.current = target
    setEditing(true)
  }

  const send = async () => {
    if (!canSend || sendingRef.current) return
    sendingRef.current = true
    setEditing(false)
    setSendFailed(false)
    setPhase("sending")
    try {
      await onSend?.({ to: recipients, subject, body, attachment: file })
    } catch {
      sendingRef.current = false
      if (mountedRef.current) {
        setSendFailed(true)
        setPhase("draft")
      }
      return
    }
    sendingRef.current = false
    if (mountedRef.current) setPhase("sent")
  }

  const discard = () => {
    if (!isDraft) return
    setEditing(false)
    setPhase("discarded")
    onDiscard?.()
  }

  const undo = () => {
    if (phase !== "sent" && phase !== "discarded") return
    onUndo?.(phase)
    setPhase("draft")
  }

  // Recipients ──────────────────────────────────────────────────────
  const commit = (raw: string) => {
    const email = raw.replace(/[,;]+$/, "").trim()
    setPending("")
    if (!email) return
    if (recipients.some((r) => r.email.toLowerCase() === email.toLowerCase())) return
    setRecipients([...recipients, { email }])
  }

  const removeRecipient = (index: number) =>
    setRecipients(recipients.filter((_, i) => i !== index))

  // Badge ───────────────────────────────────────────────────────────
  const badge: { label: string; color: TagColor } = streaming && isDraft
    ? { label: L.stateWriting, color: "info" }
    : locked
      ? { label: L.sending, color: "info" }
      : phase === "sent"
        ? { label: L.stateSent, color: "success" }
        : phase === "discarded"
          ? { label: L.stateDiscarded, color: "neutral" }
          : { label: L.stateReady, color: "success" }

  const shownError = error ?? (sendFailed ? L.sendError : null)
  const receipt =
    phase === "sent"
      ? L.sentMessage({ recipients: recipients.map(displayName).join(", "), attachment: file })
      : L.discardedMessage
  const liveText =
    streaming && isDraft
      ? L.stateWriting
      : locked
        ? L.sending
        : phase === "sent" || phase === "discarded"
          ? receipt
          : ""

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      void send()
    } else if (e.key === "Escape" && editing) {
      e.stopPropagation()
      setEditing(false)
      toggleRef.current?.focus()
    }
  }

  return (
    <>
      <style href="gf-email-draft" precedence="low">{EMAIL_DRAFT_CSS}</style>
      <div
        data-slot="email-draft"
        data-phase={phase}
        data-streaming={streaming || undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "@container w-full max-w-[32rem] overflow-hidden rounded-xl border bg-card text-sm text-card-foreground shadow-xs",
          className,
        )}
        {...props}
      >
        <SmoothHeight>
          {/* Header: who wrote it + state */}
          <div
            data-slot="email-draft-header"
            className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2"
          >
            <span
              data-slot="email-draft-agent"
              dir="auto"
              title={agent}
              className="min-w-0 truncate text-xs font-medium text-muted-foreground"
            >
              {agent}
            </span>
            <Tag
              key={badge.label}
              data-slot="email-draft-badge"
              color={badge.color}
              size="sm"
              className="gf-email-draft-enter shrink-0"
            >
              {badge.label}
            </Tag>
          </div>

          <span data-slot="email-draft-live" aria-live="polite" className="sr-only">
            {liveText}
          </span>

          {isDraft || locked ? (
            <div
              key="card"
              data-slot="email-draft-card"
              className={cn(
                "gf-email-draft-enter transition-opacity duration-200 motion-reduce:transition-none",
                locked && "opacity-70",
              )}
            >
              <div inert={locked} className="divide-y">
                {/* To */}
                <div
                  data-slot="email-draft-to"
                  role="group"
                  aria-labelledby={`${uid}-to`}
                  className="flex flex-wrap items-center gap-1.5 px-4 py-2.5"
                >
                  <span id={`${uid}-to`} className="w-14 shrink-0 text-xs text-muted-foreground">
                    {L.to}
                  </span>
                  {recipients.map((r, i) => {
                    const valid = isValidEmail(r.email)
                    return (
                      <span
                        key={`${r.email}-${i}`}
                        data-slot="email-draft-recipient"
                        data-invalid={!valid || undefined}
                        title={valid ? r.email : `${r.email} — ${L.invalidRecipient}`}
                        className={cn(
                          "inline-flex h-7 max-w-full items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-1 text-xs font-medium",
                          valid
                            ? "bg-primary-soft text-primary-soft-foreground"
                            : "bg-danger-soft text-danger-soft-foreground",
                        )}
                      >
                        <Avatar size="xs" aria-hidden>
                          <AvatarFallback className="bg-card text-foreground">
                            {initialsOf(r)}
                          </AvatarFallback>
                        </Avatar>
                        <span dir="auto" className="min-w-0 truncate">
                          {displayName(r)}
                        </span>
                        {!valid && <span className="sr-only">{L.invalidRecipient}</span>}
                        <button
                          type="button"
                          aria-label={`${L.removeRecipient} ${displayName(r)}`}
                          onClick={() => removeRecipient(i)}
                          className="flex size-5 shrink-0 items-center justify-center rounded-full opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/60 pointer-coarse:size-7"
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </span>
                    )
                  })}
                  <input
                    data-slot="email-draft-recipient-input"
                    type="email"
                    value={pending}
                    aria-label={L.addRecipient}
                    placeholder={recipients.length === 0 ? L.addRecipient : ""}
                    onChange={(e) => {
                      const v = e.target.value
                      // A trailing comma or semicolon commits the address.
                      if (/[,;]$/.test(v)) commit(v)
                      else setPending(v)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !(e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        commit(pending)
                      } else if (e.key === "Backspace" && pending === "" && recipients.length > 0) {
                        removeRecipient(recipients.length - 1)
                      }
                    }}
                    onBlur={() => commit(pending)}
                    className="h-7 min-w-24 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>

                {/* Subject */}
                <div
                  data-slot="email-draft-subject"
                  className="flex items-center gap-1.5 px-4 py-2.5"
                >
                  <span className="w-14 shrink-0 text-xs text-muted-foreground">{L.subject}</span>
                  {editing ? (
                    <Input
                      ref={subjectRef}
                      inputSize="sm"
                      variant="underline"
                      dir="auto"
                      value={subject}
                      onValueChange={setSubject}
                      placeholder={L.subjectPlaceholder}
                      aria-label={L.subject}
                      containerClassName="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !(e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          bodyRef.current?.focus()
                        }
                      }}
                    />
                  ) : (
                    <div
                      dir="auto"
                      title={isDraft && !streaming ? L.clickToEdit : undefined}
                      onClick={(e) => startEdit("subject", e.currentTarget)}
                      className={cn(
                        "min-w-0 flex-1 break-words font-medium",
                        !subject && "font-normal text-muted-foreground",
                        isDraft && !streaming && "cursor-text",
                      )}
                    >
                      {subject || L.subjectPlaceholder}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div data-slot="email-draft-body" aria-busy={streaming || undefined} className="px-4 py-3">
                  {editing ? (
                    <Textarea
                      ref={bodyRef}
                      autoResize
                      rows={4}
                      dir="auto"
                      value={body}
                      onValueChange={setBody}
                      placeholder={L.bodyPlaceholder}
                      aria-label={L.body}
                    />
                  ) : (
                    <div
                      dir="auto"
                      title={isDraft && !streaming ? L.clickToEdit : undefined}
                      onClick={(e) => startEdit("body", e.currentTarget)}
                      className={cn(
                        "whitespace-pre-wrap break-words leading-relaxed",
                        !body && !streaming && "text-muted-foreground",
                        isDraft && !streaming && "cursor-text",
                      )}
                    >
                      {body || (streaming ? "" : L.bodyPlaceholder)}
                      {streaming && <span aria-hidden className="gf-email-draft-caret" />}
                    </div>
                  )}
                </div>

                {/* Attachment */}
                {attachment && (
                  <div data-slot="email-draft-attachment" className="flex items-center gap-2 px-4 py-2.5">
                    {file ? (
                      <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md border bg-background py-0.5 pl-2 pr-0.5 text-xs">
                        <Paperclip className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <span title={file} className="min-w-0 truncate">
                          {file}
                        </span>
                        <button
                          type="button"
                          aria-label={`${L.removeAttachment} ${file}`}
                          onClick={() => setAttached(false)}
                          className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 pointer-coarse:size-7"
                        >
                          <X className="size-3" aria-hidden />
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAttached(true)}
                        className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                      >
                        <Plus className="size-3.5 shrink-0" aria-hidden />
                        <span className="min-w-0 truncate">
                          {L.attach} {attachment}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {shownError && (
                <p
                  role="alert"
                  data-slot="email-draft-error"
                  className="border-t bg-danger-soft px-4 py-2 text-xs text-danger-soft-foreground"
                >
                  {shownError}
                </p>
              )}

              {/* Footer */}
              <div
                data-slot="email-draft-footer"
                className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Button
                    ref={toggleRef}
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={streaming || !isDraft}
                    onClick={() => {
                      focusTarget.current = "body"
                      setEditing(!editing)
                    }}
                    className="pointer-coarse:h-10"
                  >
                    {editing ? <Check aria-hidden /> : <Pencil aria-hidden />}
                    {editing ? L.doneEditing : L.edit}
                  </Button>
                  <span
                    id={hintId}
                    data-slot="email-draft-hint"
                    className="truncate text-xs text-muted-foreground @max-[26rem]:hidden"
                  >
                    {L.sendHint}
                  </span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={locked}
                    onClick={discard}
                    className="pointer-coarse:h-10"
                  >
                    {L.discard}
                  </Button>
                  <Button
                    ref={sendRef}
                    type="button"
                    size="sm"
                    loading={locked}
                    disabled={!canSend && !locked}
                    aria-describedby={hintId}
                    aria-keyshortcuts="Control+Enter Meta+Enter"
                    onClick={() => void send()}
                    className="pointer-coarse:h-10"
                  >
                    {locked ? L.sending : L.send}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              key="receipt"
              data-slot="email-draft-receipt"
              className="gf-email-draft-enter flex items-center gap-3 px-4 py-3"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  phase === "sent"
                    ? "bg-success-soft text-success-soft-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {phase === "sent" ? <Check className="size-4" /> : <X className="size-4" />}
              </span>
              <span
                dir="auto"
                title={receipt}
                className="min-w-0 flex-1 truncate"
              >
                {receipt}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={undo}
                className="pointer-coarse:h-10"
              >
                {L.undo}
              </Button>
            </div>
          )}
        </SmoothHeight>
      </div>
    </>
  )
}

export { EmailDraft }

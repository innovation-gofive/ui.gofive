"use client"

import * as React from "react"
import { Check, ChevronDown, RotateCcw, Send, User } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  type AvatarSize,
} from "./avatar"
import { Button } from "./button"
import { Textarea } from "./textarea"

// ── Motion CSS (React 19 hoists and de-duplicates by href) ──────────
// The fold uses the grid-row technique (0fr ↔ 1fr) so the replies glide open
// without measuring their height. Colours are all Tailwind token utilities on
// the elements themselves; this sheet only holds geometry and keyframes.
const COMMENT_THREAD_CSS = `
  .gf-comment-thread-fold{display:grid;grid-template-rows:1fr;transition:grid-template-rows 300ms cubic-bezier(.22,1,.36,1),opacity 220ms ease;}
  .gf-comment-thread-fold[data-open="false"]{grid-template-rows:0fr;opacity:0;}
  .gf-comment-thread-fold>.gf-comment-thread-fold-inner{min-height:0;overflow:hidden;padding:2px;margin:-2px;}
  .gf-comment-thread-rise{animation:gf-comment-thread-rise 360ms cubic-bezier(.22,1,.36,1) both;}
  @keyframes gf-comment-thread-rise{from{opacity:0;transform:translateY(6px);}}
  @media (prefers-reduced-motion: reduce){
    .gf-comment-thread-fold{transition:none;}
    .gf-comment-thread-rise{animation:none;}
  }
`

// ── Types ───────────────────────────────────────────────────────────
export interface CommentAuthor {
  name: string
  /** Image URL. Falls back to initials when missing or when it fails to load. */
  avatarSrc?: string
  /** Fully custom avatar node; takes precedence over `avatarSrc`. */
  avatar?: React.ReactNode
}

export interface CommentThreadEntry {
  /** Must be unique inside the thread — used as the list key. */
  id: string
  author: CommentAuthor
  body: React.ReactNode
  /** Caller-formatted label such as "2 min ago". Never computed by the component. */
  time: string
  /** Optional machine-readable timestamp (ISO 8601). Ignored when it is not a valid date. */
  dateTime?: string
}

export interface CommentThreadLabels {
  /** Accessible name of the thread landmark. */
  thread: string
  resolve: string
  reopen: string
  /** Visible status shown on a resolved thread. */
  resolved: string
  showReplies: (count: number) => string
  hideReplies: (count: number) => string
  /** Accessible name of the reply field. */
  replyLabel: string
  replyPlaceholder: string
  /** Submit button text. */
  send: string
  /** Describes the keyboard shortcut; also wired to the field via aria-describedby. */
  shortcutHint: string
  /** Shown when `onReply` rejects; the draft is kept. */
  error: string
}

const DEFAULT_LABELS: CommentThreadLabels = {
  thread: "Comment thread",
  resolve: "Resolve",
  reopen: "Reopen",
  resolved: "Resolved",
  showReplies: (n) => `Show ${n} ${n === 1 ? "reply" : "replies"}`,
  hideReplies: (n) => `Hide ${n} ${n === 1 ? "reply" : "replies"}`,
  replyLabel: "Reply",
  replyPlaceholder: "Write a reply…",
  send: "Reply",
  shortcutHint: "Ctrl or ⌘ + Enter to send",
  error: "Your reply could not be sent. Please try again.",
}

export interface CommentThreadProps
  extends Omit<React.ComponentProps<"section">, "children"> {
  /** The root comment. */
  comment: CommentThreadEntry
  /** Replies, one level deep, oldest first. */
  replies?: CommentThreadEntry[]
  /** Resolved state is owned by the caller — flip it from `onResolve`. */
  resolved?: boolean
  /** Shows the resolve / reopen action on the root comment when provided. */
  onResolve?: () => void
  /**
   * Shows the reply composer when provided. Called with the trimmed text.
   * Return a promise to show a pending state; a rejection keeps the draft and
   * shows `labels.error`. The draft is cleared once the call succeeds.
   */
  onReply?: (text: string) => void | Promise<void>
  /** Controlled collapsed state of the replies group. */
  collapsed?: boolean
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Override any of the English default strings. */
  labels?: Partial<CommentThreadLabels>
}

// ── Helpers ─────────────────────────────────────────────────────────
// First letter or digit of the first two words; skips emoji and punctuation.
function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
    .join("")
    .toLocaleUpperCase()
}

function validDateTime(value?: string) {
  return value && !Number.isNaN(Date.parse(value)) ? value : undefined
}

// ── Avatar ──────────────────────────────────────────────────────────
function CommentAvatar({
  author,
  size = "sm",
}: {
  author: CommentAuthor
  size?: AvatarSize
}) {
  if (author.avatar) return <>{author.avatar}</>
  const initials = initialsOf(author.name)
  return (
    // Decorative: the author name always sits beside the avatar.
    <Avatar size={size} aria-hidden data-slot="comment-thread-avatar">
      {author.avatarSrc && <AvatarImage src={author.avatarSrc} alt="" />}
      <AvatarFallback>
        {initials || <User className="size-1/2" aria-hidden />}
      </AvatarFallback>
    </Avatar>
  )
}

// ── One comment (root or reply) ─────────────────────────────────────
function CommentEntry({
  entry,
  root = false,
  resolved = false,
  action,
}: {
  entry: CommentThreadEntry
  root?: boolean
  resolved?: boolean
  action?: React.ReactNode
}) {
  return (
    <article
      data-slot={root ? "comment-thread-comment" : "comment-thread-reply"}
      data-resolved={root && resolved ? "" : undefined}
      className="flex min-w-0 gap-2.5"
    >
      <CommentAvatar author={entry.author} size={root ? "sm" : "xs"} />
      <div className="min-w-0 flex-1">
        <div
          data-slot="comment-thread-meta"
          className="flex min-h-6 flex-wrap items-center gap-x-2"
        >
          <span
            data-slot="comment-thread-author"
            dir="auto"
            title={entry.author.name}
            className="min-w-0 max-w-full truncate text-sm font-medium text-foreground"
          >
            {entry.author.name}
          </span>
          <time
            data-slot="comment-thread-time"
            dateTime={validDateTime(entry.dateTime)}
            className="shrink-0 text-xs tabular-nums text-muted-foreground"
          >
            {entry.time}
          </time>
          {action}
        </div>
        <div
          data-slot="comment-thread-body"
          dir="auto"
          className={cn(
            "mt-0.5 whitespace-pre-wrap break-words text-start text-sm leading-relaxed [overflow-wrap:anywhere]",
            root && resolved ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {entry.body}
        </div>
      </div>
    </article>
  )
}

// ── CommentThread ───────────────────────────────────────────────────
function CommentThread({
  comment,
  replies = [],
  resolved = false,
  onResolve,
  onReply,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  labels: labelsProp,
  className,
  ...props
}: CommentThreadProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const uid = React.useId()
  const repliesId = `${uid}-replies`
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`

  // collapsed: controlled or uncontrolled
  const isControlled = collapsed !== undefined
  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed)
  const isCollapsed = isControlled ? collapsed : innerCollapsed
  const toggleCollapsed = () => {
    const next = !isCollapsed
    if (!isControlled) setInnerCollapsed(next)
    onCollapsedChange?.(next)
  }

  // composer
  const [draft, setDraft] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const canSend = draft.trim().length > 0 && !pending

  async function submit() {
    const text = draft.trim()
    if (!text || pending || !onReply) return
    setFailed(false)
    try {
      const result = onReply(text)
      if (result) {
        setPending(true)
        await result
      }
      // Keep anything the user typed while the request was in flight.
      setDraft((d) => (d.trim() === text ? "" : d))
    } catch {
      setFailed(true)
    } finally {
      setPending(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Plain Enter inserts a newline; IME composition (Thai, Japanese…) never submits.
    if (e.nativeEvent.isComposing || e.key !== "Enter") return
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      void submit()
    }
  }

  const count = replies.length

  return (
    <section
      data-slot="comment-thread"
      data-resolved={resolved ? "" : undefined}
      aria-label={labels.thread}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground",
        className,
      )}
      {...props}
    >
      <style href="gf-comment-thread" precedence="low">
        {COMMENT_THREAD_CSS}
      </style>

      <CommentEntry
        entry={comment}
        root
        resolved={resolved}
        action={
          <span className="ms-auto flex shrink-0 flex-wrap items-center gap-1.5">
            {resolved && (
              <span
                data-slot="comment-thread-status"
                className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success-soft-foreground"
              >
                <Check className="size-3" aria-hidden />
                {labels.resolved}
              </span>
            )}
            {onResolve && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-slot="comment-thread-resolve"
                onClick={onResolve}
                className="h-7 px-2 text-xs text-muted-foreground"
              >
                {resolved ? <RotateCcw /> : <Check />}
                {resolved ? labels.reopen : labels.resolve}
              </Button>
            )}
          </span>
        }
      />

      {count > 0 && (
        <div className="ms-3 flex flex-col gap-2 border-s-2 border-border ps-4">
          <button
            type="button"
            data-slot="comment-thread-toggle"
            aria-expanded={!isCollapsed}
            aria-controls={repliesId}
            onClick={toggleCollapsed}
            className="-ms-1 inline-flex w-fit items-center gap-2 rounded-md px-1 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <ChevronDown
              aria-hidden
              className={cn(
                "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
                !isCollapsed && "rotate-180",
              )}
            />
            {isCollapsed && (
              <AvatarGroup size="xs" max={3} aria-hidden>
                {replies.map((r) => (
                  <CommentAvatar key={r.id} author={r.author} size="xs" />
                ))}
              </AvatarGroup>
            )}
            {isCollapsed ? labels.showReplies(count) : labels.hideReplies(count)}
          </button>

          <div
            id={repliesId}
            data-slot="comment-thread-replies"
            data-open={!isCollapsed}
            // Closed content is removed from the tab order and the a11y tree.
            inert={isCollapsed}
            aria-live="polite"
            aria-relevant="additions"
            className="gf-comment-thread-fold"
          >
            <div className="gf-comment-thread-fold-inner">
              <ul className="flex flex-col gap-3 pb-1">
                {replies.map((r) => (
                  <li key={r.id} className="gf-comment-thread-rise">
                    <CommentEntry entry={r} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {onReply && (
        <form
          data-slot="comment-thread-composer"
          aria-busy={pending || undefined}
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
          className="flex flex-col gap-2"
        >
          <Textarea
            value={draft}
            onValueChange={(v) => {
              setDraft(v)
              setFailed(false)
            }}
            onKeyDown={onKeyDown}
            autoResize
            rows={2}
            placeholder={labels.replyPlaceholder}
            aria-label={labels.replyLabel}
            aria-describedby={failed ? `${hintId} ${errorId}` : hintId}
            aria-invalid={failed || undefined}
            state={failed ? "error" : undefined}
            className="max-h-48 min-h-10 resize-none overflow-y-auto"
          />
          {failed && (
            <p
              id={errorId}
              role="alert"
              data-slot="comment-thread-error"
              className="text-xs text-danger-soft-foreground"
            >
              {labels.error}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <span
              id={hintId}
              data-slot="comment-thread-hint"
              className="min-w-0 text-xs text-muted-foreground"
            >
              {labels.shortcutHint}
            </span>
            <Button
              type="submit"
              size="sm"
              data-slot="comment-thread-submit"
              disabled={!canSend}
              loading={pending}
            >
              {!pending && <Send />}
              {labels.send}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}

export { CommentThread }

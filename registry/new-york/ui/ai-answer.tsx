"use client"

import * as React from "react"
import { ChevronUp, CornerDownRight, Globe, Square } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { MessageActions } from "./message-actions"
import type { MessageActionsAction, MessageActionsProps } from "./message-actions"
import { Popover, PopoverAnchor, PopoverContent } from "./popover"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours come from theme-token utilities on the elements, never from this sheet.
const AI_ANSWER_CSS = `
  .gf-ai-answer-cursor{animation:gf-ai-answer-blink 1s steps(1,end) infinite;}
  @keyframes gf-ai-answer-blink{0%,55%{opacity:1;}56%,100%{opacity:0;}}
  .gf-ai-answer-in{animation:gf-ai-answer-in .32s cubic-bezier(.22,1,.36,1) backwards;}
  @keyframes gf-ai-answer-in{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){
    .gf-ai-answer-cursor{animation:none;opacity:1;}
    .gf-ai-answer-in{animation:none;}
  }
`

// ── Types ──────────────────────────────────────────────────────────

export interface AIAnswerSource {
  /** Stable key; falls back to the index. */
  id?: string
  title: string
  /** Site or publisher name shown on the card. */
  site: string
  /** Text on the citation chip; defaults to `site`. */
  shortName?: string
  /** Leading glyph on the card; defaults to a globe. */
  icon?: React.ReactNode
  /** Makes the card (and the preview's "open" link) a real link. */
  href?: string
  /** Excerpt shown in the citation preview. */
  snippet?: string
}

export interface AIAnswerLabels {
  /** Accessible name of the sources group. */
  sources: string
  /** Name of the "+N" tile. */
  showMore: (count: number) => string
  showLess: string
  /** Accessible name of a citation chip. */
  citation: (n: number, name: string) => string
  openSource: string
  stop: string
  generating: string
  ready: string
  stopped: string
  /** Accessible name of the follow-up group. */
  followUps: string
  /** Heading above the numbered source list in copied text. */
  copySources: string
}

const DEFAULT_LABELS: AIAnswerLabels = {
  sources: "Sources",
  showMore: (n) => `Show ${n} more ${n === 1 ? "source" : "sources"}`,
  showLess: "Show fewer",
  citation: (n, name) => `Source ${n}: ${name}`,
  openSource: "Open source",
  stop: "Stop",
  generating: "Generating answer…",
  ready: "Answer ready.",
  stopped: "Generation stopped.",
  followUps: "Related questions",
  copySources: "Sources",
}

// ── Markup parser (paragraphs, "- " lists, **bold**, [n] citations) ──

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] }

function parseBlocks(src: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of src.replace(/\r\n?/g, "\n").split(/\n{2,}/)) {
    let para: string[] = []
    let list: string[] = []
    const flush = () => {
      if (para.length) blocks.push({ type: "p", text: para.join(" ") })
      if (list.length) blocks.push({ type: "ul", items: list })
      para = []
      list = []
    }
    for (const raw of chunk.split("\n")) {
      const line = raw.trim()
      if (!line) continue
      const item = /^- +(.*)$/.exec(line)
      if (item) {
        if (para.length) flush()
        list.push(item[1])
      } else {
        if (list.length) flush()
        para.push(line)
      }
    }
    flush()
  }
  return blocks
}

const CITE = String.raw`\[(?<c>\d{1,3})\]`
const BOLD = String.raw`\*\*(?<b>.+?)\*\*`
// While text is still arriving, an unclosed ** bolds up to the end.
const BOLD_OPEN = String.raw`\*\*(?<b>.+?)(?:\*\*|$)`

function inline(
  text: string,
  partial: boolean,
  cite: (n: number, key: string) => React.ReactNode,
  inBold = false,
  keyBase = "",
): React.ReactNode[] {
  const re = new RegExp(inBold ? CITE : `${partial ? BOLD_OPEN : BOLD}|${CITE}`, "g")
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    const key = `${keyBase}${at}`
    if (m.groups?.b !== undefined) {
      out.push(
        <strong key={key} className="font-semibold text-foreground">
          {inline(m.groups.b, partial, cite, true, `${key}-`)}
        </strong>,
      )
    } else {
      out.push(cite(Number(m.groups?.c), key))
    }
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Plain text of an answer: markers removed, bullets as "- ", `[n]` kept, plus a numbered source list. */
export function answerToPlainText(
  answer: string,
  sources: AIAnswerSource[] = [],
  sourcesHeading = DEFAULT_LABELS.copySources,
): string {
  const strip = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1")
  const body = parseBlocks(answer)
    .map((b) => (b.type === "p" ? strip(b.text) : b.items.map((i) => `- ${strip(i)}`).join("\n")))
    .join("\n\n")
  if (!sources.length) return body
  const list = sources
    .map((s, i) => `${i + 1}. ${s.title} — ${s.site}${s.href ? ` (${s.href})` : ""}`)
    .join("\n")
  return `${body}\n\n${sourcesHeading}:\n${list}`
}

// ── Typewriter helpers ─────────────────────────────────────────────

/** End offsets of each word, so Thai and CJK text (no spaces) still reveals word by word. */
function wordEnds(text: string): number[] {
  const out: number[] = []
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    for (const s of new Intl.Segmenter("en", { granularity: "word" }).segment(text)) {
      if (s.isWordLike) out.push(s.index + s.segment.length)
    }
  } else {
    for (const m of text.matchAll(/\S+/g)) out.push((m.index ?? 0) + m[0].length)
  }
  if (text.length && out[out.length - 1] !== text.length) out.push(text.length)
  return out
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
const reducedNow = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
function useReducedMotion() {
  return React.useSyncExternalStore(subscribeMotion, reducedNow, () => false)
}

// ── Citation chip with preview ─────────────────────────────────────

function CitationChip({
  source,
  n,
  labels,
}: {
  source: AIAnswerSource
  n: number
  labels: AIAnswerLabels
}) {
  const [open, setOpen] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const focusOpened = React.useRef(false)
  const chipRef = React.useRef<HTMLButtonElement>(null)
  const name = source.shortName ?? source.site

  React.useEffect(() => () => clearTimeout(timer.current), [])

  function later(next: boolean, ms: number) {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), ms)
  }
  function now(next: boolean) {
    clearTimeout(timer.current)
    setOpen(next)
  }

  return (
    <Popover open={open} onOpenChange={now}>
      <PopoverAnchor asChild>
        <button
          ref={chipRef}
          type="button"
          data-slot="ai-answer-citation"
          aria-label={labels.citation(n, name)}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            focusOpened.current = false
            now(!open)
          }}
          onPointerEnter={(e) => e.pointerType === "mouse" && later(true, 120)}
          onPointerLeave={(e) => e.pointerType === "mouse" && later(false, 160)}
          onFocus={(e) => {
            if (e.currentTarget.matches(":focus-visible")) {
              focusOpened.current = true
              now(true)
            }
          }}
          onBlur={() => {
            if (focusOpened.current) now(false)
          }}
          className="mx-0.5 inline-flex h-5 max-w-40 translate-y-[-1px] items-center gap-1 rounded-full bg-primary-soft px-1.5 align-middle text-[11px] leading-none font-medium text-primary-soft-foreground outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring/60 aria-expanded:bg-primary aria-expanded:text-primary-foreground motion-reduce:transition-none pointer-coarse:h-6"
        >
          <span className="truncate">{name}</span>
          <span aria-hidden className="tabular-nums opacity-70">{n}</span>
        </button>
      </PopoverAnchor>
      <PopoverContent
        data-slot="ai-answer-citation-preview"
        side="top"
        align="start"
        collisionPadding={8}
        className="w-72 max-w-[calc(100vw-1rem)] p-3"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={(e) => e.pointerType === "mouse" && later(false, 160)}
        onInteractOutside={(e) => {
          // The chip's own click handler toggles; do not let the outside-press close then reopen it.
          if (chipRef.current?.contains(e.target as Node)) e.preventDefault()
        }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span aria-hidden className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
            {source.icon ?? <Globe />}
          </span>
          <span className="min-w-0 truncate" dir="auto">{source.site}</span>
          <span className="ms-auto tabular-nums">{n}</span>
        </div>
        <p data-slot="ai-answer-citation-title" dir="auto" className="mt-1.5 text-sm font-medium text-foreground">
          {source.title}
        </p>
        {source.snippet && (
          <p dir="auto" className="mt-1 line-clamp-4 text-xs/5 text-muted-foreground">
            {source.snippet}
          </p>
        )}
        {source.href && (
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded text-xs font-medium text-primary underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {labels.openSource}
          </a>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── Source card ────────────────────────────────────────────────────

function SourceCard({ source, n }: { source: AIAnswerSource; n: number }) {
  const Comp = source.href ? "a" : "div"
  return (
    <Comp
      data-slot="ai-answer-source"
      {...(source.href
        ? { href: source.href, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "gf-ai-answer-in flex min-w-0 flex-col gap-1.5 rounded-lg border bg-background p-2.5 text-start outline-none",
        source.href &&
          "transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none",
      )}
    >
      <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
        <span aria-hidden className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
          {source.icon ?? <Globe />}
        </span>
        <span className="min-w-0 truncate" dir="auto">{source.site}</span>
        <span aria-hidden className="ms-auto shrink-0 tabular-nums">{n}</span>
      </span>
      <span dir="auto" className="line-clamp-2 text-sm/5 font-medium text-foreground">
        {source.title}
      </span>
    </Comp>
  )
}

// ── AIAnswer ───────────────────────────────────────────────────────

export interface AIAnswerProps extends Omit<React.ComponentProps<"article">, "children" | "onCopy"> {
  /** The question this answer responds to; rendered as a heading. */
  question?: string
  /** Answer text: paragraphs, "- " bullets, **bold** and `[n]` citations (1-based into `sources`). */
  answer: string
  sources?: AIAnswerSource[]
  /** The answer is still arriving: shows the cursor, `aria-busy` and the Stop button. */
  streaming?: boolean
  onStop?: () => void
  /** Reveal newly arrived text word by word. `false` shows it at once. Reduced motion always does. */
  animate?: boolean
  /** Typewriter speed. It speeds up on its own when it falls far behind the stream. */
  wordsPerSecond?: number
  /** Suggested next questions, shown once the answer is complete. */
  followUps?: string[]
  onFollowUp?: (question: string) => void
  /** Own card on a muted tray; `false` blends into the surrounding thread. */
  framed?: boolean
  /** Controlled expansion of the source list beyond the first row. */
  sourcesOpen?: boolean
  defaultSourcesOpen?: boolean
  onSourcesOpenChange?: (open: boolean) => void
  /** Actions in the bar. Defaults to copy and feedback, plus regenerate when `onRegenerate` is set. */
  actions?: MessageActionsAction[]
  onRegenerate?: () => void
  onFeedback?: MessageActionsProps["onFeedback"]
  onCopy?: MessageActionsProps["onCopy"]
  /** Anything else for the underlying `MessageActions` (versions, reasons, labels, regenerating…). */
  actionProps?: Omit<MessageActionsProps, "text" | "actions" | "onRegenerate" | "onFeedback" | "onCopy">
  labels?: Partial<AIAnswerLabels>
}

function AIAnswer({
  question,
  answer,
  sources = [],
  streaming = false,
  onStop,
  animate = true,
  wordsPerSecond = 30,
  followUps,
  onFollowUp,
  framed = true,
  sourcesOpen,
  defaultSourcesOpen = false,
  onSourcesOpenChange,
  actions,
  onRegenerate,
  onFeedback,
  onCopy,
  actionProps,
  labels: labelsProp,
  className,
  ...props
}: AIAnswerProps) {
  const L: AIAnswerLabels = { ...DEFAULT_LABELS }
  for (const k in labelsProp) {
    const v = labelsProp[k as keyof AIAnswerLabels]
    if (v !== undefined) (L as unknown as Record<string, unknown>)[k] = v
  }
  const uid = React.useId()
  const gridId = `${uid}-sources`

  // ── typewriter: k = number of words revealed ──
  const reduced = useReducedMotion()
  const typing = animate && !reduced
  const ends = React.useMemo(() => wordEnds(answer), [answer])
  const [k, setK] = React.useState(() => (streaming ? 0 : Infinity))
  const [prevAnswer, setPrevAnswer] = React.useState(answer)
  if (prevAnswer !== answer) {
    setPrevAnswer(answer)
    // A different answer (not a longer version of the same one) starts over.
    if (!answer.startsWith(prevAnswer)) setK(0)
  }
  const target = typing ? Math.min(k, ends.length) : ends.length
  if (k !== target) setK(target)

  const kRef = React.useRef(k)
  const lenRef = React.useRef(ends.length)
  React.useEffect(() => {
    kRef.current = k
    lenRef.current = ends.length
  })
  const backlog = typing && k < ends.length
  React.useEffect(() => {
    if (!backlog) return
    let raf = 0
    let last = 0
    let acc = 0
    const tick = (t: number) => {
      const dt = last ? Math.min(t - last, 100) : 0
      last = t
      const waiting = lenRef.current - kRef.current
      acc += (dt / 1000) * Math.max(wordsPerSecond, waiting / 1.5)
      const n = Math.floor(acc)
      if (n > 0) {
        acc -= n
        setK((p) => Math.min(p + n, lenRef.current))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [backlog, wordsPerSecond])

  const shown = k >= ends.length ? answer : answer.slice(0, ends[k - 1] ?? 0)
  const finished = !streaming && k >= ends.length
  const busy = !finished

  // ── status for the live region ──
  const [seenStreaming, setSeenStreaming] = React.useState(streaming)
  const [stopped, setStopped] = React.useState(false)
  if (streaming && !seenStreaming) setSeenStreaming(true)
  if (streaming && stopped) setStopped(false)
  const status = busy ? L.generating : seenStreaming ? (stopped ? L.stopped : L.ready) : ""

  // ── sources ──
  const [openInner, setOpenInner] = React.useState(defaultSourcesOpen)
  const expanded = sourcesOpen ?? openInner
  function toggleSources() {
    const next = !expanded
    if (sourcesOpen === undefined) setOpenInner(next)
    onSourcesOpenChange?.(next)
  }
  const collapsible = sources.length > 3
  const visible = collapsible && !expanded ? sources.slice(0, 2) : sources

  // ── body ──
  const partial = busy
  const clean = partial ? shown.replace(/(?:\*{1,2}|\[\d{0,3})$/, "") : shown
  const blocks = parseBlocks(clean)
  const cite = (n: number, key: string) => {
    const s = sources[n - 1]
    return s ? <CitationChip key={key} source={s} n={n} labels={L} /> : `[${n}]`
  }
  const cursor = (
    <span
      key="cursor"
      aria-hidden
      data-slot="ai-answer-cursor"
      className="gf-ai-answer-cursor ms-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] rounded-full bg-primary align-baseline"
    />
  )
  const withCursor = (nodes: React.ReactNode[], isLast: boolean) =>
    streaming && isLast ? [...nodes, cursor] : nodes

  const plain = React.useMemo(
    () => answerToPlainText(answer, sources, L.copySources),
    [answer, sources, L.copySources],
  )
  const barActions: MessageActionsAction[] =
    actions ?? (onRegenerate ? ["copy", "regenerate", "feedback"] : ["copy", "feedback"])
  const chips = followUps?.filter((q) => q.trim()) ?? []

  const content = (
    <>
      {question && (
        <h3 data-slot="ai-answer-question" dir="auto" className="text-base/6 font-semibold text-foreground">
          {question}
        </h3>
      )}

      {sources.length > 0 && (
        <div
          id={gridId}
          data-slot="ai-answer-sources"
          role="group"
          aria-label={L.sources}
          className="grid grid-cols-2 gap-2 @md:grid-cols-3"
        >
          {visible.map((s, i) => (
            <SourceCard key={s.id ?? i} source={s} n={i + 1} />
          ))}
          {collapsible && (
            <button
              type="button"
              data-slot="ai-answer-sources-toggle"
              aria-expanded={expanded}
              aria-controls={gridId}
              aria-label={expanded ? L.showLess : L.showMore(sources.length - 2)}
              onClick={toggleSources}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed bg-muted/50 p-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none"
            >
              {expanded ? (
                <>
                  <ChevronUp aria-hidden className="size-4" />
                  <span className="text-xs">{L.showLess}</span>
                </>
              ) : (
                <span aria-hidden className="tabular-nums">+{sources.length - 2}</span>
              )}
            </button>
          )}
        </div>
      )}

      <div
        data-slot="ai-answer-body"
        aria-busy={busy}
        dir="auto"
        className="flex flex-col gap-3 text-sm/6 text-foreground"
      >
        {blocks.length === 0 && streaming && <p>{cursor}</p>}
        {blocks.map((b, i) => {
          const last = i === blocks.length - 1
          return b.type === "p" ? (
            <p key={i} data-slot="ai-answer-paragraph">
              {withCursor(inline(b.text, partial, cite), last)}
            </p>
          ) : (
            <ul key={i} data-slot="ai-answer-list" className="flex list-disc flex-col gap-1 ps-5 marker:text-muted-foreground">
              {b.items.map((item, j) => (
                <li key={j}>
                  {withCursor(inline(item, partial, cite), last && j === b.items.length - 1)}
                </li>
              ))}
            </ul>
          )
        })}
      </div>

      {streaming && onStop && (
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-slot="ai-answer-stop"
            onClick={() => {
              setStopped(true)
              onStop()
            }}
          >
            <Square aria-hidden className="fill-current" />
            {L.stop}
          </Button>
        </div>
      )}

      {finished && chips.length > 0 && (
        <div
          data-slot="ai-answer-followups"
          role="group"
          aria-label={L.followUps}
          className="gf-ai-answer-in flex flex-wrap gap-2"
        >
          {chips.map((q) => (
            <button
              key={q}
              type="button"
              data-slot="ai-answer-followup"
              dir="auto"
              onClick={() => onFollowUp?.(q)}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-start text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none pointer-coarse:py-2.5"
            >
              <CornerDownRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground rtl:-scale-x-100" />
              <span className="min-w-0">{q}</span>
            </button>
          ))}
        </div>
      )}

      {finished && barActions.length > 0 && (
        <MessageActions
          {...actionProps}
          text={plain}
          actions={barActions}
          onRegenerate={onRegenerate}
          onFeedback={onFeedback}
          onCopy={onCopy}
          quiet={actionProps?.quiet ?? false}
        />
      )}
    </>
  )

  return (
    <article
      data-slot="ai-answer"
      data-framed={framed || undefined}
      data-streaming={streaming || undefined}
      className={cn(
        "group/message @container w-full min-w-0",
        framed && "rounded-2xl bg-muted/60 p-1.5",
        className,
      )}
      {...props}
    >
      <style href="gf-ai-answer" precedence="low">{AI_ANSWER_CSS}</style>
      <div
        data-slot="ai-answer-content"
        className={cn(
          "flex min-w-0 flex-col gap-3",
          framed && "rounded-xl border bg-card p-4 text-card-foreground shadow-xs",
        )}
      >
        {content}
      </div>
      <div data-slot="ai-answer-status" role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
    </article>
  )
}

export { AIAnswer }

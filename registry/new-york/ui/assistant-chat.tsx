"use client"

import * as React from "react"
import { CircleAlert, Mic, RotateCw, Send, Sparkles, SquarePen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LoadingDots } from "./spinner"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours come from theme tokens only (color-mix over var(--primary)), so light,
// dark and data-brand follow the host app. Motion is guarded at the bottom.
const ASSISTANT_CHAT_CSS = `
  .gf-assistant-chat-frame{
    background:linear-gradient(145deg,color-mix(in oklab,var(--primary) 55%,transparent),var(--border) 38%,color-mix(in oklab,var(--primary) 22%,transparent));
    box-shadow:0 10px 34px -14px color-mix(in oklab,var(--primary) 45%,transparent);
  }
  .gf-assistant-chat-head{background:linear-gradient(to bottom,color-mix(in oklab,var(--primary) 9%,transparent),transparent);}
  .gf-assistant-chat-msg{animation:gf-assistant-chat-in 260ms cubic-bezier(.22,1,.36,1) both;}
  @keyframes gf-assistant-chat-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
  @media (prefers-reduced-motion: reduce){
    .gf-assistant-chat-msg{animation:none;}
  }
`

export type AssistantChatRole = "user" | "assistant"

export interface AssistantChatMessage {
  id: string
  role: AssistantChatRole
  content: string
  /** `streaming`: reply still arriving. `error`: the reply failed (shows an inline retry). */
  status?: "streaming" | "error"
  /** Error text for `status: "error"`; falls back to `labels.error`. */
  error?: string
}

export type AssistantChatResponse = string | Promise<string> | AsyncIterable<string>

export interface AssistantChatLabels {
  newChat: string
  conversation: string
  suggestions: string
  input: string
  placeholder: string
  send: string
  thinking: string
  error: string
  retry: string
  empty: string
  startDictation: string
  stopDictation: string
  listening: string
  dictationError: string
  /** Screen-reader prefixes for each speaker. */
  you: string
  assistantSaid: string
}

const DEFAULT_LABELS: AssistantChatLabels = {
  newChat: "New chat",
  conversation: "Conversation",
  suggestions: "Suggested questions",
  input: "Message",
  placeholder: "Ask anything…",
  send: "Send message",
  thinking: "Thinking…",
  error: "Something went wrong. Please try again.",
  retry: "Retry",
  empty: "No reply was received.",
  startDictation: "Start dictation",
  stopDictation: "Stop dictation",
  listening: "Listening…",
  dictationError: "Dictation is not available right now.",
  you: "You:",
  assistantSaid: "Assistant:",
}

// ── Web Speech API (not in lib.dom for every TS version) ──────────────
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognition(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}
const subscribeNone = () => () => {}
const speechSupported = () => !!getRecognition()
const speechUnsupported = () => false

const SILENT_ERRORS = ["no-speech", "aborted"]

export interface AssistantChatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect"> {
  /** Assistant name in the header. */
  name?: string
  /** Short line under the name. */
  tagline?: string
  /** Header avatar. Defaults to a sparkles tile. */
  avatar?: React.ReactNode
  /** Welcome-state greeting. */
  greeting?: React.ReactNode
  /** Welcome-state chips; clicking one sends it as a message. */
  suggestions?: string[]

  /** Controlled conversation. Omit for uncontrolled (the component keeps the list). */
  messages?: AssistantChatMessage[]
  defaultMessages?: AssistantChatMessage[]
  /** Every change to the list: user sends, streamed chunks, errors, retry, new chat. */
  onMessagesChange?: (messages: AssistantChatMessage[]) => void
  /**
   * Produces the reply. Return a string, a promise, or an async iterable of chunks
   * (appended as they arrive). `history` holds earlier, non-failed messages, without
   * the one being answered. Throwing or rejecting shows an inline retry.
   * Omit it to drive replies yourself from `onSend` + `messages`.
   */
  respond?: (message: string, history: AssistantChatMessage[]) => AssistantChatResponse
  /** Called for every message the user sends, typed or chip. Fires whether or not `respond` is set. */
  onSend?: (message: string) => void
  /** Retry pressed on a failed reply. With `respond` set the component also re-asks it. */
  onRetry?: (failed: AssistantChatMessage) => void
  /** New chat pressed, after the list is cleared and any pending reply is cancelled. */
  onNewChat?: () => void
  /** Show the typing indicator. Overrides the internal flag set while `respond` is running. */
  pending?: boolean
  /** Show a microphone button when the browser supports speech recognition. */
  dictation?: boolean
  /** BCP-47 language for dictation, e.g. `th-TH`. Defaults to the page language. */
  dictationLang?: string
  /** Custom body for a message (markdown, cards…). Receives the message; default is plain text. */
  renderMessage?: (message: AssistantChatMessage) => React.ReactNode
  labels?: Partial<AssistantChatLabels>
}

function AssistantChat({
  name = "Assistant",
  tagline,
  avatar,
  greeting = "Hi! How can I help you today?",
  suggestions,
  messages: messagesProp,
  defaultMessages,
  onMessagesChange,
  respond,
  onSend,
  onRetry,
  onNewChat,
  pending,
  dictation = false,
  dictationLang,
  renderMessage,
  labels,
  className,
  ...props
}: AssistantChatProps) {
  const l: AssistantChatLabels = { ...DEFAULT_LABELS }
  for (const k in labels) {
    const v = labels[k as keyof AssistantChatLabels]
    if (v !== undefined) l[k as keyof AssistantChatLabels] = v
  }

  const uid = React.useId()
  const counter = React.useRef(0)
  const nextId = () => `${uid}-${++counter.current}`

  // ── Message state (controlled + uncontrolled) ──────────────────────
  const controlled = messagesProp !== undefined
  const [internal, setInternal] = React.useState<AssistantChatMessage[]>(defaultMessages ?? [])
  const messages = controlled ? messagesProp : internal
  // Streaming commits several times between renders, so read-modify-write goes through a ref.
  const messagesRef = React.useRef(messages)
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])
  const commit = (next: AssistantChatMessage[]) => {
    messagesRef.current = next
    if (!controlled) setInternal(next)
    onMessagesChange?.(next)
  }

  const [busy, setBusy] = React.useState(false)
  const waiting = pending ?? busy
  // Bumped to cancel whatever reply is in flight (new chat, unmount).
  const runRef = React.useRef(0)
  React.useEffect(() => {
    const run = runRef
    return () => {
      run.current++
    }
  }, [])

  const run = async (text: string, history: AssistantChatMessage[]) => {
    if (!respond) return
    const token = ++runRef.current
    const live = () => token === runRef.current
    let id: string | null = null
    const put = (content: string, status?: "streaming" | "error") => {
      if (!live()) return
      if (id === null) {
        id = nextId()
        commit([...messagesRef.current, { id, role: "assistant", content, status }])
      } else {
        const mine = id
        commit(messagesRef.current.map((m) => (m.id === mine ? { ...m, content, status } : m)))
      }
    }
    setBusy(true)
    let acc = ""
    try {
      const out = await respond(text, history)
      if (typeof out === "string") {
        acc = out
        put(acc || l.empty)
      } else {
        for await (const chunk of out) {
          if (!live()) break // leaving the loop also closes the iterator
          acc += chunk
          put(acc, "streaming")
        }
        put(acc || l.empty)
      }
    } catch {
      put(acc, "error")
    } finally {
      if (live()) setBusy(false)
    }
  }

  // ── Draft, send, retry, new chat ───────────────────────────────────
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const stickRef = React.useRef(true)

  const cancelDictation = () => {
    const rec = recRef.current
    if (!rec) return
    recRef.current = null
    rec.onresult = rec.onerror = rec.onend = null
    rec.abort()
    setListening(false)
  }

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text || waiting) return
    cancelDictation()
    stickRef.current = true
    const history = messagesRef.current.filter((m) => m.status !== "error")
    commit([...messagesRef.current, { id: nextId(), role: "user", content: text }])
    setDraft("")
    onSend?.(text)
    void run(text, history)
  }

  const retry = (failed: AssistantChatMessage) => {
    if (waiting) return
    const list = messagesRef.current
    const at = list.findIndex((m) => m.id === failed.id)
    if (at < 1 || list[at - 1].role !== "user") return
    stickRef.current = true
    commit(list.slice(0, at))
    onRetry?.(failed)
    void run(
      list[at - 1].content,
      list.slice(0, at - 1).filter((m) => m.status !== "error"),
    )
  }

  const newChat = () => {
    runRef.current++
    setBusy(false)
    cancelDictation()
    commit([])
    setDraft("")
    setMicError(false)
    onNewChat?.()
    inputRef.current?.focus()
  }

  // ── Textarea: grow to 4 lines (max-h-24 = 4 × leading-5 + py-2), then scroll ──
  React.useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [draft])

  const composing = React.useRef(false)
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return
    // Thai/CJK IME: Enter confirms the candidate. Safari reports it after compositionend with keyCode 229.
    if (composing.current || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return
    e.preventDefault()
    send(draft)
  }

  // ── Dictation ──────────────────────────────────────────────────────
  const canDictate = React.useSyncExternalStore(subscribeNone, speechSupported, speechUnsupported)
  const showMic = dictation && canDictate
  const recRef = React.useRef<SpeechRecognitionLike | null>(null)
  const [listening, setListening] = React.useState(false)
  const [micError, setMicError] = React.useState(false)
  const toggleMic = () => {
    if (recRef.current) {
      recRef.current.stop() // onend flips `listening`
      return
    }
    const Ctor = getRecognition()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = dictationLang ?? document.documentElement.lang ?? ""
    rec.continuous = true
    rec.interimResults = true
    const base = draft
    rec.onresult = (e) => {
      let said = ""
      for (let i = 0; i < e.results.length; i++) said += e.results[i][0].transcript
      setDraft(base && !/\s$/.test(base) ? `${base} ${said}` : base + said)
    }
    rec.onerror = (e) => {
      if (!SILENT_ERRORS.includes(e.error ?? "")) setMicError(true)
    }
    rec.onend = () => {
      if (recRef.current === rec) recRef.current = null
      setListening(false)
    }
    recRef.current = rec
    setMicError(false)
    try {
      rec.start()
      setListening(true)
      inputRef.current?.focus()
    } catch {
      recRef.current = null
      setMicError(true)
    }
  }

  React.useEffect(() => {
    return () => {
      const rec = recRef.current
      recRef.current = null
      if (rec) {
        rec.onresult = rec.onerror = rec.onend = null
        rec.abort()
      }
    }
  }, [])

  // ── Auto-scroll to the newest message unless the reader scrolled up ──
  React.useEffect(() => {
    const el = scrollRef.current
    if (el && stickRef.current) el.scrollTop = el.scrollHeight
  }, [messages, waiting])

  // ── Derived view state ─────────────────────────────────────────────
  const last = messages[messages.length - 1]
  const showTyping = waiting && last?.role !== "assistant"
  const welcome = messages.length === 0 && !waiting
  // One polite region for everything: streaming chunks are never read out, only the finished reply.
  const announce = waiting
    ? l.thinking
    : last?.role === "assistant"
      ? last.status === "streaming"
        ? ""
        : last.status === "error"
          ? (last.error ?? l.error)
          : `${l.assistantSaid} ${last.content}`
      : ""

  return (
    <>
      <style href="gf-assistant-chat" precedence="low">{ASSISTANT_CHAT_CSS}</style>
      <div
        data-slot="assistant-chat"
        data-state={welcome ? "welcome" : "conversation"}
        className={cn(
          "gf-assistant-chat-frame flex h-[30rem] w-full max-w-[380px] rounded-2xl p-px",
          className,
        )}
        {...props}
      >
        <section
          aria-label={name}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[calc(1rem-1px)] bg-card text-card-foreground"
        >
          {/* Header */}
          <header
            data-slot="assistant-chat-header"
            className="gf-assistant-chat-head flex items-center gap-3 border-b px-4 py-3"
          >
            <span
              data-slot="assistant-chat-avatar"
              className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft text-primary-soft-foreground [&_svg]:size-4"
            >
              {avatar ?? <Sparkles aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <p data-slot="assistant-chat-name" dir="auto" className="truncate text-sm font-semibold leading-5">
                {name}
              </p>
              {tagline && (
                <p
                  data-slot="assistant-chat-tagline"
                  dir="auto"
                  className="truncate text-xs leading-4 text-muted-foreground"
                >
                  {tagline}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-slot="assistant-chat-new"
              className="size-8"
              aria-label={l.newChat}
              title={l.newChat}
              disabled={messages.length === 0 && !waiting}
              onClick={newChat}
            >
              <SquarePen aria-hidden />
            </Button>
          </header>

          {/* Conversation / welcome (focusable so keyboard users can scroll it) */}
          <div
            ref={scrollRef}
            role="region"
            tabIndex={0}
            aria-label={l.conversation}
            data-slot="assistant-chat-scroll"
            onScroll={(e) => {
              const el = e.currentTarget
              stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48
            }}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-3 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
          >
            {welcome ? (
              <div data-slot="assistant-chat-welcome" className="flex min-h-full flex-col justify-center gap-4">
                <div className="gf-assistant-chat-msg text-base font-medium leading-snug" dir="auto">
                  {greeting}
                </div>
                {suggestions && suggestions.length > 0 && (
                  <ul
                    data-slot="assistant-chat-suggestions"
                    aria-label={l.suggestions}
                    className="gf-assistant-chat-msg flex list-none flex-wrap gap-2"
                  >
                    {suggestions.map((s, i) => (
                      <li key={`${i}-${s}`}>
                        <button
                          type="button"
                          data-slot="assistant-chat-suggestion"
                          dir="auto"
                          onClick={() => {
                            send(s)
                            inputRef.current?.focus()
                          }}
                          className="rounded-full border bg-card px-3 py-1.5 text-start text-xs leading-4 text-foreground outline-none transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary-soft-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <ol data-slot="assistant-chat-messages" className="flex list-none flex-col gap-3">
                  {messages.map((m) => {
                    const failed = m.status === "error"
                    return m.role === "user" ? (
                      <li
                        key={m.id}
                        data-slot="assistant-chat-message"
                        data-role="user"
                        className="gf-assistant-chat-msg flex justify-end"
                      >
                        <div
                          dir="auto"
                          className="max-w-[85%] rounded-2xl rounded-ee-sm bg-primary px-3 py-2 text-sm leading-5 break-words whitespace-pre-wrap text-primary-foreground"
                        >
                          <span className="sr-only">{l.you} </span>
                          {renderMessage ? renderMessage(m) : m.content}
                        </div>
                      </li>
                    ) : (
                      <li
                        key={m.id}
                        data-slot="assistant-chat-message"
                        data-role="assistant"
                        data-status={m.status}
                        className="gf-assistant-chat-msg flex flex-col items-start gap-2"
                      >
                        {m.content && (
                          <div
                            dir="auto"
                            className="max-w-full text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground"
                          >
                            <span className="sr-only">{l.assistantSaid} </span>
                            {renderMessage ? renderMessage(m) : m.content}
                          </div>
                        )}
                        {failed && (
                          <div
                            data-slot="assistant-chat-error"
                            className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-xs leading-4 text-danger-soft-foreground"
                          >
                            <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
                            <div className="flex min-w-0 flex-col items-start gap-1.5">
                              <span dir="auto">{m.error ?? l.error}</span>
                              {m === last && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  data-slot="assistant-chat-retry"
                                  className="h-6 gap-1 px-2 text-xs"
                                  disabled={waiting}
                                  onClick={() => retry(m)}
                                >
                                  <RotateCw aria-hidden className="size-3" />
                                  {l.retry}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
                {showTyping && (
                  <div
                    data-slot="assistant-chat-typing"
                    aria-hidden
                    className="gf-assistant-chat-msg mt-3 flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <LoadingDots size="sm" />
                    <span>{l.thinking}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div data-slot="assistant-chat-status" role="status" aria-live="polite" className="sr-only">
            {announce}
          </div>

          {/* Composer */}
          <form
            data-slot="assistant-chat-form"
            className="border-t p-3"
            onSubmit={(e) => {
              e.preventDefault()
              send(draft)
            }}
          >
            <div className="flex items-end gap-1 rounded-xl border bg-background p-1 transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
              <textarea
                ref={inputRef}
                data-slot="assistant-chat-input"
                rows={1}
                value={draft}
                aria-label={l.input}
                placeholder={listening ? l.listening : l.placeholder}
                dir="auto"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onCompositionStart={() => {
                  composing.current = true
                }}
                onCompositionEnd={() => {
                  composing.current = false
                }}
                className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
              />
              {showMic && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-slot="assistant-chat-mic"
                  data-listening={listening || undefined}
                  className={cn(
                    "size-8 rounded-lg",
                    listening && "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft",
                  )}
                  aria-pressed={listening}
                  aria-label={listening ? l.stopDictation : l.startDictation}
                  title={listening ? l.stopDictation : l.startDictation}
                  onClick={toggleMic}
                >
                  <Mic aria-hidden />
                </Button>
              )}
              <Button
                type="submit"
                size="icon"
                data-slot="assistant-chat-send"
                className="size-8 rounded-lg"
                aria-label={l.send}
                title={l.send}
                disabled={!draft.trim() || waiting}
              >
                <Send aria-hidden />
              </Button>
            </div>
            {micError && (
              <p data-slot="assistant-chat-mic-error" role="status" className="mt-1.5 text-xs text-danger">
                {l.dictationError}
              </p>
            )}
          </form>
        </section>
      </div>
    </>
  )
}

export { AssistantChat }

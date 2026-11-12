"use client"

import * as React from "react"
import { ArrowUp, ChevronDown, Folder, Mic, Paperclip, Plug, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colours never appear here — they come from theme-token utilities on the element.
const CHAT_COMPOSER_CSS = `
  .gf-chat-composer-pulse{animation:gf-chat-composer-pulse 1400ms ease-out infinite;}
  @keyframes gf-chat-composer-pulse{0%{box-shadow:0 0 0 0 color-mix(in oklab,currentColor 45%,transparent);}100%{box-shadow:0 0 0 8px transparent;}}
  @media (prefers-reduced-motion: reduce){
    .gf-chat-composer-pulse{animation:none;}
  }
`

export interface ChatComposerModel {
  /** Stable id reported to `onSend` and `onModelChange`. */
  id: string
  /** Name shown on the picker. */
  name: string
  /** Secondary line in the menu. */
  description?: string
  /** Leading glyph; defaults to a sparkle. */
  icon?: React.ReactNode
}

export interface ChatComposerFolder {
  id: string
  name: string
}

export interface ChatComposerApp {
  id: string
  name: string
  /** Glyph for the menu row and the stacked marks; falls back to the first letter of `name`. */
  icon?: React.ReactNode
}

export interface ChatComposerSendMeta {
  /** Selected model id, or null when no models were given. */
  model: string | null
  /** Selected folder id, or null. */
  folder: string | null
  /** Connected app ids, in the order of the `apps` list. */
  apps: string[]
}

export interface ChatComposerLabels {
  /** Accessible name of the message field. */
  message: string
  send: string
  attach: string
  model: string
  folder: string
  /** Heading of the folder menu. */
  folderMenu: string
  connectApps: string
  /** Heading of the apps menu. */
  appsMenu: string
  startVoice: string
  stopVoice: string
  /** Shown beside the pulse while recording. */
  listening: string
  /** Shown after `listening` — explains the Esc shortcut. */
  voiceHint: string
  voiceStarted: string
  voiceStopped: string
  voiceDiscarded: string
  voiceError: string
  /** Template — `{name}` is replaced. */
  modelSelected: string
  folderSelected: string
  folderCleared: string
  appConnected: string
  appDisconnected: string
  actionBusy: string
  actionDone: string
}

const DEFAULT_LABELS: ChatComposerLabels = {
  message: "Message",
  send: "Send message",
  attach: "Attach files",
  model: "Model",
  folder: "Folder",
  folderMenu: "Work in a folder",
  connectApps: "Connect apps",
  appsMenu: "Connected apps",
  startVoice: "Start voice input",
  stopVoice: "Stop voice input",
  listening: "Listening…",
  voiceHint: "Esc to discard",
  voiceStarted: "Listening.",
  voiceStopped: "Voice input added to the message.",
  voiceDiscarded: "Voice input discarded.",
  voiceError: "Voice input failed.",
  modelSelected: "Model: {name}.",
  folderSelected: "Folder: {name}.",
  folderCleared: "Folder cleared.",
  appConnected: "{name} connected.",
  appDisconnected: "{name} disconnected.",
  actionBusy: "Working…",
  actionDone: "Done.",
}

// ── Web Speech API (not in lib.dom) ──
interface SpeechResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<SpeechResultLike> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getSpeechCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

const subscribeNone = () => () => {}
const detectSpeech = () => getSpeechCtor() !== undefined
const noSpeechOnServer = () => false

// Scripts written without spaces between words — don't pad dictated chunks with one.
const NO_SPACE_LANG = /^(th|ja|zh|lo|km|my)\b/i

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [internal, setInternal] = React.useState(defaultValue)
  const controlled = value !== undefined
  const set = (next: T) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }
  return [controlled ? value : internal, set] as const
}

function fmt(template: string, name: string) {
  return template.replace("{name}", name)
}

const TOOL_BUTTON =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-muted data-[state=open]:text-foreground aria-pressed:bg-primary-soft aria-pressed:text-primary-soft-foreground disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none pointer-coarse:h-9 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function IconButton({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(TOOL_BUTTON, "size-8 px-0 pointer-coarse:size-9", className)}
          {...props}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

// A small round mark: the app's icon, or its first letter.
function AppMark({ app }: { app: ChatComposerApp }) {
  return (
    <span
      data-slot="chat-composer-app-mark"
      aria-hidden
      className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-card bg-muted text-[9px] font-semibold text-muted-foreground [&_svg]:size-3"
    >
      {app.icon ?? Array.from(app.name)[0]?.toUpperCase()}
    </span>
  )
}

export interface ChatComposerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "onSubmit"> {
  /** Controlled message text. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Enter (without Shift, outside IME composition) or the send button. Uncontrolled text clears afterwards. */
  onSend?: (message: string, meta: ChatComposerSendMeta) => void
  disabled?: boolean
  /** Max height of the message field in px before it scrolls. */
  maxFieldHeight?: number
  /** Shows the attach button. */
  onAttach?: () => void
  /** Choices for the model picker. The picker is hidden when empty. */
  models?: ChatComposerModel[]
  /** Controlled model id. */
  model?: string
  /** Initial model id when uncontrolled. Defaults to the first model. */
  defaultModel?: string
  onModelChange?: (id: string) => void
  /** Choices for the folder picker. Hidden when empty; picking the selected folder again clears it. */
  folders?: ChatComposerFolder[]
  /** Controlled folder id (`null` = none). */
  folder?: string | null
  defaultFolder?: string | null
  onFolderChange?: (id: string | null) => void
  /** Apps offered in the connect menu. Hidden when empty. */
  apps?: ChatComposerApp[]
  /** Controlled connected app ids. */
  connectedApps?: string[]
  defaultConnectedApps?: string[]
  onConnectedAppsChange?: (ids: string[]) => void
  /** How many connected apps show as stacked marks on the button. */
  maxAppMarks?: number
  /** Text of the secondary action button; the button is hidden without it. */
  actionLabel?: string
  actionIcon?: React.ReactNode
  /** If it returns a promise the button is busy until it settles. */
  onAction?: () => void | Promise<unknown>
  /** Forces the busy state (spinner, disabled, announced). */
  busy?: boolean
  /** BCP-47 tag for dictation. Defaults to the document's `lang`, then the browser language. */
  speechLang?: string
  /** Called when voice starts (`true`) or stops (`false`). With it the mic stays visible even where dictation is unsupported — you then own the transcription. */
  onVoice?: (listening: boolean) => void
  /** Override any user-facing string; unset keys keep the English default. */
  labels?: Partial<ChatComposerLabels>
}

function ChatComposer({
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Ask anything…",
  onSend,
  disabled = false,
  maxFieldHeight = 200,
  onAttach,
  models = [],
  model,
  defaultModel,
  onModelChange,
  folders = [],
  folder,
  defaultFolder = null,
  onFolderChange,
  apps = [],
  connectedApps,
  defaultConnectedApps = [],
  onConnectedAppsChange,
  maxAppMarks = 3,
  actionLabel,
  actionIcon,
  onAction,
  busy = false,
  speechLang,
  onVoice,
  labels,
  className,
  onClick,
  onKeyDown,
  ...props
}: ChatComposerProps) {
  const L = { ...DEFAULT_LABELS }
  for (const k in labels) {
    const v = labels[k as keyof ChatComposerLabels]
    if (v !== undefined) L[k as keyof ChatComposerLabels] = v
  }

  const fieldRef = React.useRef<HTMLTextAreaElement>(null)

  // ── live region ──
  const [status, setStatus] = React.useState("")
  const flip = React.useRef(false)
  // A trailing space on alternate calls makes an identical message re-announce.
  const announce = React.useCallback((message: string) => {
    flip.current = !flip.current
    setStatus(message + (flip.current ? " " : ""))
  }, [])

  // ── message text ──
  const [text, setText] = useControllable(value, defaultValue, onValueChange)
  const trimmed = text.trim()

  // Auto-grow: re-measure on every edit and whenever the width (so the wrapping) changes.
  const fit = React.useCallback(() => {
    const el = fieldRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])
  React.useEffect(fit, [fit, text, maxFieldHeight])
  React.useEffect(() => {
    const el = fieldRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    let width = el.clientWidth
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== width) {
        width = el.clientWidth
        fit()
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit])

  // ── model / folder / apps ──
  const [modelId, setModelId] = useControllable<string | undefined>(model, defaultModel, onModelChange as ((v: string | undefined) => void) | undefined)
  const currentModel = models.find(m => m.id === modelId) ?? models[0]
  const [folderId, setFolderId] = useControllable<string | null>(folder, defaultFolder, onFolderChange)
  const currentFolder = folders.find(f => f.id === folderId)
  const [connectedIds, setConnectedIds] = useControllable<string[]>(
    connectedApps,
    defaultConnectedApps,
    onConnectedAppsChange,
  )
  const connected = apps.filter(a => connectedIds.includes(a.id))

  // ── send ──
  const canSend = trimmed.length > 0 && !disabled

  function send() {
    if (!canSend) return
    onSend?.(trimmed, {
      model: currentModel?.id ?? null,
      folder: currentFolder?.id ?? null,
      apps: connected.map(a => a.id),
    })
    if (value === undefined) setText("")
  }

  // ── secondary action ──
  const [pending, setPending] = React.useState(false)
  const mounted = React.useRef(true)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const busyNow = busy || pending

  // Announce busy transitions (adjusting state while rendering, not in an effect).
  const [prevBusy, setPrevBusy] = React.useState(busyNow)
  if (prevBusy !== busyNow) {
    setPrevBusy(busyNow)
    setStatus(busyNow ? L.actionBusy : L.actionDone)
  }

  function runAction() {
    if (busyNow) return
    const result = onAction?.()
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setPending(true)
      const done = () => {
        if (mounted.current) setPending(false)
      }
      ;(result as Promise<unknown>).then(done, done)
    }
  }

  // ── voice ──
  const speechSupported = React.useSyncExternalStore(subscribeNone, detectSpeech, noSpeechOnServer)
  const showMic = speechSupported || onVoice !== undefined
  const [listening, setListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState({ final: "", interim: "" })
  const recRef = React.useRef<SpeechRecognitionLike | null>(null)
  const sessionRef = React.useRef({ final: "", interim: "", lang: "", discard: false })

  const textRef = React.useRef(text)
  React.useEffect(() => {
    textRef.current = text
  })
  // Handlers created at click time call through this, so they always see the latest props.
  const insert = (chunk: string) => {
    const cur = textRef.current
    const sep = cur && !/\s$/.test(cur) && !NO_SPACE_LANG.test(sessionRef.current.lang) ? " " : ""
    textRef.current = cur + sep + chunk
    setText(textRef.current)
  }
  const latest = React.useRef({ insert, announce, onVoice, L })
  React.useEffect(() => {
    latest.current = { insert, announce, onVoice, L }
  })

  function startVoice() {
    const Ctor = getSpeechCtor()
    const lang =
      speechLang ||
      (typeof document !== "undefined" && document.documentElement.lang) ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "en-US"
    sessionRef.current = { final: "", interim: "", lang, discard: false }
    setTranscript({ final: "", interim: "" })
    if (Ctor) {
      const rec = new Ctor()
      rec.lang = lang
      rec.continuous = true
      rec.interimResults = true
      rec.onresult = e => {
        let fin = ""
        let interim = ""
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i]
          if (r.isFinal) fin += r[0].transcript
          else interim += r[0].transcript
        }
        sessionRef.current.final = fin
        sessionRef.current.interim = interim
        setTranscript({ final: fin, interim })
      }
      rec.onerror = e => {
        // "aborted" and "no-speech" are routine; everything else is worth telling the user.
        if (e.error !== "aborted" && e.error !== "no-speech") latest.current.announce(latest.current.L.voiceError)
      }
      rec.onend = () => {
        const s = sessionRef.current
        recRef.current = null
        if (mounted.current) {
          setListening(false)
          setTranscript({ final: "", interim: "" })
        }
        const l = latest.current
        l.onVoice?.(false)
        if (s.discard) {
          l.announce(l.L.voiceDiscarded)
          return
        }
        const said = (s.final + s.interim).trim()
        if (said && mounted.current) {
          l.insert(said)
          l.announce(l.L.voiceStopped)
        }
      }
      recRef.current = rec
      try {
        rec.start()
      } catch {
        recRef.current = null
        announce(L.voiceError)
        return
      }
    }
    setListening(true)
    announce(L.voiceStarted)
    onVoice?.(true)
  }

  function stopVoice(discard: boolean) {
    sessionRef.current.discard = discard
    const rec = recRef.current
    if (rec) {
      // onend finishes the job (inserts or discards).
      if (discard) rec.abort()
      else rec.stop()
    } else {
      // No engine (caller-owned voice): just flip the state.
      setListening(false)
      announce(discard ? L.voiceDiscarded : L.voiceStopped)
      onVoice?.(false)
    }
  }

  // Unmount: silence the engine without calling back into a dead component.
  React.useEffect(
    () => () => {
      const rec = recRef.current
      if (!rec) return
      rec.onresult = rec.onerror = rec.onend = null
      rec.abort()
    },
    [],
  )

  // ── events ──
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented || !e.currentTarget.contains(e.target as Node)) return
    if (e.key === "Escape" && listening) {
      e.preventDefault()
      stopVoice(true)
    }
  }

  function handleFieldKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // keyCode 229 covers Safari, which reports the Enter that confirms a composition after `compositionend`.
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    send()
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    onClick?.(e)
    // Portalled menus bubble through React; only react to clicks that are really inside the card.
    if (e.defaultPrevented || !e.currentTarget.contains(e.target as Node)) return
    if ((e.target as HTMLElement).closest("button,a,input,textarea,[role^='menuitem']")) return
    fieldRef.current?.focus()
  }

  const visibleMarks = connected.slice(0, Math.max(0, maxAppMarks))
  const extraApps = connected.length - visibleMarks.length

  return (
    <>
      <style href="gf-chat-composer" precedence="low">{CHAT_COMPOSER_CSS}</style>
      <div
        data-slot="chat-composer"
        data-disabled={disabled || undefined}
        data-listening={listening || undefined}
        className={cn("@container relative w-full max-w-3xl text-sm", className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          data-slot="chat-composer-card"
          className={cn(
            "flex cursor-text flex-col gap-1 rounded-2xl border bg-card p-2 text-card-foreground shadow-xs transition-[color,box-shadow] motion-reduce:transition-none",
            "has-[[data-slot=chat-composer-field]:focus-visible]:border-ring has-[[data-slot=chat-composer-field]:focus-visible]:ring-[3px] has-[[data-slot=chat-composer-field]:focus-visible]:ring-ring/50",
            disabled && "opacity-60",
          )}
        >
          <textarea
            ref={fieldRef}
            data-slot="chat-composer-field"
            rows={1}
            dir="auto"
            value={text}
            disabled={disabled}
            placeholder={placeholder}
            aria-label={L.message}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleFieldKeyDown}
            style={{ maxHeight: maxFieldHeight }}
            className="block min-h-9 w-full resize-none overflow-y-auto bg-transparent px-2 py-1.5 leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />

          {listening && (
            <div
              data-slot="chat-composer-transcript"
              aria-hidden
              className="flex items-start gap-2 px-2 pb-1 text-muted-foreground"
            >
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-danger text-danger gf-chat-composer-pulse" />
              <p dir="auto" className="min-w-0 flex-1 break-words">
                {transcript.final || transcript.interim ? (
                  <>
                    <span className="text-foreground">{transcript.final}</span>
                    <span className="opacity-70">{transcript.interim}</span>
                  </>
                ) : (
                  L.listening
                )}
                <span className="ms-2 text-xs opacity-80">{L.voiceHint}</span>
              </p>
            </div>
          )}

          <div data-slot="chat-composer-toolbar" className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center gap-0.5">
              {onAttach && (
                <IconButton label={L.attach} disabled={disabled} onClick={onAttach} data-slot="chat-composer-attach">
                  <Paperclip aria-hidden />
                </IconButton>
              )}

              {models.length > 0 && currentModel && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-slot="chat-composer-model"
                      disabled={disabled}
                      aria-label={`${L.model}: ${currentModel.name}`}
                      className={cn(TOOL_BUTTON, "max-w-[9rem] @max-[22rem]:max-w-[6rem]")}
                    >
                      {currentModel.icon ?? <Sparkles aria-hidden />}
                      <span dir="auto" className="min-w-0 truncate">
                        {currentModel.name}
                      </span>
                      <ChevronDown aria-hidden className="size-3.5 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-64 max-w-[calc(100vw-2rem)]">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">{L.model}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={currentModel.id}
                      onValueChange={id => {
                        const m = models.find(x => x.id === id)
                        if (!m) return
                        setModelId(id)
                        announce(fmt(L.modelSelected, m.name))
                      }}
                    >
                      {models.map(m => (
                        <DropdownMenuRadioItem key={m.id} value={m.id} className="items-start">
                          <span className="flex min-w-0 flex-col">
                            <span dir="auto" className="truncate" title={m.name}>
                              {m.name}
                            </span>
                            {m.description && (
                              <span dir="auto" className="text-xs text-muted-foreground">
                                {m.description}
                              </span>
                            )}
                          </span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {folders.length > 0 && (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          data-slot="chat-composer-folder"
                          disabled={disabled}
                          aria-label={`${L.folder}${currentFolder ? `: ${currentFolder.name}` : ""}`}
                          // Shrinks (label first) before anything else gives way.
                          className={cn(TOOL_BUTTON, "min-w-8 shrink max-w-[10rem] justify-start")}
                        >
                          <Folder aria-hidden />
                          <span dir="auto" className="min-w-0 truncate">
                            {currentFolder?.name ?? L.folder}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">{currentFolder?.name ?? L.folder}</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent side="top" align="start" className="w-64 max-w-[calc(100vw-2rem)]">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">{L.folderMenu}</DropdownMenuLabel>
                    {folders.map(f => (
                      <DropdownMenuCheckboxItem
                        key={f.id}
                        checked={f.id === currentFolder?.id}
                        onCheckedChange={on => {
                          setFolderId(on ? f.id : null)
                          announce(on ? fmt(L.folderSelected, f.name) : L.folderCleared)
                        }}
                      >
                        <span dir="auto" className="min-w-0 truncate" title={f.name}>
                          {f.name}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {apps.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-slot="chat-composer-apps"
                      disabled={disabled}
                      aria-label={`${L.connectApps}${connected.length ? ` (${connected.length})` : ""}`}
                      className={TOOL_BUTTON}
                    >
                      {visibleMarks.length > 0 ? (
                        <span className="flex items-center [&>*:not(:first-child)]:-ms-1.5">
                          {visibleMarks.map(a => (
                            <AppMark key={a.id} app={a} />
                          ))}
                          {extraApps > 0 && (
                            <span
                              aria-hidden
                              className="relative grid h-5 min-w-5 place-items-center rounded-full border-2 border-card bg-muted px-1 text-[9px] font-semibold text-muted-foreground"
                            >
                              +{extraApps}
                            </span>
                          )}
                        </span>
                      ) : (
                        <Plug aria-hidden />
                      )}
                      <span className="@max-[26rem]:sr-only">{L.connectApps}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-64 max-w-[calc(100vw-2rem)]">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">{L.appsMenu}</DropdownMenuLabel>
                    {apps.map(a => (
                      <DropdownMenuCheckboxItem
                        key={a.id}
                        checked={connectedIds.includes(a.id)}
                        // Keep the menu open so several apps can be toggled in one go.
                        onSelect={e => e.preventDefault()}
                        onCheckedChange={on => {
                          setConnectedIds(on ? [...connectedIds, a.id] : connectedIds.filter(id => id !== a.id))
                          announce(fmt(on ? L.appConnected : L.appDisconnected, a.name))
                        }}
                      >
                        {a.icon && <span className="[&_svg]:size-4">{a.icon}</span>}
                        <span dir="auto" className="min-w-0 truncate" title={a.name}>
                          {a.name}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {actionLabel && (
                <Button
                  type="button"
                  data-slot="chat-composer-action"
                  variant="outline"
                  size="sm"
                  loading={busyNow}
                  disabled={disabled}
                  aria-busy={busyNow || undefined}
                  onClick={runAction}
                  className="pointer-coarse:h-9"
                >
                  {!busyNow && actionIcon}
                  <span className="@max-[22rem]:sr-only">{actionLabel}</span>
                </Button>
              )}

              {showMic && (
                <IconButton
                  data-slot="chat-composer-mic"
                  label={listening ? L.stopVoice : L.startVoice}
                  aria-pressed={listening}
                  disabled={disabled}
                  onClick={() => (listening ? stopVoice(false) : startVoice())}
                  className={cn(listening && "text-danger hover:text-danger gf-chat-composer-pulse")}
                >
                  <Mic aria-hidden />
                </IconButton>
              )}

              <button
                type="button"
                data-slot="chat-composer-send"
                aria-label={L.send}
                disabled={!canSend}
                onClick={send}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none transition-[background-color,opacity] hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none pointer-coarse:size-9"
              >
                <ArrowUp aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div data-slot="chat-composer-status" role="status" aria-live="polite" className="sr-only">
          {status}
        </div>
      </div>
    </>
  )
}

export { ChatComposer }

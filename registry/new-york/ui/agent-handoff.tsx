"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowRight,
  Circle,
  CircleCheck,
  ChevronDown,
  FileText,
  GripVertical,
  Info,
  Link2,
  LoaderCircle,
  Scale,
  StickyNote,
  TriangleAlert,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Tag, TagIcon } from "./tag-badge"
import type { TagColor } from "./tag-badge"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// A fresh handoff gets a one-off card pop and a pulse on its connector. The
// "fresh" highlight itself (primary border / connector colour) is plain utility
// classes, so it still shows when reduced motion switches these off.
const AGENT_HANDOFF_CSS = `
  @keyframes gf-agent-handoff-pop{
    from{opacity:0;transform:translateY(-6px) scale(.98);box-shadow:0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent);}
    55%{opacity:1;transform:none;box-shadow:0 0 0 5px color-mix(in oklab, var(--primary) 30%, transparent);}
    to{opacity:1;transform:none;box-shadow:0 0 0 0 transparent;}
  }
  @keyframes gf-agent-handoff-pulse{0%,100%{opacity:.35;}50%{opacity:1;}}
  .gf-agent-handoff-pop{animation:gf-agent-handoff-pop 900ms cubic-bezier(.22,1,.36,1) both;}
  .gf-agent-handoff-pulse{animation:gf-agent-handoff-pulse 700ms ease-in-out 2;}
  @media (prefers-reduced-motion: reduce){.gf-agent-handoff-pop,.gf-agent-handoff-pulse{animation:none;}}
`

// ── Types ───────────────────────────────────────────────────────────
export type HandoffItemKind = "file" | "source" | "fact" | "decision" | "note"
export type HandoffTaskStatus = "todo" | "working" | "done" | "warning"

export interface HandoffAgent {
  /** Stable unique id. Agents render left to right in array order. */
  id: string
  name: string
  /** Role, e.g. "Recruiter". Shown with the model on one muted line. */
  role?: string
  model?: string
  /** Avatar image; initials are the fallback. */
  avatarSrc?: string
  description?: string
  /** What the agent is doing right now. */
  task?: string
}

export interface HandoffItem {
  id: string
  label: string
  /** Picks the icon. Defaults to "note". */
  kind?: HandoffItemKind
  /** Not carried over: shown struck through; activating it explains why. */
  lost?: boolean
  /** Why it was lost, shown in the popover. */
  reason?: string
}

export interface Handoff {
  id: string
  /** Id of the agent that passed the work on. The card sits in the column after it. */
  from: string
  /** Id of the agent that received it (display only). */
  to: string
  title: string
  summary?: string
  items: HandoffItem[]
  /** The task this handoff moves. Needed for assignment; without it the card cannot be moved. */
  taskId?: string
}

export interface HandoffTask {
  id: string
  title: string
  status: HandoffTaskStatus
  /** Id of the assigned agent. */
  agent?: string
  note?: string
}

export type AgentHandoffTarget =
  | { type: "handoff"; handoff: Handoff }
  | { type: "task"; task: HandoffTask }

export interface AgentHandoffLabels {
  root: string
  agents: string
  handoffsBetween: (from: string, to: string) => string
  noHandoffs: string
  itemsLabel: (title: string) => string
  itemCount: (count: number) => string
  noItems: string
  kind: Record<HandoffItemKind, string>
  lost: string
  lostFallback: string
  restore: string
  pickUp: (title: string) => string
  assignTo: (agent: string) => string
  pickedHint: (title: string) => string
  cancel: string
  tasks: string
  noTasks: string
  unassigned: string
  upNext: string
  currentTask: string
  status: Record<HandoffTaskStatus, string>
  announcePickUp: (title: string, targets: number) => string
  announceAssign: (title: string, agent: string) => string
  announceCancel: (title: string) => string
  announceNew: (title: string, from: string, to: string) => string
}

export type AgentHandoffLabelsInput = Partial<
  Omit<AgentHandoffLabels, "kind" | "status">
> & {
  kind?: Partial<AgentHandoffLabels["kind"]>
  status?: Partial<AgentHandoffLabels["status"]>
}

const DEFAULT_LABELS: AgentHandoffLabels = {
  root: "Agent handoff",
  agents: "Agents",
  handoffsBetween: (from, to) => `Handoffs from ${from} to ${to}`,
  noHandoffs: "No handoffs yet",
  itemsLabel: (title) => `Passed along in ${title}`,
  itemCount: (n) => (n === 1 ? "1 item" : `${n} items`),
  noItems: "Nothing passed along",
  kind: {
    file: "File",
    source: "Source",
    fact: "Fact",
    decision: "Decision",
    note: "Note",
  },
  lost: "Lost",
  lostFallback: "This item was not carried over.",
  restore: "Add back",
  pickUp: (title) => `Move ${title} to another agent`,
  assignTo: (agent) => `Assign to ${agent}`,
  pickedHint: (title) => `Choose an agent for ${title}. Esc cancels.`,
  cancel: "Cancel",
  tasks: "Tasks",
  noTasks: "No tasks",
  unassigned: "Unassigned",
  upNext: "Up next",
  currentTask: "Working on",
  status: {
    todo: "To do",
    working: "Working",
    done: "Done",
    warning: "Needs attention",
  },
  announcePickUp: (title, n) =>
    `Picked up ${title}. Choose one of ${n} ${n === 1 ? "agent" : "agents"}, then press Enter. Escape cancels.`,
  announceAssign: (title, agent) => `${title} assigned to ${agent}.`,
  announceCancel: (title) => `Cancelled moving ${title}.`,
  announceNew: (title, from, to) => `New handoff ${title}, from ${from} to ${to}.`,
}

// Per-key fallback (one level into kind/status) so an explicit `undefined`
// never wipes a default.
function mergeLabels(input?: AgentHandoffLabelsInput): AgentHandoffLabels {
  const l = {
    ...DEFAULT_LABELS,
    kind: { ...DEFAULT_LABELS.kind },
    status: { ...DEFAULT_LABELS.status },
  } as AgentHandoffLabels
  if (!input) return l
  const { kind, status, ...rest } = input
  for (const k of Object.keys(rest) as (keyof typeof rest)[]) {
    if (rest[k] !== undefined) (l as unknown as Record<string, unknown>)[k] = rest[k]
  }
  for (const k of Object.keys(kind ?? {}) as HandoffItemKind[]) {
    if (kind?.[k] !== undefined) l.kind[k] = kind[k] as string
  }
  for (const k of Object.keys(status ?? {}) as HandoffTaskStatus[]) {
    if (status?.[k] !== undefined) l.status[k] = status[k] as string
  }
  return l
}

const KIND_ICON: Record<HandoffItemKind, React.ComponentType<{ className?: string }>> = {
  file: FileText,
  source: Link2,
  fact: Info,
  decision: Scale,
  note: StickyNote,
}

const STATUS: Record<
  HandoffTaskStatus,
  { color: TagColor; Icon: React.ComponentType<{ className?: string }> }
> = {
  todo: { color: "neutral", Icon: Circle },
  working: { color: "info", Icon: LoaderCircle },
  done: { color: "success", Icon: CircleCheck },
  warning: { color: "warn", Icon: TriangleAlert },
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase()
}

// ── AgentHandoff ────────────────────────────────────────────────────
export interface AgentHandoffProps
  extends Omit<React.ComponentProps<"section">, "children"> {
  agents: HandoffAgent[]
  /** Chronological: append new handoffs at the end; the newest shows on top. */
  handoffs: Handoff[]
  tasks?: HandoffTask[]
  /** A handoff card was dropped on, or confirmed for, a later agent. Update `tasks` in response. */
  onAssign?: (task: HandoffTask, agent: HandoffAgent, handoff: Handoff) => void
  /** A handoff card or task row was activated. */
  onOpen?: (target: AgentHandoffTarget) => void
  /** "Add back" was pressed on a lost item. Flip its `lost` flag in response. */
  onRestore?: (item: HandoffItem, handoff: Handoff) => void
  /** Whether handoff cards start with their item list open. */
  defaultExpanded?: boolean
  /** Milliseconds a newly added handoff stays highlighted. */
  freshDuration?: number
  labels?: AgentHandoffLabelsInput
}

function AgentHandoff({
  agents,
  handoffs,
  tasks = [],
  onAssign,
  onOpen,
  onRestore,
  defaultExpanded = true,
  freshDuration = 1800,
  labels,
  className,
  ref,
  ...props
}: AgentHandoffProps) {
  const l = mergeLabels(labels)
  const uid = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  React.useImperativeHandle(ref, () => rootRef.current as HTMLElement)

  const [picked, setPicked] = React.useState<string | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [over, setOver] = React.useState<string | null>(null)
  const [fresh, setFresh] = React.useState<ReadonlySet<string>>(new Set())
  const [message, setMessage] = React.useState("")

  const agentById = (id?: string) => agents.find((a) => a.id === id)
  const taskById = (id?: string) => tasks.find((t) => t.id === id)

  // Forward only: agents after the one that passed it on, minus the current owner.
  const targetsFor = (h: Handoff): HandoffAgent[] => {
    const task = taskById(h.taskId)
    const from = agents.findIndex((a) => a.id === h.from)
    if (!onAssign || !task || from < 0) return []
    return agents.slice(from + 1).filter((a) => a.id !== task.agent)
  }

  const pickedId = handoffs.some((h) => h.id === picked) ? picked : null
  const active = handoffs.find((h) => h.id === (pickedId ?? dragId))
  const activeTargets = active ? targetsFor(active) : []

  // Latest props for the fresh-detection effect.
  const agentsRef = React.useRef(agents)
  React.useEffect(() => {
    agentsRef.current = agents
  })
  const seen = React.useRef<Set<string> | null>(null)
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // A handoff that appears after mount is "fresh" for a moment and announced.
  React.useEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(handoffs.map((h) => h.id))
      return
    }
    const known = seen.current
    const added = handoffs.filter((h) => !known.has(h.id))
    if (added.length === 0) return
    added.forEach((h) => known.add(h.id))
    const name = (id: string) =>
      agentsRef.current.find((a) => a.id === id)?.name ?? id
    const newest = added[added.length - 1]
    setFresh((f) => new Set([...f, ...added.map((h) => h.id)]))
    setMessage(mergeLabels(labels).announceNew(newest.title, name(newest.from), name(newest.to)))
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      setFresh((f) => {
        const next = new Set(f)
        added.forEach((h) => next.delete(h.id))
        return next
      })
    }, freshDuration)
    timers.current.add(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a changed handoffs list matters
  }, [handoffs])

  // Focus: into the first valid agent on pick-up; back to the card afterwards.
  const focusBack = React.useRef<string | null>(null)
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (pickedId) {
      root
        .querySelector<HTMLElement>('[data-slot="agent-handoff-target"]')
        ?.focus({ preventScroll: true })
      return
    }
    const id = focusBack.current
    if (!id) return
    focusBack.current = null
    const card = root.querySelector<HTMLElement>(
      `[data-handoff-id="${CSS.escape(id)}"] [data-slot="agent-handoff-pick"]`,
    )
    ;(card ?? root).focus({ preventScroll: true })
  }, [pickedId])

  const pickUp = (h: Handoff) => {
    setPicked(h.id)
    setMessage(l.announcePickUp(h.title, targetsFor(h).length))
  }
  const cancel = () => {
    if (!active) return
    focusBack.current = active.id
    setPicked(null)
    setMessage(l.announceCancel(active.title))
  }
  const assign = (h: Handoff, agent: HandoffAgent) => {
    const task = taskById(h.taskId)
    if (!task || !targetsFor(h).some((a) => a.id === agent.id)) return
    focusBack.current = h.id
    setPicked(null)
    setDragId(null)
    setOver(null)
    setMessage(l.announceAssign(h.title, agent.name))
    onAssign?.(task, agent, h)
  }

  const upNext = tasks.find((t) => t.status === "todo")

  return (
    <section
      ref={rootRef}
      data-slot="agent-handoff"
      aria-label={l.root}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape" && pickedId) {
          e.stopPropagation()
          cancel()
        }
      }}
      className={cn(
        "@container relative flex w-full flex-col gap-4 text-sm text-foreground outline-none",
        className,
      )}
      {...props}
    >
      <style href="gf-agent-handoff" precedence="low">{AGENT_HANDOFF_CSS}</style>

      {pickedId && active && (
        <div
          data-slot="agent-handoff-hint"
          className="flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-primary-soft-foreground"
        >
          <span dir="auto" className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            {l.pickedHint(active.title)}
          </span>
          <Button size="sm" variant="outline" onClick={cancel}>
            {l.cancel}
          </Button>
        </div>
      )}

      <div
        data-slot="agent-handoff-relay"
        className="-m-1 flex flex-col gap-1 p-1 @min-[620px]:flex-row @min-[620px]:items-stretch @min-[620px]:overflow-x-auto"
      >
        {agents.map((agent, i) => {
          const next = agents[i + 1]
          const valid = activeTargets.some((a) => a.id === agent.id)
          const nameId = `${uid}-agent-${i}`
          const gap = next
            ? handoffs.filter((h) => h.from === agent.id).slice().reverse()
            : []
          const gapFresh = gap.some((h) => fresh.has(h.id))

          return (
            <React.Fragment key={agent.id}>
              <div
                role="group"
                aria-labelledby={nameId}
                data-slot="agent-handoff-agent"
                data-agent-id={agent.id}
                data-target={valid || undefined}
                data-over={over === agent.id || undefined}
                onDragOver={(e) => {
                  if (!dragId || !valid) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  setOver(agent.id)
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setOver((o) => (o === agent.id ? null : o))
                  }
                }}
                onDrop={(e) => {
                  if (!active || !dragId || !valid) return
                  e.preventDefault()
                  assign(active, agent)
                }}
                className={cn(
                  "flex min-w-0 flex-col gap-2 self-start rounded-xl border bg-card p-3 text-card-foreground shadow-xs transition-[border-color,box-shadow,opacity] duration-200 motion-reduce:transition-none @min-[620px]:min-w-40 @min-[620px]:flex-1",
                  active && !valid && "opacity-60",
                  valid && "border-primary/60",
                  over === agent.id && "bg-primary-soft ring-2 ring-primary/40",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Avatar size="md">
                    {agent.avatarSrc && <AvatarImage src={agent.avatarSrc} alt="" />}
                    <AvatarFallback>{initials(agent.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p
                      id={nameId}
                      data-slot="agent-handoff-name"
                      dir="auto"
                      className="truncate text-sm font-semibold"
                    >
                      {agent.name}
                    </p>
                    {(agent.role || agent.model) && (
                      <p
                        data-slot="agent-handoff-role"
                        dir="auto"
                        className="truncate text-xs text-muted-foreground"
                      >
                        {[agent.role, agent.model].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
                {agent.description && (
                  <p
                    data-slot="agent-handoff-description"
                    dir="auto"
                    className="text-xs text-muted-foreground [overflow-wrap:anywhere]"
                  >
                    {agent.description}
                  </p>
                )}
                {agent.task && (
                  <p
                    data-slot="agent-handoff-current"
                    dir="auto"
                    className="rounded-md bg-muted px-2 py-1.5 text-xs [overflow-wrap:anywhere]"
                  >
                    <span className="block text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                      {l.currentTask}
                    </span>
                    {agent.task}
                  </p>
                )}
                {i === 0 && upNext && (
                  <p
                    data-slot="agent-handoff-up-next"
                    dir="auto"
                    className="rounded-md border border-dashed px-2 py-1.5 text-xs [overflow-wrap:anywhere]"
                  >
                    <span className="block text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                      {l.upNext}
                    </span>
                    {upNext.title}
                  </p>
                )}
                {pickedId && valid && active && (
                  <Button
                    data-slot="agent-handoff-target"
                    size="sm"
                    dir="auto"
                    onClick={() => assign(active, agent)}
                    className="h-auto min-h-8 whitespace-normal py-1.5 text-start [overflow-wrap:anywhere]"
                  >
                    {l.assignTo(agent.name)}
                  </Button>
                )}
              </div>

              {next && (
                <div
                  data-slot="agent-handoff-link"
                  data-fresh={gapFresh || undefined}
                  className="group flex min-w-0 flex-col gap-2 @min-[620px]:min-w-44 @min-[620px]:flex-[1.2]"
                >
                  <div
                    aria-hidden
                    data-slot="agent-handoff-connector"
                    className="flex items-center gap-1 text-muted-foreground transition-colors group-data-[fresh]:text-primary motion-reduce:transition-none @max-[619px]:flex-col @max-[619px]:self-center @min-[620px]:mt-[1.1rem] @min-[620px]:h-8"
                  >
                    <span
                      className={cn(
                        "h-px flex-1 bg-border transition-colors group-data-[fresh]:bg-primary motion-reduce:transition-none @max-[619px]:h-3 @max-[619px]:w-px @max-[619px]:flex-none",
                        gapFresh && "gf-agent-handoff-pulse",
                      )}
                    />
                    <ArrowDown className="size-4 shrink-0 @min-[620px]:hidden" />
                    <ArrowRight className="hidden size-4 shrink-0 @min-[620px]:block rtl:-scale-x-100" />
                  </div>
                  <ul
                    aria-label={l.handoffsBetween(agent.name, next.name)}
                    data-slot="agent-handoff-list"
                    className="flex flex-col gap-2"
                  >
                    {gap.length === 0 && (
                      <li
                        data-slot="agent-handoff-empty"
                        className="rounded-lg border border-dashed px-3 py-2 text-center text-xs text-muted-foreground"
                      >
                        {l.noHandoffs}
                      </li>
                    )}
                    {gap.map((h) => (
                      <HandoffCard
                        key={h.id}
                        handoff={h}
                        labels={l}
                        uid={uid}
                        fromName={agentById(h.from)?.name ?? h.from}
                        toName={agentById(h.to)?.name ?? h.to}
                        fresh={fresh.has(h.id)}
                        picked={pickedId === h.id}
                        dragging={dragId === h.id}
                        movable={targetsFor(h).length > 0}
                        defaultExpanded={defaultExpanded}
                        onOpen={onOpen}
                        onRestore={onRestore}
                        onPick={() => (pickedId === h.id ? cancel() : pickUp(h))}
                        onDragStart={() => {
                          setPicked(null)
                          setDragId(h.id)
                        }}
                        onDragEnd={() => {
                          setDragId(null)
                          setOver(null)
                        }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div data-slot="agent-handoff-board" className="flex flex-col gap-2">
        <h3
          id={`${uid}-tasks`}
          data-slot="agent-handoff-board-title"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {l.tasks}
        </h3>
        <ul
          aria-labelledby={`${uid}-tasks`}
          data-slot="agent-handoff-tasks"
          className="divide-y overflow-hidden rounded-xl border bg-card"
        >
          {tasks.length === 0 && (
            <li className="px-3 py-3 text-center text-xs text-muted-foreground">
              {l.noTasks}
            </li>
          )}
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              agent={agentById(task.agent)}
              labels={l}
              onOpen={onOpen}
            />
          ))}
        </ul>
      </div>

      <div
        data-slot="agent-handoff-live"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {message}
      </div>
    </section>
  )
}

// ── HandoffCard ─────────────────────────────────────────────────────
interface HandoffCardProps {
  handoff: Handoff
  labels: AgentHandoffLabels
  uid: string
  fromName: string
  toName: string
  fresh: boolean
  picked: boolean
  dragging: boolean
  movable: boolean
  defaultExpanded: boolean
  onOpen?: AgentHandoffProps["onOpen"]
  onRestore?: AgentHandoffProps["onRestore"]
  onPick: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

function HandoffCard({
  handoff: h,
  labels: l,
  uid,
  fromName,
  toName,
  fresh,
  picked,
  dragging,
  movable,
  defaultExpanded,
  onOpen,
  onRestore,
  onPick,
  onDragStart,
  onDragEnd,
}: HandoffCardProps) {
  const [open, setOpen] = React.useState(defaultExpanded)
  const bodyId = `${uid}-items-${h.id}`

  return (
    <li
      data-slot="agent-handoff-card"
      data-handoff-id={h.id}
      data-fresh={fresh || undefined}
      data-picked={picked || undefined}
      data-dragging={dragging || undefined}
      draggable={movable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", h.title)
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-xs transition-[border-color,box-shadow,opacity] duration-200 motion-reduce:transition-none",
        "data-[fresh]:border-primary data-[picked]:border-primary data-[picked]:ring-2 data-[picked]:ring-ring/40 data-[dragging]:opacity-50",
        fresh && "gf-agent-handoff-pop",
      )}
    >
      <div className="flex items-start">
        <button
          type="button"
          data-slot="agent-handoff-card-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => {
            setOpen((v) => !v)
            onOpen?.({ type: "handoff", handoff: h })
          }}
          className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 rounded-lg p-2.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="min-w-0 flex-1">
            <span
              dir="auto"
              className="block text-sm font-medium [overflow-wrap:anywhere]"
            >
              {h.title}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
              <span dir="auto" className="[overflow-wrap:anywhere]">{fromName}</span>
              <ArrowRight aria-hidden className="size-3 shrink-0 rtl:-scale-x-100" />
              <span dir="auto" className="[overflow-wrap:anywhere]">{toName}</span>
              <span aria-hidden>·</span>
              <span>{l.itemCount(h.items.length)}</span>
            </span>
            {h.summary && (
              <span
                dir="auto"
                className="mt-1 block text-xs text-muted-foreground [overflow-wrap:anywhere]"
              >
                {h.summary}
              </span>
            )}
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
        {movable && (
          <button
            type="button"
            data-slot="agent-handoff-pick"
            aria-pressed={picked}
            aria-label={l.pickUp(h.title)}
            title={l.pickUp(h.title)}
            onClick={onPick}
            className="m-1.5 inline-flex size-8 shrink-0 cursor-grab touch-manipulation items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-primary aria-pressed:text-primary-foreground motion-reduce:transition-none"
          >
            <GripVertical aria-hidden className="size-4" />
          </button>
        )}
      </div>

      <div id={bodyId} hidden={!open} className="border-t px-2.5 py-2">
        {h.items.length === 0 ? (
          <p className="text-xs text-muted-foreground">{l.noItems}</p>
        ) : (
          <ul
            aria-label={l.itemsLabel(h.title)}
            data-slot="agent-handoff-items"
            className="flex flex-col gap-1"
          >
            {h.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                handoff={h}
                labels={l}
                onRestore={onRestore}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

// ── ItemRow ─────────────────────────────────────────────────────────
function ItemRow({
  item,
  handoff,
  labels: l,
  onRestore,
}: {
  item: HandoffItem
  handoff: Handoff
  labels: AgentHandoffLabels
  onRestore?: AgentHandoffProps["onRestore"]
}) {
  const [open, setOpen] = React.useState(false)
  const kind = item.kind ?? "note"
  const Icon = KIND_ICON[kind]
  const content = (
    <>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      <span className="sr-only">{l.kind[kind]}: </span>
      <span dir="auto" className="min-w-0 [overflow-wrap:anywhere]">{item.label}</span>
    </>
  )

  return (
    <li data-slot="agent-handoff-item" data-kind={kind} data-lost={item.lost || undefined}>
      {item.lost ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-slot="agent-handoff-item-lost"
              className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-start text-xs text-muted-foreground line-through outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {content}
              <span className="sr-only">({l.lost})</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            data-slot="agent-handoff-lost-reason"
            className="flex w-64 flex-col gap-2 p-3 text-sm"
          >
            <p dir="auto" className="[overflow-wrap:anywhere]">
              {item.reason ?? l.lostFallback}
            </p>
            {onRestore && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  onRestore(item, handoff)
                }}
              >
                {l.restore}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs">{content}</span>
      )}
    </li>
  )
}

// ── TaskRow ─────────────────────────────────────────────────────────
function TaskRow({
  task,
  agent,
  labels: l,
  onOpen,
}: {
  task: HandoffTask
  agent?: HandoffAgent
  labels: AgentHandoffLabels
  onOpen?: AgentHandoffProps["onOpen"]
}) {
  const { color, Icon } = STATUS[task.status]
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span dir="auto" className="block text-sm font-medium [overflow-wrap:anywhere]">
          {task.title}
        </span>
        {task.note && (
          <span
            dir="auto"
            className="mt-0.5 block text-xs text-muted-foreground [overflow-wrap:anywhere]"
          >
            {task.note}
          </span>
        )}
      </span>
      <span
        data-slot="agent-handoff-assignee"
        className="flex min-w-0 max-w-[40%] shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
      >
        {agent && (
          <Avatar size="xs">
            {agent.avatarSrc && <AvatarImage src={agent.avatarSrc} alt="" />}
            <AvatarFallback>{initials(agent.name)}</AvatarFallback>
          </Avatar>
        )}
        <span dir="auto" className="truncate">{agent?.name ?? l.unassigned}</span>
      </span>
      <Tag
        data-slot="agent-handoff-status"
        color={color}
        size="sm"
        title={l.status[task.status]}
        animation={task.status === "working" ? "spin" : undefined}
      >
        <TagIcon>
          <Icon aria-hidden />
        </TagIcon>
        <span className="@max-[760px]:sr-only">{l.status[task.status]}</span>
      </Tag>
    </>
  )
  const rowClass = "flex w-full items-center gap-3 px-3 py-2.5 text-start"

  return (
    <li data-slot="agent-handoff-task" data-status={task.status}>
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen({ type: "task", task })}
          className={cn(
            rowClass,
            "cursor-pointer outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 motion-reduce:transition-none",
          )}
        >
          {body}
        </button>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  )
}

export { AgentHandoff }

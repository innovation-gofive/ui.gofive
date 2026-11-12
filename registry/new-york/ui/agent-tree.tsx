"use client"

import * as React from "react"
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Hand,
  Loader,
  Square,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"

// ── Types ──────────────────────────────────────────────────────────

export type AgentStatus =
  | "queued"
  | "running"
  | "waiting"
  | "done"
  | "failed"
  | "stopped"

export type AgentResolveAction = "approve" | "reject" | "retry" | "dismiss"

export interface AgentTool {
  name: string
  /** Glyph for the tile. Falls back to the first two letters of `name`. */
  icon?: React.ReactNode
}

export interface AgentNode {
  /** Stable unique id across the whole tree. */
  id: string
  name: string
  /** What the agent is working on. */
  task?: string
  status: AgentStatus
  /** Epoch ms the agent started; elapsed time counts from here while running. */
  startedAt?: number
  /** Final (or paused) duration in ms. Used instead of the clock once the agent is not running. */
  duration?: number
  /** Expected total duration in ms, shown as "elapsed / total". */
  estimate?: number
  /** Cost of this agent alone. Sub-agent costs are added up by the tree. */
  cost?: number
  tools?: AgentTool[]
  /** What a `waiting` agent needs from a person. Shown in the resolve window. */
  needs?: string
  /** Why a `failed` agent failed. Shown in the resolve window. */
  error?: string
  children?: AgentNode[]
}

export type AgentStatusCounts = Record<AgentStatus, number>

export interface AgentTreeLabels {
  title: string
  /** Accessible name of the tree. */
  tree: string
  status: Record<AgentStatus, string>
  statAgents: string
  statRunning: string
  statNeedsYou: string
  statFailed: string
  statCost: string
  /** Polite announcement when the totals change. */
  announce: (t: { agents: number; running: number; needsYou: number; failed: number; cost: string }) => string
  elapsed: string
  cost: string
  /** Small caption beside a branch's rolled-up cost. */
  subtotal: string
  tools: string
  fold: (name: string) => string
  unfold: (name: string) => string
  /** One-line summary of a folded branch (descendants only). */
  branchSummary: (count: number, counts: AgentStatusCounts) => string
  review: string
  viewError: string
  needsTitle: (name: string) => string
  needsDescription: string
  failedTitle: (name: string) => string
  failedDescription: string
  noDetails: string
  approve: string
  reject: string
  retry: string
  dismiss: string
  close: string
}

const DEFAULT_LABELS: AgentTreeLabels = {
  title: "Agents",
  tree: "Agent tree",
  status: {
    queued: "Queued",
    running: "Running",
    waiting: "Needs you",
    done: "Done",
    failed: "Failed",
    stopped: "Stopped",
  },
  statAgents: "Agents",
  statRunning: "Running",
  statNeedsYou: "Needs you",
  statFailed: "Failed",
  statCost: "Total cost",
  announce: (t) =>
    `${t.agents} agents, ${t.running} running, ${t.needsYou} need you, ${t.failed} failed, total cost ${t.cost}`,
  elapsed: "Elapsed",
  cost: "Cost",
  subtotal: "with sub-agents",
  tools: "Tools",
  fold: (n) => `Fold ${n}`,
  unfold: (n) => `Unfold ${n}`,
  branchSummary: (count, c) => {
    const parts = [`${count} ${count === 1 ? "agent" : "agents"}`]
    if (c.running) parts.push(`${c.running} running`)
    if (c.waiting) parts.push(`${c.waiting} need you`)
    if (c.failed) parts.push(`${c.failed} failed`)
    if (parts.length === 1 && c.done === count) parts.push("all done")
    return parts.join(" · ")
  },
  review: "Review",
  viewError: "View error",
  needsTitle: (n) => `${n} needs you`,
  needsDescription: "This agent paused and is waiting for your decision.",
  failedTitle: (n) => `${n} failed`,
  failedDescription: "This agent stopped with an error.",
  noDetails: "No details were provided.",
  approve: "Approve",
  reject: "Reject",
  retry: "Retry",
  dismiss: "Dismiss",
  close: "Close",
}

/** Any label may be omitted; `status` may name just the statuses it renames. */
export type AgentTreeLabelsInput = Partial<Omit<AgentTreeLabels, "status">> & {
  status?: Partial<AgentTreeLabels["status"]>
}

function mergeLabels(labels?: AgentTreeLabelsInput): AgentTreeLabels {
  const l: Record<string, unknown> = { ...DEFAULT_LABELS }
  for (const k in labels) {
    const v = labels[k as keyof AgentTreeLabelsInput]
    if (v === undefined) continue
    // `status` merges per key too, so a partial map keeps the other defaults.
    l[k] =
      k === "status"
        ? { ...DEFAULT_LABELS.status, ...stripUndefined(v as object) }
        : v
  }
  return l as unknown as AgentTreeLabels
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined),
  ) as Partial<T>
}

// ── Animation + connector CSS (React 19 style hoisting deduplicates via href) ──
// Connectors are drawn per child: the elbow above a child takes that child's tone
// (`--gf-line`), the vertical continuing down to the next sibling takes the next
// sibling's tone (`--gf-next`), so a muted (queued/stopped) branch has muted lines
// all the way in. Colours are theme tokens only.
const LINES: Record<AgentStatus, [color: string, style: string]> = {
  queued: ["color-mix(in oklab, var(--border) 55%, transparent)", "dashed"],
  stopped: ["color-mix(in oklab, var(--border) 55%, transparent)", "dashed"],
  running: ["color-mix(in oklab, var(--primary) 55%, var(--border))", "solid"],
  waiting: ["color-mix(in oklab, var(--warning) 65%, var(--border))", "solid"],
  done: ["color-mix(in oklab, var(--success) 40%, var(--border))", "solid"],
  failed: ["color-mix(in oklab, var(--danger) 60%, var(--border))", "solid"],
}

const AGENT_TREE_CSS = `
  .gf-agent-tree-line{position:relative;}
  .gf-agent-tree-line::before{content:"";position:absolute;inset-inline-start:calc(var(--gf-agent-indent) / -2);top:0;width:calc(var(--gf-agent-indent) / 2);height:2rem;border-inline-start:1px var(--gf-style,solid) var(--gf-line);border-bottom:1px var(--gf-style,solid) var(--gf-line);border-end-start-radius:.5rem;}
  .gf-agent-tree-line:not(:last-child)::after{content:"";position:absolute;inset-inline-start:calc(var(--gf-agent-indent) / -2);top:2rem;bottom:0;border-inline-start:1px var(--gf-next-style,solid) var(--gf-next);}
  ${(Object.keys(LINES) as AgentStatus[])
    .map(
      (s) =>
        `.gf-agent-tree-line[data-status="${s}"]{--gf-line:${LINES[s][0]};--gf-style:${LINES[s][1]};}` +
        `.gf-agent-tree-line[data-next="${s}"]{--gf-next:${LINES[s][0]};--gf-next-style:${LINES[s][1]};}`,
    )
    .join("\n  ")}
  .gf-agent-tree-pulse{position:relative;}
  .gf-agent-tree-pulse::after{content:"";position:absolute;inset:0;border-radius:9999px;background:currentColor;animation:gf-agent-tree-ping 1.8s cubic-bezier(0,0,.2,1) infinite;}
  @keyframes gf-agent-tree-ping{0%{transform:scale(1);opacity:.45;}80%,100%{transform:scale(2.4);opacity:0;}}
  .gf-agent-tree-bar{background:linear-gradient(90deg,transparent,var(--primary),transparent);background-size:40% 100%;background-repeat:no-repeat;animation:gf-agent-tree-slide 1.8s ease-in-out infinite;}
  @keyframes gf-agent-tree-slide{from{background-position:-60% 0;}to{background-position:160% 0;}}
  .gf-agent-tree-chevron{transition:transform .2s cubic-bezier(.22,1,.36,1);}
  button[aria-expanded="true"]>.gf-agent-tree-chevron{transform:rotate(90deg);}
  [dir="rtl"] .gf-agent-tree-chevron{scale:-1 1;}
  @media (prefers-reduced-motion: reduce){
    .gf-agent-tree-pulse::after,.gf-agent-tree-bar{animation:none;}
    .gf-agent-tree-bar{background:color-mix(in oklab, var(--primary) 35%, transparent);}
    .gf-agent-tree-chevron{transition:none;}
  }
`

// ── Helpers ────────────────────────────────────────────────────────

/** m:ss, or h:mm:ss from an hour up. */
export function formatAgentTime(ms: number): string {
  const s = Math.floor(Math.max(0, ms) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const pad = (n: number) => String(n).padStart(2, "0")
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}

const USD = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})
const defaultFormatCost = (n: number) => USD.format(n)

interface Rollup {
  /** Own cost plus every descendant's. */
  cost: number
  /** Agents in the subtree, itself included. */
  size: number
  /** Status counts for the subtree, itself included. */
  counts: AgentStatusCounts
}

const emptyCounts = (): AgentStatusCounts => ({
  queued: 0,
  running: 0,
  waiting: 0,
  done: 0,
  failed: 0,
  stopped: 0,
})

function buildRollups(root: AgentNode) {
  const rollups = new Map<string, Rollup>()
  const nodes = new Map<string, AgentNode>()
  const walk = (n: AgentNode): Rollup => {
    const r: Rollup = { cost: n.cost ?? 0, size: 1, counts: emptyCounts() }
    r.counts[n.status]++
    for (const c of n.children ?? []) {
      const cr = walk(c)
      r.cost += cr.cost
      r.size += cr.size
      for (const k in cr.counts) r.counts[k as AgentStatus] += cr.counts[k as AgentStatus]
    }
    rollups.set(n.id, r)
    nodes.set(n.id, n)
    return r
  }
  walk(root)
  return { rollups, nodes }
}

/** Most urgent status present, for the dot on a folded branch. */
const URGENCY: AgentStatus[] = ["failed", "waiting", "running", "queued", "done", "stopped"]

const VISUAL: Record<
  AgentStatus,
  { icon: LucideIcon; card: string; badge: string }
> = {
  queued: {
    icon: Clock,
    card: "border-dashed bg-muted/40 text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
  running: {
    icon: Loader,
    card: "border-primary/40 bg-card",
    badge: "bg-primary-soft text-primary-soft-foreground",
  },
  waiting: {
    icon: Hand,
    card: "border-warning/60 bg-warning-soft/40",
    badge: "bg-warning-soft text-warning-soft-foreground",
  },
  done: {
    icon: CircleCheck,
    card: "bg-card",
    badge: "bg-success-soft text-success-soft-foreground",
  },
  failed: {
    icon: CircleX,
    card: "border-danger/50 bg-danger-soft/40",
    badge: "bg-danger-soft text-danger-soft-foreground",
  },
  stopped: {
    icon: Square,
    card: "border-dashed bg-muted/40 text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
}

// ── Context ────────────────────────────────────────────────────────

interface Ctx {
  l: AgentTreeLabels
  formatCost: (n: number) => string
  now?: number
  maxTools: number
  rollups: Map<string, Rollup>
  uid: string
  isCollapsed: (id: string) => boolean
  toggle: (id: string) => void
  onSelect?: (agent: AgentNode) => void
  selectedId?: string
  resolve: (id: string) => void
}

const TreeContext = React.createContext<Ctx | null>(null)

function useTree() {
  const c = React.useContext(TreeContext)
  if (!c) throw new Error("AgentTree parts must be used inside <AgentTree>")
  return c
}

// ── AgentTree ──────────────────────────────────────────────────────

export interface AgentTreeProps
  extends Omit<React.ComponentProps<"section">, "children" | "title" | "onSelect"> {
  /** The orchestrator; sub-agents nest under `children`, to any depth. */
  root: AgentNode
  /** Clicking a card calls this. Cards are only interactive when it is provided. */
  onSelect?: (agent: AgentNode) => void
  /** Highlights the card with this id (only meaningful with `onSelect`). */
  selectedId?: string
  /** Called when a person picks an action in the resolve window. */
  onResolve?: (agent: AgentNode, action: AgentResolveAction) => void
  /** Ids of folded branches (controlled). */
  collapsed?: string[]
  defaultCollapsed?: string[]
  onCollapsedChange?: (ids: string[]) => void
  /** Formats a cost. Defaults to USD with the "en" locale. */
  formatCost?: (cost: number) => string
  /** Drive the clock yourself (epoch ms), e.g. for replays. Stops the built-in ticker. */
  now?: number
  /** Tool tiles shown per card before a "+N" tile. */
  maxTools?: number
  /** Hide the summary bar. */
  hideSummary?: boolean
  labels?: AgentTreeLabelsInput
}

function AgentTree({
  root,
  onSelect,
  selectedId,
  onResolve,
  collapsed: collapsedProp,
  defaultCollapsed,
  onCollapsedChange,
  formatCost = defaultFormatCost,
  now: nowProp,
  maxTools = 4,
  hideSummary = false,
  labels,
  className,
  ref,
  ...props
}: AgentTreeProps) {
  const l = mergeLabels(labels)
  const uid = React.useId()
  const { rollups, nodes } = React.useMemo(() => buildRollups(root), [root])
  const total = rollups.get(root.id) as Rollup
  const anyRunning = total.counts.running > 0

  // Clock: ticks each second while something runs, unless the caller drives it.
  const [tick, setTick] = React.useState<number | undefined>(undefined)
  React.useEffect(() => {
    if (nowProp !== undefined || !anyRunning) return
    const step = () => setTick(Date.now())
    const first = setTimeout(step, 0)
    const id = setInterval(step, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [nowProp, anyRunning])
  const now = nowProp ?? tick

  // Folded ids: controlled or uncontrolled.
  const [inner, setInner] = React.useState<string[]>(defaultCollapsed ?? [])
  const folded = collapsedProp ?? inner
  const toggle = (id: string) => {
    const next = folded.includes(id)
      ? folded.filter((x) => x !== id)
      : [...folded, id]
    if (collapsedProp === undefined) setInner(next)
    onCollapsedChange?.(next)
  }

  // Resolve window. Derived: it closes itself once the agent stops needing it.
  const [resolvingId, setResolvingId] = React.useState<string | null>(null)
  const target = resolvingId ? nodes.get(resolvingId) : undefined
  const kind =
    target?.status === "waiting"
      ? "needs"
      : target?.status === "failed"
        ? "failed"
        : undefined
  const settle = (action: AgentResolveAction) => {
    if (target) onResolve?.(target, action)
    setResolvingId(null)
  }

  const c = total.counts
  const cost = formatCost(total.cost)
  const stats: { label: string; value: string; tone?: string }[] = [
    { label: l.statAgents, value: String(total.size) },
    { label: l.statRunning, value: String(c.running), tone: c.running ? "text-primary-soft-foreground" : undefined },
    { label: l.statNeedsYou, value: String(c.waiting), tone: c.waiting ? "text-warning-soft-foreground" : undefined },
    { label: l.statFailed, value: String(c.failed), tone: c.failed ? "text-danger-soft-foreground" : undefined },
    { label: l.statCost, value: cost },
  ]
  const titleId = `${uid}-title`

  const ctx: Ctx = {
    l,
    formatCost,
    now,
    maxTools,
    rollups,
    uid,
    isCollapsed: (id) => folded.includes(id),
    toggle,
    onSelect,
    selectedId,
    resolve: setResolvingId,
  }

  return (
    <TreeContext.Provider value={ctx}>
      <section
        ref={ref}
        data-slot="agent-tree"
        aria-labelledby={hideSummary ? undefined : titleId}
        aria-label={hideSummary ? l.tree : undefined}
        className={cn("@container w-full min-w-0 text-card-foreground", className)}
        {...props}
      >
        <style href="gf-agent-tree" precedence="low">{AGENT_TREE_CSS}</style>

        {!hideSummary && (
          <div
            data-slot="agent-tree-summary"
            className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-xl border bg-card px-4 py-3"
          >
            <h3 id={titleId} className="text-sm font-semibold">
              {l.title}
            </h3>
            <dl className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {stats.map((s) => (
                <div
                  key={s.label}
                  data-slot="agent-tree-stat"
                  className="flex items-baseline gap-1.5"
                >
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className={cn("text-sm font-medium tabular-nums", s.tone)}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p aria-live="polite" aria-atomic className="sr-only">
              {l.announce({
                agents: total.size,
                running: c.running,
                needsYou: c.waiting,
                failed: c.failed,
                cost,
              })}
            </p>
          </div>
        )}

        <div className="[--gf-agent-indent:1rem] @md:[--gf-agent-indent:1.75rem]">
          <ul role="tree" aria-label={l.tree} data-slot="agent-tree-list">
            <TreeItem node={root} level={1} />
          </ul>
        </div>

        <Dialog
          open={!!target && !!kind}
          onOpenChange={(o) => !o && setResolvingId(null)}
        >
          {target && kind && (
            <DialogContent showCloseButton={false} data-slot="agent-tree-resolve">
              <DialogHeader>
                <DialogTitle className="text-start leading-snug">
                  {kind === "needs" ? l.needsTitle(target.name) : l.failedTitle(target.name)}
                </DialogTitle>
                <DialogDescription className="text-start">
                  {kind === "needs" ? l.needsDescription : l.failedDescription}
                </DialogDescription>
              </DialogHeader>
              {target.task && (
                <p dir="auto" className="text-start text-xs text-muted-foreground [overflow-wrap:anywhere]">
                  {target.task}
                </p>
              )}
              <div
                data-slot="agent-tree-resolve-detail"
                dir="auto"
                className={cn(
                  "max-h-60 overflow-auto rounded-md border p-3 text-start text-sm whitespace-pre-wrap [overflow-wrap:anywhere]",
                  kind === "needs"
                    ? "border-warning/40 bg-warning-soft text-warning-soft-foreground"
                    : "border-danger/40 bg-danger-soft font-mono text-xs text-danger-soft-foreground",
                )}
              >
                {(kind === "needs" ? target.needs : target.error) || l.noDetails}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setResolvingId(null)}>
                  {l.close}
                </Button>
                {kind === "needs" ? (
                  <>
                    <Button variant="outline" onClick={() => settle("reject")}>
                      {l.reject}
                    </Button>
                    <Button onClick={() => settle("approve")}>{l.approve}</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => settle("dismiss")}>
                      {l.dismiss}
                    </Button>
                    <Button onClick={() => settle("retry")}>{l.retry}</Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </section>
    </TreeContext.Provider>
  )
}

// ── Tree item ──────────────────────────────────────────────────────

function TreeItem({
  node,
  level,
  nextStatus,
}: {
  node: AgentNode
  level: number
  nextStatus?: AgentStatus
}) {
  const t = useTree()
  const kids = node.children ?? []
  const branch = kids.length > 0
  const folded = branch && t.isCollapsed(node.id)
  const nameId = `${t.uid}-n-${node.id}`
  const groupId = `${t.uid}-g-${node.id}`

  return (
    <li
      role="treeitem"
      data-slot="agent-tree-item"
      data-status={node.status}
      data-next={nextStatus}
      aria-level={level}
      aria-expanded={branch ? !folded : undefined}
      aria-selected={t.onSelect ? t.selectedId === node.id : undefined}
      aria-labelledby={nameId}
      className={cn("list-none", level > 1 && "gf-agent-tree-line pt-2")}
    >
      <AgentCard
        node={node}
        branch={branch}
        folded={folded}
        nameId={nameId}
        groupId={groupId}
      />
      {branch && folded && <FoldedSummary node={node} />}
      {branch && !folded && (
        <ul
          role="group"
          id={groupId}
          data-slot="agent-tree-group"
          className="ps-(--gf-agent-indent)"
        >
          {kids.map((k, i) => (
            <TreeItem
              key={k.id}
              node={k}
              level={level + 1}
              nextStatus={kids[i + 1]?.status}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function FoldedSummary({ node }: { node: AgentNode }) {
  const t = useTree()
  const r = t.rollups.get(node.id) as Rollup
  // Descendants only: take the node itself back out.
  const counts = { ...r.counts, [node.status]: r.counts[node.status] - 1 }
  const count = r.size - 1
  const lead = URGENCY.find((s) => counts[s] > 0) ?? node.status
  const Icon = VISUAL[lead].icon

  return (
    <div className="ps-(--gf-agent-indent) pt-1.5">
      <button
        type="button"
        data-slot="agent-tree-folded"
        data-status={lead}
        aria-label={t.l.unfold(node.name)}
        onClick={() => t.toggle(node.id)}
        className={cn(
          "inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-start text-xs outline-none transition-colors hover:brightness-95 focus-visible:ring-[3px] focus-visible:ring-ring/50",
          VISUAL[lead].badge,
        )}
      >
        <Icon aria-hidden className="size-3.5 shrink-0" />
        <span dir="auto" className="[overflow-wrap:anywhere]">
          {t.l.branchSummary(count, counts)}
        </span>
      </button>
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────

function AgentCard({
  node,
  branch,
  folded,
  nameId,
  groupId,
}: {
  node: AgentNode
  branch: boolean
  folded: boolean
  nameId: string
  groupId: string
}) {
  const t = useTree()
  const { l } = t
  const v = VISUAL[node.status]
  const Icon = v.icon
  const running = node.status === "running"
  const rollup = t.rollups.get(node.id) as Rollup
  const cost = branch ? rollup.cost : node.cost
  const hasTime =
    node.startedAt != null || node.duration != null || node.estimate != null
  // Running (or no recorded duration): count from the clock; otherwise use the record.
  const elapsed =
    node.startedAt != null && (running || node.duration == null)
      ? t.now != null
        ? t.now - node.startedAt
        : undefined
      : node.duration
  const selectable = !!t.onSelect
  const tools = node.tools ?? []
  const shown = tools.slice(0, t.maxTools)
  const action =
    node.status === "waiting" ? l.review : node.status === "failed" ? l.viewError : null

  const main = (
    <>
      <span className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          id={nameId}
          dir="auto"
          className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]"
        >
          {node.name}
        </span>
        <span
          data-slot="agent-tree-status"
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            v.badge,
          )}
        >
          {running ? (
            <span aria-hidden className="gf-agent-tree-pulse inline-block size-1.5 rounded-full bg-current" />
          ) : (
            <Icon aria-hidden className="size-3" />
          )}
          {l.status[node.status]}
        </span>
      </span>
      {node.task && (
        <span
          data-slot="agent-tree-task"
          dir="auto"
          className="mt-0.5 block text-xs text-muted-foreground [overflow-wrap:anywhere]"
        >
          {node.task}
        </span>
      )}
    </>
  )

  return (
    <div
      data-slot="agent-tree-card"
      data-status={node.status}
      data-selected={(selectable && t.selectedId === node.id) || undefined}
      className={cn(
        "relative overflow-hidden rounded-lg border p-3 transition-colors",
        v.card,
        selectable && "data-[selected]:ring-2 data-[selected]:ring-ring/60",
      )}
    >
      <div className="flex items-start gap-2">
        {branch && (
          <button
            type="button"
            data-slot="agent-tree-fold"
            aria-expanded={!folded}
            aria-controls={folded ? undefined : groupId}
            aria-label={folded ? l.unfold(node.name) : l.fold(node.name)}
            onClick={() => t.toggle(node.id)}
            className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <ChevronRight aria-hidden className="gf-agent-tree-chevron size-4" />
          </button>
        )}
        {selectable ? (
          <button
            type="button"
            data-slot="agent-tree-select"
            aria-current={t.selectedId === node.id || undefined}
            onClick={() => t.onSelect?.(node)}
            className="-m-1 block min-w-0 flex-1 cursor-pointer rounded-md p-1 text-start outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {main}
          </button>
        ) : (
          <div className="min-w-0 flex-1">{main}</div>
        )}
      </div>

      <div
        data-slot="agent-tree-meta"
        className={cn(
          "mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground",
          branch && "ps-8",
        )}
      >
        {hasTime && (
          <span data-slot="agent-tree-time" className="tabular-nums">
            <span className="sr-only">{l.elapsed} </span>
            {formatAgentTime(elapsed ?? 0)}
            {node.estimate != null && ` / ${formatAgentTime(node.estimate)}`}
          </span>
        )}
        {cost != null && (
          <span data-slot="agent-tree-cost" className="tabular-nums">
            <span className="sr-only">{l.cost} </span>
            {t.formatCost(cost)}
            {branch && <span className="ms-1 opacity-70">{l.subtotal}</span>}
          </span>
        )}
        {tools.length > 0 && (
          <ul
            data-slot="agent-tree-tools"
            aria-label={l.tools}
            className="flex items-center ps-1.5"
          >
            {shown.map((tool, i) => (
              <li
                key={`${tool.name}-${i}`}
                data-slot="agent-tree-tool"
                title={tool.name}
                className="-ms-1.5 grid size-6 place-items-center rounded-full border bg-muted text-[0.625rem] font-semibold text-foreground uppercase ring-2 ring-card [&_svg]:size-3.5"
              >
                <span className="sr-only">{tool.name}</span>
                <span aria-hidden className="grid place-items-center">
                  {tool.icon ?? tool.name.slice(0, 2)}
                </span>
              </li>
            ))}
            {tools.length > shown.length && (
              <li
                data-slot="agent-tree-tool"
                className="-ms-1.5 grid h-6 min-w-6 place-items-center rounded-full border bg-card px-1 text-[0.625rem] font-semibold tabular-nums ring-2 ring-card"
              >
                +{tools.length - shown.length}
              </li>
            )}
          </ul>
        )}
        {action && (
          <Button
            data-slot="agent-tree-action"
            size="sm"
            variant="outline"
            aria-haspopup="dialog"
            onClick={() => t.resolve(node.id)}
            className="ms-auto h-7"
          >
            {action}
          </Button>
        )}
      </div>

      {running && (
        <span
          aria-hidden
          data-slot="agent-tree-progress"
          className="gf-agent-tree-bar pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
        />
      )}
    </div>
  )
}

export { AgentTree }

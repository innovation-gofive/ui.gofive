"use client"

import { useEffect, useState } from "react"
import { Calendar, FileText, Search, Mail } from "lucide-react"
import { AgentTree } from "@/registry/new-york/ui/agent-tree"
import type {
  AgentNode,
  AgentResolveAction,
  AgentStatus,
} from "@/registry/new-york/ui/agent-tree"
import { Button } from "@/registry/new-york/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Live", href: "#live", depth: 1 },
  { title: "Statuses", href: "#statuses", depth: 1 },
  { title: "Cost roll-up", href: "#cost", depth: 1 },
  { title: "Folding", href: "#folding", depth: 1 },
  { title: "Selection", href: "#selection", depth: 1 },
  { title: "Resolving", href: "#resolving", depth: 1 },
  { title: "Narrow width", href: "#narrow", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

// A fixed clock keeps the static examples identical on server and client.
const NOW = 1_700_000_000_000
const sec = (n: number) => n * 1000

const tools = {
  search: { name: "search_candidates", icon: <Search /> },
  files: { name: "read_resume", icon: <FileText /> },
  calendar: { name: "calendar", icon: <Calendar /> },
  mail: { name: "send_email", icon: <Mail /> },
}

const sample: AgentNode = {
  id: "root",
  name: "Hiring coordinator",
  task: "Fill the Senior Accountant opening",
  status: "running",
  startedAt: NOW - sec(95),
  estimate: sec(240),
  cost: 0.0312,
  tools: [tools.search, tools.mail],
  children: [
    {
      id: "screen",
      name: "Résumé screener",
      task: "Rank 42 applications against the job profile",
      status: "done",
      duration: sec(61),
      cost: 0.0184,
      tools: [tools.files],
    },
    {
      id: "schedule",
      name: "Interview scheduler",
      task: "Find slots for the top 5 candidates",
      status: "running",
      startedAt: NOW - sec(30),
      estimate: sec(90),
      cost: 0.0047,
      tools: [tools.calendar, tools.mail],
    },
  ],
}

const allStatuses: AgentNode = {
  id: "orch",
  name: "Onboarding orchestrator",
  task: "Prepare day one for a new hire",
  status: "running",
  startedAt: NOW - sec(120),
  cost: 0.01,
  children: [
    { id: "q", name: "Equipment order", task: "Waiting for the account to exist", status: "queued", estimate: sec(60) },
    { id: "r", name: "Account setup", task: "Creating mailbox and HR profile", status: "running", startedAt: NOW - sec(42), estimate: sec(120), cost: 0.0061, tools: [tools.mail] },
    { id: "w", name: "Contract signer", task: "Send the contract for signature", status: "waiting", duration: sec(75), cost: 0.0022, needs: "The contract template changed on 3 March. Send it to the candidate with the new clauses?" },
    { id: "d", name: "Welcome pack", task: "Compile the handbook", status: "done", duration: sec(48), estimate: sec(60), cost: 0.0093, tools: [tools.files] },
    { id: "f", name: "Badge printer", task: "Print the access badge", status: "failed", duration: sec(12), cost: 0.0004, error: "PrinterOffline: the badge printer at HQ-2 did not respond after 3 attempts." },
    { id: "s", name: "Parking permit", task: "Request a permit", status: "stopped", duration: sec(9), cost: 0.0003 },
  ],
}

export default function AgentTreePage() {
  return (
    <DocPage
      breadcrumb={["AI", "Agent Tree"]}
      title="Agent Tree"
      description="A live tree of an orchestrator agent and its sub-agents: status, task, time, cost and tools on every card, costs rolled up per branch, folding, and a resolve window for agents that need a person."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/agent-tree" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { AgentTree } from "@/components/ui/agent-tree"
import type { AgentNode } from "@/components/ui/agent-tree"

const root: AgentNode = {
  id: "root",
  name: "Hiring coordinator",
  status: "running",
  startedAt: Date.now(),
  children: [{ id: "a", name: "Résumé screener", status: "done", duration: 61_000, cost: 0.018 }],
}

<AgentTree root={root} onResolve={(agent, action) => {}} />`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-2xl">
          <AgentTree root={sample} now={NOW} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="live">Live</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Without <code>now</code> the tree ticks every second while an agent is running. This demo drives the
        clock itself with <code>now</code>, so it can replay a scripted run.
      </p>
      <LiveExample />

      <DocH3 id="statuses">Statuses</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Queued and stopped agents and their connectors are muted. Running animates quietly, a waiting agent
        takes the warning tone and a failed one the danger tone. Both of those get a button that opens the
        resolve window.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-2xl">
          <AgentTree root={allStatuses} now={NOW} />
        </div>
      </ComponentPreview>

      <DocH3 id="cost">Cost roll-up</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A branch shows the total of its own cost and everything below it. <code>formatCost</code> replaces the
        default USD formatter.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-2xl">
          <AgentTree
            root={sample}
            now={NOW}
            formatCost={(n) =>
              new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 2 }).format(n * 35)
            }
          />
        </div>
      </ComponentPreview>

      <DocH3 id="folding">Folding</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A folded branch becomes one line with the number of agents below it and the most urgent status.
        Own the state with <code>collapsed</code> and <code>onCollapsedChange</code>, or seed it with{" "}
        <code>defaultCollapsed</code>.
      </p>
      <FoldingExample />

      <DocH3 id="selection">Selection</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Cards are plain until you pass <code>onSelect</code>; then each card is a button.
      </p>
      <SelectionExample />

      <DocH3 id="resolving">Resolving</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The window is a modal dialog: Esc closes it. Choosing an action calls <code>onResolve</code> and closes
        it. Updating the agent&apos;s status in your data is up to you; the window also closes by itself once the
        agent no longer needs it.
      </p>
      <ResolveExample />

      <DocH3 id="narrow">Narrow width</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Indentation shrinks in narrow containers and card content wraps. This is 360 px wide.
      </p>
      <ComponentPreview>
        <div className="w-[360px] max-w-full">
          <AgentTree root={allStatuses} now={NOW} defaultCollapsed={[]} />
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is in <code>labels</code>; partial overrides keep the English defaults.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-2xl">
          <AgentTree
            root={{
              id: "r",
              name: "ผู้ประสานงานสรรหา",
              task: "หาผู้สมัครตำแหน่งนักบัญชี",
              status: "waiting",
              duration: sec(80),
              needs: "ส่งสัญญาจ้างให้ผู้สมัครหรือไม่",
              children: [{ id: "c", name: "คัดกรองเรซูเม่", status: "done", duration: sec(40) }],
            }}
            labels={{
              title: "เอเจนต์",
              tree: "แผนผังเอเจนต์",
              status: { waiting: "รอคุณ", done: "เสร็จแล้ว", running: "กำลังทำงาน" },
              statAgents: "เอเจนต์",
              statRunning: "กำลังทำงาน",
              statNeedsYou: "รอคุณ",
              statFailed: "ล้มเหลว",
              statCost: "ค่าใช้จ่ายรวม",
              review: "ตรวจสอบ",
              approve: "อนุมัติ",
              reject: "ปฏิเสธ",
              close: "ปิด",
              needsTitle: (n) => `${n} รอคุณ`,
              needsDescription: "เอเจนต์หยุดรอการตัดสินใจของคุณ",
              fold: (n) => `ยุบ ${n}`,
              unfold: (n) => `ขยาย ${n}`,
              branchSummary: (n) => `${n} เอเจนต์`,
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-agent-tree">AgentTree</DocH3>
      <PropsTable rows={[
        { prop: "root", type: "AgentNode", desc: "The orchestrator. Sub-agents nest under children, to any depth; ids must be unique across the tree" },
        { prop: "onSelect", type: "(agent: AgentNode) => void", default: "—", desc: "Makes cards clickable buttons and called with the clicked agent. Without it cards are not interactive" },
        { prop: "selectedId", type: "string", default: "—", desc: "Highlights that card and sets aria-selected (only with onSelect)" },
        { prop: "onResolve", type: "(agent: AgentNode, action: AgentResolveAction) => void", default: "—", desc: "Called when a person picks an action in the resolve window" },
        { prop: "collapsed", type: "string[]", default: "—", desc: "Controlled ids of folded branches" },
        { prop: "defaultCollapsed", type: "string[]", default: "[]", desc: "Initial folded ids when uncontrolled" },
        { prop: "onCollapsedChange", type: "(ids: string[]) => void", default: "—", desc: "Called with the next list on every fold or unfold" },
        { prop: "formatCost", type: "(cost: number) => string", default: 'USD, locale "en"', desc: "Formats every cost, including roll-ups and the total" },
        { prop: "now", type: "number", default: "—", desc: "Epoch ms driving elapsed time. When set, the built-in one second ticker is off (use it for replays)" },
        { prop: "maxTools", type: "number", default: "4", desc: "Tool tiles shown on a card before a +N tile" },
        { prop: "hideSummary", type: "boolean", default: "false", desc: "Hide the summary bar" },
        { prop: "labels", type: "AgentTreeLabelsInput", default: "English", desc: "Every user-facing string; undefined values keep the default" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root section; other section props are spread there" },
        { prop: "ref", type: "Ref<HTMLElement>", default: "—", desc: "Ref to the root section" },
      ]} />

      <DocH3 id="api-agent-node">AgentNode</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable unique id" },
        { prop: "name", type: "string", desc: "Agent name; also the treeitem's accessible name" },
        { prop: "task", type: "string", default: "—", desc: "What the agent is working on" },
        { prop: "status", type: "AgentStatus", desc: '"queued" | "running" | "waiting" | "done" | "failed" | "stopped"' },
        { prop: "startedAt", type: "number", default: "—", desc: "Epoch ms the agent started. Elapsed time counts from it while running" },
        { prop: "duration", type: "number", default: "—", desc: "Recorded duration in ms, used when the agent is not running" },
        { prop: "estimate", type: "number", default: "—", desc: "Expected total in ms, shown as elapsed / total" },
        { prop: "cost", type: "number", default: "—", desc: "Cost of this agent alone; branches show the sum of their subtree" },
        { prop: "tools", type: "AgentTool[]", default: "—", desc: "Overlapping tool tiles" },
        { prop: "needs", type: "string", default: "—", desc: "What a waiting agent needs; shown in the resolve window" },
        { prop: "error", type: "string", default: "—", desc: "Why a failed agent failed; shown in the resolve window" },
        { prop: "children", type: "AgentNode[]", default: "—", desc: "Sub-agents" },
      ]} />

      <DocH3 id="api-agent-tool">AgentTool</DocH3>
      <PropsTable rows={[
        { prop: "name", type: "string", desc: "Tool name; the tile's tooltip and screen reader text" },
        { prop: "icon", type: "ReactNode", default: "initials", desc: "Glyph for the tile; defaults to the first two letters of name" },
      ]} />

      <DocH3 id="api-types">Types and helpers</DocH3>
      <PropsTable rows={[
        { prop: "AgentStatus", type: "type", desc: '"queued" | "running" | "waiting" | "done" | "failed" | "stopped"' },
        { prop: "AgentResolveAction", type: "type", desc: '"approve" | "reject" (waiting agents) or "retry" | "dismiss" (failed agents)' },
        { prop: "AgentTreeLabelsInput", type: "type", desc: "Partial<AgentTreeLabels>, where status may also be partial" },
        { prop: "AgentStatusCounts", type: "Record<AgentStatus, number>", desc: "Passed to labels.branchSummary" },
        { prop: "AgentTreeLabels", type: "interface", desc: "title, tree, status (per-status names), statAgents, statRunning, statNeedsYou, statFailed, statCost, announce(totals), elapsed, cost, subtotal, tools, fold(name), unfold(name), branchSummary(count, counts), review, viewError, needsTitle(name), needsDescription, failedTitle(name), failedDescription, noDetails, approve, reject, retry, dismiss, close" },
        { prop: "formatAgentTime", type: "(ms: number) => string", desc: "Formats a duration as m:ss, or h:mm:ss from an hour up" },
      ]} />
    </DocPage>
  )
}

// ── Scripted run ───────────────────────────────────────────────────

const LOOP = 50

function phase(t: number, start: number, end: number): AgentStatus {
  return t < start ? "queued" : t < end ? "running" : "done"
}

function timing(t: number, start: number, end: number, rate: number, est: number) {
  const status = phase(t, start, end)
  return {
    status,
    startedAt: status === "queued" ? undefined : sec(start),
    duration: status === "done" ? sec(end - start) : undefined,
    estimate: sec(est),
    cost: Math.max(0, Math.min(t, end) - start) * rate,
  }
}

function scenario(t: number): AgentNode {
  const dup = timing(t, 4, 9, 0.0006, 6)
  const skills = timing(t, 5, 12, 0.0008, 8)
  const screen = timing(t, 2, 14, 0.0004, 12)
  const offer = t < 34 ? timing(t, 30, 99, 0.001, 8) : { status: "failed" as const, startedAt: sec(30), duration: sec(4), estimate: sec(8), cost: 0.004 }
  const schedule =
    t >= 18 && t < 28
      ? { status: "waiting" as const, duration: sec(t - 10), estimate: sec(30), cost: 0.0048 }
      : timing(t, 10, 40, 0.0005, 30)
  const root = timing(t, 0, 44, 0.0003, 44)
  return {
    id: "root",
    name: "Hiring coordinator",
    task: "Fill the Senior Accountant opening",
    ...root,
    tools: [tools.search, tools.mail],
    children: [
      {
        id: "screen",
        name: "Résumé screener",
        task: "Rank 42 applications against the job profile",
        ...screen,
        tools: [tools.files],
        children: [
          { id: "dup", name: "Duplicate checker", task: "Merge repeat applicants", ...dup },
          { id: "skills", name: "Skills matcher", task: "Score against required skills", ...skills, tools: [tools.search] },
        ],
      },
      {
        id: "schedule",
        name: "Interview scheduler",
        task: "Book slots for the top 5 candidates",
        ...schedule,
        needs: "Two interviewers have no free slot this week. Book the next Monday instead?",
        tools: [tools.calendar],
      },
      {
        id: "offer",
        name: "Offer drafter",
        task: "Draft the offer letter",
        ...offer,
        error: "TemplateError: the salary band for grade S4 is missing in the compensation table.",
        tools: [tools.files, tools.mail],
      },
      { id: "refs", name: "Reference checker", task: "Cancelled by the recruiter", status: "stopped", duration: sec(3), cost: 0.0004 },
    ],
  }
}

function LiveExample() {
  const [t, setT] = useState(0)
  const [log, setLog] = useState("")
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % LOOP), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <AgentTree
          root={scenario(t)}
          now={sec(t)}
          onResolve={(a, action) => setLog(`${a.name}: ${action}`)}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Button size="sm" variant="outline" onClick={() => setT(0)}>Restart</Button>
          <span>Replay second {t} of {LOOP}.</span>
          {log && <span>Last action: {log}</span>}
        </div>
      </div>
    </ComponentPreview>
  )
}

function FoldingExample() {
  const [collapsed, setCollapsed] = useState<string[]>(["screen"])
  const root = scenario(24)
  return (
    <ComponentPreview>
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <AgentTree root={root} now={sec(24)} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Button size="sm" variant="outline" onClick={() => setCollapsed(["root"])}>Fold all</Button>
          <Button size="sm" variant="outline" onClick={() => setCollapsed([])}>Unfold all</Button>
          <span>Folded: {collapsed.length ? collapsed.join(", ") : "none"}</span>
        </div>
      </div>
    </ComponentPreview>
  )
}

function SelectionExample() {
  const [selected, setSelected] = useState<AgentNode | null>(null)
  return (
    <ComponentPreview>
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <AgentTree root={sample} now={NOW} selectedId={selected?.id} onSelect={setSelected} />
        <p className="text-sm text-muted-foreground">
          {selected ? `Selected: ${selected.name} (${selected.status})` : "Click a card."}
        </p>
      </div>
    </ComponentPreview>
  )
}

function ResolveExample() {
  const [root, setRoot] = useState<AgentNode>(allStatuses)
  const [log, setLog] = useState("")

  const patch = (n: AgentNode, id: string, status: AgentStatus): AgentNode =>
    n.id === id
      ? { ...n, status }
      : { ...n, children: n.children?.map((c) => patch(c, id, status)) }

  const onResolve = (agent: AgentNode, action: AgentResolveAction) => {
    setLog(`${agent.name}: ${action}`)
    if (action === "approve") setRoot((r) => patch(r, agent.id, "running"))
    if (action === "reject" || action === "dismiss") setRoot((r) => patch(r, agent.id, "stopped"))
    if (action === "retry") setRoot((r) => patch(r, agent.id, "queued"))
  }

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <AgentTree root={root} now={NOW} onResolve={onResolve} />
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Button size="sm" variant="outline" onClick={() => { setRoot(allStatuses); setLog("") }}>Reset</Button>
          <span>{log ? `onResolve: ${log}` : "Open Review or View error on a card."}</span>
        </div>
      </div>
    </ComponentPreview>
  )
}

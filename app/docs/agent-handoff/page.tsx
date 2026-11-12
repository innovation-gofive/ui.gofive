"use client"

import { useEffect, useState } from "react"
import { AgentHandoff } from "@/registry/new-york/ui/agent-handoff"
import type {
  Handoff,
  HandoffAgent,
  HandoffTask,
} from "@/registry/new-york/ui/agent-handoff"
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
  { title: "Assigning work", href: "#assign", depth: 1 },
  { title: "Lost items", href: "#lost", depth: 1 },
  { title: "Live relay", href: "#live", depth: 1 },
  { title: "Narrow containers", href: "#responsive", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const AGENTS: HandoffAgent[] = [
  {
    id: "intake",
    name: "Intake",
    role: "Screening",
    model: "Fast model",
    description: "Reads applications and pulls out the key facts.",
    task: "Parsing 3 late applications",
  },
  {
    id: "review",
    name: "Review",
    role: "Evaluator",
    model: "Reasoning model",
    description: "Scores candidates against the job profile.",
    task: "Ranking the shortlist",
  },
  {
    id: "scheduler",
    name: "Scheduler",
    role: "Coordinator",
    description: "Finds interview slots and sends invitations.",
  },
]

const TASKS: HandoffTask[] = [
  { id: "t1", title: "Screen 42 applications", status: "done", agent: "intake" },
  { id: "t2", title: "Shortlist top candidates", status: "working", agent: "review", note: "8 of 12 scored" },
  { id: "t3", title: "Book interviews", status: "todo", note: "Needs the shortlist first" },
  { id: "t4", title: "Prepare offer letters", status: "warning", agent: "scheduler", note: "Waiting on budget approval" },
]

const HANDOFFS: Handoff[] = [
  {
    id: "h1",
    from: "intake",
    to: "review",
    title: "Screened applications",
    summary: "42 applications, 12 meet the minimum bar.",
    taskId: "t2",
    items: [
      { id: "i1", kind: "file", label: "applications.csv" },
      { id: "i2", kind: "fact", label: "12 candidates pass screening" },
      { id: "i3", kind: "source", label: "Job profile: Senior Accountant" },
    ],
  },
  {
    id: "h2",
    from: "review",
    to: "scheduler",
    title: "Shortlist ready",
    taskId: "t3",
    items: [
      { id: "i4", kind: "decision", label: "Top 5 go to interview" },
      { id: "i5", kind: "file", label: "scorecards.pdf" },
      { id: "i6", kind: "note", label: "Two candidates need remote interviews" },
    ],
  },
]

const LOST: Handoff[] = [
  {
    id: "h1",
    from: "intake",
    to: "review",
    title: "Screened applications",
    taskId: "t2",
    items: [
      { id: "i1", kind: "file", label: "applications.csv" },
      { id: "i2", kind: "source", label: "Referral notes from HR", lost: true, reason: "The notes were over the size limit and got cut." },
      { id: "i3", kind: "fact", label: "Salary expectations", lost: true },
    ],
  },
  {
    id: "h2",
    from: "review",
    to: "scheduler",
    title: "Shortlist ready",
    taskId: "t3",
    items: [
      { id: "i4", kind: "decision", label: "Top 5 go to interview" },
      { id: "i5", kind: "note", label: "Panel availability", lost: true, reason: "Review never saw the calendar." },
    ],
  },
]

// Scripted handoffs the live demo appends one by one.
const SCRIPT: Handoff[] = [
  {
    id: "l1",
    from: "intake",
    to: "review",
    title: "First batch screened",
    taskId: "t2",
    items: [
      { id: "l1a", kind: "file", label: "batch-1.csv" },
      { id: "l1b", kind: "fact", label: "9 candidates pass" },
    ],
  },
  {
    id: "l2",
    from: "review",
    to: "scheduler",
    title: "Interview panel proposed",
    taskId: "t3",
    items: [
      { id: "l2a", kind: "decision", label: "Two-round process" },
      { id: "l2b", kind: "note", label: "Panel lead is on leave on the 14th" },
    ],
  },
  {
    id: "l3",
    from: "intake",
    to: "review",
    title: "Late applications added",
    taskId: "t2",
    items: [
      { id: "l3a", kind: "source", label: "Careers inbox" },
      { id: "l3b", kind: "fact", label: "3 more candidates", lost: true, reason: "Duplicates of earlier applicants." },
    ],
  },
]

export default function AgentHandoffPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Agent Handoff"]}
      title="Agent Handoff"
      description="Shows one task relayed between AI agents, left to right. Handoff cards sit between neighbouring agents, list what was passed along (and what got lost), and can be moved forward to another agent by drag or by keyboard."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/agent-handoff" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { AgentHandoff } from "@/components/ui/agent-handoff"

<AgentHandoff
  agents={agents}
  handoffs={handoffs}   // oldest first; the newest shows on top
  tasks={tasks}
  onAssign={(task, agent) => assign(task.id, agent.id)}
/>`}
      />
      <ComponentPreview className="items-start">
        <div className="w-full max-w-4xl">
          <AgentHandoff agents={AGENTS} handoffs={HANDOFFS} tasks={TASKS} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="assign">Assigning work</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A card with a <code>taskId</code> can only move forward: to an agent after the one that
        passed it on, never the current owner. Drag it onto a column, or press the grip button
        (Enter or Space) to pick it up, Tab to a target and press Enter. Esc cancels. The
        component never edits <code>tasks</code> itself; update them in <code>onAssign</code>.
      </p>
      <AssignExample />

      <DocH3 id="lost">Lost items</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Items with <code>lost</code> are struck through. Activate one to read the reason. With{" "}
        <code>onRestore</code> the popover offers an add back action.
      </p>
      <LostExample />

      <DocH3 id="live">Live relay</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        New handoffs briefly highlight their connection and are announced to screen readers.
        With reduced motion the animation is skipped but the highlight stays.
      </p>
      <LiveExample />

      <DocH3 id="responsive">Narrow containers</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Layout follows the container, not the viewport. Below about 760 px task statuses become
        icon-only; below about 620 px the relay stacks into one column. Assignment works the same
        way through the pick up and Enter flow.
      </p>
      <ComponentPreview className="items-start">
        <div className="flex w-full flex-col gap-6">
          <div className="w-full max-w-[700px]">
            <AgentHandoff agents={AGENTS} handoffs={HANDOFFS} tasks={TASKS} onAssign={() => {}} />
          </div>
          <div className="w-full max-w-[360px]">
            <AgentHandoff agents={AGENTS} handoffs={HANDOFFS} tasks={TASKS} onAssign={() => {}} />
          </div>
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from the <code>labels</code> prop. <code>kind</code> and{" "}
        <code>status</code> take partial maps.
      </p>
      <ComponentPreview className="items-start">
        <div className="w-full max-w-4xl">
          <AgentHandoff
            agents={[
              { id: "a", name: "คัดกรอง", role: "ตรวจใบสมัคร" },
              { id: "b", name: "ประเมิน", role: "ให้คะแนน" },
            ]}
            handoffs={[
              {
                id: "x",
                from: "a",
                to: "b",
                title: "ใบสมัครที่ผ่านการคัดกรอง",
                taskId: "k",
                items: [
                  { id: "x1", kind: "file", label: "ใบสมัคร.csv" },
                  { id: "x2", kind: "note", label: "ประวัติการทำงาน", lost: true, reason: "ไฟล์ใหญ่เกินไป" },
                ],
              },
            ]}
            tasks={[{ id: "k", title: "ประเมินผู้สมัคร", status: "working", agent: "b" }]}
            onAssign={() => {}}
            onRestore={() => {}}
            labels={{
              root: "ส่งต่องานระหว่างเอเจนต์",
              tasks: "งาน",
              lost: "สูญหาย",
              restore: "เพิ่มกลับ",
              cancel: "ยกเลิก",
              itemCount: (n) => `${n} รายการ`,
              noHandoffs: "ยังไม่มีการส่งต่อ",
              pickUp: (t) => `ย้าย ${t} ไปยังเอเจนต์อื่น`,
              assignTo: (a) => `มอบหมายให้ ${a}`,
              status: { todo: "รอทำ", working: "กำลังทำ", done: "เสร็จ", warning: "ต้องตรวจสอบ" },
              kind: { file: "ไฟล์", note: "บันทึก" },
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-agent-handoff">AgentHandoff</DocH3>
      <PropsTable rows={[
        { prop: "agents", type: "HandoffAgent[]", desc: "One column per agent, left to right in array order" },
        { prop: "handoffs", type: "Handoff[]", desc: "Chronological. Each card sits in the column after its from agent, newest on top" },
        { prop: "tasks", type: "HandoffTask[]", default: "[]", desc: "Rows of the task board. The first todo task also shows as up next on the first agent" },
        { prop: "onAssign", type: "(task: HandoffTask, agent: HandoffAgent, handoff: Handoff) => void", default: "—", desc: "A card was dropped on, or confirmed for, a later agent. Without it nothing is movable" },
        { prop: "onOpen", type: "(target: AgentHandoffTarget) => void", default: "—", desc: "A handoff card header or a task row was activated. Task rows become buttons when set" },
        { prop: "onRestore", type: "(item: HandoffItem, handoff: Handoff) => void", default: "—", desc: "Adds the add back action to lost items" },
        { prop: "defaultExpanded", type: "boolean", default: "true", desc: "Whether cards start with their item list open" },
        { prop: "freshDuration", type: "number", default: "1800", desc: "Milliseconds a handoff added after mount stays highlighted" },
        { prop: "labels", type: "AgentHandoffLabelsInput", default: "English", desc: "root, agents, handoffsBetween, noHandoffs, itemsLabel, itemCount, noItems, kind, lost, lostFallback, restore, pickUp, assignTo, pickedHint, cancel, tasks, noTasks, unassigned, upNext, currentTask, status, announcePickUp, announceAssign, announceCancel, announceNew" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root; other section props are spread there. Pass a ref to reach the root" },
      ]} />

      <DocH3 id="api-agent">HandoffAgent</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable unique id" },
        { prop: "name", type: "string", desc: "Column heading; initials are the avatar fallback" },
        { prop: "role", type: "string", default: "—", desc: "Shown with the model on one muted line" },
        { prop: "model", type: "string", default: "—", desc: "Model name" },
        { prop: "avatarSrc", type: "string", default: "—", desc: "Avatar image URL" },
        { prop: "description", type: "string", default: "—", desc: "Short description" },
        { prop: "task", type: "string", default: "—", desc: "What the agent is doing right now" },
      ]} />

      <DocH3 id="api-handoff">Handoff</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable unique id" },
        { prop: "from", type: "string", desc: "Id of the agent that passed the work on; must not be the last agent" },
        { prop: "to", type: "string", desc: "Id of the receiving agent (display only)" },
        { prop: "title", type: "string", desc: "Card heading" },
        { prop: "summary", type: "string", default: "—", desc: "One line under the heading" },
        { prop: "items", type: "HandoffItem[]", desc: "What was passed along" },
        { prop: "taskId", type: "string", default: "—", desc: "Task this handoff moves. Required for the card to be movable" },
      ]} />

      <DocH3 id="api-item">HandoffItem</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable unique id" },
        { prop: "label", type: "string", desc: "Item text" },
        { prop: "kind", type: '"file" | "source" | "fact" | "decision" | "note"', default: '"note"', desc: "Picks the icon and the screen-reader prefix" },
        { prop: "lost", type: "boolean", default: "false", desc: "Struck through and muted; activating it opens the reason" },
        { prop: "reason", type: "string", default: "—", desc: "Why it was lost; falls back to labels.lostFallback" },
      ]} />

      <DocH3 id="api-task">HandoffTask</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable unique id" },
        { prop: "title", type: "string", desc: "Row heading" },
        { prop: "status", type: '"todo" | "working" | "done" | "warning"', desc: "Drives the Tag colour and icon; icon-only in narrow containers" },
        { prop: "agent", type: "string", default: "—", desc: "Id of the assigned agent" },
        { prop: "note", type: "string", default: "—", desc: "Muted line under the title" },
      ]} />

      <DocH3 id="api-target">AgentHandoffTarget</DocH3>
      <PropsTable rows={[
        { prop: '{ type: "handoff" }', type: "{ handoff: Handoff }", desc: "Passed to onOpen when a card header is activated" },
        { prop: '{ type: "task" }', type: "{ task: HandoffTask }", desc: "Passed to onOpen when a task row is activated" },
      ]} />
    </DocPage>
  )
}

function AssignExample() {
  const [tasks, setTasks] = useState(TASKS)
  const [log, setLog] = useState("Nothing assigned yet.")

  return (
    <ComponentPreview className="items-start">
      <div className="flex w-full max-w-4xl flex-col gap-3">
        <AgentHandoff
          agents={AGENTS}
          handoffs={HANDOFFS}
          tasks={tasks}
          onAssign={(task, agent) => {
            setTasks((ts) =>
              ts.map((t) => (t.id === task.id ? { ...t, agent: agent.id, status: "working" } : t)),
            )
            setLog(`${task.title} → ${agent.name}`)
          }}
          onOpen={(target) =>
            setLog(`Opened ${target.type === "task" ? target.task.title : target.handoff.title}`)
          }
        />
        <p className="text-sm text-muted-foreground">Last event: {log}</p>
      </div>
    </ComponentPreview>
  )
}

function LostExample() {
  const [handoffs, setHandoffs] = useState(LOST)

  return (
    <ComponentPreview className="items-start">
      <div className="w-full max-w-4xl">
        <AgentHandoff
          agents={AGENTS}
          handoffs={handoffs}
          tasks={TASKS}
          onRestore={(item, handoff) =>
            setHandoffs((hs) =>
              hs.map((h) =>
                h.id === handoff.id
                  ? { ...h, items: h.items.map((i) => (i.id === item.id ? { ...i, lost: false } : i)) }
                  : h,
              ),
            )
          }
        />
      </div>
    </ComponentPreview>
  )
}

function LiveExample() {
  const [count, setCount] = useState(0)

  // Append the next scripted handoff every few seconds, then stop.
  useEffect(() => {
    if (count >= SCRIPT.length) return
    const id = setTimeout(() => setCount((c) => c + 1), 3200)
    return () => clearTimeout(id)
  }, [count])

  return (
    <ComponentPreview className="items-start">
      <div className="flex w-full max-w-4xl flex-col gap-3">
        <AgentHandoff
          agents={AGENTS}
          handoffs={SCRIPT.slice(0, count)}
          tasks={TASKS}
          onAssign={() => {}}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCount(0)
            }}
          >
            Restart
          </Button>
          <span className="text-sm text-muted-foreground">
            {count} of {SCRIPT.length} handoffs
          </span>
        </div>
      </div>
    </ComponentPreview>
  )
}

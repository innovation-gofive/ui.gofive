"use client"

import { useEffect, useState } from "react"
import { TraceWaterfall } from "@/registry/new-york/ui/trace-waterfall"
import type { TraceSpan } from "@/registry/new-york/ui/trace-waterfall"
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
  { title: "Finished run", href: "#finished", depth: 1 },
  { title: "Live run", href: "#live", depth: 1 },
  { title: "Replay with now", href: "#replay", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Narrow container", href: "#narrow", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "Keyboard", href: "#keyboard" },
  { title: "API Reference", href: "#api-reference" },
]

// A finished run: onboarding assistant that looks up an employee, checks
// benefits in a sub-agent and fails to create a ticket.
const finished: TraceSpan[] = [
  {
    id: "run",
    name: "Onboarding assistant",
    kind: "agent",
    status: "failed",
    start: 0,
    end: 9200,
    detail: "New hire checklist",
    children: [
      {
        id: "plan",
        name: "plan",
        kind: "llm",
        status: "done",
        start: 100,
        end: 1400,
        detail: "model-large",
        tokensIn: 1240,
        tokensOut: 310,
        cost: 0.0124,
        input: "Prepare onboarding for Somchai (Finance, starts Monday).",
        output: "1. Look up the employee\n2. Check benefits\n3. Open an IT ticket",
      },
      {
        id: "lookup",
        name: "lookup_employee",
        kind: "tool",
        status: "done",
        start: 1500,
        end: 2100,
        detail: "id: 4821",
        input: '{ "id": 4821 }',
        output: '{ "name": "Somchai", "team": "Finance" }',
      },
      {
        id: "benefits",
        name: "Benefits checker",
        kind: "subagent",
        status: "done",
        start: 2200,
        end: 7400,
        children: [
          {
            id: "b-llm1",
            name: "read_request",
            kind: "llm",
            status: "done",
            start: 2300,
            end: 3900,
            tokensIn: 2100,
            tokensOut: 420,
            cost: 0.0211,
          },
          {
            id: "b-fetch",
            name: "fetch_policy",
            kind: "tool",
            status: "done",
            start: 4000,
            end: 5200,
            detail: "benefits/2026",
            output: "Policy v7: probation 119 days, health plan from day 1.",
          },
          {
            id: "b-llm2",
            name: "summarize",
            kind: "llm",
            status: "done",
            start: 5300,
            end: 7300,
            tokensIn: 3600,
            tokensOut: 780,
            cost: 0.0342,
          },
        ],
      },
      {
        id: "ticket",
        name: "create_ticket",
        kind: "tool",
        status: "failed",
        start: 7500,
        end: 8000,
        detail: "IT-onboarding",
        input: '{ "queue": "IT-onboarding" }',
        error: "403 Forbidden: the service account cannot write to this queue.",
      },
      {
        id: "draft",
        name: "draft_summary",
        kind: "llm",
        status: "done",
        start: 8100,
        end: 9200,
        tokensIn: 900,
        tokensOut: 260,
        cost: 0.0098,
      },
    ],
  },
]

// ── Live demo script ──
type Step = {
  id: string
  name: string
  kind: TraceSpan["kind"]
  start: number
  end: number
  detail?: string
  fail?: boolean
  children?: Step[]
}

const script: Step = {
  id: "run",
  name: "Leave request",
  kind: "agent",
  start: 0,
  end: 12500,
  detail: "Approve annual leave",
  children: [
    { id: "s1", name: "classify", kind: "llm", start: 200, end: 1800, detail: "model-small" },
    { id: "s2", name: "get_balance", kind: "tool", start: 1900, end: 2700, detail: "employee 118" },
    {
      id: "s3",
      name: "Policy agent",
      kind: "subagent",
      start: 2800,
      end: 9000,
      children: [
        { id: "s3a", name: "read_policy", kind: "tool", start: 2900, end: 5200 },
        { id: "s3b", name: "reason", kind: "llm", start: 5300, end: 8900 },
      ],
    },
    { id: "s4", name: "notify_manager", kind: "tool", start: 9100, end: 10400, fail: true },
    { id: "s5", name: "write_reply", kind: "llm", start: 10500, end: 12500 },
  ],
}

/** Spans of `script` as they would look at time t (ms from run start). */
function spansAt(step: Step, t: number): TraceSpan | null {
  if (t < step.start) return null
  const children = (step.children ?? [])
    .map((c) => spansAt(c, t))
    .filter((c): c is TraceSpan => c !== null)
  const done = t >= step.end
  return {
    id: step.id,
    name: step.name,
    kind: step.kind,
    detail: step.detail,
    start: step.start,
    end: done ? step.end : undefined,
    status: done ? (step.fail ? "failed" : "done") : "running",
    error: done && step.fail ? "Mail service timed out." : undefined,
    cost: done && step.kind === "llm" ? 0.0042 * ((step.end - step.start) / 1000) : undefined,
    tokensIn: done && step.kind === "llm" ? 800 : undefined,
    tokensOut: done && step.kind === "llm" ? 150 : undefined,
    children: children.length ? children : undefined,
  }
}

export default function TraceWaterfallPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Trace Waterfall"]}
      title="Trace Waterfall"
      description="One agent run as a waterfall: a foldable tree of agent, sub-agent, LLM and tool spans, each with a bar on a shared time axis. Running spans grow toward a live now line; tokens, cost and the slowest call are called out."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/trace-waterfall" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { TraceWaterfall } from "@/components/ui/trace-waterfall"
import type { TraceSpan } from "@/components/ui/trace-waterfall"

const spans: TraceSpan[] = [{
  id: "run", name: "Agent", kind: "agent", status: "done", start: 0, end: 4200,
  children: [
    { id: "a", name: "plan", kind: "llm", status: "done", start: 100, end: 1200, tokensIn: 900, tokensOut: 200, cost: 0.01 },
    { id: "b", name: "search", kind: "tool", status: "done", start: 1300, end: 4000 },
  ],
}]

<TraceWaterfall spans={spans} />`}
      />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="finished">Finished run</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Click a row (or press Enter) for its input, output, error and metrics. The slowest finished LLM or
        tool span carries a tag. A collapsed branch shows the cost and tokens of everything under it.
      </p>
      <ComponentPreview className="items-start p-4 sm:p-8">
        <TraceWaterfall spans={finished} className="max-w-3xl" />
      </ComponentPreview>

      <DocH3 id="live">Live run</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        While any span is running the component ticks its own clock, bars grow toward the now line and the
        axis widens in whole steps once the run outgrows <code>minRange</code>. This demo feeds new spans
        from a timer.
      </p>
      <LiveExample />

      <DocH3 id="replay">Replay with now</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>now</code> to stop the internal clock and drive time yourself, for example from a scrubber.
        Spans that run past <code>now</code> must still be given as running (no <code>end</code>).
      </p>
      <ReplayExample />

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>collapsed</code> and <code>openId</code> are controlled by <code>onCollapsedChange</code> and{" "}
        <code>onOpenIdChange</code>. Closing the details returns focus to the row.
      </p>
      <ControlledExample />

      <DocH3 id="narrow">Narrow container</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Below about 520 px of container width the bar moves under the label. On screens under 640 px the
        details open in a bottom sheet instead of a popover (<code>detailsMode</code>).
      </p>
      <ComponentPreview className="items-start p-4">
        <TraceWaterfall spans={finished} className="max-w-[360px]" />
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from the <code>labels</code> prop; <code>formatCost</code> replaces the default
        USD formatter.
      </p>
      <ComponentPreview className="items-start p-4 sm:p-8">
        <TraceWaterfall
          className="max-w-3xl"
          spans={finished}
          title="งานต้อนรับพนักงานใหม่"
          formatCost={(c) => `฿${(c * 35).toFixed(2)}`}
          labels={{
            done: "เสร็จสิ้น",
            failed: "ล้มเหลว",
            live: "กำลังทำงาน",
            slowest: "ช้าที่สุด",
            now: "ตอนนี้",
            kindAgent: "เอเจนต์",
            kindSubagent: "เอเจนต์ย่อย",
            kindLlm: "เรียกโมเดล",
            kindTool: "เรียกเครื่องมือ",
            statusRunning: "กำลังทำงาน",
            statusDone: "เสร็จ",
            statusFailed: "ล้มเหลว",
            tokens: (i, o) => `${i} เข้า · ${o} ออก`,
            close: "ปิด",
            metricDuration: "ระยะเวลา",
            metricCost: "ค่าใช้จ่าย",
            input: "ข้อมูลเข้า",
            output: "ผลลัพธ์",
            error: "ข้อผิดพลาด",
            announce: (s) => (s === "live" ? "กำลังทำงาน" : s === "done" ? "เสร็จสิ้น" : "ล้มเหลว"),
          }}
        />
      </ComponentPreview>

      <DocH2 id="keyboard">Keyboard</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        The tree has one tab stop (roving tabindex).
      </p>
      <PropsTable rows={[
        { prop: "Up / Down", type: "key", desc: "Move to the previous / next visible row" },
        { prop: "Home / End", type: "key", desc: "First / last visible row" },
        { prop: "Right", type: "key", desc: "Expand a collapsed branch, or move to its first child (mirrored in RTL)" },
        { prop: "Left", type: "key", desc: "Collapse an open branch, or move to the parent (mirrored in RTL)" },
        { prop: "Enter / Space", type: "key", desc: "Open or close the details for the focused span" },
        { prop: "Escape", type: "key", desc: "Close the details; focus returns to the row" },
      ]} />

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-trace-waterfall">TraceWaterfall</DocH3>
      <PropsTable rows={[
        { prop: "spans", type: "TraceSpan[]", desc: "Top-level spans, usually one agent span with children" },
        { prop: "title", type: "ReactNode", default: "labels.title", desc: "Header title" },
        { prop: "now", type: "number", default: "—", desc: "Now, in ms from run start. Omit to use the internal clock while a span runs" },
        { prop: "minRange", type: "number", default: "10000", desc: "Smallest time axis in ms; it grows in whole tick steps past this" },
        { prop: "markSlowest", type: "boolean", default: "true", desc: "Tag the slowest finished llm/tool span (needs at least two)" },
        { prop: "formatCost", type: "(cost: number) => string", default: "USD, en", desc: "Formats costs in rows, details and the header" },
        { prop: "collapsed", type: "string[]", default: "—", desc: "Controlled ids of folded branches" },
        { prop: "defaultCollapsed", type: "string[]", default: "[]", desc: "Initial folded ids when uncontrolled" },
        { prop: "onCollapsedChange", type: "(ids: string[]) => void", default: "—", desc: "Called when a branch is folded or unfolded" },
        { prop: "openId", type: "string | null", default: "—", desc: "Controlled id of the span whose details are open" },
        { prop: "defaultOpenId", type: "string | null", default: "null", desc: "Initial open details when uncontrolled" },
        { prop: "onOpenIdChange", type: "(id: string | null) => void", default: "—", desc: "Called when details open or close" },
        { prop: "detailsMode", type: '"auto" | "popover" | "sheet"', default: '"auto"', desc: "Details container; auto uses a bottom sheet under 640 px viewport width" },
        { prop: "labels", type: "Partial<TraceWaterfallLabels>", default: "English", desc: "See the labels table below" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root (a container-query root); other div props are spread there" },
      ]} />

      <DocH3 id="api-trace-span">TraceSpan</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Unique across the whole tree" },
        { prop: "name", type: "string", desc: "Row title" },
        { prop: "kind", type: '"agent" | "subagent" | "llm" | "tool"', desc: "Sets the bar tone and default icon" },
        { prop: "status", type: '"running" | "done" | "failed"', desc: "Running spans have no end and grow to now; failed bars use the danger tone" },
        { prop: "start", type: "number", desc: "Ms from run start" },
        { prop: "end", type: "number", default: "—", desc: "Ms from run start; leave out while running" },
        { prop: "detail", type: "string", default: "—", desc: "Muted text after the name" },
        { prop: "icon", type: "ReactNode", default: "per kind", desc: "Leading glyph" },
        { prop: "cost", type: "number", default: "—", desc: "This span's own cost. Totals are summed over all spans, so do not repeat children's cost on the parent" },
        { prop: "tokensIn / tokensOut", type: "number", default: "—", desc: "This span's own token counts" },
        { prop: "input / output / error", type: "string", default: "—", desc: "Short previews shown in the details" },
        { prop: "children", type: "TraceSpan[]", default: "—", desc: "Nested spans; makes the row foldable" },
      ]} />

      <DocH3 id="api-trace-labels">TraceWaterfallLabels</DocH3>
      <PropsTable rows={[
        { prop: "title, live, done, failed", type: "string", default: "English", desc: "Header title and run-state text" },
        { prop: "announce", type: "(state: TraceRunState) => string", default: "English", desc: "Polite announcement when the run state changes" },
        { prop: "treeLabel, empty, now, slowest", type: "string", default: "English", desc: "Tree name, empty text, now marker, slowest tag" },
        { prop: "kindAgent, kindSubagent, kindLlm, kindTool", type: "string", default: "English", desc: "Kind names used in row names and details" },
        { prop: "statusRunning, statusDone, statusFailed", type: "string", default: "English", desc: "Status names used in row names and details" },
        { prop: "rowLabel", type: "({ name, kind, status, duration, cost? }) => string", default: "joined by commas", desc: "Accessible name of a row" },
        { prop: "tokens", type: "(tokensIn, tokensOut) => string", default: '"1.2K in · 340 out"', desc: "Token summary in rows and the header" },
        { prop: "metricStart, metricEnd, metricDuration, metricCost, metricTokensIn, metricTokensOut", type: "string", default: "English", desc: "Metric names in the details" },
        { prop: "input, output, error, close", type: "string", default: "English", desc: "Details section names and close button name" },
      ]} />

      <DocH3 id="api-trace-helpers">Helpers and types</DocH3>
      <PropsTable rows={[
        { prop: "formatTraceDuration", type: "(ms: number) => string", desc: "Compact duration used for bars and ticks: 420 ms, 3.4s, 12s, 2m 05s" },
        { prop: "TraceSpanKind", type: "type", desc: '"agent" | "subagent" | "llm" | "tool"' },
        { prop: "TraceSpanStatus", type: "type", desc: '"running" | "done" | "failed"' },
        { prop: "TraceRunState", type: "type", desc: '"live" | "done" | "failed"; derived: live if any span runs, else failed if a top-level span failed' },
      ]} />
    </DocPage>
  )
}

function LiveExample() {
  const [t, setT] = useState(0)
  const [run, setRun] = useState(0)
  const total = script.end

  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const elapsed = performance.now() - start
      setT(Math.min(elapsed, total))
      if (elapsed >= total) clearInterval(id)
    }, 250)
    return () => clearInterval(id)
  }, [run, total])

  const root = spansAt(script, t)
  return (
    <ComponentPreview className="items-start p-4 sm:p-8">
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <TraceWaterfall spans={root ? [root] : []} />
        <div>
          <Button size="sm" variant="outline" onClick={() => {
            setT(0)
            setRun((r) => r + 1)
          }}>Restart</Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

function ReplayExample() {
  const [now, setNow] = useState(4000)
  const root = spansAt(script, now)
  return (
    <ComponentPreview className="items-start p-4 sm:p-8">
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <TraceWaterfall spans={root ? [root] : []} now={now} />
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Time
          <input
            type="range"
            min={0}
            max={script.end}
            step={100}
            value={now}
            onChange={(e) => setNow(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-14 tabular-nums">{(now / 1000).toFixed(1)}s</span>
        </label>
      </div>
    </ComponentPreview>
  )
}

function ControlledExample() {
  const [collapsed, setCollapsed] = useState<string[]>(["benefits"])
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <ComponentPreview className="items-start p-4 sm:p-8">
      <div className="flex w-full max-w-3xl flex-col gap-3">
        <TraceWaterfall
          spans={finished}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          openId={openId}
          onOpenIdChange={setOpenId}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Folded: {collapsed.join(", ") || "none"}; details: {openId ?? "closed"}</span>
          <Button size="sm" variant="outline" onClick={() => setCollapsed([])}>Unfold all</Button>
          <Button size="sm" variant="outline" onClick={() => setOpenId("ticket")}>Show failure</Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

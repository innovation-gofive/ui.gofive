"use client"

import { useEffect, useState } from "react"
import { Building2, FileText, Users } from "lucide-react"
import { ThinkingSteps } from "@/registry/new-york/ui/thinking-steps"
import type { ThinkingSource, ThinkingStep } from "@/registry/new-york/ui/thinking-steps"
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
  { title: "Live stream", href: "#live-stream", depth: 1 },
  { title: "Demo mode", href: "#demo", depth: 1 },
  { title: "Many sources", href: "#sources", depth: 1 },
  { title: "Controlled open", href: "#controlled", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const policySources: ThinkingSource[] = [
  { title: "Leave policy 2025", domain: "HR handbook", url: "https://example.com/hr/leave-policy", snippet: "Full-time employees accrue 1.25 days of paid leave per month of service." },
  { title: "Carry-over rules", domain: "HR handbook", url: "https://example.com/hr/carry-over", snippet: "Up to 5 unused days may be carried into the next calendar year." },
  { title: "Employee directory", domain: "Intranet", icon: <Users />, snippet: "Internal directory of teams and managers." },
  { title: "Onboarding checklist", domain: "Intranet", icon: <FileText />, snippet: "Documents every new hire completes in the first week." },
  { title: "Branch holiday calendar", url: "https://example.com/hr/holidays" },
  { title: "Head office notice", icon: <Building2 /> },
]

const script: ThinkingStep[] = [
  { id: "t1", kind: "thought", text: "The question is about unused leave at year end, so I need the carry-over rules." },
  { id: "s1", kind: "search", query: "paid leave carry-over policy", sources: policySources },
  { id: "t2", kind: "thought", text: "Five days carry over; anything above that expires on 31 December." },
  { id: "s2", kind: "search", query: "leave balance expiry date", sources: policySources.slice(0, 2) },
]

export default function ThinkingStepsPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Thinking Steps"]}
      title="Thinking Steps"
      description="A collapsible panel that shows an AI's reasoning while it works: a live timer in the header and an ordered list of search and thought steps. Unlike Thinking Indicator (one status pill that cycles a phase label), this is the larger panel with the full trail of steps and their sources."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/thinking-steps" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ThinkingSteps } from "@/components/ui/thinking-steps"

<ThinkingSteps steps={steps} done={finished} onDone={(s) => log(s)} />`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-xl">
          <ThinkingSteps steps={script} done elapsed={14} />
        </div>
      </ComponentPreview>
      <p className="mt-2 text-sm text-muted-foreground">
        With <code>done</code> true on mount there is nothing to time, so pass <code>elapsed</code>{" "}
        (seconds) to show the saved duration. Open and closed state belongs to the header button.
      </p>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="live-stream">Live stream</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Controlled mode: pass the steps received so far and flip <code>done</code> when the stream
        ends. The last step shows a spinner while work continues, the timer stops on completion and{" "}
        <code>onDone</code> fires once with the seconds elapsed.
      </p>
      <StreamExample />

      <DocH3 id="demo">Demo mode</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>demo</code> reveals <code>steps</code> one by one every <code>delay</code> ms, finishes,
        and restarts after <code>loopDelay</code> when <code>loop</code> is set. Handy for marketing
        pages and storybooks.
      </p>
      <ComponentPreview className="min-h-[260px]">
        <div className="w-full max-w-xl">
          <ThinkingSteps steps={script} demo loop delay={1800} />
        </div>
      </ComponentPreview>

      <DocH3 id="sources">Many sources</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Sources past <code>maxSources</code> collapse into a &ldquo;+N more&rdquo; chip that reveals the
        rest. Chips with a <code>url</code> open in a new tab; hover or focus any chip for its title,
        site and snippet.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <ThinkingSteps
            steps={[{ kind: "search", query: "paid leave carry-over policy", sources: policySources }]}
            done
            elapsed={6}
            maxSources={3}
            doneLabel="Answer ready"
          />
        </div>
      </ComponentPreview>

      <DocH3 id="controlled">Controlled open</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>open</code> and <code>onOpenChange</code> to own the state, or{" "}
        <code>defaultOpen=&#123;false&#125;</code> to start collapsed.
      </p>
      <ControlledExample />

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from <code>labels</code> (and <code>doneLabel</code>), including the timer units.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <ThinkingSteps
            steps={[
              { kind: "thought", text: "ต้องตรวจสอบนโยบายวันลาพักร้อนก่อน" },
              { kind: "search", query: "นโยบายวันลาพักร้อน", sources: policySources.slice(0, 2) },
            ]}
            done
            elapsed={75}
            doneLabel="เสร็จสิ้นการคิด"
            labels={{
              doneTitle: (t) => `คิดเป็นเวลา ${t}`,
              steps: (n) => `${n} ขั้นตอน`,
              search: "ค้นหา",
              thought: "ความคิด",
              list: "ขั้นตอนการให้เหตุผล",
              newTab: "(เปิดในแท็บใหม่)",
              units: { s: " วิ", m: " น.", h: " ชม.", d: " วัน" },
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-thinking-steps">ThinkingSteps</DocH3>
      <PropsTable rows={[
        { prop: "steps", type: "ThinkingStep[]", desc: "Controlled: the steps revealed so far. Demo: the full script. Give steps an id for stable keys" },
        { prop: "done", type: "boolean", default: "false", desc: "Controlled mode: work finished. Stops the timer, shows the completion row, fires onDone once. Ignored when demo is set" },
        { prop: "demo", type: "boolean", default: "false", desc: "Reveal steps on a timer, then finish" },
        { prop: "delay", type: "number", default: "1600", desc: "Demo: ms between reveals (floor 150)" },
        { prop: "loop", type: "boolean", default: "false", desc: "Demo: restart after finishing" },
        { prop: "loopDelay", type: "number", default: "2400", desc: "Demo: pause in ms before a loop restarts" },
        { prop: "doneLabel", type: "string", default: '"Finished thinking"', desc: "Text of the completion row" },
        { prop: "elapsed", type: "number", default: "—", desc: "Seconds to display when done is already true on mount (a saved transcript)" },
        { prop: "onDone", type: "(seconds: number) => void", default: "—", desc: "Fires once per run when work finishes, with whole seconds elapsed" },
        { prop: "maxSources", type: "number", default: "4", desc: "Sources shown per search step before the +N more chip" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state" },
        { prop: "defaultOpen", type: "boolean", default: "true", desc: "Initial open state when uncontrolled" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called on every header toggle" },
        { prop: "labels", type: "Partial<ThinkingStepsLabels>", default: "English", desc: "working, doneTitle(time), steps(count), search, thought, moreSources(count), fewerSources, newTab, list, announceStep(step, index), announceDone(time), units" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root; other div props are spread there" },
        { prop: "ref", type: "Ref<HTMLDivElement>", default: "—", desc: "Forwarded to the root" },
      ]} />

      <DocH3 id="api-thinking-step">ThinkingStep</DocH3>
      <PropsTable rows={[
        { prop: "kind", type: '"search" | "thought"', desc: "Discriminates the shape below" },
        { prop: "id", type: "string | number", default: "index", desc: "Stable React key" },
        { prop: "query", type: "string", desc: "search only: what was searched for" },
        { prop: "sources", type: "ThinkingSource[]", default: "—", desc: "search only: results shown as chips" },
        { prop: "text", type: "string", desc: "thought only: the reasoning note" },
      ]} />

      <DocH3 id="api-thinking-source">ThinkingSource</DocH3>
      <PropsTable rows={[
        { prop: "title", type: "string", desc: "Chip text and tooltip heading" },
        { prop: "domain", type: "string", default: "from url", desc: "Site or system name in the tooltip" },
        { prop: "url", type: "string", default: "—", desc: "Makes the chip an external link (new tab, rel noopener noreferrer)" },
        { prop: "favicon", type: "string", default: "—", desc: "Image URL for the chip glyph; wins over icon" },
        { prop: "icon", type: "ReactNode", default: "Globe", desc: "Lucide glyph when there is no favicon" },
        { prop: "snippet", type: "string", default: "—", desc: "Excerpt in the tooltip" },
      ]} />
    </DocPage>
  )
}

function StreamExample() {
  const [run, setRun] = useState(0)
  const [shown, setShown] = useState(0)
  const [seconds, setSeconds] = useState<number | null>(null)
  const done = shown > script.length

  useEffect(() => {
    if (shown > script.length) return
    const t = setTimeout(() => setShown((n) => n + 1), 1500)
    return () => clearTimeout(t)
  }, [shown, run])

  return (
    <ComponentPreview className="min-h-[260px]">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ThinkingSteps
          key={run}
          steps={script.slice(0, shown)}
          done={done}
          doneLabel="Ready to answer"
          onDone={setSeconds}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShown(0)
              setSeconds(null)
              setRun((r) => r + 1)
            }}
          >
            Restart
          </Button>
          <span>onDone: {seconds === null ? "pending" : `${seconds}s`}</span>
        </div>
      </div>
    </ComponentPreview>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ThinkingSteps steps={script.slice(0, 2)} done elapsed={9} open={open} onOpenChange={setOpen} />
        <p className="text-sm text-muted-foreground">
          State: {open ? "open" : "closed"}{" "}
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>Toggle</Button>
        </p>
      </div>
    </ComponentPreview>
  )
}

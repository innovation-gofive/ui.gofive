"use client"

import { useState } from "react"
import { ThinkingIndicator, formatElapsed } from "@/registry/new-york/ui/thinking-indicator"
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
  { title: "Custom phases", href: "#custom-phases", depth: 1 },
  { title: "Looping", href: "#looping", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Done", href: "#done", depth: 1 },
  { title: "Variants & sizes", href: "#variants-sizes", depth: 1 },
  { title: "Narrow container", href: "#narrow-container", depth: 1 },
  { title: "Localizing", href: "#localizing", depth: 1 },
  { title: "Accessibility", href: "#accessibility" },
  { title: "API Reference", href: "#api-reference" },
]

const STREAM_PHASES = ["Reading the request", "Searching leave policy", "Checking balances", "Writing the answer"]

export default function ThinkingIndicatorPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Thinking Indicator"]}
      title="Thinking Indicator"
      description="A small status pill for AI replies: an animated spinner, a shimmering label that rolls through work phases, and a check with a completion message when finished."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/thinking-indicator" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ThinkingIndicator } from "@/components/ui/thinking-indicator"

<ThinkingIndicator />`}
      />
      <ComponentPreview className="min-h-[100px]">
        <ThinkingIndicator />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="custom-phases">Custom phases</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass your own labels and a per-phase <code>interval</code> (ms). The last phase is held until work finishes.
      </p>
      <ComponentPreview>
        <ThinkingIndicator phases={STREAM_PHASES} interval={1600} />
      </ComponentPreview>

      <DocH3 id="looping">Looping</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Use <code>loop</code> to wrap back to the first phase for long-running work.
      </p>
      <ComponentPreview>
        <ThinkingIndicator phases={["Syncing employees", "Syncing payroll", "Syncing attendance"]} interval={1400} loop />
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Give <code>phase</code> an index and the timer is disabled — drive it from your own stream events.
      </p>
      <ControlledExample />

      <DocH3 id="done">Done</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>done</code> to swap the spinner for a check. The default label reports the elapsed time; pass a
        string or a function of the elapsed seconds to override it. Toggling <code>done</code> back off restarts the indicator.
      </p>
      <DoneExample />

      <DocH3 id="variants-sizes">Variants & sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>pill</code> has its own surface; <code>plain</code> drops the chrome to sit inside a chat bubble.
      </p>
      <ComponentPreview>
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <ThinkingIndicator size="sm" />
            <ThinkingIndicator size="md" />
          </div>
          <div className="max-w-xs rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
            <ThinkingIndicator variant="plain" phases={["Working on it", "Almost there"]} />
          </div>
        </div>
      </ComponentPreview>

      <DocH3 id="narrow-container">Narrow container</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        When the parent is too narrow the label is truncated with an ellipsis; the full text stays in the native <code>title</code> tooltip.
      </p>
      <ComponentPreview>
        <div className="w-44">
          <ThinkingIndicator phases={["Cross-checking the details against every policy"]} />
        </div>
      </ComponentPreview>

      <DocH3 id="localizing">Localizing</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is a prop. Use <code>formatElapsed</code> with your own unit suffixes inside <code>doneLabel</code>.
      </p>
      <ComponentPreview>
        <ThinkingIndicator
          done
          doneLabel={(s) => `ทำงานเสร็จใน ${formatElapsed(s, { s: " วิ", m: " นาที", h: " ชม.", d: " วัน" })}`}
        />
      </ComponentPreview>

      <DocH2 id="accessibility">Accessibility</DocH2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>The root is a polite <code>role=&quot;status&quot;</code> live region, so each new label is announced once without interrupting.</li>
        <li>The spinner, the check and the outgoing label are hidden from assistive tech.</li>
        <li>Prefer intervals of a second or more — every phase change is announced.</li>
        <li>With <code>prefers-reduced-motion</code> the spinner is static, the shimmer is off and labels swap without rolling.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-thinking-indicator">ThinkingIndicator</DocH3>
      <PropsTable rows={[
        { prop: "phases", type: "string[]", default: "4 built-in steps", desc: "Ordered labels shown while working. Missing or empty falls back to the built-in list" },
        { prop: "interval", type: "number", default: "2200", desc: "Milliseconds per phase in timer mode. Invalid values use the default; minimum 200" },
        { prop: "phase", type: "number", default: "—", desc: "Controlled phase index (floored, clamped to range). A finite value disables the timer" },
        { prop: "loop", type: "boolean", default: "false", desc: "Timer mode: wrap to the first phase after the last instead of holding it" },
        { prop: "done", type: "boolean", default: "false", desc: "Finished: check icon, no shimmer, label becomes doneLabel. Turning it off restarts" },
        { prop: "doneLabel", type: "string | (seconds: number) => string", default: '"Finished in {time}"', desc: "Label once done. A function receives the whole seconds elapsed (minimum 1), frozen when done turns true" },
        { prop: "size", type: '"sm" | "md"', default: '"md"', desc: "Height, type scale and icon size (28 / 32 px pill)" },
        { prop: "variant", type: '"pill" | "plain"', default: '"pill"', desc: "pill has a bordered surface; plain has no chrome, for use inside another surface" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root. Other span attributes are spread onto it too" },
      ]} />
      <DocH3 id="api-format-elapsed">formatElapsed</DocH3>
      <PropsTable rows={[
        { prop: "seconds", type: "number", default: "—", desc: "Duration to format: 42s, 3m 05s, 2h 07m, 1d 4h" },
        { prop: "units", type: "{ s: string; m: string; h: string; d: string }", default: '{ s: "s", m: "m", h: "h", d: "d" }', desc: "Unit suffixes, for localization" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [phase, setPhase] = useState(0)
  const last = STREAM_PHASES.length - 1

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <ThinkingIndicator phases={STREAM_PHASES} phase={phase} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={phase === 0} onClick={() => setPhase((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={phase === last} onClick={() => setPhase((p) => Math.min(last, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

function DoneExample() {
  const [done, setDone] = useState(false)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <ThinkingIndicator done={done} phases={["Reading the request", "Drafting a reply"]} interval={1500} />
        <Button variant="outline" size="sm" onClick={() => setDone((d) => !d)}>
          {done ? "Restart" : "Finish"}
        </Button>
      </div>
    </ComponentPreview>
  )
}

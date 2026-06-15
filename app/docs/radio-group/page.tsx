"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york/ui/radio-group"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "States", href: "#states", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Vertical group", href: "#group", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function RadioGroupPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Radio Group"]}
      title="Radio Group"
      description="A set of mutually exclusive options where only one can be selected at a time — built on Radix with primary-themed selection, hover, focus, and disabled states."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/radio-group" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`}
      />
      <ComponentPreview
        className="min-h-[120px]"
        code={`<RadioGroup defaultValue="daily">
  <label className="flex items-center gap-2.5 text-sm">
    <RadioGroupItem value="realtime" /> Real-time
  </label>
  <label className="flex items-center gap-2.5 text-sm">
    <RadioGroupItem value="daily" /> Daily digest
  </label>
  <label className="flex items-center gap-2.5 text-sm">
    <RadioGroupItem value="weekly" /> Weekly summary
  </label>
</RadioGroup>`}
      >
        <RadioGroup defaultValue="daily">
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="realtime" /> Real-time
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="daily" /> Daily digest
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="weekly" /> Weekly summary
          </label>
        </RadioGroup>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="states">States</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Selected, unselected, and disabled options.</p>
      <ComponentPreview>
        <RadioGroup defaultValue="selected" className="gap-3">
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="option" /> Option
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="selected" /> Selected
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <RadioGroupItem value="disabled" disabled /> Disabled
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <RadioGroupItem value="locked" disabled /> Disabled (selected)
          </label>
        </RadioGroup>
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Drive the selected value from state.</p>
      <ControlledExample />

      <DocH3 id="group">Vertical group</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A labeled group with a hint and a Pro-only disabled option.</p>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl border bg-muted/30 p-4">
          <div className="text-sm font-semibold">Notification frequency</div>
          <div className="text-xs text-muted-foreground">How often should we send you summaries?</div>
          <RadioGroup defaultValue="daily" className="mt-3 gap-2.5">
            <label className="flex items-center gap-2.5 text-sm">
              <RadioGroupItem value="realtime" /> Real-time
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <RadioGroupItem value="daily" /> Daily digest
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <RadioGroupItem value="weekly" /> Weekly summary
            </label>
            <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <RadioGroupItem value="monthly" disabled /> Monthly (Pro only)
            </label>
          </RadioGroup>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-radio-group">RadioGroup</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Wraps Radix <code className="font-mono text-[12px]">RadioGroup.Root</code> — the container for the options.
      </p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled selected value" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Fires when the selection changes" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disables every item in the group" },
        { prop: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', desc: "Arrow-key navigation direction" },
        { prop: "name", type: "string", default: "—", desc: "Name submitted with the form" },
      ]} />

      <DocH3 id="api-radio-group-item">RadioGroupItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">An individual selectable option.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Required — the value this item represents" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Prevents selecting this single item" },
        { prop: "id", type: "string", default: "—", desc: "Associates the item with an external label" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [value, setValue] = useState("card")

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <RadioGroup value={value} onValueChange={setValue} className="gap-3">
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="card" /> Credit card
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="promptpay" /> PromptPay
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <RadioGroupItem value="bank" /> Bank transfer
          </label>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground">{value}</span></p>
      </div>
    </ComponentPreview>
  )
}

"use client"

import { Slider } from "@/registry/new-york/ui/slider"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Default", href: "#default", depth: 1 },
  { title: "Range", href: "#range", depth: 1 },
  { title: "Steps", href: "#steps", depth: 1 },
  { title: "Disabled", href: "#disabled", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SliderPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Slider"]}
      title="Slider"
      description="A horizontal input for selecting a value or range from within a given interval, built on the Radix Slider primitive."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/slider" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Slider } from "@/components/ui/slider"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-md">
          <Slider defaultValue={[55]} max={100} step={1} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A single thumb selecting one value. Pass <code>showValue</code> to render the current value.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Slider defaultValue={[55]} max={100} step={1} showValue />
        </div>
      </ComponentPreview>

      <DocH3 id="range">Range</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass two values to render a range with two thumbs.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Slider defaultValue={[25, 75]} max={100} step={1} showValue />
        </div>
      </ComponentPreview>

      <DocH3 id="steps">Steps</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Use <code>step</code> to constrain the value to fixed increments.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Slider defaultValue={[40]} max={100} step={10} showValue />
        </div>
      </ComponentPreview>

      <DocH3 id="disabled">Disabled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>disabled</code> to prevent interaction.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Slider defaultValue={[55]} max={100} step={1} disabled />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-slider">Slider</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "number[]", default: "—", desc: "Controlled value(s); one entry per thumb" },
        { prop: "defaultValue", type: "number[]", default: "—", desc: "Initial value(s) when uncontrolled" },
        { prop: "min", type: "number", default: "0", desc: "Minimum value in the range" },
        { prop: "max", type: "number", default: "100", desc: "Maximum value in the range" },
        { prop: "step", type: "number", default: "1", desc: "Stepping interval" },
        { prop: "onValueChange", type: "(value: number[]) => void", default: "—", desc: "Called as the value changes" },
        { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "Slider orientation" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Prevent interaction" },
        { prop: "showValue", type: "boolean", default: "false", desc: "Render the current value(s) as a label" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

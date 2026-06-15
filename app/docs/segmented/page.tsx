"use client"

import { CalendarDays, LayoutGrid, List, Rows3 } from "lucide-react"

import { Segmented, SegmentedItem } from "@/registry/new-york/ui/segmented"
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
  { title: "With icons", href: "#with-icons", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Full width", href: "#full-width", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SegmentedPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Segmented"]}
      title="Segmented Control"
      description="An inline tab-like switch for choosing between a small set of mutually exclusive options — controllable or uncontrolled."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/segmented" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Segmented, SegmentedItem } from "@/components/ui/segmented"

<Segmented defaultValue="week">
  <SegmentedItem value="day">Day</SegmentedItem>
  <SegmentedItem value="week">Week</SegmentedItem>
  <SegmentedItem value="month">Month</SegmentedItem>
</Segmented>`}
      />
      <ComponentPreview className="min-h-[100px]">
        <Segmented defaultValue="week">
          <SegmentedItem value="day">Day</SegmentedItem>
          <SegmentedItem value="week">Week</SegmentedItem>
          <SegmentedItem value="month">Month</SegmentedItem>
        </Segmented>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The active option gets a white background, subtle shadow and semibold label.</p>
      <ComponentPreview>
        <Segmented defaultValue="day">
          <SegmentedItem value="day">Day</SegmentedItem>
          <SegmentedItem value="week">Week</SegmentedItem>
          <SegmentedItem value="month">Month</SegmentedItem>
        </Segmented>
      </ComponentPreview>

      <DocH3 id="with-icons">With icons</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Items can include icons alongside (or instead of) a text label.</p>
      <ComponentPreview>
        <Segmented defaultValue="grid">
          <SegmentedItem value="grid">
            <LayoutGrid />
            Grid
          </SegmentedItem>
          <SegmentedItem value="list">
            <List />
            List
          </SegmentedItem>
          <SegmentedItem value="rows">
            <Rows3 />
            Rows
          </SegmentedItem>
        </Segmented>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three sizes are available via the <code>size</code> prop.</p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-3">
          <Segmented size="sm" defaultValue="week">
            <SegmentedItem value="day">Day</SegmentedItem>
            <SegmentedItem value="week">Week</SegmentedItem>
            <SegmentedItem value="month">Month</SegmentedItem>
          </Segmented>
          <Segmented size="md" defaultValue="week">
            <SegmentedItem value="day">Day</SegmentedItem>
            <SegmentedItem value="week">Week</SegmentedItem>
            <SegmentedItem value="month">Month</SegmentedItem>
          </Segmented>
          <Segmented size="lg" defaultValue="week">
            <SegmentedItem value="day">Day</SegmentedItem>
            <SegmentedItem value="week">Week</SegmentedItem>
            <SegmentedItem value="month">Month</SegmentedItem>
          </Segmented>
        </div>
      </ComponentPreview>

      <DocH3 id="full-width">Full width</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Set <code>fullWidth</code> to stretch the control and distribute items evenly.</p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Segmented fullWidth defaultValue="upcoming">
            <SegmentedItem value="all">
              <CalendarDays />
              All
            </SegmentedItem>
            <SegmentedItem value="upcoming">Upcoming</SegmentedItem>
            <SegmentedItem value="past">Past</SegmentedItem>
          </Segmented>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-segmented">Segmented</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled selected value" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when the selection changes" },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Control height and text size" },
        { prop: "fullWidth", type: "boolean", default: "false", desc: "Stretch to fill width with evenly sized items" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-segmenteditem">SegmentedItem</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Unique value for this option" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Label and/or icon content" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

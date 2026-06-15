"use client"

import { useState } from "react"
import { Calendar, type CalendarRange } from "@/registry/new-york/ui/calendar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Single select", href: "#single", depth: 1 },
  { title: "Range", href: "#range", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function CalendarPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Calendar"]}
      title="Calendar"
      description="A self-contained month calendar with single-date and range selection, today highlighting, and out-of-month muted days — built on plain JS dates with no external date library."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/calendar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Calendar } from "@/components/ui/calendar"`}
      />
      <SingleExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="single">Single select</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Controlled single-date selection. The selected day uses the theme primary; today is ringed.
      </p>
      <SingleExample />

      <DocH3 id="range">Range</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a start and end day — the span between fills with a soft primary wash.
      </p>
      <RangeExample />

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-calendar">Calendar</DocH3>
      <PropsTable rows={[
        { prop: "mode", type: '"single" | "range"', default: '"single"', desc: "Single-date or start/end range selection" },
        { prop: "value", type: "Date | CalendarRange | null", default: "—", desc: "Controlled selection — a Date in single mode, { from, to } in range mode" },
        { prop: "onChange", type: "(value: Date | CalendarRange | null) => void", default: "—", desc: "Called with the new selection" },
        { prop: "defaultMonth", type: "Date", default: "today", desc: "Month displayed on first render" },
        { prop: "disabled", type: "(date: Date) => boolean", default: "—", desc: "Return true to make a day non-selectable" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root" },
      ]} />
    </DocPage>
  )
}

function SingleExample() {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <ComponentPreview
      className="min-h-[340px]"
      code={`const [date, setDate] = useState<Date | null>(new Date())

<Calendar mode="single" value={date} onChange={(v) => setDate(v as Date)} />`}
    >
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="single" value={date} onChange={(v) => setDate(v as Date)} />
        <p className="text-sm text-muted-foreground">
          {date ? date.toDateString() : "No date selected"}
        </p>
      </div>
    </ComponentPreview>
  )
}

function RangeExample() {
  const [range, setRange] = useState<CalendarRange>({ from: null, to: null })
  return (
    <ComponentPreview
      className="min-h-[340px]"
      code={`const [range, setRange] = useState<CalendarRange>({ from: null, to: null })

<Calendar mode="range" value={range} onChange={(v) => setRange(v as CalendarRange)} />`}
    >
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="range" value={range} onChange={(v) => setRange(v as CalendarRange)} />
        <p className="text-sm text-muted-foreground">
          {range.from
            ? `${range.from.toDateString()} → ${range.to ? range.to.toDateString() : "…"}`
            : "No range selected"}
        </p>
      </div>
    </ComponentPreview>
  )
}

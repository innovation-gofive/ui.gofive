"use client"

import { useState } from "react"
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
} from "@/registry/new-york/ui/datetime-picker"
import type { CalendarRange } from "@/registry/new-york/ui/calendar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Date picker", href: "#date", depth: 1 },
  { title: "Month / Year / Quarter", href: "#granularity", depth: 1 },
  { title: "Range with presets", href: "#range", depth: 1 },
  { title: "Time picker", href: "#time", depth: 1 },
  { title: "DateTime", href: "#datetime", depth: 1 },
  { title: "Error state", href: "#error", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function DateTimePickerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "DateTime Picker"]}
      title="DateTime Picker"
      description="Popover-based date, time, and combined date-time pickers built on the GoFive Calendar — controlled, dependency-free, and themeable."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/datetime-picker" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { DatePicker, TimePicker, DateTimePicker } from "@/components/ui/datetime-picker"`}
      />
      <DateExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="date">Date picker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An input-style trigger that opens a calendar popover. Selecting a day closes the popover.
      </p>
      <DateExample />

      <DocH3 id="granularity">Month / Year / Quarter</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the <code>calendar</code> prop to change the selection granularity. Clicking the
        header title drills up through month and year views.
      </p>
      <GranularityExample />

      <DocH3 id="range">Range with presets</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Range mode with a preset sidebar (Today, Last 7/14/30 days, …) and a Clear/Apply footer.
        The selection is staged until you press Apply.
      </p>
      <RangeExample />

      <DocH3 id="time">Time picker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Scrollable hour and minute columns. Pass <code>hourCycle={"{12}"}</code> for a 12-hour
        clock with an AM/PM column.
      </p>
      <TimeExample />

      <DocH3 id="datetime">DateTime</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Calendar and time side by side in one popover for picking a full timestamp.
      </p>
      <DateTimeExample />

      <DocH3 id="error">Error state</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>error</code> as a boolean or a string to mark the field invalid and show a
        message below it.
      </p>
      <ErrorExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-datepicker">DatePicker</DocH3>
      <PropsTable rows={[
        { prop: "mode", type: '"single" | "range"', default: '"single"', desc: "Single date or a start/end range" },
        { prop: "calendar", type: '"day" | "month" | "year" | "quarter"', default: '"day"', desc: "Selection granularity" },
        { prop: "value", type: "Date | CalendarRange | null", default: "—", desc: "Controlled selection" },
        { prop: "onChange", type: "(value: Date | CalendarRange | null) => void", default: "—", desc: "Called with the new selection" },
        { prop: "presets", type: "boolean | RangePreset[]", default: "—", desc: "Range presets — true for the defaults, or a custom list" },
        { prop: "footer", type: "boolean", default: "—", desc: "Show a Clear/Apply footer and stage the selection until Apply" },
        { prop: "error", type: "boolean | string", default: "—", desc: "Mark the field invalid; a string shows as a message below" },
        { prop: "placeholder", type: "string", default: '"Select date"', desc: "Trigger text when no value is set" },
        { prop: "disabledDate", type: "(date: Date) => boolean", default: "—", desc: "Disable individual calendar days" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disable the whole field" },
      ]} />

      <DocH3 id="api-timepicker">TimePicker</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "Date | null", default: "—", desc: "Date whose hour/minute is shown and edited" },
        { prop: "onChange", type: "(value: Date) => void", default: "—", desc: "Called with a Date carrying the new time" },
        { prop: "hourCycle", type: "12 | 24", default: "24", desc: "24-hour columns, or 12-hour with an AM/PM column" },
        { prop: "minuteStep", type: "number", default: "1", desc: "Increment between selectable minutes" },
      ]} />

      <DocH3 id="api-datetimepicker">DateTimePicker</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "Date | null", default: "—", desc: "Controlled date-time value" },
        { prop: "onChange", type: "(value: Date) => void", default: "—", desc: "Called with the combined date and time" },
        { prop: "hourCycle", type: "12 | 24", default: "24", desc: "24-hour columns, or 12-hour with an AM/PM column" },
        { prop: "footer", type: "boolean", default: "—", desc: "Show a Cancel/Set footer and stage the selection until Set" },
        { prop: "error", type: "boolean | string", default: "—", desc: "Mark the field invalid; a string shows as a message below" },
        { prop: "placeholder", type: "string", default: '"Select date & time"', desc: "Trigger text when empty" },
        { prop: "minuteStep", type: "number", default: "1", desc: "Increment between selectable minutes" },
        { prop: "disabledDate", type: "(date: Date) => boolean", default: "—", desc: "Disable individual calendar days" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disable the whole field" },
      ]} />
    </DocPage>
  )
}

function DateExample() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <ComponentPreview
      className="min-h-[140px]"
      code={`const [date, setDate] = useState<Date | null>(null)

<DatePicker value={date} onChange={(v) => setDate(v as Date)} />`}
    >
      <DatePicker value={date} onChange={(v) => setDate(v as Date)} />
    </ComponentPreview>
  )
}

function GranularityExample() {
  const [month, setMonth] = useState<Date | null>(null)
  const [year, setYear] = useState<Date | null>(null)
  const [quarter, setQuarter] = useState<Date | null>(null)
  return (
    <ComponentPreview
      className="min-h-[140px]"
      code={`<DatePicker calendar="month" value={month} onChange={(v) => setMonth(v as Date)} placeholder="Select month" />
<DatePicker calendar="year" value={year} onChange={(v) => setYear(v as Date)} placeholder="Select year" />
<DatePicker calendar="quarter" value={quarter} onChange={(v) => setQuarter(v as Date)} placeholder="Select quarter" />`}
    >
      <div className="flex flex-wrap gap-3">
        <DatePicker
          calendar="month"
          value={month}
          onChange={(v) => setMonth(v as Date)}
          placeholder="Select month"
          className="w-auto"
        />
        <DatePicker
          calendar="year"
          value={year}
          onChange={(v) => setYear(v as Date)}
          placeholder="Select year"
          className="w-auto"
        />
        <DatePicker
          calendar="quarter"
          value={quarter}
          onChange={(v) => setQuarter(v as Date)}
          placeholder="Select quarter"
          className="w-auto"
        />
      </div>
    </ComponentPreview>
  )
}

function RangeExample() {
  const [range, setRange] = useState<CalendarRange | null>(null)
  return (
    <ComponentPreview
      className="min-h-[140px]"
      code={`const [range, setRange] = useState<CalendarRange | null>(null)

<DatePicker
  mode="range"
  presets
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
  placeholder="Select range"
/>`}
    >
      <DatePicker
        mode="range"
        presets
        value={range}
        onChange={(v) => setRange(v as CalendarRange)}
        placeholder="Select range"
      />
    </ComponentPreview>
  )
}

function TimeExample() {
  const [time, setTime] = useState<Date | null>(() => {
    const d = new Date()
    d.setHours(9, 30, 0, 0)
    return d
  })
  return (
    <ComponentPreview
      className="min-h-[240px]"
      code={`const [time, setTime] = useState<Date | null>(/* 09:30 */)

<TimePicker value={time} onChange={setTime} hourCycle={12} minuteStep={5} />`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl border p-3">
          <TimePicker value={time} onChange={setTime} hourCycle={12} minuteStep={5} />
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {time ? time.toTimeString().slice(0, 5) : "No time set"}
        </p>
      </div>
    </ComponentPreview>
  )
}

function DateTimeExample() {
  const [value, setValue] = useState<Date | null>(null)
  return (
    <ComponentPreview
      className="min-h-[140px]"
      code={`const [value, setValue] = useState<Date | null>(null)

<DateTimePicker value={value} onChange={setValue} minuteStep={5} />`}
    >
      <DateTimePicker value={value} onChange={setValue} minuteStep={5} />
    </ComponentPreview>
  )
}

function ErrorExample() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <ComponentPreview
      className="min-h-[140px]"
      code={`<DatePicker
  value={date}
  onChange={(v) => setDate(v as Date)}
  error={!date ? "A date is required" : false}
/>`}
    >
      <DatePicker
        value={date}
        onChange={(v) => setDate(v as Date)}
        error={!date ? "A date is required" : false}
      />
    </ComponentPreview>
  )
}

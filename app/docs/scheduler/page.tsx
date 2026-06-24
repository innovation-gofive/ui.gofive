"use client"

import { useMemo, useState } from "react"
import {
  Scheduler,
  startOfDay,
  type SchedulerEvent,
  type SchedulerView,
} from "@/registry/new-york/ui/scheduler"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Month, Week & Day", href: "#views", depth: 1 },
  { title: "Event variants", href: "#variants", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

// Build a week of sample events anchored to the current week so every view
// is populated and today's date is highlighted in the demo.
function useSampleEvents(): { events: SchedulerEvent[]; friday: Date } {
  return useMemo(() => {
    const today = startOfDay(new Date())
    // Monday of the current week.
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const at = (base: Date, dayOffset: number, h: number, m: number) => {
      const d = new Date(base)
      d.setDate(d.getDate() + dayOffset)
      d.setHours(h, m, 0, 0)
      return d
    }

    const events: SchedulerEvent[] = [
      // Current week — timed events for the Week view.
      { id: "1", title: "Team standup", start: at(monday, 0, 9, 0), end: at(monday, 0, 9, 30) },
      { id: "2", title: "Design crit", start: at(monday, 0, 11, 0), end: at(monday, 0, 12, 0), variant: "info" },
      { id: "3", title: "Sprint planning", start: at(monday, 1, 10, 0), end: at(monday, 1, 11, 0), variant: "success" },
      { id: "4", title: "Coffee", start: at(monday, 2, 8, 30), end: at(monday, 2, 9, 0) },
      { id: "5", title: "Workshop", start: at(monday, 2, 12, 0), end: at(monday, 2, 14, 0), variant: "warning" },
      { id: "6", title: "Client call", start: at(monday, 3, 10, 0), end: at(monday, 3, 11, 0), variant: "warning" },
      { id: "7", title: "Design review", start: at(monday, 5, 10, 30), end: at(monday, 5, 11, 10), variant: "info" },

      // Friday — a full agenda day.
      { id: "8", title: "Design system sync", start: at(monday, 4, 9, 0), end: at(monday, 4, 9, 30), meta: "Meeting room 4 · with Ploy, Nat" },
      { id: "9", title: "Sprint planning", start: at(monday, 4, 10, 0), end: at(monday, 4, 11, 0), variant: "success", meta: "Empeo team" },
      { id: "10", title: "Product review", start: at(monday, 4, 13, 30), end: at(monday, 4, 14, 15), variant: "warning", meta: "Quarterly goals check-in" },
      { id: "11", title: "1:1 with Lead", start: at(monday, 4, 15, 0), end: at(monday, 4, 15, 45), meta: "Coffee bar, 3F" },

      // Elsewhere in the month — to show "+N more" in the Month view.
      { id: "12", title: "Release 6.5", start: at(firstOfMonth, 6, 14, 0), end: at(firstOfMonth, 6, 15, 0), variant: "success" },
      { id: "13", title: "QA review", start: at(firstOfMonth, 6, 16, 0), end: at(firstOfMonth, 6, 17, 0), variant: "info" },
      { id: "14", title: "Catch up", start: at(firstOfMonth, 6, 11, 0), end: at(firstOfMonth, 6, 11, 30) },
      { id: "15", title: "Quarterly review", start: at(firstOfMonth, 27, 9, 0), end: at(firstOfMonth, 27, 10, 30), variant: "warning" },
    ]

    return { events, friday: at(monday, 4, 0, 0) }
  }, [])
}

export default function SchedulerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Scheduler"]}
      title="Scheduler"
      description="An event calendar with Month, Week, and Day/Agenda views, a segmented view switcher, Today navigation, and color-coded events — built on plain JS dates with no external date library."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/scheduler" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Scheduler } from "@/components/ui/scheduler"`}
      />
      <ViewsExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="views">Month, Week & Day</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        One component, three views. Use the segmented control to switch between
        Month, Week, and the Day/Agenda list; the nav arrows step by the active
        unit and <strong>Today</strong> jumps back.
      </p>
      <ViewsExample />

      <DocH3 id="variants">Event variants</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Each event takes an optional <code>variant</code> — <code>default</code>{" "}
        (Gofive primary), <code>success</code>, <code>warning</code>, or{" "}
        <code>info</code> — applied to the chip, week block, and agenda dot.
      </p>
      <CodeBlock
        className="mt-4"
        code={`const events: SchedulerEvent[] = [
  { id: "1", title: "Team standup", start, end },
  { id: "2", title: "Release 6.5", start, end, variant: "success" },
  { id: "3", title: "Client call", start, end, variant: "warning" },
  { id: "4", title: "QA review",   start, end, variant: "info" },
]`}
      />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-scheduler">Scheduler</DocH3>
      <PropsTable rows={[
        { prop: "events", type: "SchedulerEvent[]", default: "[]", desc: "Events rendered across all views" },
        { prop: "view", type: '"month" | "week" | "day"', default: "—", desc: "Controlled active view" },
        { prop: "defaultView", type: '"month" | "week" | "day"', default: '"month"', desc: "Initial view (uncontrolled)" },
        { prop: "onViewChange", type: "(view: SchedulerView) => void", default: "—", desc: "Called when the view switches" },
        { prop: "date", type: "Date", default: "—", desc: "Controlled reference date (anchors month/week/day)" },
        { prop: "defaultDate", type: "Date", default: "today", desc: "Initial reference date (uncontrolled)" },
        { prop: "onDateChange", type: "(date: Date) => void", default: "—", desc: "Called when navigation changes the date" },
        { prop: "onEventClick", type: "(event: SchedulerEvent) => void", default: "—", desc: "Called when an event is clicked in any view" },
        { prop: "weekStartsOn", type: "0 | 1", default: "1", desc: "First column of the week — 0 Sun, 1 Mon" },
        { prop: "dayStartHour", type: "number", default: "8", desc: "First hour shown in the Week time-grid" },
        { prop: "dayEndHour", type: "number", default: "18", desc: "Last hour shown in the Week time-grid" },
        { prop: "hourHeight", type: "number", default: "48", desc: "Pixel height of one hour row in the Week view" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root" },
      ]} />

      <DocH3 id="api-event">SchedulerEvent</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Stable unique key" },
        { prop: "title", type: "string", default: "—", desc: "Event label" },
        { prop: "start", type: "Date", default: "—", desc: "Start date-time" },
        { prop: "end", type: "Date", default: "—", desc: "End date-time (drives Week block height)" },
        { prop: "variant", type: '"default" | "success" | "warning" | "info"', default: '"default"', desc: "Color of the chip / block / dot" },
        { prop: "meta", type: "string", default: "—", desc: "Secondary line shown in the Day/Agenda view" },
      ]} />
    </DocPage>
  )
}

function ViewsExample() {
  const { events, friday } = useSampleEvents()
  const [view, setView] = useState<SchedulerView>("month")
  return (
    <ComponentPreview
      className="min-h-[560px]"
      code={`const [view, setView] = useState<SchedulerView>("month")

<Scheduler
  events={events}
  view={view}
  onViewChange={setView}
  defaultDate={friday}
/>`}
    >
      <Scheduler
        events={events}
        view={view}
        onViewChange={setView}
        defaultDate={friday}
      />
    </ComponentPreview>
  )
}

"use client"

import { useState } from "react"
import {
  FilterChip,
  AddFilterChip,
  FilterBar,
  FilterButton,
  SegmentedControl,
} from "@/registry/new-york/ui/filter"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Single-select chips", href: "#single-select", depth: 1 },
  { title: "Multi-select chips", href: "#multi-select", depth: 1 },
  { title: "Dismissible chips", href: "#dismissible", depth: 1 },
  { title: "Filter bar", href: "#filter-bar", depth: 1 },
  { title: "Segmented control", href: "#segmented", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function FilterPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Filter"]}
      title="Filter"
      description="Toggleable filter chips, a dropdown-driven filter bar, an add-filter affordance, and a segmented control — with a GoFive accent for active and has-value states."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/filter" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  FilterChip,
  AddFilterChip,
  FilterBar,
  FilterButton,
  SegmentedControl,
} from "@/components/ui/filter"`}
      />
      <UsageExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="single-select">Single-select chips</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tab-style chips where exactly one option is active — counts show how many records match.
      </p>
      <SingleSelectExample />

      <DocH3 id="multi-select">Multi-select chips</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Toggle any number of chips on or off — useful for OR-style category filters.
      </p>
      <MultiSelectExample />

      <DocH3 id="dismissible">Dismissible chips</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Applied filters with a trailing × to remove them individually, plus a clear-all action.
      </p>
      <DismissibleExample />

      <DocH3 id="filter-bar">Filter bar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Dropdown-driven buttons that switch to the accent has-value state once a value is applied.
      </p>
      <FilterBarExample />

      <DocH3 id="segmented">Segmented control</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Controlled toggle for view or time-range switching (day / week / month).
      </p>
      <SegmentedExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-filterchip">FilterChip</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Toggleable chip with optional count and dismiss action.</p>
      <PropsTable rows={[
        { prop: "active", type: "boolean", default: "false", desc: "Selected / has-value state — applies the GoFive accent" },
        { prop: "count", type: "number", default: "—", desc: "Optional count pill rendered after the label" },
        { prop: "onDismiss", type: "() => void", default: "—", desc: "If provided, renders a trailing × that calls this handler" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Fires when the chip body is clicked (toggle the filter here)" },
      ]} />

      <DocH3 id="api-addfilterchip">AddFilterChip</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Dashed affordance for adding a new filter.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: '"Add filter"', desc: "Label shown after the plus icon" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Fires when clicked — open a filter picker here" },
      ]} />

      <DocH3 id="api-filterbar">FilterBar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Flex container that wraps chips and buttons.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "FilterChip, FilterButton and AddFilterChip elements" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes for spacing / alignment overrides" },
      ]} />

      <DocH3 id="api-filterbutton">FilterButton</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Dropdown-style trigger: shows the accent has-value state when a value is set.</p>
      <PropsTable rows={[
        { prop: "label", type: "ReactNode", default: "—", desc: "Field name shown first (e.g. Status)" },
        { prop: "operator", type: "ReactNode", default: "—", desc: "Operator shown between label and value when a value is set (e.g. is)" },
        { prop: "value", type: "ReactNode", default: "—", desc: "Applied value — when set, switches to the accent has-value state" },
        { prop: "onClear", type: "() => void", default: "—", desc: "If provided with a value, renders a × to clear it" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Fires on the button body — open the value picker here" },
      ]} />

      <DocH3 id="api-segmentedcontrol">SegmentedControl</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Controlled segmented toggle.</p>
      <PropsTable rows={[
        { prop: "options", type: "{ label: ReactNode; value: string }[]", default: "—", desc: "Ordered list of segments" },
        { prop: "value", type: "string", default: "—", desc: "Currently selected segment value (controlled)" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called with the value of the clicked segment" },
        { prop: "aria-label", type: "string", default: "—", desc: "Accessible label for the tablist" },
      ]} />
    </DocPage>
  )
}

function UsageExample() {
  const [active, setActive] = useState(true)
  return (
    <ComponentPreview
      className="min-h-[100px]"
      code={`<FilterChip active={active} count={42} onClick={() => setActive(!active)}>
  Open
</FilterChip>`}
    >
      <FilterChip active={active} count={42} onClick={() => setActive(!active)}>
        Open
      </FilterChip>
    </ComponentPreview>
  )
}

const STATUSES = [
  { value: "all", label: "All", count: 248 },
  { value: "open", label: "Open", count: 42 },
  { value: "review", label: "In review", count: 18 },
  { value: "approved", label: "Approved", count: 186 },
  { value: "archived", label: "Archived", count: 12 },
]

function SingleSelectExample() {
  const [selected, setSelected] = useState("all")
  return (
    <ComponentPreview>
      <FilterBar>
        {STATUSES.map((s) => (
          <FilterChip
            key={s.value}
            active={selected === s.value}
            count={s.count}
            onClick={() => setSelected(s.value)}
          >
            {s.label}
          </FilterChip>
        ))}
      </FilterBar>
    </ComponentPreview>
  )
}

const TEAMS = ["Marketing", "Engineering", "Product", "Design", "Operations", "Finance"]

function MultiSelectExample() {
  const [selected, setSelected] = useState<string[]>(["Marketing", "Engineering"])

  function toggle(team: string) {
    setSelected((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    )
  }

  return (
    <ComponentPreview>
      <FilterBar>
        {TEAMS.map((team) => (
          <FilterChip
            key={team}
            active={selected.includes(team)}
            onClick={() => toggle(team)}
          >
            {team}
          </FilterChip>
        ))}
      </FilterBar>
    </ComponentPreview>
  )
}

const INITIAL_FILTERS = [
  { id: "priority", label: "Priority: High" },
  { id: "owner", label: "Owner: Ploy K." },
  { id: "due", label: "Due: This week" },
]

function DismissibleExample() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  return (
    <ComponentPreview>
      <FilterBar>
        {filters.map((f) => (
          <FilterChip
            key={f.id}
            active
            onDismiss={() => setFilters((prev) => prev.filter((x) => x.id !== f.id))}
          >
            {f.label}
          </FilterChip>
        ))}
        {filters.length > 0 ? (
          <button
            type="button"
            className="px-2 text-[13px] text-muted-foreground transition-colors hover:text-destructive"
            onClick={() => setFilters([])}
          >
            Clear all
          </button>
        ) : (
          <button
            type="button"
            className="px-2 text-[13px] text-muted-foreground underline underline-offset-2"
            onClick={() => setFilters(INITIAL_FILTERS)}
          >
            reset
          </button>
        )}
      </FilterBar>
    </ComponentPreview>
  )
}

function FilterBarExample() {
  const [status, setStatus] = useState<string | undefined>("Open, In review")
  const [owner, setOwner] = useState<string | undefined>("Me")
  const [due, setDue] = useState<string | undefined>()

  return (
    <ComponentPreview>
      <FilterBar>
        <FilterButton
          label="Status"
          operator="is"
          value={status}
          onClick={() => setStatus(status ? undefined : "Open, In review")}
          onClear={() => setStatus(undefined)}
        />
        <FilterButton
          label="Owner"
          operator="="
          value={owner}
          onClick={() => setOwner(owner ? undefined : "Me")}
          onClear={() => setOwner(undefined)}
        />
        <FilterButton
          label="Due"
          operator="within"
          value={due}
          onClick={() => setDue(due ? undefined : "7 days")}
          onClear={() => setDue(undefined)}
        />
        <AddFilterChip onClick={() => setDue("7 days")} />
        {(status || owner || due) && (
          <button
            type="button"
            className="px-2 text-[13px] text-muted-foreground transition-colors hover:text-destructive"
            onClick={() => {
              setStatus(undefined)
              setOwner(undefined)
              setDue(undefined)
            }}
          >
            Reset
          </button>
        )}
      </FilterBar>
    </ComponentPreview>
  )
}

function SegmentedExample() {
  const [range, setRange] = useState("week")
  const [layout, setLayout] = useState("table")

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <SegmentedControl
          aria-label="Time range"
          value={range}
          onValueChange={setRange}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
        <SegmentedControl
          aria-label="Layout mode"
          value={layout}
          onValueChange={setLayout}
          options={[
            { value: "table", label: "Table" },
            { value: "board", label: "Board" },
            { value: "timeline", label: "Timeline" },
            { value: "calendar", label: "Calendar" },
          ]}
        />
      </div>
    </ComponentPreview>
  )
}

"use client"

import { useState } from "react"
import {
  FilterChip,
  AddFilterChip,
  FilterBar,
  FilterButton,
  FilterClear,
  SegmentedControl,
  FilterBuilder,
  FilterBuilderHeader,
  FilterBuilderBody,
  FilterRow,
  FilterSelect,
  FilterInput,
  AddConditionButton,
  FilterBuilderFooter,
  SavedViews,
  SavedView,
  AppliedSummary,
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
  { title: "Advanced filter builder", href: "#builder", depth: 1 },
  { title: "Saved views", href: "#saved-views", depth: 1 },
  { title: "Applied summary", href: "#applied-summary", depth: 1 },
  { title: "Segmented control", href: "#segmented", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function FilterPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Filter"]}
      title="Filter"
      description="Toggleable filter chips, a dropdown-driven filter bar, an advanced AND/OR condition builder, saved views, an applied-result summary, and a segmented control — with a GoFive accent for active and has-value states."
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
  FilterClear,
  SegmentedControl,
  FilterBuilder,
  FilterBuilderHeader,
  FilterBuilderBody,
  FilterRow,
  FilterSelect,
  FilterInput,
  AddConditionButton,
  FilterBuilderFooter,
  SavedViews,
  SavedView,
  AppliedSummary,
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

      <DocH3 id="builder">Advanced filter builder</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A composable AND / OR condition builder — each row pairs a field, operator and value, with
        a header summary and Reset / Cancel / Apply footer.
      </p>
      <BuilderExample />

      <DocH3 id="saved-views">Saved views</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Persistent filter presets shown as pills with a colored status dot — the active view uses
        the inverted foreground style.
      </p>
      <SavedViewsExample />

      <DocH3 id="applied-summary">Applied summary</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An accent banner that summarizes the active result set, with a one-click clear action.
      </p>
      <AppliedSummaryExample />

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

      <DocH3 id="api-filterclear">FilterClear</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Borderless text button for clear / reset actions.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: '"Clear all"', desc: "Label text" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Fires when clicked — clear the active filters here" },
      ]} />

      <DocH3 id="api-filterbuilder">FilterBuilder</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Card container for the advanced AND / OR condition builder. Compose with the header, body, rows and footer below.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "FilterBuilderHeader, FilterBuilderBody and FilterBuilderFooter" },
        { prop: "className", type: "string", default: "—", desc: "Layout / width overrides (defaults to max-w 520px)" },
      ]} />

      <DocH3 id="api-filterbuilderheader">FilterBuilderHeader</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Title row with an optional right-aligned meta summary.</p>
      <PropsTable rows={[
        { prop: "title", type: "ReactNode", default: "—", desc: "Builder name (e.g. Filter builder)" },
        { prop: "meta", type: "ReactNode", default: "—", desc: "Optional summary text (e.g. 3 conditions · matches 42 records)" },
      ]} />

      <DocH3 id="api-filterrow">FilterRow</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single condition row: index, join word, the field/operator/value controls (children), and an optional remove button.</p>
      <PropsTable rows={[
        { prop: "index", type: "ReactNode", default: "—", desc: "Leading row number" },
        { prop: "join", type: "ReactNode", default: "—", desc: "Join word — Where for the first row, And / Or after" },
        { prop: "onRemove", type: "() => void", default: "—", desc: "If provided, renders a trailing × to delete the row" },
        { prop: "children", type: "ReactNode", default: "—", desc: "The FilterSelect / FilterInput controls for this condition" },
      ]} />

      <DocH3 id="api-filterselect">FilterSelect / FilterInput</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Styled native <code>&lt;select&gt;</code> / <code>&lt;input&gt;</code> sized for use inside a FilterRow. Forward all native props.</p>
      <PropsTable rows={[
        { prop: "className", type: "string", default: "—", desc: "Width / weight overrides (e.g. min-w-[130px], flex-1)" },
        { prop: "...props", type: "select/input attrs", default: "—", desc: "value, onChange, options, placeholder, etc." },
      ]} />

      <DocH3 id="api-addconditionbutton">AddConditionButton</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Dashed affordance to append a new condition row.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: '"Add condition"', desc: "Label after the plus icon" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Append a new condition here" },
      ]} />

      <DocH3 id="api-filterbuilderfooter">FilterBuilderFooter</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Footer bar with a muted background — place Reset on the left and Cancel / Apply on the right.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "Footer action buttons" },
      ]} />

      <DocH3 id="api-savedview">SavedViews / SavedView</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Persistent filter presets shown as pills. SavedViews is the wrapping container.</p>
      <PropsTable rows={[
        { prop: "active", type: "boolean", default: "false", desc: "Selected view — applies the inverted foreground style" },
        { prop: "color", type: "string", default: "—", desc: "Leading status-dot color (any CSS color); omit to hide the dot" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Activate this view" },
        { prop: "children", type: "ReactNode", default: "—", desc: "View name" },
      ]} />

      <DocH3 id="api-appliedsummary">AppliedSummary</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Accent banner summarizing the active result set. Wrap counts in <code>&lt;b&gt;</code> for emphasis.</p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "Summary message — <b> spans render in the accent color" },
        { prop: "onClear", type: "() => void", default: "—", desc: "If provided, renders a trailing clear button" },
        { prop: "clearLabel", type: "ReactNode", default: '"Clear filters"', desc: "Label for the clear button" },
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

interface Condition {
  id: number
  field: string
  op: string
  value: string
}

let nextConditionId = 4

function BuilderExample() {
  const [rows, setRows] = useState<Condition[]>([
    { id: 1, field: "Status", op: "is any of", value: "Open, In review" },
    { id: 2, field: "Priority", op: "equals", value: "High" },
    { id: 3, field: "Due date", op: "is within", value: "Next 7 days" },
  ])

  function update(id: number, patch: Partial<Condition>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <ComponentPreview>
      <FilterBuilder>
        <FilterBuilderHeader
          title="Filter builder"
          meta={`${rows.length} condition${rows.length === 1 ? "" : "s"} · matches 42 records`}
        />
        <FilterBuilderBody>
          {rows.map((row, i) => (
            <FilterRow
              key={row.id}
              index={i + 1}
              join={i === 0 ? "Where" : "And"}
              onRemove={
                rows.length > 1
                  ? () => setRows((prev) => prev.filter((r) => r.id !== row.id))
                  : undefined
              }
            >
              <FilterSelect
                className="min-w-[130px] font-semibold"
                value={row.field}
                onChange={(e) => update(row.id, { field: e.target.value })}
              >
                <option>Status</option>
                <option>Priority</option>
                <option>Due date</option>
                <option>Owner</option>
              </FilterSelect>
              <FilterSelect
                className="min-w-[96px] text-muted-foreground"
                value={row.op}
                onChange={(e) => update(row.id, { op: e.target.value })}
              >
                <option>is any of</option>
                <option>equals</option>
                <option>is within</option>
              </FilterSelect>
              <FilterInput
                value={row.value}
                onChange={(e) => update(row.id, { value: e.target.value })}
              />
            </FilterRow>
          ))}
          <AddConditionButton
            onClick={() =>
              setRows((prev) => [
                ...prev,
                { id: nextConditionId++, field: "Owner", op: "equals", value: "" },
              ])
            }
          />
        </FilterBuilderBody>
        <FilterBuilderFooter>
          <button
            type="button"
            className="h-8 rounded-[7px] border border-border bg-card px-3.5 text-[12.5px] font-semibold text-foreground/80"
            onClick={() =>
              setRows([
                { id: 1, field: "Status", op: "is any of", value: "Open, In review" },
                { id: 2, field: "Priority", op: "equals", value: "High" },
                { id: 3, field: "Due date", op: "is within", value: "Next 7 days" },
              ])
            }
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-8 rounded-[7px] border border-border bg-card px-3.5 text-[12.5px] font-semibold text-foreground/80"
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-8 rounded-[7px] px-3.5 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: "#F88411" }}
            >
              Apply filter
            </button>
          </div>
        </FilterBuilderFooter>
      </FilterBuilder>
    </ComponentPreview>
  )
}

const VIEWS = [
  { id: "open", label: "My open tasks", color: undefined as string | undefined },
  { id: "overdue", label: "Overdue", color: "#E5A100" },
  { id: "review", label: "In review", color: "#2F6FED" },
  { id: "shipped", label: "Shipped this week", color: "#1F9E59" },
]

function SavedViewsExample() {
  const [active, setActive] = useState("open")
  return (
    <ComponentPreview>
      <SavedViews>
        {VIEWS.map((v) => (
          <SavedView
            key={v.id}
            active={active === v.id}
            color={active === v.id ? "#fff" : v.color}
            onClick={() => setActive(v.id)}
          >
            {v.label}
          </SavedView>
        ))}
        <SavedView className="text-muted-foreground" onClick={() => {}}>
          + Save current view
        </SavedView>
      </SavedViews>
    </ComponentPreview>
  )
}

function AppliedSummaryExample() {
  const [cleared, setCleared] = useState(false)
  return (
    <ComponentPreview>
      {cleared ? (
        <button
          type="button"
          className="text-[13px] text-muted-foreground underline underline-offset-2"
          onClick={() => setCleared(false)}
        >
          reset demo
        </button>
      ) : (
        <AppliedSummary className="w-full" onClear={() => setCleared(true)}>
          Showing <b>42 of 248</b> records · <b>3 filters</b> applied · sorted by <b>Priority</b>
        </AppliedSummary>
      )}
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

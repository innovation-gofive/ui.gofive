"use client"

import { Select, MultiSelect, type SelectOption } from "@/registry/new-york/ui/select"
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
  { title: "Searchable combobox", href: "#combobox", depth: 1 },
  { title: "Status select", href: "#status", depth: 1 },
  { title: "Multi-select", href: "#multi", depth: 1 },
  { title: "Disabled options", href: "#disabled", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

// ── Sample data ─────────────────────────────────────────────────────
const cities: SelectOption[] = [
  { value: "bangkok", label: "Bangkok", icon: "🇹🇭" },
  { value: "chiangmai", label: "Chiang Mai", icon: "🇹🇭" },
  { value: "phuket", label: "Phuket", icon: "🇹🇭" },
  { value: "khonkaen", label: "Khon Kaen", icon: "🇹🇭" },
  { value: "hatyai", label: "Hat Yai", icon: "🇹🇭" },
  { value: "pattaya", label: "Pattaya", icon: "🇹🇭", disabled: true, trailing: "soon" },
]

const people: SelectOption[] = [
  {
    value: "somchai",
    label: "Somchai Prasert",
    description: "somchai@gofive.co.th · HR",
    group: "Suggested",
  },
  {
    value: "sompong",
    label: "Sompong Manee",
    description: "sompong@gofive.co.th · Sales",
    group: "Suggested",
  },
  {
    value: "sorasit",
    label: "Sorasit Ratana",
    description: "Engineering · Bangkok",
    group: "All employees",
  },
  {
    value: "sorawit",
    label: "Sorawit O.",
    description: "Product · remote",
    group: "All employees",
  },
  {
    value: "pim",
    label: "Pim Chaiyaporn",
    description: "Design · Bangkok",
    group: "All employees",
  },
]

const statuses: SelectOption[] = [
  { value: "backlog", label: "Backlog", dot: "#8A8A96" },
  { value: "todo", label: "Todo", dot: "#0A66E0" },
  { value: "in-progress", label: "In progress", dot: "#1DA577" },
  { value: "review", label: "Needs review", dot: "#F9D423" },
  { value: "done", label: "Done", dot: "#1A1A1F" },
  { value: "cancelled", label: "Cancelled", dot: "#D93A1A" },
]

const departments: SelectOption[] = [
  { value: "sales", label: "Sales", trailing: "24 people" },
  { value: "hr", label: "HR", trailing: "8 people" },
  { value: "engineering", label: "Engineering", trailing: "62 people" },
  { value: "design", label: "Design", trailing: "14 people" },
  { value: "finance", label: "Finance", trailing: "6 people" },
  { value: "operations", label: "Operations", trailing: "22 people" },
  { value: "legal", label: "Legal", trailing: "locked", disabled: true },
]

export default function SelectPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Select"]}
      title="Select"
      description="A popover-based select and multi-select — searchable combobox, grouped rich rows, status dots, removable chips and an apply footer. Controllable or uncontrolled."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/select" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Select, MultiSelect, type SelectOption } from "@/components/ui/select"

const options: SelectOption[] = [
  { value: "bangkok", label: "Bangkok" },
  { value: "phuket", label: "Phuket" },
]

<Select options={options} placeholder="Select a city…" />`}
      />
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-xs">
          <Select options={cities} defaultValue="bangkok" placeholder="Select a city…" />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="single">Single select</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A simple list with a selected check, hover highlight and a disabled option.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-xs">
          <Select options={cities} defaultValue="bangkok" placeholder="Select a city…" />
        </div>
      </ComponentPreview>
      <CodeBlock
        className="mt-4"
        code={`<Select
  options={cities}
  defaultValue="bangkok"
  placeholder="Select a city…"
/>`}
      />

      <DocH3 id="combobox">Searchable combobox</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>searchable</code> to show a search box that filters by label. Options
        with a <code>group</code> are rendered under uppercase headings, and{" "}
        <code>description</code> adds a second line.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-xs">
          <Select
            options={people}
            searchable
            searchPlaceholder="Search people…"
            placeholder="Assign someone…"
          />
        </div>
      </ComponentPreview>
      <CodeBlock
        className="mt-4"
        code={`<Select
  options={people}
  searchable
  searchPlaceholder="Search people…"
  placeholder="Assign someone…"
/>`}
      />

      <DocH3 id="status">Status select with dots</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Give each option a <code>dot</code> color to render a leading status indicator,
        echoed on the trigger when selected.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-xs">
          <Select options={statuses} defaultValue="in-progress" placeholder="Set status…" />
        </div>
      </ComponentPreview>
      <CodeBlock
        className="mt-4"
        code={`const statuses = [
  { value: "todo", label: "Todo", dot: "#0A66E0" },
  { value: "in-progress", label: "In progress", dot: "#1DA577" },
  { value: "done", label: "Done", dot: "#1A1A1F" },
]

<Select options={statuses} defaultValue="in-progress" />`}
      />

      <DocH3 id="multi">Multi-select with chips and footer</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Selected options show as removable chips in the trigger. The menu has a search
        box, a <code>Select all</code> header link, checkbox rows with{" "}
        <code>trailing</code> text, and a footer with <code>Clear all</code> + Apply.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-sm">
          <MultiSelect
            options={departments}
            defaultValue={["sales", "hr", "engineering"]}
            searchable
            searchPlaceholder="Search departments…"
            placeholder="Select departments…"
          />
        </div>
      </ComponentPreview>
      <CodeBlock
        className="mt-4"
        code={`<MultiSelect
  options={departments}
  defaultValue={["sales", "hr", "engineering"]}
  searchable
  showFooter
  selectAll
  placeholder="Select departments…"
/>`}
      />

      <DocH3 id="disabled">Disabled options</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Mark an option <code>disabled</code> to render it muted and non-interactive — it
        is also excluded from <code>Select all</code>.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <div className="w-full max-w-xs">
          <Select options={cities} placeholder="Select a city…" />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-select">Select</DocH3>
      <PropsTable rows={[
        { prop: "options", type: "SelectOption[]", default: "—", desc: "Options to render" },
        { prop: "value", type: "string", default: "—", desc: "Controlled selected value" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when an option is chosen" },
        { prop: "placeholder", type: "string", default: '"Select…"', desc: "Shown when nothing is selected" },
        { prop: "searchable", type: "boolean", default: "false", desc: "Show a search box that filters by label" },
        { prop: "searchPlaceholder", type: "string", default: '"Search…"', desc: "Placeholder for the search box" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disable the trigger" },
        { prop: "triggerClassName", type: "string", default: "—", desc: "Classes for the trigger button" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-multiselect">MultiSelect</DocH3>
      <PropsTable rows={[
        { prop: "options", type: "SelectOption[]", default: "—", desc: "Options to render" },
        { prop: "value", type: "string[]", default: "—", desc: "Controlled selected values" },
        { prop: "defaultValue", type: "string[]", default: "[]", desc: "Initial values when uncontrolled" },
        { prop: "onValueChange", type: "(value: string[]) => void", default: "—", desc: "Called when the selection changes" },
        { prop: "placeholder", type: "string", default: '"Select…"', desc: "Shown when nothing is selected" },
        { prop: "searchable", type: "boolean", default: "true", desc: "Show a search box that filters by label" },
        { prop: "showFooter", type: "boolean", default: "true", desc: "Show the Clear all / Apply footer" },
        { prop: "selectAll", type: "boolean", default: "true", desc: "Show the Select all header link" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disable the trigger" },
        { prop: "triggerClassName", type: "string", default: "—", desc: "Classes for the trigger button" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-option">SelectOption</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The shared option model used by both components.
      </p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Unique value identifying the option" },
        { prop: "label", type: "string", default: "—", desc: "Text shown in the trigger and row" },
        { prop: "description", type: "string", default: "—", desc: "Secondary line under the label" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Render muted and non-interactive" },
        { prop: "icon", type: "React.ReactNode", default: "—", desc: "Leading icon or emoji" },
        { prop: "dot", type: "string", default: "—", desc: "CSS color for a leading status dot" },
        { prop: "group", type: "string", default: "—", desc: "Group heading the option belongs to" },
        { prop: "trailing", type: "React.ReactNode", default: "—", desc: "Right-aligned content (e.g. a count)" },
      ]} />
    </DocPage>
  )
}

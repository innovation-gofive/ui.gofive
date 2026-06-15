"use client"

import {
  TreeSelect,
  TreeMultiSelect,
  type TreeNode,
} from "@/registry/new-york/ui/tree-select"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Single category select", href: "#single", depth: 1 },
  { title: "Multi-select with cascade", href: "#multi", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

// ── Sample data: departments → teams ────────────────────────────────
const departments: TreeNode[] = [
  {
    value: "sales",
    label: "Sales",
    count: 24,
    children: [
      { value: "inbound", label: "Inbound", count: 8 },
      { value: "outbound", label: "Outbound", count: 10 },
      { value: "partnerships", label: "Partnerships", count: 6 },
    ],
  },
  {
    value: "engineering",
    label: "Engineering",
    count: 62,
    children: [
      {
        value: "frontend",
        label: "Frontend",
        count: 14,
        children: [
          { value: "react", label: "React", count: 8 },
          { value: "vue", label: "Vue", count: 4 },
          { value: "design-systems", label: "Design systems", count: 2 },
        ],
      },
      { value: "backend", label: "Backend", count: 28 },
      { value: "devops", label: "DevOps", count: 12 },
      { value: "qa", label: "QA", count: 8 },
    ],
  },
  {
    value: "design",
    label: "Design",
    count: 14,
    children: [
      { value: "product-design", label: "Product design", count: 9 },
      { value: "brand", label: "Brand", count: 5 },
    ],
  },
  {
    value: "operations",
    label: "Operations",
    count: 22,
    children: [
      { value: "people-ops", label: "People Ops", count: 12 },
      { value: "finance", label: "Finance", count: 10 },
    ],
  },
  {
    value: "legal",
    label: "Legal",
    disabled: true,
    children: [{ value: "compliance", label: "Compliance", disabled: true }],
  },
]

const usageCode = `import { TreeSelect, TreeMultiSelect } from "@/components/ui/tree-select"
import type { TreeNode } from "@/components/ui/tree-select"

const data: TreeNode[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "frontend", label: "Frontend", count: 14 },
      { value: "backend", label: "Backend", count: 28 },
    ],
  },
]

<TreeSelect data={data} searchable defaultExpanded={["engineering"]} />`

export default function TreeSelectPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Tree Select"]}
      title="Tree Select"
      description="Hierarchical pickers — single category select with a breadcrumb trigger, and a multi-select with cascading checkboxes and indeterminate parent states."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tree-select" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock className="mt-4" code={usageCode} />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-sm">
          <TreeSelect
            data={departments}
            searchable
            defaultExpanded={["engineering", "frontend"]}
            defaultValue="react"
          />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="single">Single category select</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Folders expand on click; selecting a leaf sets the value and shows it in the trigger as a
        breadcrumb path. Searchable filters nodes by label while keeping ancestors visible.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-sm">
          <TreeSelect
            data={departments}
            placeholder="Select a category…"
            searchable
            defaultExpanded={["engineering", "frontend"]}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="multi">Multi-select with cascade + indeterminate</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Checking a parent selects or deselects all of its descendants. When only some descendants are
        selected, the parent shows an indeterminate dash. The trigger shows chips per selected leaf;
        the footer offers Clear all and Apply.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-lg">
          <TreeMultiSelect
            data={departments}
            placeholder="Select departments & teams…"
            searchable
            defaultExpanded={["engineering", "frontend", "sales"]}
            defaultValue={["react", "vue", "inbound"]}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-treeselect">TreeSelect</DocH3>
      <PropsTable
        rows={[
          { prop: "data", type: "TreeNode[]", default: "—", desc: "Tree of selectable nodes" },
          { prop: "value", type: "string", default: "—", desc: "Controlled selected leaf value" },
          { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
          { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when a leaf is selected" },
          { prop: "placeholder", type: "string", default: '"Select…"', desc: "Shown when nothing is selected" },
          { prop: "searchable", type: "boolean", default: "false", desc: "Show a label filter input" },
          { prop: "defaultExpanded", type: "string[]", default: "[]", desc: "Node values expanded initially" },
          { prop: "breadcrumb", type: "boolean", default: "true", desc: "Show full path in the trigger" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Disable the control" },
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
          { prop: "className", type: "string", default: "—", desc: "Classes for the trigger" },
        ]}
      />

      <DocH3 id="api-treemultiselect">TreeMultiSelect</DocH3>
      <PropsTable
        rows={[
          { prop: "data", type: "TreeNode[]", default: "—", desc: "Tree of selectable nodes" },
          { prop: "value", type: "string[]", default: "—", desc: "Controlled selected leaf values" },
          { prop: "defaultValue", type: "string[]", default: "[]", desc: "Initial selection when uncontrolled" },
          { prop: "onValueChange", type: "(value: string[]) => void", default: "—", desc: "Called with selected leaf values" },
          { prop: "placeholder", type: "string", default: '"Select…"', desc: "Shown when nothing is selected" },
          { prop: "searchable", type: "boolean", default: "false", desc: "Show a label filter input" },
          { prop: "defaultExpanded", type: "string[]", default: "[]", desc: "Node values expanded initially" },
          { prop: "showFooter", type: "boolean", default: "true", desc: "Show Clear all + Apply; defers changes until Apply" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Disable the control" },
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
          { prop: "className", type: "string", default: "—", desc: "Classes for the trigger" },
        ]}
      />

      <DocH3 id="api-treenode">TreeNode</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The shape of each entry in <code>data</code>. Nodes without <code>children</code> are leaves
        (selectable); nodes with <code>children</code> are folders. Cascade selection and parent
        state are computed from the selectable leaves under each folder.
      </p>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "Unique node identifier" },
          { prop: "label", type: "string", default: "—", desc: "Display text" },
          { prop: "children", type: "TreeNode[]", default: "—", desc: "Child nodes; presence makes it a folder" },
          { prop: "count", type: "number", default: "—", desc: "Optional trailing count badge" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Make the node unselectable" },
        ]}
      />
    </DocPage>
  )
}

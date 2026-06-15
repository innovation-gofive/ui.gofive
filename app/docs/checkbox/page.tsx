"use client"

import { useState } from "react"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
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
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Indeterminate", href: "#indeterminate", depth: 1 },
  { title: "Group with hierarchy", href: "#group", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function CheckboxPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Checkbox"]}
      title="Checkbox"
      description="A control that lets the user toggle between checked, unchecked, and indeterminate states — built on Radix with primary-themed active states and sm / md / lg sizes."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/checkbox" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Checkbox } from "@/components/ui/checkbox"`}
      />
      <ComponentPreview
        className="min-h-[100px]"
        code={`<label className="flex items-center gap-2.5 text-sm">
  <Checkbox defaultChecked />
  Accept terms and conditions
</label>`}
      >
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox defaultChecked />
          Accept terms and conditions
        </label>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="states">States</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Unchecked, checked, indeterminate, and disabled variants.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox />
            Unchecked
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox defaultChecked />
            Checked
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked="indeterminate" />
            Indeterminate
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Checkbox disabled />
            Disabled
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Checkbox disabled defaultChecked />
            Disabled on
          </label>
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three sizes — 14 / 18 / 22 px boxes.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2 text-[13px]">
            <Checkbox size="sm" defaultChecked />
            Small
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox size="md" defaultChecked />
            Medium
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox size="lg" defaultChecked />
            Large
          </label>
        </div>
      </ComponentPreview>

      <DocH3 id="indeterminate">Indeterminate</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A controlled checkbox cycling through unchecked → checked → indeterminate.</p>
      <IndeterminateExample />

      <DocH3 id="group">Group with hierarchy</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A parent that reflects the state of its children — checked, unchecked, or indeterminate.</p>
      <GroupExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-checkbox">Checkbox</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Wraps Radix <code className="font-mono text-[12px]">Checkbox.Root</code> — accepts all of its props.
      </p>
      <PropsTable rows={[
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Box dimensions (14 / 18 / 22 px)" },
        { prop: "checked", type: 'boolean | "indeterminate"', default: "—", desc: "Controlled state — pass \"indeterminate\" for the partial look" },
        { prop: "defaultChecked", type: "boolean", default: "—", desc: "Initial state when uncontrolled" },
        { prop: "onCheckedChange", type: "(checked: boolean | \"indeterminate\") => void", default: "—", desc: "Fires when the state changes" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Prevents interaction" },
        { prop: "required", type: "boolean", default: "false", desc: "Marks the field as required in a form" },
        { prop: "name", type: "string", default: "—", desc: "Name submitted with the form" },
      ]} />
    </DocPage>
  )
}

function IndeterminateExample() {
  const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate")

  return (
    <ComponentPreview>
      <button
        type="button"
        className="flex items-center gap-2.5 text-sm"
        onClick={() =>
          setChecked(c => (c === false ? true : c === true ? "indeterminate" : false))
        }
      >
        <Checkbox checked={checked} />
        State: {checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked"}
      </button>
    </ComponentPreview>
  )
}

const ITEMS = ["View records", "Create records", "Delete records", "Export data"] as const

function GroupExample() {
  const [selected, setSelected] = useState<string[]>(["View records", "Create records"])

  const all = selected.length === ITEMS.length
  const none = selected.length === 0
  const parent: boolean | "indeterminate" = all ? true : none ? false : "indeterminate"

  function toggleParent() {
    setSelected(all ? [] : [...ITEMS])
  }

  function toggleItem(item: string) {
    setSelected(s => (s.includes(item) ? s.filter(x => x !== item) : [...s, item]))
  }

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-xs flex-col gap-2.5 rounded-xl border bg-muted/30 p-4">
        <label className="flex items-center gap-2.5 text-sm font-semibold">
          <Checkbox checked={parent} onCheckedChange={toggleParent} />
          Permissions
        </label>
        <div className="flex flex-col gap-2 pl-7">
          {ITEMS.map(item => (
            <label key={item} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={selected.includes(item)}
                onCheckedChange={() => toggleItem(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </ComponentPreview>
  )
}

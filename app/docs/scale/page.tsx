"use client"

import { NPSScale, CSATScale } from "@/registry/new-york/ui/scale"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "NPS", href: "#nps", depth: 1 },
  { title: "CSAT", href: "#csat", depth: 1 },
  { title: "Custom faces", href: "#custom-faces", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function ScalePage() {
  return (
    <DocPage
      breadcrumb={["Components", "Scale"]}
      title="Scale"
      description="Survey rating inputs — an NPS 0–10 numeric scale and a CSAT emoji selector, each controllable or uncontrolled."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/scale" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { NPSScale, CSATScale } from "@/components/ui/scale"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <NPSScale defaultValue={8} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="nps">NPS</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A 0–10 numeric scale for Net Promoter Score questions.</p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <NPSScale defaultValue={8} />
        </div>
      </ComponentPreview>

      <DocH3 id="csat">CSAT</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">An emoji satisfaction selector — the value is the 1-based index of the chosen face.</p>
      <ComponentPreview>
        <CSATScale defaultValue={4} />
      </ComponentPreview>

      <DocH3 id="custom-faces">Custom faces</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Pass your own <code>faces</code> array to swap the emoji set.</p>
      <ComponentPreview>
        <CSATScale faces={["🥲", "😕", "😶", "😄", "🤩"]} defaultValue={5} />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-npsscale">NPSScale</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "number", default: "—", desc: "Controlled selected value" },
        { prop: "defaultValue", type: "number", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "min", type: "number", default: "0", desc: "Lowest value in the scale" },
        { prop: "max", type: "number", default: "10", desc: "Highest value in the scale" },
        { prop: "onChange", type: "(value: number) => void", default: "—", desc: "Called when a value is selected" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-csatscale">CSATScale</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "number", default: "—", desc: "Controlled selection (1-based index)" },
        { prop: "defaultValue", type: "number", default: "—", desc: "Initial selection when uncontrolled (1-based index)" },
        { prop: "faces", type: "string[]", default: '["😞","🙁","😐","🙂","😍"]', desc: "Emoji shown for each rating" },
        { prop: "onChange", type: "(value: number) => void", default: "—", desc: "Called with the 1-based index when selected" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

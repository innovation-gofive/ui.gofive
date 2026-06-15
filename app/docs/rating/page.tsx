"use client"

import { useState } from "react"
import { Rating } from "@/registry/new-york/ui/rating"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Read only", href: "#read-only", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Custom max", href: "#custom-max", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function RatingPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Rating"]}
      title="Rating"
      description="A star rating input supporting controlled and uncontrolled use, hover preview, read-only display, and three sizes."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/rating" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Rating } from "@/components/ui/rating"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <Rating defaultValue={3} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Drive the value with state and react to changes.</p>
      <ControlledExample />

      <DocH3 id="read-only">Read only</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Display an existing score without interaction.</p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-3">
          <Rating value={4} readOnly />
          <Rating value={2} readOnly />
          <Rating value={5} readOnly size="sm" />
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three star sizes — 16 / 22 / 28 px.</p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-4">
          <Rating defaultValue={3} size="sm" />
          <Rating defaultValue={3} size="md" />
          <Rating defaultValue={3} size="lg" />
        </div>
      </ComponentPreview>

      <DocH3 id="custom-max">Custom max</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Render any number of stars with <code>max</code>.</p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-4">
          <Rating defaultValue={6} max={10} size="sm" />
          <Rating defaultValue={2} max={3} />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-rating">Rating</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "number", default: "—", desc: "Controlled value — pair with onChange" },
        { prop: "defaultValue", type: "number", default: "0", desc: "Initial value when uncontrolled" },
        { prop: "max", type: "number", default: "5", desc: "Number of stars" },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Star size (16 / 22 / 28 px)" },
        { prop: "readOnly", type: "boolean", default: "false", desc: "Display-only, no interaction" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Non-interactive and dimmed" },
        { prop: "onChange", type: "(value: number) => void", default: "—", desc: "Called with the selected star value" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [value, setValue] = useState(3)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-3">
        <Rating value={value} onChange={setValue} size="lg" />
        <p className="text-sm text-muted-foreground tabular-nums">
          {value} of 5 stars
        </p>
      </div>
    </ComponentPreview>
  )
}

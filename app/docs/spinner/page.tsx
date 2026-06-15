"use client"

import { Spinner } from "@/registry/new-york/ui/spinner"
import { Button } from "@/registry/new-york/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Colors", href: "#colors", depth: 1 },
  { title: "In buttons", href: "#in-buttons", depth: 1 },
  { title: "Inline", href: "#inline", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SpinnerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Spinner"]}
      title="Spinner"
      description="A circular loading indicator with size and semantic color props — the keyframe is hoisted once via the React 19 style-precedence pattern."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/spinner" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Spinner } from "@/components/ui/spinner"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <Spinner />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three sizes — 14 / 20 / 40 px.</p>
      <ComponentPreview>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </ComponentPreview>

      <DocH3 id="colors">Colors</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Semantic intents map to the GoFive palette.</p>
      <ComponentPreview>
        <div className="flex items-center gap-6">
          <Spinner color="primary" />
          <Spinner color="success" />
          <Spinner color="warn" />
          <Spinner color="danger" />
          <Spinner color="info" />
        </div>
      </ComponentPreview>

      <DocH3 id="in-buttons">In buttons</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Use <code>color=&quot;current&quot;</code> to inherit the button text color.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>
            <Spinner size="sm" color="current" />
            Saving…
          </Button>
          <Button variant="outline" disabled>
            <Spinner size="sm" color="current" />
            Loading
          </Button>
        </div>
      </ComponentPreview>

      <DocH3 id="inline">Inline</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Sits on the text baseline next to a label.</p>
      <ComponentPreview>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" />
          Loading results
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-spinner">Spinner</DocH3>
      <PropsTable rows={[
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Diameter (14 / 20 / 40 px)" },
        { prop: "color", type: '"primary" | "success" | "warn" | "danger" | "info" | "current"', default: '"primary"', desc: "Spinner color · current inherits currentColor" },
        { prop: "label", type: "string", default: '"Loading"', desc: "Accessible label announced to screen readers" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

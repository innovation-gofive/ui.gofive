"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/registry/new-york/ui/progress"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Colors", href: "#colors", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Animated", href: "#animated", depth: 1 },
  { title: "With label", href: "#with-label", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function ProgressPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Progress"]}
      title="Progress"
      description="A linear progress bar built on Radix Progress with GoFive semantic colors and three sizes — for uploads, completion meters, and loading states."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/progress" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Progress } from "@/components/ui/progress"`}
      />
      <ComponentPreview
        className="min-h-[100px]"
        code={`<Progress value={60} className="max-w-sm" />`}
      >
        <Progress value={60} className="max-w-sm" />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="colors">Colors</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Semantic intents map to the GoFive palette.</p>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Progress value={72} color="primary" />
          <Progress value={88} color="success" />
          <Progress value={55} color="warn" />
          <Progress value={34} color="danger" />
          <Progress value={64} color="info" />
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three track heights — 4 / 6 / 10 px.</p>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Progress value={60} size="sm" />
          <Progress value={60} size="md" />
          <Progress value={60} size="lg" />
        </div>
      </ComponentPreview>

      <DocH3 id="animated">Animated</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The indicator transitions smoothly when the value changes.</p>
      <AnimatedExample />

      <DocH3 id="with-label">With label</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Pair the bar with a caption row for upload and completion meters.</p>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span>Uploading…</span>
            <span className="text-muted-foreground">34%</span>
          </div>
          <Progress value={34} color="primary" />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-progress">Progress</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Extends the Radix Progress root — accepts all of its props.</p>
      <PropsTable rows={[
        { prop: "value", type: "number", default: "0", desc: "Current progress, 0–100" },
        { prop: "color", type: '"primary" | "success" | "warn" | "danger" | "info"', default: '"primary"', desc: "Semantic fill color" },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Track height (4 / 6 / 10 px)" },
        { prop: "className", type: "string", default: "—", desc: "Override width and track styles" },
      ]} />
    </DocPage>
  )
}

function AnimatedExample() {
  const [value, setValue] = useState(13)

  useEffect(() => {
    const id = setInterval(() => {
      setValue(v => (v >= 100 ? 0 : v + 11))
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-sm flex-col gap-1.5">
        <div className="flex justify-between text-xs">
          <span>Processing</span>
          <span className="text-muted-foreground tabular-nums">{value}%</span>
        </div>
        <Progress value={value} color="success" />
      </div>
    </ComponentPreview>
  )
}

"use client"

import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Variants", href: "#variants", depth: 1 },
  { title: "Shapes", href: "#shapes", depth: 1 },
  { title: "Card placeholder", href: "#card", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SkeletonPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Skeleton"]}
      title="Skeleton"
      description="A placeholder that mirrors content layout while it loads, with shimmer or pulse animation and a circle option for avatars."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/skeleton" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Skeleton } from "@/components/ui/skeleton"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <Skeleton className="h-4 w-48" />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="variants">Variants</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Choose between a sweeping <code>shimmer</code> and a fading <code>pulse</code>.</p>
      <ComponentPreview>
        <div className="flex items-center gap-6">
          <Skeleton variant="shimmer" className="h-4 w-40" />
          <Skeleton variant="pulse" className="h-4 w-40" />
        </div>
      </ComponentPreview>

      <DocH3 id="shapes">Shapes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Use <code>circle</code> for avatars alongside text lines.</p>
      <ComponentPreview>
        <div className="flex items-center gap-3">
          <Skeleton circle className="size-12" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </ComponentPreview>

      <DocH3 id="card">Card placeholder</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Compose primitives to stand in for a profile card.</p>
      <ComponentPreview>
        <div className="flex w-full max-w-sm items-center gap-4 rounded-lg border p-4">
          <Skeleton circle className="size-12 shrink-0" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-skeleton">Skeleton</DocH3>
      <PropsTable rows={[
        { prop: "variant", type: '"shimmer" | "pulse"', default: '"shimmer"', desc: "Animation style" },
        { prop: "circle", type: "boolean", default: "false", desc: "Render as a circle (avatar placeholder)" },
        { prop: "className", type: "string", default: "—", desc: "Sizing and additional classes (e.g. h-4 w-40)" },
      ]} />
    </DocPage>
  )
}

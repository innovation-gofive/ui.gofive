"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
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
  { title: "Placements", href: "#placements", depth: 1 },
  { title: "Rich content", href: "#rich-content", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function TooltipPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Tooltip"]}
      title="Tooltip"
      description="A popup that displays information related to an element when it receives keyboard focus or the mouse hovers over it — built on Radix Tooltip."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tooltip" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"`}
      />
      <ComponentPreview
        className="min-h-[120px]"
        code={`<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="placements">Placements</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Position the content on any side of the trigger.</p>
      <ComponentPreview>
        <TooltipProvider>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">On top</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">On the right</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">On the bottom</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">On the left</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentPreview>

      <DocH3 id="rich-content">Rich content</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Tooltips can hold titles and multi-line descriptions.</p>
      <ComponentPreview>
        <TooltipProvider>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">⌘ K</Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[240px]">
                <p className="font-semibold">Keyboard shortcut</p>
                <p className="mt-1 text-background/80">
                  Press ⌘K to open the quick switcher from anywhere.
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Setting</Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[240px]">
                <p className="font-semibold">Locked by admin</p>
                <p className="mt-1 text-background/80">
                  This setting is managed by your organisation. Contact your
                  workspace admin to change it.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-provider">TooltipProvider</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Wraps the app (or a section) to share tooltip state and delay. Tooltip renders its own provider, so wrapping is only needed to tune <code>delayDuration</code> across several tooltips.</p>
      <PropsTable rows={[
        { prop: "delayDuration", type: "number", default: "0", desc: "Delay in ms before the tooltip opens" },
      ]} />

      <DocH3 id="api-content">TooltipContent</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Extends the Radix Tooltip content — accepts all of its props.</p>
      <PropsTable rows={[
        { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', desc: "Preferred side of the trigger" },
        { prop: "sideOffset", type: "number", default: "0", desc: "Distance in px from the trigger" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

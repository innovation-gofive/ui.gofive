"use client"

import { Textarea } from "@/registry/new-york/ui/textarea"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Default", href: "#default", depth: 1 },
  { title: "With counter", href: "#with-counter", depth: 1 },
  { title: "Auto-resize", href: "#auto-resize", depth: 1 },
  { title: "Error state", href: "#error-state", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function TextareaPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Textarea"]}
      title="Textarea"
      description="A card-style multiline text input with focus ring, validation states, an optional character counter and auto-resize."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/textarea" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Textarea } from "@/components/ui/textarea"`}
      />
      <ComponentPreview className="min-h-[140px]">
        <div className="w-full max-w-md">
          <Textarea defaultValue="The quick brown fox jumps over the lazy dog." />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">An uncontrolled textarea with placeholder text.</p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Textarea placeholder="Leave a comment…" />
        </div>
      </ComponentPreview>

      <DocH3 id="with-counter">With counter</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>maxLength</code> with <code>showCount</code> to display a live <code>used / max</code> counter inside the box.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Textarea
            maxLength={280}
            showCount
            defaultValue="What's on your mind?"
            placeholder="Up to 280 characters…"
          />
        </div>
      </ComponentPreview>

      <DocH3 id="auto-resize">Auto-resize</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>autoResize</code> so the field grows to fit its content as you type.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Textarea
            autoResize
            defaultValue={"This textarea grows as you add lines.\nTry pressing enter a few times…"}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="error-state">Error state</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Use <code>state=&quot;error&quot;</code> or <code>state=&quot;success&quot;</code> to reflect validation.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-md flex-col gap-3">
          <Textarea state="error" defaultValue="This message is too short." />
          <Textarea state="success" defaultValue="Looks good!" />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled value" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when the value changes" },
        { prop: "state", type: '"error" | "success"', default: "—", desc: "Visual validation state" },
        { prop: "maxLength", type: "number", default: "—", desc: "Maximum number of characters" },
        { prop: "showCount", type: "boolean", default: "false", desc: "Show the character counter (requires maxLength)" },
        { prop: "autoResize", type: "boolean", default: "false", desc: "Grow the height to fit content" },
        { prop: "containerClassName", type: "string", default: "—", desc: "Classes for the bordered wrapper" },
        { prop: "className", type: "string", default: "—", desc: "Classes for the inner textarea element" },
      ]} />
    </DocPage>
  )
}

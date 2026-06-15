"use client"

import { TagInput } from "@/registry/new-york/ui/tag-input"
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
  { title: "Max tags", href: "#max-tags", depth: 1 },
  { title: "Empty", href: "#empty", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function TagInputPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Tag Input"]}
      title="Tag Input"
      description="A free-form tag entry field — type and press Enter or comma to add a chip, Backspace to remove the last one, or click a chip's × to dismiss it."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tag-input" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { TagInput } from "@/components/ui/tag-input"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-md">
          <TagInput defaultValue={["Sales", "HR", "Bangkok"]} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Starts with preset tags. Press Enter or comma to add, Backspace on an empty field to remove the last.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <TagInput defaultValue={["Sales", "HR", "Bangkok"]} />
        </div>
      </ComponentPreview>

      <DocH3 id="max-tags">Max tags</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Use <code>max</code> to cap the number of tags. The input stops accepting new entries once the limit is reached.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <TagInput defaultValue={["Design", "Engineering"]} max={3} />
        </div>
      </ComponentPreview>

      <DocH3 id="empty">Empty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An empty field with a custom placeholder.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <TagInput placeholder="Add a skill…" />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-taginput">TagInput</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string[]", default: "—", desc: "Controlled list of tags" },
        { prop: "defaultValue", type: "string[]", default: "[]", desc: "Initial tags when uncontrolled" },
        { prop: "onValueChange", type: "(value: string[]) => void", default: "—", desc: "Called when tags are added or removed" },
        { prop: "placeholder", type: "string", default: '"Add tag…"', desc: "Placeholder for the text input" },
        { prop: "max", type: "number", default: "—", desc: "Maximum number of tags allowed" },
        { prop: "allowDuplicates", type: "boolean", default: "false", desc: "Allow the same tag more than once" },
        { prop: "separator", type: "string[]", default: '[\",\"]', desc: "Keys that commit a tag (Enter always commits)" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disable the field" },
        { prop: "className", type: "string", default: "—", desc: "Classes for the text input" },
        { prop: "containerClassName", type: "string", default: "—", desc: "Classes for the chip container" },
      ]} />
    </DocPage>
  )
}

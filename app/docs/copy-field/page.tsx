"use client"

import { CopyField } from "@/registry/new-york/ui/copy-field"
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
  { title: "Icon only", href: "#icon-only", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const URL = "https://dropx.gofive.co.th/s/quarterly-report-2026-q3/index.html"

export default function CopyFieldPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Copy Field"]}
      title="Copy Field"
      description="A labelled, read-only field with a copy button for values that must be copied exactly: URLs, tokens, IDs. Falls back on non-secure origins and confirms only a copy that succeeded."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/copy-field" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { CopyField } from "@/components/ui/copy-field"

<CopyField label="Site link" value={url} />`}
      />
      <ComponentPreview className="min-h-[120px]">
        <div className="w-full max-w-md">
          <CopyField label="Site link" value={URL} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>inputSize</code> uses the same scale as Input; the button height follows it.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-3">
          {(["xs", "sm", "md", "lg"] as const).map((s) => (
            <CopyField key={s} inputSize={s} aria-label={`Token (${s})`} value="tok_7f3a9c2e41b8" />
          ))}
        </div>
      </ComponentPreview>

      <DocH3 id="icon-only">Icon only</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The button&apos;s accessible name stays &quot;Copy&quot; / &quot;Copied&quot;, and it is described by the field label.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <CopyField label="CI token" value="dpx_live_4e1b0c9a7d2f" iconOnly />
        </div>
      </ComponentPreview>

      <DocH3 id="labels">Localized labels</DocH3>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <CopyField
            label="ลิงก์แชร์"
            value={URL}
            labels={{ copy: "คัดลอก", copied: "คัดลอกแล้ว" }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "Shown read-only and copied verbatim" },
          { prop: "label", type: "React.ReactNode", default: "—", desc: "Visible label linked to the input; without it pass aria-label" },
          { prop: "inputSize", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', desc: "Height preset shared with Input" },
          { prop: "labels", type: "Partial<{ copy; copied }>", default: "English", desc: "Button text and live announcement" },
          { prop: "onCopy", type: "(value: string) => void", default: "—", desc: "Called after a successful copy only" },
          { prop: "resetAfter", type: "number", default: "2000", desc: "How long the copied state lasts, in ms" },
          { prop: "iconOnly", type: "boolean", default: "false", desc: "Icon button instead of icon + text" },
          { prop: "inputClassName", type: "string", default: "—", desc: "Class for the input element; className lands on the root" },
          { prop: "ref", type: "Ref<HTMLInputElement>", default: "—", desc: "Forwarded to the input" },
        ]}
      />
    </DocPage>
  )
}

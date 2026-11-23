"use client"

import { CodeBlock } from "@/registry/new-york/ui/code-block"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock as DocCodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Without header", href: "#no-header", depth: 1 },
  { title: "Wrapping", href: "#wrap", depth: 1 },
  { title: "Max height", href: "#max-height", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const CURL = `curl -fsS -H "Authorization: Bearer $DROPX_TOKEN" -F file=@site.zip https://dropx.gofive.co.th/api/ci/sites/quarterly-report/deployments`

const LOG = Array.from(
  { length: 24 },
  (_, i) => `[12:00:${String(i).padStart(2, "0")}] step ${i + 1}/24 uploaded chunk ${i + 1}`,
).join("\n")

export default function CodeBlockPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Code Block"]}
      title="Code Block"
      description="A monospace block for commands and snippets that scrolls instead of truncating, with a copy button that copies exactly the code and an optional label and language caption."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/code-block" />

      <DocH2 id="usage">Usage</DocH2>
      <DocCodeBlock
        className="mt-4"
        code={`import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock label="Example request" language="bash" code={command} />`}
      />
      <ComponentPreview className="min-h-[140px]">
        <div className="w-full max-w-xl">
          <CodeBlock label="Example request" language="bash" code={CURL} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="no-header">Without header</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        With no <code>label</code> or <code>language</code>, the copy button floats in the corner.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CodeBlock code="npx shadcn@latest add @gofive/code-block" />
        </div>
      </ComponentPreview>

      <DocH3 id="wrap">Wrapping</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Lines scroll horizontally by default; <code>wrap</code> breaks them instead.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CodeBlock language="bash" code={CURL} wrap />
        </div>
      </ComponentPreview>

      <DocH3 id="max-height">Max height</DocH3>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CodeBlock label="Deploy log" code={LOG} maxHeight={160} copyable={false} />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <PropsTable
        rows={[
          { prop: "code", type: "string", default: "—", desc: "Rendered and copied verbatim" },
          { prop: "language", type: "string", default: "—", desc: "Header caption and data-language; no highlighting" },
          { prop: "label", type: "React.ReactNode", default: "—", desc: "Header title; also names the scroll region" },
          { prop: "copyable", type: "boolean", default: "true", desc: "Show the copy button" },
          { prop: "wrap", type: "boolean", default: "false", desc: "Wrap long lines instead of scrolling" },
          { prop: "maxHeight", type: "number | string", default: "—", desc: "Vertical cap before scrolling" },
          { prop: "labels", type: "Partial<{ copy; copied; code }>", default: "English", desc: "Button text, announcement, region name" },
          { prop: "onCopy", type: "(code: string) => void", default: "—", desc: "Called after a successful copy only" },
        ]}
      />
    </DocPage>
  )
}

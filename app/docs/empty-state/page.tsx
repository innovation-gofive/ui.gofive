"use client"

import { EmptyState } from "@/registry/new-york/ui/empty-state"
import { Button } from "@/registry/new-york/ui/button"
import { Inbox, AlertTriangle } from "lucide-react"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Tones", href: "#tones", depth: 1 },
  { title: "With actions", href: "#with-actions", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function EmptyStatePage() {
  return (
    <DocPage
      breadcrumb={["Components", "Empty State"]}
      title="Empty State"
      description="A centered placeholder for empty, error, or zero-data views — pairs a tinted icon tile with a title, description, and optional actions."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/empty-state" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { EmptyState } from "@/components/ui/empty-state"`}
      />
      <ComponentPreview>
        <EmptyState
          icon={<Inbox />}
          title="No records yet"
          description="Create your first record to get started. You can import from CSV or add manually."
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="tones">Tones</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The <code>tone</code> prop colors the icon tile to match the message intent.</p>
      <ComponentPreview>
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <EmptyState
            icon={<Inbox />}
            title="No records yet"
            description="Create your first record to get started. You can import from CSV or add manually."
          />
          <EmptyState
            tone="danger"
            icon={<AlertTriangle />}
            title="Something went wrong"
            description="We couldn't load your data. Check your connection and try again."
            actions={<Button>Retry</Button>}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="with-actions">With actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Pass buttons or links to <code>actions</code> to guide the next step.</p>
      <ComponentPreview>
        <EmptyState
          icon={<Inbox />}
          title="No records yet"
          description="Create your first record to get started. You can import from CSV or add manually."
          actions={
            <>
              <Button variant="outline">Import CSV</Button>
              <Button>New record</Button>
            </>
          }
        />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-empty-state">EmptyState</DocH3>
      <PropsTable rows={[
        { prop: "icon", type: "React.ReactNode", default: "—", desc: "Icon shown in the tinted rounded tile (auto-sized to 40px)" },
        { prop: "title", type: "string", default: "—", desc: "Heading text · required" },
        { prop: "description", type: "React.ReactNode", default: "—", desc: "Supporting copy below the title" },
        { prop: "tone", type: '"neutral" | "success" | "warn" | "danger" | "info"', default: '"neutral"', desc: "Color of the icon tile" },
        { prop: "actions", type: "React.ReactNode", default: "—", desc: "Buttons or links rendered below the copy" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

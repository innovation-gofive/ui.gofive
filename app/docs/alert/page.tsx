"use client"

import { Sparkles } from "lucide-react"

import { Alert } from "@/registry/new-york/ui/alert"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Statuses", href: "#statuses", depth: 1 },
  { title: "Dismissible", href: "#dismissible", depth: 1 },
  { title: "Custom icon", href: "#custom-icon", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function AlertPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Alert"]}
      title="Alert"
      description="An inline info bar that surfaces a contextual message with a semantic status accent, optional dismiss button, and overridable icon."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/alert" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Alert } from "@/components/ui/alert"`}
      />
      <ComponentPreview>
        <div className="w-full max-w-xl mx-auto flex flex-col gap-2.5">
          <Alert status="info">
            <strong>Heads up.</strong> New filters are live on the records page.
          </Alert>
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="statuses">Statuses</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Four semantic intents map to the Gofive palette.</p>
      <ComponentPreview>
        <div className="w-full max-w-xl mx-auto flex flex-col gap-2.5">
          <Alert status="info">
            <strong>Heads up.</strong> New filters are live on the records page.
          </Alert>
          <Alert status="success">
            <strong>Saved.</strong> Your changes have been published.
          </Alert>
          <Alert status="warn">
            <strong>Almost full.</strong> You have used 90% of your storage quota.
          </Alert>
          <Alert status="danger">
            <strong>Sync failed.</strong> We could not reach the server — retry shortly.
          </Alert>
        </div>
      </ComponentPreview>

      <DocH3 id="dismissible">Dismissible</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Passing <code>onClose</code> toggles a dismiss button on the trailing edge.</p>
      <ComponentPreview>
        <div className="w-full max-w-xl mx-auto flex flex-col gap-2.5">
          <Alert status="success" onClose={() => {}}>
            <strong>Invite sent.</strong> They will receive an email to join the workspace.
          </Alert>
        </div>
      </ComponentPreview>

      <DocH3 id="custom-icon">Custom icon</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Override the default status icon with the <code>icon</code> prop, or pass <code>null</code> to hide it.</p>
      <ComponentPreview>
        <div className="w-full max-w-xl mx-auto flex flex-col gap-2.5">
          <Alert status="info" icon={<Sparkles />}>
            <strong>New.</strong> AI summaries are now available on every record.
          </Alert>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-alert">Alert</DocH3>
      <PropsTable rows={[
        { prop: "status", type: '"info" | "success" | "warn" | "danger"', default: '"info"', desc: "Semantic intent driving accent, background, and default icon" },
        { prop: "icon", type: "React.ReactNode", default: "—", desc: "Override the default status icon · pass null to hide it" },
        { prop: "onClose", type: "() => void", default: "—", desc: "When set, shows a dismiss button and calls this on click" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

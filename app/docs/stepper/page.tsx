"use client"

import { Stepper } from "@/registry/new-york/ui/stepper"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Horizontal", href: "#horizontal", depth: 1 },
  { title: "Vertical", href: "#vertical", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function StepperPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Stepper"]}
      title="Stepper"
      description="A step progress indicator that renders completed, active, and upcoming steps in either a horizontal or vertical layout."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/stepper" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Stepper } from "@/components/ui/stepper"

<Stepper
  steps={[
    { title: "Account" },
    { title: "Profile" },
    { title: "Preferences" },
    { title: "Review" },
  ]}
  current={2}
/>`}
      />
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <Stepper
            steps={[
              { title: "Account" },
              { title: "Profile" },
              { title: "Preferences" },
              { title: "Review" },
            ]}
            current={2}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="horizontal">Horizontal</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The default orientation — steps flow left to right with connectors between them.</p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <Stepper
            steps={[
              { title: "Account" },
              { title: "Profile" },
              { title: "Preferences" },
              { title: "Review" },
            ]}
            current={2}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="vertical">Vertical</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Set <code>orientation=&quot;vertical&quot;</code> to stack steps top to bottom — ideal when each step carries a description.</p>
      <ComponentPreview>
        <div className="w-full max-w-sm">
          <Stepper
            orientation="vertical"
            steps={[
              { title: "Upload document", description: "receipt-apr-2026.pdf · 2.4 MB" },
              { title: "Validation passed", description: "All 14 fields extracted" },
              { title: "Review & sign", description: "Pending with Finance" },
              { title: "Submit", description: "Waiting for sign-off" },
            ]}
            current={2}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-stepper">Stepper</DocH3>
      <PropsTable rows={[
        { prop: "steps", type: "StepItem[]", default: "—", desc: "Steps to render (required). See StepItem below." },
        { prop: "current", type: "number", default: "0", desc: "0-based index of the active step · earlier steps render as done" },
        { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "Layout direction" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-stepitem">StepItem</DocH3>
      <PropsTable rows={[
        { prop: "title", type: "string", default: "—", desc: "Step label (required)" },
        { prop: "description", type: "string", default: "—", desc: "Optional supporting text, shown beneath the title" },
      ]} />
    </DocPage>
  )
}

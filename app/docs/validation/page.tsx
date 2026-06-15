"use client"

import { ValidationMessage, RuleList, Rule } from "@/registry/new-york/ui/validation"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Inline messages", href: "#inline-messages", depth: 1 },
  { title: "Rule checklist", href: "#rule-checklist", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function ValidationPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Validation"]}
      title="Validation"
      description="Inline validation messages and a rule checklist for surfacing form feedback with semantic status colors."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/validation" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ValidationMessage, RuleList, Rule } from "@/components/ui/validation"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <ValidationMessage status="error">This email is already registered.</ValidationMessage>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="inline-messages">Inline messages</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Four statuses cover the common feedback intents.</p>
      <ComponentPreview>
        <div className="flex flex-col gap-2">
          <ValidationMessage status="error">This email is already registered.</ValidationMessage>
          <ValidationMessage status="warn">Weak password. Add a number or symbol.</ValidationMessage>
          <ValidationMessage status="success">Looks good.</ValidationMessage>
          <ValidationMessage status="info">Your team admin must approve this.</ValidationMessage>
        </div>
      </ComponentPreview>

      <DocH3 id="rule-checklist">Rule checklist</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Track requirements as the user types — passed rules show a check.</p>
      <ComponentPreview>
        <RuleList className="max-w-xs">
          <Rule passed>At least 8 characters</Rule>
          <Rule passed>Mix of upper &amp; lower case</Rule>
          <Rule>At least one number</Rule>
          <Rule>At least one symbol (!@#)</Rule>
        </RuleList>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-validationmessage">ValidationMessage</DocH3>
      <PropsTable rows={[
        { prop: "status", type: '"error" | "warn" | "success" | "info"', default: '"error"', desc: "Semantic intent — sets the color and default icon" },
        { prop: "icon", type: "React.ReactNode", default: "—", desc: "Override the status icon · pass null to hide it" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-rule">Rule</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Wrap <code>Rule</code> items in <code>RuleList</code>, a styled <code>&lt;ul&gt;</code> wrapper that accepts standard list attributes.
      </p>
      <PropsTable rows={[
        { prop: "passed", type: "boolean", default: "false", desc: "Renders a check when true, a bullet when false" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

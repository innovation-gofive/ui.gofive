"use client"

import { useState } from "react"
import { Bot } from "lucide-react"
import { ChangeSummary, type ChangeItem } from "@/registry/new-york/ui/change-summary"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Collapsible", href: "#collapsible", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Flat list", href: "#flat", depth: 1 },
  { title: "Custom icon", href: "#custom-icon", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "Empty", href: "#empty", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const SHORT: ChangeItem[] = [
  { label: "Billing plan", kind: "changed", before: "Starter", after: "Team", timestamp: "2 days ago", datetime: "2026-11-09" },
  { label: "SSO login", kind: "added", description: "Enabled for all workspace members.", timestamp: "Yesterday" },
  { label: "Legacy API key", kind: "removed", timestamp: "3 hours ago" },
]

const LONG: ChangeItem[] = [
  { label: "Checkout flow", kind: "added", description: "New one-page checkout is live.", timestamp: "Mon" },
  { label: "Dark mode", kind: "added", timestamp: "Mon" },
  { label: "Error rate", kind: "changed", before: "2.4%", after: "0.8%", timestamp: "Tue" },
  { label: "Median latency", kind: "changed", before: "420 ms", after: "310 ms", timestamp: "Tue" },
  { label: "Seats", kind: "changed", before: "18", after: "24", timestamp: "Wed" },
  { label: "Support SLA", kind: "changed", before: "24 h", after: "8 h", timestamp: "Wed" },
  { label: "Old dashboard", kind: "removed", timestamp: "Thu" },
  { label: "Beta banner", kind: "removed", timestamp: "Fri" },
]

export default function ChangeSummaryPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Change Summary"]}
      title="Change Summary"
      description="A 'what changed since last time' panel: a headline, then added / changed / removed items with optional before-to-after values and timestamps, collapsible when long."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/change-summary" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ChangeSummary } from "@/components/ui/change-summary"

<ChangeSummary
  title="Since your last visit"
  period="this week"
  headline="3 updates across your workspace"
  items={[
    { label: "Billing plan", kind: "changed", before: "Starter", after: "Team" },
    { label: "SSO login", kind: "added" },
    { label: "Legacy API key", kind: "removed", timestamp: "3 hours ago" },
  ]}
/>`}
      />
      <ComponentPreview className="min-h-[100px]">
        <ChangeSummary
          className="max-w-md"
          title="Since your last visit"
          period="this week"
          headline="3 updates across your workspace"
          items={SHORT}
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="collapsible">Collapsible</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Lists longer than <code>collapseAfter</code> (default 5) show a toggle for the rest.
      </p>
      <ComponentPreview>
        <ChangeSummary className="max-w-md" title="Release 4.2" headline="8 changes shipped" items={LONG} />
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Drive <code>open</code> from state.</p>
      <ControlledExample />

      <DocH3 id="flat">Flat list</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>grouped=false</code> keeps the given order; each row announces its kind to screen readers.
      </p>
      <ComponentPreview>
        <ChangeSummary className="max-w-md" title="Activity" grouped={false} items={SHORT} />
      </ComponentPreview>

      <DocH3 id="custom-icon">Custom icon</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Good for agent run outcomes.</p>
      <ComponentPreview>
        <ChangeSummary
          className="max-w-md"
          icon={<Bot />}
          title="Agent run #128"
          period="2 min"
          headline="Updated 2 files and removed 1."
          items={[
            { label: "src/app.ts", kind: "changed", description: "Renamed handler and fixed the null check." },
            { label: "src/util.ts", kind: "changed", before: "42 lines", after: "37 lines" },
            { label: "src/old.ts", kind: "removed" },
          ]}
        />
      </ComponentPreview>

      <DocH3 id="labels">Localized labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Every built-in string lives in <code>labels</code>.</p>
      <ComponentPreview>
        <ChangeSummary
          className="max-w-md"
          title="มีอะไรเปลี่ยนไป"
          collapseAfter={2}
          labels={{
            added: "เพิ่มใหม่",
            changed: "เปลี่ยนแปลง",
            removed: "ลบออก",
            showMore: (n) => `ดูอีก ${n} รายการ`,
            showLess: "ย่อ",
          }}
          items={SHORT}
        />
      </ComponentPreview>

      <DocH3 id="empty">Empty</DocH3>
      <ComponentPreview>
        <ChangeSummary className="max-w-md" title="Since last time" items={[]} />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-change-summary">ChangeSummary</DocH3>
      <PropsTable rows={[
        { prop: "items", type: "ChangeItem[]", default: "—", desc: "Rows to display" },
        { prop: "title", type: "ReactNode", default: "labels.title", desc: "Heading; also the accessible name of the region" },
        { prop: "headline", type: "ReactNode", default: "—", desc: "Short summary sentence under the heading" },
        { prop: "period", type: "string", default: "—", desc: "Time window shown at the far end of the heading" },
        { prop: "icon", type: "ReactNode", default: "History icon", desc: "Replaces the heading icon" },
        { prop: "grouped", type: "boolean", default: "true", desc: "Group rows under Added / Changed / Removed" },
        { prop: "collapseAfter", type: "number", default: "5", desc: "Rows visible while collapsed; shorter lists never collapse" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled expanded state — pair with onOpenChange" },
        { prop: "defaultOpen", type: "boolean", default: "false", desc: "Initial expanded state when uncontrolled" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the toggle is pressed" },
        { prop: "labels", type: "Partial<ChangeSummaryLabels>", default: "English", desc: "title, added, changed, removed, empty, showMore(hidden), showLess" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root; other section props are spread on it" },
      ]} />

      <DocH3 id="api-change-item">ChangeItem</DocH3>
      <PropsTable rows={[
        { prop: "label", type: "string", default: "—", desc: "Item name" },
        { prop: "kind", type: '"added" | "changed" | "removed"', default: "—", desc: "Maps to success / info / danger soft tokens" },
        { prop: "before", type: "string", default: "—", desc: "Previous value, struck through" },
        { prop: "after", type: "string", default: "—", desc: "New value" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Explanation under the label; clamped to 3 lines" },
        { prop: "timestamp", type: "string", default: "—", desc: "Pre-formatted time text" },
        { prop: "datetime", type: "string", default: "—", desc: "ISO 8601 value for the <time> element" },
        { prop: "id", type: "string", default: "position + label", desc: "Stable React key; set it when rows can reorder" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(true)

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <ChangeSummary
          className="w-full"
          title="Release 4.2"
          items={LONG}
          open={open}
          onOpenChange={setOpen}
        />
        <p className="text-sm text-muted-foreground">{open ? "Expanded" : "Collapsed"}</p>
      </div>
    </ComponentPreview>
  )
}

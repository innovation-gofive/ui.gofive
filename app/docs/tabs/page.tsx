"use client"

import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Underline", href: "#underline", depth: 1 },
  { title: "Pill", href: "#pill", depth: 1 },
  { title: "Segmented", href: "#segmented", depth: 1 },
  { title: "Vertical", href: "#vertical", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function TabsPage() {
  return (
    <DocPage
      breadcrumb={["Navigation", "Tabs"]}
      title="Tabs"
      description="Navigation tabs for switching between views, in four looks — underline, soft pill, segmented, and vertical — with optional count badges."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tabs" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview" badge={12}>Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="files" badge={3}>Files</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
</Tabs>`}
      />
      <ComponentPreview className="min-h-[80px] !block">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" badge={12}>Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files" badge={3}>Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="underline">Underline</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The default look — an underline marks the active tab, with optional count badges.</p>
      <ComponentPreview className="!block">
        <Tabs defaultValue="overview" variant="underline">
          <TabsList>
            <TabsTrigger value="overview" badge={12}>Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files" badge={3}>Files</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </ComponentPreview>

      <DocH3 id="pill">Pill</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A soft segmented look on a muted track, with a white raised active tab.</p>
      <ComponentPreview>
        <Tabs defaultValue="day" variant="pill">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </ComponentPreview>

      <DocH3 id="segmented">Segmented</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A bordered group where the active tab fills with the primary color.</p>
      <ComponentPreview>
        <Tabs defaultValue="board" variant="segmented">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </Tabs>
      </ComponentPreview>

      <DocH3 id="vertical">Vertical</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A stacked list for settings-style side navigation.</p>
      <ComponentPreview className="!block">
        <Tabs defaultValue="appearance" variant="vertical">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
        </Tabs>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-tabs">Tabs</DocH3>
      <PropsTable rows={[
        { prop: "variant", type: '"underline" | "pill" | "segmented" | "vertical"', default: '"underline"', desc: "Visual style of the tab set" },
        { prop: "value", type: "string", default: "—", desc: "Controlled active value" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when the active tab changes" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-tabslist">TabsList</DocH3>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "TabsTrigger elements" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-tabstrigger">TabsTrigger</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Unique value for this tab" },
        { prop: "badge", type: "ReactNode", default: "—", desc: "Optional count rendered as a pill after the label" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Label and/or icon content" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-tabscontent">TabsContent</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Renders its children only when this value is active" },
        { prop: "keepMounted", type: "boolean", default: "false", desc: "Keep the panel mounted while another tab is active, hidden rather than removed — so a half-filled form, a scroll position or a playing video survives the switch" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Panel content" },
      ]} />
    </DocPage>
  )
}

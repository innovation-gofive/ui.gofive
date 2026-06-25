"use client"

import { useState } from "react"
import {
  BarChart3,
  CalendarDays,
  FileText,
  HelpCircle,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarBrand,
  SidebarLabel,
  SidebarItem,
  SidebarSub,
  SidebarSubItem,
  SidebarRail,
  SidebarRailItem,
  SidebarSeparator,
} from "@/registry/new-york/ui/sidebar"
import { Button } from "@/registry/new-york/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Full sidebar", href: "#full-sidebar", depth: 1 },
  { title: "Collapsible", href: "#collapsible", depth: 1 },
  { title: "Collapsed rail", href: "#collapsed-rail", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

function CollapsibleSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex items-start gap-4">
      <Sidebar collapsed={collapsed}>
        <SidebarBrand logo="E">empeo</SidebarBrand>
        <SidebarItem icon={<LayoutDashboard />} title="Dashboard">Dashboard</SidebarItem>
        <SidebarItem icon={<CalendarDays />} active title="Calendar">Calendar</SidebarItem>
        <SidebarItem icon={<Users />} badge={12} title="Employees">Employees</SidebarItem>
        <SidebarItem icon={<FileText />} title="Records">Records</SidebarItem>
        <SidebarLabel>Insights</SidebarLabel>
        <SidebarItem icon={<BarChart3 />} title="Reports">Reports</SidebarItem>
        <SidebarItem icon={<Settings />} title="Settings">Settings</SidebarItem>
      </Sidebar>
      <Button variant="outline" size="sm" onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        {collapsed ? "Expand" : "Collapse"}
      </Button>
    </div>
  )
}

function FullSidebar() {
  return (
    <Sidebar>
      <SidebarBrand logo="E">empeo</SidebarBrand>
      <SidebarItem icon={<LayoutDashboard />}>Dashboard</SidebarItem>
      <SidebarItem icon={<CalendarDays />} active>Calendar</SidebarItem>
      <SidebarSub>
        <SidebarSubItem>Month view</SidebarSubItem>
        <SidebarSubItem active>Week view</SidebarSubItem>
        <SidebarSubItem>Agenda</SidebarSubItem>
      </SidebarSub>
      <SidebarItem icon={<Users />} badge={12}>Employees</SidebarItem>
      <SidebarItem icon={<FileText />}>Records</SidebarItem>
      <SidebarLabel>Insights</SidebarLabel>
      <SidebarItem icon={<BarChart3 />}>Reports</SidebarItem>
      <SidebarItem icon={<Settings />}>Settings</SidebarItem>
    </Sidebar>
  )
}

function Rail() {
  return (
    <SidebarRail>
      <SidebarRailItem aria-label="Brand" className="bg-primary text-primary-foreground hover:bg-primary">
        <span className="text-sm font-bold">E</span>
      </SidebarRailItem>
      <SidebarSeparator />
      <SidebarRailItem active aria-label="Dashboard"><LayoutDashboard /></SidebarRailItem>
      <SidebarRailItem aria-label="Calendar"><CalendarDays /></SidebarRailItem>
      <SidebarRailItem aria-label="Team"><Users /></SidebarRailItem>
      <SidebarRailItem aria-label="Reports"><BarChart3 /></SidebarRailItem>
      <SidebarSeparator />
      <SidebarRailItem aria-label="Help"><HelpCircle /></SidebarRailItem>
    </SidebarRail>
  )
}

export default function SidebarDocPage() {
  return (
    <DocPage
      breadcrumb={["Navigation", "Sidebar"]}
      title="Sidebar"
      description="A vertical navigation panel — brand, section labels, items with icons and count badges, and nested sub-items — plus a collapsed icon-only rail."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/sidebar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Sidebar,
  SidebarBrand,
  SidebarLabel,
  SidebarItem,
  SidebarSub,
  SidebarSubItem,
} from "@/components/ui/sidebar"

<Sidebar>
  <SidebarBrand logo="E">empeo</SidebarBrand>
  <SidebarItem icon={<LayoutDashboard />}>Dashboard</SidebarItem>
  <SidebarItem icon={<CalendarDays />} active>Calendar</SidebarItem>
  <SidebarSub>
    <SidebarSubItem active>Week view</SidebarSubItem>
    <SidebarSubItem>Agenda</SidebarSubItem>
  </SidebarSub>
  <SidebarItem icon={<Users />} badge={12}>Employees</SidebarItem>
</Sidebar>`}
      />
      <ComponentPreview>
        <FullSidebar />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="full-sidebar">Full sidebar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Brand mark, items with icons, a count badge, expandable sub-items, and a labelled section.</p>
      <ComponentPreview>
        <FullSidebar />
      </ComponentPreview>

      <DocH3 id="collapsible">Collapsible</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Drive the <code>collapsed</code> prop from your own state — the panel animates down to an icon-only rail: items become centered icon buttons and section labels turn into dividers between groups. Add a <code>title</code> to each item for a tooltip when narrow.</p>
      <CodeBlock
        className="mt-4"
        code={`const [collapsed, setCollapsed] = React.useState(false)

<Sidebar collapsed={collapsed}>
  <SidebarBrand logo="E">empeo</SidebarBrand>
  <SidebarItem icon={<LayoutDashboard />} title="Dashboard">Dashboard</SidebarItem>
  <SidebarItem icon={<Users />} badge={12} title="Employees">Employees</SidebarItem>
</Sidebar>`}
      />
      <ComponentPreview>
        <CollapsibleSidebar />
      </ComponentPreview>

      <DocH3 id="collapsed-rail">Collapsed rail</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">An icon-only rail for the collapsed state, with separators and tooltips via <code>aria-label</code>/<code>title</code>.</p>
      <ComponentPreview>
        <Rail />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-sidebar">Sidebar</DocH3>
      <PropsTable rows={[
        { prop: "collapsed", type: "boolean", default: "false", desc: "Collapse to an icon-only rail — width and labels animate" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Brand, labels, items, and sub-groups" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-sidebarbrand">SidebarBrand</DocH3>
      <PropsTable rows={[
        { prop: "logo", type: "ReactNode", default: "—", desc: "Square logo mark — letter, glyph, or image" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Workspace or product name" },
      ]} />

      <DocH3 id="api-sidebaritem">SidebarItem</DocH3>
      <PropsTable rows={[
        { prop: "icon", type: "ReactNode", default: "—", desc: "Leading icon" },
        { prop: "badge", type: "ReactNode", default: "—", desc: "Trailing count badge" },
        { prop: "active", type: "boolean", default: "false", desc: "Marks the current item" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Item label" },
      ]} />

      <DocH3 id="api-sidebarsub">SidebarSub · SidebarSubItem</DocH3>
      <PropsTable rows={[
        { prop: "active", type: "boolean", default: "false", desc: "On SidebarSubItem — marks the current sub-item" },
        { prop: "children", type: "ReactNode", default: "—", desc: "SidebarSub wraps nested SidebarSubItem rows" },
      ]} />

      <DocH3 id="api-sidebarrail">SidebarRail · SidebarRailItem · SidebarSeparator</DocH3>
      <PropsTable rows={[
        { prop: "active", type: "boolean", default: "false", desc: "On SidebarRailItem — marks the current item" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Icon-only rail items; SidebarSeparator draws a divider" },
      ]} />
    </DocPage>
  )
}

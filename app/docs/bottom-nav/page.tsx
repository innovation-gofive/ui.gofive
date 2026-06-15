"use client"

import { Bell, House, PlusCircle, Search, User } from "lucide-react"

import { BottomNav, BottomNavItem } from "@/registry/new-york/ui/bottom-nav"
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
  { title: "API Reference", href: "#api-reference" },
]

export default function BottomNavPage() {
  return (
    <DocPage
      breadcrumb={["Navigation", "Bottom Navigation"]}
      title="Bottom Navigation"
      description="A mobile bottom navigation bar — the active item tints its label and shows a soft primary pill behind the icon."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/bottom-nav" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { BottomNav, BottomNavItem } from "@/components/ui/bottom-nav"

<BottomNav>
  <BottomNavItem icon={<House />} label="Home" active />
  <BottomNavItem icon={<Search />} label="Search" />
  <BottomNavItem icon={<PlusCircle />} label="Create" />
  <BottomNavItem icon={<Bell />} label="Alerts" />
  <BottomNavItem icon={<User />} label="Me" />
</BottomNav>`}
      />
      <ComponentPreview>
        <BottomNav className="w-80">
          <BottomNavItem icon={<House />} label="Home" active />
          <BottomNavItem icon={<Search />} label="Search" />
          <BottomNavItem icon={<PlusCircle />} label="Create" />
          <BottomNavItem icon={<Bell />} label="Alerts" />
          <BottomNavItem icon={<User />} label="Me" />
        </BottomNav>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Five evenly distributed destinations with the first one active.</p>
      <ComponentPreview>
        <BottomNav className="w-80">
          <BottomNavItem icon={<House />} label="Home" active />
          <BottomNavItem icon={<Search />} label="Search" />
          <BottomNavItem icon={<PlusCircle />} label="Create" />
          <BottomNavItem icon={<Bell />} label="Alerts" />
          <BottomNavItem icon={<User />} label="Me" />
        </BottomNav>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-bottomnav">BottomNav</DocH3>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "BottomNavItem elements" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-bottomnavitem">BottomNavItem</DocH3>
      <PropsTable rows={[
        { prop: "icon", type: "ReactNode", default: "—", desc: "Destination icon" },
        { prop: "label", type: "ReactNode", default: "—", desc: "Short text label below the icon" },
        { prop: "active", type: "boolean", default: "false", desc: "Marks the current destination" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

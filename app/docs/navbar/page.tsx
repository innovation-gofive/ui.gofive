"use client"

import { Bell, Search } from "lucide-react"

import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarSpacer,
  NavbarActions,
  NavbarIconButton,
} from "@/registry/new-york/ui/navbar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Top bar", href: "#top-bar", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

function Demo() {
  return (
    <Navbar className="w-full">
      <NavbarBrand>Gofive</NavbarBrand>
      <NavbarNav>
        <NavbarItem active>Workspace</NavbarItem>
        <NavbarItem>Records</NavbarItem>
        <NavbarItem>Reports</NavbarItem>
        <NavbarItem>Settings</NavbarItem>
      </NavbarNav>
      <NavbarSpacer />
      <NavbarActions>
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search…"
            className="h-8 w-56 rounded-lg border border-border bg-muted pr-3 pl-8 text-[13px] outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <NavbarIconButton aria-label="Notifications">
          <Bell />
        </NavbarIconButton>
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7B88E8] to-[#E677B7] text-[12px] font-semibold text-white">
          NP
        </span>
      </NavbarActions>
    </Navbar>
  )
}

export default function NavbarPage() {
  return (
    <DocPage
      breadcrumb={["Navigation", "Navbar"]}
      title="Navbar"
      description="A top application bar — brand, primary nav with an active state, a flexible spacer, trailing icon actions, and an avatar slot."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/navbar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarSpacer,
  NavbarActions,
  NavbarIconButton,
} from "@/components/ui/navbar"

<Navbar>
  <NavbarBrand>Gofive</NavbarBrand>
  <NavbarNav>
    <NavbarItem active>Workspace</NavbarItem>
    <NavbarItem>Records</NavbarItem>
    <NavbarItem>Reports</NavbarItem>
  </NavbarNav>
  <NavbarSpacer />
  <NavbarActions>
    <NavbarIconButton aria-label="Notifications">
      <Bell />
    </NavbarIconButton>
  </NavbarActions>
</Navbar>`}
      />
      <ComponentPreview className="!block">
        <Demo />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="top-bar">Top bar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Brand on the left, nav items next to it, then a spacer pushing search, notifications, and the avatar to the right.</p>
      <ComponentPreview className="!block">
        <Demo />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-navbar">Navbar</DocH3>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "Brand, nav, spacer, and actions" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-navbaritem">NavbarItem</DocH3>
      <PropsTable rows={[
        { prop: "active", type: "boolean", default: "false", desc: "Marks the current page (bolds and highlights)" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Item label" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />

      <DocH3 id="api-parts">NavbarBrand · NavbarNav · NavbarSpacer · NavbarActions · NavbarIconButton</DocH3>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "Layout slots — brand mark, nav items, flexible spacer, trailing actions, and an icon-only button" },
        { prop: "className", type: "string", default: "—", desc: "Additional classes" },
      ]} />
    </DocPage>
  )
}

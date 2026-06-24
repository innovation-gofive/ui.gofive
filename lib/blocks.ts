import type { ComponentType } from "react"

import { HrDashboard } from "@/components/blocks/hr-dashboard"
import { RecordsTable } from "@/components/blocks/records-table"
import { CollapsedRail } from "@/components/blocks/collapsed-rail"
import { SchedulerWorkspace } from "@/components/blocks/scheduler-workspace"

export interface BlockComponentLink {
  label: string
  href: string
}

export interface BlockMeta {
  /** URL segment + iframe target: /blocks/<slug> */
  slug: string
  name: string
  description: string
  /** Tagline shown under the name in the gallery card. */
  tagline: string
  /** data-brand applied to the shell — drives the per-product palette. */
  brand: string
  component: ComponentType
  /** Registry components used, linked back to their docs. */
  componentsUsed: BlockComponentLink[]
  /** Focused excerpt of the sidebar + shell composition (the teaching content). */
  code: string
}

export const blocks: BlockMeta[] = [
  {
    slug: "hr-dashboard",
    name: "HR Dashboard",
    description:
      "A people-ops home screen: full sidebar with an active item, a count badge, and nested sub-items, over stat cards and a team table.",
    tagline: "Sidebar · stat cards · data table",
    brand: "empeo",
    component: HrDashboard,
    componentsUsed: [
      { label: "Sidebar", href: "/docs/sidebar" },
      { label: "Avatar", href: "/docs/avatar" },
      { label: "Tag & Badge", href: "/docs/badge" },
      { label: "Progress", href: "/docs/progress" },
    ],
    code: `import {
  Sidebar, SidebarBrand, SidebarItem,
  SidebarLabel, SidebarSub, SidebarSubItem,
} from "@/components/ui/sidebar"

<Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60">
  <SidebarBrand logo="E">empeo</SidebarBrand>
  <SidebarItem icon={<LayoutDashboard />} active>Dashboard</SidebarItem>
  <SidebarItem icon={<CalendarDays />}>Attendance</SidebarItem>
  <SidebarSub>
    <SidebarSubItem active>Shifts</SidebarSubItem>
    <SidebarSubItem>Overtime</SidebarSubItem>
  </SidebarSub>
  <SidebarItem icon={<Users />} badge={12}>Employees</SidebarItem>
  <SidebarLabel>Insights</SidebarLabel>
  <SidebarItem icon={<BarChart3 />}>Reports</SidebarItem>
</Sidebar>`,
  },
  {
    slug: "records-table",
    name: "Records Table",
    description:
      "A support inbox: the sidebar pairs with a filter toolbar, a dense records table with status tags, and pagination.",
    tagline: "Sidebar · filters · records",
    brand: "desk",
    component: RecordsTable,
    componentsUsed: [
      { label: "Sidebar", href: "/docs/sidebar" },
      { label: "Avatar", href: "/docs/avatar" },
      { label: "Tag & Badge", href: "/docs/badge" },
    ],
    code: `<Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60">
  <SidebarBrand logo="D">Gofive Desk</SidebarBrand>
  <SidebarItem icon={<Inbox />} badge={8}>Inbox</SidebarItem>
  <SidebarItem icon={<Ticket />} active>Tickets</SidebarItem>
  <SidebarItem icon={<Users />}>Contacts</SidebarItem>
  <SidebarLabel>Workspace</SidebarLabel>
  <SidebarItem icon={<Settings />}>Settings</SidebarItem>
</Sidebar>`,
  },
  {
    slug: "collapsed-rail",
    name: "Collapsed Rail",
    description:
      "A project board where the sidebar collapses to an icon-only rail and back — toggle the panel button to switch.",
    tagline: "Sidebar rail · expand toggle",
    brand: "venio",
    component: CollapsedRail,
    componentsUsed: [
      { label: "Sidebar", href: "/docs/sidebar" },
      { label: "Avatar", href: "/docs/avatar" },
      { label: "Tag & Badge", href: "/docs/badge" },
    ],
    code: `const [collapsed, setCollapsed] = useState(true)

{collapsed ? (
  <SidebarRail className="m-3 h-[calc(100vh-1.5rem)]">
    <SidebarRailItem className="bg-primary text-primary-foreground">V</SidebarRailItem>
    <SidebarSeparator />
    <SidebarRailItem active><Home /></SidebarRailItem>
    <SidebarRailItem><FolderKanban /></SidebarRailItem>
  </SidebarRail>
) : (
  <Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60">
    <SidebarBrand logo="V">Venio</SidebarBrand>
    <SidebarItem icon={<Home />}>Home</SidebarItem>
    <SidebarItem icon={<FolderKanban />} active>Projects</SidebarItem>
  </Sidebar>
)}`,
  },
  {
    slug: "scheduler-workspace",
    name: "Scheduler Workspace",
    description:
      "A calendar app: the sidebar wraps the Scheduler component with Month / Week / Day views and color-coded events.",
    tagline: "Sidebar · scheduler canvas",
    brand: "calendio",
    component: SchedulerWorkspace,
    componentsUsed: [
      { label: "Sidebar", href: "/docs/sidebar" },
      { label: "Scheduler", href: "/docs/scheduler" },
      { label: "Tag & Badge", href: "/docs/badge" },
    ],
    code: `<Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60">
  <SidebarBrand logo="C">Calendio</SidebarBrand>
  <SidebarItem icon={<CalendarDays />} active>My calendar</SidebarItem>
  <SidebarItem icon={<Users />}>Team schedule</SidebarItem>
  <SidebarItem icon={<Video />} badge={3}>Meetings</SidebarItem>
</Sidebar>

<Scheduler events={events} view={view} onViewChange={setView} />`,
  },
]

export function getBlock(slug: string): BlockMeta | undefined {
  return blocks.find((b) => b.slug === slug)
}

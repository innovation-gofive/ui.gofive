"use client"

import * as React from "react"
import {
  CheckSquare,
  FolderKanban,
  Home,
  LifeBuoy,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarBrand,
  SidebarItem,
  SidebarRail,
  SidebarRailItem,
  SidebarSeparator,
} from "@/registry/new-york/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { Tag } from "@/registry/new-york/ui/tag-badge"
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/new-york/ui/avatar"
import { NavbarIconButton } from "@/registry/new-york/ui/navbar"
import {
  AppContent,
  AppMain,
  AppShell,
  AppTopbar,
} from "@/components/blocks/app-shell"

const nav = [
  { id: "home", label: "Home", icon: <Home /> },
  { id: "projects", label: "Projects", icon: <FolderKanban /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare /> },
  { id: "team", label: "Team", icon: <Users /> },
]

const columns = [
  {
    title: "To do",
    tone: "neutral" as const,
    cards: [
      { title: "Audit onboarding flow", tag: "Research", tone: "info" as const, people: ["PS", "NP"] },
      { title: "Draft Q3 roadmap", tag: "Planning", tone: "neutral" as const, people: ["MA"] },
    ],
  },
  {
    title: "In progress",
    tone: "info" as const,
    cards: [
      { title: "Sidebar component polish", tag: "Design", tone: "warn" as const, people: ["TW", "JK"] },
      { title: "Migrate billing service", tag: "Backend", tone: "danger" as const, people: ["NP"] },
    ],
  },
  {
    title: "Done",
    tone: "success" as const,
    cards: [
      { title: "Release notes 6.5", tag: "Docs", tone: "success" as const, people: ["MA", "PS", "TW"] },
    ],
  },
]

export function CollapsedRail() {
  const [collapsed, setCollapsed] = React.useState(true)
  const [active, setActive] = React.useState("projects")

  return (
    <AppShell brand="venio">
      {collapsed ? (
        <SidebarRail className="m-3 h-[calc(100vh-1.5rem)] shrink-0">
          <SidebarRailItem
            aria-label="Venio"
            className="bg-primary text-primary-foreground hover:bg-primary"
          >
            <span className="text-sm font-bold">V</span>
          </SidebarRailItem>
          <SidebarSeparator />
          {nav.map((n) => (
            <SidebarRailItem
              key={n.id}
              aria-label={n.label}
              title={n.label}
              active={active === n.id}
              onClick={() => setActive(n.id)}
            >
              {n.icon}
            </SidebarRailItem>
          ))}
          <SidebarSeparator />
          <SidebarRailItem aria-label="Settings" title="Settings">
            <Settings />
          </SidebarRailItem>
          <SidebarRailItem aria-label="Help" title="Help">
            <LifeBuoy />
          </SidebarRailItem>
        </SidebarRail>
      ) : (
        <Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60 shrink-0 overflow-y-auto">
          <SidebarBrand logo="V">Venio</SidebarBrand>
          {nav.map((n) => (
            <SidebarItem
              key={n.id}
              icon={n.icon}
              active={active === n.id}
              onClick={() => setActive(n.id)}
            >
              {n.label}
            </SidebarItem>
          ))}
          <SidebarItem icon={<Settings />} active={active === "settings"} onClick={() => setActive("settings")}>
            Settings
          </SidebarItem>
          <SidebarItem icon={<LifeBuoy />} active={active === "help"} onClick={() => setActive("help")}>
            Help &amp; support
          </SidebarItem>
        </Sidebar>
      )}

      <AppMain>
        <AppTopbar
          title="Venio"
          initials="VN"
          avatarColor="#116DFC"
          search={false}
          leading={
            <NavbarIconButton
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </NavbarIconButton>
          }
        />

        <AppContent>
          <div className="mb-5">
            <h1 className="text-xl font-bold tracking-tight">Product workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toggle the rail with the panel button — the sidebar collapses to icons and back.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1">
                  <Tag color={col.tone} size="sm">{col.title}</Tag>
                  <span className="text-xs text-muted-foreground">{col.cards.length}</span>
                </div>
                {col.cards.map((card) => (
                  <Card key={card.title} className="gap-3 py-4">
                    <CardHeader className="px-4">
                      <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between px-4">
                      <Tag color={card.tone} variant="soft" size="sm">{card.tag}</Tag>
                      <AvatarGroup size="xs" max={3}>
                        {card.people.map((p) => (
                          <Avatar key={p} size="xs">
                            <AvatarFallback color="#116DFC">{p}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </AppContent>
      </AppMain>
    </AppShell>
  )
}

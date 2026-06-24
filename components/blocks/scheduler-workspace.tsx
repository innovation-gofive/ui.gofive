"use client"

import * as React from "react"
import {
  CalendarDays,
  Clock,
  Plus,
  Settings,
  Users,
  Video,
} from "lucide-react"

import {
  Scheduler,
  startOfDay,
  type SchedulerEvent,
  type SchedulerView,
} from "@/registry/new-york/ui/scheduler"
import {
  Sidebar,
  SidebarBrand,
  SidebarItem,
  SidebarLabel,
} from "@/registry/new-york/ui/sidebar"
import { Tag } from "@/registry/new-york/ui/tag-badge"
import { Button } from "@/components/ui/button"
import {
  AppContent,
  AppMain,
  AppShell,
  AppTopbar,
} from "@/components/blocks/app-shell"

function useSampleEvents(): { events: SchedulerEvent[]; anchor: Date } {
  return React.useMemo(() => {
    const today = startOfDay(new Date())
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

    const at = (dayOffset: number, h: number, m: number) => {
      const d = new Date(monday)
      d.setDate(d.getDate() + dayOffset)
      d.setHours(h, m, 0, 0)
      return d
    }

    const events: SchedulerEvent[] = [
      { id: "1", title: "Team standup", start: at(0, 9, 0), end: at(0, 9, 30), meta: "Daily sync" },
      { id: "2", title: "Design crit", start: at(0, 11, 0), end: at(0, 12, 0), variant: "info" },
      { id: "3", title: "Sprint planning", start: at(1, 10, 0), end: at(1, 11, 30), variant: "success", meta: "Calendio team" },
      { id: "4", title: "1:1 with Lead", start: at(1, 15, 0), end: at(1, 15, 45) },
      { id: "5", title: "Client demo", start: at(2, 13, 0), end: at(2, 14, 0), variant: "warning", meta: "Quarterly review" },
      { id: "6", title: "Workshop", start: at(3, 10, 0), end: at(3, 12, 0), variant: "info" },
      { id: "7", title: "Release 6.5", start: at(3, 16, 0), end: at(3, 16, 30), variant: "success" },
      { id: "8", title: "Design review", start: at(4, 10, 30), end: at(4, 11, 15), variant: "info" },
      { id: "9", title: "Retro", start: at(4, 15, 0), end: at(4, 16, 0), variant: "warning" },
    ]

    return { events, anchor: at(2, 0, 0) }
  }, [])
}

export function SchedulerWorkspace() {
  const { events, anchor } = useSampleEvents()
  const [active, setActive] = React.useState("calendar")
  const [view, setView] = React.useState<SchedulerView>("week")

  return (
    <AppShell brand="calendio">
      <Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60 shrink-0 overflow-y-auto">
        <SidebarBrand logo="C">Calendio</SidebarBrand>
        <SidebarItem icon={<CalendarDays />} active={active === "calendar"} onClick={() => setActive("calendar")}>
          My calendar
        </SidebarItem>
        <SidebarItem icon={<Users />} active={active === "team"} onClick={() => setActive("team")}>
          Team schedule
        </SidebarItem>
        <SidebarItem icon={<Video />} badge={3} active={active === "meetings"} onClick={() => setActive("meetings")}>
          Meetings
        </SidebarItem>
        <SidebarItem icon={<Clock />} active={active === "bookings"} onClick={() => setActive("bookings")}>
          Bookings
        </SidebarItem>

        <SidebarLabel>Calendars</SidebarLabel>
        <div className="space-y-1 px-1">
          <span className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-foreground/80">
            <span className="size-2.5 rounded-full bg-primary" /> Personal
          </span>
          <span className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-foreground/80">
            <span className="size-2.5 rounded-full bg-success" /> Product team
          </span>
          <span className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-foreground/80">
            <span className="size-2.5 rounded-full bg-info" /> Customer calls
          </span>
        </div>

        <SidebarItem icon={<Settings />} active={active === "settings"} onClick={() => setActive("settings")}>
          Settings
        </SidebarItem>
      </Sidebar>

      <AppMain>
        <AppTopbar
          title="Calendar"
          initials="CD"
        >
          <Tag color="success" size="sm">
            <span className="size-1.5 rounded-full bg-current" />
            Synced
          </Tag>
        </AppTopbar>
        <AppContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">This week</h1>
              <p className="mt-1 text-sm text-muted-foreground">{events.length} events scheduled</p>
            </div>
            <Button size="sm">
              <Plus className="size-4" />
              New event
            </Button>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <Scheduler
              events={events}
              view={view}
              onViewChange={setView}
              defaultDate={anchor}
            />
          </div>
        </AppContent>
      </AppMain>
    </AppShell>
  )
}

"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  ListFilter,
  Plus,
  Search,
  Settings,
  Tag as TagIcon,
  Ticket,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarBrand,
  SidebarItem,
  SidebarLabel,
} from "@/registry/new-york/ui/sidebar"
import { Tag } from "@/registry/new-york/ui/tag-badge"
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AppContent,
  AppMain,
  AppShell,
  AppTopbar,
  PageHeading,
} from "@/components/blocks/app-shell"

const nav = [
  { id: "inbox", label: "Inbox", icon: <Inbox />, badge: 8 },
  { id: "tickets", label: "Tickets", icon: <Ticket /> },
  { id: "contacts", label: "Contacts", icon: <Users /> },
  { id: "boards", label: "Boards", icon: <LayoutGrid /> },
]

const filters = ["All", "Open", "Pending", "Urgent", "Closed"]

const tickets = [
  { id: "DSK-4821", subject: "Payment failed on checkout", who: "Ploy S.", bg: "#F88411", priority: "Urgent", pTone: "danger" as const, status: "Open", sTone: "info" as const, updated: "2m ago" },
  { id: "DSK-4820", subject: "Cannot reset my password", who: "Nat P.", bg: "#0A66E0", priority: "High", pTone: "warn" as const, status: "Pending", sTone: "warn" as const, updated: "18m ago" },
  { id: "DSK-4817", subject: "Feature request: dark mode", who: "Mint A.", bg: "#1DA577", priority: "Low", pTone: "neutral" as const, status: "Open", sTone: "info" as const, updated: "1h ago" },
  { id: "DSK-4814", subject: "Invoice PDF is blank", who: "Tee W.", bg: "#7B61FF", priority: "High", pTone: "warn" as const, status: "Open", sTone: "info" as const, updated: "2h ago" },
  { id: "DSK-4809", subject: "Sync delay with calendar", who: "June K.", bg: "#D93A1A", priority: "Medium", pTone: "info" as const, status: "Pending", sTone: "warn" as const, updated: "3h ago" },
  { id: "DSK-4801", subject: "Refund processed twice", who: "Aom L.", bg: "#0FA36A", priority: "Urgent", pTone: "danger" as const, status: "Closed", sTone: "success" as const, updated: "5h ago" },
  { id: "DSK-4798", subject: "Mobile app crashes on login", who: "Beam R.", bg: "#E89A2A", priority: "High", pTone: "warn" as const, status: "Closed", sTone: "success" as const, updated: "yesterday" },
  { id: "DSK-4795", subject: "Update billing address", who: "Fern T.", bg: "#116DFC", priority: "Low", pTone: "neutral" as const, status: "Closed", sTone: "success" as const, updated: "yesterday" },
]

export function RecordsTable() {
  const [active, setActive] = React.useState("tickets")
  const [filter, setFilter] = React.useState("All")

  return (
    <AppShell brand="desk">
      <Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60 shrink-0 overflow-y-auto">
        <SidebarBrand logo="D">Gofive Desk</SidebarBrand>
        {nav.map((n) => (
          <SidebarItem
            key={n.id}
            icon={n.icon}
            badge={n.badge}
            active={active === n.id}
            onClick={() => setActive(n.id)}
          >
            {n.label}
          </SidebarItem>
        ))}
        <SidebarLabel>Workspace</SidebarLabel>
        <SidebarItem icon={<TagIcon />} active={active === "tags"} onClick={() => setActive("tags")}>
          Tags
        </SidebarItem>
        <SidebarItem icon={<LifeBuoy />} active={active === "kb"} onClick={() => setActive("kb")}>
          Knowledge base
        </SidebarItem>
        <SidebarItem icon={<Settings />} active={active === "settings"} onClick={() => setActive("settings")}>
          Settings
        </SidebarItem>
      </Sidebar>

      <AppMain>
        <AppTopbar title="Tickets" initials="DK" avatarColor="#2DAE4B" />
        <AppContent className="flex flex-col">
          <PageHeading
            title="Tickets"
            description="124 conversations across your support inbox."
            actions={
              <Button size="sm">
                <Plus className="size-4" />
                New ticket
              </Button>
            }
          />

          {/* Toolbar — search + filter chips */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5 text-sm">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="Search tickets…"
                className="w-44 bg-transparent placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  data-active={filter === f}
                  className="rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  {f}
                </button>
              ))}
              <Button size="sm" variant="outline">
                <ListFilter className="size-4" />
                More
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[120px]">Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer">
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                    <TableCell className="font-medium">{t.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs">
                          <AvatarFallback color={t.bg}>{t.who.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{t.who}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tag color={t.pTone} size="sm">{t.priority}</Tag>
                    </TableCell>
                    <TableCell>
                      <Tag color={t.sTone} variant="outline" size="sm">{t.status}</Tag>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{t.updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing 1–8 of 124</span>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" disabled>
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <Button size="sm" variant="outline">
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </AppContent>
      </AppMain>
    </AppShell>
  )
}

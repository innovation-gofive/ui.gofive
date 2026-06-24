"use client"

import * as React from "react"
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import {
  Sidebar,
  SidebarBrand,
  SidebarItem,
  SidebarLabel,
  SidebarSub,
  SidebarSubItem,
} from "@/registry/new-york/ui/sidebar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Tag, BadgeCount } from "@/registry/new-york/ui/tag-badge"
import { Progress } from "@/registry/new-york/ui/progress"
import {
  Avatar,
  AvatarFallback,
} from "@/registry/new-york/ui/avatar"
import { NavbarItem } from "@/registry/new-york/ui/navbar"
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

const stats = [
  { label: "Headcount", value: "248", delta: "+12", note: "vs. last month", color: "primary" as const, pct: 72 },
  { label: "Present today", value: "231", delta: "93%", note: "of 248 staff", color: "success" as const, pct: 93 },
  { label: "On leave", value: "11", delta: "4%", note: "5 pending approval", color: "warn" as const, pct: 18 },
  { label: "Open roles", value: "6", delta: "+2", note: "across 3 teams", color: "info" as const, pct: 40 },
]

const people = [
  { name: "Ploy Suwan", role: "Product Designer", dept: "Design", initials: "PS", bg: "#F88411", status: "Active", tone: "success" as const, hours: 96 },
  { name: "Nat Phichai", role: "Frontend Engineer", dept: "Engineering", initials: "NP", bg: "#0A66E0", status: "On leave", tone: "warn" as const, hours: 0 },
  { name: "Mint Aroon", role: "People Ops Lead", dept: "People", initials: "MA", bg: "#1DA577", status: "Active", tone: "success" as const, hours: 88 },
  { name: "Tee Wong", role: "Account Manager", dept: "Sales", initials: "TW", bg: "#7B61FF", status: "Remote", tone: "info" as const, hours: 74 },
  { name: "June Kanya", role: "QA Engineer", dept: "Engineering", initials: "JK", bg: "#D93A1A", status: "Active", tone: "success" as const, hours: 91 },
]

export function HrDashboard() {
  const [active, setActive] = React.useState("dashboard")

  return (
    <AppShell brand="empeo">
      <Sidebar className="m-3 h-[calc(100vh-1.5rem)] w-60 shrink-0 overflow-y-auto">
        <SidebarBrand logo="E">empeo</SidebarBrand>
        <SidebarItem
          icon={<LayoutDashboard />}
          active={active === "dashboard"}
          onClick={() => setActive("dashboard")}
        >
          Dashboard
        </SidebarItem>
        <SidebarItem
          icon={<CalendarDays />}
          active={active === "attendance"}
          onClick={() => setActive("attendance")}
        >
          Attendance
        </SidebarItem>
        {active === "attendance" && (
          <SidebarSub>
            <SidebarSubItem>Daily log</SidebarSubItem>
            <SidebarSubItem active>Shifts</SidebarSubItem>
            <SidebarSubItem>Overtime</SidebarSubItem>
          </SidebarSub>
        )}
        <SidebarItem
          icon={<Users />}
          badge={12}
          active={active === "employees"}
          onClick={() => setActive("employees")}
        >
          Employees
        </SidebarItem>
        <SidebarItem
          icon={<Wallet />}
          active={active === "payroll"}
          onClick={() => setActive("payroll")}
        >
          Payroll
        </SidebarItem>
        <SidebarItem
          icon={<FileText />}
          active={active === "documents"}
          onClick={() => setActive("documents")}
        >
          Documents
        </SidebarItem>

        <SidebarLabel>Insights</SidebarLabel>
        <SidebarItem
          icon={<BarChart3 />}
          active={active === "reports"}
          onClick={() => setActive("reports")}
        >
          Reports
        </SidebarItem>
        <SidebarItem
          icon={<Settings />}
          active={active === "settings"}
          onClick={() => setActive("settings")}
        >
          Settings
        </SidebarItem>
        <SidebarItem
          icon={<LifeBuoy />}
          active={active === "support"}
          onClick={() => setActive("support")}
        >
          Help &amp; support
        </SidebarItem>
      </Sidebar>

      <AppMain>
        <AppTopbar
          title="empeo"
          initials="HR"
          nav={
            <>
              <NavbarItem active>Overview</NavbarItem>
              <NavbarItem>Analytics</NavbarItem>
              <NavbarItem>Activity</NavbarItem>
            </>
          }
        />
        <AppContent>
          <PageHeading
            title="Good morning, Alex"
            description="Here's what's happening across your team today."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="gap-3 py-4">
                <CardHeader className="px-4">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    {s.label}
                    <Tag color={s.color === "primary" ? "info" : s.color} size="sm">
                      <ArrowUpRight className="size-3" />
                      {s.delta}
                    </Tag>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>
                  <Progress
                    value={s.pct}
                    color={s.color === "primary" ? "info" : s.color}
                    size="sm"
                    className="mt-3"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between border-b py-4">
              <CardTitle className="text-base">Team activity</CardTitle>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                Pending requests
                <BadgeCount>5</BadgeCount>
              </span>
            </CardHeader>
            <CardContent className="px-2 py-0 sm:px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[180px]">Hours logged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar size="sm">
                            <AvatarFallback color={p.bg}>{p.initials}</AvatarFallback>
                          </Avatar>
                          <div className="leading-tight">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.dept}</TableCell>
                      <TableCell>
                        <Tag color={p.tone} size="sm">{p.status}</Tag>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={p.hours} color="success" size="sm" className="w-28" />
                          <span className="w-9 text-xs tabular-nums text-muted-foreground">{p.hours}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AppContent>
      </AppMain>
    </AppShell>
  )
}

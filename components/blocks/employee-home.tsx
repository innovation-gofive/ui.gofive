"use client"

import * as React from "react"
import {
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Home,
  LifeBuoy,
  Megaphone,
  Menu,
  PartyPopper,
  PencilLine,
  PieChart,
  ScrollText,
  Search,
  SlidersHorizontal,
  Target,
  Users,
  Wallet,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarBrand,
  SidebarFooter,
  SidebarItem,
} from "@/registry/new-york/ui/sidebar"
import { Card, CardContent } from "@/registry/new-york/ui/card"
import { Tag, BadgeCount } from "@/registry/new-york/ui/tag-badge"
import { Progress } from "@/registry/new-york/ui/progress"
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet"
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarIconButton,
  NavbarSpacer,
} from "@/registry/new-york/ui/navbar"
import { AppShell } from "@/components/blocks/app-shell"

// ── Data ─────────────────────────────────────────────────────────────
// Static, never computed: /blocks/employee-home is prerendered, so a live
// `new Date()` would drift between the build-time HTML and the client.
const TODAY = "พฤหัสบดี, 13 สิงหาคม 2569"

const nav = [
  { key: "home", icon: <Home />, label: "หน้าหลัก" },
  { key: "docs", icon: <FileText />, label: "เอกสาร" },
  { key: "team", icon: <Users />, label: "ทีม" },
  { key: "learn", icon: <BookOpen />, label: "เรียนรู้" },
  { key: "goals", icon: <Target />, label: "เป้าหมาย" },
  { key: "review", icon: <ClipboardCheck />, label: "ประเมิน" },
  { key: "time", icon: <Clock />, label: "ลงเวลา" },
  { key: "expense", icon: <Wallet />, label: "ค่าใช้จ่าย" },
  { key: "reward", icon: <Award />, label: "รางวัลและความสำเร็จ" },
]

const attendance = [
  { value: "0", label: "กลับก่อน" },
  { value: "1", label: "สาย" },
  { value: "0", label: "ขาดงาน" },
]

const leaveBalances = [
  { label: "ลาพักร้อน", value: "8 วัน" },
  { label: "ลากิจ", value: "4 วัน" },
  { label: "ลาป่วย", value: "29 วัน 5 ชม." },
  { label: "ลาเมตตาจิต", value: "3 วัน" },
  { label: "ลาฝึกวิชาทหาร", value: "60 วัน" },
  { label: "ลาบวช", value: "15 วัน" },
  { label: "ลาทำหมัน", value: "3 วัน" },
  { label: "ลาคลอดบุตร", value: "1 วัน" },
  { label: "ลาเลี้ยงดูบุตร", value: "15 วัน" },
]

// Story thumbnails stand in for remote media — a gradient + label keeps the
// block self-contained (no next.config remotePatterns, no network on preview).
const stories = [
  { title: "Singh's AI Sharing", views: 6, from: "#f05b2f", to: "#7a2410" },
  { title: "CS AI SHARING Se…", views: 12, from: "#0a66e0", to: "#062a5c" },
  { title: "OBD Sharing", views: 2, from: "#1da577", to: "#0c4f39" },
  { title: "Front-end Tricks", views: 119, from: "#f9d423", to: "#8a6a00" },
  { title: "AI Sharing Ep.1", views: 16, from: "#5e5eed", to: "#26268a" },
  { title: "Spartan Q2: Built…", views: 15, from: "#383842", to: "#101014" },
]

const skills = [
  { name: "AI Mastery", pct: 0 },
  { name: "English", pct: 0 },
  { name: "Sales Mastery", pct: 0 },
]

const reactions = ["👏 3", "🎉 4", "😍", "🎊"]

// ── Small local pieces ───────────────────────────────────────────────
// One nav, rendered in two places: the desktop rail and the mobile sheet.
// SidebarItem reads the sidebar context, which defaults to collapsed:false —
// so it renders expanded outside a <Sidebar> without extra wiring.
function NavList({
  active,
  onSelect,
}: {
  active: string
  onSelect: (key: string) => void
}) {
  return (
    <>
      {nav.map((item) => (
        <SidebarItem
          key={item.key}
          icon={item.icon}
          active={active === item.key}
          onClick={() => onSelect(item.key)}
          className="text-xs"
        >
          {item.label}
        </SidebarItem>
      ))}

      <SidebarFooter>
        <SidebarItem icon={<PieChart />} className="text-xs">
          รายงาน
        </SidebarItem>
        <SidebarItem icon={<LifeBuoy />} className="text-xs">
          ช่วยเหลือ
        </SidebarItem>
      </SidebarFooter>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-foreground">{children}</h2>
}

// The empeo progress row: filled steps are solid, remaining ones are dashed.
// All spans — this also renders inline inside a <p> in the feed.
function StepDots({ done, total }: { done: number; total: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 align-middle"
      role="img"
      aria-label={`อัปเดตแล้ว ${done} จาก ${total} รอบ`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-white",
            i < done
              ? "bg-success"
              : "border border-dashed border-border bg-muted text-muted-foreground",
          )}
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      ))}
    </span>
  )
}

function PostAuthor({
  name,
  action,
  time,
  color,
  initials,
  children,
}: {
  name: string
  action: React.ReactNode
  time: string
  color: string
  initials: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex gap-2.5">
      <Avatar size="sm">
        <AvatarFallback color={color}>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="leading-tight">
          <span className="font-semibold text-foreground">{name}</span>{" "}
          <span className="text-muted-foreground">{action}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p>
        {children}
      </div>
    </div>
  )
}

// ── Block ────────────────────────────────────────────────────────────
export function EmployeeHome() {
  const [active, setActive] = React.useState("home")
  const [navOpen, setNavOpen] = React.useState(false)
  const [praised, setPraised] = React.useState<Record<string, boolean>>({})

  const togglePraise = (id: string) =>
    setPraised((p) => ({ ...p, [id]: !p[id] }))

  return (
    // text-xs = the empeo 12px base; every step below is a standard Tailwind
    // one so the block adds no private type scale.
    <AppShell brand="empeo" className="bg-muted/40 text-xs leading-[1.5]">
      {/* Pinnable: the circle toggle in the brand row unpins to a 64px rail and
          back. Width is owned by the component — overriding it here would beat
          the collapsed `w-16` in tailwind-merge and freeze the animation. */}
      {/* Desktop only — below md the same nav moves into the sheet below. */}
      <Sidebar
        pinnable
        className="m-2.5 h-[calc(100vh-1.25rem)] shrink-0 overflow-y-auto max-md:hidden"
      >
        <SidebarBrand logo={<Users className="size-4" />} />
        <NavList active={active} onSelect={setActive} />
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── Topbar ───────────────────────────────────────────── */}
        {/* Floating panel like the sidebar and the cards — the gutter matches
            the sidebar's m-2.5 on every side. */}
        <div className="shrink-0 px-2.5 pt-2.5 md:pl-0">
          <Navbar>
            {/* Mobile nav: the sidebar is hidden below md, so it opens here as
                a left sheet instead. Selecting an item closes it. */}
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger asChild>
                <NavbarIconButton aria-label="เปิดเมนู" className="md:hidden">
                  <Menu />
                </NavbarIconButton>
              </SheetTrigger>
              <SheetContent
                side="left"
                aria-describedby={undefined}
                // Floats on the same 10px gutter as the desktop rail, so the
                // panel that slides in is the same rounded shape as the one it
                // replaces. h-auto: the inset pair owns the height, not h-full.
                className="inset-y-2.5 left-2.5 h-auto w-[280px] gap-0 overflow-hidden rounded-xl border p-0 sm:max-w-[280px]"
              >
                <SheetHeader className="p-3">
                  <SheetTitle className="text-sm">เมนู</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2.5 text-xs">
                  <NavList
                    active={active}
                    onSelect={(key) => {
                      setActive(key)
                      setNavOpen(false)
                    }}
                  />
                </nav>
              </SheetContent>
            </Sheet>

            <NavbarBrand>
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-[13px] text-primary-foreground">
                G
              </span>
              Gofive
            </NavbarBrand>

            <NavbarSpacer />

            <NavbarActions className="gap-3">
              <label className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-muted-foreground focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 md:flex">
                <Search className="size-3.5 shrink-0" />
                <input
                  placeholder="ค้นหาพนักงาน"
                  className="w-32 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-48"
                />
              </label>

              <NavbarIconButton aria-label="การแจ้งเตือน 72 รายการ" className="relative">
                <Bell />
                <BadgeCount className="absolute -top-0.5 right-0" size="sm">
                  72
                </BadgeCount>
              </NavbarIconButton>

              <button
                type="button"
                className="flex items-center gap-2 rounded-full py-1 pr-1 pl-2 transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block font-semibold text-foreground">
                    ปริญญา จันทร์สิงห์
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    บริษัท โกไฟว์ จำกัด
                  </span>
                </span>
                <Avatar size="sm">
                  <AvatarFallback color="#f05b2f">ปจ</AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </NavbarActions>
          </Navbar>
        </div>

        {/* ── Three-column home ────────────────────────────────── */}
        <main className="flex-1 overflow-auto p-2.5">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-3 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
            {/* ── Left column ─────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="lg">
                      <AvatarFallback color="#f05b2f">ปจ</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-semibold">
                        ปริญญา จันทร์สิงห์ (ฟลุค)
                      </p>
                      <p className="mt-0.5 truncate text-muted-foreground">
                        IT Solution Architect
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {attendance.map((a) => (
                      <div
                        key={a.label}
                        className="rounded-lg border px-2 py-1.5 text-center"
                      >
                        <div className="text-sm font-semibold tabular-nums">
                          {a.value}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {a.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-2 w-full rounded-lg bg-muted py-2 font-medium text-muted-foreground transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    ไม่มีบันทึกเวลา
                  </button>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {TODAY}
                      <PencilLine className="size-3.5 text-muted-foreground" />
                    </p>
                    <ScrollText className="size-4 text-muted-foreground" />
                  </div>

                  <div className="mt-3 rounded-lg border px-2.5 py-1.5">
                    Working Together
                  </div>
                  {["09:00 - 12:00", "13:00 - 18:00"].map((slot) => (
                    <div
                      key={slot}
                      className="mt-1.5 rounded-lg bg-danger-soft px-2.5 py-1.5 font-medium text-danger-soft-foreground"
                    >
                      แลกเวลา {slot}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <SectionTitle>ทีม</SectionTitle>
                  {[
                    { label: "ยังไม่เข้างาน", initials: "คพ", color: "#0a66e0" },
                    { label: "ลาหยุด", initials: "นป", color: "#5e5eed" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="mt-3 flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <Avatar size="sm">
                        <AvatarFallback color={row.color}>
                          {row.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <SectionTitle>สิทธิ์การลาคงเหลือ</SectionTitle>
                  <ul className="mt-3 flex flex-col gap-2">
                    {leaveBalances.map((l) => (
                      <li
                        key={l.label}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="flex min-w-0 items-center gap-1.5">
                          <ScrollText className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{l.label}</span>
                        </span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {l.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* ── Center column — newsfeed ────────────────────── */}
            <Card className="gap-0 py-0">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <SectionTitle>นิวส์ฟีด</SectionTitle>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <SlidersHorizontal className="size-3.5" />
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>

                {/* Stories — horizontal scroll on narrow screens */}
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {stories.map((s) => (
                    <li key={s.title} className="shrink-0">
                      <button
                        type="button"
                        className="relative block h-[150px] w-[100px] overflow-hidden rounded-xl text-left text-white transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        style={{
                          backgroundImage: `linear-gradient(150deg, ${s.from}, ${s.to})`,
                        }}
                      >
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                          <span className="line-clamp-2 text-[11px] font-medium">
                            {s.title}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-[10px] opacity-90">
                            <Eye className="size-3" />
                            {s.views}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Post — work anniversary */}
                <article className="mt-5 border-t pt-4">
                  <PostAuthor
                    name="คมพัทธ์ แซ่เฮ้ง"
                    action="ทำงานครบ 1 ปี 🎉"
                    time="14 ชั่วโมงที่แล้ว"
                    color="#f05b2f"
                    initials="คพ"
                  >
                    <div className="mt-3 rounded-xl border bg-muted/40 p-4 text-center">
                      <div className="mx-auto flex h-[130px] w-[190px] flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-[#c0341a] text-primary-foreground">
                        <PartyPopper className="size-7" />
                        <span className="text-sm font-bold">
                          Work Anniversary
                        </span>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        Happy Work Anniversary! 🙌 It&apos;s been amazing and
                        we&apos;re grateful to have you with us — every step you
                        take helps drive Gofive forward. Here&apos;s to more
                        success and great moments ahead! 🎉
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {reactions.map((r) => (
                        <span
                          key={r}
                          className="rounded-full border px-2 py-0.5 text-[11px]"
                        >
                          {r}
                        </span>
                      ))}
                      <button
                        type="button"
                        aria-pressed={!!praised.anniversary}
                        onClick={() => togglePraise("anniversary")}
                        className={cn(
                          "ml-auto rounded-full border px-3 py-1 font-medium transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                          praised.anniversary
                            ? "border-primary bg-primary-soft text-primary"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        🏅 ชื่นชม
                      </button>
                    </div>
                  </PostAuthor>
                </article>

                {/* Post — course completed */}
                <article className="mt-5 border-t pt-4">
                  <PostAuthor
                    name="นุชปวีณ์ เพ็มพูนโสภณ"
                    action={
                      <>
                        สำเร็จคอร์สเรียน 🏁 22nd{" "}
                        <span className="font-medium text-success">↑7</span>
                      </>
                    }
                    time="3 ชั่วโมงที่แล้ว"
                    color="#5e5eed"
                    initials="นป"
                  >
                    <div className="mt-3 flex h-[120px] w-full max-w-[300px] flex-col justify-center rounded-xl bg-gradient-to-br from-[#1c1c22] to-[#383842] px-4 text-white">
                      <span className="text-sm font-bold">
                        แบบทดสอบวัคซีนไซเบอร์
                      </span>
                      <span className="mt-1 text-[11px] opacity-80">
                        สำหรับพนักงาน · 20 ข้อ
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-pressed={!!praised.course}
                      onClick={() => togglePraise("course")}
                      className={cn(
                        "mt-3 rounded-full border px-3 py-1 font-medium transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                        praised.course
                          ? "border-primary bg-primary-soft text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      🏅 ชื่นชม
                    </button>
                  </PostAuthor>
                </article>

                {/* Post — goal progress update */}
                <article className="mt-5 border-t pt-4">
                  <PostAuthor
                    name="ภควัต ละมูลเจริญ"
                    action={
                      <span className="inline-flex items-center gap-1.5 align-middle">
                        อัปเดตความคืบหน้าแล้ว
                        <StepDots done={4} total={7} />
                      </span>
                    }
                    time="4 ชั่วโมงที่แล้ว"
                    color="#1da577"
                    initials="ภล"
                  >
                    <div className="mt-3 rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">อัปเดตรอบที่ 4</span>
                        <Tag color="neutral" variant="solid" size="sm">
                          ตามหลังแผน
                        </Tag>
                      </div>
                      <span className="mt-2 inline-block rounded-md bg-primary-soft px-1.5 py-0.5 font-semibold text-primary">
                        10%
                      </span>
                    </div>

                    <div className="mt-3 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded-md bg-primary-soft px-1.5 py-0.5 font-semibold text-primary">
                        10%
                      </span>
                      <p className="min-w-0 flex-1 text-muted-foreground">
                        ลด unexpected error ที่กระทบผู้ใช้หรือระบบอย่างน้อย 10
                        เรื่อง จากเหตุการณ์ที่บันทึกในระบบ incident
                      </p>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        0 → 1 <span className="text-success">▲1</span>
                      </span>
                    </div>
                    <Progress value={10} color="success" size="sm" className="mt-2" />

                    <p className="mt-3 font-medium">Fix exceptionless</p>
                    <a
                      href="#"
                      className="mt-0.5 block truncate text-primary underline-offset-4 hover:underline"
                    >
                      exception.gofive.co.th/event/6a7d134e067cd6000168dcee
                    </a>
                    <button
                      type="button"
                      className="mt-1 text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      ดูเพิ่มเติม
                    </button>
                  </PostAuthor>
                </article>
              </CardContent>
            </Card>

            {/* ── Right column ────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <Card className="gap-3 py-4">
                <CardContent className="flex items-start gap-2.5 px-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Megaphone className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Gofive Talk Fest 2026!</p>
                    <p className="mt-0.5 truncate text-muted-foreground italic">
                      Real People. Real Achievement. Real Gofive.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="flex items-start gap-2.5 px-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <ScrollText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">นโยบายบริษัท</p>
                    <span className="mt-1 inline-block rounded-md bg-primary-soft px-1.5 py-0.5 font-medium text-primary">
                      5 รายการที่ยังไม่ได้อ่าน
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">
                      ถึงเวลาอัปเดตความคืบหน้าแล้ว!
                    </p>
                    <span className="shrink-0 rounded-md bg-primary px-1.5 py-0.5 font-semibold text-primary-foreground">
                      33%
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    ภายในวันที่ 25/08/2569
                  </p>
                  <div className="mt-3">
                    <StepDots done={4} total={7} />
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <div className="flex items-center gap-2">
                    <SectionTitle>ทักษะรอพิชิต</SectionTitle>
                    <BadgeCount size="sm">14</BadgeCount>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {skills.map((s) => (
                      <li key={s.name} className="flex items-center gap-2">
                        <span className="flex-1 truncate rounded-lg border px-2 py-1.5">
                          {s.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {s.pct}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="px-4">
                  <SectionTitle>เรียนรู้ต่อ</SectionTitle>
                  <div className="mt-3 flex h-[120px] flex-col justify-end rounded-xl bg-gradient-to-br from-primary via-[#d9451f] to-[#7a2410] p-3 text-primary-foreground">
                    <span className="text-sm font-bold">
                      BECOME A FANTASTIC GOFIVE MENTOR
                    </span>
                    <span className="mt-1 text-[11px] opacity-90">0%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-3 py-4">
                <CardContent className="flex items-start gap-2.5 px-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary">
                      7 ความยินดีที่กำลังมาถึง
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      เตรียมคำอวยพรที่มีความหมายให้ทีมของคุณ
                    </p>
                  </div>
                  <PartyPopper className="size-8 shrink-0 text-primary" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  )
}

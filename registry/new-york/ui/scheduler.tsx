"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

// ── GoFive palette ─────────────────────────────────────────────────
// The brand accent and semantic event colors are hard-coded (as in the
// other GoFive components) so the calendar looks right regardless of the
// consuming app's --primary token.
const PRIMARY = "#F88411"

export type EventVariant = "default" | "success" | "warning" | "info"

const EVENT_STYLES: Record<
  EventVariant,
  { bg: string; text: string; border: string; dot: string }
> = {
  default: { bg: "#FFF1E3", text: "#B45309", border: PRIMARY, dot: PRIMARY },
  success: { bg: "#E8F7EE", text: "#0F6B2F", border: "#2DAE4B", dot: "#2DAE4B" },
  warning: { bg: "#FFF4DC", text: "#8F5E00", border: "#E0A42E", dot: "#E0A42E" },
  info: { bg: "#E3EEFE", text: "#1D4DB1", border: "#2F6BE4", dot: "#2F6BE4" },
}

// ── Date helpers (plain JS Date, no external libs) ─────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
]
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

/** Start of the week containing `d`, honoring `weekStartsOn` (0=Sun, 1=Mon). */
function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  const day = d.getDay()
  const diff = (day - weekStartsOn + 7) % 7
  return addDays(startOfDay(d), -diff)
}

/** The 7 days of the week containing `d`. */
function weekDays(d: Date, weekStartsOn: 0 | 1): Date[] {
  const start = startOfWeek(d, weekStartsOn)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

/** 42-cell (6-week) grid for the month containing `month`. */
function getMonthGrid(month: Date, weekStartsOn: 0 | 1): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = startOfWeek(first, weekStartsOn)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

const pad = (n: number) => String(n).padStart(2, "0")

/** "9:00", "1:30" — 12-hour clock without an am/pm suffix (compact). */
function clock12(d: Date): string {
  const h = ((d.getHours() + 11) % 12) + 1
  const m = d.getMinutes()
  return m ? `${h}:${pad(m)}` : `${h}:00`
}

/** "09:00 – 09:30" — 24-hour range used in the agenda list. */
function timeRange(start: Date, end: Date): string {
  return `${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`
}

/** Fractional hour, e.g. 9:30 → 9.5. */
function hourFloat(d: Date): number {
  return d.getHours() + d.getMinutes() / 60
}

// ── Types ──────────────────────────────────────────────────────────
export type SchedulerView = "month" | "week" | "day"

export interface SchedulerEvent {
  id: string
  title: string
  start: Date
  end: Date
  variant?: EventVariant
  /** Optional secondary line shown in the agenda (location, attendees…). */
  meta?: string
}

export interface SchedulerProps {
  /** Events to render. */
  events?: SchedulerEvent[]
  /** Active view (controlled). */
  view?: SchedulerView
  /** Initial view (uncontrolled). */
  defaultView?: SchedulerView
  onViewChange?: (view: SchedulerView) => void
  /** Reference date — anchors month/week/day (controlled). */
  date?: Date
  /** Initial reference date (uncontrolled). */
  defaultDate?: Date
  onDateChange?: (date: Date) => void
  /** Fired when an event is clicked in any view. */
  onEventClick?: (event: SchedulerEvent) => void
  /** First column of the week. Defaults to Monday to match the GoFive design. */
  weekStartsOn?: 0 | 1
  /** First/last hour shown in the week time-grid. */
  dayStartHour?: number
  dayEndHour?: number
  /** Pixel height of one hour row in the week view. */
  hourHeight?: number
  className?: string
}

const VIEW_LABELS: { value: SchedulerView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]

// ── Component ──────────────────────────────────────────────────────
function Scheduler({
  events = [],
  view: viewProp,
  defaultView = "month",
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  onEventClick,
  weekStartsOn = 1,
  dayStartHour = 8,
  dayEndHour = 18,
  hourHeight = 48,
  className,
}: SchedulerProps) {
  const [viewState, setViewState] = React.useState<SchedulerView>(defaultView)
  const view = viewProp ?? viewState
  const setView = (v: SchedulerView) => {
    if (viewProp === undefined) setViewState(v)
    onViewChange?.(v)
  }

  const [dateState, setDateState] = React.useState<Date>(() =>
    startOfDay(defaultDate ?? new Date()),
  )
  const date = dateProp ? startOfDay(dateProp) : dateState
  const setDate = (d: Date) => {
    const next = startOfDay(d)
    if (dateProp === undefined) setDateState(next)
    onDateChange?.(next)
  }

  const today = React.useMemo(() => startOfDay(new Date()), [])

  // Navigate prev/next by the natural unit of the current view.
  function navigate(dir: -1 | 1) {
    if (view === "month") setDate(addMonths(date, dir))
    else if (view === "week") setDate(addDays(date, dir * 7))
    else setDate(addDays(date, dir))
  }

  const title =
    view === "month"
      ? `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
      : view === "week"
        ? formatWeekTitle(date, weekStartsOn)
        : `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`

  return (
    <div
      data-slot="scheduler"
      className={cn(
        "w-full select-none font-sans text-foreground",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => navigate(-1)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="size-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => navigate(1)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
            >
              <ChevronRight className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setDate(today)}
            className="h-8 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Today
          </button>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* View switcher */}
        <div
          role="tablist"
          className="flex gap-0.5 rounded-lg bg-muted p-0.5"
        >
          {VIEW_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={view === value}
              onClick={() => setView(value)}
              className={cn(
                "h-7 rounded-md px-3 text-[12.5px] font-medium transition-colors",
                view === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "month" && (
        <MonthView
          date={date}
          today={today}
          events={events}
          weekStartsOn={weekStartsOn}
          onEventClick={onEventClick}
        />
      )}
      {view === "week" && (
        <WeekView
          date={date}
          today={today}
          events={events}
          weekStartsOn={weekStartsOn}
          dayStartHour={dayStartHour}
          dayEndHour={dayEndHour}
          hourHeight={hourHeight}
          onEventClick={onEventClick}
        />
      )}
      {view === "day" && (
        <AgendaView date={date} events={events} onEventClick={onEventClick} />
      )}
    </div>
  )
}

function formatWeekTitle(date: Date, weekStartsOn: 0 | 1): string {
  const days = weekDays(date, weekStartsOn)
  const a = days[0]
  const b = days[6]
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`
  }
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`
}

// ── Month view ─────────────────────────────────────────────────────
function MonthView({
  date,
  today,
  events,
  weekStartsOn,
  onEventClick,
}: {
  date: Date
  today: Date
  events: SchedulerEvent[]
  weekStartsOn: 0 | 1
  onEventClick?: (e: SchedulerEvent) => void
}) {
  const grid = React.useMemo(
    () => getMonthGrid(date, weekStartsOn),
    [date, weekStartsOn],
  )
  const headers = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => DOW_SHORT[(i + weekStartsOn) % 7]),
    [weekStartsOn],
  )

  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-[10px] border border-border">
      {headers.map((wd) => (
        <div
          key={wd}
          className="border-b border-border bg-muted px-2.5 py-2 text-[11px] font-semibold uppercase text-muted-foreground"
        >
          {wd}
        </div>
      ))}

      {grid.map((day) => {
        const outside = !isSameMonth(day, date)
        const isToday = isSameDay(day, today)
        const dayEvents = events
          .filter((e) => isSameDay(e.start, day))
          .sort((a, b) => +a.start - +b.start)
        const shown = dayEvents.slice(0, 2)
        const extra = dayEvents.length - shown.length

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex min-h-24 flex-col gap-[3px] border-b border-r border-border/60 p-1.5",
              outside && "bg-muted/50",
            )}
          >
            <div
              className={cn(
                "text-xs font-medium text-foreground/80",
                outside && "text-muted-foreground/60",
              )}
            >
              {isToday ? (
                <span
                  className="inline-flex size-[22px] items-center justify-center rounded-full font-semibold text-white"
                  style={{ background: PRIMARY }}
                >
                  {day.getDate()}
                </span>
              ) : (
                day.getDate()
              )}
            </div>

            {shown.map((e) => {
              const s = EVENT_STYLES[e.variant ?? "default"]
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onEventClick?.(e)}
                  title={e.title}
                  className="truncate rounded px-1.5 py-0.5 text-left text-[11.5px] leading-tight"
                  style={{
                    background: s.bg,
                    color: s.text,
                    borderLeft: `2px solid ${s.border}`,
                  }}
                >
                  {e.title}
                </button>
              )
            })}
            {extra > 0 && (
              <span className="px-0.5 text-[10.5px] text-muted-foreground">
                +{extra} more
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Week view ──────────────────────────────────────────────────────
function WeekView({
  date,
  today,
  events,
  weekStartsOn,
  dayStartHour,
  dayEndHour,
  hourHeight,
  onEventClick,
}: {
  date: Date
  today: Date
  events: SchedulerEvent[]
  weekStartsOn: 0 | 1
  dayStartHour: number
  dayEndHour: number
  hourHeight: number
  onEventClick?: (e: SchedulerEvent) => void
}) {
  const days = React.useMemo(
    () => weekDays(date, weekStartsOn),
    [date, weekStartsOn],
  )
  const hours = React.useMemo(
    () =>
      Array.from(
        { length: dayEndHour - dayStartHour + 1 },
        (_, i) => dayStartHour + i,
      ),
    [dayStartHour, dayEndHour],
  )
  const bodyHeight = hours.length * hourHeight

  return (
    <div className="overflow-hidden rounded-[10px] border border-border">
      {/* Day headers */}
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border bg-muted">
        <div />
        {days.map((d) => {
          const isToday = isSameDay(d, today)
          return (
            <div
              key={d.toISOString()}
              className="border-l border-border px-1 py-2 text-center"
            >
              <div className="text-[10.5px] font-semibold uppercase text-muted-foreground">
                {DOW_SHORT[d.getDay()]}
              </div>
              <div className="mt-0.5">
                {isToday ? (
                  <span
                    className="inline-flex size-[30px] items-center justify-center rounded-full text-[17px] font-semibold text-white"
                    style={{ background: PRIMARY }}
                  >
                    {d.getDate()}
                  </span>
                ) : (
                  <span className="text-[17px] font-semibold">{d.getDate()}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[520px] overflow-y-auto">
        <div className="grid grid-cols-[56px_repeat(7,1fr)]">
          {/* Time gutter */}
          <div>
            {hours.map((h) => (
              <div
                key={h}
                style={{ height: hourHeight }}
                className="pr-2 pt-1 text-right text-[10.5px] text-muted-foreground"
              >
                {((h + 11) % 12) + 1}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d) => {
            const dayEvents = events.filter((e) => isSameDay(e.start, d))
            return (
              <div
                key={d.toISOString()}
                className="relative border-l border-border/60"
                style={{ height: bodyHeight }}
              >
                {hours.map((h) => (
                  <div
                    key={h}
                    style={{ height: hourHeight }}
                    className="border-b border-dashed border-border/60"
                  />
                ))}

                {dayEvents.map((e) => {
                  const top = (hourFloat(e.start) - dayStartHour) * hourHeight
                  const height = Math.max(
                    (hourFloat(e.end) - hourFloat(e.start)) * hourHeight,
                    22,
                  )
                  const s = EVENT_STYLES[e.variant ?? "default"]
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onEventClick?.(e)}
                      className="absolute inset-x-1 overflow-hidden rounded-md px-1.5 py-1 text-left text-[11.5px] leading-tight"
                      style={{
                        top: Math.max(top, 0),
                        height,
                        background: s.bg,
                        color: s.text,
                        borderLeft: `2px solid ${s.border}`,
                      }}
                    >
                      <span className="block text-[10px] text-muted-foreground">
                        {clock12(e.start)}
                      </span>
                      <span className="truncate font-medium">{e.title}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Day / Agenda view ──────────────────────────────────────────────
const AGENDA_GROUPS: { label: string; from: number; to: number }[] = [
  { label: "Morning", from: 0, to: 12 },
  { label: "Afternoon", from: 12, to: 17 },
  { label: "Evening", from: 17, to: 24 },
]

function AgendaView({
  date,
  events,
  onEventClick,
}: {
  date: Date
  events: SchedulerEvent[]
  onEventClick?: (e: SchedulerEvent) => void
}) {
  const dayEvents = React.useMemo(
    () =>
      events
        .filter((e) => isSameDay(e.start, date))
        .sort((a, b) => +a.start - +b.start),
    [events, date],
  )

  if (dayEvents.length === 0) {
    return (
      <div className="rounded-[10px] border border-border py-12 text-center text-[13px] text-muted-foreground">
        No events scheduled.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {AGENDA_GROUPS.map((group) => {
        const groupEvents = dayEvents.filter((e) => {
          const h = e.start.getHours()
          return h >= group.from && h < group.to
        })
        if (groupEvents.length === 0) return null
        return (
          <div key={group.label}>
            <div className="px-0.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </div>
            <div className="flex flex-col gap-1.5">
              {groupEvents.map((e) => {
                const s = EVENT_STYLES[e.variant ?? "default"]
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => onEventClick?.(e)}
                    className="grid grid-cols-[86px_1fr_auto] items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="text-[12.5px] tabular-nums text-muted-foreground">
                      {timeRange(e.start, e.end)}
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-medium text-foreground">
                        {e.title}
                      </span>
                      {e.meta && (
                        <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                          {e.meta}
                        </span>
                      )}
                    </span>
                    <span
                      className="size-2 rounded-full"
                      style={{ background: s.dot }}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export {
  Scheduler,
  isSameDay,
  startOfDay,
  MONTHS,
  DAY_NAMES,
  DOW_SHORT,
}

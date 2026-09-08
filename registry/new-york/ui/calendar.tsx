"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Date helpers (plain JS Date, no external libs) ─────────────────
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
const QUARTER_MONTHS = [0, 3, 6, 9]

// ── Locale ─────────────────────────────────────────────────────────
/** UI language for month, weekday and quarter names. */
export type CalendarLocale = "en" | "th"
/** Year numbering shown in the UI. BE (พ.ศ.) is CE + 543. */
export type CalendarEra = "ce" | "be"

export interface CalendarConfig {
  locale: CalendarLocale
  era: CalendarEra
}

// Thai names are what Intl.DateTimeFormat("th-TH") produces, kept as plain
// tables so this file stays formatter- and dependency-free like its date
// helpers — and so the UI chrome below can live in the same place.
const CALENDAR_STRINGS = {
  en: {
    weekdays: WEEKDAYS,
    months: MONTHS,
    monthsShort: MONTHS_SHORT,
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    prev: "Previous",
    next: "Next",
  },
  th: {
    weekdays: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
    months: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
    ],
    monthsShort: [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ],
    quarters: ["ไตรมาส 1", "ไตรมาส 2", "ไตรมาส 3", "ไตรมาส 4"],
    prev: "ก่อนหน้า",
    next: "ถัดไป",
  },
} satisfies Record<CalendarLocale, Record<string, readonly string[] | string>>

function calendarStrings(locale: CalendarLocale) {
  return CALENDAR_STRINGS[locale]
}

const CalendarConfigContext = React.createContext<CalendarConfig>({
  locale: "en",
  era: "ce",
})

/**
 * App-wide date display settings. Wrap the app once; Calendar, DatePicker,
 * TimePicker and DateTimePicker all read from here. Nest another provider to
 * override a subtree.
 */
function CalendarConfigProvider({
  locale = "en",
  era,
  children,
}: {
  locale?: CalendarLocale
  /** Defaults to พ.ศ. under Thai, ค.ศ. otherwise. */
  era?: CalendarEra
  children: React.ReactNode
}) {
  const value = React.useMemo<CalendarConfig>(
    () => ({ locale, era: era ?? (locale === "th" ? "be" : "ce") }),
    [locale, era],
  )
  return (
    <CalendarConfigContext.Provider value={value}>
      {children}
    </CalendarConfigContext.Provider>
  )
}

function useCalendarConfig(): CalendarConfig {
  return React.useContext(CalendarConfigContext)
}

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

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

/** Build the 42-cell (6 weeks) grid for the month containing `month`. */
function getMonthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay()) // back to Sunday
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

/** First year of the 12-year block shown for `year` (e.g. 2026 → 2020). */
function yearBlockStart(year: number): number {
  return year - 6
}

/**
 * Display-only year conversion. Values stay Gregorian everywhere else —
 * state, arithmetic and form submission — so only labels are converted.
 */
function displayYear(y: number, era: CalendarEra = "ce"): number {
  return era === "be" ? y + 543 : y
}

export type CalendarRange = { from: Date | null; to: Date | null }
/** Selection granularity of the calendar. */
export type CalendarType = "day" | "month" | "year" | "quarter"

type View = "day" | "month" | "year" | "quarter"

// Drill-down order per calendar type. Title click steps up (toward "year"),
// selecting a cell steps down; the last entry is the terminal (committing) view.
const LEVELS: Record<CalendarType, View[]> = {
  day: ["year", "month", "day"],
  month: ["year", "month"],
  quarter: ["year", "quarter"],
  year: ["year"],
}

export interface CalendarProps {
  /** Selection mode (only applies to the day calendar). */
  mode?: "single" | "range"
  /** Selection granularity — day, month, year, or quarter. */
  calendar?: CalendarType
  /** Selected value — a Date in single mode, a CalendarRange in range mode. */
  value?: Date | CalendarRange | null
  /** Called with the new selection. */
  onChange?: (value: Date | CalendarRange | null) => void
  /** Month to render initially (uncontrolled view state). */
  defaultMonth?: Date
  /** Optionally restrict selectable days. */
  disabled?: (date: Date) => boolean
  className?: string
}

function Calendar({
  mode = "single",
  calendar = "day",
  value,
  onChange,
  defaultMonth,
  disabled,
  className,
}: CalendarProps) {
  const { locale, era } = useCalendarConfig()
  const t = calendarStrings(locale)
  const isRange = calendar === "day" && mode === "range"
  const single = !isRange ? (value as Date | null | undefined) : null
  const range = isRange ? (value as CalendarRange | null | undefined) : null

  const [cursor, setCursor] = React.useState<Date>(() => {
    if (defaultMonth) return startOfDay(defaultMonth)
    if (single) return startOfDay(single)
    if (range?.from) return startOfDay(range.from)
    return startOfDay(new Date())
  })

  const levels = LEVELS[calendar]
  const terminal = levels[levels.length - 1]
  const [view, setView] = React.useState<View>(terminal)
  const viewIdx = levels.indexOf(view)
  const isTerminal = viewIdx === levels.length - 1

  // Hovered day while picking the end of a range.
  const [hover, setHover] = React.useState<Date | null>(null)

  const today = React.useMemo(() => startOfDay(new Date()), [])
  const grid = React.useMemo(() => getMonthGrid(cursor), [cursor])
  const year = cursor.getFullYear()

  function stepUp() {
    if (viewIdx > 0) setView(levels[viewIdx - 1])
  }
  function stepDown() {
    if (!isTerminal) setView(levels[viewIdx + 1])
  }

  function navigate(dir: number) {
    if (view === "day") setCursor(addMonths(cursor, dir))
    else if (view === "year") setCursor(new Date(year + dir * 12, cursor.getMonth(), 1))
    else setCursor(new Date(year + dir, cursor.getMonth(), 1)) // month / quarter view
  }

  // ── Day selection (single / range) ───────────────────────────────
  function selectDay(day: Date) {
    if (disabled?.(day)) return
    if (mode === "single") {
      onChange?.(day)
      return
    }
    const r = range ?? { from: null, to: null }
    if (!r.from || (r.from && r.to)) {
      onChange?.({ from: day, to: null })
    } else if (day < r.from) {
      onChange?.({ from: day, to: r.from })
    } else {
      onChange?.({ from: r.from, to: day })
    }
  }

  function pickMonth(m: number) {
    setCursor(new Date(year, m, 1))
    if (isTerminal) onChange?.(new Date(year, m, 1))
    else stepDown()
  }

  function pickYear(y: number) {
    setCursor(new Date(y, cursor.getMonth(), 1))
    if (isTerminal) onChange?.(new Date(y, 0, 1))
    else stepDown()
  }

  function pickQuarter(m: number) {
    setCursor(new Date(year, m, 1))
    onChange?.(new Date(year, m, 1))
  }

  // Resolve the "to" end for in-progress range hover preview.
  const rangeFrom = range?.from ?? null
  const rangeTo =
    range?.to ?? (isRange && range?.from && hover ? hover : null)
  const [lo, hi] =
    rangeFrom && rangeTo && rangeTo < rangeFrom
      ? [rangeTo, rangeFrom]
      : [rangeFrom, rangeTo]

  // ── Header ───────────────────────────────────────────────────────
  let title: React.ReactNode
  if (view === "day") title = `${t.months[cursor.getMonth()]} ${displayYear(year, era)}`
  else if (view === "year") {
    const s = yearBlockStart(year)
    title = `${displayYear(s, era)} — ${displayYear(s + 11, era)}`
  } else title = `${displayYear(year, era)}` // month / quarter view

  const titleClickable = view !== "year" && viewIdx > 0

  const header = (
    <div
      data-slot="calendar-header"
      className="flex items-center justify-between px-1 pb-3"
    >
      <button
        type="button"
        disabled={!titleClickable}
        onClick={titleClickable ? stepUp : undefined}
        className={cn(
          "flex items-center gap-1.5 rounded-md text-sm font-semibold transition-colors",
          titleClickable && "hover:text-primary cursor-pointer",
          !titleClickable && "cursor-default",
        )}
      >
        {title}
        {titleClickable && <ChevronDown className="size-3 text-muted-foreground" />}
      </button>
      <div className="flex gap-1">
        <button
          type="button"
          aria-label={t.prev}
          onClick={() => navigate(-1)}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label={t.next}
          onClick={() => navigate(1)}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )

  // ── Day grid ─────────────────────────────────────────────────────
  const dayGrid = (
    <div className="grid grid-cols-7 gap-y-0.5">
      {t.weekdays.map((wd, i) => (
        <div
          key={i}
          className="flex h-8 w-full min-w-9 items-center justify-center text-[11px] font-medium text-muted-foreground"
        >
          {wd}
        </div>
      ))}

      {grid.map((day) => {
        const outside = !isSameMonth(day, cursor)
        const isToday = isSameDay(day, today)
        const isDisabled = disabled?.(day) ?? false

        const selected =
          mode === "single"
            ? isSameDay(day, single ?? null)
            : isSameDay(day, lo) || isSameDay(day, hi)

        const inRange =
          isRange &&
          lo &&
          hi &&
          day > lo &&
          day < hi &&
          !isSameDay(day, lo) &&
          !isSameDay(day, hi)

        const isStart = isRange && hi && isSameDay(day, lo) && !isSameDay(lo, hi)
        const isEnd = isRange && lo && isSameDay(day, hi) && !isSameDay(lo, hi)

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex h-9 w-full min-w-9 items-center justify-center",
              inRange && "bg-primary/10",
              isStart && "rounded-l-md bg-primary/10",
              isEnd && "rounded-r-md bg-primary/10",
            )}
          >
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => selectDay(day)}
              onMouseEnter={() => isRange && setHover(day)}
              aria-pressed={selected}
              data-today={isToday || undefined}
              data-selected={selected || undefined}
              data-outside={outside || undefined}
              className={cn(
                "inline-flex h-9 w-full min-w-9 items-center justify-center rounded-md text-[13px] font-normal transition-colors",
                "hover:bg-accent hover:text-foreground",
                outside && "text-muted-foreground/50",
                isToday && !selected && "ring-1 ring-inset ring-primary text-primary font-medium",
                selected &&
                  "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isDisabled && "pointer-events-none opacity-40",
              )}
            >
              {day.getDate()}
            </button>
          </div>
        )
      })}
    </div>
  )

  // ── Month grid ───────────────────────────────────────────────────
  const monthGrid = (
    <div className="grid w-full min-w-[252px] grid-cols-3 gap-1.5 px-0.5">
      {t.monthsShort.map((m, i) => {
        const selected =
          mode === "single" &&
          single != null &&
          single.getFullYear() === year &&
          single.getMonth() === i
        return (
          <button
            key={m}
            type="button"
            onClick={() => pickMonth(i)}
            data-selected={selected || undefined}
            className={cn(
              "flex h-11 items-center justify-center rounded-md text-[13px] transition-colors",
              "hover:bg-accent hover:text-foreground",
              selected &&
                "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {m}
          </button>
        )
      })}
    </div>
  )

  // ── Year grid ────────────────────────────────────────────────────
  const blockStart = yearBlockStart(year)
  const yearGrid = (
    <div className="grid w-full min-w-[252px] grid-cols-3 gap-1.5 px-0.5">
      {Array.from({ length: 12 }, (_, i) => blockStart + i).map((y) => {
        const selected =
          mode === "single" && single != null && single.getFullYear() === y
        return (
          <button
            key={y}
            type="button"
            onClick={() => pickYear(y)}
            data-selected={selected || undefined}
            className={cn(
              "flex h-11 items-center justify-center rounded-md text-[13px] transition-colors",
              "hover:bg-accent hover:text-foreground",
              selected &&
                "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {displayYear(y, era)}
          </button>
        )
      })}
    </div>
  )

  // ── Quarter grid ─────────────────────────────────────────────────
  const quarterGrid = (
    <div className="grid w-full min-w-[252px] grid-cols-2 gap-2 px-0.5">
      {QUARTER_MONTHS.map((qm, qi) => {
        const selected =
          mode === "single" &&
          single != null &&
          single.getFullYear() === year &&
          single.getMonth() >= qm &&
          single.getMonth() < qm + 3
        return (
          <button
            key={qm}
            type="button"
            onClick={() => pickQuarter(qm)}
            data-selected={selected || undefined}
            className={cn(
              "flex h-[60px] flex-col items-center justify-center gap-0.5 rounded-lg border text-foreground transition-colors",
              "hover:border-primary",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-transparent",
            )}
          >
            <span className="text-sm font-semibold">{t.quarters[qi]}</span>
            <span
              className={cn(
                "text-[11px]",
                selected ? "text-primary-foreground/85" : "text-muted-foreground",
              )}
            >
              {`${t.monthsShort[qm]} – ${t.monthsShort[qm + 2]}`}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div data-slot="calendar" className={cn("w-fit select-none", className)}>
      {header}
      {view === "day" && dayGrid}
      {view === "month" && monthGrid}
      {view === "year" && yearGrid}
      {view === "quarter" && quarterGrid}
    </div>
  )
}

export {
  Calendar,
  CalendarConfigProvider,
  useCalendarConfig,
  calendarStrings,
  displayYear,
  isSameDay,
  startOfDay,
  MONTHS,
  MONTHS_SHORT,
  WEEKDAYS,
}

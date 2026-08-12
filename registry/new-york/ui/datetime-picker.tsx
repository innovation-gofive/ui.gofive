"use client"

import * as React from "react"
import { ResponsivePopover as PopoverPrimitive } from "./responsive-popover"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Calendar,
  type CalendarRange,
  type CalendarType,
  MONTHS_SHORT,
  isSameDay,
  startOfDay,
} from "./calendar"

// ── Formatting helpers ─────────────────────────────────────────────
function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Format a Date according to the calendar granularity. */
function formatByType(d: Date, type: CalendarType): string {
  switch (type) {
    case "month":
      return `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
    case "year":
      return `${d.getFullYear()}`
    case "quarter":
      return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`
    default:
      return formatDate(d)
  }
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// ── Shared popover surface ─────────────────────────────────────────
function PopoverSurface({
  className,
  align = "start",
  sideOffset = 6,
  children,
}: {
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="datetime-popover"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-auto origin-(--radix-popover-content-transform-origin) rounded-xl border bg-popover p-3.5 text-popover-foreground shadow-lg outline-none",
          "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className,
        )}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

// ── Popover footer (Clear/Cancel + Apply) ──────────────────────────
function PopoverFooter({
  ghostLabel,
  primaryLabel,
  onGhost,
  onPrimary,
}: {
  ghostLabel: string
  primaryLabel: string
  onGhost: () => void
  onPrimary: () => void
}) {
  return (
    <div className="mt-3 flex justify-end gap-2 border-t pt-3">
      <button
        type="button"
        onClick={onGhost}
        className="inline-flex h-8 items-center rounded-md border border-input bg-transparent px-3 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-accent"
      >
        {ghostLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {primaryLabel}
      </button>
    </div>
  )
}

// ── Trigger field (button styled like an input) ────────────────────
const triggerClass =
  "flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]"

function TriggerField({
  icon,
  value,
  placeholder,
  error,
  className,
}: {
  icon: React.ReactNode
  value?: string
  placeholder: string
  error?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        triggerClass,
        error &&
          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 data-[state=open]:border-destructive data-[state=open]:ring-destructive/30",
        className,
      )}
    >
      <span
        className={cn(
          "[&_svg]:size-4 [&_svg]:shrink-0",
          error ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <span className={cn("flex-1 text-left", !value && "text-muted-foreground")}>
        {value || placeholder}
      </span>
    </span>
  )
}

// ── Range presets ──────────────────────────────────────────────────
export interface RangePreset {
  label: string
  getValue: () => CalendarRange
}

function buildDefaultPresets(): RangePreset[] {
  const today = startOfDay(new Date())
  return [
    { label: "Today", getValue: () => ({ from: today, to: today }) },
    {
      label: "Yesterday",
      getValue: () => {
        const y = addDays(today, -1)
        return { from: y, to: y }
      },
    },
    { label: "Last 7 days", getValue: () => ({ from: addDays(today, -6), to: today }) },
    { label: "Last 14 days", getValue: () => ({ from: addDays(today, -13), to: today }) },
    { label: "Last 30 days", getValue: () => ({ from: addDays(today, -29), to: today }) },
    {
      label: "This month",
      getValue: () => ({
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      }),
    },
    {
      label: "Last month",
      getValue: () => ({
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      }),
    },
  ]
}

function presetMatches(preset: RangePreset, range: CalendarRange | null): boolean {
  if (!range?.from || !range?.to) return false
  const v = preset.getValue()
  return isSameDay(v.from, range.from) && isSameDay(v.to, range.to)
}

// Sidebar row on desktop, pill chip in the mobile scroll strip.
const PRESET_CLASS =
  "shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-left text-[13px] transition-colors max-md:rounded-full max-md:border max-md:px-3.5 max-md:py-1.5 max-md:text-[12.5px]"

function PresetSidebar({
  presets,
  value,
  onSelect,
  onCustom,
}: {
  presets: RangePreset[]
  value: CalendarRange | null
  onSelect: (p: RangePreset) => void
  onCustom: () => void
}) {
  const activeIdx = presets.findIndex((p) => presetMatches(p, value))
  return (
    // Mobile: the sidebar becomes a single scrollable chip strip above the calendar.
    <div className="mr-2.5 flex min-w-[140px] flex-col gap-0.5 border-r pr-2 max-md:mb-3 max-md:mr-0 max-md:min-w-0 max-md:flex-row max-md:gap-2 max-md:overflow-x-auto max-md:border-r-0 max-md:pb-1 max-md:pr-0 max-md:[scrollbar-width:none]">
      {presets.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onSelect(p)}
          className={cn(
            PRESET_CLASS,
            i === activeIdx
              ? "bg-primary/10 font-medium text-primary max-md:border-primary"
              : "text-foreground/80 hover:bg-accent hover:text-foreground max-md:border-input",
          )}
        >
          {p.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onCustom}
        className={cn(
          PRESET_CLASS,
          activeIdx === -1 && value?.from
            ? "bg-primary/10 font-medium text-primary max-md:border-primary"
            : "text-foreground/80 hover:bg-accent hover:text-foreground max-md:border-input",
        )}
      >
        Custom
      </button>
    </div>
  )
}

// ── DatePicker ─────────────────────────────────────────────────────
export interface DatePickerProps {
  mode?: "single" | "range"
  /** Selection granularity — day, month, year, or quarter. */
  calendar?: CalendarType
  value?: Date | CalendarRange | null
  onChange?: (value: Date | CalendarRange | null) => void
  placeholder?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  /** Show a Clear/Apply footer and stage the selection until Apply. */
  footer?: boolean
  /** Range presets — pass `true` for the defaults, or a custom list. */
  presets?: boolean | RangePreset[]
  /** Render the field in an error state; a string is shown below as a message. */
  error?: boolean | string
  className?: string
}

function DatePicker({
  mode = "single",
  calendar = "day",
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  disabledDate,
  footer,
  presets,
  error,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Date | CalendarRange | null>(value ?? null)

  // Presets imply a staged (footer) workflow.
  const showFooter = footer ?? (mode === "range" && Boolean(presets))
  const presetList = React.useMemo<RangePreset[] | null>(() => {
    if (!presets || mode !== "range") return null
    return Array.isArray(presets) ? presets : buildDefaultPresets()
  }, [presets, mode])

  // Re-sync the draft from the committed value whenever the popover opens.
  React.useEffect(() => {
    if (open) setDraft(value ?? null)
  }, [open, value])

  // Trigger label is always derived from the committed value.
  let label = ""
  if (mode === "single" && value) {
    label = formatByType(value as Date, calendar)
  } else if (mode === "range") {
    const r = value as CalendarRange | null
    if (r?.from) {
      label = r.to ? `${formatDate(r.from)} → ${formatDate(r.to)}` : formatDate(r.from)
    }
  }

  const draftRange = mode === "range" ? (draft as CalendarRange | null) : null

  function handleCalendarChange(next: Date | CalendarRange | null) {
    setDraft(next)
    if (showFooter) return
    onChange?.(next)
    if (mode === "range") {
      const r = next as CalendarRange | null
      if (r?.from && r?.to) setOpen(false)
    } else {
      setOpen(false)
    }
  }

  function applyPreset(p: RangePreset) {
    const v = p.getValue()
    setDraft(v)
    if (!showFooter) {
      onChange?.(v)
      setOpen(false)
    }
  }

  function commit() {
    onChange?.(draft)
    setOpen(false)
  }

  function clearDraft() {
    setDraft(mode === "range" ? { from: null, to: null } : null)
  }

  const triggerWidth = mode === "range" ? "w-[280px]" : "w-[240px]"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button type="button" data-slot="date-picker-trigger" className={triggerWidth}>
            <TriggerField
              icon={<CalendarIcon />}
              value={label}
              placeholder={placeholder}
              error={Boolean(error)}
            />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverSurface>
          {mode === "range" && presetList ? (
            <>
              <div className="flex items-center gap-2 px-1 pb-3">
                <TriggerField
                  icon={<CalendarIcon />}
                  value={draftRange?.from ? formatDate(draftRange.from) : undefined}
                  placeholder="Start"
                  className="h-8 w-[150px] text-[13px] max-md:w-auto max-md:flex-1"
                />
                <span className="text-muted-foreground">→</span>
                <TriggerField
                  icon={<CalendarIcon />}
                  value={draftRange?.to ? formatDate(draftRange.to) : undefined}
                  placeholder="End"
                  className="h-8 w-[150px] text-[13px] max-md:w-auto max-md:flex-1"
                />
              </div>
              <div className="flex max-md:flex-col">
                <PresetSidebar
                  presets={presetList}
                  value={draftRange}
                  onSelect={applyPreset}
                  onCustom={clearDraft}
                />
                <Calendar
                  mode="range"
                  value={draftRange}
                  onChange={handleCalendarChange}
                  disabled={disabledDate}
                  className="max-md:w-full"
                />
              </div>
            </>
          ) : (
            <Calendar
              mode={mode}
              calendar={calendar}
              value={draft}
              onChange={handleCalendarChange}
              disabled={disabledDate}
              className="max-md:w-full"
            />
          )}

          {showFooter && (
            <PopoverFooter
              ghostLabel={mode === "range" ? "Cancel" : "Clear"}
              primaryLabel={mode === "range" ? "Apply range" : "Apply"}
              onGhost={mode === "range" ? () => setOpen(false) : clearDraft}
              onPrimary={commit}
            />
          )}
        </PopoverSurface>
      </PopoverPrimitive.Root>

      {typeof error === "string" && error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  )
}

// ── TimePicker ─────────────────────────────────────────────────────
interface ColumnOption {
  value: number
  label: string
}

function ScrollColumn({
  options,
  selected,
  onSelect,
  ariaLabel,
  width = "w-14",
}: {
  options: ColumnOption[]
  selected: number
  onSelect: (v: number) => void
  ariaLabel: string
  width?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current?.querySelector<HTMLButtonElement>('[data-active="true"]')
    el?.scrollIntoView({ block: "center" })
  }, [selected])

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      className={cn(
        "h-[180px] overflow-y-auto scroll-smooth py-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        width,
      )}
    >
      {options.map((o) => {
        const active = o.value === selected
        return (
          <button
            key={o.value}
            type="button"
            role="option"
            aria-selected={active}
            data-active={active}
            onClick={() => onSelect(o.value)}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-md text-sm tabular-nums transition-colors",
              active
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export interface TimePickerProps {
  value?: Date | null
  onChange?: (value: Date) => void
  /** Minute step. */
  minuteStep?: number
  /** 24-hour columns, or 12-hour with an AM/PM column. */
  hourCycle?: 12 | 24
  className?: string
}

function TimePicker({
  value,
  onChange,
  minuteStep = 1,
  hourCycle = 24,
  className,
}: TimePickerProps) {
  const current = value ?? null
  const hours24 = current?.getHours() ?? 0
  const minutes = current?.getMinutes() ?? 0
  const is12 = hourCycle === 12
  const period = hours24 < 12 ? 0 : 1 // 0 = AM, 1 = PM

  const hourOptions = React.useMemo<ColumnOption[]>(() => {
    if (is12) {
      return Array.from({ length: 12 }, (_, i) => {
        const h = i + 1 // 1..12
        return { value: h, label: pad(h) }
      })
    }
    return Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad(i) }))
  }, [is12])

  const minuteOptions = React.useMemo<ColumnOption[]>(
    () =>
      Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => {
        const m = i * minuteStep
        return { value: m, label: pad(m) }
      }),
    [minuteStep],
  )

  const selectedHour = is12 ? ((hours24 % 12) || 12) : hours24

  function emit(h24: number, m: number) {
    const base = current ? new Date(current) : startOfDay(new Date())
    base.setHours(h24, m, 0, 0)
    onChange?.(base)
  }

  function to24(h12: number, p: number): number {
    const base = h12 % 12 // 12 → 0
    return p === 1 ? base + 12 : base
  }

  return (
    <div
      data-slot="time-picker"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <ScrollColumn
        options={hourOptions}
        selected={selectedHour}
        ariaLabel="Hours"
        onSelect={(h) => emit(is12 ? to24(h, period) : h, minutes)}
      />
      <span className="text-sm font-semibold text-muted-foreground">:</span>
      <ScrollColumn
        options={minuteOptions}
        selected={minutes}
        ariaLabel="Minutes"
        onSelect={(m) => emit(hours24, m)}
      />
      {is12 && (
        <ScrollColumn
          options={[
            { value: 0, label: "AM" },
            { value: 1, label: "PM" },
          ]}
          selected={period}
          ariaLabel="AM/PM"
          width="w-11"
          onSelect={(p) => emit(to24(selectedHour, p), minutes)}
        />
      )}
    </div>
  )
}

// ── DateTimePicker ─────────────────────────────────────────────────
export interface DateTimePickerProps {
  value?: Date | null
  onChange?: (value: Date) => void
  placeholder?: string
  disabled?: boolean
  disabledDate?: (date: Date) => boolean
  minuteStep?: number
  hourCycle?: 12 | 24
  /** Show a Clear/Apply footer and stage the selection until Apply. */
  footer?: boolean
  /** Render the field in an error state; a string is shown below as a message. */
  error?: boolean | string
  className?: string
}

function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
  disabled,
  disabledDate,
  minuteStep = 1,
  hourCycle = 24,
  footer,
  error,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Date | null>(value ?? null)

  React.useEffect(() => {
    if (open) setDraft(value ?? null)
  }, [open, value])

  const label = value ? `${formatDate(value)}, ${formatTime(value)}` : ""

  function update(next: Date) {
    setDraft(next)
    if (!footer) onChange?.(next)
  }

  function handleDate(next: Date | CalendarRange | null) {
    const day = next as Date
    const merged = draft ? new Date(draft) : startOfDay(new Date())
    merged.setFullYear(day.getFullYear(), day.getMonth(), day.getDate())
    update(merged)
  }

  function handleTime(next: Date) {
    update(next)
  }

  function commit() {
    if (draft) onChange?.(draft)
    setOpen(false)
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button type="button" data-slot="datetime-picker-trigger" className="w-[260px]">
            <TriggerField
              icon={<CalendarIcon />}
              value={label}
              placeholder={placeholder}
              error={Boolean(error)}
            />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverSurface>
          <div className="flex items-start gap-3">
            <Calendar
              mode="single"
              value={draft}
              onChange={handleDate}
              disabled={disabledDate}
            />
            <div className="self-stretch border-l pl-3">
              <div className="flex items-center gap-1.5 px-1 pb-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-3.5" /> Time
              </div>
              <TimePicker
                value={draft}
                onChange={handleTime}
                minuteStep={minuteStep}
                hourCycle={hourCycle}
              />
            </div>
          </div>
          {footer && (
            <PopoverFooter
              ghostLabel="Cancel"
              primaryLabel="Set"
              onGhost={() => setOpen(false)}
              onPrimary={commit}
            />
          )}
        </PopoverSurface>
      </PopoverPrimitive.Root>

      {typeof error === "string" && error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  )
}

export { DatePicker, TimePicker, DateTimePicker, formatDate, formatTime }

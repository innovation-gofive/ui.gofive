"use client"

import * as React from "react"
import { ResponsivePopover as PopoverPrimitive } from "./responsive-popover"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Calendar,
  type CalendarConfig,
  type CalendarLocale,
  type CalendarRange,
  type CalendarType,
  calendarStrings,
  displayYear,
  isSameDay,
  startOfDay,
  useCalendarConfig,
} from "./calendar"

// ── Locale ─────────────────────────────────────────────────────────
// Month and weekday names live in calendar.tsx; these are the picker's own
// chrome. Both are read through <CalendarConfigProvider>.
const PICKER_STRINGS = {
  en: {
    selectDate: "Select date",
    selectDateTime: "Select date & time",
    start: "Start",
    end: "End",
    clear: "Clear",
    cancel: "Cancel",
    apply: "Apply",
    applyRange: "Apply range",
    set: "Set",
    custom: "Custom",
    time: "Time",
    hours: "Hours",
    minutes: "Minutes",
    dayPeriod: "AM/PM",
    presets: [
      "Today", "Yesterday", "Last 7 days", "Last 14 days", "Last 30 days",
      "This month", "Last month",
    ],
  },
  th: {
    selectDate: "เลือกวันที่",
    selectDateTime: "เลือกวันที่และเวลา",
    start: "เริ่มต้น",
    end: "สิ้นสุด",
    clear: "ล้าง",
    cancel: "ยกเลิก",
    apply: "ตกลง",
    applyRange: "ใช้ช่วงนี้",
    set: "ตกลง",
    custom: "กำหนดเอง",
    time: "เวลา",
    hours: "ชั่วโมง",
    minutes: "นาที",
    dayPeriod: "ช่วงเวลา",
    presets: [
      "วันนี้", "เมื่อวาน", "7 วันล่าสุด", "14 วันล่าสุด", "30 วันล่าสุด",
      "เดือนนี้", "เดือนที่แล้ว",
    ],
  },
} satisfies Record<CalendarLocale, Record<string, string | readonly string[]>>

function pickerStrings(locale: CalendarLocale) {
  return PICKER_STRINGS[locale]
}

// ── Formatting helpers ─────────────────────────────────────────────
function formatDate(
  d: Date,
  { locale = "en", era = "ce" }: Partial<CalendarConfig> = {},
): string {
  const m = calendarStrings(locale).monthsShort[d.getMonth()]
  return `${d.getDate()} ${m} ${displayYear(d.getFullYear(), era)}`
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Format a Date according to the calendar granularity. */
function formatByType(
  d: Date,
  type: CalendarType,
  config: Partial<CalendarConfig> = {},
): string {
  const { locale = "en", era = "ce" } = config
  const t = calendarStrings(locale)
  const y = displayYear(d.getFullYear(), era)
  switch (type) {
    case "month":
      return `${t.monthsShort[d.getMonth()]} ${y}`
    case "year":
      return `${y}`
    case "quarter":
      return `${t.quarters[Math.floor(d.getMonth() / 3)]} ${y}`
    default:
      return formatDate(d, config)
  }
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// ── Shared popover surface ─────────────────────────────────────────
function PopoverSurface({
  id,
  className,
  align = "start",
  sideOffset = 6,
  children,
}: {
  /** Target of the trigger's aria-controls. */
  id?: string
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        id={id}
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

function buildDefaultPresets(locale: CalendarLocale): RangePreset[] {
  const today = startOfDay(new Date())
  const [
    todayLabel, yesterday, last7, last14, last30, thisMonth, lastMonth,
  ] = pickerStrings(locale).presets
  return [
    { label: todayLabel, getValue: () => ({ from: today, to: today }) },
    {
      label: yesterday,
      getValue: () => {
        const y = addDays(today, -1)
        return { from: y, to: y }
      },
    },
    { label: last7, getValue: () => ({ from: addDays(today, -6), to: today }) },
    { label: last14, getValue: () => ({ from: addDays(today, -13), to: today }) },
    { label: last30, getValue: () => ({ from: addDays(today, -29), to: today }) },
    {
      label: thisMonth,
      getValue: () => ({
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      }),
    },
    {
      label: lastMonth,
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
  customLabel,
}: {
  presets: RangePreset[]
  value: CalendarRange | null
  onSelect: (p: RangePreset) => void
  onCustom: () => void
  customLabel: string
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
        {customLabel}
      </button>
    </div>
  )
}

// ── DatePicker ─────────────────────────────────────────────────────
// ── Shared picker contract ──────────────────────────────────────────
// Canonical definition lives in select.tsx; repeated here so this file stays
// installable on its own. `error` is declared per-component below because these
// pickers also accept a message string.
export interface PickerFieldProps {
  /** Emitted in a hidden input so the value reaches a native form submit. */
  name?: string
  /** Fires when the panel closes — the moment the field is actually left. */
  onBlur?: () => void
  required?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  "aria-describedby"?: string
  "aria-labelledby"?: string
}

/**
 * Hidden mirror of the value so a native <form> submit still carries it.
 * Dates serialise as ISO 8601 so the server parses them unambiguously.
 */
function HiddenDateField({
  name,
  value,
}: {
  name?: string
  value: Date | CalendarRange | null | undefined
}) {
  if (!name || !value) return null
  if (value instanceof Date) {
    return <input type="hidden" name={name} value={value.toISOString()} />
  }
  return (
    <>
      {value.from && (
        <input type="hidden" name={`${name}.from`} value={value.from.toISOString()} />
      )}
      {value.to && (
        <input type="hidden" name={`${name}.to`} value={value.to.toISOString()} />
      )}
    </>
  )
}

export interface DatePickerProps extends PickerFieldProps {
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

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      mode = "single",
      calendar = "day",
      value,
      onChange,
      placeholder,
      disabled,
      disabledDate,
      footer,
      presets,
      error,
      className,
      name,
      onBlur,
      required,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Date | CalendarRange | null>(value ?? null)

  // Presets imply a staged (footer) workflow.
  const showFooter = footer ?? (mode === "range" && Boolean(presets))
  const config = useCalendarConfig()
  const t = pickerStrings(config.locale)
  const presetList = React.useMemo<RangePreset[] | null>(() => {
    if (!presets || mode !== "range") return null
    return Array.isArray(presets) ? presets : buildDefaultPresets(config.locale)
  }, [presets, mode, config.locale])

  const invalid = Boolean(error) || (ariaInvalid != null && ariaInvalid !== "false")
  const panelId = React.useId()
  const fmt = (d: Date) => formatDate(d, config)

  // Re-sync the draft from the committed value whenever the popover opens.
  // Opening only ever happens through the trigger, so the handler covers it.
  // Closing is the moment the field is left, which is what react-hook-form
  // counts as a blur; the guard keeps it from firing on the initial render.
  const opened = React.useRef(false)
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (next) {
      setDraft(value ?? null)
      opened.current = true
      return
    }
    if (opened.current) onBlur?.()
  }

  // Trigger label is always derived from the committed value.
  let label = ""
  if (mode === "single" && value) {
    label = formatByType(value as Date, calendar, config)
  } else if (mode === "range") {
    const r = value as CalendarRange | null
    if (r?.from) {
      label = r.to ? `${fmt(r.from)} → ${fmt(r.to)}` : fmt(r.from)
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
      <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={panelId}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            data-slot="date-picker-trigger"
            className={triggerWidth}
          >
            <TriggerField
              icon={<CalendarIcon />}
              value={label}
              placeholder={placeholder ?? t.selectDate}
              error={Boolean(error)}
            />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverSurface id={panelId}>
          {mode === "range" && presetList ? (
            <>
              <div className="flex items-center gap-2 px-1 pb-3">
                <TriggerField
                  icon={<CalendarIcon />}
                  value={draftRange?.from ? fmt(draftRange.from) : undefined}
                  placeholder={t.start}
                  className="h-8 w-[150px] text-[13px] max-md:w-auto max-md:flex-1"
                />
                <span className="text-muted-foreground">→</span>
                <TriggerField
                  icon={<CalendarIcon />}
                  value={draftRange?.to ? fmt(draftRange.to) : undefined}
                  placeholder={t.end}
                  className="h-8 w-[150px] text-[13px] max-md:w-auto max-md:flex-1"
                />
              </div>
              <div className="flex max-md:flex-col">
                <PresetSidebar
                  presets={presetList}
                  value={draftRange}
                  onSelect={applyPreset}
                  onCustom={clearDraft}
                  customLabel={t.custom}
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
              ghostLabel={mode === "range" ? t.cancel : t.clear}
              primaryLabel={mode === "range" ? t.applyRange : t.apply}
              onGhost={mode === "range" ? () => setOpen(false) : clearDraft}
              onPrimary={commit}
            />
          )}
        </PopoverSurface>
      </PopoverPrimitive.Root>

      <HiddenDateField name={name} value={value} />

      {typeof error === "string" && error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  )
  },
)

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
    const el = ref.current
    const active = el?.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (!el || !active) return
    // Scroll this column only, and instantly. scrollIntoView walks up and
    // scrolls every ancestor, and the column's smooth scroll-behavior turned
    // this into a ~360ms animation for far-down values (minute 55 travels
    // ~400px) — long enough to be interrupted, leaving the column at the top.
    el.scrollTo({
      top: active.offsetTop - el.offsetTop - (el.clientHeight - active.offsetHeight) / 2,
      behavior: "instant",
    })
  }, [selected])

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      // Padding is derived from the height so the selected row stays centred:
      // --time-col-h defaults to a standalone 5-row column, and DateTimePicker
      // raises it to fill the calendar's height.
      className={cn(
        "h-[var(--time-col-h,180px)] overflow-y-auto py-[calc((var(--time-col-h,180px)-36px)/2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
  const { locale } = useCalendarConfig()
  const t = pickerStrings(locale)
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
        ariaLabel={t.hours}
        onSelect={(h) => emit(is12 ? to24(h, period) : h, minutes)}
      />
      <span className="text-sm font-semibold text-muted-foreground">:</span>
      <ScrollColumn
        options={minuteOptions}
        selected={minutes}
        ariaLabel={t.minutes}
        onSelect={(m) => emit(hours24, m)}
      />
      {is12 && (
        <ScrollColumn
          // AM/PM stays Latin in every locale — Thai clock UIs use it as-is.
          options={[
            { value: 0, label: "AM" },
            { value: 1, label: "PM" },
          ]}
          selected={period}
          ariaLabel={t.dayPeriod}
          width="w-11"
          onSelect={(p) => emit(to24(selectedHour, p), minutes)}
        />
      )}
    </div>
  )
}

// ── DateTimePicker ─────────────────────────────────────────────────
export interface DateTimePickerProps extends PickerFieldProps {
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

const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value,
      onChange,
      placeholder,
      disabled,
      disabledDate,
      minuteStep = 1,
      hourCycle = 24,
      footer,
      error,
      className,
      name,
      onBlur,
      required,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Date | null>(value ?? null)

  const config = useCalendarConfig()
  const t = pickerStrings(config.locale)
  const invalid = Boolean(error) || (ariaInvalid != null && ariaInvalid !== "false")
  const panelId = React.useId()

  // Opening only ever happens through the trigger, so the handler covers it.
  // See <DatePicker> for why close is the blur.
  const opened = React.useRef(false)
  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (next) {
      setDraft(value ?? null)
      opened.current = true
      return
    }
    if (opened.current) onBlur?.()
  }

  const label = value ? `${formatDate(value, config)}, ${formatTime(value)}` : ""

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
      <PopoverPrimitive.Root open={open} onOpenChange={changeOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={panelId}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            data-slot="datetime-picker-trigger"
            className="w-[260px]"
          >
            <TriggerField
              icon={<CalendarIcon />}
              value={label}
              placeholder={placeholder ?? t.selectDateTime}
              error={Boolean(error)}
            />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverSurface id={panelId}>
          <div className="flex items-start gap-3">
            <Calendar
              mode="single"
              value={draft}
              onChange={handleDate}
              disabled={disabledDate}
            />
            <div className="self-stretch border-l pl-3">
              <div className="flex items-center gap-1.5 px-1 pb-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-3.5" /> {t.time}
              </div>
              <TimePicker
                value={draft}
                onChange={handleTime}
                minuteStep={minuteStep}
                hourCycle={hourCycle}
                // Fill the panel: calendar (300px) minus this panel's header.
                className="[--time-col-h:276px]"
              />
            </div>
          </div>
          {footer && (
            <PopoverFooter
              ghostLabel={t.cancel}
              primaryLabel={t.set}
              onGhost={() => setOpen(false)}
              onPrimary={commit}
            />
          )}
        </PopoverSurface>
      </PopoverPrimitive.Root>

      <HiddenDateField name={name} value={value} />

      {typeof error === "string" && error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  )
  },
)

export { DatePicker, TimePicker, DateTimePicker, formatDate, formatTime }

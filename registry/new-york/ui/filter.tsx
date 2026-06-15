"use client"

import * as React from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── GoFive primary accent (active / has-value states) ──────────────
const ACCENT = {
  border: "#F88411",
  wash: "#FFF1E3",
  text: "#B45309",
} as const

// ── FilterChip ─────────────────────────────────────────────────────
// Toggleable filter chip. Use `active` for selected/has-value state and
// `onDismiss` to render a trailing × that removes the filter.
export interface FilterChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  active?: boolean
  count?: number
  onDismiss?: () => void
  children: React.ReactNode
}

function FilterChip({
  active = false,
  count,
  onDismiss,
  className,
  children,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      data-slot="filter-chip"
      data-active={active || undefined}
      aria-pressed={active}
      className={cn(
        "inline-flex h-[30px] items-center gap-1.5 rounded-[7px] border px-3 text-[13px] font-medium transition-colors",
        "border-border bg-card text-foreground hover:border-foreground/30 hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3 [&_svg]:opacity-70",
        active && "font-semibold",
        className,
      )}
      style={
        active
          ? { borderColor: ACCENT.border, backgroundColor: ACCENT.wash, color: ACCENT.text }
          : undefined
      }
      {...props}
    >
      {children}
      {typeof count === "number" && (
        <span
          data-slot="filter-chip-count"
          className={cn(
            "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
            active ? "text-white" : "bg-muted text-muted-foreground",
          )}
          style={active ? { backgroundColor: ACCENT.border } : undefined}
        >
          {count}
        </span>
      )}
      {onDismiss && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remove filter"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="-mr-1 ml-0.5 inline-flex opacity-60 transition-opacity hover:opacity-100 [&_svg]:size-3 [&_svg]:opacity-100"
        >
          <X />
        </span>
      )}
    </button>
  )
}

// ── AddFilterChip ──────────────────────────────────────────────────
// Dashed "add filter" affordance. Defaults to a Plus icon + label.
export interface AddFilterChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

function AddFilterChip({ className, children = "Add filter", ...props }: AddFilterChipProps) {
  return (
    <button
      type="button"
      data-slot="add-filter-chip"
      className={cn(
        "inline-flex h-[30px] items-center gap-1.5 rounded-[7px] border border-dashed border-border bg-transparent px-3 text-[13px] font-medium text-muted-foreground transition-colors",
        "hover:border-foreground/30 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3",
        className,
      )}
      {...props}
    >
      <Plus />
      {children}
    </button>
  )
}

// ── FilterBar ──────────────────────────────────────────────────────
// Flex container that wraps chips, dropdown buttons and an add affordance.
export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function FilterBar({ className, children, ...props }: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ── FilterButton ───────────────────────────────────────────────────
// Dropdown-style filter trigger: "Field is Value ▾". Shows the accent
// has-value state when `value` is present, with a trailing × to clear.
export interface FilterButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  label: React.ReactNode
  operator?: React.ReactNode
  value?: React.ReactNode
  onClear?: () => void
}

function FilterButton({
  label,
  operator,
  value,
  onClear,
  className,
  ...props
}: FilterButtonProps) {
  const hasValue = value != null && value !== ""

  return (
    <button
      type="button"
      data-slot="filter-button"
      data-has-value={hasValue || undefined}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-[7px] border px-3 text-[13px] transition-colors",
        "border-border bg-card text-foreground hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3 [&_svg]:opacity-70",
        className,
      )}
      style={
        hasValue
          ? { borderColor: ACCENT.border, backgroundColor: ACCENT.wash, color: ACCENT.text }
          : undefined
      }
      {...props}
    >
      <span className="font-medium">{label}</span>
      {hasValue && operator != null && (
        <span className="opacity-60">{operator}</span>
      )}
      {hasValue ? (
        <span className="font-semibold">{value}</span>
      ) : (
        <ChevronDown />
      )}
      {hasValue && onClear && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Clear filter"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          className="-mr-1 ml-0.5 inline-flex opacity-70 transition-opacity hover:opacity-100 [&_svg]:opacity-100"
        >
          <X />
        </span>
      )}
    </button>
  )
}

// ── SegmentedControl ───────────────────────────────────────────────
// Controlled segmented toggle (e.g. day / week / month, or layout mode).
export interface SegmentedControlOption<T extends string = string> {
  label: React.ReactNode
  value: T
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[]
  value: T
  onValueChange: (value: T) => void
  className?: string
  "aria-label"?: string
}

function SegmentedControl<T extends string = string>({
  options,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      data-slot="segmented-control"
      className={cn("inline-flex gap-0.5 rounded-lg bg-muted p-[3px]", className)}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            data-state={selected ? "active" : "inactive"}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-[12.5px] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              selected
                ? "bg-card font-semibold text-foreground shadow-sm"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export {
  FilterChip,
  AddFilterChip,
  FilterBar,
  FilterButton,
  SegmentedControl,
}

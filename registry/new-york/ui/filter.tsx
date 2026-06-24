"use client"

import * as React from "react"
import { ChevronDown, Filter as FilterIcon, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Gofive primary accent (active / has-value states) ──────────────
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

// ── FilterClear ────────────────────────────────────────────────────
// Borderless text button for "Clear all" / "Reset" actions. Turns the
// danger color on hover.
function FilterClear({
  className,
  children = "Clear all",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-slot="filter-clear"
      className={cn(
        "inline-flex h-9 items-center rounded-md px-2 text-[13px] text-muted-foreground transition-colors",
        "hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ── Advanced filter builder ────────────────────────────────────────
// Composable AND / OR condition builder. Compose:
//   <FilterBuilder>
//     <FilterBuilderHeader title="…" meta="…" />
//     <FilterBuilderBody>
//       <FilterRow index={1} join="Where" onRemove={…}>
//         <FilterSelect className="font-semibold">…</FilterSelect>
//         <FilterSelect className="text-muted-foreground">…</FilterSelect>
//         <FilterSelect className="flex-1">…</FilterSelect>
//       </FilterRow>
//       <AddConditionButton onClick={…} />
//     </FilterBuilderBody>
//     <FilterBuilderFooter>…</FilterBuilderFooter>
//   </FilterBuilder>

function FilterBuilder({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="filter-builder"
      className={cn(
        "max-w-[520px] overflow-hidden rounded-xl border border-border bg-card shadow-md",
        className,
      )}
      {...props}
    />
  )
}

export interface FilterBuilderHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  meta?: React.ReactNode
}

function FilterBuilderHeader({
  title,
  meta,
  className,
  ...props
}: FilterBuilderHeaderProps) {
  return (
    <div
      data-slot="filter-builder-header"
      className={cn(
        "flex items-center justify-between border-b border-border px-3.5 py-3",
        className,
      )}
      {...props}
    >
      <div className="text-[13.5px] font-semibold">{title}</div>
      {meta != null && (
        <div className="text-xs text-muted-foreground">{meta}</div>
      )}
    </div>
  )
}

function FilterBuilderBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="filter-builder-body"
      className={cn("flex flex-col gap-2.5 px-3.5 py-3", className)}
      {...props}
    />
  )
}

export interface FilterRowProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: React.ReactNode
  join?: React.ReactNode
  onRemove?: () => void
  children: React.ReactNode
}

function FilterRow({
  index,
  join,
  onRemove,
  className,
  children,
  ...props
}: FilterRowProps) {
  return (
    <div
      data-slot="filter-row"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {index != null && (
        <span className="w-[18px] text-[11px] font-semibold uppercase text-muted-foreground/70">
          {index}
        </span>
      )}
      {join != null && (
        <span className="px-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {join}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove condition"
          onClick={onRemove}
          className={cn(
            "inline-flex size-7 flex-none items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3.5",
          )}
        >
          <X />
        </button>
      )}
    </div>
  )
}

// Styled native <select> tuned for use inside FilterRow.
function FilterSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="filter-select"
      className={cn(
        "h-8 min-w-0 rounded-[7px] border border-border bg-card px-2.5 text-[12.5px] text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  )
}

// Styled native <input> tuned for use inside FilterRow.
function FilterInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      data-slot="filter-input"
      className={cn(
        "h-8 min-w-0 flex-1 rounded-[7px] border border-border bg-card px-2.5 text-[12.5px] text-foreground",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  )
}

function AddConditionButton({
  className,
  children = "Add condition",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-slot="add-condition"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 self-start rounded-[7px] border border-dashed border-border bg-transparent px-2.5 text-xs text-muted-foreground transition-colors",
        "hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:size-3",
        className,
      )}
      {...props}
    >
      <Plus />
      {children}
    </button>
  )
}

function FilterBuilderFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="filter-builder-footer"
      className={cn(
        "flex items-center justify-between border-t border-border bg-muted px-3.5 py-2.5",
        className,
      )}
      {...props}
    />
  )
}

// ── Saved views ────────────────────────────────────────────────────
function SavedViews({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="saved-views"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  )
}

export interface SavedViewProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  /** Color of the leading status dot (any CSS color). Omit to hide it. */
  color?: string
  children: React.ReactNode
}

function SavedView({
  active = false,
  color,
  className,
  children,
  ...props
}: SavedViewProps) {
  return (
    <button
      type="button"
      data-slot="saved-view"
      data-active={active || undefined}
      aria-pressed={active}
      className={cn(
        "inline-flex h-[30px] items-center gap-1.5 rounded-full border border-transparent px-[11px] text-[12.5px] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-foreground/80 hover:bg-muted/70 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {color && (
        <span
          aria-hidden
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </button>
  )
}

// ── AppliedSummary ─────────────────────────────────────────────────
// Accent banner summarizing the active filter result, with an optional
// clear action. Wrap counts in <b> inside `children` for emphasis.
export interface AppliedSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClear?: () => void
  clearLabel?: React.ReactNode
}

function AppliedSummary({
  onClear,
  clearLabel = "Clear filters",
  className,
  children,
  ...props
}: AppliedSummaryProps) {
  return (
    <div
      data-slot="applied-summary"
      className={cn(
        "flex flex-wrap items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-[12.5px] text-foreground/80",
        "[&_b]:font-semibold",
        className,
      )}
      style={{
        borderColor: `color-mix(in oklab, ${ACCENT.border} 20%, transparent)`,
        backgroundColor: ACCENT.wash,
        ...props.style,
      }}
      {...props}
    >
      <span className="flex [&_svg]:size-4" style={{ color: ACCENT.text }}>
        <FilterIcon />
      </span>
      <div className="[&_b]:text-[color:var(--gf-applied-accent)]" style={{ ["--gf-applied-accent" as string]: ACCENT.text }}>
        {children}
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto text-xs font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          style={{ color: ACCENT.text }}
        >
          {clearLabel}
        </button>
      )}
    </div>
  )
}

export {
  FilterChip,
  AddFilterChip,
  FilterBar,
  FilterButton,
  FilterClear,
  SegmentedControl,
  FilterBuilder,
  FilterBuilderHeader,
  FilterBuilderBody,
  FilterRow,
  FilterSelect,
  FilterInput,
  AddConditionButton,
  FilterBuilderFooter,
  SavedViews,
  SavedView,
  AppliedSummary,
}

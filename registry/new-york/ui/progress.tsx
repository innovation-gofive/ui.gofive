"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ── Gofive semantic color tokens ───────────────────────────────────
export type ProgressColor = "primary" | "success" | "warn" | "danger" | "info"
export type ProgressSize = "sm" | "md" | "lg"

// Tailwind classes, not inline style — see the note in tag-badge.tsx for why.
// NOTE: `primary` still resolves to the info blue, not --primary. Changing it
// would recolor every existing <Progress color="primary"> at once.
const FILL_COLOR: Record<ProgressColor, string> = {
  primary: "bg-info",
  success: "bg-success",
  warn: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
}

// The ring paints the same colors on an SVG stroke.
const STROKE_COLOR: Record<ProgressColor, string> = {
  primary: "text-info",
  success: "text-success",
  warn: "text-warning",
  danger: "text-danger",
  info: "text-info",
}

const TRACK_SIZE: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
}

export interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  color?: ProgressColor
  size?: ProgressSize
}

function Progress({
  className,
  value,
  color = "primary",
  size = "md",
  ...props
}: ProgressProps) {
  const pct = value ?? 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        TRACK_SIZE[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out",
          FILL_COLOR[color],
        )}
        // Only the offset stays inline — it is a computed value, not a color.
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

// ── Ring (circular) progress ───────────────────────────────────────
export interface ProgressRingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value?: number
  /** Diameter in px. */
  size?: number
  strokeWidth?: number
  color?: ProgressColor
  /** Show the rounded percentage in the center. */
  showValue?: boolean
  /** Custom center content (overrides showValue). */
  children?: React.ReactNode
}

function ProgressRing({
  value = 0,
  size = 56,
  strokeWidth = 4,
  color = "primary",
  showValue = true,
  children,
  className,
  style,
  ...props
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - pct / 100)

  return (
    <div
      data-slot="progress-ring"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="text-muted stroke-current"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "stroke-current transition-[stroke-dashoffset] duration-500 ease-out",
            STROKE_COLOR[color],
          )}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {children ?? (showValue ? `${Math.round(pct)}%` : null)}
      </span>
    </div>
  )
}

export { Progress, ProgressRing }

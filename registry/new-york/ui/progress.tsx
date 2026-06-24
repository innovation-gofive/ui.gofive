"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ── Gofive semantic color tokens ───────────────────────────────────
export type ProgressColor = "primary" | "success" | "warn" | "danger" | "info"
export type ProgressSize = "sm" | "md" | "lg"

const FILL_COLOR: Record<ProgressColor, string> = {
  primary: "#0A66E0",
  success: "#1DA577",
  warn: "#F9D423",
  danger: "#D93A1A",
  info: "#0A66E0",
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
        "relative w-full overflow-hidden rounded-full bg-[#ECECF0]",
        TRACK_SIZE[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out"
        style={{
          backgroundColor: FILL_COLOR[color],
          transform: `translateX(-${100 - pct}%)`,
        }}
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
          stroke="#ECECF0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={FILL_COLOR[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {children ?? (showValue ? `${Math.round(pct)}%` : null)}
      </span>
    </div>
  )
}

export { Progress, ProgressRing }

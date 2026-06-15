"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// ── GoFive semantic color tokens ───────────────────────────────────
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

export { Progress }

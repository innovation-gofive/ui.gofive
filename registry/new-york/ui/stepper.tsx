"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// ── Gofive tokens ──────────────────────────────────────────────────
const PRIMARY = "#0A66E0"
const LINE = "#D4D4D8"
const UPCOMING_BG = "#F4F4F5"
const MUTED = "#71717A"
const FG = "#18181B"
const SUBTLE = "#A1A1AA"

export type StepStatus = "done" | "active" | "upcoming"
export type StepperOrientation = "horizontal" | "vertical"

export interface StepItem {
  title: string
  description?: string
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  /** Index of the active step (0-based). Earlier steps render as done. */
  current?: number
  orientation?: StepperOrientation
}

function statusOf(index: number, current: number): StepStatus {
  if (index < current) return "done"
  if (index === current) return "active"
  return "upcoming"
}

function StepCircle({ index, status }: { index: number; status: StepStatus }) {
  const style: React.CSSProperties =
    status === "done"
      ? { backgroundColor: PRIMARY, color: "#fff", borderColor: PRIMARY }
      : status === "active"
        ? { backgroundColor: "#fff", color: PRIMARY, borderColor: PRIMARY }
        : { backgroundColor: UPCOMING_BG, color: MUTED, borderColor: LINE }

  return (
    <span
      className="z-[1] flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-semibold transition-[background-color,border-color,color] duration-300 motion-reduce:transition-none"
      style={style}
    >
      {status === "done" ? (
        <Check
          className="size-4 animate-in zoom-in-50 duration-200 motion-reduce:animate-none"
          strokeWidth={3}
        />
      ) : (
        index + 1
      )}
    </span>
  )
}

function Stepper({
  steps,
  current = 0,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="stepper"
        className={cn("flex flex-col", className)}
        {...props}
      >
        {steps.map((step, i) => {
          const status = statusOf(i, current)
          const isLast = i === steps.length - 1
          return (
            <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span
                  className="absolute top-7 bottom-1 left-[13px] w-0.5 overflow-hidden"
                  style={{ backgroundColor: LINE }}
                >
                  <span
                    className="block w-full transition-[height] duration-500 ease-out motion-reduce:transition-none"
                    style={{
                      height: i < current ? "100%" : "0%",
                      backgroundColor: PRIMARY,
                    }}
                  />
                </span>
              )}
              <StepCircle index={i} status={status} />
              <div className="pt-0.5">
                <div
                  className="text-sm font-semibold"
                  style={{ color: status === "upcoming" ? MUTED : FG }}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="mt-0.5 text-xs" style={{ color: SUBTLE }}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      data-slot="stepper"
      className={cn("flex items-center", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = statusOf(i, current)
        const isLast = i === steps.length - 1
        return (
          <React.Fragment key={i}>
            <div className="flex min-w-0 items-center gap-2">
              <StepCircle index={i} status={status} />
              <span
                className="truncate text-[13px] font-medium"
                style={{ color: status === "upcoming" ? MUTED : FG }}
              >
                {step.title}
              </span>
            </div>
            {!isLast && (
              <span
                className="mx-2 h-0.5 min-w-5 flex-1 overflow-hidden rounded-full"
                style={{ backgroundColor: LINE }}
              >
                <span
                  className="block h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    width: i < current ? "100%" : "0%",
                    backgroundColor: PRIMARY,
                  }}
                />
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Stepper }

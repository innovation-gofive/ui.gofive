"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Gofive semantic tones for the illustration tile ────────────────
export type EmptyStateTone = "neutral" | "success" | "warn" | "danger" | "info"

const TONE: Record<EmptyStateTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warn:    "bg-warning-soft text-warning-soft-foreground",
  danger:  "bg-danger-soft text-danger-soft-foreground",
  info:    "bg-info-soft text-info-soft-foreground",
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration rendered inside the rounded tile. */
  icon?: React.ReactNode
  title: string
  description?: React.ReactNode
  tone?: EmptyStateTone
  /** Buttons or links shown below the copy. */
  actions?: React.ReactNode
}

function EmptyState({
  icon,
  title,
  description,
  tone = "neutral",
  actions,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-2.5 px-5 py-8 text-center",
        "animate-in fade-in-0 zoom-in-95 duration-300 motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "mb-1 flex size-24 items-center justify-center rounded-3xl [&_svg]:size-10",
            TONE[tone],
          )}
        >
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      {description && (
        <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {actions && (
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

export { EmptyState }

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Gofive semantic tones for the illustration tile ────────────────
export type EmptyStateTone = "neutral" | "success" | "warn" | "danger" | "info"

const TONE: Record<EmptyStateTone, { bg: string; fg: string }> = {
  neutral: { bg: "#F4F4F5", fg: "#71717A" },
  success: { bg: "#DBF3E8", fg: "#0D6A4B" },
  warn:    { bg: "#FFF4BF", fg: "#7A5800" },
  danger:  { bg: "#FDE0D6", fg: "#8A1F0A" },
  info:    { bg: "#DDEAFC", fg: "#063F89" },
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
  const t = TONE[tone]
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-2.5 px-5 py-8 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          className="mb-1 flex size-24 items-center justify-center rounded-3xl [&_svg]:size-10"
          style={{ backgroundColor: t.bg, color: t.fg }}
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

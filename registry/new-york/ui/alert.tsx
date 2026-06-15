"use client"

import * as React from "react"
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ── GoFive semantic status palette (inline info bar / banner) ──────
export type AlertStatus = "info" | "success" | "warn" | "danger"

type StatusTokens = {
  accent: string // left border + icon color
  soft: string // soft background
  text: string // text color
  icon: LucideIcon
}

const STATUS: Record<AlertStatus, StatusTokens> = {
  info:    { accent: "#0A66E0", soft: "#DDEAFC", text: "#063F89", icon: Info },
  success: { accent: "#1DA577", soft: "#DBF3E8", text: "#0D6A4B", icon: CheckCircle2 },
  warn:    { accent: "#E0A42E", soft: "#FFF4BF", text: "#7A5800", icon: AlertTriangle },
  danger:  { accent: "#D93A1A", soft: "#FDE0D6", text: "#8A1F0A", icon: XCircle },
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: AlertStatus
  /** Override the default status icon. Pass `null` to hide it. */
  icon?: React.ReactNode
  /** Show a dismiss button and call this when clicked. */
  onClose?: () => void
}

function Alert({
  status = "info",
  icon,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const s = STATUS[status]
  const Icon = s.icon
  return (
    <div
      role="status"
      data-slot="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border-l-[3px] px-3.5 py-2.5 text-[13px]",
        className,
      )}
      style={{ backgroundColor: s.soft, borderLeftColor: s.accent, color: s.text }}
      {...props}
    >
      {icon !== null && (
        <span className="mt-px shrink-0 [&_svg]:size-4" style={{ color: s.accent }}>
          {icon ?? <Icon strokeWidth={2} />}
        </span>
      )}
      <div className="flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 opacity-60 transition-opacity hover:opacity-100 [&_svg]:size-4"
          style={{ color: s.text }}
        >
          <X strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

export { Alert }

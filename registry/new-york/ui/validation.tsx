"use client"

import * as React from "react"
import {
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Check,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ── Inline validation message ──────────────────────────────────────
export type ValidationStatus = "error" | "warn" | "success" | "info"

const STATUS: Record<ValidationStatus, { color: string; icon: LucideIcon }> = {
  error:   { color: "#D93A1A", icon: XCircle },
  warn:    { color: "#C58A00", icon: AlertTriangle },
  success: { color: "#1DA577", icon: CheckCircle2 },
  info:    { color: "#0A66E0", icon: Info },
}

export interface ValidationMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  status?: ValidationStatus
  /** Override the default status icon. Pass `null` to hide it. */
  icon?: React.ReactNode
}

function ValidationMessage({
  status = "error",
  icon,
  className,
  children,
  ...props
}: ValidationMessageProps) {
  const s = STATUS[status]
  const Icon = s.icon
  return (
    <p
      data-slot="validation-message"
      className={cn("flex items-center gap-1.5 text-xs font-medium", className)}
      style={{ color: s.color }}
      {...props}
    >
      {icon !== null && (
        <span className="shrink-0 [&_svg]:size-3.5">
          {icon ?? <Icon strokeWidth={2.5} />}
        </span>
      )}
      {children}
    </p>
  )
}

// ── Rule checklist (e.g. password requirements) ────────────────────
export type RuleListProps = React.HTMLAttributes<HTMLUListElement>

function RuleList({ className, ...props }: RuleListProps) {
  return (
    <ul
      data-slot="rule-list"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

export interface RuleProps extends React.HTMLAttributes<HTMLLIElement> {
  passed?: boolean
}

function Rule({ passed = false, className, children, ...props }: RuleProps) {
  return (
    <li
      data-slot="rule"
      className={cn(
        "flex items-center gap-2 text-[12.5px] transition-colors",
        className,
      )}
      style={{ color: passed ? "#3F3F46" : "#A1A1AA" }}
      {...props}
    >
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-full [&_svg]:size-2.5"
        style={
          passed
            ? { backgroundColor: "#DBF3E8", color: "#1DA577" }
            : { backgroundColor: "#F4F4F5", color: "#A1A1AA" }
        }
      >
        {passed ? (
          <Check strokeWidth={4} />
        ) : (
          <span className="size-1 rounded-full bg-current" />
        )}
      </span>
      {children}
    </li>
  )
}

export { ValidationMessage, RuleList, Rule }

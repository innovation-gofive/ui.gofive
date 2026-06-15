"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── GoFive semantic color tokens ───────────────────────────────────
export type SpinnerColor = "primary" | "success" | "warn" | "danger" | "info" | "current"
export type SpinnerSize = "sm" | "md" | "lg"

const SPINNER_COLOR: Record<SpinnerColor, string> = {
  primary: "#0A66E0",
  success: "#1DA577",
  warn: "#F9D423",
  danger: "#D93A1A",
  info: "#0A66E0",
  current: "currentColor",
}

const SPINNER_SIZE: Record<SpinnerSize, { box: string; border: string }> = {
  sm: { box: "size-3.5", border: "2px" },
  md: { box: "size-5", border: "2.5px" },
  lg: { box: "size-10", border: "3px" },
}

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
const SPINNER_CSS = `
  .gf-spinner{display:inline-block;border-style:solid;border-radius:9999px;animation:gf-spin .8s linear infinite;}
  @keyframes gf-spin{to{transform:rotate(360deg);}}
`

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: SpinnerColor
  size?: SpinnerSize
  label?: string
}

function Spinner({
  color = "primary",
  size = "md",
  label = "Loading",
  className,
  style,
  ...props
}: SpinnerProps) {
  const dim = SPINNER_SIZE[size]
  const fill = SPINNER_COLOR[color]

  return (
    <>
      <style href="gf-spinner" precedence="low">{SPINNER_CSS}</style>
      <span
        data-slot="spinner"
        role="status"
        aria-label={label}
        className={cn("gf-spinner shrink-0", dim.box, className)}
        style={{
          borderWidth: dim.border,
          borderColor: "color-mix(in oklab, currentColor 18%, transparent)",
          borderTopColor: fill,
          color: fill,
          ...style,
        }}
        {...props}
      />
    </>
  )
}

export { Spinner }

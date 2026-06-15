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

// ── Bouncing dots loader ───────────────────────────────────────────
const DOTS_CSS = `
  .gf-dots{display:inline-flex;align-items:center;}
  .gf-dots span{border-radius:9999px;background:currentColor;animation:gf-dots-bounce 1.3s infinite ease-in-out both;}
  .gf-dots span:nth-child(2){animation-delay:.15s;}
  .gf-dots span:nth-child(3){animation-delay:.3s;}
  @keyframes gf-dots-bounce{0%,80%,100%{transform:scale(.5);opacity:.5;}40%{transform:scale(1);opacity:1;}}
`

const DOT_SIZE: Record<SpinnerSize, { dot: string; gap: string }> = {
  sm: { dot: "4px", gap: "3px" },
  md: { dot: "6px", gap: "4px" },
  lg: { dot: "9px", gap: "6px" },
}

export interface LoadingDotsProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: SpinnerColor
  size?: SpinnerSize
  label?: string
}

function LoadingDots({
  color = "primary",
  size = "md",
  label = "Loading",
  className,
  style,
  ...props
}: LoadingDotsProps) {
  const d = DOT_SIZE[size]
  const fill = SPINNER_COLOR[color]

  return (
    <>
      <style href="gf-loading-dots" precedence="low">{DOTS_CSS}</style>
      <span
        data-slot="loading-dots"
        role="status"
        aria-label={label}
        className={cn("gf-dots", className)}
        style={{ color: fill, gap: d.gap, ...style }}
        {...props}
      >
        <span style={{ width: d.dot, height: d.dot }} />
        <span style={{ width: d.dot, height: d.dot }} />
        <span style={{ width: d.dot, height: d.dot }} />
      </span>
    </>
  )
}

export { Spinner, LoadingDots }

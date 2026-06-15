"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
const SKELETON_CSS = `
  .gf-skeleton{background:linear-gradient(90deg,#ECECF0 25%,#F4F4F6 50%,#ECECF0 75%);background-size:200% 100%;animation:gf-skeleton-shim 1.5s linear infinite;}
  @keyframes gf-skeleton-shim{to{background-position:-200% 0;}}
  .gf-skeleton-pulse{background:#ECECF0;animation:gf-skeleton-pulse 1.5s ease-in-out infinite;}
  @keyframes gf-skeleton-pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
`

export type SkeletonVariant = "shimmer" | "pulse"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  /** Render as a circle (e.g. avatar placeholder). */
  circle?: boolean
}

function Skeleton({
  variant = "shimmer",
  circle = false,
  className,
  ...props
}: SkeletonProps) {
  return (
    <>
      <style href="gf-skeleton" precedence="low">{SKELETON_CSS}</style>
      <div
        data-slot="skeleton"
        aria-hidden
        className={cn(
          variant === "shimmer" ? "gf-skeleton" : "gf-skeleton-pulse",
          circle ? "rounded-full" : "rounded-md",
          className,
        )}
        {...props}
      />
    </>
  )
}

export { Skeleton }

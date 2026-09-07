"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// The base fill comes from the `bg-muted` utility below, not from this stylesheet,
// so it follows the theme of whatever app installs the component (see the note in
// tag-badge.tsx). Only the moving sheen lives here, and it is drawn from
// `currentColor` — dark ink over a light skeleton, light ink over a dark one —
// so the one rule is correct in both themes without a `dark:` variant.
const SKELETON_CSS = `
  .gf-skeleton{position:relative;overflow:hidden;}
  .gf-skeleton::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 25%,color-mix(in oklab, currentColor 9%, transparent) 50%,transparent 75%);background-size:200% 100%;animation:gf-skeleton-shim 1.5s linear infinite;}
  @keyframes gf-skeleton-shim{to{background-position:-200% 0;}}
  @media (prefers-reduced-motion: reduce){.gf-skeleton::after{animation:none;}}
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
          "bg-muted",
          // `animate-pulse` is Tailwind's own; no second keyframe set needed.
          variant === "shimmer" ? "gf-skeleton" : "animate-pulse",
          circle ? "rounded-full" : "rounded-md",
          className,
        )}
        {...props}
      />
    </>
  )
}

export { Skeleton }

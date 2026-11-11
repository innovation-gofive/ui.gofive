"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Styles (React 19 style hoisting deduplicates via href) ──
// Colours never appear here: the lines are painted from `currentColor`, which the
// component sets to the `--border` token (or the `color` prop), so light, dark and
// data-brand all follow the theme. The masks only read alpha, so any opaque keyword works.
// The reveal radius is a registered custom property so it can be animated; browsers
// without @property jump to the end state, which leaves the grid visible (the safe side).
const GRID_BACKGROUND_CSS = `
  @property --gf-grid-background-r{syntax:"<percentage>";inherits:false;initial-value:0%;}
  .gf-grid-background-fade{-webkit-mask-image:radial-gradient(ellipse at center,CanvasText 20%,transparent var(--gf-grid-background-fade,70%));mask-image:radial-gradient(ellipse at center,CanvasText 20%,transparent var(--gf-grid-background-fade,70%));}
  .gf-grid-background-reveal{-webkit-mask-image:radial-gradient(circle at 50% 50%,CanvasText calc(var(--gf-grid-background-r) - 12%),transparent var(--gf-grid-background-r));mask-image:radial-gradient(circle at 50% 50%,CanvasText calc(var(--gf-grid-background-r) - 12%),transparent var(--gf-grid-background-r));}
  .gf-grid-background-reveal[data-state="off"]{-webkit-mask-image:none;mask-image:none;}
  .gf-grid-background-reveal[data-state="shown"]{animation:gf-grid-background-reveal 1.6s cubic-bezier(.16,1,.3,1) forwards;}
  .gf-grid-background-lines{background-image:linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px);background-size:var(--gf-grid-background-size) var(--gf-grid-background-size);animation:gf-grid-background-drift var(--gf-grid-background-speed) linear infinite;will-change:transform;}
  .gf-grid-background-lines[data-static]{animation:none;will-change:auto;}
  @keyframes gf-grid-background-drift{to{transform:translate3d(var(--gf-grid-background-x),var(--gf-grid-background-y),0);}}
  @keyframes gf-grid-background-reveal{from{--gf-grid-background-r:0%;}to{--gf-grid-background-r:115%;}}
  @media (prefers-reduced-motion: reduce){
    .gf-grid-background-lines{animation:none;will-change:auto;}
    .gf-grid-background-reveal,.gf-grid-background-reveal[data-state]{animation:none;-webkit-mask-image:none;mask-image:none;}
  }
`

export type GridBackgroundDirection = "up" | "down" | "left" | "right" | "diagonal"

// Unit vector (x, y) of the drift, multiplied by the cell size.
const VECTORS: Record<GridBackgroundDirection, readonly [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  diagonal: [-1, 1],
}

export interface GridBackgroundProps extends React.ComponentProps<"div"> {
  /** Cell size in px (minimum 8). Also the distance drifted per loop. */
  size?: number
  /** Line colour (any CSS colour). Defaults to the `border` token. */
  color?: string
  /** Seconds to travel one cell. 0 or less keeps the grid still. */
  speed?: number
  /** Which way the grid appears to move. */
  direction?: GridBackgroundDirection
  /** Uncover the grid with a growing circle the first time it scrolls into view. */
  reveal?: boolean
  /** Percent of the centre-to-corner distance where the edge fade reaches transparent (30-150). */
  fade?: number
}

function GridBackground({
  size = 48,
  color,
  speed = 3,
  direction = "diagonal",
  reveal = true,
  fade = 70,
  className,
  style,
  children,
  ...props
}: GridBackgroundProps) {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const [seen, setSeen] = React.useState(false)
  const shown = !reveal || seen

  // One-shot: flip to shown once 20% is visible, then stop observing.
  React.useEffect(() => {
    const el = gridRef.current
    if (!reveal || seen || !el) return
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setSeen(true))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reveal, seen])

  const cell = Math.max(8, size)
  const [vx, vy] = VECTORS[direction] ?? VECTORS.diagonal
  const duration = Math.max(0, speed)
  const still = duration === 0

  return (
    <div
      data-slot="grid-background"
      className={cn("relative isolate overflow-hidden", className)}
      style={style}
      {...props}
    >
      <style href="gf-grid-background" precedence="low">{GRID_BACKGROUND_CSS}</style>
      <div
        ref={gridRef}
        data-slot="grid-background-grid"
        aria-hidden
        className="gf-grid-background-fade pointer-events-none absolute inset-0"
        style={
          { "--gf-grid-background-fade": `${Math.min(150, Math.max(30, fade))}%` } as React.CSSProperties
        }
      >
        <div
          data-slot="grid-background-reveal"
          data-state={!reveal ? "off" : shown ? "shown" : "pending"}
          className="gf-grid-background-reveal absolute inset-0 overflow-hidden"
        >
          <div
            data-slot="grid-background-lines"
            data-static={still ? "" : undefined}
            className="gf-grid-background-lines absolute text-border"
            style={
              {
                inset: -cell,
                color,
                "--gf-grid-background-size": `${cell}px`,
                "--gf-grid-background-speed": `${duration}s`,
                "--gf-grid-background-x": `${vx * cell}px`,
                "--gf-grid-background-y": `${vy * cell}px`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div data-slot="grid-background-content" className="relative h-full">
        {children}
      </div>
    </div>
  )
}

export { GridBackground }

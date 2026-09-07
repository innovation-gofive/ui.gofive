"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// ── Chart ───────────────────────────────────────────────────────────
// A themed container around Recharts: it publishes one CSS variable per series
// (`--color-<key>`) so marks are painted from the chart ramp instead of literal
// hex, and it supplies a tooltip and legend that already match the design
// system. Recharts owns the geometry; this owns identity and chrome.
//
//   const config = {
//     opened: { label: "Opened", color: "var(--chart-1)" },
//     closed: { label: "Closed", color: "var(--chart-2)" },
//   } satisfies ChartConfig
//
//   <ChartContainer config={config} className="h-64 w-full">
//     <BarChart data={data}>
//       <CartesianGrid vertical={false} />
//       <XAxis dataKey="month" tickLine={false} axisLine={false} />
//       <ChartTooltip content={<ChartTooltipContent />} />
//       <ChartLegend content={<ChartLegendContent />} />
//       <Bar dataKey="opened" fill="var(--color-opened)" radius={4} />
//     </BarChart>
//   </ChartContainer>
//
// Colour rules that come with the ramp (see the theme's --chart-* block):
//  · assign slots in order and never cycle — a 9th series folds into "Other";
//  · the ramp is a *series* palette, so never reach for danger/warning to mean
//    "series 4" — a red bar then reads as a failure;
//  · slots 3/4/5 fall under 3:1 on the light surface, so a chart using them
//    needs direct labels or the table view beside it, not colour alone.

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    /** Any CSS colour; prefer a ramp slot, e.g. "var(--chart-1)". */
    color?: string
  }
>

type ChartContextValue = { config: ChartConfig }

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error("useChart must be used within <ChartContainer>")
  return ctx
}

/** Publishes `--color-<key>` for every configured series on the container. */
function chartVars(config: ChartConfig): React.CSSProperties {
  const style: Record<string, string> = {}
  for (const [key, item] of Object.entries(config)) {
    if (item.color) style[`--color-${key}`] = item.color
  }
  return style as React.CSSProperties
}

export interface ChartContainerProps
  extends React.ComponentProps<"div"> {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}

function ChartContainer({
  id,
  className,
  children,
  config,
  style,
  ...props
}: ChartContainerProps) {
  const uid = React.useId()
  const chartId = `chart-${id ?? uid.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        style={{ ...chartVars(config), ...style }}
        className={cn(
          "flex aspect-video justify-center text-xs",
          // Recessive chrome: the data is the ink, the grid is a whisper.
          "[&_.recharts-cartesian-grid_line]:stroke-border/60",
          "[&_.recharts-cartesian-axis-line]:stroke-border",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-label]:fill-muted-foreground",
          // Recharts paints its own hover rectangle; ours is the tooltip.
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/60",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface TooltipEntry {
  dataKey?: string | number
  name?: string | number
  value?: number | string
  color?: string
  payload?: Record<string, unknown>
}

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: React.ReactNode
  /** Hide the heading row (a single-series chart rarely needs it). */
  hideLabel?: boolean
  /** Hide the colour swatch beside each row. */
  hideIndicator?: boolean
  indicator?: "dot" | "line"
  labelFormatter?: (label: React.ReactNode) => React.ReactNode
  formatter?: (value: TooltipEntry["value"], name: React.ReactNode) => React.ReactNode
  className?: string
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  labelFormatter,
  formatter,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "grid min-w-[8rem] gap-1.5 rounded-lg border bg-popover px-2.5 py-2 text-xs shadow-lg",
        className,
      )}
    >
      {!hideLabel && label != null && (
        <div className="font-medium text-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload.map((entry, i) => {
          const key = String(entry.dataKey ?? entry.name ?? i)
          const item = config[key]
          const name = item?.label ?? entry.name ?? key
          const color = entry.color ?? `var(--color-${key})`

          return (
            <div
              key={key}
              className="flex w-full items-center gap-2 [&_svg]:size-3 [&_svg]:text-muted-foreground"
            >
              {!hideIndicator &&
                (item?.icon ? (
                  <item.icon />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 rounded-[2px]",
                      indicator === "dot" ? "size-2.5" : "h-0.5 w-3",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              {/* Labels wear text tokens; the swatch alone carries identity. */}
              <span className="text-muted-foreground">{name}</span>
              {entry.value != null && (
                <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                  {formatter ? formatter(entry.value, name) : entry.value}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

export interface ChartLegendContentProps {
  payload?: { value?: string; dataKey?: string | number; color?: string }[]
  verticalAlign?: "top" | "bottom"
  hideIcon?: boolean
  className?: string
}

function ChartLegendContent({
  payload,
  verticalAlign = "bottom",
  hideIcon = false,
  className,
}: ChartLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((entry, i) => {
        const key = String(entry.dataKey ?? entry.value ?? i)
        const item = config[key]
        return (
          <div
            key={key}
            className="flex items-center gap-1.5 text-muted-foreground [&_svg]:size-3"
          >
            {!hideIcon &&
              (item?.icon ? (
                <item.icon />
              ) : (
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color ?? `var(--color-${key})` }}
                />
              ))}
            {item?.label ?? entry.value}
          </div>
        )
      })}
    </div>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
}

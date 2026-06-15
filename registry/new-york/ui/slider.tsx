"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

export interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Render the current value(s) as a label above the slider. */
  showValue?: boolean
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step,
  showValue = false,
  ...props
}: SliderProps) {
  // Derive the list of values so we can render one Thumb per value
  // (single value or range), matching Radix's recommended pattern.
  const values = React.useMemo<number[]>(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max] as number[],
    [value, defaultValue, min, max],
  )

  return (
    <div
      data-slot="slider-wrapper"
      className={cn(
        "flex w-full flex-col gap-2",
        props.orientation === "vertical" && "h-full w-auto flex-row",
      )}
    >
      {showValue && (
        <div
          data-slot="slider-value"
          className="text-xs font-medium text-muted-foreground"
        >
          {values.join(" – ")}
        </div>
      )}
      <SliderPrimitive.Root
        data-slot="slider"
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          "data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-full bg-muted",
            "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "absolute rounded-full bg-primary",
              "data-[orientation=horizontal]:h-full",
              "data-[orientation=vertical]:w-full",
            )}
          />
        </SliderPrimitive.Track>
        {values.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            data-slot="slider-thumb"
            className={cn(
              "block size-4 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm transition-colors",
              "ring-ring/50 outline-none focus-visible:ring-[3px]",
              "disabled:pointer-events-none",
              "hover:border-primary",
            )}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider }

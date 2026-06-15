"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

export type SwitchSize = "sm" | "md" | "lg"

const TRACK_SIZE: Record<SwitchSize, string> = {
  sm: "h-4 w-7",
  md: "h-5 w-9",
  lg: "h-[26px] w-[46px]",
}

const THUMB_SIZE: Record<SwitchSize, string> = {
  sm: "size-3 data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-3",
  md: "size-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4",
  lg: "size-[22px] data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5",
}

// Wider tracks so the ON/OFF text fits beside the thumb.
const LABELED_TRACK_SIZE: Record<SwitchSize, string> = {
  sm: "h-4 w-11",
  md: "h-5 w-[52px]",
  lg: "h-[26px] w-16",
}

const LABELED_THUMB_SIZE: Record<SwitchSize, string> = {
  sm: "size-3 data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-7",
  md: "size-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-8",
  lg: "size-[22px] data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-[38px]",
}

const STATE_LABEL_TEXT: Record<SwitchSize, string> = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-[11px]",
}

function Switch({
  className,
  size = "md",
  label,
  description,
  withStateLabel = false,
  onLabel = "ON",
  offLabel = "OFF",
  id: idProp,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: SwitchSize
  /** Text shown next to the switch. Clicking it toggles the switch. */
  label?: React.ReactNode
  /** Secondary text rendered under the label. */
  description?: React.ReactNode
  /** Render ON/OFF text inside the track. */
  withStateLabel?: boolean
  onLabel?: string
  offLabel?: string
}) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId

  const control = (
    <SwitchPrimitive.Root
      id={id}
      data-slot="switch"
      className={cn(
        "group peer relative inline-flex shrink-0 items-center rounded-full p-0.5 outline-none transition-colors",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-100",
        "data-[state=unchecked]:disabled:bg-muted",
        "data-[state=checked]:disabled:bg-primary/40",
        withStateLabel ? LABELED_TRACK_SIZE[size] : TRACK_SIZE[size],
        className
      )}
      {...props}
    >
      {withStateLabel && (
        <>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-1.5 font-bold uppercase tracking-wide text-white opacity-0 transition-opacity",
              "group-data-[state=checked]:opacity-100",
              STATE_LABEL_TEXT[size]
            )}
          >
            {onLabel}
          </span>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute right-1.5 font-bold uppercase tracking-wide text-muted-foreground opacity-100 transition-opacity",
              "group-data-[state=checked]:opacity-0",
              STATE_LABEL_TEXT[size]
            )}
          >
            {offLabel}
          </span>
        </>
      )}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative z-10 block rounded-full bg-white shadow-sm ring-0 transition-transform",
          withStateLabel ? LABELED_THUMB_SIZE[size] : THUMB_SIZE[size]
        )}
      />
    </SwitchPrimitive.Root>
  )

  if (label == null && description == null) {
    return control
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      {control}
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
      >
        {label != null && (
          <span className="text-sm leading-tight text-foreground">{label}</span>
        )}
        {description != null && (
          <span className="text-xs leading-tight text-muted-foreground">
            {description}
          </span>
        )}
      </label>
    </div>
  )
}

export { Switch }

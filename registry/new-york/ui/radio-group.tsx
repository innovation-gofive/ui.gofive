"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-input bg-background outline-none transition-[border-color,box-shadow]",
        "hover:border-primary",
        "focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-[state=checked]:border-primary",
        "disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:data-[state=checked]:border-muted-foreground",
        "[&[data-disabled]_[data-slot=radio-group-dot]]:bg-muted-foreground",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span data-slot="radio-group-dot" className="size-2 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }

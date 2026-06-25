"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

export type CheckboxSize = "sm" | "md" | "lg"

const BOX_SIZE: Record<CheckboxSize, string> = {
  sm: "size-3.5 rounded-[3.5px]",
  md: "size-[18px] rounded-[5px]",
  lg: "size-[22px] rounded-[6px]",
}

const ICON_SIZE: Record<CheckboxSize, string> = {
  sm: "[&_svg]:size-2.5",
  md: "[&_svg]:size-3",
  lg: "[&_svg]:size-3.5",
}

function Checkbox({
  className,
  size = "md",
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  size?: CheckboxSize
}) {
  const indeterminate = checked === "indeterminate"

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        "peer inline-flex shrink-0 items-center justify-center border-[1.5px] border-input bg-background text-primary-foreground outline-none transition-[background-color,border-color,box-shadow]",
        "hover:border-primary",
        "focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "disabled:cursor-not-allowed disabled:border-input disabled:bg-muted",
        "data-[state=checked]:disabled:border-muted-foreground data-[state=checked]:disabled:bg-muted-foreground",
        "data-[state=indeterminate]:disabled:border-muted-foreground data-[state=indeterminate]:disabled:bg-muted-foreground",
        BOX_SIZE[size],
        ICON_SIZE[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-in zoom-in-50 fade-in-0 duration-150 motion-reduce:animate-none"
      >
        {indeterminate ? (
          <Minus className="stroke-[3.5]" />
        ) : (
          <Check className="stroke-[3.5]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

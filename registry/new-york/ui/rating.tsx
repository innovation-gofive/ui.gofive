"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export type RatingSize = "sm" | "md" | "lg"

const STAR_SIZE: Record<RatingSize, string> = {
  sm: "size-4",
  md: "size-[22px]",
  lg: "size-7",
}

const STAR_COLOR = "#F5B700"
const EMPTY_COLOR = "#D4D4D8"

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number
  defaultValue?: number
  max?: number
  size?: RatingSize
  readOnly?: boolean
  disabled?: boolean
  onChange?: (value: number) => void
}

function Rating({
  value,
  defaultValue = 0,
  max = 5,
  size = "md",
  readOnly = false,
  disabled = false,
  onChange,
  className,
  ...props
}: RatingProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const [hover, setHover] = React.useState<number | null>(null)

  const current = isControlled ? (value as number) : internal
  const display = hover ?? current

  const interactive = !readOnly && !disabled

  function setValue(next: number) {
    if (!interactive) return
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div
      data-slot="rating"
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${current} out of ${max}`}
      className={cn(
        "inline-flex items-center gap-1",
        disabled && "opacity-50",
        className,
      )}
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= display

        return (
          <button
            key={starValue}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? starValue === current : undefined}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            disabled={!interactive}
            tabIndex={interactive ? 0 : -1}
            onClick={() => setValue(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            className={cn(
              "shrink-0 leading-none transition-transform",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default",
            )}
          >
            <Star
              className={cn(STAR_SIZE[size], "transition-colors")}
              style={{
                color: filled ? STAR_COLOR : EMPTY_COLOR,
                fill: filled ? STAR_COLOR : "transparent",
              }}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}

export { Rating }

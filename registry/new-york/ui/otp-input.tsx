"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface OTPInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "onChange" | "value" | "defaultValue" | "type" | "maxLength"
  > {
  /** Controlled value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  /** Called with the joined string whenever the value changes. */
  onValueChange?: (value: string) => void
  /** Number of cells to render. */
  length?: number
  /** Called when every cell is filled. */
  onComplete?: (value: string) => void
  /** Show • instead of the typed character. */
  mask?: boolean
  disabled?: boolean
  /** Extra classes on the cell row container. */
  containerClassName?: string
}

const ONLY_DIGITS = /\d/g

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(function OTPInput(
  {
    value,
    defaultValue,
    onValueChange,
    length = 6,
    onComplete,
    mask = false,
    disabled,
    inputMode = "numeric",
    className,
    containerClassName,
    "aria-label": ariaLabel = "One-time code",
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(
    () => (defaultValue ?? "").slice(0, length),
  )
  const raw = isControlled ? value ?? "" : internal
  const current = raw.slice(0, length)

  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  // The active cell is the first empty one, or the last cell when full.
  const activeIndex = Math.min(current.length, length - 1)

  function commit(next: string) {
    const clean = next.slice(0, length)
    if (!isControlled) setInternal(clean)
    onValueChange?.(clean)
    if (clean.length === length) onComplete?.(clean)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = (e.target.value.match(ONLY_DIGITS) ?? []).join("")
    commit(digits)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Native input already handles caret movement; we only intercept the
    // arrow keys so focus lands on the intended cell on the next render.
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      // Let the browser move the caret naturally.
      return
    }
  }

  const cells = Array.from({ length }, (_, i) => i)

  return (
    <div
      data-slot="otp-input"
      data-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex w-fit",
        disabled && "pointer-events-none opacity-50",
        containerClassName,
      )}
    >
      {/* The real input is overlaid transparently across the whole row so the
          OS keyboard, paste and autofill all work, while the cells render the UI. */}
      <input
        ref={inputRef}
        data-slot="otp-input-field"
        type="text"
        inputMode={inputMode}
        autoComplete="one-time-code"
        aria-label={ariaLabel}
        disabled={disabled}
        value={current}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 outline-none",
          className,
        )}
        {...props}
      />

      <div data-slot="otp-input-cells" className="flex gap-1.5">
        {cells.map((i) => {
          const char = current[i] ?? ""
          const isFilled = char !== ""
          const isActive = focused && i === activeIndex
          return (
            <div
              key={i}
              data-slot="otp-input-cell"
              data-active={isActive || undefined}
              data-filled={isFilled || undefined}
              className={cn(
                "flex h-10 w-9 items-center justify-center rounded-lg border bg-card text-lg font-bold tabular-nums text-foreground transition-[color,box-shadow,border-color]",
                isActive && "border-ring ring-ring/50 ring-[3px]",
              )}
            >
              {isFilled ? (mask ? "•" : char) : ""}
            </div>
          )
        })}
      </div>
    </div>
  )
})

export { OTPInput }

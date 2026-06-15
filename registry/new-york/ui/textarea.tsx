"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends Omit<React.ComponentProps<"textarea">, "onChange" | "value" | "defaultValue"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Visual validation state. */
  state?: "error" | "success"
  /** Show a "used / max" character counter at the bottom-right. Requires `maxLength`. */
  showCount?: boolean
  /** Grow the textarea height to fit its content. */
  autoResize?: boolean
  containerClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value,
    defaultValue,
    onValueChange,
    state,
    showCount = false,
    autoResize = false,
    maxLength,
    disabled,
    className,
    containerClassName,
    placeholder = "Write something…",
    rows = 4,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const current = isControlled ? value : internal

  const innerRef = React.useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement)

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  // auto-resize: grow with content
  React.useEffect(() => {
    if (!autoResize) return
    const el = innerRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [autoResize, current])

  const showCounter = showCount && maxLength != null

  return (
    <div
      data-slot="textarea"
      data-state={state}
      data-disabled={disabled || undefined}
      className={cn(
        "flex w-full flex-col rounded-[10px] border bg-card px-3 py-2.5 text-sm transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        state === "error" &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/30",
        state === "success" &&
          "border-success focus-within:border-success focus-within:ring-success/30",
        disabled && "pointer-events-none opacity-50",
        containerClassName,
      )}
    >
      <textarea
        ref={innerRef}
        data-slot="textarea-field"
        value={current}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "min-h-[70px] w-full flex-1 resize-y bg-transparent leading-relaxed text-foreground outline-none placeholder:text-muted-foreground",
          autoResize && "resize-none overflow-hidden",
          className,
        )}
        {...props}
      />
      {showCounter && (
        <div
          data-slot="textarea-counter"
          className="mt-1.5 self-end font-mono text-[10.5px] text-muted-foreground"
        >
          {current.length} / {maxLength}
        </div>
      )}
    </div>
  )
})

export { Textarea }

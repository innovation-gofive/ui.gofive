"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SegmentedSize = "sm" | "md" | "lg"

interface SegmentedContextValue {
  value: string | undefined
  setValue: (value: string) => void
  size: SegmentedSize
  fullWidth: boolean
}

const SegmentedContext = React.createContext<SegmentedContextValue | null>(null)

function useSegmentedContext(component: string) {
  const ctx = React.useContext(SegmentedContext)
  if (!ctx) {
    throw new Error(`${component} must be used within <Segmented>`)
  }
  return ctx
}

// ── Segmented (container) ──────────────────────────────────────────
// Inline tab-like switch. Controlled via `value`/`onValueChange` or
// uncontrolled via `defaultValue`. Compose with <SegmentedItem>.
export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: SegmentedSize
  fullWidth?: boolean
  children: React.ReactNode
}

function Segmented({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: SegmentedProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue,
  )
  const current = isControlled ? value : internal

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const ctx = React.useMemo<SegmentedContextValue>(
    () => ({ value: current, setValue, size, fullWidth }),
    [current, setValue, size, fullWidth],
  )

  return (
    <SegmentedContext.Provider value={ctx}>
      <div
        role="tablist"
        data-slot="segmented"
        data-size={size}
        className={cn(
          "inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted p-[2px]",
          fullWidth && "flex w-full",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SegmentedContext.Provider>
  )
}

// ── SegmentedItem (option) ─────────────────────────────────────────
const SIZE_CLASSES: Record<SegmentedSize, string> = {
  sm: "h-7 px-2.5 text-[12px] [&_svg]:size-3.5",
  md: "h-8 px-3.5 text-[12.5px] [&_svg]:size-4",
  lg: "h-9 px-4 text-[13.5px] [&_svg]:size-4",
}

export interface SegmentedItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

function SegmentedItem({
  value,
  className,
  children,
  onClick,
  ...props
}: SegmentedItemProps) {
  const { value: current, setValue, size, fullWidth } =
    useSegmentedContext("SegmentedItem")
  const selected = current === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-slot="segmented-item"
      data-state={selected ? "active" : "inactive"}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) setValue(value)
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md bg-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_svg]:shrink-0",
        SIZE_CLASSES[size],
        fullWidth && "flex-1",
        selected
          ? "bg-background font-semibold text-foreground shadow-sm"
          : "font-medium text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Segmented, SegmentedItem }

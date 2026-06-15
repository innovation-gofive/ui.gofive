"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const PRIMARY = "#0A66E0"
const PRIMARY_WASH = "#EAF2FE"
const LINE = "#D4D4D8"
const MUTED = "#52525F"

// ── NPS (0 – 10 numeric scale) ─────────────────────────────────────
export interface NPSScaleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
}

function NPSScale({
  value,
  defaultValue,
  min = 0,
  max = 10,
  onChange,
  className,
  ...props
}: NPSScaleProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<number | null>(
    defaultValue ?? null,
  )
  const current = isControlled ? value : internal

  function select(n: number) {
    if (!isControlled) setInternal(n)
    onChange?.(n)
  }

  const items: number[] = []
  for (let n = min; n <= max; n++) items.push(n)

  return (
    <div
      data-slot="nps-scale"
      role="radiogroup"
      className={cn("flex flex-wrap gap-1", className)}
      {...props}
    >
      {items.map((n) => {
        const selected = current === n
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={String(n)}
            onClick={() => select(n)}
            className="flex h-9 min-w-9 flex-1 items-center justify-center rounded-md border text-[13px] font-semibold tabular-nums transition-colors hover:border-[#0A66E0] hover:text-[#0A66E0]"
            style={
              selected
                ? { backgroundColor: PRIMARY, borderColor: PRIMARY, color: "#fff" }
                : { backgroundColor: "#fff", borderColor: LINE, color: MUTED }
            }
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

// ── CSAT (emoji satisfaction scale) ────────────────────────────────
const DEFAULT_FACES = ["😞", "🙁", "😐", "🙂", "😍"]

export interface CSATScaleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Selected face as a 1-based index. */
  value?: number
  defaultValue?: number
  faces?: string[]
  onChange?: (value: number) => void
}

function CSATScale({
  value,
  defaultValue,
  faces = DEFAULT_FACES,
  onChange,
  className,
  ...props
}: CSATScaleProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<number | null>(
    defaultValue ?? null,
  )
  const current = isControlled ? value : internal

  function select(n: number) {
    if (!isControlled) setInternal(n)
    onChange?.(n)
  }

  return (
    <div
      data-slot="csat-scale"
      role="radiogroup"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {faces.map((face, i) => {
        const idx = i + 1
        const selected = current === idx
        return (
          <button
            key={idx}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`Rating ${idx} of ${faces.length}`}
            onClick={() => select(idx)}
            className="flex size-11 items-center justify-center rounded-full text-[22px] leading-none transition-transform hover:scale-105"
            style={
              selected
                ? {
                    backgroundColor: PRIMARY_WASH,
                    transform: "scale(1.08)",
                    boxShadow: `0 0 0 2px ${PRIMARY}`,
                  }
                : { backgroundColor: "#F4F4F5" }
            }
          >
            {face}
          </button>
        )
      })}
    </div>
  )
}

export { NPSScale, CSATScale }

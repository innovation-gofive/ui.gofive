"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton, type CopyButtonLabels } from "./copy-button"
import { Input } from "./input"
import { Label } from "./label"

type CopyFieldSize = "xs" | "sm" | "md" | "lg"

// Button heights track Input's SIZE_CONTAINER so the pair lines up.
const BUTTON_SIZE: Record<CopyFieldSize, string> = {
  xs: "h-7 px-2.5 text-xs",
  sm: "h-8 px-3",
  md: "h-[38px]",
  lg: "h-11",
}

const ICON_BUTTON_SIZE: Record<CopyFieldSize, string> = {
  xs: "size-7",
  sm: "size-8",
  md: "size-[38px]",
  lg: "size-11",
}

export type CopyFieldLabels = CopyButtonLabels

export interface CopyFieldProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "size" | "onCopy" | "prefix" | "readOnly"
  > {
  /** Shown read-only and copied verbatim. */
  value: string
  /** Visible label linked to the field. Without it, pass `aria-label`. */
  label?: React.ReactNode
  inputSize?: CopyFieldSize
  labels?: Partial<CopyFieldLabels>
  /** Called after a successful copy only. */
  onCopy?: (value: string) => void
  /** How long the copied state lasts, in ms. */
  resetAfter?: number
  /** Icon-only button instead of icon + text. */
  iconOnly?: boolean
  /** Class for the input's own element. `className` lands on the root. */
  inputClassName?: string
}

const CopyField = React.forwardRef<HTMLInputElement, CopyFieldProps>(function CopyField(
  {
    value,
    label,
    inputSize = "md",
    labels,
    onCopy,
    resetAfter = 2000,
    iconOnly = false,
    id: idProp,
    className,
    inputClassName,
    disabled,
    onFocus,
    onMouseDown,
    onMouseUp,
    ...props
  },
  ref,
) {
  const autoId = React.useId()
  const id = idProp ?? autoId
  const labelId = `${id}-label`
  // The mouseup of the click that focused the field would collapse the
  // select-all from onFocus; swallow that one mouseup only.
  const keepSelection = React.useRef(false)

  return (
    <div data-slot="copy-field" className={cn("grid min-w-0 gap-2", className)}>
      {label != null && (
        <Label id={labelId} htmlFor={id}>
          {label}
        </Label>
      )}
      <div className="flex min-w-0 gap-2">
        <Input
          ref={ref}
          id={id}
          readOnly
          value={value}
          disabled={disabled}
          inputSize={inputSize}
          containerClassName="min-w-0 flex-1"
          className={inputClassName}
          {...props}
          onFocus={(e) => {
            e.currentTarget.select()
            onFocus?.(e)
          }}
          onMouseDown={(e) => {
            keepSelection.current = document.activeElement !== e.currentTarget
            onMouseDown?.(e)
          }}
          onMouseUp={(e) => {
            if (keepSelection.current) e.preventDefault()
            keepSelection.current = false
            onMouseUp?.(e)
          }}
        />
        <CopyButton
          text={value}
          labels={labels}
          onCopy={onCopy}
          resetAfter={resetAfter}
          disabled={disabled}
          variant="outline"
          showLabel={!iconOnly}
          aria-describedby={label != null ? labelId : undefined}
          className={iconOnly ? ICON_BUTTON_SIZE[inputSize] : BUTTON_SIZE[inputSize]}
        />
      </div>
    </div>
  )
})

export { CopyField }

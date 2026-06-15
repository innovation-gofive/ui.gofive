"use client"

import * as React from "react"
import { Eye, EyeOff, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ── shared sizing tokens ──────────────────────────────────────────
type InputSize = "xs" | "sm" | "md" | "lg"
type InputVariant = "filled" | "underline"
type InputState = "error" | "success"

const SIZE_CONTAINER: Record<InputSize, string> = {
  xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs",
  sm: "h-8 gap-2 rounded-[7px] px-2.5 text-[12.5px]",
  md: "h-[38px] gap-2 rounded-lg px-3 text-[13px]",
  lg: "h-11 gap-2.5 rounded-[10px] px-3.5 text-sm",
}

const SIZE_ICON: Record<InputSize, string> = {
  xs: "[&_svg]:size-3.5",
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-[18px]",
}

// ── Input ─────────────────────────────────────────────────────────
export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size" | "prefix" | "value" | "defaultValue" | "onChange"> {
  inputSize?: InputSize
  variant?: InputVariant
  state?: InputState
  leading?: React.ReactNode
  trailing?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  clearable?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = "md",
    variant = "filled",
    state,
    leading,
    trailing,
    prefix,
    suffix,
    clearable = false,
    value,
    defaultValue,
    onValueChange,
    className,
    containerClassName,
    disabled,
    readOnly,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const current = isControlled ? value : internal
  const innerRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const resolvedState: InputState | undefined =
    state ?? (ariaInvalid && ariaInvalid !== "false" ? "error" : undefined)
  const hasValue = current.length > 0
  const showClear = clearable && hasValue && !disabled && !readOnly
  const isUnderline = variant === "underline"

  return (
    <div
      data-slot="input"
      data-variant={variant}
      data-state={resolvedState}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        "flex w-full items-center border bg-card text-foreground transition-[color,box-shadow,background-color] outline-none",
        SIZE_CONTAINER[inputSize],
        // default focus + hover (filled)
        !isUnderline && "hover:border-muted-foreground/40 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        // underline variant
        isUnderline &&
          "rounded-none border-0 border-b border-input px-0 bg-transparent focus-within:border-ring",
        // state: error
        resolvedState === "error" &&
          !isUnderline &&
          "border-danger focus-within:border-danger focus-within:ring-danger/25",
        resolvedState === "error" && isUnderline && "border-danger focus-within:border-danger",
        // state: success
        resolvedState === "success" &&
          !isUnderline &&
          "border-success focus-within:border-success focus-within:ring-success/20",
        resolvedState === "success" && isUnderline && "border-success focus-within:border-success",
        // disabled / readonly
        disabled && "pointer-events-none bg-muted text-muted-foreground opacity-70",
        readOnly && !isUnderline && "bg-muted/40",
        containerClassName,
      )}
      onClick={() => innerRef.current?.focus()}
    >
      {leading && (
        <span
          data-slot="input-leading"
          className={cn("flex shrink-0 items-center text-muted-foreground [&_svg]:shrink-0", SIZE_ICON[inputSize])}
        >
          {leading}
        </span>
      )}
      {prefix != null && (
        <span data-slot="input-prefix" className="shrink-0 whitespace-nowrap text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        ref={innerRef}
        data-slot="input-field"
        value={current}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={resolvedState === "error" || undefined}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
      {suffix != null && (
        <span data-slot="input-suffix" className="shrink-0 whitespace-nowrap text-muted-foreground">
          {suffix}
        </span>
      )}
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            setValue("")
            innerRef.current?.focus()
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
      {trailing && (
        <span
          data-slot="input-trailing"
          className={cn("flex shrink-0 items-center text-muted-foreground [&_svg]:shrink-0", SIZE_ICON[inputSize])}
        >
          {trailing}
        </span>
      )}
    </div>
  )
})

// ── PasswordInput ─────────────────────────────────────────────────
export interface PasswordInputProps extends Omit<InputProps, "trailing" | "type"> {
  defaultVisible?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { defaultVisible = false, disabled, ...props },
  ref,
) {
  const [visible, setVisible] = React.useState(defaultVisible)
  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      disabled={disabled}
      trailing={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={disabled}
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            setVisible((v) => !v)
          }}
          className="flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      }
      {...props}
    />
  )
})

// ── NumberInput ───────────────────────────────────────────────────
export interface NumberInputProps
  extends Omit<InputProps, "value" | "defaultValue" | "onValueChange" | "type" | "trailing" | "inputMode"> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    inputSize = "md",
    disabled,
    readOnly,
    className,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<number>(defaultValue ?? 0)
  const current = isControlled ? (value as number) : internal

  const clamp = (n: number) => {
    let next = n
    if (min !== undefined) next = Math.max(min, next)
    if (max !== undefined) next = Math.min(max, next)
    return next
  }

  const commit = (next: number) => {
    const clamped = clamp(next)
    if (!isControlled) setInternal(clamped)
    onValueChange?.(clamped)
  }

  const stepBy = (dir: 1 | -1) => commit((Number.isFinite(current) ? current : 0) + dir * step)

  const atMin = min !== undefined && current <= min
  const atMax = max !== undefined && current >= max

  return (
    <Input
      ref={ref}
      inputSize={inputSize}
      disabled={disabled}
      readOnly={readOnly}
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      step={step}
      value={String(current)}
      onValueChange={(raw) => {
        if (raw === "" || raw === "-") {
          if (!isControlled) setInternal(0)
          onValueChange?.(0)
          return
        }
        const parsed = Number(raw)
        if (Number.isNaN(parsed)) return
        commit(parsed)
      }}
      className={cn(
        "text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      trailing={
        <span data-slot="number-stepper" className="-mr-1 flex flex-col">
          <button
            type="button"
            aria-label="Increment"
            tabIndex={-1}
            disabled={disabled || readOnly || atMax}
            onClick={(e) => {
              e.stopPropagation()
              stepBy(1)
            }}
            className="flex h-3 w-4 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            aria-label="Decrement"
            tabIndex={-1}
            disabled={disabled || readOnly || atMin}
            onClick={(e) => {
              e.stopPropagation()
              stepBy(-1)
            }}
            className="flex h-3 w-4 items-center justify-center rounded-[3px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronDown className="size-3" />
          </button>
        </span>
      }
      {...props}
    />
  )
})

export { Input, PasswordInput, NumberInput }

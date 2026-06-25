"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// ── TagInput ──────────────────────────────────────────────────────
export interface TagInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange"
  > {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  /** Maximum number of tags allowed. */
  max?: number
  /** Allow duplicate tags. Defaults to false. */
  allowDuplicates?: boolean
  /** Characters that commit the typed tag. Enter always commits. Defaults to [","]. */
  separator?: string[]
  containerClassName?: string
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  function TagInput(
    {
      value,
      defaultValue,
      onValueChange,
      placeholder = "Add tag…",
      max,
      allowDuplicates = false,
      separator = [","],
      disabled,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) {
    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<string[]>(
      defaultValue ?? [],
    )
    const tags = isControlled ? value : internal
    const [draft, setDraft] = React.useState("")

    const innerRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    const setTags = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange],
    )

    const atMax = max != null && tags.length >= max

    const addTag = React.useCallback(
      (raw: string) => {
        const trimmed = raw.trim()
        if (!trimmed) return
        if (atMax) return
        if (!allowDuplicates && tags.includes(trimmed)) return
        setTags([...tags, trimmed])
      },
      [atMax, allowDuplicates, tags, setTags],
    )

    const removeAt = React.useCallback(
      (index: number) => {
        setTags(tags.filter((_, i) => i !== index))
      },
      [tags, setTags],
    )

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || separator.includes(e.key)) {
        if (draft.trim()) {
          e.preventDefault()
          addTag(draft)
          setDraft("")
        } else if (e.key === "Enter") {
          // prevent submitting a surrounding form on empty Enter
          e.preventDefault()
        }
      } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
        e.preventDefault()
        removeAt(tags.length - 1)
      }
    }

    return (
      <div
        data-slot="tag-input"
        data-disabled={disabled || undefined}
        onMouseDown={(e) => {
          // focus the field when clicking empty container space
          if (e.target === e.currentTarget) {
            e.preventDefault()
            innerRef.current?.focus()
          }
        }}
        className={cn(
          "flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border bg-card px-2 py-1.5 text-sm transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          disabled && "pointer-events-none opacity-50",
          containerClassName,
        )}
      >
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            data-slot="tag-input-chip"
            className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary animate-in fade-in-0 zoom-in-95 duration-150 motion-reduce:animate-none"
          >
            {tag}
            <button
              type="button"
              data-slot="tag-input-remove"
              aria-label={`Remove ${tag}`}
              disabled={disabled}
              onClick={() => removeAt(i)}
              className="-mr-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-primary/70 transition-colors hover:bg-primary/20 hover:text-primary"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={innerRef}
          data-slot="tag-input-field"
          value={draft}
          disabled={disabled}
          placeholder={atMax ? undefined : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              addTag(draft)
              setDraft("")
            }
          }}
          className={cn(
            "min-w-[80px] flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

export { TagInput }

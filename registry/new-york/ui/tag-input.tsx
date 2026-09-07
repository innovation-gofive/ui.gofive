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
  /**
   * Reject entries that do not belong — an email field, say. Return `false` or
   * a message to refuse; the text stays in the field so it can be corrected.
   */
  validate?: (value: string) => boolean | string
  /** Called for every entry `validate` refused, including each one in a paste. */
  onReject?: (value: string, reason: string) => void
  /**
   * Characters that split a *pasted* blob. Wider than `separator` on purpose:
   * a list copied out of a mail client arrives semicolon- or newline-delimited
   * whichever key the field commits on.
   */
  pasteSeparator?: string[]
  /** Emitted as hidden inputs so the tags reach a native form submit. */
  name?: string
  containerClassName?: string
}

const DEFAULT_PASTE_SEPARATORS = [",", ";", "\n", "\r", "\t"]

/** Split a pasted blob on every configured separator. */
function splitPasted(text: string, separators: string[]): string[] {
  const marks = [...new Set(separators)]
  let parts = [text]
  for (const mark of marks) {
    parts = parts.flatMap((part) => part.split(mark))
  }
  return parts.map((p) => p.trim()).filter(Boolean)
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
      pasteSeparator = DEFAULT_PASTE_SEPARATORS,
      validate,
      onReject,
      name,
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
    const [rejected, setRejected] = React.useState<string | null>(null)

    /** Returns the entries that were accepted, so callers can clear the draft. */
    const addTags = React.useCallback(
      (raws: string[]): string[] => {
        const accepted: string[] = []
        const next = [...tags]
        for (const raw of raws) {
          const trimmed = raw.trim()
          if (!trimmed) continue
          if (max != null && next.length >= max) break
          if (!allowDuplicates && next.includes(trimmed)) continue
          const verdict = validate ? validate(trimmed) : true
          if (verdict !== true) {
            const reason =
              typeof verdict === "string" ? verdict : "Invalid entry"
            setRejected(reason)
            onReject?.(trimmed, reason)
            continue
          }
          next.push(trimmed)
          accepted.push(trimmed)
        }
        if (accepted.length) {
          setRejected(null)
          setTags(next)
        }
        return accepted
      },
      [max, allowDuplicates, tags, setTags, validate, onReject],
    )

    const addTag = React.useCallback(
      (raw: string) => addTags([raw]),
      [addTags],
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
          // Keep a refused entry in the field so it can be corrected in place.
          if (addTag(draft).length) setDraft("")
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
        {name &&
          tags.map((tag, i) => (
            <input key={`hidden-${tag}-${i}`} type="hidden" name={name} value={tag} />
          ))}
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
          aria-invalid={rejected ? true : undefined}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text")
            const parts = splitPasted(text, [...separator, ...pasteSeparator])
            // A single unsplittable value is an ordinary paste — let it land in
            // the field so it can still be edited before committing.
            if (parts.length < 2) return
            e.preventDefault()
            addTags(parts)
            setDraft("")
          }}
          onChange={(e) => {
            setRejected(null)
            setDraft(e.target.value)
          }}
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

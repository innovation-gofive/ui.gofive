"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// Clipboard API first; outside a secure context (plain-HTTP intranets) it is
// missing or rejects, so fall back to a selected off-screen textarea.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.setAttribute("readonly", "")
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export interface UseCopyOptions {
  /** How long `copied` stays true, in ms. */
  resetAfter?: number
  /** Called after a successful copy only. */
  onCopy?: (text: string) => void
}

/** `copied` turns true only when the write succeeded, then resets after `resetAfter`. */
function useCopy({ resetAfter = 2000, onCopy }: UseCopyOptions = {}) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const alive = React.useRef(true)
  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      clearTimeout(timer.current)
    }
  }, [])

  const copy = React.useCallback(
    async (text: string) => {
      const ok = await copyText(text)
      if (ok) onCopy?.(text)
      if (alive.current) {
        // A failed retry must not keep showing the previous success.
        clearTimeout(timer.current)
        setCopied(ok)
        if (ok) timer.current = setTimeout(() => setCopied(false), resetAfter)
      }
      return ok
    },
    [resetAfter, onCopy],
  )

  return { copied, copy }
}

export interface CopyButtonLabels {
  copy: string
  copied: string
}

const DEFAULT_LABELS: CopyButtonLabels = { copy: "Copy", copied: "Copied" }

export interface CopyButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children" | "onCopy" | "asChild">,
    UseCopyOptions {
  /** Written to the clipboard verbatim. */
  text: string
  labels?: Partial<CopyButtonLabels>
  /** Show the label beside the icon. Icon-only by default, where it becomes the accessible name. */
  showLabel?: boolean
}

function CopyButton({
  text,
  labels,
  showLabel = false,
  resetAfter,
  onCopy,
  variant = "ghost",
  size,
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const L = { ...DEFAULT_LABELS, ...labels }
  const { copied, copy } = useCopy({ resetAfter, onCopy })
  const label = copied ? L.copied : L.copy

  return (
    <>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? L.copied : ""}
      </span>
      <Button
        type="button"
        data-slot="copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size ?? (showLabel ? "default" : "icon")}
        aria-label={showLabel ? undefined : label}
        title={showLabel ? undefined : label}
        className={cn(copied && "text-success hover:text-success", className)}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) void copy(text)
        }}
        {...props}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        {showLabel && label}
      </Button>
    </>
  )
}

export { CopyButton, useCopy }

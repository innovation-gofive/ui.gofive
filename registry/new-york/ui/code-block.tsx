"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton, type CopyButtonLabels } from "./copy-button"

export interface CodeBlockLabels extends CopyButtonLabels {
  /** Accessible name of the scroll area when there is no `label`. */
  code: string
}

const DEFAULT_LABELS: CodeBlockLabels = { copy: "Copy", copied: "Copied", code: "Code" }

export interface CodeBlockProps
  extends Omit<React.ComponentProps<"figure">, "children" | "onCopy"> {
  /** Rendered and copied verbatim. */
  code: string
  /** Small caption in the header, e.g. "bash". Also set as `data-language`. */
  language?: string
  /** Header title, e.g. "Example request". Also names the scroll area. */
  label?: React.ReactNode
  copyable?: boolean
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean
  /** Vertical cap; taller code scrolls. */
  maxHeight?: number | string
  labels?: Partial<CodeBlockLabels>
  /** Called after a successful copy only. */
  onCopy?: (code: string) => void
}

function CodeBlock({
  code,
  language,
  label,
  copyable = true,
  wrap = false,
  maxHeight,
  labels,
  onCopy,
  className,
  ...props
}: CodeBlockProps) {
  const L = { ...DEFAULT_LABELS, ...labels }
  const labelId = React.useId()
  const hasHeader = label != null || !!language

  const copy = copyable && (
    <CopyButton
      text={code}
      labels={L}
      onCopy={onCopy}
      className={cn(
        "size-7 text-muted-foreground hover:bg-background/60",
        !hasHeader && "absolute top-1.5 right-1.5",
      )}
    />
  )

  return (
    <figure
      data-slot="code-block"
      data-language={language}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-lg border border-border bg-muted text-foreground",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <figcaption
          data-slot="code-block-header"
          className="flex min-h-9 items-center gap-2 border-b border-border py-1 pr-1.5 pl-3 text-xs text-muted-foreground"
        >
          {label != null && (
            <span id={labelId} className="min-w-0 truncate font-medium text-foreground">
              {label}
            </span>
          )}
          {language && <span className="ml-auto shrink-0 font-mono">{language}</span>}
          <span className={cn("flex shrink-0", !language && "ml-auto")}>{copy}</span>
        </figcaption>
      )}
      <pre
        data-slot="code-block-content"
        tabIndex={0}
        role="region"
        aria-labelledby={label != null ? labelId : undefined}
        aria-label={label != null ? undefined : language ? `${L.code} (${language})` : L.code}
        style={maxHeight != null ? { maxHeight } : undefined}
        className={cn(
          "overflow-auto p-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          !hasHeader && copyable && "pr-11",
        )}
      >
        <code>{code}</code>
      </pre>
      {!hasHeader && copy}
    </figure>
  )
}

export { CodeBlock }

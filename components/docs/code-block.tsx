"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CodeBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn("group relative", className)}>
      <pre className="overflow-x-auto rounded-lg border bg-zinc-950 px-4 py-3.5 text-[13px] leading-relaxed text-zinc-50 dark:bg-zinc-900">
        <code className="font-mono">{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2.5 top-2.5 size-7 text-zinc-300 opacity-0 hover:bg-zinc-800 hover:text-zinc-50 group-hover:opacity-100"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  )
}

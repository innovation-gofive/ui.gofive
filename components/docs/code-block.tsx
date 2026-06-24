"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Code2,
  Copy,
  FileCode,
  FileJson,
  Hash,
  Terminal,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { highlight, type SupportedLang } from "@/lib/shiki"

const SUPPORTED: readonly SupportedLang[] = [
  "tsx",
  "typescript",
  "bash",
  "json",
  "css",
  "html",
]

const EXT_TO_LANG: Record<string, SupportedLang> = {
  tsx: "tsx",
  ts: "typescript",
  jsx: "tsx",
  js: "tsx",
  json: "json",
  css: "css",
  html: "html",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
}

const LANG_TO_ICON: Record<SupportedLang, LucideIcon> = {
  tsx: FileCode,
  typescript: FileCode,
  bash: Terminal,
  json: FileJson,
  css: Hash,
  html: Code2,
}

const MONO_FALLBACK =
  'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace)'

function resolveLanguage(language?: string, title?: string): SupportedLang {
  if (language && (SUPPORTED as readonly string[]).includes(language)) {
    return language as SupportedLang
  }
  if (title) {
    const ext = title.split(".").pop()?.toLowerCase()
    if (ext && EXT_TO_LANG[ext]) return EXT_TO_LANG[ext]
  }
  return "tsx"
}

export function CodeBlock({
  code,
  className,
  title,
  language,
}: {
  code: string
  className?: string
  title?: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState<string | null>(null)

  const lang = resolveLanguage(language, title)
  const Icon = LANG_TO_ICON[lang]

  useEffect(() => {
    let active = true
    highlight(code, lang)
      .then(out => {
        if (active) setHtml(out)
      })
      .catch(() => {
        /* keep raw fallback on failure */
      })
    return () => {
      active = false
    }
  }, [code, lang])

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyButton = (
    <Button
      size="icon"
      variant="ghost"
      onClick={copy}
      aria-label="Copy code"
      className={cn(
        "size-7 text-muted-foreground hover:text-foreground",
        title
          ? "-mr-1.5 shrink-0"
          : "absolute right-2.5 top-2.5 z-10 opacity-0 group-hover:opacity-100"
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  )

  // Code body: highlighted HTML once ready, else a matching raw fallback.
  // The highlighted markup is only rendered after the effect runs (client-only),
  // so server and initial client output are identical — no hydration mismatch.
  const body = html ? (
    <div
      className="text-[13px] [&_pre]:!outline-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed text-foreground">
      <code style={{ fontFamily: MONO_FALLBACK }}>{code}</code>
    </pre>
  )

  if (title) {
    return (
      <div
        className={cn(
          "code-block-has-header overflow-hidden rounded-lg border bg-card",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b bg-muted px-4 py-2">
          <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <Icon className="size-4 shrink-0" />
            <span
              className="truncate text-[13px]"
              style={{ fontFamily: MONO_FALLBACK }}
            >
              {title}
            </span>
          </div>
          {copyButton}
        </div>
        {body}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card",
        className
      )}
    >
      {body}
      {copyButton}
    </div>
  )
}

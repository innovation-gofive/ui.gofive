import { createHighlighterCore, type HighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

// Languages we support. Key = canonical Shiki lang id.
// Lazy import() keeps each grammar out of the initial bundle.
const LANG_LOADERS = {
  tsx: () => import("@shikijs/langs/tsx"),
  typescript: () => import("@shikijs/langs/typescript"),
  bash: () => import("@shikijs/langs/bash"),
  json: () => import("@shikijs/langs/json"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
} as const

export type SupportedLang = keyof typeof LANG_LOADERS

let highlighterPromise: Promise<HighlighterCore> | null = null

function initHighlighter(): Promise<HighlighterCore> {
  return createHighlighterCore({
    // Load both themes up front (tiny JSON) so dual-theme output works.
    themes: [
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark"),
    ],
    // Start with the most common grammar; others load on demand below.
    langs: [import("@shikijs/langs/tsx")],
    engine: createJavaScriptRegexEngine(),
  })
}

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) highlighterPromise = initHighlighter()
  return highlighterPromise
}

export async function highlight(
  code: string,
  lang: SupportedLang
): Promise<string> {
  const highlighter = await getHighlighter()

  // Lazily register the grammar if not already loaded.
  if (!highlighter.getLoadedLanguages().includes(lang)) {
    const loader = LANG_LOADERS[lang]
    if (loader) await highlighter.loadLanguage(await loader())
  }

  const resolvedLang = highlighter.getLoadedLanguages().includes(lang)
    ? lang
    : "text"

  return highlighter.codeToHtml(code, {
    lang: resolvedLang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false, // emit --shiki-light / --shiki-dark per token; switch via CSS
  })
}

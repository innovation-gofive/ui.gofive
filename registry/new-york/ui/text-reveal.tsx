"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
// Colour, font and size are inherited, so this stylesheet owns no colour at all.
// Pieces sit in their hidden pose until the wrapper gets `data-revealed="true"`,
// then each one plays the same keyframes, offset by `--gf-text-reveal-i * stagger`.
// Reduced motion and print both skip straight to the final pose.
const TEXT_REVEAL_CSS = `
  .gf-text-reveal{--gf-text-reveal-blur:8px;}
  .dark .gf-text-reveal{--gf-text-reveal-blur:6px;}
  .gf-text-reveal-piece{display:inline-block;max-width:100%;overflow-wrap:anywhere;opacity:0;filter:blur(var(--gf-text-reveal-blur));transform:translateY(.35em);}
  .gf-text-reveal-word{display:inline-block;max-width:100%;overflow-wrap:anywhere;}
  .gf-text-reveal[data-revealed="true"] .gf-text-reveal-piece{animation:gf-text-reveal-in var(--gf-text-reveal-duration) cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--gf-text-reveal-delay) + var(--gf-text-reveal-i) * var(--gf-text-reveal-stagger));}
  @keyframes gf-text-reveal-in{from{opacity:0;filter:blur(var(--gf-text-reveal-blur));transform:translateY(.35em);}to{opacity:1;filter:blur(0);transform:none;}}
  @media (prefers-reduced-motion: reduce){.gf-text-reveal-piece,.gf-text-reveal[data-revealed="true"] .gf-text-reveal-piece{animation:none;opacity:1;filter:none;transform:none;}}
  @media (scripting: none){.gf-text-reveal-piece{opacity:1;filter:none;transform:none;}}
  @media print{.gf-text-reveal-piece,.gf-text-reveal[data-revealed="true"] .gf-text-reveal-piece{animation:none;opacity:1;filter:none;transform:none;}}
`

export type TextRevealSplit = "word" | "char"
export type TextRevealTrigger = "mount" | "inView"

type PieceData = { text: string; index: number }
type RevealNode =
  | { kind: "space"; text: string }
  | { kind: "word"; pieces: PieceData[] }

const hasSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl

function graphemes(text: string, locales?: string[]): string[] {
  if (!hasSegmenter) return Array.from(text) // ponytail: code points; combining marks may split without Segmenter
  return Array.from(
    new Intl.Segmenter(locales, { granularity: "grapheme" }).segment(text),
    (s) => s.segment,
  )
}

/** Split into words and whitespace; punctuation is glued onto its neighbouring word. */
function words(text: string, locales?: string[]): string[] {
  if (!hasSegmenter) return text.split(/(\s+)/).filter(Boolean)
  const out: string[] = []
  let pending = ""
  let afterWord = false
  for (const s of new Intl.Segmenter(locales, { granularity: "word" }).segment(text)) {
    if (/^\s+$/.test(s.segment)) {
      if (pending) out.push(pending)
      pending = ""
      out.push(s.segment)
      afterWord = false
    } else if (s.isWordLike) {
      out.push(pending + s.segment)
      pending = ""
      afterWord = true
    } else if (afterWord) {
      out[out.length - 1] += s.segment
    } else {
      pending += s.segment
    }
  }
  if (pending) out.push(pending)
  return out
}

function build(text: string, split: TextRevealSplit, locales?: string[]): RevealNode[] {
  let index = 0
  return words(text, locales).map((token): RevealNode => {
    if (/^\s+$/.test(token)) return { kind: "space", text: token }
    const parts = split === "char" ? graphemes(token, locales) : [token]
    return { kind: "word", pieces: parts.map((p) => ({ text: p, index: index++ })) }
  })
}

type TextRevealOwnProps = {
  /** The text to reveal. Plain text only, no markup. */
  text: string
  /** Reveal unit: whole words, or single grapheme clusters. */
  split?: TextRevealSplit
  /** BCP 47 tag(s) for segmentation. Matters for Thai word mode. Also sets `lang`. */
  locale?: string | string[]
  /** Gap in ms between the start of one piece and the next. */
  stagger?: number
  /** Wait in ms before the first piece starts. */
  delay?: number
  /** Duration in ms of each piece's own animation. */
  duration?: number
  /** Wrapper element. */
  as?: React.ElementType
  /** Start on mount, or when the text first scrolls into view. */
  trigger?: TextRevealTrigger
  /** Play once (default). When false, reset on leaving the viewport and replay on re-entry. */
  once?: boolean
  ref?: React.Ref<HTMLElement>
}

export type TextRevealProps = TextRevealOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof TextRevealOwnProps | "children">

function TextReveal({
  text,
  split = "word",
  locale,
  stagger = 40,
  delay = 0,
  duration = 700,
  as: Comp = "p",
  trigger = "inView",
  once = true,
  className,
  style,
  ref,
  ...props
}: TextRevealProps) {
  const el = React.useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = React.useState(false)

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      el.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<HTMLElement | null>).current = node
    },
    [ref],
  )

  const localeKey = Array.isArray(locale) ? locale.join(",") : locale
  const nodes = React.useMemo(
    () => build(text, split, localeKey ? localeKey.split(",") : undefined),
    [text, split, localeKey],
  )

  React.useEffect(() => {
    // Nothing to wait for: show immediately (also covers browsers without IntersectionObserver).
    if (trigger === "mount" || typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setRevealed(true))
      return () => cancelAnimationFrame(raf)
    }
    const node = el.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1] // batched callbacks: the newest wins
        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) io.disconnect()
        } else if (!once) {
          setRevealed(false)
        }
      },
      { threshold: 0 }, // first visible pixel: a paragraph taller than the screen never hits a percentage
    )
    io.observe(node)
    return () => io.disconnect()
  }, [trigger, once])

  return (
    <>
      <style href="gf-text-reveal" precedence="low">{TEXT_REVEAL_CSS}</style>
      <Comp
        data-slot="text-reveal"
        data-revealed={revealed}
        ref={setRefs}
        lang={localeKey?.split(",")[0]}
        className={cn("gf-text-reveal relative", className)}
        style={
          {
            "--gf-text-reveal-delay": `${delay}ms`,
            "--gf-text-reveal-stagger": `${stagger}ms`,
            "--gf-text-reveal-duration": `${duration}ms`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* One accessible copy; the animated pieces below are hidden from AT and from copy-paste of this node. */}
        <span data-slot="text-reveal-label" className="sr-only select-none">{text}</span>
        <span data-slot="text-reveal-visual" aria-hidden>
          {nodes.map((n, i) =>
            n.kind === "space" ? (
              n.text
            ) : split === "char" ? (
              <span key={i} data-slot="text-reveal-word" className="gf-text-reveal-word">
                {n.pieces.map((p) => (
                  <Piece key={p.index} piece={p} />
                ))}
              </span>
            ) : (
              <Piece key={i} piece={n.pieces[0]} />
            ),
          )}
        </span>
      </Comp>
    </>
  )
}

function Piece({ piece }: { piece: PieceData }) {
  return (
    <span
      data-slot="text-reveal-piece"
      className="gf-text-reveal-piece"
      style={{ "--gf-text-reveal-i": piece.index } as React.CSSProperties}
    >
      {piece.text}
    </span>
  )
}

export { TextReveal }

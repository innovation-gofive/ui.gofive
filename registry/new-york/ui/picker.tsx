"use client"

import * as React from "react"
import { ResponsivePopover as PopoverPrimitive } from "./responsive-popover"
import {
  Check,
  ChevronDown,
  Search,
  Home,
  User,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  Settings,
  Bell,
  Mail,
  Heart,
  Bookmark,
  Camera,
  Image,
  File,
  Folder,
  Tag,
  Flag,
  Map,
  Phone,
  Gift,
  Coffee,
  Music,
  Zap,
  Cloud,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Shared popover panel ────────────────────────────────────────────
const PANEL_CLASS =
  "z-50 w-fit origin-(--radix-popover-content-transform-origin) rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"

function PickerPopover({
  children,
  trigger,
  align = "start",
  sideOffset = 6,
  className,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  trigger: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="picker-popover"
          align={align}
          sideOffset={sideOffset}
          className={cn(PANEL_CLASS, className)}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// ── Draggable 1D track (hue / alpha sliders) ────────────────────────
function DragTrack({
  fraction,
  onFraction,
  className,
  style,
  "aria-label": ariaLabel,
}: {
  fraction: number
  onFraction: (fraction: number) => void
  className?: string
  style?: React.CSSProperties
  "aria-label"?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const update = React.useCallback(
    (clientX: number) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const f = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      onFraction(f)
    },
    [onFraction]
  )

  const handleDown = (e: React.PointerEvent) => {
    e.preventDefault()
    update(e.clientX)
    const move = (ev: PointerEvent) => update(ev.clientX)
    const up = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      onFraction(Math.max(0, fraction - 0.02))
    else if (e.key === "ArrowRight" || e.key === "ArrowUp")
      onFraction(Math.min(1, fraction + 0.02))
  }

  return (
    <div
      ref={ref}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fraction * 100)}
      tabIndex={0}
      onPointerDown={handleDown}
      onKeyDown={handleKey}
      className={cn(
        "relative my-2.5 h-3 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={style}
    >
      <span
        className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/15 bg-white shadow"
        style={{ left: `${fraction * 100}%` }}
      />
    </div>
  )
}

// ── Color helpers ───────────────────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase()
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g] = [c, x]
  else if (h < 120) [r, g] = [x, c]
  else if (h < 180) [g, b] = [c, x]
  else if (h < 240) [g, b] = [x, c]
  else if (h < 300) [r, b] = [c, x]
  else [r, b] = [x, c]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

// Split a value into a 6-digit hex and a 0–1 alpha (supports 8-digit hex).
function parseColor(value: string): { hex: string; alpha: number } {
  let h = value.replace("#", "")
  let alpha = 1
  if (h.length === 8) {
    alpha = parseInt(h.slice(6, 8), 16) / 255
    h = h.slice(0, 6)
  }
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  return { hex: `#${h}`.toUpperCase(), alpha }
}

// Re-combine a hex + alpha, appending the alpha byte only when < 100%.
function withAlpha(hex: string, alpha: number): string {
  if (alpha >= 1) return hex.toUpperCase()
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0")
  return `${hex}${a}`.toUpperCase()
}

// luminance check to pick contrasting check-mark color
function isLight(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

// ── Color picker ────────────────────────────────────────────────────
export const DEFAULT_COLORS = [
  "#F05B2F", "#F02848", "#E89A2A", "#FFC505",
  "#2DAE4B", "#00C291", "#116DFC", "#7B5CFF",
  "#E677B7", "#0891B2", "#1C1C22", "#52525F",
  "#A5A5B6", "#DFDFE8", "#F6F6F8", "#FFFFFF",
] as const

export const DEFAULT_RECENT_COLORS = [
  "#116DFC", "#FFC505", "#F05B2F", "#2DAE4B", "#E677B7",
] as const

export interface ColorSwatchGridProps {
  value?: string
  onChange?: (color: string) => void
  colors?: readonly string[]
  className?: string
}

function ColorSwatchGrid({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  className,
}: ColorSwatchGridProps) {
  const selectedHex = value ? parseColor(value).hex : undefined
  return (
    <div
      data-slot="color-swatch-grid"
      className={cn("grid grid-cols-8 gap-1.5", className)}
    >
      {colors.map((color) => {
        const selected = selectedHex?.toLowerCase() === color.toLowerCase()
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange?.(color)}
            aria-label={color}
            aria-pressed={selected}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-md border border-black/5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring",
              selected && "ring-2 ring-ring ring-offset-1 ring-offset-background"
            )}
            style={{ backgroundColor: color }}
          >
            {selected && (
              <Check
                className="size-3.5 drop-shadow"
                style={{ color: isLight(color) ? "#1C1C22" : "#ffffff" }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface ColorPanelProps {
  value?: string
  onChange?: (color: string) => void
  colors?: readonly string[]
  recent?: readonly string[]
  className?: string
}

const HUE_GRADIENT =
  "linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)"

function ColorPanel({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  recent = DEFAULT_RECENT_COLORS,
  className,
}: ColorPanelProps) {
  const current = value ?? colors[0]
  const { hex, alpha } = parseColor(current)
  const { r, g, b } = hexToRgb(hex)
  const hsv = rgbToHsv(r, g, b)

  const [hexText, setHexText] = React.useState(hex.replace("#", ""))
  React.useEffect(() => setHexText(hex.replace("#", "")), [hex])

  const emit = (nextHex: string, nextAlpha = alpha) =>
    onChange?.(withAlpha(nextHex, nextAlpha))

  const setHue = (frac: number) => {
    const rgb = hsvToRgb(frac * 360, hsv.s || 1, hsv.v || 1)
    emit(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
    setHexText(v)
    if (v.length === 3 || v.length === 6) emit(`#${v}`)
  }

  const alphaBg = `linear-gradient(to right, transparent, ${hex}), repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 8px 8px`

  return (
    <div data-slot="color-panel" className={cn("w-[296px]", className)}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold">Color</span>
        <code className="font-mono text-xs text-muted-foreground">HEX</code>
      </div>

      <ColorSwatchGrid value={hex} onChange={(c) => emit(c)} colors={colors} />

      <DragTrack
        aria-label="Hue"
        fraction={hsv.h / 360}
        onFraction={setHue}
        style={{ background: HUE_GRADIENT }}
      />
      <DragTrack
        aria-label="Opacity"
        fraction={alpha}
        onFraction={(f) => emit(hex, f)}
        style={{ background: alphaBg }}
      />

      <div className="flex items-center gap-2 rounded-lg border px-2.5 py-2 font-mono text-xs">
        <span
          className="size-[18px] shrink-0 rounded border border-black/10"
          style={{ backgroundColor: hex, opacity: alpha }}
        />
        <span className="text-muted-foreground">#</span>
        <input
          aria-label="Hex value"
          value={hexText}
          onChange={handleHexInput}
          className="w-full flex-1 bg-transparent uppercase outline-none"
        />
        <span className="shrink-0 text-muted-foreground">
          {Math.round(alpha * 100)}%
        </span>
      </div>

      {recent.length > 0 && (
        <>
          <div className="mt-2.5 mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((color, i) => (
              <button
                key={`${color}-${i}`}
                type="button"
                onClick={() => emit(parseColor(color).hex)}
                aria-label={color}
                className="size-[22px] rounded-md border border-black/5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export interface ColorPickerProps extends ColorPanelProps {
  align?: "start" | "center" | "end"
}

function ColorPicker({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  recent,
  align = "start",
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState<string>(value ?? colors[0])
  const [recentList, setRecentList] = React.useState<string[]>(
    () => (recent ? [...recent] : [...DEFAULT_RECENT_COLORS])
  )
  const current = value ?? internal
  const triggerHex = parseColor(current).hex

  const handleChange = (c: string) => {
    if (value === undefined) setInternal(c)
    onChange?.(c)
  }

  const handleOpenChange = (next: boolean) => {
    // Snapshot the chosen color into "recent" when the panel closes.
    if (!next) {
      const chosen = parseColor(current).hex
      setRecentList((prev) =>
        [chosen, ...prev.filter((c) => c.toLowerCase() !== chosen.toLowerCase())].slice(0, 8)
      )
    }
    setOpen(next)
  }

  return (
    <PickerPopover
      open={open}
      onOpenChange={handleOpenChange}
      align={align}
      className={cn("w-auto", className)}
      trigger={
        <button
          type="button"
          data-slot="color-picker-trigger"
          className="inline-flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className="size-3.5 rounded border border-black/10"
            style={{ backgroundColor: triggerHex }}
          />
          <code className="font-mono text-xs text-muted-foreground">
            {triggerHex}
          </code>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      }
    >
      <ColorPanel
        value={current}
        onChange={handleChange}
        colors={colors}
        recent={recent ?? recentList}
      />
    </PickerPopover>
  )
}

// ── Emoji picker ────────────────────────────────────────────────────
export type EmojiCategory = { label: string; icon?: string; emojis: string[] }

export const DEFAULT_EMOJIS: EmojiCategory[] = [
  {
    label: "Smileys & people",
    icon: "😀",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "🥹", "😅", "🤣",
      "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇", "🥰",
      "😍", "🤩", "😘", "😋", "😜", "🤪", "🤗", "🤔",
    ],
  },
  {
    label: "Animals & nature",
    icon: "🐶",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
      "🐨", "🐯", "🦁", "🐮", "🌷", "🌸", "🌳", "🍀",
    ],
  },
  {
    label: "Food & drink",
    icon: "🍔",
    emojis: [
      "🍔", "🍕", "🌮", "🍣", "🍜", "🍩", "🍪", "🎂",
      "🍓", "🍉", "☕", "🍵", "🍺", "🥤", "🍷", "🧁",
    ],
  },
  {
    label: "Activities",
    icon: "🎉",
    emojis: [
      "🎉", "🎊", "🎈", "🎁", "🎂", "🎆", "🎇", "✨",
      "⚽", "🏀", "🏆", "🎮", "🎵", "🎨", "🎯", "🎸",
    ],
  },
  {
    label: "Symbols",
    icon: "❤️",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🔥", "⭐",
      "✅", "❌", "💯", "❓", "❗", "⚡", "💡", "🚩",
    ],
  },
]

export type EmojiMeta = Record<string, { name: string; shortcode?: string }>

export const DEFAULT_EMOJI_META: EmojiMeta = {
  "🎉": { name: "Party popper", shortcode: ":tada:" },
  "😀": { name: "Grinning face", shortcode: ":grinning:" },
  "😍": { name: "Smiling face with heart-eyes", shortcode: ":heart_eyes:" },
  "🥰": { name: "Smiling face with hearts", shortcode: ":smiling_face_with_hearts:" },
  "🔥": { name: "Fire", shortcode: ":fire:" },
  "❤️": { name: "Red heart", shortcode: ":heart:" },
  "⭐": { name: "Star", shortcode: ":star:" },
  "✅": { name: "Check mark button", shortcode: ":white_check_mark:" },
  "🚀": { name: "Rocket", shortcode: ":rocket:" },
  "👍": { name: "Thumbs up", shortcode: ":+1:" },
}

// Unicode codepoint label, e.g. "U+1F389".
function emojiCodepoint(emoji: string): string {
  return Array.from(emoji)
    .map((c) => "U+" + (c.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0"))
    .join(" ")
}

export interface EmojiGridProps {
  value?: string
  onSelect?: (emoji: string) => void
  categories?: EmojiCategory[]
  recent?: string[]
  meta?: EmojiMeta
  showPreview?: boolean
  className?: string
}

function EmojiGrid({
  value,
  onSelect,
  categories = DEFAULT_EMOJIS,
  recent = [],
  meta = DEFAULT_EMOJI_META,
  showPreview = true,
  className,
}: EmojiGridProps) {
  const [query, setQuery] = React.useState("")
  const [preview, setPreview] = React.useState<string | undefined>(value)
  const [activeTab, setActiveTab] = React.useState<string>(
    recent.length > 0 ? "__recent" : categories[0]?.label
  )

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const sectionRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const sections = React.useMemo(() => {
    const base: EmojiCategory[] =
      recent.length > 0
        ? [{ label: "__recent", icon: "🕘", emojis: recent }, ...categories]
        : categories
    if (!query.trim()) return base
    const q = query.trim().toLowerCase()
    return base
      .map((cat) => ({
        ...cat,
        emojis: cat.emojis.filter(
          (e) =>
            e.includes(q) || (meta[e]?.name.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((cat) => cat.emojis.length > 0)
  }, [categories, recent, query, meta])

  const scrollToCat = (label: string) => {
    const el = sectionRefs.current[label]
    const container = scrollRef.current
    if (el && container) container.scrollTo({ top: el.offsetTop, behavior: "smooth" })
    setActiveTab(label)
  }

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return
    const top = container.scrollTop
    let current = sections[0]?.label
    for (const cat of sections) {
      const el = sectionRefs.current[cat.label]
      if (el && el.offsetTop - 8 <= top) current = cat.label
    }
    if (current) setActiveTab(current)
  }

  const previewEmoji = preview ?? value
  const previewMeta = previewEmoji ? meta[previewEmoji] : undefined

  return (
    <div data-slot="emoji-grid" className={cn("w-[296px]", className)}>
      <div className="mb-2.5 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emoji…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-2 flex gap-0.5 border-b pb-2">
        {(recent.length > 0
          ? [
              { label: "__recent", icon: "🕘" },
              ...categories.map((c) => ({ label: c.label, icon: c.icon ?? c.emojis[0] })),
            ]
          : categories.map((c) => ({ label: c.label, icon: c.icon ?? c.emojis[0] }))
        ).map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => scrollToCat(cat.label)}
            aria-label={cat.label === "__recent" ? "Recently used" : cat.label}
            aria-pressed={activeTab === cat.label}
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-base opacity-60 outline-none transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === cat.label && "bg-primary/10 opacity-100"
            )}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative max-h-[220px] overflow-y-auto pr-1"
      >
        {sections.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No emoji found
          </p>
        )}
        {sections.map((cat) => (
          <div
            key={cat.label}
            ref={(el) => {
              sectionRefs.current[cat.label] = el
            }}
          >
            <div className="mb-1 mt-1.5 px-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              {cat.label === "__recent" ? "Recently used" : cat.label}
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {cat.emojis.map((emoji, i) => {
                const selected = value === emoji
                return (
                  <button
                    key={`${cat.label}-${emoji}-${i}`}
                    type="button"
                    onClick={() => onSelect?.(emoji)}
                    onMouseEnter={() => setPreview(emoji)}
                    onFocus={() => setPreview(emoji)}
                    aria-label={meta[emoji]?.name ?? emoji}
                    aria-pressed={selected}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-md text-lg outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                      selected && "bg-primary/10 ring-1 ring-primary"
                    )}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {showPreview && previewEmoji && (
        <div className="mt-2 flex items-center gap-2.5 border-t pt-2.5">
          <span className="text-2xl leading-none">{previewEmoji}</span>
          <div className="min-w-0 font-mono text-[11.5px] text-muted-foreground">
            <span className="block truncate font-sans text-xs font-semibold text-foreground">
              {previewMeta?.name ?? "Emoji"}
            </span>
            {previewMeta?.shortcode && <span>{previewMeta.shortcode} · </span>}
            {emojiCodepoint(previewEmoji)}
          </div>
        </div>
      )}
    </div>
  )
}

export interface EmojiPickerProps extends EmojiGridProps {
  align?: "start" | "center" | "end"
  trigger?: React.ReactNode
}

function EmojiPicker({
  value,
  onSelect,
  categories = DEFAULT_EMOJIS,
  recent,
  meta,
  align = "start",
  trigger,
  className,
}: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <PickerPopover
      open={open}
      onOpenChange={setOpen}
      align={align}
      className={cn("w-auto", className)}
      trigger={
        trigger ?? (
          <button
            type="button"
            data-slot="emoji-picker-trigger"
            className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-base leading-none">{value ?? "🎉"}</span>
            <span className="text-muted-foreground">Add reaction</span>
          </button>
        )
      }
    >
      <EmojiGrid
        value={value}
        categories={categories}
        recent={recent}
        meta={meta}
        onSelect={(e) => {
          onSelect?.(e)
          setOpen(false)
        }}
      />
    </PickerPopover>
  )
}

// ── Icon picker ─────────────────────────────────────────────────────
export type IconEntry = { name: string; icon: LucideIcon }
export type IconVariant = "outline" | "solid" | "duotone"

export const DEFAULT_ICONS: IconEntry[] = [
  { name: "Home", icon: Home },
  { name: "User", icon: User },
  { name: "Calendar", icon: Calendar },
  { name: "MessageSquare", icon: MessageSquare },
  { name: "Star", icon: Star },
  { name: "Clock", icon: Clock },
  { name: "Settings", icon: Settings },
  { name: "Bell", icon: Bell },
  { name: "Mail", icon: Mail },
  { name: "Heart", icon: Heart },
  { name: "Bookmark", icon: Bookmark },
  { name: "Camera", icon: Camera },
  { name: "Image", icon: Image },
  { name: "File", icon: File },
  { name: "Folder", icon: Folder },
  { name: "Tag", icon: Tag },
  { name: "Flag", icon: Flag },
  { name: "Map", icon: Map },
  { name: "Phone", icon: Phone },
  { name: "Gift", icon: Gift },
  { name: "Coffee", icon: Coffee },
  { name: "Music", icon: Music },
  { name: "Zap", icon: Zap },
  { name: "Cloud", icon: Cloud },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
]

const ICON_VARIANTS: { value: IconVariant; label: string }[] = [
  { value: "outline", label: "Outline" },
  { value: "solid", label: "Solid" },
  { value: "duotone", label: "Duotone" },
]

// Per-variant SVG props applied to the rendered lucide icon.
function variantProps(variant: IconVariant) {
  switch (variant) {
    case "solid":
      return { fill: "currentColor", strokeWidth: 0.5 }
    case "duotone":
      return { fill: "currentColor", fillOpacity: 0.25, strokeWidth: 1.6 }
    default:
      return { fill: "none", strokeWidth: 1.7 }
  }
}

export interface IconGridProps {
  value?: string
  onSelect?: (name: string, icon: LucideIcon) => void
  icons?: IconEntry[]
  variant?: IconVariant
  onVariantChange?: (variant: IconVariant) => void
  iconSize?: number
  showVariants?: boolean
  className?: string
}

function IconGrid({
  value,
  onSelect,
  icons = DEFAULT_ICONS,
  variant: variantProp,
  onVariantChange,
  iconSize = 24,
  showVariants = true,
  className,
}: IconGridProps) {
  const [query, setQuery] = React.useState("")
  const [internalVariant, setInternalVariant] = React.useState<IconVariant>("outline")
  const variant = variantProp ?? internalVariant

  const setVariant = (v: IconVariant) => {
    if (variantProp === undefined) setInternalVariant(v)
    onVariantChange?.(v)
  }

  const filtered = React.useMemo(() => {
    if (!query.trim()) return icons
    const q = query.trim().toLowerCase()
    return icons.filter((i) => i.name.toLowerCase().includes(q))
  }, [icons, query])

  const iconProps = variantProps(variant)

  return (
    <div data-slot="icon-grid" className={cn("w-[264px]", className)}>
      <div className="mb-2.5 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="grid max-h-[240px] grid-cols-6 gap-1 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="col-span-6 py-6 text-center text-sm text-muted-foreground">
            No icons found
          </p>
        )}
        {filtered.map(({ name, icon: Icon }) => {
          const selected = value === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect?.(name, Icon)}
              aria-label={name}
              aria-pressed={selected}
              title={name}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border border-transparent text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                selected && "border-primary bg-primary/10 text-primary"
              )}
            >
              <Icon className="size-[18px]" {...iconProps} />
            </button>
          )
        })}
      </div>

      {showVariants && (
        <div className="mt-2.5 flex items-center gap-2 border-t pt-2.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            Style
          </span>
          <div className="inline-flex gap-0.5 rounded-md bg-muted p-0.5">
            {ICON_VARIANTS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setVariant(v.value)}
                aria-pressed={variant === v.value}
                className={cn(
                  "rounded px-2 py-1 text-[11.5px] text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                  variant === v.value &&
                    "bg-background font-semibold text-foreground shadow-sm"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            {iconSize} px
          </span>
        </div>
      )}
    </div>
  )
}

export interface IconPickerProps extends IconGridProps {
  align?: "start" | "center" | "end"
}

function IconPicker({
  value,
  onSelect,
  icons = DEFAULT_ICONS,
  variant,
  onVariantChange,
  iconSize,
  align = "start",
  className,
}: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = icons.find((i) => i.name === value)
  const TriggerIcon = selected?.icon

  return (
    <PickerPopover
      open={open}
      onOpenChange={setOpen}
      align={align}
      className={cn("w-auto", className)}
      trigger={
        <button
          type="button"
          data-slot="icon-picker-trigger"
          className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TriggerIcon ? (
            <TriggerIcon className="size-4" />
          ) : (
            <Star className="size-4 text-muted-foreground" />
          )}
          <span className={cn(!selected && "text-muted-foreground")}>
            {value ?? "Pick icon"}
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      }
    >
      <IconGrid
        value={value}
        icons={icons}
        variant={variant}
        onVariantChange={onVariantChange}
        iconSize={iconSize}
        onSelect={(name, icon) => {
          onSelect?.(name, icon)
          setOpen(false)
        }}
      />
    </PickerPopover>
  )
}

export {
  ColorPicker,
  ColorPanel,
  ColorSwatchGrid,
  EmojiPicker,
  EmojiGrid,
  IconPicker,
  IconGrid,
}

"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
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

// ── Color picker ────────────────────────────────────────────────────
export const DEFAULT_COLORS = [
  "#F05B2F", "#F02848", "#E89A2A", "#FFC505",
  "#2DAE4B", "#00C291", "#116DFC", "#7B5CFF",
  "#E677B7", "#0891B2", "#1C1C22", "#52525F",
  "#A5A5B6", "#DFDFE8", "#F6F6F8", "#FFFFFF",
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
  return (
    <div
      data-slot="color-swatch-grid"
      className={cn("grid grid-cols-8 gap-1.5", className)}
    >
      {colors.map((color) => {
        const selected = value?.toLowerCase() === color.toLowerCase()
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

export interface ColorPickerProps extends ColorSwatchGridProps {
  align?: "start" | "center" | "end"
}

function ColorPicker({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  align = "start",
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)
  const current = value ?? colors[0]

  return (
    <PickerPopover
      open={open}
      onOpenChange={setOpen}
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
            style={{ backgroundColor: current }}
          />
          <code className="font-mono text-xs text-muted-foreground">
            {current.toUpperCase()}
          </code>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      }
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold">Color</span>
        <code className="font-mono text-xs text-muted-foreground">
          {current.toUpperCase()}
        </code>
      </div>
      <ColorSwatchGrid
        value={value}
        onChange={(c) => {
          onChange?.(c)
          setOpen(false)
        }}
        colors={colors}
      />
    </PickerPopover>
  )
}

// luminance check to pick contrasting check-mark color
function isLight(hex: string): boolean {
  const h = hex.replace("#", "")
  if (h.length < 6) return true
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

// ── Emoji picker ────────────────────────────────────────────────────
export type EmojiCategory = { label: string; emojis: string[] }

export const DEFAULT_EMOJIS: EmojiCategory[] = [
  {
    label: "Smileys & people",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "🥹", "😅", "🤣",
      "😂", "🙂", "🙃", "🫠", "😉", "😊", "😇", "🥰",
      "😍", "🤩", "😘", "😋", "😜", "🤪", "🤗", "🤔",
    ],
  },
  {
    label: "Animals & nature",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
      "🐨", "🐯", "🦁", "🐮", "🌷", "🌸", "🌳", "🍀",
    ],
  },
  {
    label: "Food & drink",
    emojis: [
      "🍔", "🍕", "🌮", "🍣", "🍜", "🍩", "🍪", "🎂",
      "🍓", "🍉", "☕", "🍵", "🍺", "🥤", "🍷", "🧁",
    ],
  },
  {
    label: "Activities",
    emojis: [
      "🎉", "🎊", "🎈", "🎁", "🎂", "🎆", "🎇", "✨",
      "⚽", "🏀", "🏆", "🎮", "🎵", "🎨", "🎯", "🎸",
    ],
  },
  {
    label: "Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🔥", "⭐",
      "✅", "❌", "💯", "❓", "❗", "⚡", "💡", "🚩",
    ],
  },
]

export interface EmojiGridProps {
  value?: string
  onSelect?: (emoji: string) => void
  categories?: EmojiCategory[]
  className?: string
}

function EmojiGrid({
  value,
  onSelect,
  categories = DEFAULT_EMOJIS,
  className,
}: EmojiGridProps) {
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!query.trim()) return categories
    const q = query.trim()
    return categories
      .map((cat) => ({
        ...cat,
        emojis: cat.emojis.filter((e) => e.includes(q)),
      }))
      .filter((cat) => cat.emojis.length > 0)
  }, [categories, query])

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
      <div className="max-h-[260px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No emoji found
          </p>
        )}
        {filtered.map((cat) => (
          <div key={cat.label}>
            <div className="mb-1 mt-1.5 px-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              {cat.label}
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {cat.emojis.map((emoji, i) => {
                const selected = value === emoji
                return (
                  <button
                    key={`${emoji}-${i}`}
                    type="button"
                    onClick={() => onSelect?.(emoji)}
                    aria-label={emoji}
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

export interface IconGridProps {
  value?: string
  onSelect?: (name: string, icon: LucideIcon) => void
  icons?: IconEntry[]
  className?: string
}

function IconGrid({
  value,
  onSelect,
  icons = DEFAULT_ICONS,
  className,
}: IconGridProps) {
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!query.trim()) return icons
    const q = query.trim().toLowerCase()
    return icons.filter((i) => i.name.toLowerCase().includes(q))
  }, [icons, query])

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
              <Icon className="size-[18px]" />
            </button>
          )
        })}
      </div>
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
  ColorSwatchGrid,
  EmojiPicker,
  EmojiGrid,
  IconPicker,
  IconGrid,
}

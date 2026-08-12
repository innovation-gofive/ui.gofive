"use client"

import * as React from "react"
import { ResponsivePopover as PopoverPrimitive } from "./responsive-popover"
import {
  Search,
  Image as ImageIcon,
  Upload,
  Link2,
  Globe,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type MediaTab = "library" | "upload" | "url" | "unsplash"

export interface MediaItem {
  id: string
  /** Image URL. When omitted, `gradient` renders a placeholder tile. */
  src?: string
  /** CSS background used as a placeholder when there is no `src`. */
  gradient?: string
  alt?: string
}

// Default gradient tiles, used when no library is supplied.
export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  { id: "m1", gradient: "linear-gradient(135deg,#C7D2FE,#F9A8D4)" },
  { id: "m2", gradient: "linear-gradient(135deg,#FED7AA,#FECACA)" },
  { id: "m3", gradient: "linear-gradient(135deg,#A7F3D0,#67E8F9)" },
  { id: "m4", gradient: "linear-gradient(135deg,#DDD6FE,#FCE7F3)" },
  { id: "m5", gradient: "linear-gradient(135deg,#1C1C22,#52525F)" },
  { id: "m6", gradient: "linear-gradient(135deg,#FDE68A,#F59E0B)" },
  { id: "m7", gradient: "linear-gradient(135deg,#93C5FD,#6366F1)" },
  { id: "m8", gradient: "linear-gradient(135deg,#6EE7B7,#10B981)" },
]

const TABS: { value: MediaTab; label: string; icon: typeof ImageIcon }[] = [
  { value: "library", label: "Library", icon: ImageIcon },
  { value: "upload", label: "Upload", icon: Upload },
  { value: "url", label: "From URL", icon: Link2 },
  { value: "unsplash", label: "Unsplash", icon: Globe },
]

function MediaThumb({
  item,
  selected,
  onSelect,
}: {
  item: MediaItem
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={item.alt ?? item.id}
      aria-pressed={selected}
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg border-2 border-transparent outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary"
      )}
      style={item.src ? undefined : { background: item.gradient }}
    >
      {item.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt={item.alt ?? ""} className="size-full object-cover" />
      )}
      {selected && (
        <span className="absolute right-1 top-1 flex size-[18px] items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

export interface MediaPanelProps {
  items?: MediaItem[]
  unsplashItems?: MediaItem[]
  value?: string
  defaultTab?: MediaTab
  tabs?: MediaTab[]
  onSelect?: (item: MediaItem) => void
  onInsert?: (item: MediaItem) => void
  onCancel?: () => void
  onUpload?: (files: FileList) => void
  onAddUrl?: (url: string) => void
  className?: string
}

function MediaPanel({
  items = DEFAULT_MEDIA_ITEMS,
  unsplashItems = DEFAULT_MEDIA_ITEMS,
  value,
  defaultTab = "library",
  tabs = ["library", "upload", "url", "unsplash"],
  onSelect,
  onInsert,
  onCancel,
  onUpload,
  onAddUrl,
  className,
}: MediaPanelProps) {
  const [tab, setTab] = React.useState<MediaTab>(defaultTab)
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | undefined>(value)
  const [url, setUrl] = React.useState("")
  const [dragOver, setDragOver] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const visibleTabs = TABS.filter((t) => tabs.includes(t.value))
  const source = tab === "unsplash" ? unsplashItems : items

  const filtered = React.useMemo(() => {
    if (!query.trim()) return source
    const q = query.trim().toLowerCase()
    return source.filter(
      (i) => i.alt?.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    )
  }, [source, query])

  const pick = (item: MediaItem) => {
    setSelectedId(item.id)
    onSelect?.(item)
  }

  const selection: MediaItem | undefined =
    tab === "url"
      ? url.trim()
        ? { id: "url", src: url.trim(), alt: "From URL" }
        : undefined
      : source.find((i) => i.id === selectedId)

  const handleFiles = (files: FileList | null) => {
    if (files && files.length) onUpload?.(files)
  }

  return (
    <div data-slot="media-panel" className={cn("w-[480px] max-w-[90vw]", className)}>
      <div className="mb-2.5 flex gap-1 rounded-lg bg-muted p-1.5">
        {visibleTabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.value
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              aria-pressed={active}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                active && "bg-background font-semibold text-foreground shadow-sm"
              )}
            >
              <Icon className="size-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {(tab === "library" || tab === "unsplash") && (
        <>
          <div className="mb-2.5 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "unsplash" ? "Search Unsplash…" : "Search your library…"
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid max-h-[260px] grid-cols-4 gap-2 overflow-y-auto pr-0.5">
            {filtered.length === 0 ? (
              <p className="col-span-4 py-8 text-center text-sm text-muted-foreground">
                No media found
              </p>
            ) : (
              filtered.map((item) => (
                <MediaThumb
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => pick(item)}
                />
              ))
            )}
          </div>
        </>
      )}

      {tab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex h-[220px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Upload className="size-5" />
          </span>
          <p className="text-sm font-medium">Drag &amp; drop, or click to browse</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10 MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {tab === "url" && (
        <div className="flex h-[220px] flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border px-2.5 py-2">
              <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={() => url.trim() && onAddUrl?.(url.trim())}
              disabled={!url.trim()}
              className="rounded-lg bg-muted px-3 text-sm font-medium text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
            {url.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url.trim()} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <p className="text-xs text-muted-foreground">Paste an image URL to preview</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t pt-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-8 items-center rounded-md border bg-background px-3 text-xs font-semibold text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => selection && onInsert?.(selection)}
          disabled={!selection}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground outline-none transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          Insert selection
        </button>
      </div>
    </div>
  )
}

export interface MediaPickerProps extends Omit<MediaPanelProps, "onCancel"> {
  trigger?: React.ReactNode
  align?: "start" | "center" | "end"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function MediaPicker({
  trigger,
  align = "start",
  open: openProp,
  onOpenChange,
  onInsert,
  className,
  ...panelProps
}: MediaPickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        {trigger ?? (
          <button
            type="button"
            data-slot="media-picker-trigger"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ImageIcon className="size-4 text-muted-foreground" />
            Choose media
          </button>
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="media-picker-popover"
          align={align}
          sideOffset={6}
          className={cn(
            "z-50 w-fit origin-(--radix-popover-content-transform-origin) rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          <MediaPanel
            {...panelProps}
            onCancel={() => setOpen(false)}
            onInsert={(item) => {
              onInsert?.(item)
              setOpen(false)
            }}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// Standalone close affordance for embedding the panel in a custom shell.
function MediaPanelClose({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
    >
      <X className="size-4" />
    </button>
  )
}

export { MediaPicker, MediaPanel, MediaPanelClose, MediaThumb }

"use client"

import * as React from "react"
import {
  Upload,
  File as FileIcon,
  FileText,
  ImageIcon,
  X,
  Link2,
  Download,
  Check,
  Play,
  Paperclip,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── File-type helpers ──────────────────────────────────────────────
export type FileKind = "pdf" | "doc" | "xls" | "ppt" | "zip" | "img" | "vid" | "file"

const KIND_BG: Record<FileKind, string> = {
  pdf: "#E6443C",
  doc: "#2B6CB0",
  xls: "#1E8449",
  ppt: "#C2410C",
  zip: "#6B7280",
  img: "#A24AC4",
  vid: "#0891B2",
  file: "#52525F",
}

const KIND_LABEL: Record<FileKind, string> = {
  pdf: "PDF",
  doc: "DOC",
  xls: "XLS",
  ppt: "PPT",
  zip: "ZIP",
  img: "IMG",
  vid: "VID",
  file: "FILE",
}

const EXT_KIND: Record<string, FileKind> = {
  pdf: "pdf",
  doc: "doc",
  docx: "doc",
  rtf: "doc",
  txt: "doc",
  xls: "xls",
  xlsx: "xls",
  csv: "xls",
  ppt: "ppt",
  pptx: "ppt",
  zip: "zip",
  rar: "zip",
  "7z": "zip",
  tar: "zip",
  gz: "zip",
  png: "img",
  jpg: "img",
  jpeg: "img",
  gif: "img",
  webp: "img",
  svg: "img",
  mp4: "vid",
  mov: "vid",
  webm: "vid",
  avi: "vid",
  mkv: "vid",
}

export function kindFromName(name: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_KIND[ext] ?? "file"
}

// Short type badge shown on the file icon. Prefer the real extension
// (PDF, PNG, ZIP) and fall back to the generic kind label.
function labelFromName(name: string, kind: FileKind): string {
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : ""
  return ext && ext.length <= 4 ? ext : KIND_LABEL[kind]
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

function KindIcon({ kind, className }: { kind: FileKind; className?: string }) {
  if (kind === "img") return <ImageIcon className={className} />
  if (kind === "file") return <FileIcon className={className} />
  return <FileText className={className} />
}

// ── Dropzone ───────────────────────────────────────────────────────
export interface DropzoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  onFiles?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  label?: React.ReactNode
  hint?: React.ReactNode
}

function Dropzone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  label,
  hint,
  className,
  ...props
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [hot, setHot] = React.useState(false)

  function emit(list: FileList | null) {
    if (!list || list.length === 0) return
    onFiles?.(Array.from(list))
  }

  return (
    <div
      data-slot="dropzone"
      data-state={hot ? "active" : "idle"}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        if (disabled) return
        e.preventDefault()
        setHot(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setHot(false)
      }}
      onDrop={(e) => {
        if (disabled) return
        e.preventDefault()
        setHot(false)
        emit(e.dataTransfer.files)
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed border-input bg-muted/40 px-6 py-8 text-center outline-none transition-colors",
        "hover:border-primary/60 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20",
        hot && "border-primary bg-primary/10",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          emit(e.target.files)
          e.target.value = ""
        }}
      />
      <span
        data-slot="dropzone-icon"
        className={cn(
          "mb-2.5 inline-flex size-10 items-center justify-center rounded-[10px] bg-card text-primary transition-colors [&_svg]:size-5",
          hot && "bg-primary text-primary-foreground"
        )}
      >
        <Upload strokeWidth={1.8} />
      </span>
      <div className="text-sm font-semibold text-foreground">
        {label ?? (
          <>
            <span className="text-primary">Click to upload</span> or drag and drop
          </>
        )}
      </div>
      {hint !== null && (
        <div className={cn("mt-1 text-xs text-muted-foreground", hot && "text-primary")}>
          {hint ?? "PNG, JPG, PDF, DOCX, XLSX · up to 25 MB each"}
        </div>
      )}
    </div>
  )
}

// ── FileItem ───────────────────────────────────────────────────────
export interface FileItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  size?: number | string
  kind?: FileKind
  meta?: React.ReactNode
  progress?: number
  error?: React.ReactNode
  onRemove?: () => void
  onDownload?: () => void
}

function FileItem({
  name,
  size,
  kind,
  meta,
  progress,
  error,
  onRemove,
  onDownload,
  className,
  ...props
}: FileItemProps) {
  const resolved = kind ?? kindFromName(name)
  const uploading = typeof progress === "number" && progress < 100 && !error
  const complete = !uploading && !error
  const sizeLabel = typeof size === "number" ? formatBytes(size) : size
  const typeLabel = labelFromName(name, resolved)

  return (
    <div
      data-slot="file-item"
      data-state={error ? "error" : uploading ? "uploading" : "complete"}
      className={cn(
        "flex items-center gap-3 rounded-[10px] border border-border bg-card px-3 py-2.5",
        error && "border-destructive/40 bg-destructive/5",
        className
      )}
      {...props}
    >
      <span
        data-slot="file-icon"
        className="relative flex h-11 w-9 shrink-0 items-end justify-center overflow-visible rounded-md p-1 text-[9px] font-bold uppercase leading-none tracking-[0.04em] text-white"
        style={{ backgroundColor: error ? KIND_BG.file : KIND_BG[resolved] }}
        aria-hidden
      >
        {typeLabel}
        {/* folded dog-ear corner */}
        <span className="absolute right-0 top-0 size-2.5 bg-white/30 [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        {/* success badge on completed uploads */}
        {complete && (
          <span className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full border-2 border-card bg-emerald-600 text-white [&_svg]:size-2">
            <Check strokeWidth={3} />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold text-foreground">{name}</div>
        <div
          className={cn(
            "mt-0.5 flex items-center gap-2 text-[11.5px] text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {error ? (
            <span className="truncate">{error}</span>
          ) : (
            <>
              {sizeLabel && <span className="shrink-0">{sizeLabel}</span>}
              {meta && (
                <>
                  {sizeLabel && <span className="text-border">·</span>}
                  <span className="truncate">{meta}</span>
                </>
              )}
            </>
          )}
        </div>
        {uploading && (
          <div
            className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onDownload && !error && !uploading && (
          <button
            type="button"
            onClick={onDownload}
            aria-label="Download"
            className="inline-flex size-7 items-center justify-center rounded-[7px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4"
          >
            <Download />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={uploading ? "Cancel" : "Remove"}
            className="inline-flex size-7 items-center justify-center rounded-[7px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive [&_svg]:size-4"
          >
            <X />
          </button>
        )}
      </div>
    </div>
  )
}

// ── LinkCard ───────────────────────────────────────────────────────
export interface LinkCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  url: string
  title?: React.ReactNode
  description?: React.ReactNode
  favicon?: string
  avatarColor?: string
}

function LinkCard({
  url,
  title,
  description,
  favicon,
  avatarColor = "#52525F",
  className,
  target = "_blank",
  rel = "noreferrer",
  ...props
}: LinkCardProps) {
  let host = url
  try {
    host = new URL(url).host.replace(/^www\./, "")
  } catch {
    /* keep raw url */
  }
  const letter = (typeof title === "string" ? title : host).charAt(0).toUpperCase()

  return (
    <a
      data-slot="link-card"
      href={url}
      target={target}
      rel={rel}
      className={cn(
        "group flex items-center gap-3 rounded-[10px] border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/50 hover:bg-muted/40",
        className
      )}
      {...props}
    >
      <span
        data-slot="link-favicon"
        className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[7px] text-xs font-bold text-white"
        style={{ backgroundColor: favicon ? undefined : avatarColor }}
        aria-hidden
      >
        {favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={favicon} alt="" className="size-full object-cover" />
        ) : (
          letter
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-foreground">
          {title ?? host}
        </div>
        <div className="truncate font-mono text-[11.5px] text-muted-foreground">
          {description ?? host}
        </div>
      </div>
      <Link2 className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
    </a>
  )
}

// ── MediaThumb ─────────────────────────────────────────────────────
export interface MediaThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: React.ReactNode
  size?: number | string
  /** Video clips — renders a play pill with the duration, e.g. "00:42". */
  duration?: string
  /** Overflow / status pill, e.g. "+12". Overrides the duration pill. */
  badge?: React.ReactNode
}

function MediaThumb({
  src,
  alt = "",
  name,
  size,
  duration,
  badge,
  className,
  ...props
}: MediaThumbProps) {
  const sizeLabel = typeof size === "number" ? formatBytes(size) : size
  const pill =
    badge ??
    (duration ? (
      <>
        <Play className="size-2.5 fill-current" />
        {duration}
      </>
    ) : null)

  return (
    <div
      data-slot="media-thumb"
      className={cn(
        "relative overflow-hidden rounded-[10px] border border-border bg-card",
        className
      )}
      {...props}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted-foreground/20">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        )}
      </div>
      {pill && (
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-[7px] py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-sm">
          {pill}
        </span>
      )}
      {(name || sizeLabel) && (
        <div className="flex items-center justify-between px-2.5 py-2">
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-foreground">
            {name}
          </span>
          {sizeLabel && (
            <span className="ml-2 shrink-0 font-mono text-[10.5px] text-muted-foreground">
              {sizeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── RichLinkCard ───────────────────────────────────────────────────
export interface RichLinkCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  url: string
  /** Source/site label. Defaults to the URL host. */
  site?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** OG preview image. Falls back to a gradient with `thumbLabel`. */
  image?: string
  thumbLabel?: React.ReactNode
}

function RichLinkCard({
  url,
  site,
  title,
  description,
  image,
  thumbLabel,
  className,
  target = "_blank",
  rel = "noreferrer",
  ...props
}: RichLinkCardProps) {
  let host = url
  try {
    host = new URL(url).host.replace(/^www\./, "")
  } catch {
    /* keep raw url */
  }

  return (
    <a
      data-slot="rich-link-card"
      href={url}
      target={target}
      rel={rel}
      className={cn(
        "flex max-w-[520px] gap-3 rounded-xl border border-border bg-card p-2.5 transition-colors hover:border-primary/50",
        className
      )}
      {...props}
    >
      <span
        data-slot="rich-link-thumb"
        className="flex h-[90px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground"
        aria-hidden
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          thumbLabel
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {site ?? host}
        </div>
        {title && (
          <div className="text-sm font-semibold leading-snug text-foreground">{title}</div>
        )}
        {description && (
          <div className="line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </a>
  )
}

export {
  Dropzone,
  FileItem,
  LinkCard,
  MediaThumb,
  RichLinkCard,
  KindIcon,
  Paperclip,
}

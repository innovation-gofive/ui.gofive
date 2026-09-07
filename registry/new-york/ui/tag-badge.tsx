"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Gofive semantic color tokens ───────────────────────────────────
export type TagColor = "success" | "warn" | "danger" | "info" | "neutral"
export type TagVariant = "soft" | "solid" | "outline"
export type TagSize = "sm" | "md" | "lg"
export type TagAnimation = "spin" | "shimmer" | "pop"

// Semantic colors as Tailwind classes, not inline style. Utilities are compiled
// by the *consuming* app, so they resolve against whatever token format that app
// keeps (real colors here, HSL triplets in a shadcn-v3-style app) — a raw
// `var(--success-soft)` in an inline style cannot do that, and inline style also
// blocks callers from overriding the color via className.
// Class strings must stay complete literals: Tailwind scans source text, so
// `bg-${color}-soft` would generate nothing.
const TONE: Record<TagColor, Record<TagVariant, string>> = {
  success: {
    soft: "bg-success-soft text-success-soft-foreground",
    solid: "bg-success text-success-foreground",
    outline: "border border-current bg-transparent text-success-soft-foreground",
  },
  warn: {
    soft: "bg-warning-soft text-warning-soft-foreground",
    solid: "bg-warning text-warning-foreground",
    outline: "border border-current bg-transparent text-warning-soft-foreground",
  },
  danger: {
    soft: "bg-danger-soft text-danger-soft-foreground",
    solid: "bg-danger text-danger-foreground",
    outline: "border border-current bg-transparent text-danger-soft-foreground",
  },
  info: {
    soft: "bg-info-soft text-info-soft-foreground",
    solid: "bg-info text-info-foreground",
    outline: "border border-current bg-transparent text-info-soft-foreground",
  },
  neutral: {
    soft: "bg-muted text-muted-foreground",
    // Keeps its dark ink fill in both themes, so the label stays literal white.
    solid: "bg-gf-fg-2 text-white",
    outline: "border border-current bg-transparent text-muted-foreground",
  },
}

const SIZE: Record<TagSize, string> = {
  sm: "h-[18px] px-[7px] text-[10.5px] gap-1",
  md: "h-[22px] px-[9px] text-[11.5px] gap-[5px]",
  lg: "h-[26px] px-[11px] text-[12.5px] gap-[5px]",
}

// ── Animation CSS (React 19 style hoisting deduplicates via href) ──
const ANIM_CSS = `
  .gf-dot-pulse{position:relative;}
  .gf-dot-pulse::after{content:"";position:absolute;inset:-2px;border-radius:50%;box-shadow:0 0 0 0 currentColor;opacity:.6;animation:gf-pulse 1.6s ease-out infinite;}
  @keyframes gf-pulse{0%{transform:scale(.8);opacity:.7;}70%,100%{transform:scale(2.2);opacity:0;}}
  .gf-tag-spin .gf-tag-icon{animation:gf-rot 1s linear infinite;}
  @keyframes gf-rot{to{transform:rotate(360deg);}}
  .gf-tag-shimmer{position:relative;overflow:hidden;isolation:isolate;}
  .gf-tag-shimmer::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-120%);animation:gf-shim 2.4s ease-in-out infinite;}
  @keyframes gf-shim{0%{transform:translateX(-120%);}60%,100%{transform:translateX(140%);}}
  .gf-tag-pop{animation:gf-popin .5s cubic-bezier(.2,.9,.3,1.4) both;}
  @keyframes gf-popin{0%{transform:scale(.4);opacity:0;}100%{transform:scale(1);opacity:1;}}
  .gf-typing-dot{animation:gf-typ 1.2s infinite;}
  .gf-typing-dot:nth-child(2){animation-delay:.15s;}
  .gf-typing-dot:nth-child(3){animation-delay:.3s;}
  @keyframes gf-typ{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-3px);opacity:1;}}
`

// ── Tag ───────────────────────────────────────────────────────────
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  square?: boolean
  animation?: TagAnimation
}

function Tag({
  color = "neutral",
  variant = "soft",
  size = "md",
  square = false,
  animation,
  className,
  style,
  children,
  ...props
}: TagProps) {
  return (
    <>
      <style href="gf-tag-badge" precedence="low">{ANIM_CSS}</style>
      <span
        className={cn(
          "inline-flex items-center font-bold leading-none tracking-[-0.003em]",
          SIZE[size],
          TONE[color][variant],
          square ? "rounded-[5px]" : "rounded-full",
          animation === "spin" && "gf-tag-spin",
          animation === "shimmer" && "gf-tag-shimmer",
          animation === "pop" && "gf-tag-pop",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </span>
    </>
  )
}

// ── TagDot ────────────────────────────────────────────────────────
export interface TagDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  pulse?: boolean
}

function TagDot({ pulse, className, ...props }: TagDotProps) {
  return (
    <span
      className={cn(
        "w-1.5 h-1.5 rounded-full bg-current shrink-0",
        pulse && "gf-dot-pulse",
        className,
      )}
      {...props}
    />
  )
}

// ── TagIcon ───────────────────────────────────────────────────────
export interface TagIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

function TagIcon({ children, className, ...props }: TagIconProps) {
  return (
    <span
      className={cn(
        "gf-tag-icon inline-flex items-center justify-center shrink-0 [&_svg]:size-3",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ── TypingTag ─────────────────────────────────────────────────────
export interface TypingTagProps extends Omit<TagProps, "animation"> {
  children?: React.ReactNode
}

function TypingTag({ children, color = "info", variant = "soft", size = "md", className, ...props }: TypingTagProps) {
  return (
    <Tag color={color} variant={variant} size={size} className={cn("gap-[3px]", className)} {...props}>
      <TagDot className="gf-typing-dot" />
      <TagDot className="gf-typing-dot" />
      <TagDot className="gf-typing-dot" />
      {children && <span className="ml-1">{children}</span>}
    </Tag>
  )
}

// ── BadgeCount ────────────────────────────────────────────────────
export type BadgeCountSize = "dot" | "sm" | "md"

export interface BadgeCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: BadgeCountSize
  /** Override the danger fill with any CSS color. */
  bgColor?: string
}

const COUNT_SIZE: Record<BadgeCountSize, string> = {
  dot: "w-2 h-2 min-w-0 p-0",
  sm:  "min-w-4 h-4 text-[9.5px] px-[5px]",
  md:  "min-w-5 h-5 text-[11px] px-[6px]",
}

function BadgeCount({
  size = "md",
  bgColor,
  children,
  className,
  style,
  ...props
}: BadgeCountProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold tabular-nums",
        // Default tone as classes so it follows the app's theme; the inline
        // style below only appears when a caller passes an explicit color.
        "bg-danger text-danger-foreground",
        COUNT_SIZE[size],
        className,
      )}
      style={bgColor ? { backgroundColor: bgColor, ...style } : style}
      {...props}
    >
      {size !== "dot" && children}
    </span>
  )
}

// ── AvatarChip ────────────────────────────────────────────────────
export interface AvatarChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  initials: string
  avatarBg?: string
  avatarColor?: string
  onDismiss?: () => void
  children: React.ReactNode
}

function AvatarChip({
  initials,
  avatarBg,
  avatarColor,
  onDismiss,
  children,
  className,
  style,
  ...props
}: AvatarChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[26px] pl-0.5 pr-2.5 rounded-full text-[11.5px] font-bold",
        "bg-primary-soft text-primary-soft-foreground",
        className,
      )}
      style={style}
      {...props}
    >
      <span
        className={cn(
          "w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[9.5px] font-extrabold shrink-0",
          "bg-primary text-primary-foreground",
        )}
        style={{ backgroundColor: avatarBg, color: avatarColor }}
      >
        {initials}
      </span>
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity [&_svg]:size-3 [&_svg]:stroke-current"
          aria-label="Remove"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  )
}

export { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip }

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ── Gofive semantic color tokens ───────────────────────────────────
export type TagColor = "success" | "warn" | "danger" | "info" | "neutral"
export type TagVariant = "soft" | "solid" | "outline"
export type TagSize = "sm" | "md" | "lg"
export type TagAnimation = "spin" | "shimmer" | "pop"

// Theme tokens with the literal palette as fallback, so a standalone
// `shadcn add badge` (no theme.json) still renders, while an app that has the
// Gofive theme gets brand-aware + dark-mode-correct chips for free.
const PALETTE: Record<TagColor, { text: string; softBg: string; solidBg: string; solidText: string }> = {
  success: { text: "var(--success-soft-foreground, #0D6A4B)", softBg: "var(--success-soft, #DBF3E8)", solidBg: "var(--success, #1DA577)", solidText: "var(--success-foreground, #ffffff)" },
  warn:    { text: "var(--warning-soft-foreground, #7A5800)", softBg: "var(--warning-soft, #FFF4BF)", solidBg: "var(--warning, #F9D423)", solidText: "var(--warning-foreground, #212121)" },
  danger:  { text: "var(--danger-soft-foreground, #8A1F0A)",  softBg: "var(--danger-soft, #FDE0D6)",  solidBg: "var(--danger, #D93A1A)",  solidText: "var(--danger-foreground, #ffffff)" },
  info:    { text: "var(--info-soft-foreground, #063F89)",    softBg: "var(--info-soft, #DDEAFC)",    solidBg: "var(--info, #0A66E0)",    solidText: "var(--info-foreground, #ffffff)" },
  // solidText stays literal white: the neutral chip keeps its dark ink fill in
  // both themes, so --background would put near-black text on it in dark.
  neutral: { text: "var(--muted-foreground, #52525F)",        softBg: "var(--muted, #ECECF0)",        solidBg: "var(--gf-fg-2, #3B3B44)", solidText: "#ffffff" },
}

function resolveColorStyle(color: TagColor, variant: TagVariant): React.CSSProperties {
  const c = PALETTE[color]
  if (variant === "solid") return { color: c.solidText, backgroundColor: c.solidBg }
  if (variant === "outline") return { color: c.text, backgroundColor: "transparent", border: "1px solid currentColor" }
  return { color: c.text, backgroundColor: c.softBg }
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
          square ? "rounded-[5px]" : "rounded-full",
          animation === "spin" && "gf-tag-spin",
          animation === "shimmer" && "gf-tag-shimmer",
          animation === "pop" && "gf-tag-pop",
          className,
        )}
        style={{ ...resolveColorStyle(color, variant), ...style }}
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
  bgColor?: string
}

const COUNT_SIZE: Record<BadgeCountSize, string> = {
  dot: "w-2 h-2 min-w-0 p-0",
  sm:  "min-w-4 h-4 text-[9.5px] px-[5px]",
  md:  "min-w-5 h-5 text-[11px] px-[6px]",
}

function BadgeCount({
  size = "md",
  bgColor = "#D93A1A",
  children,
  className,
  style,
  ...props
}: BadgeCountProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold tabular-nums",
        COUNT_SIZE[size],
        className,
      )}
      style={{ color: "#ffffff", backgroundColor: bgColor, ...style }}
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
  avatarBg = "#F88411",
  avatarColor = "#ffffff",
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
        className,
      )}
      style={{ backgroundColor: "#FFE9CC", color: "#7A3A00", ...style }}
      {...props}
    >
      <span
        className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[9.5px] font-extrabold shrink-0"
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

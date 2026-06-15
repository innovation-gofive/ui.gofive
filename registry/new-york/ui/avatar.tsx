"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

// ── Sizes (from ref: xs 24 / sm 32 / md 40 / lg 56 / xl 72) ─────────
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

const SIZE: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-[72px] text-2xl",
}

// ── GoFive status palette (semantic) ────────────────────────────────
export type AvatarStatus = "online" | "away" | "busy" | "offline"

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: "#1DA577",
  away: "#F9D423",
  busy: "#D93A1A",
  offline: "#6A6A7C",
}

// Status dot size scales with the avatar size.
const STATUS_SIZE: Record<AvatarSize, string> = {
  xs: "size-2 border",
  sm: "size-2.5 border-2",
  md: "size-3 border-2",
  lg: "size-3.5 border-2",
  xl: "size-4 border-[3px]",
}

// ── Avatar context (shares size with sub-components) ────────────────
const AvatarContext = React.createContext<AvatarSize>("md")

// ── Avatar ──────────────────────────────────────────────────────────
export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  size?: AvatarSize
  status?: AvatarStatus
}

function Avatar({
  className,
  size = "md",
  status,
  children,
  ...props
}: AvatarProps) {
  return (
    <AvatarContext.Provider value={size}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full",
          SIZE[size],
          className,
        )}
        {...props}
      >
        <span className="flex size-full items-center justify-center overflow-hidden rounded-full">
          {children}
        </span>
        {status && <AvatarStatusDot status={status} size={size} />}
      </AvatarPrimitive.Root>
    </AvatarContext.Provider>
  )
}

// ── AvatarImage ─────────────────────────────────────────────────────
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("size-full rounded-full object-cover", className)}
      {...props}
    />
  )
}

// ── AvatarFallback ──────────────────────────────────────────────────
export interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  /** Solid background color (e.g. "#116DFC"). Ignored if `gradient` is set. */
  color?: string
  /** CSS gradient string, e.g. "linear-gradient(135deg,#7B88E8,#E677B7)". */
  gradient?: string
}

function AvatarFallback({
  className,
  color,
  gradient,
  style,
  ...props
}: AvatarFallbackProps) {
  const background = gradient ?? color
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full font-semibold leading-none",
        !background && "bg-muted text-muted-foreground",
        background && "text-white",
        className,
      )}
      style={background ? { background, ...style } : style}
      {...props}
    />
  )
}

// ── AvatarStatusDot ─────────────────────────────────────────────────
export interface AvatarStatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: AvatarStatus
  size?: AvatarSize
}

function AvatarStatusDot({
  status,
  size,
  className,
  style,
  ...props
}: AvatarStatusDotProps) {
  const ctx = React.useContext(AvatarContext)
  const s = size ?? ctx
  return (
    <span
      data-slot="avatar-status"
      aria-label={status}
      className={cn(
        "absolute bottom-0 right-0 rounded-full border-card",
        STATUS_SIZE[s],
        className,
      )}
      style={{ backgroundColor: STATUS_COLOR[status], borderColor: "var(--card)", ...style }}
      {...props}
    />
  )
}

// ── AvatarGroup ─────────────────────────────────────────────────────
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shared size applied to children and the overflow chip. */
  size?: AvatarSize
  /** Max avatars to show before collapsing into a +N chip. */
  max?: number
}

const OVERLAP: Record<AvatarSize, string> = {
  xs: "-ml-2",
  sm: "-ml-2.5",
  md: "-ml-2.5",
  lg: "-ml-3.5",
  xl: "-ml-4",
}

function AvatarGroup({
  size = "md",
  max,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = React.Children.toArray(children)
  const visible =
    max != null && items.length > max ? items.slice(0, max) : items
  const overflow = items.length - visible.length

  return (
    <AvatarContext.Provider value={size}>
      <div
        data-slot="avatar-group"
        className={cn("flex items-center", className)}
        {...props}
      >
        {visible.map((child, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full ring-2 ring-card",
              i > 0 && OVERLAP[size],
            )}
          >
            {React.isValidElement(child)
              ? React.cloneElement(
                  child as React.ReactElement<AvatarProps>,
                  { size },
                )
              : child}
          </div>
        ))}
        {overflow > 0 && (
          <div className={cn("rounded-full ring-2 ring-card", OVERLAP[size])}>
            <Avatar size={size}>
              <AvatarFallback>+{overflow}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </AvatarContext.Provider>
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatusDot,
  AvatarGroup,
}

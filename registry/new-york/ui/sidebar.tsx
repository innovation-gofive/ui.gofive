"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Sidebar (full navigation rail) ─────────────────────────────────
// A vertical navigation panel — brand, section labels, items with icons,
// optional count badges, and nested sub-items. Pair with a collapsed
// <SidebarRail> for the icon-only view.
function Sidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex w-60 flex-col gap-0.5 rounded-xl border border-border bg-background p-2.5",
        className,
      )}
      {...props}
    />
  )
}

export interface SidebarBrandProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Square logo mark (letter, glyph, or image). */
  logo?: React.ReactNode
}

function SidebarBrand({ logo, className, children, ...props }: SidebarBrandProps) {
  return (
    <div
      data-slot="sidebar-brand"
      className={cn("mb-1.5 flex items-center gap-2 p-2.5", className)}
      {...props}
    >
      {logo != null && (
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
          {logo}
        </span>
      )}
      <span className="text-sm font-bold text-foreground">{children}</span>
    </div>
  )
}

function SidebarLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-label"
      className={cn(
        "px-2.5 pt-2.5 pb-1 text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  )
}

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  /** Trailing count badge, e.g. unread or pending items. */
  badge?: React.ReactNode
  active?: boolean
}

function SidebarItem({
  icon,
  badge,
  active,
  className,
  children,
  ...props
}: SidebarItemProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground/80 transition-colors hover:bg-muted",
        "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="flex-1 truncate text-left">{children}</span>
      {badge != null && (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-danger/10 px-1.5 text-[10.5px] font-semibold text-danger">
          {badge}
        </span>
      )}
    </button>
  )
}

function SidebarSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-sub"
      className={cn("mt-0.5 ml-[30px] flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

export interface SidebarSubItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function SidebarSubItem({
  active,
  className,
  ...props
}: SidebarSubItemProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-sub-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-foreground/80 transition-colors hover:bg-muted",
        "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary",
        className,
      )}
      {...props}
    />
  )
}

// ── SidebarRail (collapsed icon-only view) ─────────────────────────
function SidebarRail({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      data-slot="sidebar-rail"
      className={cn(
        "flex w-16 flex-col items-center gap-1 rounded-xl border border-border bg-background p-2",
        className,
      )}
      {...props}
    />
  )
}

export interface SidebarRailItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function SidebarRailItem({
  active,
  className,
  ...props
}: SidebarRailItemProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-rail-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex size-11 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-muted",
        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        "[&_svg]:size-[18px]",
        className,
      )}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-separator"
      className={cn("my-1 h-px w-7 self-center bg-border", className)}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarBrand,
  SidebarLabel,
  SidebarItem,
  SidebarSub,
  SidebarSubItem,
  SidebarRail,
  SidebarRailItem,
  SidebarSeparator,
}

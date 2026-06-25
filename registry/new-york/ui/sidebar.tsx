"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Sidebar context ────────────────────────────────────────────────
// Shares the collapsed state down to brand, labels, and items so the whole
// panel can animate between the full view and an icon-only rail as one tree —
// a smooth width transition instead of swapping in a separate <SidebarRail>.
type SidebarContextValue = { collapsed: boolean }

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
})

function useSidebar() {
  return React.useContext(SidebarContext)
}

// ── Sidebar (full navigation rail) ─────────────────────────────────
// A vertical navigation panel — brand, section labels, items with icons,
// optional count badges, and nested sub-items. Set `collapsed` to animate it
// down to an icon-only rail; or pair with the standalone <SidebarRail>.
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Collapse to an icon-only rail — width and labels animate. */
  collapsed?: boolean
}

function Sidebar({ collapsed = false, className, ...props }: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        data-slot="sidebar"
        data-collapsed={collapsed}
        className={cn(
          // `relative`: when collapsed, item/brand labels become `sr-only`
          // (position: absolute). Without a positioned ancestor they resolve
          // against the document, and their static positions down a tall,
          // scrolling rail inflate the page height — phantom blank scroll below
          // the layout. Making the aside their containing block lets its own
          // overflow clip them instead.
          "relative flex flex-col gap-0.5 overflow-x-hidden rounded-xl border border-border bg-background p-2.5",
          "transition-[width,padding] duration-300 ease-in-out",
          // Collapsed → match <SidebarRail>: centered icon column, tighter gap.
          collapsed ? "w-16 items-center gap-1 p-2" : "w-60",
          className,
        )}
        {...props}
      />
    </SidebarContext.Provider>
  )
}

export interface SidebarBrandProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Square logo mark (letter, glyph, or image). */
  logo?: React.ReactNode
}

function SidebarBrand({ logo, className, children, ...props }: SidebarBrandProps) {
  const { collapsed } = useSidebar()
  return (
    <div
      data-slot="sidebar-brand"
      className={cn("mb-1.5 flex items-center gap-2 p-2.5", collapsed && "p-2", className)}
      {...props}
    >
      {logo != null && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
          {logo}
        </span>
      )}
      {/* sr-only when collapsed: removed from flow so the logo centers, but the
          name stays in the a11y tree. */}
      <span
        className={cn(
          "truncate text-sm font-bold text-foreground",
          collapsed && "sr-only",
        )}
      >
        {children}
      </span>
    </div>
  )
}

function SidebarLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar()
  return (
    <div
      data-slot="sidebar-label"
      className={cn(
        "shrink-0 overflow-hidden text-[10.5px] font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase transition-all duration-200",
        // shrink-0: with overflow-hidden a flex item's min-height is 0, so in a
        // tall, scrolling sidebar flexbox would otherwise collapse the label
        // (and its collapsed divider) to 0px.
        // Collapsed → the section label becomes a centered divider between
        // groups, like <SidebarSeparator>. first:hidden drops the leading one
        // so there's no stray line at the top of the rail.
        collapsed
          ? "my-1 h-px w-7 self-center bg-border p-0 first:hidden"
          : "max-h-8 px-2.5 pt-2.5 pb-1",
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
  const { collapsed } = useSidebar()
  const button = (
    <button
      type="button"
      data-slot="sidebar-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full shrink-0 items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 text-[13px] text-foreground/80 transition-all duration-300 hover:bg-muted",
        "data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        // Collapsed → a centered icon square matching <SidebarRailItem>.
        collapsed && "size-11 justify-center gap-0 rounded-[10px] p-0 [&_svg]:size-[18px]",
        className,
      )}
      {...props}
    >
      {icon}
      {/* sr-only when collapsed keeps the label as the button's accessible name. */}
      <span
        className={cn(
          "flex-1 truncate text-left transition-opacity duration-200",
          collapsed && "sr-only",
        )}
      >
        {children}
      </span>
      {badge != null && (
        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-danger/10 px-1.5 text-[10.5px] font-semibold text-danger transition-opacity duration-200",
            collapsed && "hidden",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )

  // Collapsed → the label is sr-only, so surface it (and any badge) as a
  // tooltip on hover/focus. Expanded items show their label inline already.
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
          {children}
          {badge != null && (
            <span className="inline-flex items-center justify-center rounded-full bg-background/20 px-1.5 text-[10.5px] font-semibold">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

function SidebarSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar()
  return (
    <div
      data-slot="sidebar-sub"
      className={cn(
        "mt-0.5 ml-[30px] flex max-h-96 flex-col gap-0.5 overflow-hidden transition-all duration-200",
        collapsed && "mt-0 ml-0 max-h-0 w-0 opacity-0",
        className,
      )}
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
        "flex size-11 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-muted",
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
      className={cn("my-1 h-px w-7 shrink-0 self-center bg-border", className)}
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
  useSidebar,
}

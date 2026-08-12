"use client"

import * as React from "react"
import { Circle, CircleDot } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// ── Sidebar context ────────────────────────────────────────────────
// Shares the collapsed state down to brand, labels, and items so the whole
// panel can animate between the full view and an icon-only rail as one tree —
// a smooth width transition instead of swapping in a separate <SidebarRail>.
type SidebarContextValue = {
  collapsed: boolean
  pinnable: boolean
  togglePin: () => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  pinnable: false,
  togglePin: () => {},
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
  /** Initial state when `collapsed` is left uncontrolled. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Show the pin toggle in <SidebarBrand> — pinned keeps the panel expanded. */
  pinnable?: boolean
}

function Sidebar({
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  pinnable = false,
  className,
  ...props
}: SidebarProps) {
  const [internal, setInternal] = React.useState(defaultCollapsed)
  const collapsed = collapsedProp ?? internal

  const togglePin = () => {
    if (collapsedProp === undefined) setInternal(!collapsed)
    onCollapsedChange?.(!collapsed)
  }

  return (
    <SidebarContext.Provider value={{ collapsed, pinnable, togglePin }}>
      <aside
        data-slot="sidebar"
        data-collapsed={collapsed}
        className={cn(
          // Labels stay in the flow and fade out; `overflow-x-hidden` clips
          // them as the rail narrows. Nothing switches to `display`/`sr-only`
          // mid-animation, so width is the only thing that moves.
          "relative flex flex-col gap-0.5 overflow-x-hidden rounded-xl border border-border bg-background p-2.5",
          "transition-[width] duration-300 ease-in-out",
          // Padding is constant across states: p-2.5 leaves exactly 44px of
          // content in the 64px rail, which is the collapsed item size.
          collapsed ? "w-16 gap-1" : "w-60",
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
  const { collapsed, pinnable, togglePin } = useSidebar()

  const mark = logo != null && (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
      {logo}
    </span>
  )

  return (
    <div
      data-slot="sidebar-brand"
      className={cn("mb-1.5 flex items-center gap-2 p-2.5", className)}
      {...props}
    >
      {/* Collapsed hides the pin button, so the mark takes over as the way back. */}
      {pinnable && collapsed ? (
        <button
          type="button"
          onClick={togglePin}
          aria-label="Expand sidebar"
          className="outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-lg"
        >
          {mark}
        </button>
      ) : (
        mark
      )}
      <span
        className={cn(
          "flex-1 truncate text-sm font-bold text-foreground transition-opacity duration-200",
          collapsed && "opacity-0",
        )}
      >
        {children}
      </span>
      {pinnable && (
        <button
          type="button"
          data-slot="sidebar-pin"
          onClick={togglePin}
          aria-pressed={!collapsed}
          aria-label={collapsed ? "Pin sidebar open" : "Unpin sidebar"}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-opacity duration-200 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "[&_svg]:size-[18px]",
            collapsed && "pointer-events-none opacity-0",
          )}
        >
          {collapsed ? <Circle /> : <CircleDot />}
        </button>
      )}
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
  const [tipOpen, setTipOpen] = React.useState(false)
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
        // Collapsed → an icon square matching <SidebarRailItem>. Padding stays
        // put so the icon never moves — only the box around it shrinks.
        collapsed && "size-11 rounded-[10px] [&_svg]:size-[18px]",
        className,
      )}
      {...props}
    >
      {icon}
      {/* Faded, not `sr-only` — staying in the flow keeps the label as the
          button's accessible name and lets the rail clip it instead of the
          text vanishing on the first frame of the width animation. */}
      <span
        className={cn(
          "flex-1 truncate text-left transition-opacity duration-200",
          collapsed && "opacity-0",
        )}
      >
        {children}
      </span>
      {badge != null && (
        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center justify-center rounded-full bg-danger/10 px-1.5 text-[10.5px] font-semibold text-danger transition-opacity duration-200",
            collapsed && "opacity-0",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )

  // Always wrapped, never conditionally: mounting the Tooltip only when
  // collapsed replaces the button's DOM node the instant the state flips, which
  // kills the in-flight width/opacity transitions. Kept controlled so it can
  // only open once the label is actually hidden.
  return (
    <Tooltip open={collapsed && tipOpen} onOpenChange={setTipOpen}>
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

// Bottom-anchored group (Reports, Help, …). Needs the sidebar to fill its
// container's height for `mt-auto` to push it down.
function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-0.5 pt-2", className)}
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
  SidebarFooter,
  SidebarRail,
  SidebarRailItem,
  SidebarSeparator,
  useSidebar,
}

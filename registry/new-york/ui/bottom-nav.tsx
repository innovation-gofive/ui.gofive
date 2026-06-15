"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── BottomNav (mobile bottom navigation) ───────────────────────────
// A mobile-style bottom navigation bar. The active item tints its label
// and shows a soft primary pill behind the icon.
//   <BottomNav>
//     <BottomNavItem icon={<Home />} label="Home" active />
//     <BottomNavItem icon={<Search />} label="Search" />
//   </BottomNav>
function BottomNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "flex gap-0.5 rounded-2xl border border-border bg-background p-1.5",
        className,
      )}
      {...props}
    />
  )
}

export interface BottomNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: React.ReactNode
  active?: boolean
}

function BottomNavItem({
  icon,
  label,
  active,
  className,
  ...props
}: BottomNavItemProps) {
  return (
    <button
      type="button"
      data-slot="bottom-nav-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10.5px] font-medium text-muted-foreground transition-colors",
        "data-[active=true]:text-primary",
        className,
      )}
      {...props}
    >
      <span
        data-slot="bottom-nav-icon"
        className={cn(
          "flex items-center justify-center rounded-full px-3.5 py-1 transition-colors [&_svg]:size-[18px]",
          active && "bg-primary/10",
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

export { BottomNav, BottomNavItem }

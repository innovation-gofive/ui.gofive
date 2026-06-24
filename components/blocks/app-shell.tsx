"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar"
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarIconButton,
  NavbarNav,
  NavbarSpacer,
} from "@/registry/new-york/ui/navbar"

// ── App shell primitives ─────────────────────────────────────────────
// Shared scaffolding for the workspace blocks: a full-height shell that
// hosts the Gofive Sidebar on the left and a content column on the right.
// Set `brand` to re-theme the whole subtree via data-brand (see globals.css).

export function AppShell({
  brand,
  className,
  children,
}: {
  brand?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-brand={brand}
      className={cn(
        "flex h-screen overflow-hidden bg-muted/40 text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AppMain({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-1 flex-col">{children}</div>
}

// Top application bar, built from the Gofive Navbar component. Floats with
// the same gutter as the sidebar. `leading` sits before the title (e.g. a
// collapse toggle); `nav` renders secondary NavbarItem links; `children`
// drops extra actions in before the bell + avatar.
export function AppTopbar({
  title,
  leading,
  nav,
  search = true,
  initials = "AD",
  avatarColor = "#F88411",
  children,
}: {
  title: React.ReactNode
  leading?: React.ReactNode
  nav?: React.ReactNode
  search?: boolean
  initials?: string
  avatarColor?: string
  children?: React.ReactNode
}) {
  return (
    <div className="shrink-0 px-4 pt-3 sm:px-6">
      <Navbar>
        {leading}
        <NavbarBrand>{title}</NavbarBrand>
        {nav && <NavbarNav className="ml-2 hidden md:flex">{nav}</NavbarNav>}
        <NavbarSpacer />
        <NavbarActions className="gap-2">
          {search && (
            <div className="hidden items-center gap-2 rounded-lg border bg-muted/40 px-2.5 py-1.5 text-sm text-muted-foreground sm:flex">
              <Search className="size-4 shrink-0" />
              <input
                placeholder="Search…"
                className="w-28 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none lg:w-40"
              />
            </div>
          )}
          {children}
          <NavbarIconButton aria-label="Notifications" className="relative">
            <Bell />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-danger" />
          </NavbarIconButton>
          <Avatar size="sm">
            <AvatarFallback color={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
        </NavbarActions>
      </Navbar>
    </div>
  )
}

export function AppContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <main className={cn("flex-1 overflow-auto px-4 pb-6 pt-4 sm:px-6", className)}>
      {children}
    </main>
  )
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

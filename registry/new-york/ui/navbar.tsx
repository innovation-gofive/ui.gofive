"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ── Navbar (top application bar) ───────────────────────────────────
// A horizontal app header — brand, primary nav, a flexible spacer, and
// trailing actions (search, icon buttons, avatar). Compose the parts:
//   <Navbar>
//     <NavbarBrand>Gofive</NavbarBrand>
//     <NavbarNav>…<NavbarItem active>Workspace</NavbarItem>…</NavbarNav>
//     <NavbarSpacer />
//     <NavbarActions>…</NavbarActions>
//   </Navbar>
function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      data-slot="navbar"
      className={cn(
        "flex h-[52px] items-center gap-4 rounded-xl border border-border bg-background px-4",
        className,
      )}
      {...props}
    />
  )
}

function NavbarBrand({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navbar-brand"
      className={cn(
        "mr-2 flex items-center gap-2 text-base font-bold text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function NavbarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-slot="navbar-nav"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

export interface NavbarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

function NavbarItem({ active, className, ...props }: NavbarItemProps) {
  return (
    <button
      type="button"
      data-slot="navbar-item"
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        "data-[active=true]:font-semibold data-[active=true]:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function NavbarSpacer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="navbar-spacer" className={cn("flex-1", className)} {...props} />
}

function NavbarActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navbar-actions"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

// An icon-only action button sized to sit comfortably in the bar.
function NavbarIconButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-slot="navbar-icon-button"
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-[18px]",
        className,
      )}
      {...props}
    />
  )
}

export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarSpacer,
  NavbarActions,
  NavbarIconButton,
}

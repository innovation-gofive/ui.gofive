"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { mainNav, isMainNavActive } from "@/lib/docs-config"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Navbar,
  NavbarNav,
  NavbarItem,
  NavbarSpacer,
  NavbarIconButton,
} from "@/registry/new-york/ui/navbar"

export function SiteHeader({
  sidebarCollapsed = false,
  onToggleSidebar,
}: {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    // Floating Gofive Navbar inside the docs app shell — mirrors AppTopbar's
    // gutter (components/blocks/app-shell.tsx). The shell is h-svh/overflow-hidden,
    // so this shrink-0 bar stays put while the content column below scrolls.
    <div className="shrink-0 px-4 pt-3 sm:px-6 lg:px-8">
      <Navbar>
        {/* Collapse toggle + separator, leading the bar. Re-adds the sidebar
            toggle that the Gofive sidebar dropped (desktop sidebar only). */}
        <div className="hidden items-center gap-2 md:flex">
          <NavbarIconButton
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={sidebarCollapsed}
            onClick={onToggleSidebar}
          >
            {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </NavbarIconButton>
          <div className="h-6 w-px shrink-0 bg-border" aria-hidden />
        </div>
        <NavbarNav className="hidden md:flex">
          {mainNav.map((item) => (
            // TODO(gofive-migrate): NavbarItem is a <button>, not a Next <Link>.
            // router.push() loses prefetch, open-in-new-tab, and right-click —
            // restore a real link if those matter.
            <NavbarItem
              key={item.href}
              active={isMainNavActive(item.href, pathname)}
              onClick={() => router.push(item.href)}
            >
              {item.title}
            </NavbarItem>
          ))}
        </NavbarNav>
        <NavbarSpacer />
        <ThemeToggle />
      </Navbar>
    </div>
  )
}

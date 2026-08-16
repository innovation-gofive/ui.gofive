"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { mainNav, isMainNavActive } from "@/lib/docs-config"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Navbar,
  NavbarNav,
  NavbarItem,
  NavbarSpacer,
  NavbarActions,
} from "@/registry/new-york/ui/navbar"

export function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    // Gofive Navbar is a floating card — keep it pinned with a sticky gutter so
    // it stays put as the home page scrolls (no app-shell here to do it).
    <div className="sticky top-0 z-50 w-full bg-background/80 px-4 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Navbar>
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
          <NavbarActions>
            <ThemeToggle />
            {/* Button has no Gofive equivalent — kept as-is (shadcn). */}
            <Button asChild size="sm">
              <Link href="/docs/introduction">Get Started</Link>
            </Button>
          </NavbarActions>
        </Navbar>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarRailItem,
  SidebarSeparator,
} from "@/registry/new-york/ui/sidebar"
import { docsNav } from "@/lib/docs-config"

export function AppSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  // Collapsed → Gofive's icon-only SidebarRail (its built-in collapsed view),
  // not hiding the panel. Groups are split by a SidebarSeparator; labels drop.
  if (collapsed) {
    return (
      <SidebarRail className="m-3 h-[calc(100svh-1.5rem)] shrink-0 overflow-y-auto [scrollbar-width:none] max-md:hidden [&::-webkit-scrollbar]:hidden">
        {docsNav.map((group, gi) => (
          <React.Fragment key={group.title}>
            {gi > 0 && <SidebarSeparator />}
            {group.items.map(item => (
              // TODO(gofive-migrate): SidebarRailItem is a <button> (no <Link>) and
              // has no rich tooltip — falling back to the native title attr.
              <SidebarRailItem
                key={item.href}
                active={pathname === item.href}
                aria-label={item.title}
                title={item.title}
                onClick={() => router.push(item.href)}
              >
                {item.icon ? <item.icon /> : null}
              </SidebarRailItem>
            ))}
          </React.Fragment>
        ))}
      </SidebarRail>
    )
  }

  return (
    <Sidebar className="m-3 h-[calc(100svh-1.5rem)] w-64 shrink-0 overflow-y-auto [scrollbar-width:none] max-md:hidden [&::-webkit-scrollbar]:hidden">
      {docsNav.map(group => (
        <div key={group.title} className="flex flex-col gap-0.5">
          <SidebarLabel>{group.title}</SidebarLabel>
          {group.items.map(item => {
            // TODO(gofive-migrate): Gofive's SidebarItem renders a <button>, not an
            // <a>, so navigation goes through router.push instead of the old
            // SidebarMenuButton asChild + next/link. Prefetch, middle-click /
            // open-in-new-tab, and the collapsed-mode hover tooltip are lost.
            return (
              <SidebarItem
                key={item.href}
                icon={item.icon ? <item.icon /> : undefined}
                active={pathname === item.href}
                onClick={() => router.push(item.href)}
              >
                {item.title}
              </SidebarItem>
            )
          })}
        </div>
      ))}
    </Sidebar>
  )
}

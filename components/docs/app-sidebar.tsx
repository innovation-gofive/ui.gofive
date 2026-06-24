"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
} from "@/registry/new-york/ui/sidebar"
import { docsNav } from "@/lib/docs-config"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sidebar className="m-3 h-[calc(100svh-1.5rem)] w-64 shrink-0 overflow-y-auto max-md:hidden">
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

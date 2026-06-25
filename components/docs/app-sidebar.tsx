"use client"

import { Fragment } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
} from "@/registry/new-york/ui/sidebar"
import { docsNav } from "@/lib/docs-config"

export function AppSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  // A single <Sidebar collapsed> tree animates the width/labels between the
  // full panel and an icon-only rail — smoother than swapping in <SidebarRail>.
  // Labels are rendered as direct children (not wrapped per group) so that, when
  // collapsed, each becomes the divider between groups and `first:hidden` can
  // drop the leading one. The native title keeps a tooltip when narrow.
  return (
    <Sidebar
      collapsed={collapsed}
      className="m-3 h-[calc(100svh-1.5rem)] shrink-0 overflow-y-auto [scrollbar-width:none] max-md:hidden [&::-webkit-scrollbar]:hidden"
    >
      {docsNav.map(group => (
        <Fragment key={group.title}>
          <SidebarLabel>{group.title}</SidebarLabel>
          {group.items.map(item => {
            // TODO(gofive-migrate): Gofive's SidebarItem renders a <button>, not an
            // <a>, so navigation goes through router.push instead of the old
            // SidebarMenuButton asChild + next/link. Prefetch and middle-click /
            // open-in-new-tab are lost.
            return (
              <SidebarItem
                key={item.href}
                icon={item.icon ? <item.icon /> : undefined}
                active={pathname === item.href}
                title={item.title}
                onClick={() => router.push(item.href)}
              >
                {item.title}
              </SidebarItem>
            )
          })}
        </Fragment>
      ))}
    </Sidebar>
  )
}

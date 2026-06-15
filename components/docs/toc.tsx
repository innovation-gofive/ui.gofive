"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
  title: string
  href: string
  depth?: number
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const ids = items.map(i => i.href.replace("#", ""))
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(`#${visible[0].target.id}`)
      },
      { rootMargin: "0% 0% -75% 0%", threshold: 1 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <div className="sticky top-20 -mt-2 hidden h-[calc(100svh-5rem)] overflow-y-auto pl-2 text-sm xl:block">
      <p className="mb-3 font-medium">On This Page</p>
      <ul className="flex flex-col gap-2 border-l">
        {items.map(item => (
          <li key={item.href} style={{ paddingLeft: (item.depth ?? 0) * 12 }}>
            <a
              href={item.href}
              className={cn(
                "-ml-px block border-l border-transparent pl-3 text-[13px] leading-tight transition-colors",
                active === item.href
                  ? "border-foreground font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

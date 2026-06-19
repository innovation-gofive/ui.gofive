import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/docs-config"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) w-full items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5!" />
      <Link href="/" className="font-bold tracking-tight md:hidden">
        {siteConfig.name}
      </Link>
      <nav className="ml-2 hidden items-center gap-5 text-sm md:flex">
        <Link href="/docs/introduction" className="text-foreground/70 transition-colors hover:text-foreground">
          Docs
        </Link>
        <Link href="/docs/badge" className="text-foreground/70 transition-colors hover:text-foreground">
          Components
        </Link>
      </nav>
    </header>
  )
}

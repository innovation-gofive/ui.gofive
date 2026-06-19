import Link from "next/link"

import { Button } from "@/components/ui/button"

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 lg:px-8">
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link href="/docs/introduction" className="text-foreground/70 transition-colors hover:text-foreground">
            Docs
          </Link>
          <Link href="/docs/badge" className="text-foreground/70 transition-colors hover:text-foreground">
            Components
          </Link>
          <Link href="/docs/colors" className="text-foreground/70 transition-colors hover:text-foreground">
            Theming
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/docs/introduction">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { docsNav, siteConfig } from "@/lib/docs-config"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/docs/code-block"
import { SiteNav } from "@/components/home/site-nav"
import { ComponentShowcase } from "@/components/home/component-showcase"

const componentCount =
  docsNav
    .filter(g => ["Components", "Navigation", "Inputs"].includes(g.title))
    .reduce((n, g) => n + g.items.length, 0)

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col items-center text-center">
            <Link
              href="/docs/agent-skill"
              className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <Sparkles className="size-3.5 text-primary" />
              Built for the Gofive Design System
              <ArrowRight className="size-3.5" />
            </Link>

            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The component layer of the Gofive Design System
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              {siteConfig.name} is a custom shadcn registry — production-ready components,
              fonts, and design tokens you install straight into any project with the shadcn CLI.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/docs/introduction">
                  Get Started
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/docs/badge">Browse Components</Link>
              </Button>
            </div>

            <div className="mt-8 w-full max-w-xl text-left">
              <CodeBlock
                language="bash"
                code={`npx shadcn@latest registry add @gofive=${siteConfig.registryUrl}/r/{name}.json`}
              />
            </div>
          </div>
        </section>

        {/* ── Component showcase ───────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {componentCount}+ components, ready to drop in
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every piece ships with Gofive theming, sizes, and states. Hover to play —
                click through for docs and code.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs/badge">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <ComponentShowcase />
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <p>
            Built by{" "}
            <a target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">
              Innovation & AI Team, Gofive
            </a>
            . Powered by{" "}
            <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">
              shadcn/ui
            </a>
            .
          </p>
          <nav className="flex items-center gap-5">
            <Link href="/docs/introduction" className="transition-colors hover:text-foreground">Docs</Link>
            <Link href="/docs/badge" className="transition-colors hover:text-foreground">Components</Link>
            <Link href="/blocks" className="transition-colors hover:text-foreground">Blocks</Link>
            <Link href="/docs/colors" className="transition-colors hover:text-foreground">Theming</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

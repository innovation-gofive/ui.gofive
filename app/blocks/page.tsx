import Link from "next/link"
import type { Metadata } from "next"

import { blocks } from "@/lib/blocks"
import { siteConfig } from "@/lib/docs-config"
import { SiteNav } from "@/components/home/site-nav"
import { BlockPreview } from "@/components/blocks/block-preview"

export const metadata: Metadata = {
  title: "Blocks — Gofive Components",
  description:
    "Real workspace screens built from Gofive components — sidebar-led app layouts you can preview full screen and drop into your project.",
}

export default function BlocksPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Blocks</p>
            <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight lg:text-4xl">
              Real workspace screens, built from Gofive components
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Full-page examples that show the components — led by the{" "}
              <Link href="/docs/sidebar" className="font-medium text-foreground underline underline-offset-4">
                Sidebar
              </Link>{" "}
              — composed into production-style app layouts. Each block is themed to a different
              Gofive product. Open any one full screen, or copy the sidebar composition into your app.
            </p>
          </div>

          {/* Quick jump */}
          <nav className="mt-6 flex flex-wrap gap-2">
            {blocks.map((b) => (
              <a
                key={b.slug}
                href={`#${b.slug}`}
                className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                {b.name}
              </a>
            ))}
          </nav>

          <div className="mt-12 flex flex-col gap-16">
            {blocks.map((b) => (
              <BlockPreview
                key={b.slug}
                slug={b.slug}
                name={b.name}
                description={b.description}
                componentsUsed={b.componentsUsed}
                code={b.code}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <p>
            Built by{" "}
            <a href={siteConfig.github} target="_blank" rel="noreferrer" className="font-medium text-foreground underline underline-offset-4">
              Gofive
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
          </nav>
        </div>
      </footer>
    </div>
  )
}

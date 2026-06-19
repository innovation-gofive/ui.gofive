import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DocPage, DocH2 } from "@/components/docs/doc-page"
import { CodeBlock } from "@/components/docs/code-block"
import { docsNav, siteConfig } from "@/lib/docs-config"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Components", href: "#components" },
]

export default function IntroductionPage() {
  const components = docsNav.find(g => g.title === "Components")?.items ?? []

  return (
    <DocPage
      breadcrumb={["Docs", "Introduction"]}
      title="Introduction"
      description={siteConfig.description}
      toc={toc}
    >
      <p className="leading-7 text-muted-foreground">
        GoFive Registry is a custom{" "}
        <a href="https://ui.shadcn.com" className="font-medium text-foreground underline underline-offset-4">shadcn</a>{" "}
        registry — a collection of components, fonts, and design tokens you can install straight
        into any project with the shadcn CLI.
      </p>

      <DocH2 id="installation">Installation</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">Add the GoFive registry to your project once:</p>
      <CodeBlock code={`npx shadcn@latest registry add @gofive=${siteConfig.registryUrl}/r/{name}.json`} className="mt-4" />

      <DocH2 id="components">Components</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">Browse the available components:</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {components.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-accent"
          >
            <span className="font-medium">{item.title}</span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}

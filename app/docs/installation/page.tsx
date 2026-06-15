import { DocPage, DocH2 } from "@/components/docs/doc-page"
import { CodeBlock } from "@/components/docs/code-block"
import { siteConfig } from "@/lib/docs-config"

const toc = [
  { title: "Add the registry", href: "#add-the-registry" },
  { title: "Add a component", href: "#add-a-component" },
]

export default function InstallationPage() {
  return (
    <DocPage
      breadcrumb={["Docs", "Installation"]}
      title="Installation"
      description="How to set up the GoFive registry and install components."
      toc={toc}
    >
      <DocH2 id="add-the-registry">Add the registry</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Register the GoFive namespace in your project. You only need to do this once.
      </p>
      <CodeBlock code={`npx shadcn@latest registry add @gofive=${siteConfig.registryUrl}`} className="mt-4" />

      <DocH2 id="add-a-component">Add a component</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Then install any component from the registry by its name:
      </p>
      <CodeBlock code={`npx shadcn@latest add @gofive/badge`} className="mt-4" />
    </DocPage>
  )
}

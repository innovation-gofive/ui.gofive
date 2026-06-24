import { DocPage, DocH2 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"

const WEIGHTS = [
  { label: "Text", weight: "400" },
  { label: "Medium", weight: "500" },
  { label: "SemiBold", weight: "600" },
  { label: "Bold", weight: "700" },
]

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Weights", href: "#weights" },
]

export default function FontsPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Gofive Font"]}
      title="Gofive Font"
      description="Custom font family — Text (400), Medium (500), SemiBold (600), Bold (700)."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/fonts" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`// app/layout.tsx
import "@/lib/gofive-font.css"

// globals.css
body { font-family: "Gofive", sans-serif; }`}
      />

      <DocH2 id="weights">Weights</DocH2>
      <ComponentPreview>
        <div className="flex flex-wrap items-end gap-8">
          {WEIGHTS.map(({ label, weight }) => (
            <div key={weight} className="flex flex-col gap-1">
              <span className="font-mono text-xs text-muted-foreground">{weight}</span>
              <span className="text-2xl" style={{ fontWeight: weight }}>{label}</span>
            </div>
          ))}
        </div>
      </ComponentPreview>
    </DocPage>
  )
}

import { Typography } from "@/registry/new-york/ui/typography"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const SCALE: { variant: string; tag: string; spec: string; sample: string }[] = [
  { variant: "display", tag: "Display", spec: "40 / 700", sample: "Build what's next" },
  { variant: "h1", tag: "H1", spec: "32 / 700", sample: "Human-first HR, at scale" },
  { variant: "h2", tag: "H2", spec: "24 / 600", sample: "Performance reviews done right" },
  { variant: "h3", tag: "H3", spec: "20 / 600", sample: "Monthly payroll summary" },
  { variant: "body-lg", tag: "Body Lg", spec: "16 / 400", sample: "Larger body copy for emphasis." },
  { variant: "body", tag: "Body", spec: "14 / 400", sample: "Default body — used everywhere in product." },
  { variant: "small", tag: "Small", spec: "12 / 400", sample: "Helper text, table cells, secondary fields." },
  { variant: "caption", tag: "Caption", spec: "10 / 600", sample: "META · LABEL" },
]

const WEIGHTS = [
  { weight: "text", label: "Text", num: "400", use: "Body copy, tables, helper text. Default." },
  { weight: "medium", label: "Medium", num: "500", use: "Field labels, menu items, nav (resting)." },
  { weight: "semibold", label: "Semi Bold", num: "600", use: "Buttons, active nav, card titles, KPI numbers." },
  { weight: "bold", label: "Bold", num: "700", use: "H1/H2, hero numbers, dialog titles." },
] as const

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Type scale", href: "#scale" },
  { title: "Weights", href: "#weights" },
  { title: "Custom element", href: "#custom-element" },
  { title: "API Reference", href: "#api-reference" },
]

export default function TypographyPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Typography"]}
      title="Typography"
      description="The GoFive type scale — Display, H1–H3, Body Lg, Body, Small, and Caption — driven by a single variant-based component with 400 / 500 / 600 / 700 weight overrides."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/typography" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Typography } from "@/components/ui/typography"`}
      />
      <ComponentPreview className="min-h-[120px]">
        <div className="flex flex-col gap-2">
          <Typography variant="h2">Performance reviews done right</Typography>
          <Typography variant="body">
            Default UI size used across most screens — tables, labels, helper text.
          </Typography>
        </div>
      </ComponentPreview>

      <DocH2 id="scale">Type scale</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Eight steps from Display down to Caption. Body (14) is the product default.
      </p>
      <ComponentPreview>
        <div className="flex w-full flex-col gap-4">
          {SCALE.map((s) => (
            <div key={s.variant} className="flex items-baseline gap-4 border-b pb-4 last:border-0 last:pb-0">
              <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                {s.tag}
              </span>
              <Typography variant={s.variant as never} className="flex-1">
                {s.sample}
              </Typography>
              <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {s.spec}
              </span>
            </div>
          ))}
        </div>
      </ComponentPreview>

      <DocH2 id="weights">Weights</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Override any variant&apos;s default weight with the <code>weight</code> prop.
      </p>
      <ComponentPreview>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {WEIGHTS.map((w) => (
            <div key={w.weight} className="flex flex-col gap-1 rounded-lg border p-4">
              <Typography variant="h3" weight={w.weight}>
                {w.label} {w.num}
              </Typography>
              <span className="font-mono text-[11px] text-muted-foreground">font-weight: {w.num}</span>
              <Typography variant="small" className="mt-1">
                {w.use}
              </Typography>
            </div>
          ))}
        </div>
      </ComponentPreview>

      <DocH2 id="custom-element">Custom element</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each variant renders a sensible default tag. Use <code>as</code> to change the element, or{" "}
        <code>asChild</code> to merge the styles onto your own child.
      </p>
      <CodeBlock
        className="mt-4"
        code={`// Render a Display-styled <span>
<Typography variant="display" as="span">Work that matters.</Typography>

// Merge styles onto a Next.js <Link>
<Typography variant="h3" asChild>
  <Link href="/payroll">Monthly payroll summary</Link>
</Typography>`}
      />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-typography">Typography</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Variant-driven text component.</p>
      <PropsTable
        rows={[
          {
            prop: "variant",
            type: '"display" | "h1" | "h2" | "h3" | "body-lg" | "body" | "small" | "caption"',
            default: '"body"',
            desc: "Type scale step — sets size, weight, line-height, and tracking",
          },
          {
            prop: "weight",
            type: '"text" | "medium" | "semibold" | "bold"',
            default: "—",
            desc: "Overrides the variant's default font weight (400 / 500 / 600 / 700)",
          },
          {
            prop: "as",
            type: "ElementType",
            default: "per variant",
            desc: "Render a custom element while keeping variant styles",
          },
          {
            prop: "asChild",
            type: "boolean",
            default: "false",
            desc: "Merge styles onto the single child element via Radix Slot",
          },
        ]}
      />
    </DocPage>
  )
}

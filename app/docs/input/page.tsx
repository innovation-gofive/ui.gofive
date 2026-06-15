"use client"

import { Mail, Search } from "lucide-react"
import { Input, PasswordInput, NumberInput } from "@/registry/new-york/ui/input"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "States", href: "#states", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Underline variant", href: "#underline", depth: 1 },
  { title: "Icons & affixes", href: "#affixes", depth: 1 },
  { title: "Prefix & suffix", href: "#prefix-suffix", depth: 1 },
  { title: "Clearable", href: "#clearable", depth: 1 },
  { title: "Password", href: "#password", depth: 1 },
  { title: "Number stepper", href: "#number", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function InputPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Input"]}
      title="Input"
      description="A card-style text field with states, sizes, variants, leading/trailing icons, prefix/suffix affixes, clearable, plus password reveal and number stepper presets."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/input" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Input, PasswordInput, NumberInput } from "@/components/ui/input"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-sm">
          <Input placeholder="you@example.com" />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="states">States</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drive validation styling with the <code>state</code> prop (<code>&quot;error&quot;</code> or{" "}
        <code>&quot;success&quot;</code>), or with native <code>disabled</code> / <code>readOnly</code>.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-3">
          <Input placeholder="Default" />
          <Input defaultValue="Filled value" />
          <Input state="error" defaultValue="Invalid value" />
          <Input state="success" defaultValue="Looks good" />
          <Input disabled placeholder="Disabled" />
          <Input readOnly defaultValue="Read only" />
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Four heights via <code>inputSize</code>: xs (28px), sm (32px), md (38px), lg (44px).
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-3">
          <Input inputSize="xs" placeholder="Extra small" />
          <Input inputSize="sm" placeholder="Small" />
          <Input inputSize="md" placeholder="Medium (default)" />
          <Input inputSize="lg" placeholder="Large" />
        </div>
      </ComponentPreview>

      <DocH3 id="underline">Underline variant</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A minimal border-bottom style via <code>variant=&quot;underline&quot;</code>.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-4">
          <Input variant="underline" placeholder="Underline" />
          <Input variant="underline" state="error" defaultValue="Invalid" />
          <Input variant="underline" leading={<Search />} placeholder="Search…" />
        </div>
      </ComponentPreview>

      <DocH3 id="affixes">Icons &amp; affixes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass any node to <code>leading</code> / <code>trailing</code> — icons render inside the bordered container.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-3">
          <Input leading={<Mail />} placeholder="you@example.com" />
          <Input leading={<Search />} trailing={<kbd className="text-[11px]">⌘K</kbd>} placeholder="Search…" />
        </div>
      </ComponentPreview>

      <DocH3 id="prefix-suffix">Prefix &amp; suffix</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Static text affixes for URLs, currency, or units.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-3">
          <Input prefix="https://" placeholder="yoursite.com" />
          <Input prefix="฿" suffix="THB" defaultValue="1,990" />
          <Input suffix="kg" defaultValue="68" />
        </div>
      </ComponentPreview>

      <DocH3 id="clearable">Clearable</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>clearable</code> to show an X button that resets the value when it is non-empty.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <Input clearable defaultValue="Clear me" leading={<Search />} />
        </div>
      </ComponentPreview>

      <DocH3 id="password">Password</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>PasswordInput</code> renders a reveal/hide eye toggle on the trailing side.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-md">
          <PasswordInput defaultValue="s3cr3t-pass" />
        </div>
      </ComponentPreview>

      <DocH3 id="number">Number stepper</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>NumberInput</code> right-aligns the value and adds up/down chevron steppers with optional{" "}
        <code>min</code>, <code>max</code>, and <code>step</code>.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-[220px] gap-3">
          <NumberInput defaultValue={3} min={0} max={10} />
          <NumberInput defaultValue={1.5} step={0.5} suffix="kg" />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-input">Input</DocH3>
      <PropsTable
        rows={[
          { prop: "inputSize", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', desc: "Height preset (28 / 32 / 38 / 44px)" },
          { prop: "variant", type: '"filled" | "underline"', default: '"filled"', desc: "Bordered card or border-bottom only" },
          { prop: "state", type: '"error" | "success"', default: "—", desc: "Validation styling (also reads aria-invalid)" },
          { prop: "leading", type: "React.ReactNode", default: "—", desc: "Node rendered before the input (e.g. icon)" },
          { prop: "trailing", type: "React.ReactNode", default: "—", desc: "Node rendered after the input" },
          { prop: "prefix", type: "React.ReactNode", default: "—", desc: "Static text/node before the value" },
          { prop: "suffix", type: "React.ReactNode", default: "—", desc: "Static text/node after the value" },
          { prop: "clearable", type: "boolean", default: "false", desc: "Show a clear (X) button when non-empty" },
          { prop: "value", type: "string", default: "—", desc: "Controlled value" },
          { prop: "defaultValue", type: "string", default: "—", desc: "Initial value when uncontrolled" },
          { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when the value changes" },
          { prop: "containerClassName", type: "string", default: "—", desc: "Classes for the wrapper container" },
          { prop: "...props", type: "React.ComponentProps<\"input\">", default: "—", desc: "Remaining native input props are forwarded" },
        ]}
      />

      <DocH3 id="api-passwordinput">PasswordInput</DocH3>
      <PropsTable
        rows={[
          { prop: "defaultVisible", type: "boolean", default: "false", desc: "Whether the password starts revealed" },
          { prop: "...InputProps", type: "InputProps", default: "—", desc: "All Input props except trailing and type" },
        ]}
      />

      <DocH3 id="api-numberinput">NumberInput</DocH3>
      <PropsTable
        rows={[
          { prop: "value", type: "number", default: "—", desc: "Controlled numeric value" },
          { prop: "defaultValue", type: "number", default: "0", desc: "Initial value when uncontrolled" },
          { prop: "onValueChange", type: "(value: number) => void", default: "—", desc: "Called with the clamped numeric value" },
          { prop: "min", type: "number", default: "—", desc: "Minimum allowed value" },
          { prop: "max", type: "number", default: "—", desc: "Maximum allowed value" },
          { prop: "step", type: "number", default: "1", desc: "Increment / decrement amount" },
          { prop: "...InputProps", type: "InputProps", default: "—", desc: "All Input props except value/type/trailing" },
        ]}
      />
    </DocPage>
  )
}

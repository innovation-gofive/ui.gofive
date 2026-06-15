"use client"

import { OTPInput } from "@/registry/new-york/ui/otp-input"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Default (6 digits)", href: "#default", depth: 1 },
  { title: "4 digits", href: "#four-digits", depth: 1 },
  { title: "Masked", href: "#masked", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function OTPInputPage() {
  return (
    <DocPage
      breadcrumb={["Components", "OTP Input"]}
      title="OTP Input"
      description="A one-time-code input — a row of individual digit cells with full keyboard, paste and autofill support, controllable or uncontrolled."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/otp-input" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { OTPInput } from "@/components/ui/otp-input"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <OTPInput defaultValue="429" />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="default">Default (6 digits)</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Six cells fill left to right. Backspace moves back, paste fills multiple cells, and
        <code> onComplete</code> fires once every cell is filled.
      </p>
      <ComponentPreview>
        <OTPInput defaultValue="42" />
      </ComponentPreview>

      <DocH3 id="four-digits">4 digits</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>length</code> to render a different number of cells.
      </p>
      <ComponentPreview>
        <OTPInput length={4} />
      </ComponentPreview>

      <DocH3 id="masked">Masked</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>mask</code> to render a bullet in place of each character.
      </p>
      <ComponentPreview>
        <OTPInput mask defaultValue="1234" />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-otpinput">OTPInput</DocH3>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "Controlled value" },
          { prop: "defaultValue", type: "string", default: '""', desc: "Initial value when uncontrolled" },
          { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called whenever the value changes" },
          { prop: "length", type: "number", default: "6", desc: "Number of cells to render" },
          { prop: "onComplete", type: "(value: string) => void", default: "—", desc: "Called when every cell is filled" },
          { prop: "mask", type: "boolean", default: "false", desc: "Show • instead of the typed character" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Disable the input" },
          { prop: "inputMode", type: '"numeric" | "text" | ...', default: '"numeric"', desc: "Virtual keyboard hint" },
          { prop: "className", type: "string", default: "—", desc: "Classes on the overlaid input" },
          { prop: "containerClassName", type: "string", default: "—", desc: "Classes on the row container" },
        ]}
      />
    </DocPage>
  )
}

"use client"

import { useState } from "react"
import { Switch } from "@/registry/new-york/ui/switch"
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
  { title: "Label", href: "#label", depth: 1 },
  { title: "On/Off text", href: "#state-label", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Settings list", href: "#settings", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SwitchPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Switch"]}
      title="Switch"
      description="A toggle that switches a single setting on or off — built on Radix with a primary-themed track, a sliding thumb, and sm / md / lg sizes."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/switch" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Switch } from "@/components/ui/switch"`}
      />
      <ComponentPreview
        className="min-h-[100px]"
        code={`<Switch defaultChecked label="Email notifications" />`}
      >
        <Switch defaultChecked label="Email notifications" />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="states">States</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Off, on, and disabled variants.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2.5 text-sm">
            <Switch /> Off
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Switch defaultChecked /> On
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Switch disabled /> Disabled off
          </label>
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Switch disabled defaultChecked /> Disabled on
          </label>
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three track sizes — 28 / 36 / 46 px wide.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2.5 text-[13px]">
            <Switch size="sm" defaultChecked /> Small
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Switch size="md" defaultChecked /> Medium
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Switch size="lg" defaultChecked /> Large
          </label>
        </div>
      </ComponentPreview>

      <DocH3 id="label">Label</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code className="font-mono text-[12px]">label</code> (and an optional{" "}
        <code className="font-mono text-[12px]">description</code>) to render clickable text beside the switch.
      </p>
      <ComponentPreview
        code={`<Switch defaultChecked label="Email notifications" />
<Switch
  label="Two-factor auth"
  description="Protect your account with an extra step"
/>`}
      >
        <div className="flex flex-col gap-5">
          <Switch defaultChecked label="Email notifications" />
          <Switch
            label="Two-factor auth"
            description="Protect your account with an extra step"
          />
        </div>
      </ComponentPreview>

      <DocH3 id="state-label">On/Off text</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code className="font-mono text-[12px]">withStateLabel</code> to show ON/OFF text inside a wider track.
        Customize the words with <code className="font-mono text-[12px]">onLabel</code> /{" "}
        <code className="font-mono text-[12px]">offLabel</code>.
      </p>
      <ComponentPreview
        code={`<Switch withStateLabel />
<Switch withStateLabel defaultChecked />
<Switch withStateLabel onLabel="เปิด" offLabel="ปิด" defaultChecked />`}
      >
        <div className="flex flex-wrap items-center gap-8">
          <Switch withStateLabel />
          <Switch withStateLabel defaultChecked />
          <Switch withStateLabel onLabel="เปิด" offLabel="ปิด" defaultChecked />
        </div>
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Drive the switch from state and read its value.</p>
      <ControlledExample />

      <DocH3 id="settings">Settings list</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A common pattern — switches aligned to the end of each setting row.</p>
      <SettingsExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-switch">Switch</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Wraps Radix <code className="font-mono text-[12px]">Switch.Root</code> — accepts all of its props.
      </p>
      <PropsTable rows={[
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Track dimensions (28 / 36 / 46 px wide)" },
        { prop: "label", type: "ReactNode", default: "—", desc: "Clickable text rendered beside the switch" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Secondary text under the label" },
        { prop: "withStateLabel", type: "boolean", default: "false", desc: "Show ON/OFF text inside a wider track" },
        { prop: "onLabel", type: "string", default: '"ON"', desc: "On text when withStateLabel is set" },
        { prop: "offLabel", type: "string", default: '"OFF"', desc: "Off text when withStateLabel is set" },
        { prop: "checked", type: "boolean", default: "—", desc: "Controlled on/off state" },
        { prop: "defaultChecked", type: "boolean", default: "—", desc: "Initial state when uncontrolled" },
        { prop: "onCheckedChange", type: "(checked: boolean) => void", default: "—", desc: "Fires when the switch is toggled" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Prevents interaction" },
        { prop: "required", type: "boolean", default: "false", desc: "Marks the field as required in a form" },
        { prop: "name", type: "string", default: "—", desc: "Name submitted with the form" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [checked, setChecked] = useState(true)

  return (
    <ComponentPreview>
      <label className="flex items-center gap-2.5 text-sm">
        <Switch checked={checked} onCheckedChange={setChecked} />
        Airplane mode is {checked ? "on" : "off"}
      </label>
    </ComponentPreview>
  )
}

function SettingsExample() {
  const [settings, setSettings] = useState({ email: true, twoFactor: false })

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Email notifications</div>
            <div className="text-xs text-muted-foreground">Receive updates when records change</div>
          </div>
          <Switch
            checked={settings.email}
            onCheckedChange={v => setSettings(s => ({ ...s, email: v }))}
          />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Two-factor auth</div>
            <div className="text-xs text-muted-foreground">Protect your account with an extra step</div>
          </div>
          <Switch
            checked={settings.twoFactor}
            onCheckedChange={v => setSettings(s => ({ ...s, twoFactor: v }))}
          />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between opacity-60">
          <div>
            <div className="text-sm font-medium">Beta features</div>
            <div className="text-xs text-muted-foreground">Only available on Pro plan</div>
          </div>
          <Switch disabled />
        </div>
      </div>
    </ComponentPreview>
  )
}

"use client"

import { useState } from "react"
import { type LucideIcon } from "lucide-react"
import {
  ColorPicker,
  ColorSwatchGrid,
  EmojiPicker,
  EmojiGrid,
  IconPicker,
  IconGrid,
} from "@/registry/new-york/ui/picker"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Color picker", href: "#color", depth: 1 },
  { title: "Emoji picker", href: "#emoji", depth: 1 },
  { title: "Icon picker", href: "#icon", depth: 1 },
  { title: "Inline grids", href: "#inline", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function PickerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Picker"]}
      title="Picker"
      description="Composable color, emoji, and icon pickers — each pairs a trigger with a Popover panel. The color picker has hue/alpha sliders, a hex field and recent swatches; the emoji picker has category tabs and a name/shortcode/unicode preview; the icon picker has outline/solid/duotone style variants — plus raw grids for inline use."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/picker" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ColorPicker, EmojiPicker, IconPicker } from "@/components/ui/picker"`}
      />
      <UsageExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="color">Color picker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Swatch grid plus hue and alpha sliders, an editable hex field with opacity, and a row of recent colors, opened from a trigger swatch.
      </p>
      <ColorExample />

      <DocH3 id="emoji">Emoji picker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Searchable emoji grid with category tabs, scroll-synced headers, and a preview footer showing the name, shortcode, and unicode codepoint.
      </p>
      <EmojiExample />

      <DocH3 id="icon">Icon picker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A curated grid of lucide icons with search and an outline / solid / duotone style switch, in a Popover.
      </p>
      <IconExample />

      <DocH3 id="inline">Inline grids</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Each picker also exports its raw grid so it can be embedded inline without a Popover.
      </p>
      <InlineExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-colorpicker">ColorPicker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Trigger swatch that opens a swatch grid in a Popover.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Selected color (hex). Controlled." },
        { prop: "onChange", type: "(color: string) => void", default: "—", desc: "Called with the chosen hex (8-digit when alpha < 100%)" },
        { prop: "colors", type: "readonly string[]", default: "DEFAULT_COLORS", desc: "Swatch palette to render" },
        { prop: "recent", type: "readonly string[]", default: "DEFAULT_RECENT_COLORS", desc: "Recent swatches; auto-tracked when uncontrolled" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-colorswatchgrid">ColorSwatchGrid</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Raw swatch grid for inline use.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Selected color (hex)" },
        { prop: "onChange", type: "(color: string) => void", default: "—", desc: "Called with the chosen hex color" },
        { prop: "colors", type: "readonly string[]", default: "DEFAULT_COLORS", desc: "Swatch palette to render" },
      ]} />

      <DocH3 id="api-emojipicker">EmojiPicker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Trigger that opens a searchable emoji grid in a Popover.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Currently selected emoji" },
        { prop: "onSelect", type: "(emoji: string) => void", default: "—", desc: "Called with the chosen emoji" },
        { prop: "categories", type: "EmojiCategory[]", default: "DEFAULT_EMOJIS", desc: "Emoji set grouped by category (each has an icon tab)" },
        { prop: "recent", type: "string[]", default: "[]", desc: "Recently used emoji shown under a clock tab" },
        { prop: "meta", type: "EmojiMeta", default: "DEFAULT_EMOJI_META", desc: "Name / shortcode lookup for the preview footer" },
        { prop: "trigger", type: "ReactNode", default: "—", desc: "Custom trigger element" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-emojigrid">EmojiGrid</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Raw searchable emoji grid for inline use.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Currently selected emoji" },
        { prop: "onSelect", type: "(emoji: string) => void", default: "—", desc: "Called with the chosen emoji" },
        { prop: "categories", type: "EmojiCategory[]", default: "DEFAULT_EMOJIS", desc: "Emoji set grouped by category" },
      ]} />

      <DocH3 id="api-iconpicker">IconPicker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Trigger that opens a searchable lucide icon grid in a Popover.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Name of the selected icon" },
        { prop: "onSelect", type: "(name: string, icon: LucideIcon) => void", default: "—", desc: "Called with the icon name and component" },
        { prop: "icons", type: "IconEntry[]", default: "DEFAULT_ICONS", desc: "Curated icon set (~24 lucide icons)" },
        { prop: "variant", type: '"outline" | "solid" | "duotone"', default: '"outline"', desc: "Render style; controlled when set" },
        { prop: "onVariantChange", type: "(variant: IconVariant) => void", default: "—", desc: "Called when the style switch changes" },
        { prop: "iconSize", type: "number", default: "24", desc: "Size shown in the footer label" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-icongrid">IconGrid</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Raw searchable icon grid for inline use.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Name of the selected icon" },
        { prop: "onSelect", type: "(name: string, icon: LucideIcon) => void", default: "—", desc: "Called with the icon name and component" },
        { prop: "icons", type: "IconEntry[]", default: "DEFAULT_ICONS", desc: "Curated icon set" },
      ]} />
    </DocPage>
  )
}

function UsageExample() {
  const [color, setColor] = useState("#116DFC")
  return (
    <ComponentPreview
      className="min-h-[100px]"
      code={`const [color, setColor] = useState("#116DFC")

<ColorPicker value={color} onChange={setColor} />`}
    >
      <ColorPicker value={color} onChange={setColor} />
    </ComponentPreview>
  )
}

function ColorExample() {
  const [color, setColor] = useState("#F02848")
  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <ColorPicker value={color} onChange={setColor} />
        <p className="text-sm text-muted-foreground">
          Selected: <code className="font-mono">{color.toUpperCase()}</code>
        </p>
      </div>
    </ComponentPreview>
  )
}

function EmojiExample() {
  const [emoji, setEmoji] = useState("🎉")
  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <EmojiPicker value={emoji} onSelect={setEmoji} />
        <p className="text-3xl">{emoji}</p>
      </div>
    </ComponentPreview>
  )
}

function IconExample() {
  const [icon, setIcon] = useState("Star")
  const [Icon, setIconComp] = useState<LucideIcon | null>(null)
  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <IconPicker
          value={icon}
          onSelect={(name, comp) => {
            setIcon(name)
            setIconComp(() => comp)
          }}
        />
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {Icon && <Icon className="size-5 text-foreground" />}
          Selected: <code className="font-mono">{icon}</code>
        </p>
      </div>
    </ComponentPreview>
  )
}

function InlineExample() {
  const [color, setColor] = useState("#2DAE4B")
  const [emoji, setEmoji] = useState("😀")
  const [icon, setIcon] = useState("Heart")
  return (
    <ComponentPreview>
      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
        <div className="space-y-3">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Color</span>
          <ColorSwatchGrid value={color} onChange={setColor} />
        </div>
        <div className="space-y-3">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Emoji</span>
          <EmojiGrid value={emoji} onSelect={setEmoji} categories={[
            { label: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🙂"] },
          ]} className="w-full" />
        </div>
        <div className="space-y-3">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Icon</span>
          <IconGrid value={icon} onSelect={(name) => setIcon(name)} className="w-full" />
        </div>
      </div>
    </ComponentPreview>
  )
}

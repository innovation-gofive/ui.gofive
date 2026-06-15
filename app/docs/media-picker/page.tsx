"use client"

import { useState } from "react"
import {
  MediaPicker,
  MediaPanel,
  DEFAULT_MEDIA_ITEMS,
  type MediaItem,
} from "@/registry/new-york/ui/media-picker"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Popover trigger", href: "#popover", depth: 1 },
  { title: "Inline panel", href: "#inline", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function MediaPickerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Media Picker"]}
      title="Media Picker"
      description="A file & media picker with Library, Upload, From URL, and Unsplash tabs — a searchable thumbnail grid with single-select, a drag-and-drop upload zone, a URL field with live preview, and a Cancel / Insert footer."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/media-picker" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { MediaPicker } from "@/components/ui/media-picker"`}
      />
      <UsageExample />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="popover">Popover trigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A trigger button opens the picker in a Popover; Insert closes it and returns the chosen item.
      </p>
      <PopoverExample />

      <DocH3 id="inline">Inline panel</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The raw panel can be embedded directly — inside a Dialog, Sheet, or any custom shell.
      </p>
      <InlineExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-mediapicker">MediaPicker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Trigger that opens the media panel in a Popover.</p>
      <PropsTable rows={[
        { prop: "items", type: "MediaItem[]", default: "DEFAULT_MEDIA_ITEMS", desc: "Library thumbnails" },
        { prop: "unsplashItems", type: "MediaItem[]", default: "DEFAULT_MEDIA_ITEMS", desc: "Items shown under the Unsplash tab" },
        { prop: "value", type: "string", default: "—", desc: "Selected item id" },
        { prop: "defaultTab", type: '"library" | "upload" | "url" | "unsplash"', default: '"library"', desc: "Initially active tab" },
        { prop: "tabs", type: "MediaTab[]", default: "all four", desc: "Which tabs to render" },
        { prop: "onSelect", type: "(item: MediaItem) => void", default: "—", desc: "Called when a thumbnail is highlighted" },
        { prop: "onInsert", type: "(item: MediaItem) => void", default: "—", desc: "Called when Insert is pressed; closes the popover" },
        { prop: "onUpload", type: "(files: FileList) => void", default: "—", desc: "Called with dropped/selected files" },
        { prop: "onAddUrl", type: "(url: string) => void", default: "—", desc: "Called when a URL is added" },
        { prop: "trigger", type: "ReactNode", default: "—", desc: "Custom trigger element" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Popover alignment" },
      ]} />

      <DocH3 id="api-mediapanel">MediaPanel</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The raw panel for inline use, with the same props plus an explicit Cancel handler.</p>
      <PropsTable rows={[
        { prop: "items", type: "MediaItem[]", default: "DEFAULT_MEDIA_ITEMS", desc: "Library thumbnails" },
        { prop: "onInsert", type: "(item: MediaItem) => void", default: "—", desc: "Called when Insert is pressed" },
        { prop: "onCancel", type: "() => void", default: "—", desc: "Called when Cancel is pressed" },
      ]} />

      <DocH3 id="api-mediaitem">MediaItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single library entry.</p>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Unique identifier" },
        { prop: "src", type: "string", default: "—", desc: "Image URL; renders the gradient placeholder when omitted" },
        { prop: "gradient", type: "string", default: "—", desc: "CSS background used as a placeholder tile" },
        { prop: "alt", type: "string", default: "—", desc: "Alt text / searchable label" },
      ]} />
    </DocPage>
  )
}

function UsageExample() {
  const [picked, setPicked] = useState<MediaItem | null>(null)
  return (
    <ComponentPreview
      className="min-h-[100px]"
      code={`const [picked, setPicked] = useState<MediaItem | null>(null)

<MediaPicker onInsert={setPicked} />`}
    >
      <div className="flex flex-col items-center gap-4">
        <MediaPicker onInsert={setPicked} />
        {picked && (
          <span className="text-sm text-muted-foreground">
            Inserted: <code className="font-mono">{picked.id}</code>
          </span>
        )}
      </div>
    </ComponentPreview>
  )
}

function PopoverExample() {
  const [picked, setPicked] = useState<MediaItem | null>(DEFAULT_MEDIA_ITEMS[1])
  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <MediaPicker value={picked?.id} onInsert={setPicked} />
        <div
          className="size-16 rounded-lg border"
          style={
            picked?.src
              ? { backgroundImage: `url(${picked.src})`, backgroundSize: "cover" }
              : { background: picked?.gradient }
          }
        />
      </div>
    </ComponentPreview>
  )
}

function InlineExample() {
  return (
    <ComponentPreview>
      <div className="rounded-xl border bg-popover p-3 shadow-sm">
        <MediaPanel
          onInsert={() => {}}
          onCancel={() => {}}
        />
      </div>
    </ComponentPreview>
  )
}

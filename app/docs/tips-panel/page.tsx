"use client"

import { useState } from "react"
import { Keyboard, Palette, Search, Sparkles, Users } from "lucide-react"
import { TipsPanel, TipsPanelKbd, type TipsPanelTip } from "@/registry/new-york/ui/tips-panel"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Dismissible", href: "#dismissible", depth: 1 },
  { title: "Footer & callbacks", href: "#footer", depth: 1 },
  { title: "Scrolling & columns", href: "#scrolling", depth: 1 },
  { title: "Localized (Thai)", href: "#localized", depth: 1 },
  { title: "Empty", href: "#empty", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const baseTips: TipsPanelTip[] = [
  {
    id: "search",
    icon: Search,
    title: "Search everything",
    description: (
      <>
        Press <TipsPanelKbd>⌘</TipsPanelKbd>
        <TipsPanelKbd>K</TipsPanelKbd> to jump to any page.
      </>
    ),
    action: "Try it",
    doneLabel: "Search enabled",
    primary: true,
  },
  {
    id: "team",
    icon: Users,
    tone: "info",
    title: "Invite your team",
    description: "Share the workspace so everyone sees the same board.",
    action: "Send invites",
  },
  {
    id: "theme",
    icon: Palette,
    title: "Pick a brand",
    description: "Switch the palette at runtime with data-brand.",
    action: "Choose palette",
    doneLabel: "Palette saved",
  },
]

const manyTips: TipsPanelTip[] = Array.from({ length: 12 }, (_, i) => ({
  id: `tip-${i}`,
  icon: i % 2 ? Sparkles : Keyboard,
  tone: i % 3 === 0 ? "info" : "primary",
  title: `Tip number ${i + 1}`,
  description: "A short one-line hint about a handy feature.",
  action: "Got it",
}))

export default function TipsPanelPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Tips Panel"]}
      title="Tips Panel"
      description="A responsive grid of short tip cards, each with an icon, one-line hint and a single action. Tracks completion, supports per-tip and bulk dismissal, and adapts its columns to its own width."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tips-panel" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { TipsPanel, TipsPanelKbd } from "@/components/ui/tips-panel"

<TipsPanel
  title="First steps"
  tips={[
    {
      id: "search",
      icon: Search,
      title: "Search everything",
      description: <>Press <TipsPanelKbd>⌘</TipsPanelKbd><TipsPanelKbd>K</TipsPanelKbd></>,
      action: "Try it",
      doneLabel: "Search enabled",
      onAction: () => openSearch(),
    },
  ]}
/>`}
      />
      <ComponentPreview className="items-start">
        <TipsPanel title="First steps" tips={baseTips} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="dismissible">Dismissible</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>dismissible</code> to show a close button on each tip (revealed on hover, always visible on touch)
        and a dismiss-all button in the header. Done and dismissed are independent.
      </p>
      <DismissibleExample />

      <DocH3 id="footer">Footer & callbacks</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Passing <code>onClose</code> adds a footer with a close button; the parent decides what closing means.
        Each tip&apos;s <code>onAction</code> fires right after it is marked done.
      </p>
      <FooterExample />

      <DocH3 id="scrolling">Scrolling & columns</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Columns follow the panel&apos;s own width via container queries (1, 2 or 3), so it behaves the same in a
        sidebar or a dialog. The body scrolls past <code>maxHeight</code> while the header and footer stay put.
      </p>
      <ComponentPreview className="items-start">
        <div className="grid w-full gap-6">
          <div className="w-80 max-w-full">
            <TipsPanel title="Narrow container" tips={baseTips.slice(0, 2)} />
          </div>
          <TipsPanel title="Many tips" tips={manyTips} maxHeight={260} onClose={() => {}} />
        </div>
      </ComponentPreview>

      <DocH3 id="localized">Localized (Thai)</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is a prop. Pass <code>labels</code> with single translatable patterns and a <code>locale</code> for
        number formatting.
      </p>
      <ComponentPreview className="items-start">
        <TipsPanel
          title="เคล็ดลับ"
          locale="th-TH-u-nu-thai"
          closeLabel="ปิด"
          onClose={() => {}}
          dismissible
          headingLevel={2}
          labels={{
            progress: (done, total) => `เสร็จแล้ว ${done} จาก ${total}`,
            done: "เสร็จแล้ว",
            dismiss: (title) => `ซ่อน "${title}"`,
            dismissAll: "ซ่อนทั้งหมด",
            dismissed: (title) => `ซ่อน "${title}" แล้ว`,
            dismissedAll: "ซ่อนเคล็ดลับทั้งหมดแล้ว",
            empty: "ไม่มีเคล็ดลับ",
          }}
          tips={[
            { id: "a", icon: Search, title: "ค้นหาทุกอย่าง", description: "กด Ctrl+K เพื่อเปิดการค้นหา", action: "ลองเลย", doneLabel: "เปิดใช้งานแล้ว", primary: true },
            { id: "b", icon: Users, tone: "info", title: "เชิญทีมของคุณ", description: "แชร์พื้นที่ทำงานให้ทุกคนเห็นบอร์ดเดียวกัน", action: "ส่งคำเชิญ" },
          ]}
        />
      </ComponentPreview>

      <DocH3 id="empty">Empty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">With no tips the panel shows the <code>empty</code> label.</p>
      <ComponentPreview className="items-start">
        <TipsPanel title="Tips" tips={[]} />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-tips-panel">TipsPanel</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A labelled region (<code>section</code>) named by its title. Extra props spread onto the root.
      </p>
      <PropsTable rows={[
        { prop: "tips", type: "TipsPanelTip[]", default: "—", desc: "Ordered tips to render. Duplicate ids are tolerated but each should be unique" },
        { prop: "title", type: "string", default: '"Tips"', desc: "Heading text and accessible name of the region" },
        { prop: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3", desc: "Heading level of the title" },
        { prop: "dismissible", type: "boolean", default: "false", desc: "Show per-tip dismiss buttons and the header dismiss-all button" },
        { prop: "onDismiss", type: "(id: string) => void", default: "—", desc: "Called with the tip id when one tip is dismissed" },
        { prop: "onDismissAll", type: "() => void", default: "—", desc: "Called once when dismiss-all is pressed" },
        { prop: "onClose", type: "() => void", default: "—", desc: "Renders a footer with a close button. Without it there is no footer" },
        { prop: "closeLabel", type: "string", default: '"Close"', desc: "Footer close button text" },
        { prop: "maxHeight", type: "number | string", default: "420", desc: "Max height of the scrolling body (number = px)" },
        { prop: "locale", type: "string", default: "—", desc: "BCP 47 locale for the counter's number formatting" },
        { prop: "labels", type: "Partial<TipsPanelLabels>", default: "English", desc: "Override the remaining strings (see below)" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes for the root element" },
      ]} />

      <DocH3 id="api-tip">TipsPanelTip</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Identity used to track done and dismissed state" },
        { prop: "title", type: "string", default: "—", desc: "Tile heading" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Short explanation. Line breaks are kept; may contain TipsPanelKbd" },
        { prop: "action", type: "string", default: "—", desc: "Label of the single action button" },
        { prop: "doneLabel", type: "string", default: "labels.done", desc: "Confirmation text shown once the action is taken" },
        { prop: "primary", type: "boolean", default: "false", desc: "High-emphasis action button; use for at most one tip" },
        { prop: "onAction", type: "() => void", default: "—", desc: "Fired right after the tip is marked done. Not awaited and never rolled back" },
        { prop: "icon", type: "LucideIcon", default: "—", desc: "Decorative icon shown in the tile's icon square" },
        { prop: "tone", type: '"primary" | "info"', default: '"primary"', desc: "Soft colour pair of the icon square" },
      ]} />

      <DocH3 id="api-labels">TipsPanelLabels</DocH3>
      <PropsTable rows={[
        { prop: "progress", type: "(done: string, total: string) => string", default: '"{done} of {total} done"', desc: "Counter text; receives locale-formatted numbers and is also announced politely" },
        { prop: "done", type: "string", default: '"Done"', desc: "Default confirmation text" },
        { prop: "dismiss", type: "(title: string) => string", default: '"Dismiss \\"{title}\\""', desc: "Accessible name of a per-tip dismiss button" },
        { prop: "dismissAll", type: "string", default: '"Dismiss all"', desc: "Header dismiss-all button text" },
        { prop: "dismissed", type: "(title: string) => string", default: '"\\"{title}\\" dismissed"', desc: "Polite announcement after a dismissal" },
        { prop: "dismissedAll", type: "string", default: '"All tips dismissed"', desc: "Polite announcement after dismiss-all" },
        { prop: "empty", type: "string", default: '"No tips right now"', desc: "Shown when no tips remain" },
      ]} />

      <DocH3 id="api-kbd">TipsPanelKbd</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Inline keyboard-key chip for descriptions. Accepts every <code>kbd</code> prop.
      </p>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", default: "—", desc: "The key glyph, e.g. ⌘ or Ctrl" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes" },
      ]} />
    </DocPage>
  )
}

function DismissibleExample() {
  const [log, setLog] = useState("Nothing dismissed yet")
  return (
    <ComponentPreview className="items-start">
      <div className="grid w-full gap-3">
        <TipsPanel
          title="First steps"
          tips={baseTips}
          dismissible
          onDismiss={(id) => setLog(`Dismissed "${id}"`)}
          onDismissAll={() => setLog("Dismissed all")}
        />
        <p className="text-sm text-muted-foreground">{log}</p>
      </div>
    </ComponentPreview>
  )
}

function FooterExample() {
  const [closed, setClosed] = useState(false)
  const [actions, setActions] = useState<string[]>([])
  return (
    <ComponentPreview className="items-start">
      <div className="grid w-full gap-3">
        {closed ? (
          <button
            type="button"
            className="justify-self-start text-sm text-primary underline underline-offset-4"
            onClick={() => setClosed(false)}
          >
            Panel closed. Reopen
          </button>
        ) : (
          <TipsPanel
            title="Quick wins"
            onClose={() => setClosed(true)}
            tips={baseTips.map((t) => ({
              ...t,
              onAction: () => setActions((a) => [...a, t.id]),
            }))}
          />
        )}
        <p className="text-sm text-muted-foreground">Actions fired: {actions.join(", ") || "none"}</p>
      </div>
    </ComponentPreview>
  )
}

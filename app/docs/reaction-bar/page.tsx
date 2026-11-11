"use client"

import { useState } from "react"
import {
  ReactionBar,
  type ReactionKey,
  type ReactionRecord,
} from "@/registry/new-york/ui/reaction-bar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Variants", href: "#variants", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Choosing actions", href: "#actions", depth: 1 },
  { title: "Large counts", href: "#large-counts", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "Accessibility", href: "#accessibility" },
  { title: "API Reference", href: "#api-reference" },
]

export default function ReactionBarPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Reaction Bar"]}
      title="Reaction Bar"
      description="A compact set of toggleable social actions with animated counts, compact number formatting, and controlled or uncontrolled state."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/reaction-bar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ReactionBar } from "@/components/ui/reaction-bar"

<ReactionBar
  defaultReactions={{ like: { count: 24, active: true }, comment: { count: 5 } }}
  onReact={(key, state) => save(key, state)}
/>`}
      />
      <ComponentPreview className="min-h-[100px]">
        <ReactionBar
          defaultReactions={{
            like: { count: 24, active: true },
            comment: { count: 5 },
            repost: { count: 2 },
          }}
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>reactions</code> and <code>onReact</code>. A tap only requests the next state; the bar shows
        whatever you hand back, so you can persist first, reject, or update from outside.
      </p>
      <ControlledExample />

      <DocH3 id="variants">Variants</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>pill</code> groups the actions in one floating container; <code>chips</code> renders separate
        bordered chips that wrap freely.
      </p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-4">
          <ReactionBar
            variant="pill"
            defaultReactions={{ like: { count: 128, active: true }, comment: { count: 12 }, repost: { count: 7 } }}
          />
          <ReactionBar
            variant="chips"
            defaultReactions={{ like: { count: 128, active: true }, comment: { count: 12 }, repost: { count: 7 } }}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Buttons are 28 / 36 / 44 px tall. On coarse pointers every size grows to at least 44 px.
      </p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-4">
          <ReactionBar size="sm" defaultReactions={{ like: { count: 9, active: true }, comment: { count: 3 } }} />
          <ReactionBar size="md" defaultReactions={{ like: { count: 9, active: true }, comment: { count: 3 } }} />
          <ReactionBar size="lg" defaultReactions={{ like: { count: 9, active: true }, comment: { count: 3 } }} />
        </div>
      </ComponentPreview>

      <DocH3 id="actions">Choosing actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>actions</code> picks which buttons appear and in what order. Zero counts hide the number and leave
        an icon-only button.
      </p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-4">
          <ReactionBar actions={["like", "share"]} />
          <ReactionBar actions={["share", "repost", "like"]} defaultReactions={{ share: { count: 1 }, repost: { count: 4 } }} />
        </div>
      </ComponentPreview>

      <DocH3 id="large-counts">Large counts</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Counts abbreviate in the visible text; the exact figure appears in a tooltip from 1,000 up and always in the
        accessible name. Tap to watch the digits roll and the slot glide.
      </p>
      <ComponentPreview>
        <ReactionBar
          variant="chips"
          defaultReactions={{
            like: { count: 1299, active: true },
            comment: { count: 12_450 },
            repost: { count: 999_949 },
            share: { count: 2_400_000 },
          }}
        />
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>locale</code> drives number abbreviation, grouping and plural rules; <code>labels</code> replaces every
        string.
      </p>
      <ComponentPreview>
        <ReactionBar
          locale="th"
          labels={{
            group: "ปฏิกิริยา",
            like: { verb: "ถูกใจ", one: "ถูกใจ", other: "ถูกใจ" },
            comment: { verb: "แสดงความคิดเห็น", one: "ความคิดเห็น", other: "ความคิดเห็น" },
            repost: { verb: "โพสต์ซ้ำ", one: "โพสต์ซ้ำ", other: "โพสต์ซ้ำ" },
            share: { verb: "แชร์", one: "แชร์", other: "แชร์" },
          }}
          defaultReactions={{ like: { count: 12_300, active: true }, comment: { count: 48 } }}
        />
      </ComponentPreview>

      <DocH2 id="accessibility">Accessibility</DocH2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>The root is a <code>role=&quot;group&quot;</code> named by <code>labels.group</code>; each action is a real button with <code>aria-pressed</code>.</li>
        <li>The accessible name is the verb plus, when above zero, the exact count and its noun (e.g. &ldquo;Like, 1,299 likes&rdquo;). The visible abbreviated count and icons are hidden from assistive tech.</li>
        <li>An active state is never colour-only: like and comment fill, repost and share thicken their stroke, and the count turns bolder with the tint.</li>
        <li>Pop, roll and width-glide animations switch off under <code>prefers-reduced-motion</code>.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-reaction-bar">ReactionBar</DocH3>
      <PropsTable rows={[
        { prop: "reactions", type: "Partial<Record<ReactionKey, ReactionState>>", default: "—", desc: "Controlled record — pair with onReact. Missing keys read as count 0, inactive" },
        { prop: "defaultReactions", type: "Partial<Record<ReactionKey, ReactionState>>", default: "{}", desc: "Initial record when uncontrolled" },
        { prop: "onReact", type: "(key: ReactionKey, state: { count: number; active: boolean }) => void", default: "—", desc: "Called on every tap with the key and its next state; in controlled mode it is the only way state changes" },
        { prop: "actions", type: "ReactionKey[]", default: '["like","comment","repost","share"]', desc: "Which actions to show, in order. Unknown keys and duplicates are dropped; an empty list renders nothing" },
        { prop: "variant", type: '"pill" | "chips"', default: '"pill"', desc: "One floating container, or separate bordered chips" },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Button height 28 / 36 / 44 px (at least 44 px on coarse pointers)" },
        { prop: "locale", type: "string | string[]", default: '"en"', desc: "BCP 47 locale for compact/exact number formats and plural rules" },
        { prop: "labels", type: "ReactionBarLabels", default: "English", desc: "{ group?, like?, comment?, repost?, share? } where each action is { verb, one, other }" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root group. Other div props are spread onto it too" },
      ]} />
      <DocH3 id="api-reaction-state">ReactionState</DocH3>
      <PropsTable rows={[
        { prop: "count", type: "number", default: "—", desc: "Sanitised to a non-negative whole number; zero hides the count" },
        { prop: "active", type: "boolean", default: "false", desc: "Whether the viewer has toggled the action on; only literal true counts" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [reactions, setReactions] = useState<ReactionRecord>({
    like: { count: 41, active: false },
    comment: { count: 6 },
    repost: { count: 0 },
    share: { count: 3 },
  })
  const [last, setLast] = useState("No taps yet")

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-3">
        <ReactionBar
          reactions={reactions}
          onReact={(key: ReactionKey, state) => {
            setReactions(r => ({ ...r, [key]: state }))
            setLast(`${key} -> ${state.active ? "on" : "off"}, count ${state.count}`)
          }}
        />
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">{last}</p>
      </div>
    </ComponentPreview>
  )
}

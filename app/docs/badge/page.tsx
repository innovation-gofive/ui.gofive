"use client"

import { useState } from "react"
import { Check, Clock, AlertTriangle, X, Sparkles, Play, ArrowRight, Star } from "lucide-react"
import { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip } from "@/registry/new-york/ui/tag-badge"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Soft", href: "#soft", depth: 1 },
  { title: "Solid", href: "#solid", depth: 1 },
  { title: "Animated", href: "#animated", depth: 1 },
  { title: "Counts & badges", href: "#counts", depth: 1 },
  { title: "Action tags", href: "#action", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function BadgePage() {
  return (
    <DocPage
      breadcrumb={["Components", "Tag & Badge"]}
      title="Tag & Badge"
      description="Semantic status tags, count badges, avatar chips, and typing indicators — soft / solid / outline variants with pulse, spin, shimmer, and pop animations."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/badge" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Tag, TagDot, TagIcon, TypingTag, BadgeCount, AvatarChip } from "@/components/ui/tag-badge"`}
      />
      <ComponentPreview
        className="min-h-[100px]"
        code={`<Tag color="success" variant="soft">
  <TagIcon><Check /></TagIcon>Active
</Tag>`}
      >
        <Tag color="success" variant="soft"><TagIcon><Check /></TagIcon>Active</Tag>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="soft">Soft</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Low-emphasis status pills — the default for most UIs.</p>
      <ComponentPreview>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="success" variant="soft"><TagIcon><Check /></TagIcon>Active</Tag>
            <Tag color="warn" variant="soft"><TagIcon><Clock /></TagIcon>Pending</Tag>
            <Tag color="info" variant="soft"><TagIcon><Clock /></TagIcon>In progress</Tag>
            <Tag color="danger" variant="soft"><TagIcon><X /></TagIcon>Rejected</Tag>
            <Tag color="neutral" variant="soft"><TagIcon><Clock /></TagIcon>Draft</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="success" variant="soft"><TagDot />Online</Tag>
            <Tag color="warn" variant="soft"><TagDot />Away</Tag>
            <Tag color="danger" variant="soft"><TagDot />Busy</Tag>
            <Tag color="neutral" variant="soft"><TagDot />Offline</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="success" variant="soft" size="sm"><TagIcon><Check /></TagIcon>SM</Tag>
            <Tag color="success" variant="soft"><TagIcon><Check /></TagIcon>Default</Tag>
            <Tag color="success" variant="soft" size="lg"><TagIcon><Check /></TagIcon>Large</Tag>
            <Tag color="info" variant="soft" square><TagIcon><Clock /></TagIcon>Square</Tag>
            <Tag color="danger" variant="outline"><TagIcon><AlertTriangle /></TagIcon>Outline</Tag>
          </div>
        </div>
      </ComponentPreview>

      <DocH3 id="solid">Solid</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">High-emphasis filled tags for key states.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-2">
          <Tag color="success" variant="solid"><TagIcon><Check /></TagIcon>Approved</Tag>
          <Tag color="warn" variant="solid"><TagIcon><AlertTriangle /></TagIcon>Warning</Tag>
          <Tag color="danger" variant="solid"><TagIcon><X /></TagIcon>Error</Tag>
          <Tag color="info" variant="solid"><TagIcon><Sparkles /></TagIcon>New</Tag>
          <Tag color="neutral" variant="solid"><TagIcon><Clock /></TagIcon>Archived</Tag>
        </div>
      </ComponentPreview>

      <DocH3 id="animated">Animated</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Pulse, spin, shimmer, pop, and typing animations.</p>
      <ComponentPreview>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="danger" variant="soft"><TagDot pulse />Live</Tag>
            <Tag color="success" variant="soft"><TagDot pulse />Online</Tag>
            <Tag color="danger" variant="solid"><TagDot pulse />Recording</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="info" variant="soft" animation="spin"><TagIcon><Clock /></TagIcon>Syncing…</Tag>
            <Tag color="neutral" variant="outline" animation="spin"><TagIcon><Clock /></TagIcon>Processing</Tag>
            <Tag color="success" variant="solid" animation="spin"><TagIcon><Check /></TagIcon>Saving</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="info" variant="solid" animation="shimmer"><TagIcon><Sparkles /></TagIcon>NEW</Tag>
            <Tag color="warn" variant="solid" animation="shimmer"><TagIcon><Star /></TagIcon>Featured</Tag>
            <Tag color="danger" variant="solid" animation="shimmer"><TagIcon><Play /></TagIcon>Live now</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag color="success" variant="solid" animation="pop"><TagIcon><Check /></TagIcon>Just saved</Tag>
            <Tag color="warn" variant="soft" animation="pop"><TagIcon><AlertTriangle /></TagIcon>Updated</Tag>
            <TypingTag color="info">Somchai is typing</TypingTag>
          </div>
        </div>
      </ComponentPreview>

      <DocH3 id="counts">Counts &amp; badges</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Notification counts and dismissible avatar chips.</p>
      <CountsExample />

      <DocH3 id="action">Action tags</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Interactive tags with directional icons.</p>
      <ComponentPreview>
        <div className="flex flex-wrap items-center gap-2">
          <Tag color="info" variant="outline">Continue<TagIcon><ArrowRight /></TagIcon></Tag>
          <Tag color="success" variant="solid">Mark done<TagIcon><Check /></TagIcon></Tag>
          <Tag color="danger" variant="soft">Undo<TagIcon style={{ transform: "scaleX(-1)" }}><ArrowRight /></TagIcon></Tag>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-tag">Tag</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Main pill-shaped status tag.</p>
      <PropsTable rows={[
        { prop: "color", type: '"success" | "warn" | "danger" | "info" | "neutral"', default: '"neutral"', desc: "Semantic color intent" },
        { prop: "variant", type: '"soft" | "solid" | "outline"', default: '"soft"', desc: "soft = low-emphasis · solid = high-emphasis · outline = subtle" },
        { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "Height and font size (18 / 22 / 26 px)" },
        { prop: "square", type: "boolean", default: "false", desc: "Rounded-square shape instead of pill" },
        { prop: "animation", type: '"spin" | "shimmer" | "pop"', default: "—", desc: "spin rotates TagIcon · shimmer sweeps a highlight · pop is a scale-in entrance" },
      ]} />

      <DocH3 id="api-tagdot">TagDot</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Filled circle that inherits currentColor — use inside Tag.</p>
      <PropsTable rows={[
        { prop: "pulse", type: "boolean", default: "false", desc: "Pulsing ring animation — use for live / active states" },
      ]} />

      <DocH3 id="api-typingtag">TypingTag</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Three-dot animated typing indicator.</p>
      <PropsTable rows={[
        { prop: "color", type: "TagColor", default: '"info"', desc: "Same color options as Tag" },
        { prop: "variant", type: "TagVariant", default: '"soft"', desc: "Same variant options as Tag" },
        { prop: "size", type: "TagSize", default: '"md"', desc: "Same size options as Tag" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Optional label displayed after the dots" },
      ]} />

      <DocH3 id="api-badgecount">BadgeCount</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Circular notification count badge.</p>
      <PropsTable rows={[
        { prop: "size", type: '"dot" | "sm" | "md"', default: '"md"', desc: "dot = 8 px indicator with no text · sm = 16 px · md = 20 px" },
        { prop: "bgColor", type: "string", default: '"#D93A1A"', desc: "Background color — any CSS color value" },
      ]} />

      <DocH3 id="api-avatarchip">AvatarChip</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Avatar + label chip — used in multi-select and filter tags.</p>
      <PropsTable rows={[
        { prop: "initials", type: "string", default: "—", desc: "1–2 letter abbreviation shown in the avatar circle" },
        { prop: "avatarBg", type: "string", default: '"#F88411"', desc: "Avatar circle background color" },
        { prop: "avatarColor", type: "string", default: '"#ffffff"', desc: "Avatar circle text color" },
        { prop: "onDismiss", type: "() => void", default: "—", desc: "If provided, renders an × button that calls this handler" },
        { prop: "style", type: "CSSProperties", default: "—", desc: "Override chip background and text color" },
      ]} />
    </DocPage>
  )
}

function CountsExample() {
  const [chips, setChips] = useState(["AS", "NK", "PC"])

  return (
    <ComponentPreview>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <BadgeCount size="dot" />
          <BadgeCount size="sm">3</BadgeCount>
          <BadgeCount>12</BadgeCount>
          <BadgeCount bgColor="#1DA577">42</BadgeCount>
          <BadgeCount bgColor="#0A66E0">99+</BadgeCount>
          <BadgeCount bgColor="#F88411">NEW</BadgeCount>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {chips.includes("AS") && (
            <AvatarChip initials="AS" onDismiss={() => setChips(c => c.filter(x => x !== "AS"))}>
              Anong Srisuk
            </AvatarChip>
          )}
          {chips.includes("NK") && (
            <AvatarChip
              initials="NK"
              avatarBg="#0A66E0"
              style={{ backgroundColor: "#DDEAFC", color: "#063F89" }}
              onDismiss={() => setChips(c => c.filter(x => x !== "NK"))}
            >
              Nirut K.
            </AvatarChip>
          )}
          {chips.includes("PC") && (
            <AvatarChip
              initials="PC"
              avatarBg="#1DA577"
              style={{ backgroundColor: "#DBF3E8", color: "#0D6A4B" }}
              onDismiss={() => setChips(c => c.filter(x => x !== "PC"))}
            >
              Prapa C.
            </AvatarChip>
          )}
          {chips.length < 3 && (
            <button
              className="text-[13px] text-muted-foreground underline underline-offset-2"
              onClick={() => setChips(["AS", "NK", "PC"])}
            >
              reset
            </button>
          )}
        </div>
      </div>
    </ComponentPreview>
  )
}

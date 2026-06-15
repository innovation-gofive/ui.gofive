"use client"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "@/registry/new-york/ui/avatar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "Fallback colors", href: "#fallback", depth: 1 },
  { title: "Status", href: "#status", depth: 1 },
  { title: "Group", href: "#group", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function AvatarPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Avatar"]}
      title="Avatar"
      description="User avatars built on Radix — image with graceful fallback, five sizes, semantic status dots (online / away / busy / offline), solid or gradient fallback backgrounds, and an overlapping group with +N overflow."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/avatar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"`}
      />
      <ComponentPreview
        className="min-h-[100px]"
        code={`<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="CN" />
  <AvatarFallback color="#116DFC">CN</AvatarFallback>
</Avatar>`}
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="CN" />
          <AvatarFallback color="#116DFC">CN</AvatarFallback>
        </Avatar>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Five sizes — 24 / 32 / 40 / 56 / 72 px.</p>
      <ComponentPreview
        code={`<Avatar size="xs"><AvatarFallback color="#F05B2F">AS</AvatarFallback></Avatar>
<Avatar size="sm"><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback color="#5E5EED">SJ</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback color="#EB1C26">MP</AvatarFallback></Avatar>`}
      >
        <div className="flex items-center gap-3.5">
          <Avatar size="xs"><AvatarFallback color="#F05B2F">AS</AvatarFallback></Avatar>
          <Avatar size="sm"><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
          <Avatar size="md"><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback color="#5E5EED">SJ</AvatarFallback></Avatar>
          <Avatar size="xl"><AvatarFallback color="#EB1C26">MP</AvatarFallback></Avatar>
        </div>
      </ComponentPreview>

      <DocH3 id="fallback">Fallback colors</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Solid or gradient backgrounds when no image is available.</p>
      <ComponentPreview
        code={`<Avatar size="lg"><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
<Avatar size="lg">
  <AvatarFallback gradient="linear-gradient(135deg,#7B88E8,#E677B7)">SJ</AvatarFallback>
</Avatar>
<Avatar size="lg"><AvatarFallback>JD</AvatarFallback></Avatar>`}
      >
        <div className="flex items-center gap-3.5">
          <Avatar size="lg"><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback gradient="linear-gradient(135deg,#7B88E8,#E677B7)">SJ</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback gradient="linear-gradient(135deg,#00C291,#0A66E0)">PC</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>JD</AvatarFallback></Avatar>
        </div>
      </ComponentPreview>

      <DocH3 id="status">Status</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Semantic presence dots — online, away, busy, offline.</p>
      <ComponentPreview
        code={`<Avatar size="lg" status="online"><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
<Avatar size="lg" status="away"><AvatarFallback color="#F9D423">AW</AvatarFallback></Avatar>
<Avatar size="lg" status="busy"><AvatarFallback color="#EB1C26">BZ</AvatarFallback></Avatar>
<Avatar size="lg" status="offline"><AvatarFallback color="#6A6A7C">OF</AvatarFallback></Avatar>`}
      >
        <div className="flex items-center gap-3.5">
          <Avatar size="lg" status="online"><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
          <Avatar size="lg" status="away"><AvatarFallback color="#F9D423">AW</AvatarFallback></Avatar>
          <Avatar size="lg" status="busy"><AvatarFallback color="#EB1C26">BZ</AvatarFallback></Avatar>
          <Avatar size="lg" status="offline"><AvatarFallback color="#6A6A7C">OF</AvatarFallback></Avatar>
        </div>
      </ComponentPreview>

      <DocH3 id="group">Group</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Overlapping stack with a +N overflow chip via the <code className="font-mono text-[13px]">max</code> prop.</p>
      <ComponentPreview
        code={`<AvatarGroup max={4}>
  <Avatar><AvatarFallback color="#F05B2F">AS</AvatarFallback></Avatar>
  <Avatar><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
  <Avatar><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
  <Avatar><AvatarFallback color="#5E5EED">SJ</AvatarFallback></Avatar>
  <Avatar><AvatarFallback color="#EB1C26">MP</AvatarFallback></Avatar>
  <Avatar><AvatarFallback color="#F88411">RT</AvatarFallback></Avatar>
</AvatarGroup>`}
      >
        <AvatarGroup max={4}>
          <Avatar><AvatarFallback color="#F05B2F">AS</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#116DFC">NK</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#00C291">PC</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#5E5EED">SJ</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#EB1C26">MP</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#F88411">RT</AvatarFallback></Avatar>
        </AvatarGroup>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-avatar">Avatar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Root container — wraps Radix Avatar.Root. Extends all its props.</p>
      <PropsTable rows={[
        { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', desc: "Diameter — 24 / 32 / 40 / 56 / 72 px" },
        { prop: "status", type: '"online" | "away" | "busy" | "offline"', default: "—", desc: "Renders a semantic presence dot at the bottom-right" },
        { prop: "children", type: "ReactNode", default: "—", desc: "AvatarImage and AvatarFallback" },
      ]} />

      <DocH3 id="api-avatarimage">AvatarImage</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Image layer — wraps Radix Avatar.Image. Hidden automatically while loading or on error.</p>
      <PropsTable rows={[
        { prop: "src", type: "string", default: "—", desc: "Image URL" },
        { prop: "alt", type: "string", default: "—", desc: "Alternative text for the image" },
      ]} />

      <DocH3 id="api-avatarfallback">AvatarFallback</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Shown when the image is missing or fails — typically initials.</p>
      <PropsTable rows={[
        { prop: "color", type: "string", default: "—", desc: "Solid background color (any CSS color). White text applied automatically" },
        { prop: "gradient", type: "string", default: "—", desc: "CSS gradient background, e.g. linear-gradient(135deg,#7B88E8,#E677B7). Overrides color" },
        { prop: "delayMs", type: "number", default: "—", desc: "Radix delay before the fallback appears, to avoid a flash" },
      ]} />

      <DocH3 id="api-avatargroup">AvatarGroup</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Overlapping stack of avatars with an optional overflow chip.</p>
      <PropsTable rows={[
        { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', desc: "Applied to every child Avatar and the +N chip" },
        { prop: "max", type: "number", default: "—", desc: "Show this many avatars, then collapse the rest into a +N chip" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Avatar elements to stack" },
      ]} />
    </DocPage>
  )
}

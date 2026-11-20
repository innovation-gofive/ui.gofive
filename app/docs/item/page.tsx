"use client"

import { ChevronRight, Globe, KeyRound, Trash2 } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemMeta,
  ItemTitle,
} from "@/registry/new-york/ui/item"
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import { Card, CardContent } from "@/registry/new-york/ui/card"
import { Tag } from "@/registry/new-york/ui/tag-badge"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Link rows", href: "#links", depth: 1 },
  { title: "Media and actions", href: "#media", depth: 1 },
  { title: "Sizes", href: "#sizes", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const links = [
  { id: "1", active: true, expires: "30 Nov 2026", by: "nattaya@gofive.co.th" },
  { id: "2", active: false, expires: "12 Oct 2026", by: "a.very.long.email.address.for.truncation@subsidiary.gofive.co.th" },
]

const sites = [
  { slug: "quarterly-report", title: "Quarterly report 2026 Q3", status: "Live", meta: "Updated 2 hours ago · 14 deployments" },
  { slug: "onboarding", title: "Onboarding handbook for new engineers joining the platform team in Bangkok", status: "Draft", meta: "Updated yesterday · 3 deployments" },
]

const members = [
  { name: "Nattaya Suwan", initials: "NS", email: "nattaya@gofive.co.th", role: "Owner" },
  { name: "Krit Chaiyaporn", initials: "KC", email: "krit@gofive.co.th", role: "Editor" },
]

export default function ItemPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Item"]}
      title="Item"
      description="A list row with optional leading media, title, description, meta lines and trailing actions, plus an ItemGroup that renders the rows as a divided list that sits flush inside a Card."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/item" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Item, ItemGroup, ItemContent, ItemTitle, ItemMeta, ItemActions } from "@/components/ui/item"

<ItemGroup aria-label="Share links">
  {links.map((l) => (
    <Item key={l.id} size="sm">
      <ItemContent>
        <ItemTitle><Tag color={l.active ? "success" : "neutral"} size="sm">{l.state}</Tag></ItemTitle>
        <ItemMeta>Expires {l.expires}</ItemMeta>
        <ItemMeta>{l.createdBy}</ItemMeta>
      </ItemContent>
      <ItemActions><Button variant="outline" size="sm">Revoke</Button></ItemActions>
    </Item>
  ))}
</ItemGroup>`}
      />
      <ComponentPreview className="min-h-[160px]">
        <Card className="w-full max-w-md">
          <CardContent>
            <ItemGroup aria-label="Share links">
              {links.map((l) => (
                <Item key={l.id} size="sm">
                  <ItemContent>
                    <ItemTitle>
                      <Tag color={l.active ? "success" : "neutral"} size="sm">
                        {l.active ? "Active" : "Expired"}
                      </Tag>
                    </ItemTitle>
                    <ItemMeta>Expires {l.expires}</ItemMeta>
                    <ItemMeta>{l.by}</ItemMeta>
                  </ItemContent>
                  {l.active && (
                    <ItemActions>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </ItemActions>
                  )}
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="links">Link rows</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>asChild</code> renders the row as your link, with a hover state and focus ring. Inside a group it is
        still wrapped in an <code>&lt;li&gt;</code>. Bare title text truncates; badges beside it keep their size.
      </p>
      <ComponentPreview>
        <Card className="w-full max-w-md">
          <CardContent>
            <ItemGroup aria-label="Sites">
              {sites.map((s) => (
                <Item key={s.slug} asChild>
                  <a href={`#${s.slug}`}>
                    <ItemMedia>
                      <Globe />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {s.title}
                        <Tag color={s.status === "Live" ? "success" : "neutral"} size="sm">
                          {s.status}
                        </Tag>
                      </ItemTitle>
                      <ItemMeta>{s.meta}</ItemMeta>
                    </ItemContent>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </a>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </ComponentPreview>

      <DocH3 id="media">Media and actions</DocH3>
      <ComponentPreview>
        <Card className="w-full max-w-md">
          <CardContent>
            <ItemGroup aria-label="Members">
              {members.map((m) => (
                <Item key={m.email}>
                  <ItemMedia variant="avatar">
                    <Avatar size="sm">
                      <AvatarFallback>{m.initials}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{m.name}</ItemTitle>
                    <ItemMeta>{m.email}</ItemMeta>
                  </ItemContent>
                  <ItemActions>
                    <Tag size="sm">{m.role}</Tag>
                    <Button variant="ghost" size="icon" aria-label={`Remove ${m.name}`}>
                      <Trash2 />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </ComponentPreview>

      <DocH3 id="sizes">Sizes</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>size=&quot;sm&quot;</code> for dense lists, <code>md</code> (default) otherwise. Standalone items render a
        plain <code>&lt;div&gt;</code>; <code>divided={"{false}"}</code> drops the hairlines.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-md gap-4">
          <Item size="sm">
            <ItemMedia>
              <KeyRound />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>CI token · GitHub Actions</ItemTitle>
              <ItemDescription>Deploys on push to main. Last used 5 minutes ago from 203.0.113.42.</ItemDescription>
            </ItemContent>
          </Item>
          <ItemGroup divided={false} aria-label="Plain list">
            <Item size="sm"><ItemContent><ItemTitle>First</ItemTitle></ItemContent></Item>
            <Item size="sm"><ItemContent><ItemTitle>Second</ItemTitle></ItemContent></Item>
          </ItemGroup>
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-item-group">ItemGroup</DocH3>
      <PropsTable
        rows={[
          { prop: "divided", type: "boolean", default: "true", desc: "Hairline between rows" },
          { prop: "aria-label", type: "string", default: "—", desc: "Names the list" },
          { prop: "...props", type: 'ComponentProps<"ul">', default: "—", desc: 'Rendered as <ul role="list">' },
        ]}
      />
      <DocH3 id="api-item">Item</DocH3>
      <PropsTable
        rows={[
          { prop: "size", type: '"sm" | "md"', default: '"md"', desc: "Row padding (py-2 / py-3)" },
          { prop: "asChild", type: "boolean", default: "false", desc: "Render as the child element (e.g. <a>) with hover and focus styles" },
          { prop: "...props", type: 'ComponentProps<"div">', default: "—", desc: "Spread on the row; wrapped in <li> inside ItemGroup" },
        ]}
      />
      <DocH3 id="api-slots">Slots</DocH3>
      <PropsTable
        rows={[
          { prop: "ItemMedia", type: 'variant?: "icon" | "avatar"', default: '"icon"', desc: "Leading media; icon gets a muted tile and is aria-hidden" },
          { prop: "ItemContent", type: "div", default: "—", desc: "Flexible middle column (min-w-0)" },
          { prop: "ItemTitle", type: "div", default: "—", desc: "Bare text truncates; elements beside it keep their size" },
          { prop: "ItemDescription", type: "p", default: "—", desc: "Muted, clamped to two lines" },
          { prop: "ItemMeta", type: "div", default: "—", desc: "Repeatable xs muted line; truncates" },
          { prop: "ItemActions", type: "div", default: "—", desc: "Trailing controls; never shrink" },
        ]}
      />
    </DocPage>
  )
}

"use client"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetBody,
} from "@/registry/new-york/ui/sheet"
import { Tag } from "@/registry/new-york/ui/tag-badge"
import { Button } from "@/registry/new-york/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Side drawer", href: "#drawer", depth: 1 },
  { title: "Sides", href: "#sides", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function SheetPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Sheet"]}
      title="Sheet"
      description="A panel that slides in from the edge of the screen — built on the dialog primitive, ideal for secondary panes, detail views, and contextual actions."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/sheet" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetBody,
} from "@/components/ui/sheet"`}
      />
      <CodeBlock
        className="mt-4"
        code={`<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    <SheetBody>Content</SheetBody>
    <SheetFooter>
      <SheetClose asChild>
        <Button>Save</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
      />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="drawer">Side drawer</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A right-aligned secondary pane with a bordered header, scrollable body,
        and a footer action row.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <DrawerExample />
      </ComponentPreview>

      <DocH3 id="sides">Sides</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code className="font-mono text-[12px]">side</code> to slide the sheet
        in from any edge.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <SidesExample />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-content">SheetContent</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The sliding panel rendered in a portal over the overlay.
      </p>
      <PropsTable rows={[
        { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', desc: "Edge the sheet slides in from" },
        { prop: "showCloseButton", type: "boolean", default: "true", desc: "Render the top-right close (×) button" },
        { prop: "className", type: "string", default: "—", desc: "Override width, height, and layout" },
        { prop: "onEscapeKeyDown", type: "(e: KeyboardEvent) => void", default: "—", desc: "Called when the escape key is pressed" },
        { prop: "onInteractOutside", type: "(e: Event) => void", default: "—", desc: "Called on pointer or focus interaction outside the content" },
      ]} />

      <DocH3 id="api-parts">SheetHeader · SheetBody · SheetFooter · SheetTitle · SheetDescription · SheetClose</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Layout and accessibility slots. SheetClose closes the sheet when
        activated — use{" "}
        <code className="font-mono text-[12px]">asChild</code> to wrap a Button.
      </p>
      <PropsTable rows={[
        { prop: "SheetHeader", type: "div", default: "—", desc: "Bordered title region" },
        { prop: "SheetBody", type: "div", default: "—", desc: "Scrollable content region (flex-1)" },
        { prop: "SheetFooter", type: "div", default: "—", desc: "Bordered action row pinned to the bottom" },
        { prop: "SheetTitle", type: "Radix Title", default: "—", desc: "Accessible heading announced to screen readers" },
        { prop: "SheetDescription", type: "Radix Description", default: "—", desc: "Supporting text linked via aria-describedby" },
        { prop: "SheetClose", type: "Radix Close", default: "—", desc: "Closes the sheet; supports asChild" },
      ]} />
    </DocPage>
  )
}

function DrawerExample() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">View task</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-[420px]">
        <SheetHeader>
          <SheetTitle>Task details</SheetTitle>
          <SheetDescription className="sr-only">
            Details for the selected task
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="mb-2.5 text-base font-semibold text-foreground">
            Revise onboarding email templates
          </div>
          <dl className="grid grid-cols-[90px_1fr] gap-x-4 gap-y-2.5 text-[12.5px]">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Tag color="warn" variant="soft" size="sm">
                In progress
              </Tag>
            </dd>
            <dt className="text-muted-foreground">Assignee</dt>
            <dd>Ploy Kittisak</dd>
            <dt className="text-muted-foreground">Due</dt>
            <dd>Apr 18, 2025</dd>
            <dt className="text-muted-foreground">Priority</dt>
            <dd>High</dd>
          </dl>
          <p className="mt-3.5 leading-relaxed">
            Rewrite the day-1 and day-30 welcome emails to match the new brand
            voice. Include the updated benefits summary and remove references to
            the legacy portal.
          </p>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const SIDES = ["top", "right", "bottom", "left"] as const

function SidesExample() {
  return (
    <div className="flex flex-wrap gap-2">
      {SIDES.map((s) => (
        <Sheet key={s}>
          <SheetTrigger asChild>
            <Button variant="outline">{s}</Button>
          </SheetTrigger>
          <SheetContent side={s}>
            <SheetHeader>
              <SheetTitle>Sheet from {s}</SheetTitle>
              <SheetDescription>
                This panel slid in from the {s} edge of the screen.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Done</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}

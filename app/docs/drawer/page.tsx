"use client"

import { CreditCard, Download, MessageSquare, Trash2 } from "lucide-react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/registry/new-york/ui/drawer"
import { Button } from "@/registry/new-york/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"
import { cn } from "@/lib/utils"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Action sheet", href: "#action-sheet", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function DrawerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Drawer"]}
      title="Drawer"
      description="A bottom sheet with a drag handle, built on Vaul — drag-to-dismiss interaction for mobile-style action menus and contextual options."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/drawer" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"`}
      />
      <CodeBlock
        className="mt-4"
        code={`<Drawer>
  <DrawerTrigger asChild>
    <Button>Open</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    {/* content */}
  </DrawerContent>
</Drawer>`}
      />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="action-sheet">Action sheet</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A mobile-style bottom sheet with a centered header and a list of actions.
        Drag the handle down or tap outside to dismiss.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <ActionSheetExample />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-root">Drawer</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Root container, forwarded to Vaul. Controls open state and direction.
      </p>
      <PropsTable rows={[
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the open state changes" },
        { prop: "direction", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', desc: "Edge the drawer slides in from" },
        { prop: "shouldScaleBackground", type: "boolean", default: "false", desc: "Scale the page behind the drawer (iOS style)" },
      ]} />

      <DocH3 id="api-parts">DrawerContent · DrawerHeader · DrawerFooter · DrawerTitle · DrawerDescription · DrawerClose</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Layout and accessibility slots. DrawerContent renders the drag handle for
        bottom drawers automatically.
      </p>
      <PropsTable rows={[
        { prop: "DrawerContent", type: "Vaul Content", default: "—", desc: "The sliding panel; shows a drag handle when direction is bottom" },
        { prop: "DrawerHeader", type: "div", default: "—", desc: "Title region (centered on mobile)" },
        { prop: "DrawerFooter", type: "div", default: "—", desc: "Action row pinned to the bottom" },
        { prop: "DrawerTitle", type: "Vaul Title", default: "—", desc: "Accessible heading announced to screen readers" },
        { prop: "DrawerDescription", type: "Vaul Description", default: "—", desc: "Supporting text linked via aria-describedby" },
        { prop: "DrawerClose", type: "Vaul Close", default: "—", desc: "Closes the drawer; supports asChild" },
      ]} />
    </DocPage>
  )
}

const ACTIONS = [
  { icon: Download, label: "Download PDF" },
  { icon: MessageSquare, label: "Send reminder" },
  { icon: CreditCard, label: "Record payment" },
  { icon: Trash2, label: "Void invoice", danger: true },
]

function ActionSheetExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Invoice actions</Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-w-[420px] data-[vaul-drawer-direction=bottom]:mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle>Invoice #INV-2024-0412</DrawerTitle>
          <DrawerDescription>฿ 137,388 · Siam Cement Group</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-0.5 px-3 pb-5">
          {ACTIONS.map(({ icon: Icon, label, danger }) => (
            <DrawerClose asChild key={label}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-[10px] p-3 text-left text-sm transition-colors hover:bg-accent",
                  danger && "text-danger"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    danger
                      ? "bg-danger-soft text-danger"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {label}
              </button>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

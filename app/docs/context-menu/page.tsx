"use client"

import { useState } from "react"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/registry/new-york/ui/context-menu"
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
  { title: "File actions", href: "#file-actions", depth: 1 },
  { title: "Checkbox & radio", href: "#checkbox-radio", depth: 1 },
  { title: "Submenus", href: "#submenus", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const TriggerArea = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    {...props}
    className={cn(
      "flex h-[140px] w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground select-none",
      className
    )}
  >
    {children}
  </div>
)

export default function ContextMenuPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Context Menu"]}
      title="Context Menu"
      description="A right-click menu surfaced at the pointer — items, shortcuts, separators, checkbox & radio items, and nested submenus for contextual actions."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/context-menu" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"`}
      />
      <ComponentPreview
        code={`<ContextMenu>
  <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      Rename <ContextMenuShortcut>⌘R</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>Duplicate</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <TriggerArea>Right-click here</TriggerArea>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              Rename <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="file-actions">File actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Contextual actions with shortcuts, a label, and a destructive item.
      </p>
      <ComponentPreview>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <TriggerArea>Right-click the file</TriggerArea>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>
              Open <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Rename <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>Move to</ContextMenuLabel>
            <ContextMenuItem>Archive</ContextMenuItem>
            <ContextMenuItem disabled>Trash</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              Delete <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ComponentPreview>

      <DocH3 id="checkbox-radio">Checkbox &amp; radio</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Toggle view options and pick a single sort order.
      </p>
      <CheckboxRadioExample />

      <DocH3 id="submenus">Submenus</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Nest a <code>ContextMenuSub</code> for grouped secondary actions.
      </p>
      <ComponentPreview>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <TriggerArea>Right-click for share options</TriggerArea>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>Email link</ContextMenuItem>
            <ContextMenuItem>Copy link</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>Send to</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem>Anong Srisuk</ContextMenuItem>
                <ContextMenuItem>Nirut K.</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>More people…</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>Export as PDF</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-context-menu">ContextMenu</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Root container. Wraps a single <code>ContextMenuTrigger</code> and one <code>ContextMenuContent</code>.
      </p>
      <PropsTable
        rows={[
          { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the menu opens or closes" },
          { prop: "modal", type: "boolean", default: "true", desc: "When true, outside interaction is blocked while open" },
          { prop: "dir", type: '"ltr" | "rtl"', default: '"ltr"', desc: "Reading direction of the menu" },
        ]}
      />

      <DocH3 id="api-trigger">ContextMenuTrigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The region that opens the menu on right-click. Use <code>asChild</code> to wrap your own element.
      </p>
      <PropsTable
        rows={[
          { prop: "asChild", type: "boolean", default: "false", desc: "Merge props onto the child instead of rendering a span" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Prevents the menu from opening" },
        ]}
      />

      <DocH3 id="api-content">ContextMenuContent</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The menu panel rendered in a portal at the pointer.</p>
      <PropsTable
        rows={[
          { prop: "loop", type: "boolean", default: "false", desc: "Keyboard focus wraps from last to first item" },
          { prop: "onCloseAutoFocus", type: "(event: Event) => void", default: "—", desc: "Called when focus returns after closing" },
        ]}
      />

      <DocH3 id="api-item">ContextMenuItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A selectable action row.</p>
      <PropsTable
        rows={[
          { prop: "variant", type: '"default" | "destructive"', default: '"default"', desc: "destructive renders the item in the destructive color" },
          { prop: "inset", type: "boolean", default: "false", desc: "Adds left padding to align with checkbox/radio items" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Greys out and disables the item" },
          { prop: "onSelect", type: "(event: Event) => void", default: "—", desc: "Called when the item is selected" },
        ]}
      />

      <DocH3 id="api-checkbox-item">ContextMenuCheckboxItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A togglable item with a check indicator.</p>
      <PropsTable
        rows={[
          { prop: "checked", type: "boolean", default: "—", desc: "Controlled checked state" },
          { prop: "onCheckedChange", type: "(checked: boolean) => void", default: "—", desc: "Called when the checked state changes" },
        ]}
      />

      <DocH3 id="api-radio-item">ContextMenuRadioItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single choice within a <code>ContextMenuRadioGroup</code>.</p>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "The value of this radio item (required)" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Greys out and disables the item" },
        ]}
      />

      <DocH3 id="api-sub-trigger">ContextMenuSubTrigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Opens a nested <code>ContextMenuSubContent</code> submenu.</p>
      <PropsTable
        rows={[
          { prop: "inset", type: "boolean", default: "false", desc: "Adds left padding to align with checkbox/radio items" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Prevents the submenu from opening" },
        ]}
      />
    </DocPage>
  )
}

function CheckboxRadioExample() {
  const [statusBar, setStatusBar] = useState(true)
  const [panel, setPanel] = useState(false)
  const [sort, setSort] = useState("name")

  return (
    <ComponentPreview>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <TriggerArea>Right-click for view options</TriggerArea>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuLabel>Appearance</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
          >
            Status bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={panel} onCheckedChange={setPanel}>
            Activity panel
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Sort by</ContextMenuLabel>
          <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
            <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
            <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
            <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    </ComponentPreview>
  )
}

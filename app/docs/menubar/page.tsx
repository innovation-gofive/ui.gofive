"use client"

import { useState } from "react"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/registry/new-york/ui/menubar"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Application menu", href: "#application", depth: 1 },
  { title: "Checkbox & radio", href: "#checkbox-radio", depth: 1 },
  { title: "Submenus", href: "#submenus", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function MenubarPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Menubar"]}
      title="Menubar"
      description="A horizontal application menu bar — desktop-style File / Edit / View menus with items, shortcuts, separators, checkbox & radio items, and nested submenus."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/menubar" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar"`}
      />
      <ComponentPreview
        className="min-h-[120px] items-start"
        code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print…</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
      >
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print…</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="application">Application menu</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A full desktop-style menu bar with labels, shortcuts, and disabled items.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>New Incognito Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Print… <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Support</MenubarLabel>
              <MenubarItem>Documentation</MenubarItem>
              <MenubarItem>Keyboard shortcuts</MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">Report a bug</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ComponentPreview>

      <DocH3 id="checkbox-radio">Checkbox &amp; radio</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Toggle settings and select a single option from a group.
      </p>
      <CheckboxRadioExample />

      <DocH3 id="submenus">Submenus</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Nest a <code>MenubarSub</code> for grouped or secondary actions.
      </p>
      <ComponentPreview className="min-h-[120px] items-start">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Share</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Copy link</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Send to</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Anong Srisuk</MenubarItem>
                  <MenubarItem>Nirut K.</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>More people…</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Export as PDF</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-menubar">Menubar</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Root container. Wraps each top-level menu in a <code>MenubarMenu</code>.
      </p>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "Controlled value of the currently open menu" },
          { prop: "defaultValue", type: "string", default: "—", desc: "Value of the menu open by default (uncontrolled)" },
          { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called when the open menu changes" },
          { prop: "loop", type: "boolean", default: "false", desc: "Keyboard focus wraps from last to first item" },
        ]}
      />

      <DocH3 id="api-trigger">MenubarTrigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The clickable top-level label that opens a menu.</p>
      <PropsTable
        rows={[
          { prop: "disabled", type: "boolean", default: "false", desc: "Prevents the menu from opening" },
        ]}
      />

      <DocH3 id="api-content">MenubarContent</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">The dropdown panel rendered in a portal.</p>
      <PropsTable
        rows={[
          { prop: "align", type: '"start" | "center" | "end"', default: '"start"', desc: "Alignment against the trigger" },
          { prop: "alignOffset", type: "number", default: "-4", desc: "Offset in pixels from the alignment edge" },
          { prop: "sideOffset", type: "number", default: "8", desc: "Distance in pixels from the trigger" },
        ]}
      />

      <DocH3 id="api-item">MenubarItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A selectable action row.</p>
      <PropsTable
        rows={[
          { prop: "variant", type: '"default" | "destructive"', default: '"default"', desc: "destructive renders the item in the destructive color" },
          { prop: "inset", type: "boolean", default: "false", desc: "Adds left padding to align with checkbox/radio items" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Greys out and disables the item" },
          { prop: "onSelect", type: "(event: Event) => void", default: "—", desc: "Called when the item is selected" },
        ]}
      />

      <DocH3 id="api-checkbox-item">MenubarCheckboxItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A togglable item with a check indicator.</p>
      <PropsTable
        rows={[
          { prop: "checked", type: "boolean", default: "—", desc: "Controlled checked state" },
          { prop: "onCheckedChange", type: "(checked: boolean) => void", default: "—", desc: "Called when the checked state changes" },
        ]}
      />

      <DocH3 id="api-radio-item">MenubarRadioItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single choice within a <code>MenubarRadioGroup</code>.</p>
      <PropsTable
        rows={[
          { prop: "value", type: "string", default: "—", desc: "The value of this radio item (required)" },
          { prop: "disabled", type: "boolean", default: "false", desc: "Greys out and disables the item" },
        ]}
      />

      <DocH3 id="api-sub-trigger">MenubarSubTrigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Opens a nested <code>MenubarSubContent</code> submenu.</p>
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
  const [showBookmarks, setShowBookmarks] = useState(true)
  const [showUrls, setShowUrls] = useState(false)
  const [profile, setProfile] = useState("anong")

  return (
    <ComponentPreview className="min-h-[120px] items-start">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              checked={showBookmarks}
              onCheckedChange={setShowBookmarks}
            >
              Always show bookmarks
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={showUrls} onCheckedChange={setShowUrls}>
              Always show full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel inset>Switch account</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="anong">Anong Srisuk</MenubarRadioItem>
              <MenubarRadioItem value="nirut">Nirut K.</MenubarRadioItem>
              <MenubarRadioItem value="prapa">Prapa C.</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ComponentPreview>
  )
}

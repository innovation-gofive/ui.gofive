"use client"

import { useState } from "react"
import {
  Search,
  FileText,
  CheckSquare,
  UserPlus,
  Settings,
  Home,
  Plus,
} from "lucide-react"
import {
  SearchInput,
  CommandPalette,
  type SearchItem,
} from "@/registry/new-york/ui/search"
import { Button } from "@/components/ui/button"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Search input", href: "#input", depth: 1 },
  { title: "With ⌘K hint", href: "#kbd-hint", depth: 1 },
  { title: "Command palette", href: "#command-palette", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const ITEMS: SearchItem[] = [
  {
    id: "create-task",
    group: "Suggestions",
    title: "Create task…",
    subtitle: "New action item for you or a teammate",
    icon: <Plus />,
    meta: "T",
    keywords: "new add todo",
  },
  {
    id: "new-doc",
    group: "Suggestions",
    title: "New document",
    subtitle: "Docs · shared with your team",
    icon: <FileText />,
    meta: "D",
    keywords: "file page",
  },
  {
    id: "invite",
    group: "Suggestions",
    title: "Invite people…",
    subtitle: "Send a workspace invitation",
    icon: <UserPlus />,
    keywords: "member user team",
  },
  {
    id: "jump-home",
    group: "Jump to…",
    title: "Home",
    icon: <Home />,
    meta: "G H",
    keywords: "dashboard",
  },
  {
    id: "jump-tasks",
    group: "Jump to…",
    title: "Tasks",
    icon: <CheckSquare />,
    meta: "G T",
    keywords: "todo work",
  },
  {
    id: "jump-settings",
    group: "Jump to…",
    title: "Settings",
    icon: <Settings />,
    meta: "G S",
    keywords: "preferences config",
  },
]

export default function SearchPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Search"]}
      title="Search"
      description="A styled search input with a leading icon, optional ⌘K hint and clear button, plus a controlled command palette with grouped, keyboard-navigable results."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/search" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { SearchInput, CommandPalette } from "@/components/ui/search"`}
      />
      <ComponentPreview className="min-h-[120px]">
        <SearchInput containerClassName="w-full max-w-[420px]" placeholder="Search people, documents, tasks…" />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="input">Search input</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Leading search icon with a clear button that appears once you type.
      </p>
      <ComponentPreview
        className="min-h-[120px]"
        code={`<SearchInput placeholder="Search people, documents, tasks…" />`}
      >
        <SearchInput
          containerClassName="w-full max-w-[420px]"
          placeholder="Search people, documents, tasks…"
        />
      </ComponentPreview>

      <DocH3 id="kbd-hint">With ⌘K hint</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code className="font-mono text-xs">kbdHint</code> to show a keyboard shortcut badge while the field is empty.
      </p>
      <ComponentPreview
        className="min-h-[120px]"
        code={`<SearchInput kbdHint="⌘K" placeholder="Quick search" />

<SearchInput pill kbdHint="/" placeholder="Quick search" />`}
      >
        <div className="flex w-full max-w-[420px] flex-col gap-3">
          <SearchInput kbdHint="⌘K" placeholder="Quick search" />
          <SearchInput pill kbdHint="/" placeholder="Quick search" />
        </div>
      </ComponentPreview>

      <DocH3 id="command-palette">Command palette</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A controlled overlay with grouped results, highlight on match, and ↑/↓/↵ keyboard navigation.
      </p>
      <PaletteExample />

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-searchinput">SearchInput</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Styled input with a leading icon. Uncontrolled by default; pass <code className="font-mono text-xs">value</code> + <code className="font-mono text-xs">onValueChange</code> to control it.</p>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled value" },
        { prop: "defaultValue", type: "string", default: '""', desc: "Initial value when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Fires on every keystroke" },
        { prop: "kbdHint", type: "ReactNode", default: "—", desc: "Keyboard hint badge shown while the field is empty (e.g. ⌘K)" },
        { prop: "clearable", type: "boolean", default: "true", desc: "Show a clear button once there is a value" },
        { prop: "pill", type: "boolean", default: "false", desc: "Rounded pill / header style with muted background" },
        { prop: "containerClassName", type: "string", default: "—", desc: "Class applied to the outer wrapper (width, etc.)" },
      ]} />

      <DocH3 id="api-commandpalette">CommandPalette</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Controlled overlay that filters and groups <code className="font-mono text-xs">items</code>.</p>
      <PropsTable rows={[
        { prop: "open", type: "boolean", default: "—", desc: "Whether the palette is visible" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called on Escape, overlay click, or selection" },
        { prop: "items", type: "SearchItem[]", default: "—", desc: "Searchable items; grouped by their group field" },
        { prop: "placeholder", type: "string", default: '"Type a command or search…"', desc: "Input placeholder" },
        { prop: "onSelect", type: "(item: SearchItem) => void", default: "—", desc: "Fires when an item is chosen via click or ↵" },
        { prop: "emptyMessage", type: "string", default: '"No results found."', desc: "Shown when nothing matches the query" },
      ]} />

      <DocH3 id="api-searchitem">SearchItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Shape of each entry passed to CommandPalette (and SearchResult).</p>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Unique key" },
        { prop: "group", type: "string", default: "—", desc: "Group label this item belongs to" },
        { prop: "title", type: "string", default: "—", desc: "Primary label (query matches are highlighted)" },
        { prop: "subtitle", type: "string", default: "—", desc: "Secondary line" },
        { prop: "meta", type: "string", default: "—", desc: "Trailing mono text (id, shortcut, type)" },
        { prop: "icon", type: "ReactNode", default: "—", desc: "Leading icon" },
        { prop: "keywords", type: "string", default: "—", desc: "Extra text matched against the query but not shown" },
      ]} />
    </DocPage>
  )
}

function PaletteExample() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)

  return (
    <ComponentPreview className="min-h-[120px]">
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Search className="size-4" />
          Open command palette
          <kbd className="ml-1 inline-flex h-5 items-center rounded-[5px] border bg-muted px-1.5 font-mono text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
        {last && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{last}</span>
          </p>
        )}
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={ITEMS}
          onSelect={(item) => setLast(item.title)}
        />
      </div>
    </ComponentPreview>
  )
}

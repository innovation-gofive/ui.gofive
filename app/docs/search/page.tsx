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
  SearchScope,
  RecentSearches,
  CommandPalette,
  SearchResults,
  SearchGroup,
  SearchResult,
  SearchFooter,
  SearchSkeleton,
  SearchEmpty,
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
  { title: "Scope toggle", href: "#scope", depth: 1 },
  { title: "Recent & suggestions", href: "#recent", depth: 1 },
  { title: "Grouped results", href: "#results", depth: 1 },
  { title: "Loading & empty", href: "#states", depth: 1 },
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
      description="A search input with scope toggle and recent-search pills, a grouped results dropdown with highlighting, avatars and keyboard hints, loading and no-results states, plus a controlled command palette."
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

      <DocH3 id="scope">Scope toggle</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A segmented toggle for narrowing what to search. Controlled or uncontrolled.
      </p>
      <ComponentPreview
        className="min-h-[100px]"
        code={`<SearchScope
  scopes={["Everything", "People", "Documents", "Tasks", "Conversations"]}
  defaultValue="Everything"
/>`}
      >
        <SearchScope
          scopes={["Everything", "People", "Documents", "Tasks", "Conversations"]}
          defaultValue="Everything"
        />
      </ComponentPreview>

      <DocH3 id="recent">Recent & suggestions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The empty-query state: recent-search pills above grouped quick actions inside a results panel.
      </p>
      <ComponentPreview className="min-h-[260px]">
        <SearchResults className="w-full max-w-[520px]">
          <RecentSearches
            items={["Q1 headcount", "Ploy Kittisak", "brand guidelines", "payroll export march"]}
          />
          <SearchGroup label="Jump to" count="quick actions">
            <SearchResult item={ITEMS[0]} />
            <SearchResult item={ITEMS[1]} />
            <SearchResult item={ITEMS[2]} />
          </SearchGroup>
        </SearchResults>
      </ComponentPreview>

      <DocH3 id="results">Grouped results</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Results grouped by type with query highlighting, avatars, colored icon tiles, an active row, and a footer with keyboard hints.
      </p>
      <ComponentPreview className="min-h-[380px]">
        <SearchResults
          className="w-full max-w-[520px]"
          footer={<SearchFooter count={6} />}
        >
          <SearchGroup label="People" count={2}>
            <SearchResult
              query="Onb"
              item={{
                id: "p1",
                group: "People",
                title: "Nattanan Onboun",
                subtitle: "nattanan.o@gofive.co.th · Engineering",
                meta: "#PPL-104",
                avatar: { initials: "NO" },
              }}
            />
            <SearchResult
              item={{
                id: "p2",
                group: "People",
                title: "Onboarding committee",
                subtitle: "Group · 8 members",
                meta: "group",
                avatar: { initials: "OC", className: "from-[#FFB057] to-[#F05B2F]" },
              }}
            />
          </SearchGroup>
          <SearchGroup label="Documents" count={3}>
            <SearchResult
              active
              query="Onb"
              item={{
                id: "d1",
                group: "Documents",
                title: "Onboarding handbook — 2025 edition",
                subtitle: "PDF · 2.4 MB · Updated 2 days ago",
                icon: <FileText />,
                iconClassName: "bg-[#FFE4E9] text-[#E6443C]",
              }}
            />
            <SearchResult
              query="onb"
              item={{
                id: "d2",
                group: "Documents",
                title: "Remote onboarding checklist",
                subtitle: "Doc · shared by Chayaphon R.",
                icon: <FileText />,
                iconClassName: "bg-[#E7F0FF] text-[#116DFC]",
              }}
            />
          </SearchGroup>
          <SearchGroup label="Tasks" count={1}>
            <SearchResult
              query="onb"
              item={{
                id: "t1",
                group: "Tasks",
                title: "Revise onboarding email templates",
                subtitle: "Due Apr 18 · assigned to you",
                meta: "T-284",
                icon: <CheckSquare />,
                iconClassName: "bg-[#FFF4BF] text-[#8A6200]",
              }}
            />
          </SearchGroup>
        </SearchResults>
      </ComponentPreview>

      <DocH3 id="states">Loading & empty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A shimmering skeleton while results load, and a rich no-results state with optional actions.
      </p>
      <ComponentPreview className="min-h-[260px]">
        <div className="grid w-full max-w-[640px] grid-cols-1 gap-4 sm:grid-cols-2">
          <SearchResults>
            <SearchSkeleton rows={3} />
          </SearchResults>
          <SearchResults>
            <SearchEmpty
              query="qwerpayroll"
              actions={
                <>
                  <Button variant="outline" size="sm">Clear search</Button>
                  <Button size="sm">Search all workspaces</Button>
                </>
              }
            />
          </SearchResults>
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

      <DocH3 id="api-searchscope">SearchScope</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Segmented toggle for narrowing the search scope.</p>
      <PropsTable rows={[
        { prop: "scopes", type: "string[]", default: "—", desc: "Scope labels rendered as segments" },
        { prop: "value", type: "string", default: "—", desc: "Controlled active scope" },
        { prop: "defaultValue", type: "string", default: "scopes[0]", desc: "Initial scope when uncontrolled" },
        { prop: "onValueChange", type: "(scope: string) => void", default: "—", desc: "Fires when a scope is selected" },
      ]} />

      <DocH3 id="api-recentsearches">RecentSearches</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Pills of recent query terms shown in the empty-query state.</p>
      <PropsTable rows={[
        { prop: "items", type: "string[]", default: "—", desc: "Recent query terms (renders nothing when empty)" },
        { prop: "label", type: "string", default: '"Recent searches"', desc: "Section heading; pass empty string to hide" },
        { prop: "onSelect", type: "(term: string) => void", default: "—", desc: "Fires when a pill is clicked" },
      ]} />

      <DocH3 id="api-searchresults">SearchResults</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Bordered dropdown panel that wraps groups, skeletons, or the empty state, with an optional footer.</p>
      <PropsTable rows={[
        { prop: "footer", type: "ReactNode", default: "—", desc: "Footer rendered below the body (e.g. <SearchFooter />)" },
        { prop: "children", type: "ReactNode", default: "—", desc: "Groups, recent searches, skeleton, or empty state" },
        { prop: "className", type: "string", default: "—", desc: "Class applied to the panel (width, etc.)" },
      ]} />

      <DocH3 id="api-searchresult">SearchResult</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single result row with icon or avatar, highlighted title, subtitle, and meta.</p>
      <PropsTable rows={[
        { prop: "item", type: "SearchItem", default: "—", desc: "The result to render" },
        { prop: "query", type: "string", default: '""', desc: "Query used to highlight matches in the title" },
        { prop: "active", type: "boolean", default: "false", desc: "Primary-tinted active/selected styling with ↵ hint" },
        { prop: "onSelect", type: "(item: SearchItem) => void", default: "—", desc: "Fires when the row is clicked" },
      ]} />

      <DocH3 id="api-searchfooter">SearchFooter</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Keyboard-hint row with an optional result count.</p>
      <PropsTable rows={[
        { prop: "count", type: "number", default: "—", desc: "Result count shown on the right" },
        { prop: "hints", type: "ReactNode", default: "↑↓ / ↵ / ⌘↵", desc: "Hint content shown on the left" },
      ]} />

      <DocH3 id="api-searchskeleton">SearchSkeleton</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Shimmering placeholder rows shown while results load.</p>
      <PropsTable rows={[
        { prop: "rows", type: "number", default: "3", desc: "Number of placeholder rows" },
        { prop: "label", type: "string", default: '"Searching…"', desc: "Section heading; pass empty string to hide" },
      ]} />

      <DocH3 id="api-searchempty">SearchEmpty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">No-results state with illustration, copy, and an action slot.</p>
      <PropsTable rows={[
        { prop: "query", type: "string", default: "—", desc: "Echoed in the default title (No results for “…”)" },
        { prop: "title", type: "ReactNode", default: "—", desc: "Override the default title" },
        { prop: "description", type: "ReactNode", default: '"Try a different keyword…"', desc: "Secondary line" },
        { prop: "actions", type: "ReactNode", default: "—", desc: "Buttons shown below the copy" },
      ]} />

      <DocH3 id="api-commandpalette">CommandPalette</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Controlled overlay that filters and groups <code className="font-mono text-xs">items</code>.</p>
      <PropsTable rows={[
        { prop: "open", type: "boolean", default: "—", desc: "Whether the palette is visible" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called on Escape, overlay click, or selection" },
        { prop: "items", type: "SearchItem[]", default: "—", desc: "Searchable items; grouped by their group field" },
        { prop: "placeholder", type: "string", default: '"Type a command or search…"', desc: "Input placeholder" },
        { prop: "onSelect", type: "(item: SearchItem) => void", default: "—", desc: "Fires when an item is chosen via click or ↵" },
        { prop: "emptyMessage", type: "string", default: "—", desc: "Title shown when nothing matches the query" },
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
        { prop: "iconClassName", type: "string", default: "—", desc: "Extra classes for the icon tile (e.g. colored backgrounds)" },
        { prop: "avatar", type: "{ initials, className? }", default: "—", desc: "Initials avatar shown instead of the icon tile" },
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

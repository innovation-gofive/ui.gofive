"use client"

import { useState } from "react"
import {
  BookOpen,
  Command,
  CreditCard,
  Languages,
  LogOut,
  Settings,
} from "lucide-react"
import {
  ProfileMenu,
  type ProfileMenuGroup,
} from "@/registry/new-york/ui/profile-menu"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Setup progress", href: "#setup-progress", depth: 1 },
  { title: "Groups and states", href: "#groups", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Compact trigger", href: "#compact", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "Many items", href: "#many-items", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const groups: ProfileMenuGroup[] = [
  {
    id: "account",
    label: "Account",
    items: [
      { id: "settings", label: "Settings", icon: <Settings />, shortcut: "⌘,", onSelect: () => {} },
      { id: "billing", label: "Billing", icon: <CreditCard />, badge: "New" },
      { id: "language", label: "Language", icon: <Languages />, disabled: true },
    ],
  },
  {
    id: "help",
    items: [{ id: "docs", label: "Documentation", icon: <BookOpen />, shortcut: "⌘/" }],
  },
  {
    id: "session",
    items: [
      { id: "signout", label: "Sign out", icon: <LogOut />, destructive: true, shortcut: "⇧⌘Q" },
    ],
  },
]

const user = { name: "Nattaya Suwan", email: "nattaya@gofive.co.th" }

export default function ProfileMenuPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Profile Menu"]}
      title="Profile Menu"
      description="An account trigger that opens a portalled menu with the signed-in user, a profile-setup progress row, grouped actions with icons and shortcuts, and a sign-out item."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/profile-menu" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ProfileMenu } from "@/components/ui/profile-menu"

<ProfileMenu
  name="Nattaya Suwan"
  email="nattaya@gofive.co.th"
  role="Admin"
  setup={{ done: 3, total: 5, next: "Add a photo", onContinue: openOnboarding }}
  items={[
    {
      label: "Account",
      items: [
        { label: "Settings", icon: <Settings />, shortcut: "⌘,", onSelect: openSettings },
        { label: "Billing", icon: <CreditCard />, badge: "New" },
      ],
    },
    { label: "Sign out", icon: <LogOut />, destructive: true, onSelect: signOut },
  ]}
/>`}
      />
      <ComponentPreview className="min-h-[120px]">
        <ProfileMenu
          {...user}
          role="Admin"
          setup={{ done: 3, total: 5, next: "Add a photo" }}
          items={groups}
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="setup-progress">Setup progress</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The bar grows from empty each time the menu opens. The next-step row is a real menu item,
        so arrow keys reach it, and it only shows while steps remain. Without <code>setup</code> the
        block is gone entirely.
      </p>
      <ComponentPreview className="min-h-[120px]">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ProfileMenu {...user} items={groups} setup={{ done: 2, total: 6, next: "Verify your phone number" }} />
          <ProfileMenu {...user} items={groups} setup={{ done: 4, total: 4, next: "All done" }} />
          <ProfileMenu {...user} items={groups} />
        </div>
      </ComponentPreview>

      <DocH3 id="groups">Groups and states</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass groups for headings and hairline dividers, or bare items for a flat list. Rows can carry
        a badge, a shortcut hint, and a disabled or destructive state. Role, avatar image and
        a missing name are all optional.
      </p>
      <ComponentPreview className="min-h-[120px]">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ProfileMenu
            name="Somchai Prasert"
            email="somchai@gofive.co.th"
            role="Pro plan"
            avatarSrc="/broken-avatar.png"
            items={groups}
          />
          <ProfileMenu email="no-name@gofive.co.th" avatar={<span className="text-xs font-semibold">NN</span>} items={[
            { label: "Settings", icon: <Settings /> },
            { label: "Sign out", icon: <LogOut />, destructive: true },
          ]} />
        </div>
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drive <code>open</code> from state. Selecting an item runs its callback, then closes the menu
        unless the handler calls <code>event.preventDefault()</code>.
      </p>
      <ControlledExample />

      <DocH3 id="compact">Compact trigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>compact</code> shows only the avatar, for toolbars. The accessible name still includes
        the user&apos;s name. <code>side</code> and <code>align</code> place the panel.
      </p>
      <ComponentPreview>
        <ProfileMenu {...user} compact items={groups} setup={{ done: 1, total: 3, next: "Add a photo" }} align="start" />
      </ComponentPreview>

      <DocH3 id="labels">Localized labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every built-in string lives in <code>labels</code>; the count uses <code>locale</code>.
      </p>
      <ComponentPreview>
        <ProfileMenu
          name="ณัฐธยาน์ สุวรรณ"
          email="nattaya@gofive.co.th"
          role="ผู้ดูแลระบบ"
          locale="th-TH"
          labels={{ account: "เมนูบัญชี", setupTitle: "ตั้งค่าโปรไฟล์", nextStep: "ขั้นตอนถัดไป" }}
          setup={{ done: 1234, total: 2000, next: "เพิ่มรูปโปรไฟล์" }}
          items={[
            { label: "การตั้งค่า", icon: <Settings />, shortcut: "⌘," },
            { label: "ภาษา", icon: <Languages /> },
            { label: "ออกจากระบบ", icon: <LogOut />, destructive: true },
          ]}
        />
      </ComponentPreview>

      <DocH3 id="many-items">Many items</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The action list caps its height and scrolls inside the panel while the header and progress
        row stay put. Long labels truncate.
      </p>
      <ComponentPreview>
        <ProfileMenu
          {...user}
          setup={{ done: 2, total: 5, next: "Connect your calendar" }}
          items={[
            ...Array.from({ length: 12 }, (_, i) => ({
              id: `w${i}`,
              label: i === 3 ? "A workspace with a really long name that must truncate" : `Workspace ${i + 1}`,
              icon: <Command />,
            })),
            { id: "out", label: "Sign out", icon: <LogOut />, destructive: true },
          ]}
        />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-profile-menu">ProfileMenu</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Remaining props, including <code>className</code>, are spread onto the trigger button.
      </p>
      <PropsTable rows={[
        { prop: "name", type: "string", default: "—", desc: "Display name. Trimmed; when empty only the email shows (and labels the trigger)" },
        { prop: "email", type: "string", default: "—", desc: "Secondary line in the header, single-line with a native tooltip" },
        { prop: "role", type: "string", default: "—", desc: "Role or plan tag beside the name; hidden when absent" },
        { prop: "avatarSrc", type: "string", default: "—", desc: "Avatar image URL; falls back to the default glyph if it fails to load" },
        { prop: "avatar", type: "ReactNode", default: "—", desc: "Custom avatar content (initials, icon) replacing the default glyph" },
        { prop: "items", type: "(ProfileMenuItem | ProfileMenuGroup)[]", default: "—", desc: "Actions. Groups get dividers; consecutive bare items share a group. Invalid entries and empty groups are dropped. No hidden defaults" },
        { prop: "setup", type: "ProfileMenuSetup", default: "—", desc: "Profile-setup progress. The block is omitted when absent" },
        { prop: "labels", type: "Partial<ProfileMenuLabels>", default: "{ account, setupTitle, nextStep }", desc: "Built-in strings: \"Account menu\", \"Finish your profile\", \"Next step\"" },
        { prop: "locale", type: "string", default: "runtime locale", desc: "Locale for the setup count formatting" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state — pair with onOpenChange" },
        { prop: "defaultOpen", type: "boolean", default: "false", desc: "Initial open state when uncontrolled" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the menu opens or closes" },
        { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', desc: "Panel side relative to the trigger" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"end"', desc: "Panel alignment relative to the trigger" },
        { prop: "compact", type: "boolean", default: "false", desc: "Avatar-only trigger" },
        { prop: "panelClassName", type: "string", default: "—", desc: "Extra classes for the portalled panel" },
      ]} />

      <DocH3 id="api-profile-menu-labels">ProfileMenuLabels</DocH3>
      <PropsTable rows={[
        { prop: "account", type: "string", default: '"Account menu"', desc: "Names the trigger (after the user's name) and the open panel" },
        { prop: "setupTitle", type: "string", default: '"Finish your profile"', desc: "Title of the setup block and the progress bar's accessible name" },
        { prop: "nextStep", type: "string", default: '"Next step"', desc: "Lead-in before the next step's name in the CTA" },
      ]} />

      <DocH3 id="api-profile-menu-item">ProfileMenuItem</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Stable identity; combined with the index for the key, so duplicates are tolerated" },
        { prop: "label", type: "string", default: "—", desc: "Row text. Truncates with a tooltip; direction is auto-detected" },
        { prop: "icon", type: "ReactNode", default: "—", desc: "Leading icon. The slot is always reserved so labels align" },
        { prop: "badge", type: "string", default: "—", desc: "Small trailing pill, e.g. a \"New\" marker" },
        { prop: "shortcut", type: "string", default: "—", desc: "Display-only key hint at the trailing edge; wiring the key is up to the caller" },
        { prop: "destructive", type: "boolean", default: "false", desc: "Danger-tinted label, icon and focus wash" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Dimmed, inert and skipped by keyboard navigation" },
        { prop: "onSelect", type: "(event: Event) => void", default: "—", desc: "Runs on click, Enter or Space, before the menu closes. preventDefault() keeps it open" },
      ]} />

      <DocH3 id="api-profile-menu-group">ProfileMenuGroup</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Optional stable key for the group" },
        { prop: "label", type: "string", default: "—", desc: "Small muted heading; also labels the group for assistive tech" },
        { prop: "items", type: "ProfileMenuItem[]", default: "—", desc: "Rows in the group" },
      ]} />

      <DocH3 id="api-profile-menu-setup">ProfileMenuSetup</DocH3>
      <PropsTable rows={[
        { prop: "done", type: "number", default: "—", desc: "Completed steps. Non-finite becomes 0; clamped to 0..total" },
        { prop: "total", type: "number", default: "—", desc: "Total steps. Non-finite or negative becomes 0 (empty bar, no divide-by-zero)" },
        { prop: "next", type: "string", default: "—", desc: "Name of the next open step. The CTA shows only when set and the profile is incomplete" },
        { prop: "onContinue", type: "(event: Event) => void", default: "—", desc: "Runs when the CTA is selected, before the menu closes. preventDefault() keeps it open" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState("nothing yet")

  const items: ProfileMenuGroup[] = [
    {
      items: [
        { id: "settings", label: "Settings", icon: <Settings />, onSelect: () => setLast("Settings") },
        {
          id: "stay",
          label: "Keep menu open",
          icon: <Command />,
          onSelect: (e) => {
            e.preventDefault()
            setLast("Keep menu open")
          },
        },
      ],
    },
    { items: [{ id: "out", label: "Sign out", icon: <LogOut />, destructive: true, onSelect: () => setLast("Sign out") }] },
  ]

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-3">
        <ProfileMenu {...user} open={open} onOpenChange={setOpen} items={items} />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Menu is {open ? "open" : "closed"}; last action: {last}
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md border px-3 py-1 text-xs hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
        >
          Open from outside
        </button>
      </div>
    </ComponentPreview>
  )
}

"use client"

import { useState } from "react"
import { BookOpen, Mail, Users } from "lucide-react"
import { Checklist, type ChecklistItem } from "@/registry/new-york/ui/checklist"
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
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Descriptions and actions", href: "#actions", depth: 1 },
  { title: "Current item", href: "#current", depth: 1 },
  { title: "Icons", href: "#icons", depth: 1 },
  { title: "Autoplay demo", href: "#autoplay", depth: 1 },
  { title: "Complete and empty", href: "#states", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const BASIC: ChecklistItem[] = [
  { id: "profile", label: "Complete your profile" },
  { id: "team", label: "Invite your team" },
  { id: "project", label: "Create your first project" },
  { id: "notify", label: "Turn on notifications" },
]

const RICH: ChecklistItem[] = [
  {
    id: "profile",
    label: "Complete your profile",
    description: "Add a photo and a short bio so teammates recognise you.",
    action: <Button size="sm" variant="outline" aria-label="Edit profile">Edit</Button>,
  },
  {
    id: "team",
    label: "Invite your team",
    description: "Collaboration works best with at least three people.",
    action: <Button size="sm" variant="outline" aria-label="Invite team members">Invite</Button>,
  },
  { id: "project", label: "Create your first project" },
]

const ICONS: ChecklistItem[] = [
  { id: "read", label: "Read the quick guide", icon: <BookOpen /> },
  { id: "invite", label: "Invite a colleague", icon: <Users /> },
  { id: "verify", label: "Verify your email", icon: <Mail /> },
]

export default function ChecklistPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Checklist"]}
      title="Checklist"
      description="An onboarding task card with an animated progress bar, self-drawing checks, optional descriptions and actions, and a current-item highlight. Fully controlled."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/checklist" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Checklist } from "@/components/ui/checklist"

const [done, setDone] = useState<string[]>([])

<Checklist
  title="First steps"
  items={[{ id: "profile", label: "Complete your profile" }]}
  completedIds={done}
  onToggle={(id, next) =>
    setDone((d) => (next ? [...d, id] : d.filter((x) => x !== id)))
  }
/>`}
      />
      <ComponentPreview className="min-h-[100px]">
        <ControlledExample />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The component never owns state: it reports <code>onToggle(id, nextChecked)</code> and
        redraws when <code>completedIds</code> changes. Both completing and un-completing are allowed.
      </p>
      <ComponentPreview>
        <ControlledExample />
      </ComponentPreview>

      <DocH3 id="actions">Descriptions and actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A description is linked to the row as its accessible description. An action is a
        sibling of the toggle, so pressing it never toggles the item.
      </p>
      <ComponentPreview>
        <RichExample />
      </ComponentPreview>

      <DocH3 id="current">Current item</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The first open item is highlighted by default. Pass <code>currentId</code> to choose another
        item, or <code>null</code> for none. The highlight adds a start-edge bar and{" "}
        <code>aria-current=&quot;step&quot;</code>, so it does not rely on colour alone.
      </p>
      <ComponentPreview>
        <CurrentExample />
      </ComponentPreview>

      <DocH3 id="icons">Icons</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A decorative icon fits a fixed tile at the row end and dims once the item is done. Long labels
        truncate to one line.
      </p>
      <ComponentPreview>
        <IconsExample />
      </ComponentPreview>

      <DocH3 id="autoplay">Autoplay demo</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>autoPlay</code> ticks the next open item through <code>onToggle</code> every{" "}
        <code>interval</code> ms, then calls <code>onAutoPlayReset</code> after twice that. It stops for
        good on the first pointer or key press, and is skipped under reduced motion. Use it on demo
        state only, since real handlers fire.
      </p>
      <AutoPlayExample />

      <DocH3 id="states">Complete and empty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        When every item is done the root gets <code>data-complete</code> to style. An empty list never
        counts as complete.
      </p>
      <ComponentPreview>
        <div className="flex w-full flex-wrap items-start justify-center gap-6">
          <DoneExample />
          <Checklist title="No tasks" items={[]} />
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is a prop. The spoken progress text is built by <code>labels.progress</code>;
        numbers follow <code>locale</code>.
      </p>
      <ComponentPreview>
        <Checklist
          title="เริ่มต้นใช้งาน"
          locale="th-TH"
          headingLevel={4}
          items={[
            { id: "a", label: "กรอกข้อมูลโปรไฟล์" },
            { id: "b", label: "เชิญเพื่อนร่วมทีม", description: "ทำงานร่วมกันได้ดียิ่งขึ้น" },
          ]}
          completedIds={["a"]}
          labels={{
            progress: (c, t) => `เสร็จแล้ว ${c} จาก ${t}`,
            empty: "ยังไม่มีงาน",
          }}
        />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-checklist">Checklist</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Extends <code>div</code> props (except <code>title</code>, <code>children</code> and the native <code>onToggle</code> event), which are spread onto the root.
      </p>
      <PropsTable rows={[
        { prop: "items", type: "ChecklistItem[]", default: "—", desc: "Rows in display order. Ids must be unique and stable" },
        { prop: "completedIds", type: "readonly string[] | ReadonlySet<string>", default: "[]", desc: "Controlled completed ids. Ids not in items are ignored when counting" },
        { prop: "onToggle", type: "(id: string, nextChecked: boolean) => void", default: "—", desc: "Called when the user toggles a row. Update completedIds in response" },
        { prop: "title", type: "ReactNode", default: '"First steps"', desc: "Card heading, truncated to one line; also names the progress bar. Empty or null renders no heading" },
        { prop: "headingLevel", type: "2 | 3 | 4", default: "3", desc: "Heading element used for the title" },
        { prop: "currentId", type: "string | null", default: "first open item", desc: "Highlighted next-up item. null highlights nothing; unknown or completed ids are ignored" },
        { prop: "autoPlay", type: "boolean", default: "false", desc: "Demo aid that ticks open items via onToggle until the first pointer or key press" },
        { prop: "interval", type: "number", default: "2200", desc: "Milliseconds between autoPlay ticks" },
        { prop: "onAutoPlayReset", type: "() => void", default: "—", desc: "Called 2× interval after autoPlay finishes, so the demo can reset and loop" },
        { prop: "progressLabel", type: "string", default: "title", desc: "Accessible name of the progress bar" },
        { prop: "locale", type: "string", default: "runtime locale", desc: "BCP 47 locale for number formatting" },
        { prop: "labels", type: "ChecklistLabels", default: "—", desc: "progress(completed, total) builds the spoken value text; empty replaces the empty-list message" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root; it exposes data-complete when all items are done" },
      ]} />

      <DocH3 id="api-checklist-item">ChecklistItem</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Unique, stable key used for completion" },
        { prop: "label", type: "ReactNode", desc: "Row text on one line; strings also get a native hover title" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Secondary muted line, up to three lines, linked via aria-describedby" },
        { prop: "action", type: "ReactNode", default: "—", desc: "Control at the row end, a sibling of the toggle. Give it its own accessible name" },
        { prop: "icon", type: "ReactNode", default: "—", desc: "Decorative svg or img contained in a fixed square, dimmed when done" },
      ]} />
    </DocPage>
  )
}

function useToggleList(initial: string[]) {
  const [done, setDone] = useState<string[]>(initial)
  const onToggle = (id: string, next: boolean) =>
    setDone((d) => (next ? [...d.filter((x) => x !== id), id] : d.filter((x) => x !== id)))
  return [done, onToggle, setDone] as const
}

function ControlledExample() {
  const [done, onToggle] = useToggleList(["profile"])
  return <Checklist items={BASIC} completedIds={done} onToggle={onToggle} />
}

function RichExample() {
  const [done, onToggle] = useToggleList([])
  return <Checklist title="Set up your workspace" items={RICH} completedIds={done} onToggle={onToggle} />
}

function CurrentExample() {
  const [done, onToggle] = useToggleList([])
  const [current, setCurrent] = useState<string>("notify")
  return (
    <div className="flex flex-col items-center gap-4">
      <Checklist items={BASIC} completedIds={done} onToggle={onToggle} currentId={current} />
      <div className="flex flex-wrap justify-center gap-2">
        {BASIC.map((i) => (
          <Button key={i.id} size="sm" variant={current === i.id ? "default" : "outline"} onClick={() => setCurrent(i.id)}>
            {i.id}
          </Button>
        ))}
      </div>
    </div>
  )
}

function AutoPlayExample() {
  const [done, onToggle, setDone] = useToggleList([])
  return (
    <ComponentPreview>
      <Checklist
        title="Autoplay"
        items={BASIC}
        completedIds={done}
        onToggle={onToggle}
        autoPlay
        interval={1600}
        onAutoPlayReset={() => setDone([])}
      />
    </ComponentPreview>
  )
}

function IconsExample() {
  const [done, onToggle] = useToggleList(["read"])
  return (
    <Checklist
      title="Quick start with an unusually long card title that truncates"
      items={[
        ...ICONS,
        { id: "long", label: "Read the very long onboarding handbook that nobody has time for" },
      ]}
      completedIds={done}
      onToggle={onToggle}
    />
  )
}

function DoneExample() {
  const [done, onToggle] = useToggleList(BASIC.map((i) => i.id))
  return (
    <Checklist
      title="All set"
      items={BASIC}
      completedIds={done}
      onToggle={onToggle}
      className="data-[complete]:border-success"
    />
  )
}

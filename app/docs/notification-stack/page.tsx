"use client"

import { useMemo, useState } from "react"
import {
  NotificationStack,
  type NotificationStackNotice,
} from "@/registry/new-york/ui/notification-stack"
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
  { title: "Tones", href: "#tones", depth: 1 },
  { title: "Max visible", href: "#max-visible", depth: 1 },
  { title: "Actions", href: "#actions", depth: 1 },
  { title: "Controlled expansion", href: "#controlled-expansion", depth: 1 },
  { title: "Controlled list", href: "#controlled-list", depth: 1 },
  { title: "Single and empty", href: "#single-and-empty", depth: 1 },
  { title: "Localised labels", href: "#localised-labels", depth: 1 },
  { title: "Behaviour notes", href: "#behaviour-notes" },
  { title: "API Reference", href: "#api-reference" },
]

const BASIC: NotificationStackNotice[] = [
  { id: "b1", badge: "Update", title: "New dashboard is live", text: "Reports now refresh every five minutes.", tone: "info" },
  { id: "b2", badge: "Billing", title: "Invoice paid", text: "Payment for March was received.", tone: "success" },
  { id: "b3", badge: "Storage", title: "Storage almost full", text: "You have used 92% of your plan.", tone: "warning" },
  { id: "b4", title: "Maintenance tonight", text: "Planned downtime from 01:00 to 01:30.", tone: "neutral" },
  { id: "b5", title: "Sync failed", text: "Check your connection and try again.", tone: "danger" },
]

const TONES: NotificationStackNotice[] = [
  { id: "t1", badge: "Neutral", title: "Neutral notice", text: "A plain, low-key message.", tone: "neutral" },
  { id: "t2", badge: "Info", title: "Informational", text: "Something worth knowing.", tone: "info" },
  { id: "t3", badge: "Success", title: "All done", text: "The export finished.", tone: "success" },
  { id: "t4", badge: "Warning", title: "Heads up", text: "This action cannot be undone.", tone: "warning" },
  { id: "t5", badge: "Error", title: "Something broke", text: "We could not save your changes.", tone: "danger" },
]

const EXTRA: NotificationStackNotice[] = [
  { id: "e1", title: "Weekly digest ready", text: "Your summary for this week is available." },
  { id: "e2", title: "New comment on Report Q2", text: "Somchai replied to your note." },
  { id: "e3", title: "Password changed", text: "If this was not you, contact support.", tone: "warning" },
  { id: "e4", title: "Team invite accepted", text: "Napat joined the workspace.", tone: "success" },
  { id: "e5", title: "Plan renews soon", text: "Your plan renews in three days.", tone: "info" },
  { id: "e6", title: "Backup completed", tone: "success" },
]

const THAI: NotificationStackNotice[] = [
  { id: "th1", badge: "อัปเดต", title: "ระบบใหม่พร้อมใช้งานแล้ว", text: "รายงานจะรีเฟรชทุกห้านาที", tone: "info" },
  { id: "th2", badge: "การเงิน", title: "ชำระเงินสำเร็จ", text: "ได้รับยอดชำระของเดือนมีนาคมแล้ว", tone: "success" },
  { id: "th3", title: "พื้นที่จัดเก็บใกล้เต็ม", text: "คุณใช้พื้นที่ไปแล้ว 92%", tone: "warning" },
  { id: "th4", title: "ปิดปรับปรุงระบบคืนนี้", tone: "neutral" },
]

export default function NotificationStackPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Notification Stack"]}
      title="Notification Stack"
      description="An inline, declarative stack of notice cards that renders where you place it and is controlled by props. Unlike Toast — an imperative, portalled, store-driven overlay that times out on its own — notices here stay until dismissed or removed by you."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/notification-stack" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { NotificationStack } from "@/components/ui/notification-stack"`}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Cards layer behind one another with a scale and offset. Hover the stack, tab into it, or click it to expand
        the full list. Each card can be dismissed.
      </p>
      <ComponentPreview className="min-h-[260px] items-start">
        <NotificationStack notices={BASIC} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="tones">Tones</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>tone</code> drives the accent bar, icon and badge from semantic tokens, so it follows the theme and brand.
        Tone is also carried by an icon and a screen-reader prefix, never colour alone. Shown here pre-expanded.
      </p>
      <ComponentPreview className="min-h-[260px] items-start">
        <NotificationStack notices={TONES} defaultExpanded />
      </ComponentPreview>

      <DocH3 id="max-visible">Max visible</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>maxVisible</code> caps the cards drawn in the collapsed stack; the rest are summarised as a hidden count.
      </p>
      <ComponentPreview className="min-h-[260px] items-start">
        <NotificationStack notices={EXTRA} maxVisible={2} />
      </ComponentPreview>

      <DocH3 id="actions">Actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An <code>action</code> renders as a button, or as a link when <code>href</code> is set. <code>external</code>
        opens a new tab and announces it to assistive tech.
      </p>
      <ActionsExample />

      <DocH3 id="controlled-expansion">Controlled expansion</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drive <code>expanded</code> yourself and turn off hover/focus expansion with <code>expandOnHover=&#123;false&#125;</code>.
      </p>
      <ControlledExpansionExample />

      <DocH3 id="controlled-list">Controlled list</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Own the <code>notices</code> array and remove items from <code>onDismiss</code>. Newly added notices join the
        front and are announced politely to screen readers.
      </p>
      <ControlledListExample />

      <DocH3 id="single-and-empty">Single and empty</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        One notice renders a lone card with no toggle. With zero notices nothing is drawn and no placeholder is
        reserved; dismiss every card in the controlled list above to see it.
      </p>
      <ComponentPreview className="min-h-[160px] items-start">
        <NotificationStack
          notices={[{ id: "s1", badge: "Tip", title: "Press / to search", text: "Works from anywhere in the app.", tone: "info" }]}
        />
      </ComponentPreview>

      <DocH3 id="localised-labels">Localised labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every built-in string comes from the <code>labels</code> prop.
      </p>
      <ComponentPreview className="min-h-[260px] items-start">
        <NotificationStack
          notices={THAI}
          labels={{
            region: "การแจ้งเตือน",
            dismiss: (title) => `ปิด ${title}`,
            hiddenCount: (n) => `อีก ${n} การแจ้งเตือน`,
            expand: "แสดงทั้งหมด",
            collapse: "แสดงน้อยลง",
            newTab: "(เปิดในแท็บใหม่)",
            added: (titles) => `ใหม่: ${titles.join(", ")}`,
            tones: { info: "ข้อมูล: ", success: "สำเร็จ: ", warning: "คำเตือน: ", danger: "ข้อผิดพลาด: " },
          }}
          maxVisible={2}
        />
      </ComponentPreview>

      <DocH2 id="behaviour-notes">Behaviour notes</DocH2>
      <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-muted-foreground">
        <li>Collapsed, only the front card is readable; cards behind are <code>inert</code> and hidden from assistive tech until expanded.</li>
        <li>A stack that starts expanded (<code>defaultExpanded</code>) stays open until collapsed. With a single notice there is nothing to expand, so the open state is released.</li>
        <li>Expands on mouse hover (with a short close delay), on keyboard focus, or on click/tap, which pins it open. Escape, clicking outside, or the toggle collapses it. With <code>expandOnHover=&#123;false&#125;</code> only click and the toggle open it, and only Escape, clicking outside or the toggle close it.</li>
        <li>Dismissed ids are remembered for the life of the instance, so a notice never returns while you keep passing it. Drop the id from <code>notices</code> to release it. Ids must be unique and stable.</li>
        <li>After a dismissal, focus moves to the next card&apos;s dismiss button, else the previous one, else the stack container.</li>
        <li>Expanded stacks grow to the full list; for very long lists, cap with <code>maxVisible</code> and paginate upstream.</li>
        <li>Motion follows <code>prefers-reduced-motion</code>: layering still changes, the tweens are removed.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-notification-stack">NotificationStack</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Renders a <code>section</code> landmark. Remaining props are spread onto it.
      </p>
      <PropsTable rows={[
        { prop: "notices", type: "NotificationStackNotice[]", default: "—", desc: "Ordered notices; index 0 is the front card" },
        { prop: "onDismiss", type: "(notice: NotificationStackNotice) => void", default: "—", desc: "Called as soon as a card is dismissed, at the start of its exit" },
        { prop: "maxVisible", type: "number", default: "3", desc: "Cards drawn in the collapsed stack (one readable, the rest peeking)" },
        { prop: "expanded", type: "boolean", default: "—", desc: "Controlled expansion — pair with onExpandedChange" },
        { prop: "defaultExpanded", type: "boolean", default: "false", desc: "Initial expansion when uncontrolled" },
        { prop: "onExpandedChange", type: "(expanded: boolean) => void", default: "—", desc: "Called when hover, focus, click, Escape or the toggle changes expansion" },
        { prop: "expandOnHover", type: "boolean", default: "true", desc: "Expand on mouse hover and keyboard focus; click/tap and the toggle always work" },
        { prop: "labels", type: "Partial<NotificationStackLabels>", default: "English", desc: "Override any user-facing string; unspecified keys (and individual tones) keep their English defaults" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root; defaults to full width up to 380px" },
        { prop: "ref", type: "React.Ref<HTMLElement>", default: "—", desc: "Ref to the root section" },
      ]} />

      <DocH3 id="api-notice">NotificationStackNotice</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Unique, stable identifier" },
        { prop: "title", type: "string", default: "—", desc: "Card heading; also names the dismiss button" },
        { prop: "text", type: "string", default: "—", desc: "Supporting message; line breaks are kept" },
        { prop: "badge", type: "string", default: "—", desc: "Small category pill above the title" },
        { prop: "tone", type: '"neutral" | "info" | "success" | "warning" | "danger"', default: '"neutral"', desc: "Semantic accent, icon and badge tint" },
        { prop: "action", type: "NotificationStackAction", default: "—", desc: "Optional single call to action" },
      ]} />

      <DocH3 id="api-action">NotificationStackAction</DocH3>
      <PropsTable rows={[
        { prop: "label", type: "string", default: "—", desc: "Button or link text" },
        { prop: "href", type: "string", default: "—", desc: "Render as a link" },
        { prop: "onClick", type: "() => void", default: "—", desc: "Fires for both buttons and links; does not dismiss" },
        { prop: "external", type: "boolean", default: "false", desc: "Open in a new tab with noopener noreferrer and an external glyph" },
      ]} />

      <DocH3 id="api-labels">NotificationStackLabels</DocH3>
      <PropsTable rows={[
        { prop: "region", type: "string", default: '"Recent notices"', desc: "Accessible name of the landmark" },
        { prop: "dismiss", type: "(title: string) => string", default: '"Dismiss {title}"', desc: "Accessible name of each dismiss button" },
        { prop: "hiddenCount", type: "(count: number) => string", default: '"{n} more notifications"', desc: "Summary of notices not shown while collapsed" },
        { prop: "expand", type: "string", default: '"Expand stack"', desc: "Toggle label while collapsed" },
        { prop: "collapse", type: "string", default: '"Collapse stack"', desc: "Toggle label while expanded" },
        { prop: "newTab", type: "string", default: '"(opens in a new tab)"', desc: "Screen-reader hint on external actions" },
        { prop: "added", type: "(titles: string[]) => string", default: '"New: {titles}"', desc: "Polite announcement for notices added after first render" },
        { prop: "tones", type: "Record<NotificationStackTone, string>", default: "English", desc: "Screen-reader prefix per tone (neutral is silent)" },
      ]} />
    </DocPage>
  )
}

function ActionsExample() {
  const [clicks, setClicks] = useState(0)
  const notices = useMemo<NotificationStackNotice[]>(
    () => [
      { id: "a1", badge: "Docs", title: "Read the migration guide", text: "Covers every breaking change.", tone: "info", action: { label: "Open guide", href: "https://example.com/guide", external: true } },
      { id: "a2", title: "Profile incomplete", text: "Add a photo so teammates recognise you.", tone: "warning", action: { label: "Complete profile", onClick: () => setClicks((c) => c + 1) } },
    ],
    [],
  )
  return (
    <ComponentPreview className="min-h-[260px] items-start">
      <div className="flex w-full flex-col items-center gap-4">
        <NotificationStack notices={notices} />
        <p className="text-sm text-muted-foreground tabular-nums">Button action clicked {clicks} times</p>
      </div>
    </ComponentPreview>
  )
}

function ControlledExpansionExample() {
  const [expanded, setExpanded] = useState(false)
  return (
    <ComponentPreview className="min-h-[260px] items-start">
      <div className="flex w-full flex-col items-center gap-4">
        <NotificationStack
          notices={BASIC.slice(0, 4)}
          expanded={expanded}
          onExpandedChange={setExpanded}
          expandOnHover={false}
          labels={{ hiddenCount: (n) => `+${n} hidden` }}
          maxVisible={2}
        />
        <p className="text-sm text-muted-foreground">State: {expanded ? "expanded" : "collapsed"}</p>
      </div>
    </ComponentPreview>
  )
}

let seq = 0

function ControlledListExample() {
  const [notices, setNotices] = useState<NotificationStackNotice[]>(() => EXTRA.slice(0, 3))
  const [log, setLog] = useState("Nothing dismissed yet")

  const add = () => {
    seq += 1
    setNotices((list) => [
      { id: `new-${seq}`, badge: "New", title: `Fresh notice #${seq}`, text: "Added from the parent.", tone: "info" },
      ...list,
    ])
  }

  return (
    <ComponentPreview className="min-h-[300px] items-start">
      <div className="flex w-full flex-col items-center gap-4">
        <NotificationStack
          notices={notices}
          onDismiss={(n) => {
            setLog(`Dismissed "${n.title}"`)
            setNotices((list) => list.filter((x) => x.id !== n.id))
          }}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={add}>
            Add notice
          </Button>
          <p className="text-sm text-muted-foreground">{log}</p>
        </div>
      </div>
    </ComponentPreview>
  )
}

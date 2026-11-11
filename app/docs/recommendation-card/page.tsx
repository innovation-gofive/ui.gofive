"use client"

import { useState } from "react"
import {
  RecommendationCard,
  type RecommendationOption,
} from "@/registry/new-york/ui/recommendation-card"
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
  { title: "Collapsed", href: "#collapsed", depth: 1 },
  { title: "Confidence levels", href: "#confidence", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Timed undo", href: "#timed-undo", depth: 1 },
  { title: "No undo window", href: "#no-undo", depth: 1 },
  { title: "Dismiss", href: "#dismiss", depth: 1 },
  { title: "Single option", href: "#single-option", depth: 1 },
  { title: "Rich reason", href: "#rich-reason", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "Behavior notes", href: "#behavior" },
  { title: "API Reference", href: "#api-reference" },
]

const plans: RecommendationOption[] = [
  {
    id: "weekly",
    label: "Weekly digest",
    reason: "Most people on your team prefer a single summary over many pings.",
    confidence: "high",
  },
  {
    id: "daily",
    label: "Daily summary",
    reason: "You open the app every morning, so a daily recap would land well.",
    confidence: "medium",
  },
  {
    id: "instant",
    label: "Instant alerts",
    reason: "Useful for urgent queues, but noisy for most workflows.",
    confidence: "low",
  },
]

const usageCode = `import { RecommendationCard } from "@/components/ui/recommendation-card"

<RecommendationCard
  title="Suggested plan"
  options={[
    { id: "weekly", label: "Weekly digest", reason: "…", confidence: "high" },
    { id: "daily", label: "Daily summary", reason: "…", confidence: "medium" },
  ]}
  onAccept={(option) => save(option.id)}
  onUndo={(option) => revert(option.id)}
  onCommit={(option) => confirm(option.id)}
/>`

export default function RecommendationCardPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Recommendation Card"]}
      title="Recommendation Card"
      description="A suggestion card with a recommended option, a reason, a low / medium / high confidence signal, switchable alternatives, accept with a timed undo, and dismiss."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/recommendation-card" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock className="mt-4" code={usageCode} />
      <ComponentPreview className="min-h-[260px]">
        <RecommendationCard title="Suggested plan" options={plans} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="collapsed">Collapsed</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Start with the reason folded away using <code>defaultOpen=&#123;false&#125;</code>. Picking an alternative
        opens it again so the new reason is visible.
      </p>
      <ComponentPreview className="min-h-[200px]">
        <RecommendationCard title="Suggested plan" options={plans} defaultOpen={false} />
      </ComponentPreview>

      <DocH3 id="confidence">Confidence levels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>low</code>, <code>medium</code> and <code>high</code> fill one, two or three bars. The level is always
        spelled out in text; omit <code>confidence</code> to hide the signal.
      </p>
      <ComponentPreview className="min-h-[200px]">
        <div className="flex w-full flex-col items-center gap-4">
          {(["low", "medium", "high"] as const).map((level) => (
            <RecommendationCard
              key={level}
              title={`Level: ${level}`}
              defaultOpen={false}
              options={[{ id: level, label: "Archive old files", reason: "Based on recent activity.", confidence: level }]}
            />
          ))}
          <RecommendationCard
            title="No signal"
            defaultOpen={false}
            options={[{ id: "none", label: "Archive old files", reason: "Based on recent activity." }]}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Own the shown option with <code>value</code> and <code>onValueChange</code>. Accepting always acts on the
        value you pass in.
      </p>
      <ControlledExample />

      <DocH3 id="timed-undo">Timed undo</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        After accepting, <strong>Undo</strong> stays available for <code>undoTimeout</code> ms (default 6000) with a
        countdown. Hovering or focusing the footer pauses it. When it runs out the acceptance is final and{" "}
        <code>onCommit</code> fires.
      </p>
      <TimedUndoExample />

      <DocH3 id="no-undo">No undo window</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>undoTimeout=&#123;0&#125;</code> commits immediately and never shows an undo button.
      </p>
      <ComponentPreview className="min-h-[200px]">
        <RecommendationCard title="Suggested plan" options={plans} undoTimeout={0} defaultOpen={false} />
      </ComponentPreview>

      <DocH3 id="dismiss">Dismiss</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Dismiss hides the card and calls <code>onDismiss</code>. Set <code>dismissible=&#123;false&#125;</code> to
        remove the action.
      </p>
      <DismissExample />

      <DocH3 id="single-option">Single option</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">With one option there is no alternatives menu or badge.</p>
      <ComponentPreview className="min-h-[200px]">
        <RecommendationCard
          title="Suggested label"
          options={[{ id: "bug", label: "Bug", reason: "The text mentions a crash on startup.", confidence: "high" }]}
        />
      </ComponentPreview>

      <DocH3 id="rich-reason">Rich reason</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>reason</code> is a <code>ReactNode</code>; line breaks in strings are preserved and long unbroken text
        wraps.
      </p>
      <ComponentPreview className="min-h-[220px]">
        <RecommendationCard
          title="A very long heading that will be truncated with an ellipsis when it runs out of room"
          options={[
            {
              id: "backup",
              label: "AWS backup in a region close to most of your customers",
              reason: (
                <>
                  Your data lives in <strong className="text-foreground">ap-southeast-1</strong>.{"\n"}
                  Keeping the backup close reduces restore time.
                </>
              ),
              confidence: "medium",
            },
          ]}
        />
      </ComponentPreview>

      <DocH3 id="labels">Localized labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is overridable through <code>labels</code>. Functions receive the option label so word order can
        follow the language.
      </p>
      <ComponentPreview className="min-h-[220px]">
        <RecommendationCard
          title="คำแนะนำสำหรับคุณ"
          options={[
            { id: "a", label: "สรุปรายสัปดาห์", reason: "ทีมของคุณส่วนใหญ่ชอบสรุปรวมมากกว่าแจ้งเตือนบ่อย ๆ", confidence: "high" },
            { id: "b", label: "สรุปรายวัน", reason: "คุณเปิดแอปทุกเช้า สรุปรายวันน่าจะเหมาะ", confidence: "medium" },
          ]}
          labels={{
            alternative: "ตัวเลือกอื่น",
            alternatives: "ตัวเลือกอื่น ๆ",
            recommended: "แนะนำ",
            accept: (label) => `ใช้${label}`,
            accepted: (label) => `ใช้${label}แล้ว`,
            undo: "เลิกทำ",
            undoExpired: "ไม่สามารถเลิกทำได้แล้ว",
            dismiss: "ปิด",
            confidence: { low: "มั่นใจน้อย", medium: "มั่นใจปานกลาง", high: "มั่นใจมาก" },
          }}
        />
      </ComponentPreview>

      <DocH2 id="behavior">Behavior notes</DocH2>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
        <li>The first entry of <code>options</code> is the recommendation; <code>id</code>s must be unique.</li>
        <li>An acceptance belongs to one option. Showing a different option (for example through a controlled <code>value</code>) clears it.</li>
        <li>While accepted the alternatives and dismiss actions are hidden. Switch before accepting, or undo first.</li>
        <li>Dismiss is only offered before accepting, so there is no pending timer to reconcile.</li>
        <li>Acceptance and the end of the undo window are announced through a polite live region. The timer is cleared on undo, option change and unmount.</li>
        <li>The alternatives menu is a portalled Radix menu: arrow keys, Home/End, Enter/Space, Escape (focus returns to the trigger) and collision-aware placement come built in.</li>
        <li>Keyboard accept and undo move focus to the Undo / Accept button that replaces the one pressed, so focus is never dropped to the page. Focus on Undo pauses the countdown until it leaves the footer.</li>
        <li>With no options the component renders nothing.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-recommendation-card">RecommendationCard</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Renders a <code>section</code>; extra props are spread onto it.
      </p>
      <PropsTable rows={[
        { prop: "options", type: "RecommendationOption[]", desc: "First entry is the recommendation, the rest are alternatives. Empty renders nothing" },
        { prop: "title", type: "string", default: "labels.title", desc: "Heading and accessible name of the region" },
        { prop: "value", type: "string", default: "—", desc: "Controlled id of the option shown — pair with onValueChange" },
        { prop: "defaultValue", type: "string", default: "first option", desc: "Initial option id when uncontrolled. Unknown ids fall back to the first option" },
        { prop: "onValueChange", type: "(id: string, option: RecommendationOption) => void", default: "—", desc: "Called when a different option is chosen in the menu" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled expanded state of the reason" },
        { prop: "defaultOpen", type: "boolean", default: "true", desc: "Initial expanded state when uncontrolled" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the reason is toggled, or opened by choosing another option while folded" },
        { prop: "undoTimeout", type: "number", default: "6000", desc: "Undo window in ms after accepting. Pauses on hover or focus. 0 commits immediately without undo" },
        { prop: "onAccept", type: "(option: RecommendationOption) => void", default: "—", desc: "Called the moment the user accepts the option shown" },
        { prop: "onUndo", type: "(option: RecommendationOption) => void", default: "—", desc: "Called when the user undoes inside the window" },
        { prop: "onCommit", type: "(option: RecommendationOption) => void", default: "—", desc: "Called once the acceptance is final: window expired, or immediately when undoTimeout is 0" },
        { prop: "onDismiss", type: "(option: RecommendationOption) => void", default: "—", desc: "Called when the card is dismissed; the card then renders nothing" },
        { prop: "dismissible", type: "boolean", default: "true", desc: "Show the dismiss action (before accepting only)" },
        { prop: "labels", type: "Partial<RecommendationCardLabels>", default: "English", desc: "Override any user-facing string; confidence accepts a partial record" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root (max width 440px by default)" },
      ]} />

      <DocH3 id="api-option">RecommendationOption</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Unique selection value" },
        { prop: "label", type: "string", desc: "Name shown in the menu, the accept button and the accepted message" },
        { prop: "reason", type: "React.ReactNode", desc: "Rationale shown in the collapsible body" },
        { prop: "confidence", type: '"low" | "medium" | "high"', default: "—", desc: "Signal for the option. Omit to hide it" },
      ]} />

      <DocH3 id="api-labels">RecommendationCardLabels</DocH3>
      <PropsTable rows={[
        { prop: "title", type: "string", default: '"Suggested for you"', desc: "Heading when no title prop is given" },
        { prop: "alternative", type: "string", default: '"Alternative"', desc: "Badge while a non-first option is shown" },
        { prop: "alternatives", type: "string", default: '"Alternatives"', desc: "Menu trigger text" },
        { prop: "recommended", type: "string", default: '"Recommended"', desc: "Tag on the first option in the menu" },
        { prop: "accept", type: "(label: string) => string", default: '"Accept <label>"', desc: "Accept button text. The default lowercases a leading capital only when followed by a lowercase letter" },
        { prop: "accepted", type: "(label: string) => string", default: '"<label> accepted"', desc: "Status text after accepting" },
        { prop: "undo", type: "string", default: '"Undo"', desc: "Undo button text" },
        { prop: "undoIn", type: "(seconds: number) => string", default: '"<n>s"', desc: "Remaining seconds shown beside the undo label" },
        { prop: "undoExpired", type: "string", default: '"Undo is no longer available"', desc: "Announced when the undo window closes" },
        { prop: "dismiss", type: "string", default: '"Dismiss"', desc: "Dismiss button text" },
        { prop: "confidence", type: "Record<RecommendationConfidence, string>", default: '"Low / Medium / High confidence"', desc: "Text for each signal level" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [id, setId] = useState("daily")

  return (
    <ComponentPreview className="min-h-[260px]">
      <div className="flex w-full flex-col items-center gap-4">
        <RecommendationCard title="Suggested plan" options={plans} value={id} onValueChange={setId} />
        <div className="flex flex-wrap items-center justify-center gap-2">
          {plans.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={p.id === id ? "default" : "outline"}
              onClick={() => setId(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Shown: <code>{id}</code>
        </p>
      </div>
    </ComponentPreview>
  )
}

function TimedUndoExample() {
  const [log, setLog] = useState<string[]>([])
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 4))

  return (
    <ComponentPreview className="min-h-[260px]">
      <div className="flex w-full flex-col items-center gap-4">
        <RecommendationCard
          title="Suggested plan"
          options={plans}
          undoTimeout={5000}
          onAccept={(o) => push(`accept: ${o.id}`)}
          onUndo={(o) => push(`undo: ${o.id}`)}
          onCommit={(o) => push(`commit: ${o.id}`)}
        />
        <ul className="min-h-16 text-center text-xs text-muted-foreground tabular-nums">
          {log.map((entry, i) => (
            <li key={`${entry}-${i}`}>{entry}</li>
          ))}
        </ul>
      </div>
    </ComponentPreview>
  )
}

function DismissExample() {
  const [round, setRound] = useState(0)

  return (
    <ComponentPreview className="min-h-[200px]">
      <div className="flex w-full flex-col items-center gap-4">
        <RecommendationCard key={round} title="Suggested plan" options={plans} defaultOpen={false} />
        <Button size="sm" variant="outline" onClick={() => setRound((r) => r + 1)}>
          Show again
        </Button>
      </div>
    </ComponentPreview>
  )
}

"use client"

import { useState } from "react"
import {
  DecisionInbox,
  type Decision,
  type DecisionAnswer,
} from "@/registry/new-york/ui/decision-inbox"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"
import { Button } from "@/components/ui/button"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Folded decisions", href: "#folded", depth: 1 },
  { title: "Handling answers", href: "#handling-answers", depth: 1 },
  { title: "All clear", href: "#all-clear", depth: 1 },
  { title: "Long content", href: "#long-content", depth: 1 },
  { title: "Localised", href: "#localised", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const basic: Decision[] = [
  {
    id: "deploy",
    title: "Deploy the payroll export job to production?",
    detail: "Staging checks passed 12 minutes ago.\nRollback is automatic if the first run fails.",
    primary: "Deploy",
    secondary: "Not now",
  },
  {
    id: "leave",
    title: "Approve 3 days of leave for Napat S.?",
    detail: "14 – 16 March. Two teammates are already out on the 15th.",
    primary: "Approve",
    secondary: "Decline",
  },
]

const folded: Decision[] = [
  {
    id: "a",
    title: "Approve the new vendor contract",
    detail: "Annual renewal, 4% increase over last year.",
    primary: "Approve",
    secondary: "Send back",
  },
  {
    id: "b",
    title: "Grant Somchai K. access to the finance workspace",
    detail: "Requested by his manager on Monday.",
    primary: "Grant access",
    secondary: "Deny",
    collapsed: true,
  },
  {
    id: "c",
    title: "Archive the 2023 onboarding project",
    primary: "Archive",
    secondary: "Keep",
    collapsed: true,
  },
]

const longContent: Decision[] = [
  {
    id: "long",
    title:
      "Publish the quarterly compensation review summary to every department head before the leadership offsite next week?",
    detail:
      "The summary includes salary bands for all teams.\nOnce published it cannot be unpublished, only superseded by a newer revision.",
    primary: "Publish to all department heads now",
    secondary: "Keep as draft and ask finance to review again",
  },
]

const thai: Decision[] = [
  {
    id: "th1",
    title: "อนุมัติคำขอลาพักร้อน 3 วันของคุณนภัทร?",
    detail: "วันที่ 14 – 16 มีนาคม\nมีเพื่อนร่วมทีมลาในวันที่ 15 อยู่แล้ว 2 คน",
    primary: "อนุมัติ",
    secondary: "ไม่อนุมัติ",
  },
  {
    id: "th2",
    title: "ปิดโครงการเก่าที่ไม่มีความเคลื่อนไหว?",
    primary: "ปิดโครงการ",
    secondary: "เก็บไว้",
    collapsed: true,
  },
]

export default function DecisionInboxPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Decision Inbox"]}
      title="Decision Inbox"
      description="A tray of open decisions — approvals an agent or workflow is waiting on. Each card has a title, optional detail and two quick answers; answering confirms briefly, then the card folds away."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/decision-inbox" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { DecisionInbox } from "@/components/ui/decision-inbox"

<DecisionInbox
  decisions={[
    { id: "1", title: "Deploy to production?", primary: "Deploy", secondary: "Not now" },
  ]}
  onDecide={(decision, answer) => save(decision.id, answer)}
/>`}
      />
      <ComponentPreview className="min-h-[260px]">
        <DecisionInbox decisions={basic} />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="folded">Folded decisions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>collapsed</code> to show a decision as one muted line. Click it to open, or answer the row above and the
        next folded row opens on its own.
      </p>
      <ComponentPreview className="min-h-[300px]">
        <DecisionInbox decisions={folded} />
      </ComponentPreview>

      <DocH3 id="handling-answers">Handling answers</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>onDecide</code> fires the moment a button is pressed. The component never removes items from your data, so
        persist answers yourself; change <code>key</code> to start over.
      </p>
      <ControlledExample />

      <DocH3 id="all-clear">All clear</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        With no decisions the header settles and the empty message shows. Answer the last card in the first example to see
        it animate there.
      </p>
      <ComponentPreview>
        <DecisionInbox decisions={[]} />
      </ComponentPreview>

      <DocH3 id="long-content">Long content</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Long titles and answer labels wrap instead of overflowing; folded titles truncate (the full text is in the native title tooltip).
      </p>
      <ComponentPreview className="min-h-[300px]">
        <div className="w-[320px] max-w-full">
          <DecisionInbox decisions={longContent} />
        </div>
      </ComponentPreview>

      <DocH3 id="localised">Localised</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every built-in string lives in <code>labels</code>, and <code>locale</code> formats the count.
      </p>
      <ComponentPreview className="min-h-[300px]">
        <DecisionInbox
          decisions={thai}
          locale="th-TH"
          labels={{
            pending: (_n, formatted) => `มี ${formatted} เรื่องรอการตัดสินใจจากคุณ`,
            allClear: "จัดการครบทุกเรื่องแล้ว",
            empty: "ไม่มีเรื่องที่รอคุณอยู่ เรื่องใหม่จะแสดงที่นี่",
          }}
        />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-decision-inbox">DecisionInbox</DocH3>
      <PropsTable rows={[
        { prop: "decisions", type: "Decision[]", desc: "Decisions to show, in order. Items added later start open unless they set collapsed" },
        { prop: "onDecide", type: "(decision: Decision, answer: DecisionAnswer) => void", default: "—", desc: "Called once per answer, when the button is pressed. answer is the slot, not the label" },
        { prop: "labels", type: "Partial<DecisionInboxLabels>", default: "English", desc: "Override pending, allClear and empty strings" },
        { prop: "locale", type: "string", default: "runtime locale", desc: "BCP 47 locale used to format the pending count" },
        { prop: "confirmDelay", type: "number", default: "1100", desc: "Milliseconds the confirmation shows before the row folds away" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root section" },
        { prop: "ref", type: "Ref<HTMLElement>", default: "—", desc: "Ref to the root section" },
        { prop: "...props", type: "ComponentProps<\"section\">", default: "—", desc: "Spread onto the root section" },
      ]} />

      <DocH3 id="api-decision">Decision</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable, unique key for the decision" },
        { prop: "title", type: "string", desc: "The question. Wraps when open, truncates when folded" },
        { prop: "detail", type: "string", default: "—", desc: "Optional context under the title. Newlines are preserved" },
        { prop: "primary", type: "string", desc: "Label of the emphasised answer; also the confirmation text if chosen" },
        { prop: "secondary", type: "string", desc: "Label of the lighter answer; also the confirmation text if chosen" },
        { prop: "collapsed", type: "boolean", default: "false", desc: "Start folded to a single line; opens on click" },
      ]} />

      <DocH3 id="api-labels">DecisionInboxLabels</DocH3>
      <PropsTable rows={[
        { prop: "pending", type: "(count: number, formatted: string) => string", default: "English plural", desc: "Header text while decisions wait. Use count for plural rules, formatted for display" },
        { prop: "allClear", type: "string", default: '"You\'re all caught up"', desc: "Header text when nothing is waiting" },
        { prop: "empty", type: "string", default: "English message", desc: "Message shown once every decision is answered" },
      ]} />

      <DocH3 id="api-types">Types</DocH3>
      <PropsTable rows={[
        { prop: "DecisionAnswer", type: '"primary" | "secondary"', desc: "Which answer slot was pressed" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [run, setRun] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const onDecide = (d: Decision, answer: DecisionAnswer) =>
    setLog((l) => [`${d.id}: ${answer === "primary" ? d.primary : d.secondary}`, ...l].slice(0, 4))

  return (
    <ComponentPreview className="min-h-[300px]">
      <div className="flex w-full flex-col items-center gap-4">
        <DecisionInbox key={run} decisions={basic} onDecide={onDecide} />
        <div className="flex w-full max-w-md items-start justify-between gap-4 text-sm text-muted-foreground">
          <ul className="tabular-nums">
            {log.length === 0 ? <li>No answers yet</li> : log.map((entry, i) => <li key={i}>{entry}</li>)}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => {
              setRun((r) => r + 1)
              setLog([])
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

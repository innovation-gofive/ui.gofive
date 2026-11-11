"use client"

import { useEffect, useRef, useState } from "react"
import {
  MessageActions,
  type MessageActionsProps,
  type MessageActionsReason,
} from "@/registry/new-york/ui/message-actions"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Quiet mode", href: "#quiet", depth: 1 },
  { title: "Choosing actions", href: "#actions", depth: 1 },
  { title: "Versions & regenerate", href: "#versions", depth: 1 },
  { title: "Feedback reasons", href: "#feedback", depth: 1 },
  { title: "Read aloud", href: "#speak", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "Accessibility", href: "#accessibility" },
  { title: "API Reference", href: "#api-reference" },
]

const ANSWER =
  "Short-term memory holds a few items for seconds, while long-term memory stores information for years. Rehearsal and sleep help move things from one to the other."

const ANSWERS = [
  ANSWER,
  "Short-term memory is a small, fast scratchpad. Long-term memory is the archive — slower to write, but nearly unlimited.",
  "Think of short-term memory as RAM and long-term memory as disk: one is volatile and quick, the other persistent and large.",
]

export default function MessageActionsPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Message Actions"]}
      title="Message Actions"
      description="The quiet icon toolbar under an AI answer — copy, regenerate with a version pager, thumbs up/down with a reasons popover, and read aloud."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/message-actions" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { MessageActions } from "@/components/ui/message-actions"

<div className="group/message">
  <p>{answer}</p>
  <MessageActions
    text={answer}
    onRegenerate={regenerate}
    onFeedback={(vote, reason, text) => save(vote, reason, text)}
  />
</div>`}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Put <code>group/message</code> on the element wrapping the whole message so hovering anywhere on it reveals the bar.
      </p>
      <ComponentPreview className="min-h-[160px]">
        <Message>
          <MessageActions text={ANSWER} />
        </Message>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="quiet">Quiet mode</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        By default the bar rests at 60% opacity and becomes fully visible on hover or focus within the message, while an action is running, and always on touch screens. Set <code>quiet=&#123;false&#125;</code> to keep it solid.
      </p>
      <ComponentPreview>
        <div className="flex w-full flex-col gap-4">
          <Message>
            <MessageActions text={ANSWER} />
          </Message>
          <Message>
            <MessageActions text={ANSWER} quiet={false} />
          </Message>
        </div>
      </ComponentPreview>

      <DocH3 id="actions">Choosing actions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>actions</code> picks and orders the buttons. <code>feedback</code> renders both thumbs together.
      </p>
      <ComponentPreview>
        <div className="flex w-full flex-col gap-4">
          <Message>
            <MessageActions text={ANSWER} actions={["copy", "feedback"]} quiet={false} />
          </Message>
          <Message>
            <MessageActions text={ANSWER} actions={["speak", "copy"]} quiet={false} />
          </Message>
        </div>
      </ComponentPreview>

      <DocH3 id="versions">Versions & regenerate</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>versions</code> (a count or the list) and a pager appears next to Regenerate once there are two or more. Drive it with <code>version</code> + <code>onVersionChange</code>, or leave it uncontrolled. While <code>regenerating</code> is true the icon spins and presses are ignored. A new version jumps to the newest, and each version keeps its own vote.
      </p>
      <VersionsExample />

      <DocH3 id="feedback">Feedback reasons</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A thumbs-down is reported immediately as <code>onFeedback(&quot;down&quot;)</code>, then opens a portalled popover. Submitting calls <code>onFeedback(&quot;down&quot;, reason, text)</code> with the stable reason <code>value</code>; treat it as an enrichment of the same vote. Reasons marked <code>freeText</code> reveal an optional field. Pass <code>reasons=&#123;[]&#125;</code> to skip the popover.
      </p>
      <FeedbackExample />

      <DocH3 id="speak">Read aloud</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Uncontrolled, the button runs a timed simulation (<code>speakDuration</code>). Controlled, pass <code>speaking</code> and drive it from a real speech engine — the component never ends playback on its own.
      </p>
      <SpeakExample />

      <DocH3 id="labels">Localized labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string — names, tooltips, announcements — comes from the <code>labels</code> object and the <code>reasons</code> list. Unset keys keep the English default.
      </p>
      <ComponentPreview>
        <Message>
          <p className="text-sm">หน่วยความจำระยะสั้นเก็บข้อมูลได้ไม่กี่รายการ ส่วนระยะยาวเก็บได้นานหลายปี</p>
          <MessageActions
            className="mt-3"
            text="หน่วยความจำระยะสั้นเก็บข้อมูลได้ไม่กี่รายการ"
            versions={2}
            quiet={false}
            reasons={THAI_REASONS}
            labels={{
              group: "การทำงานกับข้อความ",
              copy: "คัดลอก",
              copied: "คัดลอกแล้ว",
              regenerate: "สร้างใหม่",
              regenerating: "กำลังสร้างใหม่…",
              regenerateStarted: "กำลังสร้างคำตอบใหม่",
              versionGroup: "เวอร์ชันของคำตอบ",
              previousVersion: "เวอร์ชันก่อนหน้า",
              nextVersion: "เวอร์ชันถัดไป",
              versionOf: "เวอร์ชัน {current} จาก {total}",
              thumbsUp: "คำตอบดี",
              thumbsUpThanks: "ขอบคุณสำหรับความคิดเห็น",
              thumbsUpAnnounce: "ทำเครื่องหมายว่าเป็นคำตอบที่ดี",
              thumbsDown: "คำตอบไม่ดี",
              thumbsDownAnnounce: "ทำเครื่องหมายว่าเป็นคำตอบที่ไม่ดี โปรดบอกเราว่าผิดพลาดอย่างไรในหน้าต่างที่เปิดขึ้น",
              thumbsDownMarked: "ทำเครื่องหมายว่าเป็นคำตอบที่ไม่ดี",
              voteWithdrawn: "ยกเลิกความคิดเห็นแล้ว",
              feedbackTitle: "เกิดอะไรขึ้น?",
              feedbackClose: "ปิด",
              feedbackSubmit: "ส่งความคิดเห็น",
              feedbackSent: "ขอบคุณ",
              feedbackPlaceholder: "รายละเอียดเพิ่มเติม (ไม่บังคับ)",
              feedbackTextName: "รายละเอียดเพิ่มเติม",
              feedbackThanksAnnounce: "ขอบคุณสำหรับความคิดเห็น",
              speak: "อ่านออกเสียง",
              stopSpeaking: "หยุดอ่าน",
              speakStarted: "กำลังอ่านออกเสียง",
              speakStopped: "หยุดอ่านแล้ว",
              speakFinished: "อ่านจบแล้ว",
            }}
          />
        </Message>
      </ComponentPreview>

      <DocH2 id="accessibility">Accessibility</DocH2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>The bar is a labelled group of real buttons; names change with state (Copied, Stop playback).</li>
        <li>Thumbs and read-aloud expose <code>aria-pressed</code>; thumbs-down also exposes <code>aria-expanded</code> and <code>aria-controls</code>.</li>
        <li>One polite live region announces copy, regenerate, version changes, votes, thanks and playback. Identical repeats are still spoken.</li>
        <li>Quiet mode only dims — the bar stays in the tab order, and focus within restores full opacity. Tooltips open on keyboard focus.</li>
        <li>The reasons popover moves focus to the first reason, closes on <code>Esc</code> and returns focus to the thumbs-down button.</li>
        <li>All motion honours <code>prefers-reduced-motion</code>; the equalizer becomes a static pattern.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-message-actions">MessageActions</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Extra props are spread onto the root <code>div</code> (<code>data-slot=&quot;message-actions&quot;</code>).
      </p>
      <PropsTable rows={[
        { prop: "text", type: "string", default: "—", desc: "Message content — copied by Copy and used to estimate read-aloud length. Copy still confirms without it" },
        { prop: "actions", type: '("copy" | "regenerate" | "feedback" | "speak")[]', default: "all four", desc: "Which actions to render, in order. Unknown keys and duplicates are dropped" },
        { prop: "versions", type: "number | unknown[]", default: "1", desc: "Number of answers, or the list itself. The pager (inside the regenerate action) shows at 2 or more" },
        { prop: "version", type: "number", default: "—", desc: "Controlled current version, 0-based. Pair with onVersionChange" },
        { prop: "defaultVersion", type: "number", default: "newest", desc: "Initial version when uncontrolled" },
        { prop: "onVersionChange", type: "(index: number) => void", default: "—", desc: "Called with the new 0-based index when the user steps" },
        { prop: "onCopy", type: "(text?: string) => void", default: "—", desc: "Called on every copy press, after the clipboard attempt" },
        { prop: "onRegenerate", type: "() => void", default: "—", desc: "Called on regenerate press. Add a version afterwards and the pager jumps to it" },
        { prop: "regenerating", type: "boolean", default: "false", desc: "Busy flag: spins the icon, shows the busy tooltip, ignores presses, keeps the bar visible" },
        { prop: "onFeedback", type: "(vote: \"up\" | \"down\" | null, reason?: string, text?: string) => void", default: "—", desc: "Vote reports. null = withdrawn. A thumbs-down fires first without a reason, then again with the reason (and optional text) on submit" },
        { prop: "reasons", type: "MessageActionsReason[]", default: "4 built-in", desc: "Choices in the thumbs-down popover. An empty list skips the popover" },
        { prop: "onSpeak", type: "(playing: boolean) => void", default: "—", desc: "Called with the requested state, including when simulated playback ends" },
        { prop: "speaking", type: "boolean", default: "—", desc: "Controlled playing state. When set, no simulation or auto-stop runs" },
        { prop: "speakDuration", type: "number", default: "~380ms/word, min 2600", desc: "Simulated playback length in ms (uncontrolled only)" },
        { prop: "quiet", type: "boolean", default: "true", desc: "Dim the bar until hover/focus on it or on an ancestor with group/message" },
        { prop: "labels", type: "Partial<MessageActionsLabels>", default: "English", desc: "Override any user-facing string" },
        { prop: "className", type: "string", default: "—", desc: "Class on the root element" },
      ]} />

      <DocH3 id="api-reason">MessageActionsReason</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Stable, language-neutral id reported to onFeedback" },
        { prop: "label", type: "string", default: "—", desc: "Localized chip text (truncated with a full-text title)" },
        { prop: "freeText", type: "boolean", default: "false", desc: "Selecting it reveals an optional free-text field" },
      ]} />

      <DocH3 id="api-labels">MessageActionsLabels</DocH3>
      <PropsTable rows={[
        { prop: "group", type: "string", default: '"Reply tools"', desc: "Toolbar accessible name" },
        { prop: "copy / copied", type: "string", default: '"Copy" / "Copied"', desc: "Button name and tooltip; copied is also announced" },
        { prop: "regenerate", type: "string", default: '"Regenerate"', desc: "Button name and idle tooltip" },
        { prop: "regenerating", type: "string", default: '"Regenerating…"', desc: "Tooltip while busy" },
        { prop: "regenerateStarted", type: "string", default: "—", desc: "Announcement when regenerate is pressed" },
        { prop: "versionGroup", type: "string", default: '"Response versions"', desc: "Pager group name" },
        { prop: "previousVersion / nextVersion", type: "string", default: "—", desc: "Step button names" },
        { prop: "versionOf", type: "string", default: '"Version {current} of {total}"', desc: "Template for the counter's spoken name and the change announcement" },
        { prop: "thumbsUp / thumbsUpThanks / thumbsUpAnnounce", type: "string", default: "—", desc: "Name, tooltip after voting, announcement" },
        { prop: "thumbsDown / thumbsDownAnnounce / thumbsDownMarked", type: "string", default: "—", desc: "Name, announcement when the popover opens, announcement when there is no popover" },
        { prop: "voteWithdrawn", type: "string", default: "—", desc: "Announcement when a vote is withdrawn" },
        { prop: "feedbackTitle / feedbackClose", type: "string", default: "—", desc: "Popover heading and its close button name" },
        { prop: "feedbackSubmit / feedbackSent", type: "string", default: "—", desc: "Submit label before and after sending" },
        { prop: "feedbackPlaceholder / feedbackTextName", type: "string", default: "—", desc: "Free-text placeholder and its separate accessible name" },
        { prop: "feedbackThanksAnnounce", type: "string", default: "—", desc: "Announcement after submitting" },
        { prop: "speak / stopSpeaking", type: "string", default: "—", desc: "Button name and tooltip, idle and playing" },
        { prop: "speakStarted / speakStopped / speakFinished", type: "string", default: "—", desc: "Playback announcements" },
      ]} />
    </DocPage>
  )
}

const THAI_REASONS: MessageActionsReason[] = [
  { value: "inaccurate", label: "ไม่ถูกต้อง" },
  { value: "too-long", label: "ยาวเกินไป" },
  { value: "ignored-instructions", label: "ไม่ทำตามคำสั่ง" },
  { value: "other", label: "อื่น ๆ", freeText: true },
]

function Message({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/message w-full max-w-md rounded-xl border bg-card p-4 text-card-foreground">
      {children}
    </div>
  )
}

function VersionsExample() {
  const [count, setCount] = useState(2)
  const [version, setVersion] = useState(1)
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function regenerate() {
    setBusy(true)
    timer.current = setTimeout(() => {
      const next = Math.min(count + 1, ANSWERS.length + 2)
      setCount(next)
      setVersion(next - 1)
      setBusy(false)
    }, 1500)
  }

  return (
    <ComponentPreview>
      <Message>
        <p className="text-sm">{ANSWERS[version % ANSWERS.length]}</p>
        <MessageActions
          className="mt-3"
          text={ANSWERS[version % ANSWERS.length]}
          actions={["copy", "regenerate", "feedback"]}
          versions={count}
          version={version}
          onVersionChange={setVersion}
          regenerating={busy}
          onRegenerate={regenerate}
        />
      </Message>
    </ComponentPreview>
  )
}

function FeedbackExample() {
  const [log, setLog] = useState<string[]>([])
  const push: MessageActionsProps["onFeedback"] = (vote, reason, text) =>
    setLog(l =>
      [`onFeedback(${[vote === null ? "null" : `"${vote}"`, reason && `"${reason}"`, text && `"${text}"`].filter(Boolean).join(", ")})`, ...l].slice(0, 4),
    )

  return (
    <ComponentPreview className="min-h-[200px]">
      <div className="flex w-full flex-col gap-3">
        <Message>
          <MessageActions text={ANSWER} actions={["copy", "feedback"]} onFeedback={push} />
        </Message>
        <ul className="font-mono text-xs text-muted-foreground" aria-label="Feedback log">
          {log.length === 0 ? <li>Press a thumb…</li> : log.map((l, i) => <li key={`${i}-${l}`}>{l}</li>)}
        </ul>
      </div>
    </ComponentPreview>
  )
}

function SpeakExample() {
  const [speaking, setSpeaking] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  // Stand-in for a real speech engine.
  function toggle(next: boolean) {
    clearTimeout(timer.current)
    setSpeaking(next)
    if (next) timer.current = setTimeout(() => setSpeaking(false), 4000)
  }

  return (
    <ComponentPreview>
      <div className="flex w-full flex-col gap-4">
        <Message>
          <p className="mb-2 text-xs text-muted-foreground">Uncontrolled (3 s simulation)</p>
          <MessageActions text={ANSWER} actions={["speak"]} speakDuration={3000} quiet={false} />
        </Message>
        <Message>
          <p className="mb-2 text-xs text-muted-foreground">Controlled by the parent</p>
          <MessageActions text={ANSWER} actions={["speak"]} speaking={speaking} onSpeak={toggle} quiet={false} />
        </Message>
      </div>
    </ComponentPreview>
  )
}

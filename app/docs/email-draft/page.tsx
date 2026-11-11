"use client"

import { useEffect, useRef, useState } from "react"
import {
  EmailDraft,
  type EmailDraftPhase,
  type EmailRecipient,
} from "@/registry/new-york/ui/email-draft"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"
import { Button } from "@/registry/new-york/ui/button"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Streaming", href: "#streaming", depth: 1 },
  { title: "Controlled lifecycle", href: "#controlled", depth: 1 },
  { title: "Async send", href: "#async-send", depth: 1 },
  { title: "Attachment", href: "#attachment", depth: 1 },
  { title: "Validation", href: "#validation", depth: 1 },
  { title: "Localized labels", href: "#labels", depth: 1 },
  { title: "Sent and discarded", href: "#end-states", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const TO: EmailRecipient[] = [{ name: "Narin Chai", email: "narin@example.com" }]
const SUBJECT = "Your renewal is coming up"
const BODY = `Hi Narin,

Your annual plan renews on 1 December. Nothing to do on your side, but if you'd like to change seats before then, just reply to this email.

Thanks,
The Billing team`

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function EmailDraftPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Email Draft"]}
      title="Email Draft"
      description="An agent-written email held for human review: recipient chips, subject, body with view and edit modes, a streaming state, and send / edit / discard with sent and discarded receipts."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/email-draft" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { EmailDraft } from "@/components/ui/email-draft"

<EmailDraft
  agent="Billing agent"
  defaultRecipients={[{ name: "Narin Chai", email: "narin@example.com" }]}
  defaultSubject="Your renewal is coming up"
  defaultBody="Hi Narin, ..."
  onSend={async (email) => { await api.send(email) }}
  onDiscard={() => {}}
/>`}
      />
      <ComponentPreview className="min-h-[320px] items-start">
        <EmailDraft
          agent="Billing agent"
          defaultRecipients={TO}
          defaultSubject={SUBJECT}
          defaultBody={BODY}
          onSend={() => wait(900)}
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="streaming">Streaming</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Feed <code>body</code> as text arrives and set <code>streaming</code>. Editing and Send stay
        disabled until it flips to <code>false</code>; Discard remains available.
      </p>
      <StreamingExample />

      <DocH3 id="controlled">Controlled lifecycle</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Own the phase with <code>phase</code> and <code>onPhaseChange</code>, and every field with its
        value and change prop.
      </p>
      <ControlledExample />

      <DocH3 id="async-send">Async send</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The card stays in <code>sending</code> until the promise from <code>onSend</code> settles. This
        one fails the first time: a rejection returns to the draft with an error.
      </p>
      <AsyncExample />

      <DocH3 id="attachment">Attachment</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A proposed attachment can be removed and added back. Only the attachment still on the draft is
        in the payload and the receipt.
      </p>
      <ComponentPreview className="min-h-[300px] items-start">
        <EmailDraft
          agent="Billing agent"
          defaultRecipients={TO}
          defaultSubject="Invoice INV-2041"
          defaultBody={"Hi Narin,\n\nThe invoice for November is attached."}
          attachment="INV-2041.pdf"
        />
      </ComponentPreview>

      <DocH3 id="validation">Validation</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Type an address and press Enter or comma to add it; Backspace on an empty field removes the
        last chip. Invalid addresses are flagged, duplicates are ignored, and Send stays disabled until
        there is a valid recipient, a subject and a body.
      </p>
      <ComponentPreview className="min-h-[260px] items-start">
        <EmailDraft
          agent="Support agent"
          defaultRecipients={[
            { name: "Narin Chai", email: "narin@example.com" },
            { email: "not-an-email" },
          ]}
          defaultSubject=""
          defaultBody="Draft with a missing subject and a bad address."
        />
      </ComponentPreview>

      <DocH3 id="labels">Localized labels</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from <code>labels</code>. The receipt text is a function so it can place the
        recipient and file name wherever the language needs them.
      </p>
      <ComponentPreview className="min-h-[320px] items-start">
        <EmailDraft
          agent="ผู้ช่วยฝ่ายบัญชี"
          defaultRecipients={[{ name: "สมชาย ใจดี", email: "somchai@example.com" }]}
          defaultSubject="แจ้งการต่ออายุแพ็กเกจ"
          defaultBody={"เรียน คุณสมชาย\n\nแพ็กเกจของคุณจะต่ออายุในวันที่ 1 ธันวาคม"}
          attachment="ใบเสนอราคา.pdf"
          onSend={() => wait(700)}
          labels={{
            to: "ถึง",
            subject: "หัวข้อ",
            subjectPlaceholder: "เพิ่มหัวข้อ",
            bodyPlaceholder: "ยังไม่มีเนื้อหา",
            body: "เนื้อหาอีเมล",
            addRecipient: "เพิ่มผู้รับ",
            removeRecipient: "ลบ",
            invalidRecipient: "อีเมลไม่ถูกต้อง",
            edit: "แก้ไข",
            doneEditing: "เสร็จสิ้น",
            clickToEdit: "คลิกเพื่อแก้ไข",
            attach: "แนบ",
            removeAttachment: "ลบ",
            send: "ส่ง",
            sending: "กำลังส่ง…",
            discard: "ทิ้ง",
            undo: "เลิกทำ",
            stateWriting: "กำลังเขียน…",
            stateReady: "รอตรวจสอบ",
            stateSent: "ส่งแล้ว",
            stateDiscarded: "ทิ้งแล้ว",
            sendHint: "กด Ctrl + Enter เพื่อส่ง",
            sendError: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง",
            sentMessage: ({ recipients, attachment }) =>
              `ส่งถึง ${recipients} แล้ว${attachment ? ` พร้อมไฟล์ ${attachment}` : ""}`,
            discardedMessage: "ทิ้งร่างอีเมลแล้ว",
          }}
        />
      </ComponentPreview>

      <DocH3 id="end-states">Sent and discarded</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Both end states collapse to a one-line receipt with Undo. Undo returns to the draft with the
        text, recipients and attachment as they were; it does not recall an email already delivered by{" "}
        <code>onSend</code>, so pair it with <code>onUndo</code> if your backend can.
      </p>
      <ComponentPreview className="min-h-[140px] items-start">
        <div className="flex w-full flex-col items-center gap-4">
          <EmailDraft
            agent="Billing agent"
            defaultPhase="sent"
            defaultRecipients={TO}
            defaultSubject={SUBJECT}
            defaultBody={BODY}
            attachment="INV-2041.pdf"
          />
          <EmailDraft
            agent="Billing agent"
            defaultPhase="discarded"
            defaultRecipients={TO}
            defaultSubject={SUBJECT}
            defaultBody={BODY}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-email-draft">EmailDraft</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Remaining props are spread onto the root <code>div</code>. The root is a size container, so
        the layout adapts to its own width (the shortcut hint hides below about 26rem).
      </p>
      <PropsTable rows={[
        { prop: "recipients", type: "EmailRecipient[]", default: "—", desc: "Controlled recipients (to) — pair with onRecipientsChange" },
        { prop: "defaultRecipients", type: "EmailRecipient[]", default: "[]", desc: "Initial recipients when uncontrolled. EmailRecipient is { email: string; name?: string }" },
        { prop: "onRecipientsChange", type: "(recipients: EmailRecipient[]) => void", default: "—", desc: "Called when a chip is added or removed" },
        { prop: "subject", type: "string", default: "—", desc: "Controlled subject — pair with onSubjectChange" },
        { prop: "defaultSubject", type: "string", default: '""', desc: "Initial subject when uncontrolled" },
        { prop: "onSubjectChange", type: "(subject: string) => void", default: "—", desc: "Called as the subject is edited" },
        { prop: "body", type: "string", default: "—", desc: "Controlled body — pair with onBodyChange. Update it as text streams in" },
        { prop: "defaultBody", type: "string", default: '""', desc: "Initial body when uncontrolled" },
        { prop: "onBodyChange", type: "(body: string) => void", default: "—", desc: "Called as the body is edited" },
        { prop: "streaming", type: "boolean", default: "false", desc: "The agent is still writing: trailing caret, writing badge, edit and Send disabled" },
        { prop: "agent", type: "string", default: "—", desc: "Name of the agent that wrote the draft, shown in the header" },
        { prop: "attachment", type: "string | null", default: "null", desc: "Proposed attachment file name; removable and re-attachable. Nothing renders when empty" },
        { prop: "phase", type: '"draft" | "sending" | "sent" | "discarded"', default: "—", desc: "Controlled lifecycle phase — pair with onPhaseChange" },
        { prop: "defaultPhase", type: '"draft" | "sending" | "sent" | "discarded"', default: '"draft"', desc: "Initial phase when uncontrolled" },
        { prop: "onPhaseChange", type: "(phase: EmailDraftPhase) => void", default: "—", desc: "Called on every transition: sending, then sent (or back to draft on failure), discarded, and Undo" },
        { prop: "onSend", type: "(email: EmailDraftPayload) => void | Promise<void>", default: "—", desc: "Called on Send with { to, subject, body, attachment }. The phase stays sending until the promise settles; a rejection returns to draft with an error" },
        { prop: "onDiscard", type: "() => void", default: "—", desc: "Called immediately when Discard is pressed (Undo is the safety net)" },
        { prop: "onUndo", type: '(from: "sent" | "discarded") => void', default: "—", desc: "Called when Undo is pressed on the receipt. Purely a notification: it cannot recall a delivered email" },
        { prop: "error", type: "ReactNode", default: "—", desc: "Externally supplied error (e.g. the stream failed), shown as an alert above the footer" },
        { prop: "labels", type: "Partial<EmailDraftLabels>", default: "English defaults", desc: "Override any user-facing string (see below)" },
        { prop: "className", type: "string", default: "—", desc: "Extra classes on the root" },
      ]} />

      <DocH3 id="api-labels">EmailDraftLabels</DocH3>
      <PropsTable rows={[
        { prop: "to", type: "string", default: '"To"', desc: "Recipient row label" },
        { prop: "subject", type: "string", default: '"Subject"', desc: "Subject row label and the subject field's accessible name" },
        { prop: "subjectPlaceholder", type: "string", default: '"Add a subject"', desc: "Shown when the subject is empty" },
        { prop: "bodyPlaceholder", type: "string", default: '"Nothing written yet"', desc: "Shown when the body is empty" },
        { prop: "body", type: "string", default: '"Email body"', desc: "Accessible name of the body field" },
        { prop: "addRecipient", type: "string", default: '"Add recipient"', desc: "Placeholder and accessible name of the add-recipient field" },
        { prop: "removeRecipient", type: "string", default: '"Remove"', desc: "Verb prefix of each chip's remove button (+ name)" },
        { prop: "invalidRecipient", type: "string", default: '"Not a valid email address"', desc: "Announced and shown on hover for a malformed address" },
        { prop: "edit / doneEditing", type: "string", default: '"Edit" / "Done"', desc: "Edit-mode toggle label" },
        { prop: "clickToEdit", type: "string", default: '"Tap to change"', desc: "Tooltip on the subject and body in view mode" },
        { prop: "attach / removeAttachment", type: "string", default: '"Attach" / "Remove"', desc: "Verb prefixes of the add-back and remove attachment buttons (+ file name)" },
        { prop: "send / sending / discard / undo", type: "string", default: '"Send" / "Sending…" / "Discard" / "Undo"', desc: "Button labels" },
        { prop: "stateWriting / stateReady / stateSent / stateDiscarded", type: "string", default: '"Drafting…" / "Awaiting your review" / "Sent" / "Removed"', desc: "State badge text" },
        { prop: "sendHint", type: "string", default: '"Ctrl + Enter to send"', desc: "Visible shortcut hint; also the Send button's accessible description" },
        { prop: "sendError", type: "string", default: '"Couldn\'t send. Please try again."', desc: "Alert shown when onSend rejects" },
        { prop: "sentMessage", type: "(info: { recipients: string; attachment: string | null }) => string", default: '"Sent to …"', desc: "Receipt text after sending; recipients is a comma-joined list" },
        { prop: "discardedMessage", type: "string", default: '"Draft removed"', desc: "Receipt text after discarding" },
      ]} />

      <DocH3 id="api-payload">EmailDraftPayload</DocH3>
      <PropsTable rows={[
        { prop: "to", type: "EmailRecipient[]", desc: "Every recipient chip on the draft" },
        { prop: "subject", type: "string", desc: "Final subject" },
        { prop: "body", type: "string", desc: "Final body text" },
        { prop: "attachment", type: "string | null", desc: "The attachment still on the draft, or null if none or removed" },
      ]} />

      <DocH3 id="api-keyboard">Keyboard</DocH3>
      <PropsTable rows={[
        { prop: "Ctrl / Cmd + Enter", type: "send", desc: "Sends from anywhere inside the card, when the draft is sendable" },
        { prop: "Escape", type: "exit edit", desc: "Leaves edit mode (text is kept) and returns focus to the Edit toggle" },
        { prop: "Enter (subject)", type: "next field", desc: "Moves focus to the body instead of inserting a newline" },
        { prop: "Enter / comma (recipient)", type: "add chip", desc: "Adds the typed address as a chip" },
        { prop: "Backspace (empty recipient field)", type: "remove chip", desc: "Removes the last recipient" },
      ]} />
    </DocPage>
  )
}

const STREAM_TEXT =
  "Hi Narin,\n\nYour annual plan renews on 1 December. Nothing to do on your side, but if you'd like to change seats before then, just reply to this email.\n\nThanks,\nThe Billing team"

function StreamingExample() {
  const [body, setBody] = useState("")
  const [streaming, setStreaming] = useState(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 3
      setBody(STREAM_TEXT.slice(0, i))
      if (i >= STREAM_TEXT.length) {
        clearInterval(id)
        setStreaming(false)
      }
    }, 40)
    return () => clearInterval(id)
  }, [run])

  return (
    <ComponentPreview className="min-h-[340px] items-start">
      <div className="flex w-full flex-col items-center gap-3">
        <EmailDraft
          agent="Billing agent"
          streaming={streaming}
          defaultRecipients={TO}
          defaultSubject={SUBJECT}
          body={body}
          onBodyChange={setBody}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setBody("")
            setStreaming(true)
            setRun((r) => r + 1)
          }}
        >
          Restart stream
        </Button>
      </div>
    </ComponentPreview>
  )
}

function ControlledExample() {
  const [phase, setPhase] = useState<EmailDraftPhase>("draft")
  const [to, setTo] = useState<EmailRecipient[]>(TO)
  const [subject, setSubject] = useState(SUBJECT)
  const [body, setBody] = useState(BODY)
  const [log, setLog] = useState<string[]>([])
  const note = (msg: string) => setLog((l) => [msg, ...l].slice(0, 4))

  return (
    <ComponentPreview className="min-h-[340px] items-start">
      <div className="flex w-full flex-col items-center gap-3">
        <EmailDraft
          agent="Billing agent"
          phase={phase}
          onPhaseChange={(p) => {
            setPhase(p)
            note(`phase → ${p}`)
          }}
          recipients={to}
          onRecipientsChange={setTo}
          subject={subject}
          onSubjectChange={setSubject}
          body={body}
          onBodyChange={setBody}
          onSend={() => wait(1200)}
          onDiscard={() => note("onDiscard")}
          onUndo={(from) => note(`onUndo (from ${from})`)}
        />
        <p className="w-full max-w-[32rem] text-xs text-muted-foreground tabular-nums">
          {to.length} recipient{to.length === 1 ? "" : "s"} · {body.length} characters ·{" "}
          {log.join(" · ") || "no events yet"}
        </p>
      </div>
    </ComponentPreview>
  )
}

function AsyncExample() {
  const attempts = useRef(0)

  return (
    <ComponentPreview className="min-h-[340px] items-start">
      <EmailDraft
        agent="Billing agent"
        defaultRecipients={TO}
        defaultSubject={SUBJECT}
        defaultBody={BODY}
        onSend={async () => {
          await wait(1000)
          attempts.current += 1
          if (attempts.current === 1) throw new Error("network")
        }}
      />
    </ComponentPreview>
  )
}

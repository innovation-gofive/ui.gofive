"use client"

import { useEffect, useRef, useState } from "react"
import { Bot } from "lucide-react"
import { AssistantChat } from "@/registry/new-york/ui/assistant-chat"
import type { AssistantChatMessage } from "@/registry/new-york/ui/assistant-chat"
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
  { title: "Streaming", href: "#streaming", depth: 1 },
  { title: "Errors and retry", href: "#retry", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Live demo", href: "#live", depth: 1 },
  { title: "Dictation", href: "#dictation", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const SUGGESTIONS = [
  "How many vacation days do I have left?",
  "Show this month's overtime summary",
  "Who is on leave next week?",
]

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function answer(message: string) {
  await wait(900)
  return `You asked: “${message}”. This is a sample reply; wire \`respond\` to your own backend.`
}

async function* stream(message: string) {
  await wait(600)
  const words = `Here is a streamed answer to “${message}”. Each chunk is appended to the same message as it arrives, so the text grows word by word.`.split(" ")
  for (const w of words) {
    await wait(70)
    yield `${w} `
  }
}

const frame = "flex w-full justify-center"
const previewClass = "min-h-[520px] items-start"

export default function AssistantChatPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Assistant Chat"]}
      title="Assistant Chat"
      description="A compact AI assistant card with a welcome screen, suggestion chips, streaming replies, inline retry and optional voice dictation. Give it a respond function or drive it yourself."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/assistant-chat" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { AssistantChat } from "@/components/ui/assistant-chat"

<AssistantChat
  name="HR Assistant"
  tagline="Ask about leave, payroll and policies"
  suggestions={["How many vacation days do I have left?"]}
  respond={async (message, history) => {
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message, history }) })
    return (await res.json()).reply
  }}
/>`}
      />
      <ComponentPreview className={previewClass}>
        <div className={frame}>
          <AssistantChat
            name="HR Assistant"
            tagline="Ask about leave, payroll and policies"
            suggestions={SUGGESTIONS}
            respond={answer}
          />
        </div>
      </ComponentPreview>
      <p className="mt-2 text-sm text-muted-foreground">
        The card fills its container up to 380 px wide and 30 rem tall; override with{" "}
        <code>className</code> (e.g. <code>h-full</code>). Enter sends, Shift+Enter adds a line, and
        the field grows to four lines before it scrolls. Enter while an IME is composing (Thai,
        Japanese…) only confirms the candidate.
      </p>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="streaming">Streaming</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>respond</code> may return a string, a promise, or an async iterable of chunks. The
        typing indicator shows until the first chunk. Screen readers hear only the finished reply,
        never each chunk.
      </p>
      <ComponentPreview className={previewClass}>
        <div className={frame}>
          <AssistantChat
            name="Streaming"
            tagline="Async iterable replies"
            greeting="Send anything to watch the reply stream in."
            suggestions={["Summarize the leave policy"]}
            respond={stream}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="retry">Errors and retry</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A thrown error or rejected promise turns the reply into an inline error with a Retry button.
        Retry removes the failed reply and asks again with the same history. Here every first attempt
        fails.
      </p>
      <RetryExample />

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>messages</code> + <code>onMessagesChange</code> to own the list, and skip{" "}
        <code>respond</code> to produce replies yourself from <code>onSend</code>. Use{" "}
        <code>pending</code> to show the typing indicator while you work. A failed reply is just a
        message with <code>status: &quot;error&quot;</code>; <code>onRetry</code> tells you when it is
        pressed.
      </p>
      <ControlledExample />

      <DocH3 id="live">Live demo</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A scripted conversation driven by timers in an effect, using the controlled API.
      </p>
      <LiveExample />

      <DocH3 id="dictation">Dictation</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>dictation</code> adds a microphone toggle, but only in browsers that implement the Web
        Speech API; elsewhere the button is not rendered. Set <code>dictationLang</code> to the
        language being spoken. The button is a toggle: <code>aria-pressed</code> reflects the state
        and its label names the next action.
      </p>
      <ComponentPreview className={previewClass}>
        <div className={frame}>
          <AssistantChat
            name="Voice assistant"
            tagline="Tap the mic and speak"
            dictation
            dictationLang="en-US"
            respond={answer}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string is a prop or lives in <code>labels</code>. Merging is key by key, so an{" "}
        <code>undefined</code> value keeps the English default.
      </p>
      <ComponentPreview className={previewClass}>
        <div className={frame}>
          <AssistantChat
            name="ผู้ช่วย HR"
            tagline="ถามเรื่องวันลา เงินเดือน และนโยบาย"
            greeting="สวัสดี มีอะไรให้ช่วยไหม"
            suggestions={["วันลาพักร้อนเหลือกี่วัน", "สรุปค่าล่วงเวลาเดือนนี้"]}
            dictation
            dictationLang="th-TH"
            respond={answer}
            labels={{
              newChat: "เริ่มแชทใหม่",
              conversation: "บทสนทนา",
              suggestions: "คำถามแนะนำ",
              input: "ข้อความ",
              placeholder: "พิมพ์ข้อความ…",
              send: "ส่งข้อความ",
              thinking: "กำลังคิด…",
              error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
              retry: "ลองอีกครั้ง",
              startDictation: "เริ่มพูดเพื่อพิมพ์",
              stopDictation: "หยุดพูดเพื่อพิมพ์",
              listening: "กำลังฟัง…",
              dictationError: "ใช้การพูดเพื่อพิมพ์ไม่ได้ในขณะนี้",
              you: "คุณ:",
              assistantSaid: "ผู้ช่วย:",
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-assistant-chat">AssistantChat</DocH3>
      <PropsTable rows={[
        { prop: "name", type: "string", default: '"Assistant"', desc: "Header title; also the accessible name of the card" },
        { prop: "tagline", type: "string", default: "—", desc: "Short line under the name" },
        { prop: "avatar", type: "ReactNode", default: "Sparkles", desc: "Header avatar, rendered inside a 36 px round tile" },
        { prop: "greeting", type: "ReactNode", default: '"Hi! How can I help you today?"', desc: "Welcome-state line, shown while the conversation is empty" },
        { prop: "suggestions", type: "string[]", default: "—", desc: "Welcome-state chips; clicking one sends its text as a message" },
        { prop: "messages", type: "AssistantChatMessage[]", default: "—", desc: "Controlled conversation" },
        { prop: "defaultMessages", type: "AssistantChatMessage[]", default: "[]", desc: "Initial conversation when uncontrolled" },
        { prop: "onMessagesChange", type: "(messages: AssistantChatMessage[]) => void", default: "—", desc: "Every list change: user send, each streamed chunk, error, retry, new chat" },
        { prop: "respond", type: "(message: string, history: AssistantChatMessage[]) => AssistantChatResponse", default: "—", desc: "Produces the reply; history is every earlier non-failed message, without the one being answered. Throwing or rejecting shows the inline retry. Omit to answer from onSend" },
        { prop: "onSend", type: "(message: string) => void", default: "—", desc: "Every user message, typed or chip, whether or not respond is set" },
        { prop: "onRetry", type: "(failed: AssistantChatMessage) => void", default: "—", desc: "Retry pressed. The failed message is already removed from the list; with respond set the component re-asks it" },
        { prop: "onNewChat", type: "() => void", default: "—", desc: "New chat pressed, after the list is cleared and any in-flight reply cancelled" },
        { prop: "pending", type: "boolean", default: "—", desc: "Forces the typing indicator and blocks sending; overrides the internal flag set while respond runs" },
        { prop: "dictation", type: "boolean", default: "false", desc: "Show a microphone toggle when the browser supports speech recognition" },
        { prop: "dictationLang", type: "string", default: "page lang", desc: "BCP-47 recognition language, e.g. th-TH" },
        { prop: "renderMessage", type: "(message: AssistantChatMessage) => ReactNode", default: "plain text", desc: "Custom message body, e.g. a markdown renderer" },
        { prop: "labels", type: "Partial<AssistantChatLabels>", default: "English", desc: "newChat, conversation, suggestions, input, placeholder, send, thinking, error, retry, empty, startDictation, stopDictation, listening, dictationError, you, assistantSaid" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the outer frame (default w-full max-w-[380px] h-[30rem]); other div props are spread there" },
      ]} />

      <DocH3 id="api-message">AssistantChatMessage</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable key" },
        { prop: "role", type: '"user" | "assistant"', desc: "Speaker; user messages render as bubbles, assistant messages as plain text" },
        { prop: "content", type: "string", desc: "Message text" },
        { prop: "status", type: '"streaming" | "error"', default: "—", desc: "streaming: reply still arriving. error: shows the error panel and, on the last message, Retry" },
        { prop: "error", type: "string", default: "labels.error", desc: "Text in the error panel" },
      ]} />

      <DocH3 id="api-response">AssistantChatResponse</DocH3>
      <PropsTable rows={[
        { prop: "string", type: "string", desc: "A finished reply" },
        { prop: "Promise<string>", type: "Promise<string>", desc: "Typing indicator until it resolves; rejection shows the retry" },
        { prop: "AsyncIterable<string>", type: "AsyncIterable<string>", desc: "Chunks appended in order; the indicator hides on the first chunk" },
      ]} />
    </DocPage>
  )
}

function RetryExample() {
  const attempts = useRef(new Map<string, number>())

  return (
    <ComponentPreview className={previewClass}>
      <div className={frame}>
        <AssistantChat
          name="Flaky backend"
          tagline="First try always fails"
          suggestions={["Show my payslip"]}
          respond={async (message) => {
            await wait(700)
            const n = (attempts.current.get(message) ?? 0) + 1
            attempts.current.set(message, n)
            if (n === 1) throw new Error("upstream timeout")
            return `Attempt ${n} worked for “${message}”.`
          }}
        />
      </div>
    </ComponentPreview>
  )
}

function ControlledExample() {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ComponentPreview className={previewClass}>
      <div className="flex w-full flex-col items-center gap-3">
        <AssistantChat
          name="Controlled"
          messages={messages}
          onMessagesChange={setMessages}
          pending={pending}
          suggestions={["Reply please"]}
          onSend={(text) => {
            setPending(true)
            timer.current = setTimeout(() => {
              setMessages((m) => [
                ...m,
                { id: `a-${m.length}`, role: "assistant", content: `Echo from the parent: ${text}` },
              ])
              setPending(false)
            }, 900)
          }}
          onNewChat={() => {
            clearTimeout(timer.current)
            setPending(false)
          }}
        />
        <p className="text-sm text-muted-foreground">{messages.length} messages in parent state</p>
      </div>
    </ComponentPreview>
  )
}

const SCRIPT: [number, string][] = [
  [0, "How many vacation days do I have left?"],
  [1, "You have 8 vacation days left this year, 2 of them expire on 31 December."],
  [0, "Can I take Friday off?"],
  [1, "Friday is free on the team calendar, so I can file the request for you."],
]

function LiveExample() {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([])
  const [pending, setPending] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let at = 600
    SCRIPT.forEach(([who, content], i) => {
      if (who === 1) {
        timers.push(setTimeout(() => setPending(true), at))
        at += 1500
      }
      timers.push(
        setTimeout(() => {
          setPending(false)
          setMessages((m) => [...m, { id: `s-${i}`, role: who ? "assistant" : "user", content }])
        }, at),
      )
      at += 1200
    })
    return () => timers.forEach(clearTimeout)
  }, [run])

  return (
    <ComponentPreview className={previewClass}>
      <div className="flex w-full flex-col items-center gap-3">
        <AssistantChat
          name="Live demo"
          tagline="Scripted conversation"
          avatar={<Bot />}
          messages={messages}
          onMessagesChange={setMessages}
          pending={pending}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setMessages([])
            setPending(false)
            setRun((r) => r + 1)
          }}
        >
          Replay
        </Button>
      </div>
    </ComponentPreview>
  )
}

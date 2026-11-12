"use client"

import { useEffect, useRef, useState } from "react"
import { BookUser, CalendarDays, FileText, Mail, Users, Wallet } from "lucide-react"
import { ChatComposer } from "@/registry/new-york/ui/chat-composer"
import type {
  ChatComposerApp,
  ChatComposerFolder,
  ChatComposerModel,
  ChatComposerSendMeta,
} from "@/registry/new-york/ui/chat-composer"
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
  { title: "Toolbar pickers", href: "#pickers", depth: 1 },
  { title: "Secondary action", href: "#action", depth: 1 },
  { title: "Voice input", href: "#voice", depth: 1 },
  { title: "Live typing", href: "#live", depth: 1 },
  { title: "Narrow container", href: "#narrow", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const models: ChatComposerModel[] = [
  { id: "fast", name: "Fast", description: "Quick answers for everyday questions" },
  { id: "balanced", name: "Balanced", description: "Good default for most tasks" },
  { id: "deep", name: "Deep analysis", description: "Slower, for reports and comparisons" },
]

const folders: ChatComposerFolder[] = [
  { id: "onboarding", name: "Onboarding" },
  { id: "payroll", name: "Payroll 2026" },
  { id: "policies", name: "Company policies and employee handbook (Thai and English editions)" },
]

const apps: ChatComposerApp[] = [
  { id: "calendar", name: "Team calendar", icon: <CalendarDays /> },
  { id: "directory", name: "Employee directory", icon: <BookUser /> },
  { id: "mail", name: "Mailbox", icon: <Mail /> },
  { id: "payroll", name: "Payroll", icon: <Wallet /> },
  { id: "teams", name: "Teams", icon: <Users /> },
  { id: "docs", name: "Documents", icon: <FileText /> },
]

const DRAFT = "Summarise who is on leave next week and flag any team below minimum cover."

export default function ChatComposerPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Chat Composer"]}
      title="Chat Composer"
      description="The main input for an AI assistant: an auto-growing message field with a model picker, folder and app menus, voice dictation and an optional secondary action. Enter sends, Shift+Enter adds a line, and IME composition is never interrupted."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/chat-composer" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ChatComposer } from "@/components/ui/chat-composer"`}
      />
      <CodeBlock
        className="mt-4"
        language="tsx"
        code={`<ChatComposer
  placeholder="Ask the HR assistant…"
  models={models}
  folders={folders}
  apps={apps}
  onAttach={openFilePicker}
  onSend={(message, { model, folder, apps }) => ask(message, model, folder, apps)}
/>`}
      />
      <ComponentPreview className="min-h-[140px]">
        <BasicExample />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="pickers">Toolbar pickers</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The model picker defaults to the first model. Picking the selected folder again clears it, and
        long folder names truncate with a tooltip. Apps are a checkbox menu that stays open while you
        toggle; the first three connected apps show as overlapping marks. Each picker is hidden when its
        list is empty. Everything here is controlled so the current selection can be shown.
      </p>
      <PickersExample />

      <DocH3 id="action">Secondary action</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>onAction</code> may return a promise: the button is busy until it settles. Use{" "}
        <code>busy</code> instead when the work is tracked elsewhere. Busy and done are announced to
        screen readers.
      </p>
      <ActionExample />

      <DocH3 id="voice">Voice input</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The mic uses the browser&apos;s Web Speech API and is hidden where it is missing. While you
        speak the transcript is previewed above the toolbar, interim words muted; on stop it is added to
        the message. <kbd>Esc</kbd> throws the dictation away. The language comes from{" "}
        <code>speechLang</code>, then the page&apos;s <code>lang</code>. Pass <code>onVoice</code> to
        keep the button in unsupported browsers and run your own transcription.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <div className="w-full max-w-xl">
          <ChatComposer speechLang="th-TH" placeholder="พูดหรือพิมพ์ข้อความ…" />
        </div>
      </ComponentPreview>

      <DocH3 id="live">Live typing</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A timer types a draft into the controlled field. The field grows with the text, and any edit or
        send stops the demo.
      </p>
      <LiveExample />

      <DocH3 id="narrow">Narrow container</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The composer fills its container up to <code>max-w-3xl</code>. In tight spaces the folder label
        shortens first, then the app and action labels fold into their icons.
      </p>
      <ComponentPreview>
        <div className="w-[320px] max-w-full">
          <ChatComposer
            models={models}
            folders={folders}
            apps={apps}
            defaultFolder="payroll"
            defaultConnectedApps={["calendar", "mail"]}
            onAttach={() => {}}
            actionLabel="Request approval"
            onAction={() => {}}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from <code>placeholder</code> and the <code>labels</code> prop.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <ChatComposer
            placeholder="ถามผู้ช่วย HR ได้เลย…"
            models={[{ id: "fast", name: "เร็ว" }, { id: "deep", name: "วิเคราะห์เชิงลึก" }]}
            folders={[{ id: "policy", name: "นโยบายบริษัท" }]}
            apps={[{ id: "cal", name: "ปฏิทินทีม", icon: <CalendarDays /> }]}
            onAttach={() => {}}
            speechLang="th-TH"
            labels={{
              message: "ข้อความ",
              send: "ส่งข้อความ",
              attach: "แนบไฟล์",
              model: "โมเดล",
              folder: "โฟลเดอร์",
              folderMenu: "ทำงานในโฟลเดอร์",
              connectApps: "เชื่อมต่อแอป",
              appsMenu: "แอปที่เชื่อมต่อ",
              startVoice: "เริ่มป้อนด้วยเสียง",
              stopVoice: "หยุดป้อนด้วยเสียง",
              listening: "กำลังฟัง…",
              voiceHint: "กด Esc เพื่อยกเลิก",
              modelSelected: "โมเดล: {name}",
              folderSelected: "โฟลเดอร์: {name}",
              folderCleared: "ล้างโฟลเดอร์แล้ว",
              appConnected: "เชื่อมต่อ {name} แล้ว",
              appDisconnected: "ยกเลิกการเชื่อมต่อ {name} แล้ว",
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-chat-composer">ChatComposer</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled message text" },
        { prop: "defaultValue", type: "string", default: '""', desc: "Initial text when uncontrolled" },
        { prop: "onValueChange", type: "(value: string) => void", default: "—", desc: "Called on every edit, including dictated text" },
        { prop: "placeholder", type: "string", default: '"Ask anything…"', desc: "Hint shown in the empty field" },
        { prop: "onSend", type: "(message: string, meta: ChatComposerSendMeta) => void", default: "—", desc: "Called with the trimmed text on Enter or send. Uncontrolled text clears afterwards; with `value` you clear it yourself" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disables the field and every control" },
        { prop: "maxFieldHeight", type: "number", default: "200", desc: "Height in px at which the field stops growing and scrolls" },
        { prop: "onAttach", type: "() => void", default: "—", desc: "Shows the attach button" },
        { prop: "models", type: "ChatComposerModel[]", default: "[]", desc: "Model choices; the picker is hidden when empty" },
        { prop: "model", type: "string", default: "—", desc: "Controlled model id" },
        { prop: "defaultModel", type: "string", default: "first model", desc: "Initial model id when uncontrolled" },
        { prop: "onModelChange", type: "(id: string) => void", default: "—", desc: "Called when another model is picked" },
        { prop: "folders", type: "ChatComposerFolder[]", default: "[]", desc: "Folder choices; hidden when empty" },
        { prop: "folder", type: "string | null", default: "—", desc: "Controlled folder id; null means none" },
        { prop: "defaultFolder", type: "string | null", default: "null", desc: "Initial folder id when uncontrolled" },
        { prop: "onFolderChange", type: "(id: string | null) => void", default: "—", desc: "Called on pick; null when the selected folder is picked again" },
        { prop: "apps", type: "ChatComposerApp[]", default: "[]", desc: "Apps in the connect menu; hidden when empty" },
        { prop: "connectedApps", type: "string[]", default: "—", desc: "Controlled connected app ids" },
        { prop: "defaultConnectedApps", type: "string[]", default: "[]", desc: "Initial connected ids when uncontrolled" },
        { prop: "onConnectedAppsChange", type: "(ids: string[]) => void", default: "—", desc: "Called with the full list after each toggle" },
        { prop: "maxAppMarks", type: "number", default: "3", desc: "Connected apps shown as marks before a +N counter" },
        { prop: "actionLabel", type: "string", default: "—", desc: "Text of the secondary action button; the button is hidden without it" },
        { prop: "actionIcon", type: "ReactNode", default: "—", desc: "Leading icon, replaced by a spinner while busy" },
        { prop: "onAction", type: "() => void | Promise<unknown>", default: "—", desc: "Click handler; a returned promise keeps the button busy until it settles" },
        { prop: "busy", type: "boolean", default: "false", desc: "Forces the busy state (spinner, disabled, announced)" },
        { prop: "speechLang", type: "string", default: "document lang", desc: 'BCP-47 tag for dictation, e.g. "th-TH"; falls back to the page lang, then the browser language' },
        { prop: "onVoice", type: "(listening: boolean) => void", default: "—", desc: "Called when voice starts or stops. Keeps the mic visible where dictation is unsupported" },
        { prop: "labels", type: "Partial<ChatComposerLabels>", default: "English", desc: "message, send, attach, model, folder, folderMenu, connectApps, appsMenu, startVoice, stopVoice, listening, voiceHint, voiceStarted, voiceStopped, voiceDiscarded, voiceError, modelSelected, folderSelected, folderCleared, appConnected, appDisconnected, actionBusy, actionDone. Templates use {name}" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root (w-full max-w-3xl); other div props are spread there" },
      ]} />

      <DocH3 id="api-chat-composer-send-meta">ChatComposerSendMeta</DocH3>
      <PropsTable rows={[
        { prop: "model", type: "string | null", desc: "Selected model id, or null without models" },
        { prop: "folder", type: "string | null", desc: "Selected folder id, or null" },
        { prop: "apps", type: "string[]", desc: "Connected app ids, in the order of the apps list" },
      ]} />

      <DocH3 id="api-chat-composer-model">ChatComposerModel</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable id reported to onSend and onModelChange" },
        { prop: "name", type: "string", desc: "Label on the picker and in the menu" },
        { prop: "description", type: "string", default: "—", desc: "Secondary line in the menu" },
        { prop: "icon", type: "ReactNode", default: "Sparkles", desc: "Leading glyph on the picker" },
      ]} />

      <DocH3 id="api-chat-composer-folder">ChatComposerFolder</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable id reported to onSend and onFolderChange" },
        { prop: "name", type: "string", desc: "Label; truncates with a tooltip when long" },
      ]} />

      <DocH3 id="api-chat-composer-app">ChatComposerApp</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Stable id used in connectedApps and onSend" },
        { prop: "name", type: "string", desc: "Menu label" },
        { prop: "icon", type: "ReactNode", default: "first letter", desc: "Glyph in the menu row and the stacked marks" },
      ]} />
    </DocPage>
  )
}

function BasicExample() {
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <ChatComposer
        placeholder="Ask the HR assistant…"
        models={models}
        onAttach={() => {}}
        onSend={(message) => setLast(message)}
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {last ? `Sent: ${last}` : "Press Enter to send, Shift+Enter for a new line."}
      </p>
    </div>
  )
}

function PickersExample() {
  const [model, setModel] = useState("balanced")
  const [folder, setFolder] = useState<string | null>("policies")
  const [connected, setConnected] = useState<string[]>(["calendar", "directory", "mail", "payroll"])
  const [sent, setSent] = useState<{ message: string; meta: ChatComposerSendMeta } | null>(null)

  return (
    <ComponentPreview className="min-h-[200px]">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ChatComposer
          models={models}
          model={model}
          onModelChange={setModel}
          folders={folders}
          folder={folder}
          onFolderChange={setFolder}
          apps={apps}
          connectedApps={connected}
          onConnectedAppsChange={setConnected}
          onAttach={() => {}}
          onSend={(message, meta) => setSent({ message, meta })}
        />
        <p className="text-sm text-muted-foreground">
          model: {model} · folder: {folder ?? "none"} · apps: {connected.length}
        </p>
        {sent && (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(sent, null, 2)}</pre>
        )}
      </div>
    </ComponentPreview>
  )
}

function ActionExample() {
  const [busy, setBusy] = useState(false)
  const [approvals, setApprovals] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ComponentPreview className="min-h-[160px]">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ChatComposer
          defaultValue="Please approve my leave request for 3 days."
          actionLabel="Request approval"
          onAction={() =>
            new Promise<void>((resolve) =>
              (timer.current = setTimeout(() => {
                setApprovals((n) => n + 1)
                resolve()
              }, 1600)),
            )
          }
          busy={busy}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setBusy((b) => !b)}>
            {busy ? "Clear busy" : "Force busy"}
          </Button>
          <span className="text-sm text-muted-foreground">Requests sent: {approvals}</span>
        </div>
      </div>
    </ComponentPreview>
  )
}

function LiveExample() {
  const [text, setText] = useState("")
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    let n = 0
    const id = setInterval(() => {
      n = n > DRAFT.length + 12 ? 0 : n + 1
      setText(DRAFT.slice(0, n))
    }, 70)
    return () => clearInterval(id)
  }, [running])

  return (
    <ComponentPreview className="min-h-[160px]">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ChatComposer
          value={text}
          onValueChange={(v) => {
            setRunning(false)
            setText(v)
          }}
          onSend={() => {
            setRunning(false)
            setText("")
          }}
          models={models}
          onAttach={() => {}}
        />
        <div>
          <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)}>
            {running ? "Stop demo" : "Restart demo"}
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

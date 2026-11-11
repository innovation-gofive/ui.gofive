"use client"

import { useState } from "react"
import { Globe, Search } from "lucide-react"
import { ToolCall, ToolCallGroup } from "@/registry/new-york/ui/tool-call"
import type { ToolCallStatus } from "@/registry/new-york/ui/tool-call"
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
  { title: "Statuses", href: "#statuses", depth: 1 },
  { title: "Long payloads", href: "#long-payloads", depth: 1 },
  { title: "Retry on error", href: "#retry", depth: 1 },
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Group", href: "#group", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const bigResult = {
  total: 48,
  items: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Result number ${i + 1}`,
    score: Number((0.99 - i * 0.043).toFixed(3)),
    archived: i % 4 === 0,
    note: null,
  })),
}

export default function ToolCallPage() {
  return (
    <DocPage
      breadcrumb={["AI", "Tool Call"]}
      title="Tool Call"
      description="A collapsible row that summarises one AI-agent tool invocation: name, status, live timer, and pretty-printed arguments and result. ToolCallGroup folds several of them into one quiet line."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/tool-call" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { ToolCall, ToolCallGroup } from "@/components/ui/tool-call"`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-xl">
          <ToolCall
            name="search_docs"
            summary="3 matches for “webhooks”"
            icon={<Search />}
            status="success"
            duration={420}
            args={{ query: "webhooks", limit: 3 }}
            result={{ hits: ["Webhook basics", "Signing secrets", "Retries"] }}
            defaultOpen
          />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="statuses">Statuses</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>running</code> shows a spinner and a live timer, <code>success</code> the final duration,
        and <code>error</code> a failed label. A call that errors after mounting opens itself.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-xl flex-col gap-2">
          <ToolCall
            name="fetch_page"
            summary="https://example.com/pricing"
            icon={<Globe />}
            status="running"
            args={{ url: "https://example.com/pricing" }}
          />
          <ToolCall
            name="fetch_page"
            summary="Fetched 18 KB"
            icon={<Globe />}
            status="success"
            duration={1830}
            args={{ url: "https://example.com/pricing" }}
            result="<html>…</html>"
          />
          <ToolCall
            name="fetch_page"
            summary="https://example.com/missing"
            icon={<Globe />}
            status="error"
            args={{ url: "https://example.com/missing" }}
            error="HTTP 404: the page could not be found."
            defaultOpen
          />
          <ToolCall name="ping" status="success" duration={12} />
        </div>
      </ComponentPreview>

      <DocH3 id="long-payloads">Long payloads</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Blocks taller than <code>maxCodeHeight</code> fold behind a fade with an Expand toggle.
        Expanded blocks stop growing at 640 px and scroll.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <ToolCall
            name="list_records"
            summary="48 records"
            status="success"
            duration={96}
            args={{ table: "documents", limit: 12 }}
            result={bigResult}
            maxCodeHeight={160}
            defaultOpen
          />
        </div>
      </ComponentPreview>

      <DocH3 id="retry">Retry on error</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>onRetry</code> adds a Retry button. It only calls your handler: set the status back to{" "}
        <code>running</code> yourself. The card closes again if you never toggled it.
      </p>
      <RetryExample />

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>open</code> and <code>onOpenChange</code> to own the state. Auto-open on error is
        then disabled.
      </p>
      <ControlledExample />

      <DocH3 id="group">Group</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The group reads <code>status</code>, <code>icon</code>, <code>startedAt</code> and{" "}
        <code>duration</code> from its direct <code>ToolCall</code> children, so do not wrap them in
        another component.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-xl flex-col gap-4">
          <ToolCallGroup defaultOpen>
            <ToolCall name="search_docs" icon={<Search />} status="success" duration={420} args={{ query: "webhooks" }} />
            <ToolCall name="fetch_page" icon={<Globe />} status="error" error="Timed out after 10s." />
            <ToolCall name="summarize" status="success" duration={2310} result="Done." />
          </ToolCallGroup>
          <ToolCallGroup>
            <ToolCall name="search_docs" icon={<Search />} status="success" duration={420} />
            <ToolCall name="fetch_page" icon={<Globe />} status="running" />
          </ToolCallGroup>
        </div>
      </ComponentPreview>

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string comes from the <code>labels</code> prop, so pass your own translations.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <ToolCall
            name="ค้นหาเอกสาร"
            summary="พบ 3 รายการ"
            status="error"
            error="เชื่อมต่อไม่สำเร็จ"
            onRetry={() => {}}
            defaultOpen
            args={{ คำค้น: "เว็บฮุก" }}
            labels={{
              failed: "ล้มเหลว",
              retry: "ลองอีกครั้ง",
              args: "อาร์กิวเมนต์",
              copy: (s) => `คัดลอก${s}`,
              copied: "คัดลอกแล้ว",
              announceError: (n, e) => `${n} ล้มเหลว${e ? `: ${e}` : ""}`,
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-tool-call">ToolCall</DocH3>
      <PropsTable rows={[
        { prop: "name", type: "string", desc: "Tool identifier, shown in monospace; truncates with the full value as a tooltip" },
        { prop: "status", type: '"running" | "success" | "error"', desc: "Drives the glyph, tone, timer, announcement and body placeholders" },
        { prop: "summary", type: "ReactNode", default: "—", desc: "Short one-line description; omitted when null/undefined" },
        { prop: "icon", type: "ReactNode", default: "Wrench", desc: "Leading glyph; also used by the group's stacked icons" },
        { prop: "args", type: "unknown", default: "—", desc: "Arguments. Objects and JSON-looking strings are pretty-printed; undefined hides the section, null renders as null" },
        { prop: "result", type: "unknown", default: "—", desc: "Output. undefined hides the section, or shows a waiting placeholder while running" },
        { prop: "error", type: "string", default: "—", desc: "Message in the error panel; falls back to labels.errorFallback" },
        { prop: "startedAt", type: "number", default: "—", desc: "Epoch ms the timer counts from; defaults to when running was first seen" },
        { prop: "duration", type: "number", default: "—", desc: "Final duration in ms; falls back to the last measured time" },
        { prop: "defaultOpen", type: "boolean", default: "false", desc: "Initial open state when uncontrolled" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state; disables auto-open on error" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called on every user toggle" },
        { prop: "openOnError", type: "boolean", default: "true", desc: "Open when status becomes error; close again on leaving error if the user never toggled it" },
        { prop: "onRetry", type: "() => void", default: "—", desc: "Shows a Retry button in the error panel" },
        { prop: "maxCodeHeight", type: "number", default: "220", desc: "Height in px above which code blocks fold behind the Expand toggle" },
        { prop: "labels", type: "Partial<ToolCallLabels>", default: "English", desc: "failed, announceRunning, announceSuccess, announceError, errorFallback, retry, args, result, waiting, empty, copy, copied, showAll, showLess" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root; other div props are spread there" },
      ]} />

      <DocH3 id="api-tool-call-group">ToolCallGroup</DocH3>
      <PropsTable rows={[
        { prop: "children", type: "ReactNode", desc: "ToolCall elements; their props feed the summary" },
        { prop: "label", type: "string", default: "Ran N tools", desc: "Title once nothing is running" },
        { prop: "runningLabel", type: "string", default: '"Working…"', desc: "Title (with a shimmer) while any child is running" },
        { prop: "duration", type: "number", default: "—", desc: "Total in ms; else the children's sum when all have one, else measured time" },
        { prop: "defaultOpen", type: "boolean", default: "false", desc: "Initial open state when uncontrolled" },
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called on every toggle" },
        { prop: "labels", type: "Partial<ToolCallGroupLabels>", default: "English", desc: "used(count) and failed(count) formatters" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root" },
      ]} />
    </DocPage>
  )
}

function RetryExample() {
  const [status, setStatus] = useState<ToolCallStatus>("running")

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ToolCall
          name="send_email"
          summary="Welcome message"
          status={status}
          args={{ to: "user@example.com", template: "welcome" }}
          result={status === "success" ? { id: "msg_01", queued: true } : undefined}
          error="SMTP connection refused."
          duration={status === "success" ? 840 : undefined}
          onRetry={() => setStatus("running")}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setStatus("running")}>Running</Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("success")}>Succeed</Button>
          <Button size="sm" variant="outline" onClick={() => setStatus("error")}>Fail</Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-xl flex-col gap-3">
        <ToolCall
          name="read_file"
          summary="src/index.ts"
          status="success"
          duration={31}
          args={{ path: "src/index.ts" }}
          result="export {}"
          open={open}
          onOpenChange={setOpen}
        />
        <p className="text-sm text-muted-foreground">
          State: {open ? "open" : "closed"}{" "}
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>Toggle</Button>
        </p>
      </div>
    </ComponentPreview>
  )
}

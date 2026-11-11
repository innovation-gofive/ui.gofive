"use client"

import { useState } from "react"
import {
  CommentThread,
  type CommentThreadEntry,
} from "@/registry/new-york/ui/comment-thread"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Collapsible replies", href: "#collapsible-replies", depth: 1 },
  { title: "Resolve", href: "#resolve", depth: 1 },
  { title: "Interactive replies", href: "#interactive", depth: 1 },
  { title: "Async and errors", href: "#async", depth: 1 },
  { title: "Localized", href: "#localized", depth: 1 },
  { title: "Read only", href: "#read-only", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const comment: CommentThreadEntry = {
  id: "c1",
  author: { name: "Napat Srisuk" },
  time: "2 hours ago",
  dateTime: "2026-11-11T08:00:00Z",
  body: "Can we move the launch checklist into the shared workspace? The current doc is hard to keep in sync.",
}

const replies: CommentThreadEntry[] = [
  {
    id: "r1",
    author: { name: "Mali Chaiyo" },
    time: "1 hour ago",
    body: "Agreed. I will migrate it today and link it from the kickoff page.",
  },
  {
    id: "r2",
    author: { name: "Somchai Tan" },
    time: "35 min ago",
    body: "Please keep the owner column, finance relies on it.\nThanks!",
  },
]

export default function CommentThreadPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Comment Thread"]}
      title="Comment Thread"
      description="One comment with nested replies, a collapsible reply group, an optional resolve action, and a multiline reply composer that submits on Ctrl or Cmd + Enter."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/comment-thread" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { CommentThread } from "@/components/ui/comment-thread"

<CommentThread
  comment={{
    id: "c1",
    author: { name: "Napat Srisuk" },
    time: "2 hours ago",
    body: "Can we move the launch checklist into the shared workspace?",
  }}
  replies={replies}
  onReply={(text) => save(text)}
/>`}
      />
      <ComponentPreview className="min-h-[100px]">
        <div className="w-full max-w-xl">
          <CommentThread comment={comment} replies={replies} onReply={() => {}} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="collapsible-replies">Collapsible replies</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Replies fold into a single toggle that shows the reply count and the
        first authors. Use <code>defaultCollapsed</code>, or{" "}
        <code>collapsed</code> + <code>onCollapsedChange</code> to control it.
        The toggle is hidden when there are no replies.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CommentThread comment={comment} replies={replies} defaultCollapsed />
        </div>
      </ComponentPreview>

      <DocH3 id="resolve">Resolve</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The component never decides the outcome. Providing <code>onResolve</code>{" "}
        shows the action, and you own the <code>resolved</code> flag.
      </p>
      <ResolveExample />

      <DocH3 id="interactive">Interactive replies</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Type a reply and press <kbd>Ctrl</kbd> or <kbd>⌘</kbd> + <kbd>Enter</kbd>.
        Plain Enter inserts a newline. The caller owns the list and the
        formatted time.
      </p>
      <InteractiveExample />

      <DocH3 id="async">Async and errors</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Return a promise from <code>onReply</code> to show a pending state. If it
        rejects, the draft is kept and an error message appears. This example
        fails on every second attempt.
      </p>
      <AsyncExample />

      <DocH3 id="localized">Localized</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every visible string comes from the <code>labels</code> prop. Times are
        plain strings, so format them in your own locale.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CommentThread
            comment={{
              id: "t1",
              author: { name: "สมชาย ใจดี" },
              time: "2 ชั่วโมงที่แล้ว",
              body: "ช่วยตรวจสอบรายงานประจำเดือนอีกครั้งได้ไหมครับ",
            }}
            replies={[
              {
                id: "t2",
                author: { name: "มาลี รักงาน" },
                time: "1 ชั่วโมงที่แล้ว",
                body: "ได้เลยค่ะ จะส่งให้ภายในวันนี้",
              },
            ]}
            onResolve={() => {}}
            onReply={() => {}}
            labels={{
              thread: "กระทู้ความคิดเห็น",
              resolve: "แก้ไขแล้ว",
              reopen: "เปิดอีกครั้ง",
              resolved: "แก้ไขแล้ว",
              showReplies: (n) => `แสดง ${n} การตอบกลับ`,
              hideReplies: (n) => `ซ่อน ${n} การตอบกลับ`,
              replyLabel: "ตอบกลับ",
              replyPlaceholder: "เขียนข้อความตอบกลับ…",
              send: "ส่ง",
              shortcutHint: "กด Ctrl หรือ ⌘ + Enter เพื่อส่ง",
              error: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง",
            }}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="read-only">Read only</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Omit <code>onReply</code> and <code>onResolve</code> for a display-only
        thread. Avatars fall back to initials, or to a generic glyph when the
        name has no letters. Pass <code>avatarSrc</code> or a custom{" "}
        <code>avatar</code> node to override.
      </p>
      <ComponentPreview>
        <div className="w-full max-w-xl">
          <CommentThread
            comment={{
              id: "x1",
              author: { name: "🚀 ????" },
              time: "Yesterday",
              body: "https://example.com/a-very-long-unbroken-link/that/should/wrap/instead/of/overflowing/the/card",
            }}
            replies={[
              { id: "x2", author: { name: "Alex Kim" }, time: "Just now", body: "Thanks, got it." },
            ]}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-comment-thread">CommentThread</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Renders a labelled <code>section</code>. Remaining props are spread onto
        it.
      </p>
      <PropsTable rows={[
        { prop: "comment", type: "CommentThreadEntry", default: "—", desc: "The root comment" },
        { prop: "replies", type: "CommentThreadEntry[]", default: "[]", desc: "Replies, one level deep, oldest first. Ids must be unique" },
        { prop: "resolved", type: "boolean", default: "false", desc: "Resolved state, owned by the caller" },
        { prop: "onResolve", type: "() => void", default: "—", desc: "Shows the resolve / reopen action when provided" },
        { prop: "onReply", type: "(text: string) => void | Promise<void>", default: "—", desc: "Shows the composer when provided. Receives the trimmed text. Draft clears on success, is kept on rejection" },
        { prop: "collapsed", type: "boolean", default: "—", desc: "Controlled collapsed state of the replies — pair with onCollapsedChange" },
        { prop: "defaultCollapsed", type: "boolean", default: "false", desc: "Initial collapsed state when uncontrolled" },
        { prop: "onCollapsedChange", type: "(collapsed: boolean) => void", default: "—", desc: "Called when the toggle is used" },
        { prop: "labels", type: "Partial<CommentThreadLabels>", default: "English", desc: "Override any visible or accessible string" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root" },
      ]} />

      <DocH3 id="api-entry">CommentThreadEntry</DocH3>
      <PropsTable rows={[
        { prop: "id", type: "string", desc: "Unique key" },
        { prop: "author", type: "CommentAuthor", desc: "{ name, avatarSrc?, avatar? } — avatar node wins over avatarSrc, which falls back to initials" },
        { prop: "body", type: "ReactNode", desc: "Content. Line breaks are preserved and long strings wrap" },
        { prop: "time", type: "string", desc: "Caller-formatted label. The component never reads the clock or refreshes it" },
        { prop: "dateTime", type: "string", default: "—", desc: "Optional ISO timestamp for the time element; ignored if invalid" },
      ]} />

      <DocH3 id="api-labels">CommentThreadLabels</DocH3>
      <PropsTable rows={[
        { prop: "thread", type: "string", default: '"Comment thread"', desc: "Accessible name of the landmark" },
        { prop: "resolve / reopen", type: "string", default: '"Resolve" / "Reopen"', desc: "Action text" },
        { prop: "resolved", type: "string", default: '"Resolved"', desc: "Status badge text" },
        { prop: "showReplies / hideReplies", type: "(count: number) => string", default: "English plural", desc: "Toggle text; handle plural rules (or none, for Thai) here" },
        { prop: "replyLabel", type: "string", default: '"Reply"', desc: "Accessible name of the field" },
        { prop: "replyPlaceholder", type: "string", default: '"Write a reply…"', desc: "Field placeholder" },
        { prop: "send", type: "string", default: '"Reply"', desc: "Submit button text" },
        { prop: "shortcutHint", type: "string", default: '"Ctrl or ⌘ + Enter to send"', desc: "Shortcut hint, linked via aria-describedby" },
        { prop: "error", type: "string", default: '"Your reply could not be sent. Please try again."', desc: "Shown when onReply rejects" },
      ]} />

      <DocH3 id="api-slots">Slots</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Style any part with <code>[data-slot]</code>:{" "}
        <code>comment-thread</code>, <code>comment-thread-comment</code>,{" "}
        <code>comment-thread-reply</code>, <code>comment-thread-avatar</code>,{" "}
        <code>comment-thread-author</code>, <code>comment-thread-time</code>,{" "}
        <code>comment-thread-body</code>, <code>comment-thread-status</code>,{" "}
        <code>comment-thread-resolve</code>, <code>comment-thread-toggle</code>,{" "}
        <code>comment-thread-replies</code>, <code>comment-thread-composer</code>,{" "}
        <code>comment-thread-hint</code>, <code>comment-thread-error</code>,{" "}
        <code>comment-thread-submit</code>.
      </p>
    </DocPage>
  )
}

function ResolveExample() {
  const [resolved, setResolved] = useState(false)
  return (
    <ComponentPreview>
      <div className="w-full max-w-xl">
        <CommentThread
          comment={comment}
          replies={replies}
          resolved={resolved}
          onResolve={() => setResolved((r) => !r)}
        />
      </div>
    </ComponentPreview>
  )
}

function InteractiveExample() {
  const [items, setItems] = useState(replies)
  const [collapsed, setCollapsed] = useState(false)
  return (
    <ComponentPreview>
      <div className="flex w-full max-w-xl flex-col gap-3">
        <CommentThread
          comment={comment}
          replies={items}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          onReply={(text) => {
            setCollapsed(false)
            setItems((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                author: { name: "You" },
                time: "Just now",
                body: text,
              },
            ])
          }}
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          {items.length} replies · {collapsed ? "collapsed" : "expanded"}
        </p>
      </div>
    </ComponentPreview>
  )
}

function AsyncExample() {
  const [items, setItems] = useState<CommentThreadEntry[]>([])
  const [attempt, setAttempt] = useState(0)
  return (
    <ComponentPreview>
      <div className="w-full max-w-xl">
        <CommentThread
          comment={comment}
          replies={items}
          onReply={async (text) => {
            const n = attempt + 1
            setAttempt(n)
            await new Promise((r) => setTimeout(r, 900))
            if (n % 2 === 0) throw new Error("fail")
            setItems((prev) => [
              ...prev,
              { id: crypto.randomUUID(), author: { name: "You" }, time: "Just now", body: text },
            ])
          }}
        />
      </div>
    </ComponentPreview>
  )
}

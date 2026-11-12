"use client"

import { useEffect, useState } from "react"
import { BookOpen, FileText, Scale } from "lucide-react"
import { AIAnswer } from "@/registry/new-york/ui/ai-answer"
import type { AIAnswerSource } from "@/registry/new-york/ui/ai-answer"
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
  { title: "Live streaming", href: "#streaming", depth: 1 },
  { title: "Many sources", href: "#many-sources", depth: 1 },
  { title: "Unframed", href: "#unframed", depth: 1 },
  { title: "Markup", href: "#markup", depth: 1 },
  { title: "Localization", href: "#localization", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

const sources: AIAnswerSource[] = [
  {
    title: "Annual leave policy 2026",
    site: "People Handbook",
    shortName: "Handbook",
    icon: <BookOpen />,
    href: "https://example.com/handbook/leave",
    snippet: "Full-time employees accrue 1.5 days of paid leave per month, up to 18 days a year.",
  },
  {
    title: "Carry-over and expiry rules",
    site: "HR Portal",
    icon: <FileText />,
    snippet: "Up to 5 unused days may be carried into the next calendar year and expire on 31 March.",
  },
  {
    title: "Labour protection guidance",
    site: "Ministry of Labour",
    shortName: "Ministry",
    icon: <Scale />,
    href: "https://example.com/labour",
    snippet: "Employers must grant at least 6 working days of paid annual leave after one year of service.",
  },
]

const manySources: AIAnswerSource[] = [
  ...sources,
  { title: "Public holiday calendar", site: "People Handbook", shortName: "Calendar", snippet: "Thirteen paid public holidays are observed each year." },
  { title: "Requesting time off", site: "HR Portal", shortName: "Requests", snippet: "Requests go to your line manager and need approval at least 3 days ahead." },
  { title: "Unpaid leave", site: "People Handbook", shortName: "Unpaid", snippet: "Unpaid leave beyond 5 days needs HR approval." },
]

const answer = `You earn **1.5 days of paid leave per month**, which adds up to 18 days a year [1]. After one year of service the legal minimum is 6 working days, so the policy is more generous [3].

Things worth knowing:

- Up to **5 unused days** carry over and expire on 31 March [2]
- Requests go to your manager first [1]
- Public holidays do not count against your balance`

const followUps = ["How do I request leave?", "Does leave carry over?", "What about sick leave?"]

const usage = `import { AIAnswer } from "@/components/ui/ai-answer"

<AIAnswer
  question="How much annual leave do I get?"
  answer={text}              // "**bold**", "- bullets", "[1]" citations
  sources={sources}
  streaming={isStreaming}
  onStop={stop}
  followUps={["How do I request leave?"]}
  onFollowUp={ask}
  onRegenerate={regenerate}
  onFeedback={(vote, reason) => send(vote, reason)}
/>`

const LIVE_TEXT = `Staff accrue **1.5 days of paid leave per month**, up to 18 days a year [1].

Before you book time off:

- Check your balance in the **HR Portal** [2]
- Send the request to your manager at least 3 days ahead [2]

The legal minimum is lower than this policy [3].`

export default function AIAnswerPage() {
  return (
    <DocPage
      breadcrumb={["AI", "AI Answer"]}
      title="AI Answer"
      description="An assistant answer with source cards, inline citation chips that preview their source, a streaming typewriter, follow-up questions and a copy / regenerate / feedback bar."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/ai-answer" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock className="mt-4" code={usage} />
      <ComponentPreview className="min-h-[100px] items-start">
        <div className="w-full max-w-2xl">
          <AIAnswer
            question="How much annual leave do I get?"
            answer={answer}
            sources={sources}
            followUps={followUps}
            onRegenerate={() => {}}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="streaming">Live streaming</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        While <code>streaming</code> is true the answer may keep growing. A cursor blinks, the body is{" "}
        <code>aria-busy</code> and Stop calls <code>onStop</code>. Follow-ups and the action bar
        appear once the text has finished typing. Passing a different answer restarts the typewriter.
      </p>
      <LiveExample />

      <DocH3 id="many-sources">Many sources</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Up to three cards fit a row (two on narrow containers). With more sources the third slot becomes a{" "}
        <code>+N</code> tile that expands the rest. Hover, focus or tap a citation chip to preview its source;
        Esc closes the preview.
      </p>
      <ComponentPreview className="items-start">
        <div className="w-full max-w-2xl">
          <AIAnswer answer={answer} sources={manySources} animate={false} actions={[]} />
        </div>
      </ComponentPreview>

      <DocH3 id="unframed">Unframed</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>framed={"{false}"}</code> drops the card and tray so the answer sits directly in the thread.
      </p>
      <ComponentPreview className="items-start">
        <div className="w-full max-w-2xl">
          <AIAnswer
            framed={false}
            question="Does leave carry over?"
            answer={"Yes, but only partly. Up to **5 unused days** carry into next year and expire on 31 March [1]."}
            sources={sources.slice(1, 2)}
            followUps={["What happens after 31 March?"]}
            actions={["copy", "feedback"]}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="markup">Markup</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The answer is parsed into React elements, never injected as HTML. Supported: blank-line separated
        paragraphs, <code>- </code> bullet lists, <code>**bold**</code> and numbered citations like{" "}
        <code>[1]</code>. A citation with no matching source stays plain text. Copy produces plain text
        followed by a numbered source list; <code>answerToPlainText</code> is exported for reuse.
      </p>
      <CodeBlock
        className="mt-3"
        code={`answerToPlainText("Hello **world** [1]", [{ title: "Doc", site: "Wiki" }])
// "Hello world [1]\\n\\nSources:\\n1. Doc — Wiki"`}
      />

      <DocH3 id="localization">Localization</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every string lives in <code>labels</code>; the action bar takes its own through{" "}
        <code>actionProps.labels</code>. The typewriter segments words with <code>Intl.Segmenter</code>, so
        Thai text reveals word by word.
      </p>
      <ComponentPreview className="items-start">
        <div className="w-full max-w-2xl">
          <AIAnswer
            question="ได้วันลาพักร้อนกี่วัน"
            answer={"พนักงานได้วันลาพักร้อน **18 วันต่อปี** [1] และโอนไปปีถัดไปได้สูงสุด 5 วัน [2]"}
            sources={sources.slice(0, 2)}
            followUps={["ขอลาอย่างไร"]}
            animate={false}
            labels={{
              sources: "แหล่งข้อมูล",
              showLess: "แสดงน้อยลง",
              citation: (n, name) => `แหล่งข้อมูล ${n}: ${name}`,
              openSource: "เปิดแหล่งข้อมูล",
              followUps: "คำถามที่เกี่ยวข้อง",
              copySources: "แหล่งข้อมูล",
            }}
            actionProps={{
              labels: { group: "เครื่องมือตอบกลับ", copy: "คัดลอก", copied: "คัดลอกแล้ว" },
            }}
          />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-ai-answer">AIAnswer</DocH3>
      <PropsTable rows={[
        { prop: "answer", type: "string", desc: "Answer text. Paragraphs, \"- \" bullets, **bold** and [n] citations (1-based into sources). May grow while streaming" },
        { prop: "question", type: "string", default: "—", desc: "Heading shown above the sources" },
        { prop: "sources", type: "AIAnswerSource[]", default: "[]", desc: "Source cards and the targets of [n] citations" },
        { prop: "streaming", type: "boolean", default: "false", desc: "Answer still arriving: cursor, aria-busy, Stop button; follow-ups and actions wait" },
        { prop: "onStop", type: "() => void", default: "—", desc: "Shows a Stop button while streaming" },
        { prop: "animate", type: "boolean", default: "true", desc: "Typewriter for newly arrived text. Text present on mount without streaming shows at once; reduced motion is always instant" },
        { prop: "wordsPerSecond", type: "number", default: "30", desc: "Typewriter speed; speeds up automatically when far behind the stream" },
        { prop: "followUps", type: "string[]", default: "—", desc: "Suggested questions shown once the answer is complete" },
        { prop: "onFollowUp", type: "(question: string) => void", default: "—", desc: "Called with the chosen question" },
        { prop: "framed", type: "boolean", default: "true", desc: "Own card on a muted tray; false blends into the thread" },
        { prop: "sourcesOpen", type: "boolean", default: "—", desc: "Controlled expansion of the source list (only with more than 3 sources)" },
        { prop: "defaultSourcesOpen", type: "boolean", default: "false", desc: "Initial expansion when uncontrolled" },
        { prop: "onSourcesOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the +N tile or Show fewer is pressed" },
        { prop: "actions", type: "MessageActionsAction[]", default: "copy, feedback (+ regenerate with onRegenerate)", desc: "Buttons in the bar; [] hides it" },
        { prop: "onRegenerate", type: "() => void", default: "—", desc: "Regenerate pressed" },
        { prop: "onFeedback", type: "(vote, reason?, text?) => void", default: "—", desc: "Thumbs vote and optional reason; see MessageActions" },
        { prop: "onCopy", type: "(text?: string) => void", default: "—", desc: "Called after copy with the plain text + source list" },
        { prop: "actionProps", type: "Omit<MessageActionsProps, …>", default: "—", desc: "Remaining MessageActions props: versions, reasons, regenerating, speaking, labels, quiet (false here)" },
        { prop: "labels", type: "Partial<AIAnswerLabels>", default: "English", desc: "sources, showMore(count), showLess, citation(n, name), openSource, stop, generating, ready, stopped, followUps, copySources" },
        { prop: "className", type: "string", default: "—", desc: "Merged onto the root article; other article props are spread there. The root is a container-query host" },
      ]} />

      <DocH3 id="api-source">AIAnswerSource</DocH3>
      <PropsTable rows={[
        { prop: "title", type: "string", desc: "Card title and preview heading" },
        { prop: "site", type: "string", desc: "Site or publisher name" },
        { prop: "id", type: "string", default: "index", desc: "Stable React key" },
        { prop: "shortName", type: "string", default: "site", desc: "Text on the citation chip" },
        { prop: "icon", type: "ReactNode", default: "Globe", desc: "Leading glyph on the card and preview" },
        { prop: "href", type: "string", default: "—", desc: "Turns the card into a link (new tab) and adds an Open link to the preview" },
        { prop: "snippet", type: "string", default: "—", desc: "Excerpt in the citation preview" },
      ]} />

      <DocH3 id="api-labels">AIAnswerLabels</DocH3>
      <PropsTable rows={[
        { prop: "sources", type: "string", default: '"Sources"', desc: "Accessible name of the source group" },
        { prop: "showMore", type: "(count) => string", default: '"Show N more sources"', desc: "Accessible name of the +N tile" },
        { prop: "showLess", type: "string", default: '"Show fewer"', desc: "Collapse tile text" },
        { prop: "citation", type: "(n, name) => string", default: '"Source n: name"', desc: "Accessible name of a chip" },
        { prop: "openSource", type: "string", default: '"Open source"', desc: "Preview link text" },
        { prop: "stop", type: "string", default: '"Stop"', desc: "Stop button text" },
        { prop: "generating / ready / stopped", type: "string", default: "English", desc: "Polite live-region messages" },
        { prop: "followUps", type: "string", default: '"Related questions"', desc: "Accessible name of the follow-up group" },
        { prop: "copySources", type: "string", default: '"Sources"', desc: "Heading of the source list in copied text" },
      ]} />

      <DocH3 id="api-helper">answerToPlainText</DocH3>
      <PropsTable rows={[
        { prop: "answer", type: "string", desc: "Marked-up answer" },
        { prop: "sources", type: "AIAnswerSource[]", default: "[]", desc: "Appended as a numbered list" },
        { prop: "sourcesHeading", type: "string", default: '"Sources"', desc: "Heading above that list" },
      ]} />
    </DocPage>
  )
}

function LiveExample() {
  const [pos, setPos] = useState(0)
  const [stopped, setStopped] = useState(false)
  const streaming = !stopped && pos < LIVE_TEXT.length
  const text = LIVE_TEXT.slice(0, pos)

  useEffect(() => {
    if (!streaming) return
    // Sends 10 characters every 50 ms, so unfinished **bold** and [n] arrive mid-token.
    const id = setInterval(() => setPos((p) => p + 10), 50)
    return () => clearInterval(id)
  }, [streaming])

  function restart() {
    setPos(0)
    setStopped(false)
  }

  return (
    <ComponentPreview className="items-start">
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <AIAnswer
          question="How do I take annual leave?"
          answer={text}
          sources={sources}
          streaming={streaming}
          onStop={() => setStopped(true)}
          followUps={["Does leave carry over?", "Who approves my request?"]}
          onFollowUp={() => {}}
          onRegenerate={restart}
        />
        <div>
          <Button variant="outline" size="sm" onClick={restart}>
            Ask again
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

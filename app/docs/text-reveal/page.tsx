"use client"

import { useState } from "react"
import { TextReveal } from "@/registry/new-york/ui/text-reveal"
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
  { title: "Replay", href: "#replay", depth: 1 },
  { title: "Letters", href: "#letters", depth: 1 },
  { title: "Thai text", href: "#thai", depth: 1 },
  { title: "Timing", href: "#timing", depth: 1 },
  { title: "Scroll trigger", href: "#scroll-trigger", depth: 1 },
  { title: "Notes", href: "#notes" },
  { title: "API Reference", href: "#api-reference" },
]

export default function TextRevealPage() {
  return (
    <DocPage
      breadcrumb={["Motion", "Text Reveal"]}
      title="Text Reveal"
      description="Text that arrives word by word or letter by letter with a staggered fade, blur and rise. Thai-aware segmentation, scroll or mount trigger, reduced-motion safe."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/text-reveal" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { TextReveal } from "@/components/ui/text-reveal"`}
      />
      <ComponentPreview
        className="min-h-[120px]"
        code={`<TextReveal
  as="h2"
  trigger="mount"
  text="Build something people want to read."
  className="text-center text-2xl font-semibold"
/>`}
      >
        <TextReveal
          as="h2"
          trigger="mount"
          text="Build something people want to read."
          className="text-center text-2xl font-semibold text-foreground"
        />
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="replay">Replay</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Changing <code>key</code> remounts the component and plays the reveal again.
      </p>
      <ReplayExample />

      <DocH3 id="letters">Letters</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>split=&quot;char&quot;</code> reveals one grapheme at a time. Words stay together on a line.
      </p>
      <ComponentPreview
        code={`<TextReveal split="char" stagger={30} trigger="mount" text="Every letter counts" />`}
      >
        <TextReveal
          as="h3"
          split="char"
          stagger={30}
          trigger="mount"
          text="Every letter counts"
          className="text-center text-3xl font-bold text-primary"
        />
      </ComponentPreview>

      <DocH3 id="thai">Thai text</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Word mode uses dictionary segmentation via <code>locale</code>; letter mode keeps vowels and tone marks attached to their consonant.
      </p>
      <ComponentPreview
        code={`<TextReveal locale="th" text="ยินดีต้อนรับสู่ระบบจัดการงานของเรา" />
<TextReveal locale="th" split="char" text="สวัสดีครับ" />`}
      >
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <TextReveal
            locale="th"
            trigger="mount"
            text="ยินดีต้อนรับสู่ระบบจัดการงานของเรา เริ่มต้นใช้งานได้ทันที"
            className="text-lg text-foreground"
          />
          <TextReveal
            locale="th"
            split="char"
            trigger="mount"
            stagger={50}
            text="สวัสดีครับ ทดสอบ Gofive"
            className="text-lg text-muted-foreground"
          />
        </div>
      </ComponentPreview>

      <DocH3 id="timing">Timing</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>delay</code>, <code>stagger</code> and <code>duration</code> are in milliseconds.
      </p>
      <ComponentPreview
        code={`<TextReveal stagger={20} duration={400} text="Quick and snappy reveal" />
<TextReveal delay={600} stagger={160} duration={1200} text="Slow, deliberate, and a little dramatic" />`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <TextReveal trigger="mount" stagger={20} duration={400} text="Quick and snappy reveal" className="text-foreground" />
          <TextReveal trigger="mount" delay={600} stagger={160} duration={1200} text="Slow, deliberate, and a little dramatic" className="text-foreground" />
        </div>
      </ComponentPreview>

      <DocH3 id="scroll-trigger">Scroll trigger</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        With <code>once=&#123;false&#125;</code> the text resets when it leaves the viewport and replays on re-entry. Scroll this box.
      </p>
      <ComponentPreview className="block p-0" code={`<TextReveal once={false} text="Replays every time you scroll back." />`}>
        <div className="h-64 overflow-y-auto p-8">
          <p className="text-sm text-muted-foreground">Scroll down</p>
          <div className="h-72" />
          <TextReveal
            once={false}
            text="Replays every time you scroll back."
            className="text-xl font-semibold text-foreground"
          />
          <div className="h-72" />
        </div>
      </ComponentPreview>

      <DocH2 id="notes">Notes</DocH2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>Screen readers get the text once from a visually hidden copy; the animated pieces are <code>aria-hidden</code>. Heading and paragraph semantics come from <code>as</code>.</li>
        <li><code>prefers-reduced-motion</code> and print show plain text with no animation, whether or not the trigger has fired.</li>
        <li>Whitespace is real text, so <code>className=&quot;whitespace-pre-line&quot;</code> preserves newlines.</li>
        <li>Letter mode creates one element per grapheme. Prefer word mode, or a smaller <code>stagger</code>, for long text.</li>
        <li>Without <code>Intl.Segmenter</code> the component falls back to code points and whitespace; Thai is less accurate there.</li>
        <li>Letter mode is for Latin, Thai and similar scripts. Cursive scripts such as Arabic lose joining when split.</li>
        <li>Text is plain only. Compose links or bold segments with separate components.</li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-text-reveal">TextReveal</DocH3>
      <PropsTable rows={[
        { prop: "text", type: "string", default: "—", desc: "Text to reveal. Plain text, required" },
        { prop: "split", type: '"word" | "char"', default: '"word"', desc: "Reveal unit: words, or grapheme clusters" },
        { prop: "locale", type: "string | string[]", default: "—", desc: "BCP 47 tag(s) for segmentation (use \"th\" for Thai). The first tag also sets lang on the wrapper" },
        { prop: "stagger", type: "number", default: "40", desc: "Milliseconds between the start of consecutive pieces" },
        { prop: "delay", type: "number", default: "0", desc: "Milliseconds before the first piece starts, from the trigger" },
        { prop: "duration", type: "number", default: "700", desc: "Milliseconds each piece takes to finish" },
        { prop: "as", type: "React.ElementType", default: '"p"', desc: "Wrapper element, e.g. h1, h2, span" },
        { prop: "trigger", type: '"mount" | "inView"', default: '"inView"', desc: "Start on mount, or when first scrolled into view" },
        { prop: "once", type: "boolean", default: "true", desc: "Only for trigger=\"inView\". Play once; when false, reset on leaving the viewport and replay on re-entry" },
        { prop: "className", type: "string", default: "—", desc: "Wrapper classes — set font, size and color here" },
        { prop: "...props", type: "HTMLAttributes<HTMLElement>", default: "—", desc: "Spread onto the wrapper element" },
      ]} />
    </DocPage>
  )
}

function ReplayExample() {
  const [run, setRun] = useState(0)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-4">
        <TextReveal
          key={run}
          trigger="mount"
          text="Hello again, nice to see you."
          className="text-xl font-medium text-foreground"
        />
        <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      </div>
    </ComponentPreview>
  )
}

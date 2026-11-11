"use client"

import { useEffect, useState } from "react"
import { Minus, Plus, RotateCcw, Shuffle } from "lucide-react"
import { NumberTicker } from "@/registry/new-york/ui/number-ticker"
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
  { title: "Controlled", href: "#controlled", depth: 1 },
  { title: "Currency and locale", href: "#currency-and-locale", depth: 1 },
  { title: "Percent, compact, decimals", href: "#formats", depth: 1 },
  { title: "Count in on view", href: "#count-in", depth: 1 },
  { title: "Live data", href: "#live-data", depth: 1 },
  { title: "Invalid value", href: "#invalid-value", depth: 1 },
  { title: "Accessibility", href: "#accessibility" },
  { title: "API Reference", href: "#api-reference" },
]

export default function NumberTickerPage() {
  return (
    <DocPage
      breadcrumb={["Motion", "Number Ticker"]}
      title="Number Ticker"
      description="An odometer-style number: every digit is a column that rolls to its new value, with Intl formatting, a count-in on first view, and instant changes under reduced motion."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/number-ticker" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { NumberTicker } from "@/components/ui/number-ticker"

<NumberTicker value={12840} className="text-4xl font-semibold" />`}
      />
      <ComponentPreview className="min-h-[100px]">
        <NumberTicker value={12840} className="text-4xl font-semibold" />
      </ComponentPreview>
      <p className="mt-3 text-sm text-muted-foreground">
        The ticker inherits font size, weight and colour from its surroundings, so size it with{" "}
        <code>className</code>. Only digits animate; currency symbols, separators and signs stay put.
      </p>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="controlled">Controlled</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Digits roll up when the value rises and down when it falls. Each column keeps rolling in the
        direction of the change, so 9,999 to 10,000 carries over without rewinding.
      </p>
      <ControlledExample />

      <DocH3 id="currency-and-locale">Currency and locale</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pass <code>format</code> and <code>locale</code> straight to <code>Intl.NumberFormat</code>. Digits
        are rendered as Latin numerals by default so they can roll in every locale, including Thai.
      </p>
      <ComponentPreview>
        <div className="flex flex-col items-center gap-3 text-3xl font-semibold">
          <NumberTicker value={1234567.89} locale="en-US" format={{ style: "currency", currency: "USD" }} />
          <NumberTicker value={1234567.89} locale="th-TH" format={{ style: "currency", currency: "THB" }} />
          <NumberTicker value={1234567.89} locale="de-DE" format={{ style: "currency", currency: "EUR" }} />
        </div>
      </ComponentPreview>

      <DocH3 id="formats">Percent, compact, decimals</DocH3>
      <ComponentPreview>
        <div className="flex flex-wrap items-baseline justify-center gap-x-10 gap-y-4 text-3xl font-semibold">
          <NumberTicker value={0.847} format={{ style: "percent", maximumFractionDigits: 1 }} />
          <NumberTicker value={2400000} format={{ notation: "compact", maximumFractionDigits: 1 }} />
          <NumberTicker value={3.14159} format={{ minimumFractionDigits: 3, maximumFractionDigits: 3 }} />
          <NumberTicker value={98765} format={{ useGrouping: false }} />
        </div>
      </ComponentPreview>

      <DocH3 id="count-in">Count in on view</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        By default the first count-in from zero waits until about 30% of the number is visible, then
        for <code>delay</code>. Set <code>animateOnView={"{false}"}</code> to start on mount.
      </p>
      <CountInExample />

      <DocH3 id="live-data">Live data</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A new value mid-roll cancels the animation and continues from each digit&apos;s current position,
        so frequent updates stay smooth.
      </p>
      <LiveExample />

      <DocH3 id="invalid-value">Invalid value</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        <code>NaN</code> and infinite values show a static <code>placeholder</code> instead of digits;
        a later finite value counts in from zero.
      </p>
      <InvalidExample />

      <DocH2 id="accessibility">Accessibility</DocH2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>
          Screen readers get one visually hidden string with the full formatted value; the rolling
          digits are <code>aria-hidden</code>, so nothing is read digit by digit.
        </li>
        <li>
          Set <code>announce</code> to make the ticker a polite live region. It is off by default
          because many tickers, or fast updates, would be noisy.
        </li>
        <li>
          With <code>prefers-reduced-motion: reduce</code> there is no rolling and no entrance
          animation, and the first count-in starts straight away instead of waiting for visibility.
        </li>
        <li>
          Digits use tabular numerals, so the layout does not jitter. Colour is inherited, so contrast
          follows the surrounding text in light, dark and every brand.
        </li>
        <li>
          Before the first count-in (and in server-rendered HTML) each visual column rests at zero
          while the hidden text already holds the real value.
        </li>
        <li>
          Only ASCII digits roll. If you set <code>format.numberingSystem</code> to a non-Latin system,
          those digits are shown without rolling.
        </li>
      </ul>

      <DocH2 id="api-reference">API Reference</DocH2>
      <DocH3 id="api-number-ticker">NumberTicker</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Renders a <code>span</code> root. Remaining props are spread onto it. Parts carry{" "}
        <code>data-slot</code>: <code>number-ticker</code>, <code>number-ticker-label</code>,{" "}
        <code>number-ticker-track</code>, <code>number-ticker-digit</code>,{" "}
        <code>number-ticker-stack</code>, <code>number-ticker-cell</code> and{" "}
        <code>number-ticker-char</code>.
      </p>
      <PropsTable rows={[
        { prop: "value", type: "number", default: "—", desc: "The number to display. A change rolls the digits; non-finite values show the placeholder" },
        { prop: "format", type: "Intl.NumberFormatOptions", default: "—", desc: "Options for Intl.NumberFormat (currency, percent, compact, fraction digits, grouping). Compared by content, so inline objects are fine" },
        { prop: "locale", type: "string", default: "runtime default", desc: "BCP 47 locale for separators, decimal mark and symbol placement" },
        { prop: "duration", type: "number", default: "900", desc: "Length of one roll in ms. All digits share it; 0 is instant" },
        { prop: "delay", type: "number", default: "0", desc: "Wait in ms before the first count-in, counted from becoming visible. Applies to the first start only" },
        { prop: "animateOnView", type: "boolean", default: "true", desc: "Wait until about 30% of the number is visible before the first count-in. Triggers once" },
        { prop: "announce", type: "boolean", default: "false", desc: "Make the root a polite live region so value changes are announced" },
        { prop: "placeholder", type: "string", default: '"–"', desc: "Glyph shown when value is not a finite number" },
        { prop: "emptyLabel", type: "string", default: '"No value"', desc: "Text read by screen readers when value is not a finite number" },
        { prop: "className", type: "string", default: "—", desc: "Classes on the root, for font size, weight and colour" },
      ]} />
    </DocPage>
  )
}

function ControlledExample() {
  const [value, setValue] = useState(4875)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-5">
        <NumberTicker value={value} className="text-5xl font-semibold" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" size="icon" aria-label="Subtract 100" onClick={() => setValue((v) => v - 100)}>
            <Minus />
          </Button>
          <Button variant="outline" size="icon" aria-label="Add 100" onClick={() => setValue((v) => v + 100)}>
            <Plus />
          </Button>
          <Button variant="outline" onClick={() => setValue(Math.round(Math.random() * 99999))}>
            <Shuffle />
            Random
          </Button>
          <Button variant="outline" onClick={() => setValue(9999)}>
            9,999
          </Button>
          <Button variant="outline" onClick={() => setValue(10000)}>
            10,000
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

function CountInExample() {
  const [run, setRun] = useState(0)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-5">
        <NumberTicker
          key={run}
          value={73250}
          delay={300}
          duration={1600}
          className="text-5xl font-semibold"
        />
        <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw />
          Replay
        </Button>
      </div>
    </ComponentPreview>
  )
}

function LiveExample() {
  const [value, setValue] = useState(1280.5)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const id = setInterval(
      () => setValue((v) => Math.max(0, v + (Math.random() - 0.45) * 40)),
      600,
    )
    return () => clearInterval(id)
  }, [running])

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-5">
        <NumberTicker
          value={value}
          duration={500}
          locale="en-US"
          format={{ style: "currency", currency: "USD" }}
          className="text-4xl font-semibold"
        />
        <Button variant="outline" size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Resume"}
        </Button>
      </div>
    </ComponentPreview>
  )
}

function InvalidExample() {
  const [value, setValue] = useState(Number.NaN)

  return (
    <ComponentPreview>
      <div className="flex flex-col items-center gap-5">
        <NumberTicker value={value} className="text-4xl font-semibold" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setValue(Number.NaN)}>
            NaN
          </Button>
          <Button variant="outline" size="sm" onClick={() => setValue(Math.round(Math.random() * 9999))}>
            Set a number
          </Button>
        </div>
      </div>
    </ComponentPreview>
  )
}

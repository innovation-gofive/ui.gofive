import type { Metadata } from "next"

import { DocPage, DocH2, DocH3, DocLead } from "@/components/docs/doc-page"
import { CodeBlock } from "@/components/docs/code-block"

export const metadata: Metadata = {
  title: "Component contracts — Gofive Components",
  description:
    "The guarantees every Gofive component makes: how overlays portal, what a form control accepts, and how colors are read.",
}

const toc = [
  { title: "Overlays & portals", href: "#overlays" },
  { title: "Form controls", href: "#form-controls" },
  { title: "Async options", href: "#async" },
  { title: "Color", href: "#color" },
]

export default function ContractsPage() {
  return (
    <DocPage
      breadcrumb={["Docs", "Contracts"]}
      title="Component contracts"
      description="Guarantees that hold across the registry, so a component you have not used before still behaves the way you expect."
      toc={toc}
    >
      <DocLead>
        These are promises, not suggestions. If you build a component on top of
        this registry, keep them — and if one is broken, that is a bug worth
        reporting rather than working around at the call site.
      </DocLead>

      <DocH2 id="overlays">Overlays &amp; portals</DocH2>
      <DocLead>
        <strong className="text-foreground">
          Every overlay renders into <code>document.body</code> through a portal.
        </strong>{" "}
        Dropdowns, popovers, tooltips, dialogs, drawers and sheets are never
        positioned inside your layout tree.
      </DocLead>
      <p className="mt-4 leading-7 text-muted-foreground">
        This is what keeps an open dropdown from being sliced in half by an
        ancestor with <code>overflow: hidden</code> — an accordion, a scroll
        area, a table cell. A panel placed with <code>position: absolute</code>{" "}
        inside the trigger&rsquo;s own subtree cannot escape that clip; a
        portalled one has no ancestor to clip it.
      </p>
      <CodeBlock
        className="mt-4"
        language="tsx"
        code={`// Safe: the panel is portalled, so the accordion's overflow cannot clip it.
<AccordionContent className="overflow-hidden">
  <Select options={options} />
</AccordionContent>`}
      />
      <p className="mt-4 leading-7 text-muted-foreground">
        Two consequences worth knowing. Overlay content is outside your CSS
        cascade, so styles scoped to a parent selector will not reach it — style
        it with its own <code>className</code>. And a
        <code> data-brand</code> set on an inner wrapper will not apply either;
        put it on <code>&lt;html&gt;</code> or another ancestor of{" "}
        <code>&lt;body&gt;</code>.
      </p>

      <DocH2 id="form-controls">Form controls</DocH2>
      <DocLead>
        Every picker accepts the same field contract, so it drops into{" "}
        <code>react-hook-form</code>&rsquo;s <code>&lt;Controller&gt;</code> or a{" "}
        <code>&lt;FormControl&gt;</code> slot without a wrapper of your own.
      </DocLead>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Prop</th>
              <th className="px-4 py-2 font-medium">Guarantee</th>
            </tr>
          </thead>
          <tbody className="[&_td]:border-t [&_td]:px-4 [&_td]:py-2 [&_td]:align-top">
            <tr>
              <td>
                <code>ref</code>
              </td>
              <td className="text-muted-foreground">
                Lands on the trigger element itself, so <code>FormControl</code>{" "}
                (a Radix Slot) and <code>field.ref</code> can focus it.
              </td>
            </tr>
            <tr>
              <td>
                <code>name</code>
              </td>
              <td className="text-muted-foreground">
                Mirrors the value into a hidden input beside the trigger, so a
                native <code>&lt;form&gt;</code> submit carries it. Multi-value
                pickers emit one input per value; date pickers emit ISO 8601.
              </td>
            </tr>
            <tr>
              <td>
                <code>onBlur</code>
              </td>
              <td className="text-muted-foreground">
                Fires when the panel closes — not when the trigger loses focus,
                because focus moves <em>into</em> the panel. Never fires before
                the user has opened the field, so validation does not light up on
                first render.
              </td>
            </tr>
            <tr>
              <td>
                <code>error</code>
              </td>
              <td className="text-muted-foreground">
                Paints the invalid border and sets <code>aria-invalid</code> on
                the trigger. <code>aria-describedby</code> and{" "}
                <code>aria-labelledby</code> pass straight through.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock
        className="mt-4"
        language="tsx"
        code={`<Controller
  control={control}
  name="assignee"
  render={({ field, fieldState }) => (
    <Select
      ref={field.ref}
      name={field.name}
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      error={!!fieldState.error}
      options={people}
    />
  )}
/>`}
      />

      <DocH3 id="select-not-radix">Select is not built on Radix Select</DocH3>
      <p className="mt-4 leading-7 text-muted-foreground">
        <code>Select</code> is a popover over a listbox rather than a wrapper
        around Radix Select. That is deliberate: Radix Select listens for a
        form&rsquo;s <code>reset</code> event and snaps back to its mount-time
        value, which silently wipes a form that calls{" "}
        <code>reset()</code> from <code>react-hook-form</code>. The trigger still
        reports itself as <code>role=&quot;combobox&quot;</code> with{" "}
        <code>aria-expanded</code> and <code>aria-controls</code>, and the panel
        as <code>role=&quot;listbox&quot;</code>, so assistive tech sees the
        expected shape.
      </p>

      <DocH2 id="async">Async options</DocH2>
      <DocLead>
        Pass <code>onSearchChange</code> and the component stops filtering
        locally — you own the option list, it owns the panel.
      </DocLead>
      <p className="mt-4 leading-7 text-muted-foreground">
        Closing the panel calls <code>onSearchChange(&quot;&quot;)</code> so the
        next open does not show a list still narrowed by the last query. Pair it
        with <code>loading</code> for the in-flight row and{" "}
        <code>emptyState</code> for &ldquo;no results&rdquo;.{" "}
        <code>maxRenderedOptions</code> (200 by default) caps how many rows are
        rendered at once — a thousand-row response would otherwise block the main
        thread on every open.
      </p>
      <CodeBlock
        className="mt-4"
        language="tsx"
        code={`<Select
  searchable
  options={results}          // controlled by you
  onSearchChange={setQuery}  // hands filtering to your API
  loading={isFetching}
  emptyState={<NoContactsFound />}
/>`}
      />

      <DocH2 id="color">Color</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Components never paint with literal hex or with a raw{" "}
        <code>var(--token)</code> in an inline style. Colors are applied as
        Tailwind utilities, which means your app&rsquo;s build resolves them
        against your own theme — whether you store tokens as real colors or as
        HSL triplets — and a caller can always override one with{" "}
        <code>className</code>.
      </p>
      <p className="mt-4 leading-7 text-muted-foreground">
        The one exception is a color you supply yourself (an avatar tint, a
        status dot); those arrive as inline style because only you know them.
      </p>
    </DocPage>
  )
}

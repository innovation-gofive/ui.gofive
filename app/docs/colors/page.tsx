import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

// ── Brand ────────────────────────────────────────────────────────────
const PRODUCTS: {
  name: string
  brand: string
  hex: string
  onLight?: boolean
  note: string
}[] = [
  { name: "Gofive · empeo · Calendio", brand: "—", hex: "#F88411", note: "Brand primary — buttons, links, accents" },
  { name: "Venio", brand: "venio", hex: "#116DFC", note: "CRM · Bluetiful" },
  { name: "Desk", brand: "desk", hex: "#2DAE4B", note: "Helpdesk · Green" },
  { name: "ShipX", brand: "shipx", hex: "#E89A2A", note: "Logistics · Amber" },
  { name: "SalesBear", brand: "salesbear", hex: "#FFC505", onLight: true, note: "Sales · Sunglow" },
  { name: "eTAXGO", brand: "etaxgo", hex: "#EB1C26", note: "Tax · Crimson" },
  { name: "emconnect", brand: "emconnect", hex: "#5E5EED", note: "Comms · Indigo" },
]

// ── Neutrals ─────────────────────────────────────────────────────────
const NEUTRALS = [
  { name: "Ink", token: "--gf-fg-1", hex: "#1C1C22" },
  { name: "fg-2", token: "--gf-fg-2", hex: "#383842" },
  { name: "fg-3", token: "--gf-fg-3", hex: "#52525F" },
  { name: "fg-4", token: "--gf-fg-4", hex: "#6A6A7C" },
  { name: "fg-5", token: "--gf-fg-5", hex: "#83839A" },
  { name: "fg-6", token: "--gf-fg-6", hex: "#A5A5B6" },
  { name: "line-1", token: "--gf-line-1", hex: "#D2D2DA" },
  { name: "line-2", token: "--gf-line-2", hex: "#DFDFE8" },
  { name: "line-4", token: "--gf-line-4", hex: "#ECECF1" },
]

const SURFACES = [
  { name: "bg-2 (surface)", token: "--gf-bg-2", hex: "#F6F6F8" },
  { name: "bg-3 (app)", token: "--gf-bg-3", hex: "#F5F5F5" },
  { name: "bg-4", token: "--gf-bg-4", hex: "#EFEFEF" },
  { name: "white", token: "--gf-white", hex: "#FFFFFF", border: true },
  { name: "black", token: "--gf-black", hex: "#000000" },
]

// ── Semantic, per product ────────────────────────────────────────────
type Sem = { solid: string; onLight?: boolean }
const SEMANTIC: {
  product: string
  tag: string
  success: Sem
  warning: Sem
  danger: Sem
  info: Sem
}[] = [
  {
    product: "Gofive · empeo · Calendio",
    tag: "base · orange",
    success: { solid: "#1DA577" },
    warning: { solid: "#F9D423", onLight: true },
    danger: { solid: "#D93A1A" },
    info: { solid: "#0A66E0" },
  },
  {
    product: "Venio",
    tag: "Info = primary",
    success: { solid: "#0FA36A" },
    warning: { solid: "#FFC230", onLight: true },
    danger: { solid: "#E0335A" },
    info: { solid: "#116DFC" },
  },
  {
    product: "Desk",
    tag: "Success = primary",
    success: { solid: "#2DAE4B" },
    warning: { solid: "#F5B800", onLight: true },
    danger: { solid: "#D43A2F" },
    info: { solid: "#0F8FB8" },
  },
  {
    product: "ShipX",
    tag: "Warning = primary",
    success: { solid: "#1DA577" },
    warning: { solid: "#E89A2A", onLight: true },
    danger: { solid: "#C2362C" },
    info: { solid: "#156FB5" },
  },
  {
    product: "SalesBear",
    tag: "Warning = primary",
    success: { solid: "#17A76B" },
    warning: { solid: "#FFC505", onLight: true },
    danger: { solid: "#E03A3A" },
    info: { solid: "#1565C9" },
  },
  {
    product: "eTAXGO",
    tag: "Danger = primary",
    success: { solid: "#1DA577" },
    warning: { solid: "#F0B400", onLight: true },
    danger: { solid: "#EB1C26" },
    info: { solid: "#1A64B8" },
  },
  {
    product: "emconnect",
    tag: "indigo",
    success: { solid: "#16A37A" },
    warning: { solid: "#F5B83C", onLight: true },
    danger: { solid: "#E03556" },
    info: { solid: "#5E5EED" },
  },
]

const TOKENS = [
  { token: "--primary / --primary-foreground", desc: "Brand primary — set per product, used by buttons, links, active states" },
  { token: "--success / --success-soft", desc: "Positive state — solid fill and soft pill/toast tint" },
  { token: "--warning / --warning-soft", desc: "Caution state — solid and soft tint" },
  { token: "--danger / --danger-soft", desc: "Error state — also aliased to --destructive" },
  { token: "--info / --info-soft", desc: "Informational state — solid and soft tint" },
  { token: "--gf-fg-1 … --gf-fg-6", desc: "Foreground / ink ramp, darkest to lightest text" },
  { token: "--gf-line-1 / -2 / -4", desc: "Border and divider greys" },
  { token: "--gf-bg-2 / -3 / -4", desc: "Surface, app, and sunken background greys" },
]

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Brand colors", href: "#brand" },
  { title: "Neutrals", href: "#neutrals" },
  { title: "Semantic colors", href: "#semantic" },
  { title: "Switching product", href: "#switching" },
  { title: "Token reference", href: "#tokens" },
]

// ── Small presentational helpers ─────────────────────────────────────
function Swatch({
  hex,
  label,
  sub,
  onLight,
  border,
}: {
  hex: string
  label: string
  sub?: string
  onLight?: boolean
  border?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        className="flex h-16 items-end p-2 text-[11px] font-semibold"
        style={{
          background: hex,
          color: onLight ? "#212121" : "#fff",
          boxShadow: border ? "inset 0 0 0 1px var(--border)" : undefined,
        }}
      >
        {label}
      </div>
      <div className="space-y-0.5 p-2">
        <div className="font-mono text-[11px] tabular-nums">{hex}</div>
        {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  )
}

function SemanticCell({ name, sem }: { name: string; sem: Sem }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div
        className="flex h-9 items-center px-2 text-[10px] font-bold uppercase tracking-wide"
        style={{ background: sem.solid, color: sem.onLight ? "#212121" : "#fff" }}
      >
        {name}
      </div>
      <div className="px-2 py-1 font-mono text-[10px] tabular-nums text-muted-foreground">
        {sem.solid}
      </div>
    </div>
  )
}

export default function ColorsPage() {
  return (
    <DocPage
      breadcrumb={["Theming", "Colors"]}
      title="Colors"
      description="The GoFive color system — a shared neutral ramp, per-product brand primaries, and semantic palettes (Success / Warning / Danger / Info) tuned to each product's hue. Shipped as a shadcn registry:theme."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add the theme from the registry. It writes <code>app/gofive-theme.css</code> with every
        color token for light and dark mode.
      </p>
      <InstallTabs component="@gofive/theme" />

      <DocH2 id="usage">Usage</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Import the theme in your <code>globals.css</code>, after the Tailwind import. Tokens are then
        available as Tailwind colors (<code>bg-primary</code>, <code>text-success</code>,{" "}
        <code>bg-warning-soft</code>, …) and as raw CSS variables.
      </p>
      <CodeBlock
        className="mt-4"
        code={`/* globals.css */
@import "tailwindcss";
@import "./gofive-theme.css";`}
      />

      <DocH2 id="brand">Brand colors</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each product owns a primary hue. Gofive, empeo, and Calendio share the orange brand; the rest
        ship their own primary. The Gofive gradient is reserved for hero banners and marketing — never
        for UI chrome.
      </p>

      <DocH3 id="brand-gradient">Gofive gradient</DocH3>
      <ComponentPreview>
        <div
          className="flex h-20 w-full items-end rounded-lg border p-3 text-sm font-bold text-[#212121]"
          style={{ background: "linear-gradient(90deg,#F83600 0%,#F88411 50%,#F9D423 100%)" }}
        >
          #F83600 → #F88411 → #F9D423
        </div>
      </ComponentPreview>

      <DocH3 id="brand-primaries">Product primaries</DocH3>
      <ComponentPreview>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {PRODUCTS.map((p) => (
            <Swatch key={p.name} hex={p.hex} label={p.name} sub={p.note} onLight={p.onLight} />
          ))}
        </div>
      </ComponentPreview>

      <DocH2 id="neutrals">Neutrals</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        A single ink-to-surface ramp shared by every product. Foreground greys for text, line greys
        for borders, and background greys for surfaces.
      </p>
      <ComponentPreview>
        <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {NEUTRALS.map((n) => (
            <Swatch key={n.token} hex={n.hex} label={n.name} sub={n.token} />
          ))}
        </div>
      </ComponentPreview>
      <ComponentPreview>
        <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-5">
          {SURFACES.map((s) => (
            <Swatch key={s.token} hex={s.hex} label={s.name} sub={s.token} border={s.border} onLight />
          ))}
        </div>
      </ComponentPreview>

      <DocH2 id="semantic">Semantic colors</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Semantic colors shift their <strong>hue</strong> toward each product&apos;s primary while
        keeping the meaning fixed — green = success, yellow = warning, red = danger, blue = info. When
        a product&apos;s own primary already <em>is</em> a semantic color (Desk→Success,
        SalesBear/ShipX→Warning, eTAXGO→Danger, Venio→Info), it reuses the primary for that slot.
      </p>
      <div className="mt-6 space-y-4">
        {SEMANTIC.map((row) => (
          <div key={row.product} className="rounded-lg border p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm font-semibold">{row.product}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{row.tag}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <SemanticCell name="Success" sem={row.success} />
              <SemanticCell name="Warning" sem={row.warning} />
              <SemanticCell name="Danger" sem={row.danger} />
              <SemanticCell name="Info" sem={row.info} />
            </div>
          </div>
        ))}
      </div>

      <DocH2 id="switching">Switching product</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Set <code>data-brand</code> on <code>&lt;html&gt;</code> (or any ancestor) to swap the whole
        primary + semantic palette at runtime. Omit it for the base Gofive orange palette. Add{" "}
        <code>.dark</code> for dark mode — neutrals are overridden and the semantic soft tints are
        recomputed from the same hues, so every brand works in both modes.
      </p>
      <CodeBlock
        className="mt-4"
        code={`<!-- empeo | calendio | venio | desk | shipx | salesbear | etaxgo | emconnect -->
<html data-brand="venio">          <!-- Venio's blue palette -->
<html data-brand="desk" class="dark"> <!-- Desk green, dark mode -->
<html>                              <!-- base Gofive orange -->`}
      />

      <DocH2 id="tokens">Token reference</DocH2>
      <p className="mt-2 text-sm text-muted-foreground">
        Each <code>--color-*</code> exposed to Tailwind is backed by a raw variable below. Every solid
        token has a matching <code>-foreground</code>; semantic tokens add a <code>-soft</code> /{" "}
        <code>-soft-foreground</code> pair for pills and toasts.
      </p>
      <PropsTable
        rows={TOKENS.map((t) => ({
          prop: t.token,
          type: "color",
          default: "—",
          desc: t.desc,
        }))}
      />
    </DocPage>
  )
}

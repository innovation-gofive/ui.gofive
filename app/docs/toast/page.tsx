"use client"

import { Button } from "@/registry/new-york/ui/button"
import {
  Toaster,
  toast,
  type ToastStatus,
} from "@/registry/new-york/ui/toast"
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
  { title: "With action", href: "#action", depth: 1 },
  { title: "Title only", href: "#title-only", depth: 1 },
  { title: "Duration", href: "#duration", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function ToastPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Toast"]}
      title="Toast"
      description="Primary-tinted status notifications — success, warning, danger, info, and neutral — with an icon, title, description, optional action, close button, and an auto-dismiss progress bar."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/toast" />

      <DocH2 id="usage">Usage</DocH2>
      <p className="mt-4 text-sm text-muted-foreground">
        Mount <code className="font-mono text-[13px]">&lt;Toaster /&gt;</code> once near your app root,
        then call <code className="font-mono text-[13px]">toast()</code> from anywhere.
      </p>
      <CodeBlock
        className="mt-4"
        code={`// app/layout.tsx
import { Toaster } from "@/components/ui/toast"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}`}
      />
      <CodeBlock
        className="mt-4"
        code={`import { toast } from "@/components/ui/toast"

toast({
  status: "success",
  title: "Payroll approved",
  description: "March cycle · 1,284 employees",
})`}
      />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="statuses">Statuses</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Five semantic statuses — each tints the icon, left border, and progress bar.
      </p>
      <ToastDemo>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "success",
                title: "Payroll approved",
                description: "March cycle · 1,284 employees",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "warning",
                title: "Waiting check-in",
                description: "12 employees have not checked in yet",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "danger",
                title: "Failed to save",
                description: "Network error — please retry.",
              })
            }
          >
            Danger
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "info",
                title: "New feature available",
                description: "Shift swap is now open to managers.",
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "neutral",
                title: "Draft saved",
                description: "Your changes are stored locally.",
              })
            }
          >
            Neutral
          </Button>
        </div>
      </ToastDemo>

      <DocH3 id="action">With action</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Add an inline action button for follow-up tasks like undo or retry.
      </p>
      <ToastDemo>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "danger",
                title: "Filing rejected",
                description: "Invalid seller TIN on 2 lines.",
                action: {
                  label: "Retry",
                  onClick: () =>
                    toast({ status: "info", title: "Retrying submission…" }),
                },
              })
            }
          >
            Show with action
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "success",
                title: "Lead archived",
                description: "ACME Co. moved to archive.",
                action: {
                  label: "Undo",
                  onClick: () =>
                    toast({ status: "neutral", title: "Restored" }),
                },
              })
            }
          >
            Show with undo
          </Button>
        </div>
      </ToastDemo>

      <DocH3 id="title-only">Title only</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Description is optional — a concise title works for quick confirmations.
      </p>
      <ToastDemo>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["success", "warning", "danger", "info"] as ToastStatus[]).map((status) => (
            <Button
              key={status}
              variant="outline"
              onClick={() => toast({ status, title: `${status} toast` })}
            >
              {status}
            </Button>
          ))}
        </div>
      </ToastDemo>

      <DocH3 id="duration">Duration</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Control how long a toast stays before auto-dismissing — the progress bar mirrors it.
      </p>
      <ToastDemo>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "info",
                title: "Quick toast",
                description: "Dismisses in 2 seconds.",
                duration: 2000,
              })
            }
          >
            2s
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                status: "warning",
                title: "Lingering toast",
                description: "Dismisses in 10 seconds.",
                duration: 10000,
              })
            }
          >
            10s
          </Button>
        </div>
      </ToastDemo>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-toast">toast()</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Imperative helper that pushes a toast onto the store. Returns{" "}
        <code className="font-mono text-[13px]">{"{ id, dismiss, update }"}</code>.
      </p>
      <PropsTable rows={[
        { prop: "title", type: "ReactNode", default: "—", desc: "Bold heading line" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Optional supporting message" },
        { prop: "status", type: '"success" | "warning" | "danger" | "info" | "neutral"', default: '"info"', desc: "Semantic status — controls tint and icon" },
        { prop: "duration", type: "number", default: "5000", desc: "Auto-dismiss delay in ms; drives the progress bar" },
        { prop: "action", type: "{ label, onClick?, altText? }", default: "—", desc: "Optional inline action button" },
      ]} />

      <DocH3 id="api-useToast">useToast()</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Hook that subscribes to the toast store. Returns{" "}
        <code className="font-mono text-[13px]">{"{ toasts, toast, dismiss }"}</code> — used internally by{" "}
        <code className="font-mono text-[13px]">Toaster</code>, also available to build a custom renderer.
      </p>

      <DocH3 id="api-toaster">Toaster</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drop-in renderer that mounts the provider, viewport (bottom-right), and subscribes to the store.
        Mount it once near the app root.
      </p>
      <PropsTable rows={[
        { prop: "swipeDirection", type: '"right" | "left" | "up" | "down"', default: '"right"', desc: "Direction to swipe a toast away" },
      ]} />

      <DocH3 id="api-primitives">Primitives</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        For full control, compose the styled primitives directly:{" "}
        <code className="font-mono text-[13px]">ToastProvider</code>,{" "}
        <code className="font-mono text-[13px]">ToastViewport</code>,{" "}
        <code className="font-mono text-[13px]">Toast</code>,{" "}
        <code className="font-mono text-[13px]">ToastIcon</code>,{" "}
        <code className="font-mono text-[13px]">ToastTitle</code>,{" "}
        <code className="font-mono text-[13px]">ToastDescription</code>,{" "}
        <code className="font-mono text-[13px]">ToastAction</code>,{" "}
        <code className="font-mono text-[13px]">ToastClose</code>,{" "}
        <code className="font-mono text-[13px]">ToastProgress</code>.
      </p>
    </DocPage>
  )
}

// Wrap a preview so the Toaster is mounted and toasts render in-page.
function ToastDemo({ children }: { children: React.ReactNode }) {
  return (
    <ComponentPreview className="min-h-[120px]">
      {children}
      <Toaster />
    </ComponentPreview>
  )
}

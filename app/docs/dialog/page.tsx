"use client"

import { useState } from "react"
import { Trash2, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/registry/new-york/ui/dialog"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Basic", href: "#basic", depth: 1 },
  { title: "Destructive confirm", href: "#confirm", depth: 1 },
  { title: "Form dialog", href: "#form", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function DialogPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Dialog"]}
      title="Dialog"
      description="A modal dialog rendered over the page — composable header, body, and footer slots for confirm prompts, input-heavy forms, and multi-step wizards."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/dialog" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"`}
      />
      <CodeBlock
        className="mt-4"
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button>OK</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      />

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="basic">Basic</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A standard modal with a header, description, and a footer action.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <BasicExample />
      </ComponentPreview>

      <DocH3 id="confirm">Destructive confirm</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A controlled confirmation prompt using the danger palette for the irreversible action.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <ConfirmExample />
      </ComponentPreview>

      <DocH3 id="form">Form dialog</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An input-heavy modal that closes on submit. The form state is local and controlled.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <FormExample />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-dialog">Dialog</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Root container. Wraps the trigger and content; controls open state.
      </p>
      <PropsTable rows={[
        { prop: "open", type: "boolean", default: "—", desc: "Controlled open state" },
        { prop: "defaultOpen", type: "boolean", default: "false", desc: "Open state when uncontrolled" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "Called when the open state changes" },
        { prop: "modal", type: "boolean", default: "true", desc: "Whether interaction with outside elements is blocked" },
      ]} />

      <DocH3 id="api-content">DialogContent</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Centered modal panel rendered in a portal over the overlay.
      </p>
      <PropsTable rows={[
        { prop: "showCloseButton", type: "boolean", default: "true", desc: "Render the top-right close (×) button" },
        { prop: "className", type: "string", default: "—", desc: "Override width, padding, and layout (e.g. sm:max-w-xl for forms)" },
        { prop: "onEscapeKeyDown", type: "(e: KeyboardEvent) => void", default: "—", desc: "Called when the escape key is pressed" },
        { prop: "onInteractOutside", type: "(e: Event) => void", default: "—", desc: "Called on pointer or focus interaction outside the content" },
      ]} />

      <DocH3 id="api-parts">DialogHeader · DialogFooter · DialogTitle · DialogDescription · DialogClose</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Layout and accessibility slots. DialogClose closes the dialog when activated — use{" "}
        <code className="font-mono text-[12px]">asChild</code> to wrap a Button.
      </p>
      <PropsTable rows={[
        { prop: "DialogHeader", type: "div", default: "—", desc: "Stacks DialogTitle and DialogDescription with spacing" },
        { prop: "DialogFooter", type: "div", default: "—", desc: "Right-aligned action row (column-reverse on mobile)" },
        { prop: "DialogTitle", type: "Radix Title", default: "—", desc: "Accessible heading announced to screen readers" },
        { prop: "DialogDescription", type: "Radix Description", default: "—", desc: "Supporting text linked via aria-describedby" },
        { prop: "DialogClose", type: "Radix Close", default: "—", desc: "Closes the dialog; supports asChild" },
      ]} />
    </DocPage>
  )
}

function BasicExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payroll submitted for March</DialogTitle>
          <DialogDescription>
            248 employees · ฿18.4M total. Approvers will be notified and payments are scheduled for March 28th.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">View receipt</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmExample() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
          Delete employees
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#FDE0D6", color: "#D93A1A" }}
            >
              <Trash2 className="size-5" />
            </span>
            <div className="space-y-1.5 text-left">
              <DialogTitle>Delete 3 employees?</DialogTitle>
              <DialogDescription>
                Their profiles, payroll records, and pending time-off requests will be permanently removed. This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            style={{ backgroundColor: "#D93A1A", color: "#ffffff" }}
            onClick={() => setOpen(false)}
          >
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FormExample() {
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Invite employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite a new employee</DialogTitle>
          <DialogDescription>
            Send an onboarding email with account setup instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" defaultValue="Ploy" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" defaultValue="Kittisak" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" defaultValue="ploy.k@gofive.co.th" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Personal note (optional)</Label>
            <Textarea id="note" placeholder="Welcome to the team…" />
            <p className="text-xs text-muted-foreground">
              They will see this message in their welcome email.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Send invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Trash2,
  UserPlus,
} from "lucide-react"
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
import { cn } from "@/lib/utils"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Success confirm", href: "#success", depth: 1 },
  { title: "Destructive confirm", href: "#confirm", depth: 1 },
  { title: "Form dialog", href: "#form", depth: 1 },
  { title: "Multi-step wizard", href: "#wizard", depth: 1 },
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

      <DocH3 id="success">Success confirm</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An acknowledgement modal with a success icon and a spread footer — a
        secondary text action on the left, the primary action on the right.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <SuccessExample />
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

      <DocH3 id="wizard">Multi-step wizard</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A wider modal with a step indicator. The current step is highlighted,
        completed steps show a check, and the footer carries the Back / Skip /
        Continue navigation.
      </p>
      <ComponentPreview className="min-h-[140px]">
        <WizardExample />
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

function SuccessExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Submit payroll</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-success-soft text-success-soft-foreground">
              <Check className="size-5" strokeWidth={2.2} />
            </span>
            <div className="space-y-1 text-left">
              <DialogTitle>Payroll submitted for March</DialogTitle>
              <DialogDescription>
                248 employees · ฿18.4M total. Approvers will be notified and payments are scheduled for March 28th.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="text-muted-foreground">
              View receipt
            </Button>
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
          <div className="flex items-start gap-3.5">
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-danger-soft text-danger-soft-foreground">
              <Trash2 className="size-5" />
            </span>
            <div className="space-y-1 text-left">
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
          <Button variant="destructive" onClick={() => setOpen(false)}>
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <span className="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-info-soft text-info-soft-foreground">
              <Info className="size-5" />
            </span>
            <div className="space-y-1 text-left">
              <DialogTitle>Invite a new employee</DialogTitle>
              <DialogDescription>
                Send an onboarding email with account setup instructions.
              </DialogDescription>
            </div>
          </div>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Member" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="People Ops" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Personal note (optional)</Label>
            <Textarea id="note" placeholder="Welcome to the team…" />
            <p className="text-xs text-muted-foreground">
              They will see this message in their welcome email.
            </p>
          </div>
          <DialogFooter className="sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">
              <kbd className="rounded-[5px] border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                ⏎
              </kbd>{" "}
              Send invite
            </span>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Send invite</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const WIZARD_STEPS = ["Workspace", "Team", "Integrations", "Review"]

const INTEGRATIONS = [
  { name: "Slack", desc: "Team messaging" },
  { name: "Google", desc: "Drive, Calendar" },
  { name: "LINE", desc: "Notifications" },
]

function WizardExample() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(2)
  const [selected, setSelected] = useState("Slack")

  const isLast = step === WIZARD_STEPS.length - 1

  function reset(next: boolean) {
    setOpen(next)
    if (!next) setStep(2)
  }

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>
        <Button variant="outline">New workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[step]}
          </DialogDescription>
        </DialogHeader>

        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {WIZARD_STEPS.map((label, i) => {
            const done = i < step
            const active = i === step
            return (
              <li key={label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    active && "font-semibold text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-[22px] items-center justify-center rounded-full text-[11.5px] font-semibold",
                      done && "bg-success text-success-foreground",
                      active && "bg-primary text-primary-foreground",
                      !done && !active && "bg-muted text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="size-2.5" strokeWidth={3} /> : i + 1}
                  </span>
                  {label}
                </span>
                {i < WIZARD_STEPS.length - 1 && (
                  <span
                    className={cn(
                      "h-px w-4",
                      done ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>

        {step === 2 ? (
          <div className="grid gap-3">
            <div className="grid grid-cols-3 gap-2.5">
              {INTEGRATIONS.map((it) => {
                const on = selected === it.name
                return (
                  <button
                    key={it.name}
                    type="button"
                    onClick={() => setSelected(it.name)}
                    className={cn(
                      "rounded-[10px] border p-3 text-left transition-colors",
                      on
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <div className="text-sm font-bold">{it.name}</div>
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {it.desc}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              You can add or change integrations anytime in workspace settings.
            </p>
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">
            {isLast
              ? "Review your selections and create the workspace."
              : `Configure your ${WIZARD_STEPS[step].toLowerCase()} to continue.`}
          </p>
        )}

        <DialogFooter className="sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft />
            Back
          </Button>
          <div className="flex gap-2">
            {!isLast && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}
              >
                Skip
              </Button>
            )}
            {isLast ? (
              <Button onClick={() => reset(false)}>Create workspace</Button>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRight />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

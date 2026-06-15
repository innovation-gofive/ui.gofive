"use client"

import {
  PersonPicker,
  PersonMultiPicker,
  ReviewerStack,
  type Person,
} from "@/registry/new-york/ui/person-picker"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Single picker", href: "#single", depth: 1 },
  { title: "Multi assignees", href: "#multi", depth: 1 },
  { title: "Reviewer stack", href: "#reviewers", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

// ── Sample data ─────────────────────────────────────────────────────
const people: Person[] = [
  {
    id: "sp",
    name: "Somchai Prasert",
    email: "somchai@gofive.co.th",
    role: "HR Manager · Bangkok",
    avatarColor: "#F88411",
    presence: "online",
    group: "Assigned recently",
  },
  {
    id: "ak",
    name: "Anong Kraipob",
    email: "anong@gofive.co.th",
    role: "Senior Designer",
    avatarColor: "#0A66E0",
    presence: "online",
    group: "Assigned recently",
  },
  {
    id: "ns",
    name: "Nirut Suwanphan",
    email: "nirut@gofive.co.th",
    role: "Sales Lead",
    avatarColor: "#1DA577",
    presence: "away",
    group: "All teammates",
  },
  {
    id: "pc",
    name: "Prapa Chaiyo",
    email: "prapa@gofive.co.th",
    role: "Product Manager",
    avatarColor: "#5E5EED",
    presence: "offline",
    group: "All teammates",
  },
  {
    id: "kt",
    name: "Kittipong Thanawat",
    email: "kittipong@gofive.co.th",
    role: "Senior Engineer",
    avatarColor: "#D93A1A",
    presence: "online",
    group: "All teammates",
  },
  {
    id: "mw",
    name: "Montira Wong",
    email: "montira@gofive.co.th",
    role: "Finance Lead",
    avatarColor: "#7A5800",
    group: "All teammates",
  },
]

const reviewers: Person[] = [
  { id: "sp", name: "Somchai Prasert", avatarColor: "#F88411", status: "Approved", statusTone: "success" },
  { id: "ak", name: "Anong Kraipob", avatarColor: "#0A66E0", status: "Approved", statusTone: "success" },
  { id: "ns", name: "Nirut Suwanphan", avatarColor: "#1DA577", status: "Pending", statusTone: "warning" },
  { id: "pc", name: "Prapa Chaiyo", avatarColor: "#5E5EED", status: "Pending", statusTone: "muted" },
  { id: "kt", name: "Kittipong Thanawat", avatarColor: "#D93A1A", status: "Changes requested", statusTone: "danger" },
]

export default function PersonPickerPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Person Picker"]}
      title="Person Picker"
      description="People selection inputs — a single picker with presence and invite fallback, a multi-assignee picker with removable chips, and a reviewer stack showing per-person review status."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/person-picker" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { PersonPicker, PersonMultiPicker, ReviewerStack } from "@/components/ui/person-picker"`}
      />
      <ComponentPreview className="min-h-[120px]">
        <div className="w-full max-w-sm">
          <PersonPicker people={people} defaultValue="sp" />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="single">Single picker with presence + invite</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Rich rows with avatar, email and presence. Pass <code>onInvite</code> to show the email-invite footer row.
      </p>
      <ComponentPreview className="min-h-[120px]">
        <div className="w-full max-w-sm">
          <PersonPicker
            people={people}
            defaultValue="sp"
            onInvite={() => {}}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="multi">Multi assignees with chips + footer</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Selected people render as removable colored chips. Checkbox rows toggle membership; the footer clears or confirms.
      </p>
      <ComponentPreview className="min-h-[120px]">
        <div className="w-full max-w-lg">
          <PersonMultiPicker
            people={people}
            defaultValue={["sp", "ak", "ns", "pc"]}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="reviewers">Reviewer stack with statuses</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Overlapping avatars with a <code>+N</code> overflow. Each reviewer carries a status and tone shown trailing in the menu.
      </p>
      <ComponentPreview className="min-h-[120px]">
        <div className="w-full max-w-sm">
          <ReviewerStack people={reviewers} max={3} />
        </div>
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-personpicker">PersonPicker</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string", default: "—", desc: "Controlled selected person id" },
        { prop: "defaultValue", type: "string", default: "—", desc: "Initial selected id when uncontrolled" },
        { prop: "onValueChange", type: "(id: string) => void", default: "—", desc: "Called when a person is selected" },
        { prop: "people", type: "Person[]", default: "—", desc: "People to choose from" },
        { prop: "placeholder", type: "string", default: '"Select a person…"', desc: "Trigger text when none selected" },
        { prop: "searchable", type: "boolean", default: "true", desc: "Show the search box" },
        { prop: "onInvite", type: "(query: string) => void", default: "—", desc: "When set, renders the invite-by-email footer row" },
        { prop: "className", type: "string", default: "—", desc: "Additional trigger classes" },
      ]} />

      <DocH3 id="api-personmultipicker">PersonMultiPicker</DocH3>
      <PropsTable rows={[
        { prop: "value", type: "string[]", default: "—", desc: "Controlled selected ids" },
        { prop: "defaultValue", type: "string[]", default: "[]", desc: "Initial selected ids when uncontrolled" },
        { prop: "onValueChange", type: "(ids: string[]) => void", default: "—", desc: "Called when selection changes" },
        { prop: "people", type: "Person[]", default: "—", desc: "People to choose from" },
        { prop: "placeholder", type: "string", default: '"Add assignees…"', desc: "Trigger text when empty" },
        { prop: "searchable", type: "boolean", default: "true", desc: "Show the search box" },
        { prop: "showFooter", type: "boolean", default: "true", desc: "Show the Clear all / Assign footer" },
        { prop: "className", type: "string", default: "—", desc: "Additional trigger classes" },
      ]} />

      <DocH3 id="api-reviewerstack">ReviewerStack</DocH3>
      <PropsTable rows={[
        { prop: "people", type: "Person[]", default: "—", desc: "Reviewers; each may carry status and statusTone" },
        { prop: "max", type: "number", default: "3", desc: "Visible avatars before the +N overflow chip" },
        { prop: "className", type: "string", default: "—", desc: "Additional trigger classes" },
      ]} />

      <DocH3 id="api-person">Person</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        The shared data model. <code>initials</code> and <code>avatarColor</code> are derived from <code>name</code>/<code>id</code> when omitted.
      </p>
      <PropsTable rows={[
        { prop: "id", type: "string", default: "—", desc: "Unique identifier" },
        { prop: "name", type: "string", default: "—", desc: "Display name" },
        { prop: "email", type: "string", default: "—", desc: "Email address" },
        { prop: "role", type: "string", default: "—", desc: "Role / description line" },
        { prop: "avatarColor", type: "string", default: "—", desc: "Avatar background; hashed from id if omitted" },
        { prop: "initials", type: "string", default: "—", desc: "Avatar initials; computed from name if omitted" },
        { prop: "presence", type: '"online" | "away" | "offline"', default: "—", desc: "Presence dot + trailing label" },
        { prop: "group", type: "string", default: "—", desc: "Optional grouping heading" },
        { prop: "status", type: "string", default: "—", desc: "Per-person status text (ReviewerStack)" },
        { prop: "statusTone", type: '"success" | "warning" | "danger" | "muted"', default: '"muted"', desc: "Color tone for status text" },
      ]} />
    </DocPage>
  )
}

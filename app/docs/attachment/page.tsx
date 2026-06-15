"use client"

import { useState } from "react"
import {
  Dropzone,
  FileItem,
  LinkCard,
  MediaThumb,
  RichLinkCard,
  kindFromName,
} from "@/registry/new-york/ui/attachment"
import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { InstallTabs } from "@/components/docs/install-tabs"
import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { PropsTable } from "@/components/docs/props-table"

const toc = [
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "Dropzone", href: "#dropzone", depth: 1 },
  { title: "File list", href: "#file-list", depth: 1 },
  { title: "Upload & remove", href: "#upload-remove", depth: 1 },
  { title: "Media grid", href: "#media-grid", depth: 1 },
  { title: "Link cards", href: "#link-cards", depth: 1 },
  { title: "Rich link card", href: "#rich-link-card", depth: 1 },
  { title: "API Reference", href: "#api-reference" },
]

export default function AttachmentPage() {
  return (
    <DocPage
      breadcrumb={["Components", "Attachment & Link"]}
      title="Attachment & Link"
      description="File dropzone, uploaded-file rows with type icon, size, progress, and remove, plus rich link preview cards — everything you need for upload UIs."
      toc={toc}
    >
      <DocH2 id="installation">Installation</DocH2>
      <InstallTabs component="@gofive/attachment" />

      <DocH2 id="usage">Usage</DocH2>
      <CodeBlock
        className="mt-4"
        code={`import { Dropzone, FileItem, LinkCard } from "@/components/ui/attachment"`}
      />
      <ComponentPreview
        className="min-h-[140px]"
        code={`<Dropzone onFiles={(files) => console.log(files)} />`}
      >
        <div className="w-full max-w-md">
          <Dropzone onFiles={() => {}} />
        </div>
      </ComponentPreview>

      <DocH2 id="examples">Examples</DocH2>

      <DocH3 id="dropzone">Dropzone</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Dashed drop area with icon, label, and a clickable browse target. Drag a file over it to see
        the primary accent state. Supports custom label/hint and a disabled state.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-md flex-col gap-4">
          <Dropzone onFiles={() => {}} />
          <Dropzone
            onFiles={() => {}}
            label="Drop your resume here"
            hint="PDF or DOCX · up to 10 MB"
          />
          <Dropzone onFiles={() => {}} disabled label="Uploads disabled" hint={null} />
        </div>
      </ComponentPreview>

      <DocH3 id="file-list">File list</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Each row shows a colored type icon, file name, size, optional meta, plus upload progress,
        complete, and error states.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-md flex-col gap-2">
          <FileItem
            name="Employee handbook 2025 — final.pdf"
            size={2.4 * 1024 * 1024}
            meta="Uploaded 2 min ago · by Ploy K."
            onDownload={() => {}}
            onRemove={() => {}}
          />
          <FileItem
            name="Q1-headcount-report.xlsx"
            meta="Uploading… 4.1 MB of 6.8 MB · 2.3 MB/s"
            progress={60}
            onRemove={() => {}}
          />
          <FileItem
            name="org-chart-april.png"
            size={860 * 1024}
            meta="1920×1080 · Uploaded just now"
            onDownload={() => {}}
            onRemove={() => {}}
          />
          <FileItem
            name="project-archive-2023-full-backup.zip"
            error="Upload failed · file exceeds 25 MB limit (38.7 MB)"
            onRemove={() => {}}
          />
        </div>
      </ComponentPreview>

      <DocH3 id="upload-remove">Upload &amp; remove</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        A working demo — pick or drop files to add rows, then remove them.
      </p>
      <UploadDemo />

      <DocH3 id="media-grid">Media grid</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Image and video thumbnails with a caption, size, and optional duration or overflow pill.
      </p>
      <ComponentPreview>
        <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
          <MediaThumb name="hero-launch.jpg" size={1.8 * 1024 * 1024} />
          <MediaThumb name="demo-walkthrough.mp4" size={24 * 1024 * 1024} duration="00:42" />
          <MediaThumb name="dashboard-v3.png" size={620 * 1024} />
          <MediaThumb name="mobile-screens-set" size="12 items" badge="+12" />
        </div>
      </ComponentPreview>

      <DocH3 id="link-cards">Link cards</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        Link preview rows with a favicon or letter avatar, title, and URL or description.
      </p>
      <ComponentPreview>
        <div className="flex w-full max-w-lg flex-col gap-2">
          <LinkCard
            url="https://linkedin.com/company/gofive-thailand"
            title="LinkedIn — Gofive Thailand company page"
            avatarColor="#0A66C2"
          />
          <LinkCard
            url="https://gofive.notion.site/brand-guidelines-2025"
            title="Brand guidelines — Notion workspace"
            avatarColor="#000000"
          />
          <LinkCard
            url="https://docs.google.com/document/d/1x8K/edit"
            title="Q2 OKR planning doc"
            description="docs.google.com/document/d/1x8K…/edit"
            avatarColor="#4285F4"
          />
          <LinkCard url="https://gofive.co.th" />
        </div>
      </ComponentPreview>

      <DocH3 id="rich-link-card">Rich link card</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">
        An Open Graph–style preview with a thumbnail, site label, headline, and description.
      </p>
      <ComponentPreview>
        <RichLinkCard
          url="https://gofive.co.th"
          thumbLabel="G5"
          title="Empeo — the people operations platform built for Thailand"
          description="Time, payroll, leave, and performance in one place. Trusted by 800+ Thai companies from startups to enterprises to run their HR operations end-to-end."
        />
      </ComponentPreview>

      <DocH2 id="api-reference">API Reference</DocH2>

      <DocH3 id="api-dropzone">Dropzone</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Dashed file drop area with click-to-browse.</p>
      <PropsTable rows={[
        { prop: "onFiles", type: "(files: File[]) => void", default: "—", desc: "Called with selected or dropped files" },
        { prop: "accept", type: "string", default: "—", desc: "Native file input accept attribute" },
        { prop: "multiple", type: "boolean", default: "true", desc: "Allow selecting more than one file" },
        { prop: "disabled", type: "boolean", default: "false", desc: "Disables click, keyboard, and drop" },
        { prop: "label", type: "ReactNode", default: '"Click to upload…"', desc: "Primary label text" },
        { prop: "hint", type: "ReactNode | null", default: "accepted types", desc: "Sub-label; pass null to hide" },
      ]} />

      <DocH3 id="api-fileitem">FileItem</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">A single uploaded-file row.</p>
      <PropsTable rows={[
        { prop: "name", type: "string", default: "—", desc: "File name — also infers the type icon" },
        { prop: "size", type: "number | string", default: "—", desc: "Bytes (auto-formatted) or pre-formatted string" },
        { prop: "kind", type: '"pdf" | "doc" | "xls" | "ppt" | "zip" | "img" | "vid" | "file"', default: "from name", desc: "Override the type icon and color" },
        { prop: "meta", type: "ReactNode", default: "—", desc: "Extra info shown after the size" },
        { prop: "progress", type: "number", default: "—", desc: "0–100; renders a progress bar while < 100" },
        { prop: "error", type: "ReactNode", default: "—", desc: "Error message — switches the row to its error state" },
        { prop: "onRemove", type: "() => void", default: "—", desc: "Renders the remove / cancel button" },
        { prop: "onDownload", type: "() => void", default: "—", desc: "Renders a download button on completed rows" },
      ]} />

      <DocH3 id="api-linkcard">LinkCard</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Link preview card rendered as an anchor.</p>
      <PropsTable rows={[
        { prop: "url", type: "string", default: "—", desc: "Destination href; the host is shown by default" },
        { prop: "title", type: "ReactNode", default: "host", desc: "Card title" },
        { prop: "description", type: "ReactNode", default: "host", desc: "Secondary line — URL or description" },
        { prop: "favicon", type: "string", default: "—", desc: "Image URL for the avatar; falls back to a letter" },
        { prop: "avatarColor", type: "string", default: '"#52525F"', desc: "Letter-avatar background color" },
      ]} />

      <DocH3 id="api-mediathumb">MediaThumb</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">An image or video thumbnail tile.</p>
      <PropsTable rows={[
        { prop: "src", type: "string", default: "—", desc: "Image URL; falls back to a gradient placeholder" },
        { prop: "alt", type: "string", default: '""', desc: "Alt text for the image" },
        { prop: "name", type: "ReactNode", default: "—", desc: "Caption shown under the thumbnail" },
        { prop: "size", type: "number | string", default: "—", desc: "Bytes (auto-formatted) or a string like \"12 items\"" },
        { prop: "duration", type: "string", default: "—", desc: "Video length — renders a play pill, e.g. \"00:42\"" },
        { prop: "badge", type: "ReactNode", default: "—", desc: "Overflow/status pill, e.g. \"+12\"; overrides duration" },
      ]} />

      <DocH3 id="api-richlinkcard">RichLinkCard</DocH3>
      <p className="mt-2 text-sm text-muted-foreground">Open Graph–style link preview rendered as an anchor.</p>
      <PropsTable rows={[
        { prop: "url", type: "string", default: "—", desc: "Destination href; the host is shown by default" },
        { prop: "site", type: "ReactNode", default: "host", desc: "Uppercase source/site label" },
        { prop: "title", type: "ReactNode", default: "—", desc: "Headline" },
        { prop: "description", type: "ReactNode", default: "—", desc: "Clamped to two lines" },
        { prop: "image", type: "string", default: "—", desc: "OG image; falls back to a gradient with thumbLabel" },
        { prop: "thumbLabel", type: "ReactNode", default: "—", desc: "Letter/text shown when no image is set" },
      ]} />
    </DocPage>
  )
}

type DemoFile = { id: number; name: string; size: number }

function UploadDemo() {
  const [files, setFiles] = useState<DemoFile[]>([
    { id: 1, name: "onboarding-checklist.docx", size: 318 * 1024 },
    { id: 2, name: "team-photo.jpg", size: 1.6 * 1024 * 1024 },
  ])

  function add(picked: File[]) {
    setFiles((prev) => [
      ...prev,
      ...picked.map((f, i) => ({ id: Date.now() + i, name: f.name, size: f.size })),
    ])
  }

  return (
    <ComponentPreview>
      <div className="flex w-full max-w-md flex-col gap-3">
        <Dropzone onFiles={add} hint="Drop anything — added to the list below" />
        {files.length > 0 ? (
          <div className="flex flex-col gap-2">
            {files.map((f) => (
              <FileItem
                key={f.id}
                name={f.name}
                size={f.size}
                kind={kindFromName(f.name)}
                onRemove={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">No files yet.</p>
        )}
      </div>
    </ComponentPreview>
  )
}

import { DocPage, DocH2, DocH3 } from "@/components/docs/doc-page"
import { CodeBlock } from "@/components/docs/code-block"

const toc = [
  { title: "Overview", href: "#overview" },
  { title: "Install the skill", href: "#install" },
  { title: "Requirements", href: "#requirements", depth: 1 },
  { title: "Register the registry", href: "#register", depth: 1 },
  { title: "How it works", href: "#how-it-works" },
  { title: "Component priority", href: "#priority", depth: 1 },
  { title: "Example prompts", href: "#examples" },
  { title: "Manual install", href: "#manual" },
]

export default function AgentSkillPage() {
  return (
    <DocPage
      breadcrumb={["Skills", "Agent Skill"]}
      title="Agent Skill"
      description="Teach your AI coding agent to install and use GoFive components correctly."
      toc={toc}
    >
      <DocH2 id="overview">Overview</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        <strong>GoFive UI</strong> is an{" "}
        <a
          href="https://skills.sh"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          agent skill
        </a>{" "}
        that teaches AI coding agents (Claude Code, Cursor, and others) how to install and use
        GoFive components correctly — the right{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@gofive/*</code> install commands,
        import paths, exports, props, and theming — instead of guessing. It covers all 45
        components, the theme with runtime <code className="rounded bg-muted px-1.5 py-0.5 text-sm">data-brand</code>{" "}
        product palettes, fonts, and typography.
      </p>

      <DocH2 id="install">Install the skill</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Install with the Skills CLI. Add <code className="rounded bg-muted px-1.5 py-0.5 text-sm">-g</code>{" "}
        to install globally for all projects, and{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">-a claude-code</code> to target a
        specific agent.
      </p>
      <CodeBlock code={`npx skills add innovation-gofive/ui.gofive@gofive-ui`} className="mt-4" />
      <p className="mt-4 leading-7 text-muted-foreground">Or find it on skills.sh:</p>
      <CodeBlock code={`npx skills find gofive`} className="mt-4" />

      <DocH3 id="requirements">Requirements</DocH3>
      <p className="mt-4 leading-7 text-muted-foreground">
        Before using GoFive components, the skill verifies your project is a{" "}
        <strong>React</strong> app, has <strong>shadcn</strong> configured (a{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">components.json</code> at the root —
        run <code className="rounded bg-muted px-1.5 py-0.5 text-sm">npx shadcn@latest init</code> if
        not), and uses <strong>Tailwind CSS v4</strong>. If any requirement is missing, the agent
        stops and tells you what to fix instead of proceeding.
      </p>

      <DocH3 id="register">Register the registry</DocH3>
      <p className="mt-4 leading-7 text-muted-foreground">
        The skill installs components through the shadcn CLI, so register the GoFive namespace once
        (see <a href="/docs/installation" className="font-medium underline underline-offset-4">Installation</a>):
      </p>
      <CodeBlock
        code={`npx shadcn@latest registry add @gofive=https://ui.coolify.tks.co.th/r/{name}.json`}
        className="mt-4"
      />

      <DocH2 id="how-it-works">How it works</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Once installed, your agent knows the full catalog. Ask it to add a component and it runs the
        correct install command and imports from the right path — for example{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@gofive/badge</code> resolves to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@/components/ui/gofive/tag-badge</code>.
      </p>

      <DocH3 id="priority">Component priority</DocH3>
      <p className="mt-4 leading-7 text-muted-foreground">
        In a project that has this skill, the agent picks UI in this order:
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7 text-muted-foreground">
        <li>
          <strong className="text-foreground">GoFive UI first</strong> — use a GoFive component
          whenever one fits.
        </li>
        <li>
          <strong className="text-foreground">Plain shadcn/ui next</strong> — only when GoFive has
          nothing suitable.
        </li>
        <li>
          <strong className="text-foreground">Build custom last</strong> — only when neither
          registry has it, matching the GoFive theme tokens so it fits the design system.
        </li>
      </ol>

      <DocH2 id="examples">Example prompts</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        After installing, just describe what you need:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-muted-foreground">
        <li>&ldquo;Add a GoFive status tag and a date picker to this form.&rdquo;</li>
        <li>&ldquo;Use the GoFive sheet for the details panel.&rdquo;</li>
        <li>&ldquo;Switch the theme to the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">venio</code> brand palette.&rdquo;</li>
      </ul>

      <DocH2 id="manual">Manual install</DocH2>
      <p className="mt-4 leading-7 text-muted-foreground">
        Prefer not to use the CLI? Copy the{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">skills/gofive-ui</code> folder from
        the registry repo into your project&rsquo;s{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.claude/skills/</code> (or{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.agents/skills/</code>) directory.
      </p>
    </DocPage>
  )
}

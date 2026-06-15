import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TableOfContents, type TocItem } from "@/components/docs/toc"

export function DocPage({
  breadcrumb,
  title,
  description,
  toc = [],
  children,
}: {
  breadcrumb?: string[]
  title: string
  description?: string
  toc?: TocItem[]
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 xl:grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-10">
      <div className="mx-auto w-full min-w-0 max-w-3xl py-8 lg:py-10">
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {breadcrumb.map((crumb, i) => (
                <Fragment key={crumb}>
                  <BreadcrumbItem>
                    {i < breadcrumb.length - 1 ? (
                      <span className="text-muted-foreground">{crumb}</span>
                    ) : (
                      <BreadcrumbPage>{crumb}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="space-y-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
          {description && <p className="text-base text-muted-foreground lg:text-lg">{description}</p>}
        </div>

        <div className="pb-12 pt-8">{children}</div>
      </div>

      <div className="hidden text-sm xl:block">
        <TableOfContents items={toc} />
      </div>
    </div>
  )
}

// ── In-page section heading with anchor ──────────────────────────────
export function DocH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="group mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
    >
      <a href={`#${id}`} className="inline-flex items-center gap-2">
        {children}
      </a>
    </h2>
  )
}

export function DocH3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
      {children}
    </h3>
  )
}

export function DocLead({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-4">{children}</p>
}

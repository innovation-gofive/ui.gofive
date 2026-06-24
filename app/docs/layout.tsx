import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/docs/site-header";
import { AppSidebar } from "@/components/docs/app-sidebar";

// TODO(gofive-migrate): Migrated off shadcn's SidebarProvider/SidebarInset to the
// Gofive sidebar, which has no provider/context. The collapsible-icon rail, the
// Cmd+B keyboard shortcut, cookie-persisted collapse state, and the mobile sheet
// are gone — AppSidebar now renders a static panel (desktop only). Re-add a
// collapse mechanism by hand if needed.
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex h-svh w-full overflow-hidden"
      style={{ "--header-height": "3.5rem" } as CSSProperties}
    >
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SiteHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl px-4 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

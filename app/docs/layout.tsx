"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/docs/site-header";
import { AppSidebar } from "@/components/docs/app-sidebar";

// TODO(gofive-migrate): The Gofive sidebar has no provider/context, so collapse
// is re-implemented here with local state (show/hide). Still missing vs shadcn's
// SidebarProvider: the Cmd+B shortcut, cookie-persisted state, and the mobile drawer.
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <AppSidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SiteHeader
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((v) => !v)}
        />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl px-4 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

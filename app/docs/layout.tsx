import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/docs/site-header";
import { AppSidebar } from "@/components/docs/app-sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider style={{ "--header-height": "3.5rem" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 lg:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/docs/site-header";
import { AppSidebar } from "@/components/docs/app-sidebar";

const goFive = localFont({
  src: [
    { path: "../public/fonts/gofive-text.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/gofive-medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/gofive-semi_bold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/gofive-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gofive",
});

export const metadata: Metadata = {
  title: "The Component of Gofive Design System - gofive/ui",
  description: "A custom shadcn registry by GoFive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={goFive.variable}>
      <body className="antialiased">
        <SidebarProvider
          style={{ "--header-height": "3.5rem" } as CSSProperties}
        >
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <SiteHeader />
            <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 lg:px-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

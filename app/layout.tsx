import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  description: "A custom shadcn registry by Gofive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={goFive.variable} suppressHydrationWarning>
      <body className="antialiased">
        {/* Set .dark before paint to avoid a light-mode flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==="dark"||(!("theme"in localStorage)&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

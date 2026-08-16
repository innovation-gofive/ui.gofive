"use client"

import { Moon, Sun } from "lucide-react"

import { NavbarIconButton } from "@/registry/new-york/ui/navbar"

export function ThemeToggle() {
  return (
    <NavbarIconButton
      aria-label="Toggle dark mode"
      onClick={() => {
        const dark = document.documentElement.classList.toggle("dark")
        localStorage.theme = dark ? "dark" : "light"
      }}
    >
      {/* CSS-driven icon swap — no state, no hydration mismatch. */}
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </NavbarIconButton>
  )
}

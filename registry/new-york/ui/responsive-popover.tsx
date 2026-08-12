"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer"

const MOBILE_BREAKPOINT = 768

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

const SheetContext = React.createContext(false)

/** True when the surrounding panel is rendered as a mobile bottom sheet. */
function useIsBottomSheet() {
  return React.useContext(SheetContext)
}

function Root({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <SheetContext.Provider value={isMobile}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
          {children}
        </PopoverPrimitive.Root>
      )}
    </SheetContext.Provider>
  )
}

function Trigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return useIsBottomSheet() ? (
    <DrawerTrigger {...props} />
  ) : (
    <PopoverPrimitive.Trigger {...props} />
  )
}

/** No-op on mobile — DrawerContent portals itself. */
function Portal({ children }: { children: React.ReactNode }) {
  return useIsBottomSheet() ? (
    <>{children}</>
  ) : (
    <PopoverPrimitive.Portal>{children}</PopoverPrimitive.Portal>
  )
}

function Content({
  className,
  align = "start",
  sideOffset = 6,
  title = "Options",
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  /** Screen-reader label for the bottom sheet. */
  title?: string
  "data-slot"?: string
}) {
  // Popover sizing/placement (trigger width, max-h-64, align) is meaningless in
  // a sheet — drop className and the popover-only props instead of merging them.
  if (useIsBottomSheet()) {
    return (
      <DrawerContent
        data-slot={props["data-slot"]}
        aria-describedby={undefined}
        className="bg-popover text-popover-foreground"
      >
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <div className="min-h-0 flex-1 overflow-auto p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </DrawerContent>
    )
  }

  return (
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={className}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  )
}

/** Drop-in for radix-ui's `Popover` namespace: popover on desktop, bottom sheet on mobile. */
const ResponsivePopover = { Root, Trigger, Portal, Content }

export { ResponsivePopover, useIsBottomSheet }

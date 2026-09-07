"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"

// ── ResponsiveDialog ────────────────────────────────────────────────
// A centred dialog on desktop, a bottom drawer on touch-sized screens — one
// composition instead of branching at every call site. The counterpart to
// <ResponsivePopover>, and it uses the same 768px breakpoint so the two agree.
//
//   <ResponsiveDialog>
//     <ResponsiveDialogTrigger asChild><Button>Edit</Button></ResponsiveDialogTrigger>
//     <ResponsiveDialogContent>
//       <ResponsiveDialogHeader>
//         <ResponsiveDialogTitle>Edit ticket</ResponsiveDialogTitle>
//       </ResponsiveDialogHeader>
//       …
//     </ResponsiveDialogContent>
//   </ResponsiveDialog>

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

const DrawerModeContext = React.createContext(false)

/** True when the surrounding dialog is rendered as a mobile drawer. */
function useIsDrawer() {
  return React.useContext(DrawerModeContext)
}

export interface ResponsiveDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function ResponsiveDialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile()
  const Root = isMobile ? Drawer : Dialog

  return (
    <DrawerModeContext.Provider value={isMobile}>
      <Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children}
      </Root>
    </DrawerModeContext.Provider>
  )
}

function ResponsiveDialogTrigger(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const Comp = useIsDrawer() ? DrawerTrigger : DialogTrigger
  return <Comp data-slot="responsive-dialog-trigger" {...props} />
}

function ResponsiveDialogClose(
  props: React.ComponentProps<typeof DialogClose>,
) {
  const Comp = useIsDrawer() ? DrawerClose : DialogClose
  return <Comp data-slot="responsive-dialog-close" {...props} />
}

export interface ResponsiveDialogContentProps
  extends React.ComponentProps<typeof DialogContent> {
  /** Extra classes applied only in the drawer (mobile) layout. */
  drawerClassName?: string
}

function ResponsiveDialogContent({
  className,
  drawerClassName,
  children,
  ...props
}: ResponsiveDialogContentProps) {
  if (useIsDrawer()) {
    return (
      <DrawerContent
        data-slot="responsive-dialog-content"
        className={cn(drawerClassName)}
        // Props reach both branches, so `aria-describedby={undefined}` and the
        // rest of the content API behave the same in either layout.
        {...props}
      >
        {children}
      </DrawerContent>
    )
  }

  return (
    <DialogContent
      data-slot="responsive-dialog-content"
      className={className}
      {...props}
    >
      {children}
    </DialogContent>
  )
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const Comp = useIsDrawer() ? DrawerHeader : DialogHeader
  return (
    <Comp
      data-slot="responsive-dialog-header"
      className={className}
      {...props}
    />
  )
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const Comp = useIsDrawer() ? DrawerFooter : DialogFooter
  return (
    <Comp
      data-slot="responsive-dialog-footer"
      className={className}
      {...props}
    />
  )
}

function ResponsiveDialogTitle(
  props: React.ComponentProps<typeof DialogTitle>,
) {
  const Comp = useIsDrawer() ? DrawerTitle : DialogTitle
  return <Comp data-slot="responsive-dialog-title" {...props} />
}

function ResponsiveDialogDescription(
  props: React.ComponentProps<typeof DialogDescription>,
) {
  const Comp = useIsDrawer() ? DrawerDescription : DialogDescription
  return <Comp data-slot="responsive-dialog-description" {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
  useIsDrawer,
}

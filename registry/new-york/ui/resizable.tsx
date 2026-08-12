"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

// react-resizable-panels v4: Group / Panel / Separator, with the orientation
// exposed on the group element as `data-orientation` for styling.
function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      data-slot="resizable-panel-group"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "flex size-full data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

/**
 * Sizes: a number is pixels (`defaultSize={200}`), a string is a percentage
 * (`defaultSize="25"`). Passing a number where you meant percent collapses the
 * panel to a few pixels.
 */
function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center bg-border transition-colors outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:bg-primary/40 data-[state=dragging]:bg-primary",
        // Hit target: a 1px line with a wider invisible grab area over it.
        "w-px after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",
        "[[data-orientation=vertical]>&]:h-px [[data-orientation=vertical]>&]:w-full",
        "[[data-orientation=vertical]>&]:after:inset-x-0 [[data-orientation=vertical]>&]:after:top-1/2 [[data-orientation=vertical]>&]:after:h-2 [[data-orientation=vertical]>&]:after:w-full [[data-orientation=vertical]>&]:after:-translate-y-1/2 [[data-orientation=vertical]>&]:after:translate-x-0",
        "[[data-orientation=vertical]>&>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
          <GripVertical className="size-2.5" />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

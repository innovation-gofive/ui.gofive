import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Lift the card on hover. Use for clickable cards. */
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Panel chrome comes from the theme (--panel-border / --panel-shadow):
        // frameless + ambient shadow in light, hairline + no shadow in dark.
        // The fallbacks reproduce the plain shadcn card, so installing this
        // component without the Gofive theme still looks right.
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6",
        "border border-[var(--panel-border,var(--border))] shadow-[var(--panel-shadow,0_1px_2px_rgb(0_0_0_/_0.05))]",
        interactive &&
          "cursor-pointer transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

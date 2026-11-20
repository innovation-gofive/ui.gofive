"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Items inside an ItemGroup render an <li> around their row, so a row that is
// itself an <a> (asChild) still sits in valid ul > li markup.
const InGroup = React.createContext(false)

function ItemGroup({
  divided = true,
  className,
  ...props
}: React.ComponentProps<"ul"> & {
  /** Hairline between rows. */
  divided?: boolean
}) {
  return (
    <InGroup.Provider value={true}>
      <ul
        role="list"
        data-slot="item-group"
        className={cn("flex flex-col", divided && "divide-y divide-border", className)}
        {...props}
      />
    </InGroup.Provider>
  )
}

const itemVariants = cva("flex min-w-0 items-center gap-3 text-sm", {
  variants: {
    size: {
      sm: "py-2",
      md: "py-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

function Item({
  className,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & {
    /** Render the row as the child element, e.g. an <a>, with hover and focus styles. */
    asChild?: boolean
  }) {
  const inGroup = React.useContext(InGroup)
  const Comp = asChild ? Slot : "div"
  const row = (
    <Comp
      data-slot="item"
      data-size={size ?? "md"}
      className={cn(
        itemVariants({ size }),
        // First/last group rows drop their outer padding so the list sits flush in a Card.
        inGroup && "[li:first-child>&]:pt-0 [li:last-child>&]:pb-0",
        asChild &&
          "-mx-2 rounded-md px-2 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  )
  if (!inGroup) return row
  // Reset so an Item nested inside this row is not turned into a stray <li>.
  return (
    <li>
      <InGroup.Provider value={false}>{row}</InGroup.Provider>
    </li>
  )
}

const itemMediaVariants = cva("flex shrink-0 items-center justify-center", {
  variants: {
    variant: {
      icon: "size-8 rounded-md bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
      avatar: "",
    },
  },
  defaultVariants: {
    variant: "icon",
  },
})

function ItemMedia({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant ?? "icon"}
      aria-hidden={variant === "avatar" ? undefined : true}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("flex min-w-0 items-center gap-2 font-medium text-foreground", className)}
      {...props}
    >
      {/* Bare text truncates; elements beside it (badges) keep their size. */}
      {React.Children.map(children, (child) =>
        typeof child === "string" || typeof child === "number" ? (
          <span className="min-w-0 truncate">{child}</span>
        ) : (
          child
        ),
      )}
    </div>
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("line-clamp-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-meta"
      className={cn("truncate text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMeta,
  ItemActions,
  itemVariants,
}

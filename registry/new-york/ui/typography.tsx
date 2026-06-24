import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Gofive type scale ──────────────────────────────────────────────
// Display / H1–H3 / Body Lg / Body / Small / Caption — default body 14.
const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "text-[40px] font-bold leading-[1.02] tracking-[-0.015em]",
      h1: "text-[32px] font-bold leading-[1.08] tracking-[-0.01em]",
      h2: "text-[24px] font-semibold leading-[1.15]",
      h3: "text-[20px] font-semibold leading-[1.25]",
      "body-lg": "text-base font-normal leading-[1.55]",
      body: "text-sm font-normal leading-[1.5]",
      small: "text-xs font-normal leading-[1.45] text-muted-foreground",
      caption:
        "text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.06em] text-muted-foreground",
    },
    // Override the variant's default weight: 400 / 500 / 600 / 700.
    weight: {
      text: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>

// Default HTML element rendered per variant — override with `as` / `asChild`.
const VARIANT_ELEMENT: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-lg": "p",
  body: "p",
  small: "p",
  caption: "span",
}

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /** Render the child element instead of the default tag (Radix Slot). */
  asChild?: boolean
  /** Render a custom element while keeping the variant styles. */
  as?: React.ElementType
}

function Typography({
  className,
  variant = "body",
  weight,
  asChild = false,
  as,
  ...props
}: TypographyProps) {
  const Comp = asChild ? Slot : as ?? VARIANT_ELEMENT[variant ?? "body"]

  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant, weight }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }

"use client"

import Link from "next/link"
import { ArrowRight, Check, Clock, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tag, TagIcon, BadgeCount } from "@/registry/new-york/ui/tag-badge"
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/new-york/ui/avatar"
import { Switch } from "@/registry/new-york/ui/switch"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
import { Rating } from "@/registry/new-york/ui/rating"
import { Progress, ProgressRing } from "@/registry/new-york/ui/progress"
import { Spinner, LoadingDots } from "@/registry/new-york/ui/spinner"
import { Segmented, SegmentedItem } from "@/registry/new-york/ui/segmented"
import { Slider } from "@/registry/new-york/ui/slider"
import { Stepper } from "@/registry/new-york/ui/stepper"
import { Alert } from "@/registry/new-york/ui/alert"

function ShowcaseCard({
  title,
  href,
  className,
  children,
}: {
  title: string
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group flex min-h-[170px] flex-col rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-center py-4">{children}</div>
      <Link
        href={href}
        className="mt-2 flex items-center justify-between text-sm font-medium"
      >
        <span>{title}</span>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export function ComponentShowcase() {
  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ShowcaseCard title="Tag & Badge" href="/docs/badge" className="sm:col-span-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Tag color="success" variant="soft"><TagIcon><Check /></TagIcon>Active</Tag>
          <Tag color="warn" variant="soft"><TagIcon><Clock /></TagIcon>Pending</Tag>
          <Tag color="danger" variant="soft"><TagIcon><X /></TagIcon>Rejected</Tag>
          <Tag color="info" variant="solid">New</Tag>
          <Tag color="neutral" variant="outline">Draft</Tag>
          <BadgeCount>5</BadgeCount>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Avatar" href="/docs/avatar">
        <AvatarGroup max={4}>
          <Avatar status="online"><AvatarFallback color="#0A66E0">GF</AvatarFallback></Avatar>
          <Avatar><AvatarFallback gradient="linear-gradient(135deg,#7B88E8,#E677B7)">AR</AvatarFallback></Avatar>
          <Avatar status="busy"><AvatarFallback color="#1DA577">KP</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#F88411">MN</AvatarFallback></Avatar>
          <Avatar><AvatarFallback color="#3B3B44">JS</AvatarFallback></Avatar>
        </AvatarGroup>
      </ShowcaseCard>

      <ShowcaseCard title="Switch" href="/docs/switch">
        <div className="flex flex-col items-center gap-4">
          <Switch defaultChecked />
          <Switch withStateLabel defaultChecked />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Checkbox" href="/docs/checkbox">
        <div className="flex flex-col gap-3 text-sm">
          <label className="inline-flex items-center gap-2"><Checkbox defaultChecked /> Email me updates</label>
          <label className="inline-flex items-center gap-2"><Checkbox checked="indeterminate" /> Select all</label>
          <label className="inline-flex items-center gap-2 text-muted-foreground"><Checkbox /> Subscribe to news</label>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Rating" href="/docs/rating">
        <Rating defaultValue={4} />
      </ShowcaseCard>

      <ShowcaseCard title="Spinner" href="/docs/spinner">
        <div className="flex items-center gap-6">
          <Spinner size="lg" />
          <LoadingDots size="lg" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Progress" href="/docs/progress">
        <div className="flex w-full max-w-[220px] flex-col items-center gap-4">
          <ProgressRing value={72} />
          <Progress value={60} color="success" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Slider" href="/docs/slider">
        <div className="w-full max-w-[220px]">
          <Slider defaultValue={[40]} showValue />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Segmented Control" href="/docs/segmented">
        <Segmented defaultValue="month">
          <SegmentedItem value="day">Day</SegmentedItem>
          <SegmentedItem value="week">Week</SegmentedItem>
          <SegmentedItem value="month">Month</SegmentedItem>
          <SegmentedItem value="year">Year</SegmentedItem>
        </Segmented>
      </ShowcaseCard>

      <ShowcaseCard title="Stepper" href="/docs/stepper" className="sm:col-span-2">
        <div className="w-full max-w-[420px]">
          <Stepper
            current={1}
            steps={[{ title: "Cart" }, { title: "Shipping" }, { title: "Payment" }]}
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Alert" href="/docs/alert" className="sm:col-span-2 lg:col-span-3">
        <div className="flex w-full max-w-2xl flex-col gap-2.5">
          <Alert status="success">Your changes have been saved successfully.</Alert>
          <Alert status="warn">Your trial ends in 3 days — upgrade to keep your data.</Alert>
        </div>
      </ShowcaseCard>
    </div>
  )
}

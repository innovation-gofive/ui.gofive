"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "radix-ui"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ── Gofive semantic status palette ─────────────────────────────────
export type ToastStatus = "success" | "warning" | "danger" | "info" | "neutral"

type StatusTokens = {
  level: string // primary tint for border / icon bg / progress
  soft: string // soft card background
  text: string // emphasized text color
  iconColor: string // icon glyph color on the level circle
  icon: LucideIcon
}

const STATUS: Record<ToastStatus, StatusTokens> = {
  success: { level: "#1DA577", soft: "#DBF3E8", text: "#0D6A4B", iconColor: "#ffffff", icon: CheckCircle2 },
  warning: { level: "#F9D423", soft: "#FFF4BF", text: "#7A5800", iconColor: "#212121", icon: AlertTriangle },
  danger:  { level: "#D93A1A", soft: "#FDE0D6", text: "#8A1F0A", iconColor: "#ffffff", icon: XCircle },
  info:    { level: "#0A66E0", soft: "#DDEAFC", text: "#063F89", iconColor: "#ffffff", icon: Info },
  neutral: { level: "#3B3B44", soft: "#ECECF0", text: "#52525F", iconColor: "#ffffff", icon: Info },
}

// ── Animations (React 19 style hoisting deduplicates via href) ──────
const TOAST_CSS = `
  @keyframes gf-toast-in{from{opacity:0;transform:translateX(calc(100% + 1rem));}to{opacity:1;transform:translateX(0);}}
  @keyframes gf-toast-out{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(calc(100% + 1rem));}}
  @keyframes gf-toast-swipe-out{from{transform:translateX(var(--radix-toast-swipe-end-x));}to{transform:translateX(calc(100% + 1rem));}}
  @keyframes gf-toast-pop{0%{transform:scale(.4);opacity:0;}100%{transform:scale(1);opacity:1;}}
  @keyframes gf-toast-drain{from{transform:scaleX(1);}to{transform:scaleX(0);}}
  [data-slot=toast][data-state=open]{animation:gf-toast-in .32s cubic-bezier(.2,.9,.25,1);}
  [data-slot=toast][data-state=closed]{animation:gf-toast-out .2s ease-in forwards;}
  [data-slot=toast][data-swipe=move]{transform:translateX(var(--radix-toast-swipe-move-x));}
  [data-slot=toast][data-swipe=cancel]{transform:translateX(0);transition:transform .2s ease-out;}
  [data-slot=toast][data-swipe=end]{animation:gf-toast-swipe-out .2s ease-out forwards;}
  [data-slot=toast] .gf-toast-icon{animation:gf-toast-pop .35s cubic-bezier(.2,.9,.35,1.4) both .05s;}
  [data-slot=toast] .gf-toast-progress{transform-origin:left;animation:gf-toast-drain linear forwards;}
`

// ── Provider ───────────────────────────────────────────────────────
function ToastProvider({
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

// ── Viewport ───────────────────────────────────────────────────────
function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2.5 p-4 sm:max-w-[388px]",
        className
      )}
      {...props}
    />
  )
}

// ── Toast ──────────────────────────────────────────────────────────
export interface ToastProps
  extends React.ComponentProps<typeof ToastPrimitive.Root> {
  status?: ToastStatus
  duration?: number
}

function Toast({
  className,
  status = "info",
  duration = 5000,
  style,
  ...props
}: ToastProps) {
  const tokens = STATUS[status]
  return (
    <>
      <style href="gf-toast" precedence="low">{TOAST_CSS}</style>
      <ToastPrimitive.Root
        data-slot="toast"
        data-status={status}
        duration={duration}
        className={cn(
          "group relative flex items-start gap-2.5 overflow-hidden rounded-[10px] border border-l-[3px] p-3 pr-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)]",
          className
        )}
        style={{
          backgroundColor: tokens.soft,
          borderColor: tokens.level,
          ...style,
        }}
        {...props}
      />
    </>
  )
}

// ── ToastIcon ──────────────────────────────────────────────────────
function ToastIcon({ status = "info" }: { status?: ToastStatus }) {
  const tokens = STATUS[status]
  const Icon = tokens.icon
  return (
    <span
      data-slot="toast-icon"
      className="gf-toast-icon mt-px flex size-6 shrink-0 items-center justify-center rounded-full [&_svg]:size-[14px]"
      style={{ backgroundColor: tokens.level, color: tokens.iconColor }}
      aria-hidden="true"
    >
      <Icon strokeWidth={2.5} />
    </span>
  )
}

// ── ToastTitle ─────────────────────────────────────────────────────
function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-[13px] font-bold leading-tight tracking-[-0.005em] text-[#1A1A1F]",
        className
      )}
      {...props}
    />
  )
}

// ── ToastDescription ───────────────────────────────────────────────
function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("mt-0.5 text-xs leading-relaxed text-[#52525F]", className)}
      {...props}
    />
  )
}

// ── ToastAction ────────────────────────────────────────────────────
function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "mt-2 inline-flex h-7 items-center justify-center rounded-md border border-current/20 bg-transparent px-2.5 text-xs font-semibold text-current transition-colors hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40",
        className
      )}
      {...props}
    />
  )
}

// ── ToastClose ─────────────────────────────────────────────────────
function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md text-[#8A8A96] transition-colors hover:bg-black/5 hover:text-[#1A1A1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 [&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      <X strokeWidth={2.5} />
    </ToastPrimitive.Close>
  )
}

// ── ToastProgress (drain bar) ──────────────────────────────────────
function ToastProgress({
  status = "info",
  duration = 5000,
}: {
  status?: ToastStatus
  duration?: number
}) {
  const tokens = STATUS[status]
  return (
    <span
      data-slot="toast-progress"
      className="gf-toast-progress absolute inset-x-0 bottom-0 h-0.5"
      style={{
        backgroundColor: tokens.level,
        opacity: 0.45,
        animationDuration: `${duration}ms`,
      }}
      aria-hidden="true"
    />
  )
}

// ────────────────────────────────────────────────────────────────────
//  Store + useToast hook
// ────────────────────────────────────────────────────────────────────
export interface ToastActionConfig {
  label: string
  onClick?: () => void
  altText?: string
}

export interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  status?: ToastStatus
  duration?: number
  action?: ToastActionConfig
}

interface ToastRecord extends ToastOptions {
  id: string
  open: boolean
}

type Listener = () => void

const EMPTY: ToastRecord[] = []
let memoryState: ToastRecord[] = EMPTY
const listeners = new Set<Listener>()
let count = 0

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return `toast-${count}`
}

function emit() {
  for (const listener of listeners) listener()
}

/** Imperatively show a toast. Returns controls to update or dismiss it. */
export function toast(options: ToastOptions) {
  const id = genId()
  const record: ToastRecord = { id, open: true, status: "info", ...options }
  memoryState = [record, ...memoryState]
  emit()

  const dismiss = () => {
    memoryState = memoryState.map((t) =>
      t.id === id ? { ...t, open: false } : t
    )
    emit()
  }

  const update = (next: ToastOptions) => {
    memoryState = memoryState.map((t) =>
      t.id === id ? { ...t, ...next } : t
    )
    emit()
  }

  return { id, dismiss, update }
}

function removeToast(id: string) {
  memoryState = memoryState.filter((t) => t.id !== id)
  emit()
}

/** Subscribe to the toast store and access the imperative helpers. */
export function useToast() {
  const toasts = React.useSyncExternalStore(
    subscribe,
    () => memoryState,
    () => EMPTY,
  )

  return { toasts, toast, dismiss: removeToast }
}

// ────────────────────────────────────────────────────────────────────
//  Toaster — mount once near the app root
// ────────────────────────────────────────────────────────────────────
function Toaster({
  swipeDirection = "right",
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection={swipeDirection} {...props}>
      {toasts.map(({ id, title, description, status = "info", action, duration = 5000 }) => (
        <Toast
          key={id}
          status={status}
          duration={duration}
          onOpenChange={(open) => {
            if (!open) removeToast(id)
          }}
        >
          <ToastIcon status={status} />
          <div className="min-w-0 flex-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {action && (
              <ToastAction
                altText={action.altText ?? action.label}
                onClick={action.onClick}
                style={{ color: STATUS[status].text }}
              >
                {action.label}
              </ToastAction>
            )}
          </div>
          <ToastClose />
          <ToastProgress status={status} duration={duration} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export {
  Toaster,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastIcon,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastProgress,
}

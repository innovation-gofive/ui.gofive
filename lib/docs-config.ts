import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Download,
  ScrollText,
  Tag,
  Type,
  AArrowUp,
  CircleUser,
  CheckSquare,
  Circle,
  ToggleLeft,
  LoaderCircle,
  Loader,
  Star,
  MessageSquare,
  Bell,
  SquareStack,
  SlidersHorizontal,
  Search,
  Paperclip,
  Calendar,
  CalendarClock,
  CalendarDays,
  Palette,
  Menu,
  MousePointerClick,
  SwatchBook,
  PanelRight,
  PanelBottom,
  ListChecks,
  Square,
  Inbox,
  AlertCircle,
  ShieldCheck,
  Gauge,
  TextCursorInput,
  PencilLine,
  KeyRound,
  GripHorizontal,
  Columns3,
  ListFilter,
  Tags,
  FolderTree,
  UsersRound,
  AppWindow,
  PanelsTopLeft,
  PanelLeft,
  Smartphone,
  ImagePlus,
  Sparkles,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  label?: string
  icon?: LucideIcon
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const docsNav: NavGroup[] = [
  {
    title: "Get Started",
    items: [
      { title: "Introduction", href: "/docs/introduction", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: Download },
      { title: "Contracts", href: "/docs/contracts", icon: ScrollText },
    ],
  },
  {
    title: "AI Agents",
    items: [
      { title: "Agent Skill", href: "/docs/agent-skill", icon: Sparkles },
    ],
  },
  {
    title: "Theming",
    items: [
      { title: "Colors", href: "/docs/colors", icon: SwatchBook },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Tag & Badge", href: "/docs/badge", icon: Tag },
      { title: "Avatar", href: "/docs/avatar", icon: CircleUser },
      { title: "Checkbox", href: "/docs/checkbox", icon: CheckSquare },
      { title: "Radio Group", href: "/docs/radio-group", icon: Circle },
      { title: "Switch", href: "/docs/switch", icon: ToggleLeft },
      { title: "Progress", href: "/docs/progress", icon: LoaderCircle },
      { title: "Spinner", href: "/docs/spinner", icon: Loader },
      { title: "Skeleton", href: "/docs/skeleton", icon: Square },
      { title: "Stepper", href: "/docs/stepper", icon: ListChecks },
      { title: "Rating", href: "/docs/rating", icon: Star },
      { title: "Scale", href: "/docs/scale", icon: Gauge },
      { title: "Tooltip", href: "/docs/tooltip", icon: MessageSquare },
      { title: "Toast", href: "/docs/toast", icon: Bell },
      { title: "Alert", href: "/docs/alert", icon: AlertCircle },
      { title: "Validation", href: "/docs/validation", icon: ShieldCheck },
      { title: "Empty State", href: "/docs/empty-state", icon: Inbox },
      { title: "Dialog", href: "/docs/dialog", icon: SquareStack },
      { title: "Sheet", href: "/docs/sheet", icon: PanelRight },
      { title: "Drawer", href: "/docs/drawer", icon: PanelBottom },
      { title: "Filter", href: "/docs/filter", icon: SlidersHorizontal },
      { title: "Search", href: "/docs/search", icon: Search },
      { title: "Attachment & Link", href: "/docs/attachment", icon: Paperclip },
      { title: "Calendar", href: "/docs/calendar", icon: Calendar },
      { title: "DateTime Picker", href: "/docs/datetime-picker", icon: CalendarClock },
      { title: "Scheduler", href: "/docs/scheduler", icon: CalendarDays },
      { title: "Picker", href: "/docs/picker", icon: Palette },
      { title: "Media Picker", href: "/docs/media-picker", icon: ImagePlus },
      { title: "Menubar", href: "/docs/menubar", icon: Menu },
      { title: "Context Menu", href: "/docs/context-menu", icon: MousePointerClick },
    ],
  },
  {
    title: "Navigation",
    items: [
      { title: "Tabs", href: "/docs/tabs", icon: AppWindow },
      { title: "Navbar", href: "/docs/navbar", icon: PanelsTopLeft },
      { title: "Sidebar", href: "/docs/sidebar", icon: PanelLeft },
      { title: "Bottom Navigation", href: "/docs/bottom-nav", icon: Smartphone },
    ],
  },
  {
    title: "Inputs",
    items: [
      { title: "Input", href: "/docs/input", icon: TextCursorInput },
      { title: "Textarea", href: "/docs/textarea", icon: PencilLine },
      { title: "OTP Input", href: "/docs/otp-input", icon: KeyRound },
      { title: "Slider", href: "/docs/slider", icon: GripHorizontal },
      { title: "Segmented Control", href: "/docs/segmented", icon: Columns3 },
      { title: "Select", href: "/docs/select", icon: ListFilter },
      { title: "Tag Input", href: "/docs/tag-input", icon: Tags },
      { title: "Tree Select", href: "/docs/tree-select", icon: FolderTree },
      { title: "Person Picker", href: "/docs/person-picker", icon: UsersRound },
    ],
  },
  {
    title: "Typography",
    items: [
      { title: "Typography", href: "/docs/typography", icon: AArrowUp },
      { title: "Font", href: "/docs/fonts", icon: Type },
    ],
  },
]

// Primary header navigation — shared by the home `SiteNav` and the docs
// `SiteHeader` so both top bars always render the exact same items.
export const mainNav: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
  { title: "Docs", href: "/docs/introduction" },
  { title: "AI Agent", href: "/docs/agent-skill" },
  { title: "Components", href: "/docs/badge" },
    { title: "Theming", href: "/docs/colors" },
  { title: "Blocks", href: "/blocks" },
]

// Active-state matcher for `mainNav` items — exact match for the root, and
// prefix match for sub-routes (e.g. `/docs/badge` stays active on its children).
export function isMainNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export const siteConfig = {
  name: "Gofive Components",
  description: "A custom shadcn registry by Gofive.",
  // Override per deployment with NEXT_PUBLIC_REGISTRY_URL (e.g. your Coolify URL).
  registryUrl:
    process.env.NEXT_PUBLIC_REGISTRY_URL ?? "https://ui.go5.online",
}

import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Download,
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
      { title: "Introduction", href: "/", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: Download },
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
      { title: "Rating", href: "/docs/rating", icon: Star },
      { title: "Tooltip", href: "/docs/tooltip", icon: MessageSquare },
      { title: "Toast", href: "/docs/toast", icon: Bell },
      { title: "Dialog", href: "/docs/dialog", icon: SquareStack },
      { title: "Filter", href: "/docs/filter", icon: SlidersHorizontal },
      { title: "Search", href: "/docs/search", icon: Search },
      { title: "Attachment & Link", href: "/docs/attachment", icon: Paperclip },
      { title: "Calendar", href: "/docs/calendar", icon: Calendar },
      { title: "DateTime Picker", href: "/docs/datetime-picker", icon: CalendarClock },
      { title: "Scheduler", href: "/docs/scheduler", icon: CalendarDays },
      { title: "Picker", href: "/docs/picker", icon: Palette },
      { title: "Menubar", href: "/docs/menubar", icon: Menu },
      { title: "Context Menu", href: "/docs/context-menu", icon: MousePointerClick },
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

export const siteConfig = {
  name: "GoFive Registry",
  description: "A custom shadcn registry by GoFive.",
  registryUrl: "https://registry.gofive.co.th",
  github: "https://gofive.co.th",
}

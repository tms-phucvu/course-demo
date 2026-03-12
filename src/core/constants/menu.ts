import type { LucideIcon } from "lucide-react";
import { FileStack, Package, Users } from "lucide-react";

/** Code key for the item (React key, state id). */
export interface SubMenuItem {
  name: string;
  /** i18n key for the label shown on screen (e.g. t(title)) */
  title: string;
  url: string;
}

export interface DashboardItemBase {
  /** Code key for the item (React key, state id). */
  name: string;
  /** i18n key for the menu item label displayed on screen */
  title: string;
  icon: LucideIcon;
  /** When true, item is shown but not clickable (e.g. coming soon). */
  disabled?: boolean;
}

export interface DashboardItemLink extends DashboardItemBase {
  url: string;
  children?: never;
}

export interface DashboardItemWithChildren extends DashboardItemBase {
  url?: string;
  children: SubMenuItem[];
}

export type DashboardItem = DashboardItemLink | DashboardItemWithChildren;

export function hasSubmenu(
  item: DashboardItem
): item is DashboardItemWithChildren {
  return (
    "children" in item &&
    Array.isArray(item.children) &&
    item.children.length > 0
  );
}

export const managementItems: DashboardItem[] = [
  {
    name: "dashboard",
    title: "dashboard",
    icon: FileStack,
    disabled: true,
    url: "/dashboard",
  },
  {
    name: "userManagement",
    title: "userManagement",
    icon: Users,
    disabled: true,
    children: [
      {
        name: "userManagerDashboard",
        title: "dashboard",
        url: "/users/dashboard",
      },
      { name: "userManagerList", title: "list", url: "/users" },
    ],
  },
  {
    name: "courseManagement",
    title: "courseManagement",
    icon: Package,
    url: "/admin",
  },
];

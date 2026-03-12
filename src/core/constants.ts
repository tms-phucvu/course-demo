/**
 * Re-export from constants folder for build compatibility.
 * All actual exports live in ./constants/index.ts
 */
export { getBreadcrumb } from "./constants/breadcrumb";
export type { BreadcrumbRoute } from "./constants/breadcrumb";
export { DEFAULT_AVATAR_PATH } from "./constants/common";
export { hasSubmenu, managementItems } from "./constants/menu";
export type {
  DashboardItem,
  DashboardItemBase,
  DashboardItemLink,
  DashboardItemWithChildren,
  SubMenuItem,
} from "./constants/menu";

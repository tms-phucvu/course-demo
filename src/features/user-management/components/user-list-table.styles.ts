import { cn } from "@/core/lib/utils";
import type { ManagementUser } from "../types";

/** Sticky column: same hover as row when row is hovered */
const STICKY_HOVER = "group-hover:bg-muted/50";
/** Sticky column widths so second sticky can align */
const STICKY_LEFT_FIRST = cn(
  "sticky left-0 z-20 bg-background shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]",
  STICKY_HOVER
);
const STICKY_LEFT_SECOND = cn(
  "sticky left-[3.25rem] z-10 bg-background shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]",
  STICKY_HOVER
);
const STICKY_RIGHT = cn(
  "sticky right-0 z-10 bg-background shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]",
  STICKY_HOVER
);

export const UserListTableStyles = {
  root: "UserListTable flex flex-col gap-4 w-full",
  toolbar: "flex flex-wrap items-center justify-between gap-2",
  searchWrap: "relative flex-1 min-w-[200px] max-w-sm",
  searchIcon:
    "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
  searchInput: "pl-9",
  tableWrap: "rounded-md border overflow-x-auto",
  stickyLeftFirst: cn("w-[3.25rem] min-w-[3.25rem]", STICKY_LEFT_FIRST),
  stickyLeftSecond: cn("min-w-[220px]", STICKY_LEFT_SECOND),
  stickyRight: cn("w-24 min-w-24 text-right", STICKY_RIGHT),
  statusBadge: (status: ManagementUser["status"]) =>
    cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      status === "active" &&
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      status === "requestPlan" &&
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      status === "inactive" &&
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    ),
};

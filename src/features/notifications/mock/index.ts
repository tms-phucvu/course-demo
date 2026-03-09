import { toast } from "sonner";
import type { Notification } from "../types";

import notificationsJson from "./notifications.json";

/** Raw shape from notifications.json (no functions, optional createdAt). */
interface NotificationRow {
  id: string;
  status: "new" | "read";
  statusCategory: "task" | "message" | "review_pr";
  type: string;
  typeLabel: string;
  message: string;
  timeAgo: string;
  from?: { name: string; avatarUrl?: string };
  action?: { label: string };
  createdAt?: string | null;
}

/**
 * Loads mock notifications from JSON and wires action callbacks.
 * Use in components as initial state.
 */
export function getMockNotifications(): Notification[] {
  const rows = notificationsJson as NotificationRow[];
  return rows.map((row): Notification => {
    const n: Notification = {
      id: row.id,
      status: row.status,
      statusCategory: row.statusCategory,
      type: row.type as Notification["type"],
      typeLabel: row.typeLabel,
      message: row.message,
      timeAgo: row.timeAgo,
      from: row.from,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
    if (row.action?.label === "Accept") {
      n.action = {
        label: row.action.label,
        onAction: (notificationId) => {
          toast.success(`Accepted notification ${notificationId}`);
        },
      };
    } else if (row.action) {
      n.action = { label: row.action.label };
    }
    return n;
  });
}

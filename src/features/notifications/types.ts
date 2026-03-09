/** Display status of a notification (e.g. New, Read). */
export type NotificationStatus = "new" | "read";

/** Category for filter dropdown: Task, Message, Review PR. */
export type NotificationStatusCategory = "task" | "message" | "review_pr";

/** Kind of notification for display and filtering. */
export type NotificationType =
  | "ticket_assigned"
  | "permission_request"
  | "mention"
  | "system";

export interface NotificationAction {
  label: string;
  /** Optional callback when user clicks the action (e.g. Accept). */
  onAction?: (notificationId: string) => void;
}

export interface Notification {
  id: string;
  status: NotificationStatus;
  /** Filter category: task, message, review PR. */
  statusCategory: NotificationStatusCategory;
  type: NotificationType;
  /** Short label for type (e.g. "New Ticket Assigned"). */
  typeLabel: string;
  /** Main message body. */
  message: string;
  /** Relative time string (e.g. "5 minutes ago"). */
  timeAgo: string;
  /** Optional: user who triggered the notification. */
  from?: {
    name: string;
    avatarUrl?: string;
  };
  /** Optional: primary action (e.g. Accept). */
  action?: NotificationAction;
  /** Optional: created at for sorting. */
  createdAt?: Date;
}

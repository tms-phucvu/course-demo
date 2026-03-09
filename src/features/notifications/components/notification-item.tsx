"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/core/lib/utils";
import { ClipboardList, MessageCircle, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Notification } from "../types";

interface NotificationItemProps {
  notification: Notification;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onSelect?: (notification: Notification) => void;
  onMarkRead?: (id: string) => void;
  className?: string;
}

function getTypeIcon(type: Notification["type"]) {
  switch (type) {
    case "ticket_assigned":
      return ClipboardList;
    case "permission_request":
      return ShieldAlert;
    case "mention":
    case "system":
    default:
      return MessageCircle;
  }
}

export function NotificationItem({
  notification,
  checked = false,
  onCheckedChange,
  onSelect,
  className,
}: NotificationItemProps) {
  const t = useTranslations("notifications");
  const isUnread = notification.status === "new";
  const from = notification.from;
  const Icon = getTypeIcon(notification.type);

  const rightTypeLabel = t(
    `statusCategory_${notification.statusCategory}` as
      | "statusCategory_task"
      | "statusCategory_message"
      | "statusCategory_review_pr"
  );

  return (
    <div
      className={cn(
        "notification-item border-border/60 border-b px-4 py-3 transition-colors last:border-b-0",
        "hover:bg-muted/40",
        isUnread ? "bg-green-50" : "bg-card",
        onSelect && "cursor-pointer",
        className
      )}
      role='article'
      aria-label={notification.message}
      aria-current={isUnread ? "true" : undefined}
      onClick={() => onSelect?.(notification)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(notification);
        }
      }}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className='flex items-start gap-3'>
        <div
          className={cn(
            "mt-1 flex h-9 w-9 items-center justify-center rounded-full",
            isUnread
              ? "bg-emerald-500 text-emerald-50"
              : "bg-muted text-muted-foreground"
          )}
          aria-hidden
        >
          <Icon className='h-4 w-4' />
        </div>

        <div className='min-w-0 flex-1 space-y-1'>
          <p
            className={cn(
              "text-sm",
              isUnread ? "text-foreground font-semibold" : "font-medium"
            )}
          >
            {notification.typeLabel}
          </p>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
            {notification.message}
          </p>
          {from && (
            <div className='flex items-center gap-2 pt-1'>
              {from.avatarUrl && (
                <Avatar className='border-primary h-8 w-8 rounded-full border'>
                  <AvatarImage src={from.avatarUrl} alt='' />
                  <AvatarFallback className='text-xs'>
                    {from.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              )}
              <p className='text-muted-foreground text-xs'>{from.name}</p>
            </div>
          )}
        </div>

        <div className='text-muted-foreground ml-4 flex flex-col items-end gap-1 text-xs'>
          <span>{rightTypeLabel}</span>
          <span>{notification.timeAgo}</span>
        </div>

        <div className='flex shrink-0 items-center self-center'>
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => onCheckedChange?.(value === true)}
            aria-label={t("selectItem")}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/core/lib/utils";
import { Link } from "@/i18n/routing";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getMockNotifications } from "../mock";
import type { Notification } from "../types";
import { NotificationDetailModal } from "./notification-detail-modal";

const MAX_ITEMS = 5;

export function NotificationButton() {
  const t = useTranslations("notifications");
  const [notifications] = useState(() => getMockNotifications());
  const [detailNotification, setDetailNotification] =
    useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.status === "new").length;
  const displayItems = notifications.slice(0, MAX_ITEMS);

  const openDetail = (n: Notification) => {
    setDetailNotification(n);
    setDetailOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='notification-button relative h-9 w-9'
            aria-label={t("openNotifications")}
          >
            <Bell className='size-4' />
            {unreadCount > 0 && (
              <span
                className='bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium'
                aria-hidden
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-80 p-0'>
          {/* Header: unread count + View all */}
          <div className='border-border/60 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2'>
            <p className='text-muted-foreground text-sm'>
              {unreadCount > 0
                ? t("unreadCount", { count: unreadCount })
                : t("noUnread")}
            </p>
            <Button variant='ghost' size='sm' className='h-8 shrink-0' asChild>
              <Link href='/notifications'>{t("viewAll")}</Link>
            </Button>
          </div>

          {/* Body: list from mock JSON or empty state */}
          {displayItems.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-6 text-center'>
              <Bell className='text-muted-foreground mb-2 size-10' />
              <p className='text-foreground text-sm font-medium'>
                {t("noNotifications")}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {t("allCaughtUp")}
              </p>
            </div>
          ) : (
            <ul className='max-h-[280px] overflow-y-auto' role='list'>
              {displayItems.map((n) => (
                <li key={n.id}>
                  <button
                    type='button'
                    onClick={() => openDetail(n)}
                    className={cn(
                      "border-border/60 hover:bg-muted/60 flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left transition-colors",
                      n.status === "new" && "bg-muted/30"
                    )}
                  >
                    <div className='flex items-start gap-2'>
                      <span
                        className={cn(
                          "bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                          n.status === "new" ? "bg-primary" : "bg-muted"
                        )}
                        aria-hidden
                      />

                      <div className='min-w-0 flex-1'>
                        <p
                          className={cn(
                            "line-clamp-2 text-sm leading-snug",
                            n.status === "new"
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {n.message}
                        </p>
                        <p className='text-muted-foreground mt-0.5 text-xs'>
                          {n.timeAgo}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationDetailModal
        notification={detailNotification}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}

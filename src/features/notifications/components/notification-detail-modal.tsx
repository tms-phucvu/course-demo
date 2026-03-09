"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { Notification } from "../types";

interface NotificationDetailModalProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDetailModal({
  notification,
  open,
  onOpenChange,
}: NotificationDetailModalProps) {
  const t = useTranslations("notifications");

  if (!notification) return null;

  const from = notification.from;
  const rightTypeLabel = t(
    `statusCategory_${notification.statusCategory}` as
      | "statusCategory_task"
      | "statusCategory_message"
      | "statusCategory_review_pr"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='NotificationDetailModal flex max-h-[85vh] flex-col overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='text-base'>
            {notification.typeLabel}
          </DialogTitle>
          <p className='text-muted-foreground text-xs'>
            {rightTypeLabel} · {notification.timeAgo}
          </p>
        </DialogHeader>
        <div className='min-h-0 flex-1 overflow-y-auto'>
          <p className='text-foreground text-sm leading-relaxed whitespace-pre-wrap'>
            {notification.message}
          </p>
          {from && (
            <div className='border-border/60 bg-muted/30 mt-4 flex items-center gap-3 rounded-lg border px-3 py-2'>
              {from.avatarUrl && (
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={from.avatarUrl} alt='' />
                  <AvatarFallback className='text-sm'>
                    {from.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className='text-muted-foreground text-xs'>
                  {t("fromSender")}
                </p>
                <p className='text-foreground text-sm font-medium'>
                  {from.name}
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className='shrink-0 border-t pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}
          >
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

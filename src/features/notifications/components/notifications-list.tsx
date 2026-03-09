"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { ChevronDown, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getMockNotifications } from "../mock";
import type { Notification, NotificationStatusCategory } from "../types";
import { NotificationDetailModal } from "./notification-detail-modal";
import { NotificationItem } from "./notification-item";

export function NotificationsList() {
  const t = useTranslations("notifications");
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getMockNotifications()
  );
  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusCategory, setStatusCategory] = useState<
    NotificationStatusCategory | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "read" | "unread">(
    "all"
  );
  const [detailNotification, setDetailNotification] =
    useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        !searchQuery.trim() ||
        n.message.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        n.typeLabel.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        n.from?.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        statusCategory === "all" || n.statusCategory === statusCategory;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "read" && n.status === "read") ||
        (typeFilter === "unread" && n.status === "new");
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [notifications, searchQuery, statusCategory, typeFilter]);
  useEffect(() => {
    const total = filteredNotifications.length;
    const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
    setCurrentPage((prev) => (prev > maxPage ? maxPage : prev));
  }, [filteredNotifications.length]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status === "new" ? { ...n, status: "read" as const } : n
      )
    );
    toast.success(t("markAllReadSuccess"));
  }, [t]);

  const hasNew = notifications.some((n) => n.status === "new");

  const toggleSelected = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleRemoveSelected = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    toast.success(t("removedSuccess"));
  }, [selectedIds, t]);

  const handleMarkReadSelected = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedIds.has(n.id) && n.status === "new"
          ? { ...n, status: "read" as const }
          : n
      )
    );
    setSelectedIds(new Set());
    toast.success(t("markAllReadSuccess"));
  }, [selectedIds, t]);

  const selectedCount = selectedIds.size;
  const allFilteredSelected =
    selectedCount > 0 &&
    filteredNotifications.length > 0 &&
    selectedCount === filteredNotifications.length;

  const handleSelectAllToggle = useCallback(() => {
    setSelectedIds(() => {
      const next = new Set<string>();
      if (!allFilteredSelected) {
        filteredNotifications.forEach((n) => {
          next.add(n.id);
        });
      }
      return next;
    });
  }, [allFilteredSelected, filteredNotifications]);

  const total = filteredNotifications.length;
  const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
  const endIndex = total === 0 ? 0 : Math.min(startIndex + PER_PAGE, total);
  const pageItems =
    total === 0
      ? filteredNotifications
      : filteredNotifications.slice(startIndex, endIndex);

  return (
    <div className='NotificationsList mx-auto w-full space-y-4 xl:mt-8'>
      <div className='flex items-start justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
        <Button
          asChild
          size='icon'
          aria-label={t("openSettings")}
          variant='outline'
        >
          <Link href='/notifications/setting'>
            <Settings className='size-5' aria-hidden />
            <span className='sr-only font-bold'>{t("openSettings")}</span>
          </Link>
        </Button>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative max-w-sm min-w-[200px] flex-1'>
          <Search
            className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
            aria-hidden
          />
          <Input
            type='search'
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchQuery("");
            }}
            className='pl-9'
            aria-label={t("searchPlaceholder")}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='shrink-0 gap-2'>
              {t("status")}
              <span className='text-muted-foreground'>
                {statusCategory === "all"
                  ? t("all")
                  : t(`statusCategory_${statusCategory}`)}
              </span>
              <ChevronDown className='size-4' aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem onClick={() => setStatusCategory("all")}>
              {t("all")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusCategory("task")}>
              {t("statusCategory_task")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusCategory("message")}>
              {t("statusCategory_message")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusCategory("review_pr")}>
              {t("statusCategory_review_pr")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='shrink-0 gap-2'>
              {t("type")}
              <span className='text-muted-foreground'>
                {typeFilter === "all" ? t("all") : t(`type_${typeFilter}`)}
              </span>
              <ChevronDown className='size-4' aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem onClick={() => setTypeFilter("all")}>
              {t("all")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("read")}>
              {t("type_read")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("unread")}>
              {t("type_unread")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className='overflow-hidden border'>
        <CardContent className='p-0'>
          <div className='border-border/60 bg-muted/40 flex h-15 flex-wrap items-center justify-between gap-2 border-b px-4 py-2'>
            <p className='text-muted-foreground text-sm'>
              {selectedCount > 0
                ? t("selectedCount", { count: selectedCount })
                : t("allNotifications")}
            </p>
            <div className='flex items-center gap-2'>
              {selectedCount > 0 && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleSelectAllToggle}
                  >
                    {allFilteredSelected ? t("unselectAll") : t("selectAll")}
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={handleRemoveSelected}
                  >
                    {t("remove")}
                  </Button>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={handleMarkReadSelected}
                  >
                    {t("markRead")}
                  </Button>
                </>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={markAllRead}
                disabled={!hasNew}
              >
                {t("markAllRead")}
              </Button>
            </div>
          </div>
          {total === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <p className='text-muted-foreground text-sm'>{t("empty")}</p>
            </div>
          ) : (
            <>
              <ul className='divide-border/60 divide-y' role='list'>
                {pageItems.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      checked={selectedIds.has(notification.id)}
                      onCheckedChange={(checked) =>
                        toggleSelected(notification.id, checked)
                      }
                      onSelect={(n) => {
                        setDetailNotification(n);
                        setDetailOpen(true);
                      }}
                    />
                  </li>
                ))}
              </ul>
              {total > 0 && (
                <div className='border-border/60 text-muted-foreground flex items-center justify-end space-x-2 border-t px-4 py-2 text-xs'>
                  <p>
                    {t("paginationLabel", {
                      start: total === 0 ? 0 : startIndex + 1,
                      end: endIndex,
                      total,
                    })}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    {t("previous")}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={endIndex >= total}
                    onClick={() =>
                      setCurrentPage((p) => (endIndex >= total ? p : p + 1))
                    }
                  >
                    {t("next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <NotificationDetailModal
        notification={detailNotification}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

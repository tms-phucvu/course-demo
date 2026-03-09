"use client";

import { useMemo, useState, useCallback } from "react";
import { getMockManagementUsers } from "@/features/user-management/mock/users";
import { UsersDashboard } from "@/features/user-management/components/users-dashboard";
import { useTranslations } from "next-intl";
import { cn } from "@/core/lib/utils";

const DATE_RANGE_KEYS = ["7d", "30d", "3m", "12m"] as const;
type DateRangeKey = (typeof DATE_RANGE_KEYS)[number];

function getDateRangeForKey(key: DateRangeKey): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  switch (key) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "3m":
      start.setMonth(start.getMonth() - 3);
      break;
    case "12m":
      start.setMonth(start.getMonth() - 12);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }
  return { start, end };
}

function formatRangeLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return `${start.toLocaleDateString("en-GB", opts)} - ${end.toLocaleDateString("en-GB", opts)}`;
}

export function UsersDashboardClient() {
  const t = useTranslations("userManagement.dashboard");
  const [dateRangeKey, setDateRangeKey] = useState<DateRangeKey>("12m");

  const dateRange = useMemo(
    () => getDateRangeForKey(dateRangeKey),
    [dateRangeKey]
  );
  const rangeLabel = useMemo(
    () => formatRangeLabel(dateRange.start, dateRange.end),
    [dateRange]
  );

  const allUsers = useMemo(() => getMockManagementUsers(), []);
  const users = useMemo(() => {
    const { start, end } = dateRange;
    return allUsers.filter((u) => {
      const d = new Date(u.updatedAt);
      return d >= start && d <= end;
    });
  }, [allUsers, dateRange]);

  const onRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value as DateRangeKey;
      if (DATE_RANGE_KEYS.includes(v)) setDateRangeKey(v);
    },
    []
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='UsersDashboardClient mb-4 flex flex-row flex-wrap items-center justify-between gap-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("pageTitle")}</h1>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-muted-foreground text-sm'>{rangeLabel}</span>
          <select
            value={dateRangeKey}
            onChange={onRangeChange}
            aria-label={t("dateRangeSelectLabel")}
            className={cn(
              "border-input flex h-9 min-w-[140px] rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value='7d'>{t("dateRangeLast7Days")}</option>
            <option value='30d'>{t("dateRangeLast30Days")}</option>
            <option value='3m'>{t("dateRangeLast3Months")}</option>
            <option value='12m'>{t("dateRangeLast12Months")}</option>
          </select>
        </div>
      </div>
      <UsersDashboard users={users} dateRange={dateRange} />
    </div>
  );
}

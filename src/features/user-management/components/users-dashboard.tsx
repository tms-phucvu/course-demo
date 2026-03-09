"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDashboardStats,
  getUsersByMonth,
  type DashboardStats,
  type MonthCount,
} from "@/features/user-management/lib/dashboard-stats";
import type { ManagementUser } from "@/features/user-management/types";
import { cn } from "@/core/lib/utils";
import {
  AlertTriangle,
  Banknote,
  Coins,
  Gem,
  MapPin,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { JapanMapChart } from "@/features/user-management/components/japan-map-chart";

interface UsersDashboardProps {
  users: ManagementUser[];
  /** When provided, chart shows only months in this range and stats are for filtered users */
  dateRange?: { start: Date; end: Date };
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  className?: string;
}) {
  return (
    <Card
      data-slot='card'
      className={cn(
        "from-primary/10 flex flex-col gap-6 rounded-xl border bg-linear-to-t py-6",
        className
      )}
    >
      <CardHeader className='space-y-0 pb-0'>
        <div className='flex flex-row items-center justify-between'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon className='text-muted-foreground size-5 shrink-0' aria-hidden />
        </div>
        {description && (
          <CardDescription className='text-xs'>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='pt-0 pb-0'>
        <div className='text-2xl font-bold tabular-nums'>{value}</div>
      </CardContent>
    </Card>
  );
}

export function UsersDashboard({ users, dateRange }: UsersDashboardProps) {
  const t = useTranslations("userManagement.dashboard");

  const stats: DashboardStats = useMemo(
    () => getDashboardStats(users),
    [users]
  );

  const usersByMonth: MonthCount[] = useMemo(
    () =>
      dateRange ? getUsersByMonth(users, dateRange) : getUsersByMonth(users),
    [users, dateRange]
  );

  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        confine: true,
        position: "top" as const,
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        textStyle: {
          color: "hsl(var(--card-foreground))",
          fontSize: 12,
        },
        padding: [8, 12],
        formatter: (
          params: { name: string; value: number; seriesName: string }[]
        ) => {
          const p = params[0];
          if (!p) return "";
          return `${p.name}<br/>${p.seriesName}: <strong>${p.value}</strong>`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        data: usersByMonth.map((m) => m.monthShort),
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "value" as const,
        minInterval: 1,
      },
      series: [
        {
          name: t("usersPerMonth"),
          type: "bar" as const,
          data: usersByMonth.map((m) => m.count),
          itemStyle: {
            color: "hsl(var(--primary))",
          },
        },
      ],
    }),
    [usersByMonth, t]
  );

  return (
    <div className='UsersDashboard flex flex-col gap-6'>
      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <StatCard
          title={t("totalUsers")}
          value={stats.total}
          icon={Users}
          description={t("totalUsersDesc")}
        />
        <StatCard
          title={t("planSilver")}
          value={stats.silver}
          icon={Coins}
          className='from-slate-500/10'
          description={t("planSilverDesc")}
        />
        <StatCard
          title={t("planGold")}
          value={stats.gold}
          icon={Trophy}
          className='from-amber-500/10'
          description={t("planGoldDesc")}
        />
        <StatCard
          title={t("planDiamond")}
          value={stats.diamond}
          icon={Gem}
          className='from-cyan-500/10'
          description={t("planDiamondDesc")}
        />
        <StatCard
          title={t("totalRevenue")}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(stats.totalRevenue)}
          icon={Banknote}
          description={t("totalRevenueDesc")}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='size-5' aria-hidden />
            {t("usersByMonthTitle")}
          </CardTitle>
          <CardDescription>{t("usersByMonthDesc")}</CardDescription>
        </CardHeader>
        <CardContent className='overflow-visible'>
          <div className='h-[320px] w-full overflow-visible'>
            <ReactECharts
              option={chartOption}
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: "canvas" }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='size-5' aria-hidden />
            {t("usersByPrefecture")}
          </CardTitle>
          <CardDescription>{t("usersByPrefectureDesc")}</CardDescription>
        </CardHeader>
        <CardContent className='overflow-visible'>
          <JapanMapChart users={users} />
        </CardContent>
      </Card>

      <section>
        <h2 className='mb-3 text-lg font-semibold'>{t("keyHighlights")}</h2>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Card className='border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                <TrendingUp
                  className='size-5 text-amber-600 dark:text-amber-400'
                  aria-hidden
                />
                {t("requestPlanCount")}
              </CardTitle>
              <span className='text-2xl font-bold text-amber-700 tabular-nums dark:text-amber-300'>
                {stats.requestPlanCount}
              </span>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("requestPlanCountDesc")}</CardDescription>
            </CardContent>
          </Card>
          <Card className='border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                <AlertTriangle
                  className='size-5 text-red-600 dark:text-red-400'
                  aria-hidden
                />
                {t("inactiveCount")}
              </CardTitle>
              <span className='text-2xl font-bold text-red-700 tabular-nums dark:text-red-300'>
                {stats.inactiveCount}
              </span>
            </CardHeader>
            <CardContent>
              <CardDescription>{t("inactiveCountDesc")}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

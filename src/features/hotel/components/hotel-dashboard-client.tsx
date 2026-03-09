"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/core/lib/utils";
import {
  MOCK_BOOKING_BY_PLATFORM,
  MOCK_BOOKING_LIST,
  MOCK_OVERVIEW_STATS,
  MOCK_RESERVATIONS_BY_DAY,
  MOCK_REVENUE_DATA,
  MOCK_ROOM_AVAILABILITY,
} from "@/features/hotel/mock/dashboard-data";
import type { BookingStatus } from "@/features/hotel/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  DollarSign,
  MoreHorizontal,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  trendLabel,
  className,
}: {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ElementType;
  trendLabel: string;
  className?: string;
}) {
  const isUp = trend >= 0;
  return (
    <Card
      className={cn(
        "hotel-dashboard-stat-card flex flex-col gap-4 rounded-xl border bg-white p-6 dark:bg-white",
        className
      )}
    >
      <div className='flex flex-row items-center justify-between'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='text-muted-foreground size-5 shrink-0' aria-hidden />
      </div>
      <CardContent className='p-0'>
        <div className='text-2xl font-bold tabular-nums'>{value}</div>
        <p
          className={cn(
            "mt-1 flex items-center gap-0.5 text-xs",
            isUp
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {isUp ? (
            <TrendingUp className='size-3.5' aria-hidden />
          ) : (
            <TrendingDown className='size-3.5' aria-hidden />
          )}
          {isUp ? "" : ""}
          {Math.abs(trend).toFixed(2)}% {trendLabel}
        </p>
      </CardContent>
    </Card>
  );
}

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function HotelDashboardClient() {
  const t = useTranslations("hotel.dashboard");
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [dateRangeFrom, setDateRangeFrom] = useState(defaultRange.from);
  const [dateRangeTo, setDateRangeTo] = useState(defaultRange.to);
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [revenueRange, setRevenueRange] = useState("6");
  const [reservationsRange, setReservationsRange] = useState("7");

  const filteredBookings = useMemo(() => {
    let list = [...MOCK_BOOKING_LIST];
    const q = bookingSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.guestName.toLowerCase().includes(q) ||
          b.branch?.toLowerCase().includes(q) ||
          b.roomType.toLowerCase().includes(q) ||
          b.roomNumber.includes(q) ||
          b.status.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }
    return list;
  }, [bookingSearch, statusFilter]);

  const roomAvailabilityOption = useMemo(
    () => ({
      tooltip: {
        trigger: "item" as const,
        formatter: "{b}: {c} ({d}%)",
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        textStyle: { color: "hsl(var(--card-foreground))" },
      },
      legend: {
        orient: "vertical",
        right: 8,
        top: "center",
        type: "scroll",
        textStyle: { fontSize: 12 },
      },
      series: [
        {
          type: "pie" as const,
          radius: ["45%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: true,
          label: { show: false },
          data: [
            {
              name: t("occupied"),
              value: MOCK_ROOM_AVAILABILITY.occupied,
              itemStyle: { color: "#22c55e" },
            },
            {
              name: t("reserved"),
              value: MOCK_ROOM_AVAILABILITY.reserved,
              itemStyle: { color: "#eab308" },
            },
            {
              name: t("available"),
              value: MOCK_ROOM_AVAILABILITY.available,
              itemStyle: { color: "#4ade80" },
            },
            {
              name: t("notReady"),
              value: MOCK_ROOM_AVAILABILITY.notReady,
              itemStyle: { color: "#facc15" },
            },
          ],
        },
      ],
    }),
    [t]
  );

  const revenueOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis" as const,
        formatter: (params: { name: string; value: number }[]) => {
          const p = params?.[0];
          if (!p) return "";
          return `Total Revenue $${p.value?.toLocaleString() ?? ""}`;
        },
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        textStyle: { color: "hsl(var(--card-foreground))" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "12%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        data: MOCK_REVENUE_DATA.map((d) => d.month),
        boundaryGap: false,
      },
      yAxis: {
        type: "value" as const,
        axisLabel: { formatter: (v: number) => `$${v / 1000}K` },
      },
      series: [
        {
          type: "line" as const,
          data: MOCK_REVENUE_DATA.map((d) => d.value),
          smooth: true,
          areaStyle: { color: "rgba(34, 197, 94, 0.2)" },
          lineStyle: { color: "#22c55e" },
          itemStyle: { color: "#22c55e" },
        },
      ],
    }),
    []
  );

  const reservationsOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        textStyle: { color: "hsl(var(--card-foreground))" },
      },
      legend: {
        data: [t("booked"), t("canceled")],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "18%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        data: MOCK_RESERVATIONS_BY_DAY.map((d) => d.date),
      },
      yAxis: { type: "value" as const, minInterval: 25 },
      series: [
        {
          name: t("booked"),
          type: "bar" as const,
          stack: "total",
          data: MOCK_RESERVATIONS_BY_DAY.map((d) => d.booked),
          itemStyle: { color: "#22c55e" },
        },
        {
          name: t("canceled"),
          type: "bar" as const,
          stack: "total",
          data: MOCK_RESERVATIONS_BY_DAY.map((d) => d.canceled),
          itemStyle: { color: "#eab308" },
        },
      ],
    }),
    [t]
  );

  const platformOption = useMemo(
    () => ({
      tooltip: {
        trigger: "item" as const,
        formatter: "{b}: {c}%",
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        textStyle: { color: "hsl(var(--card-foreground))" },
      },
      legend: { orient: "vertical", right: 8, top: "center", type: "scroll" },
      series: [
        {
          type: "pie" as const,
          radius: ["45%", "70%"],
          center: ["35%", "50%"],
          avoidLabelOverlap: false,
          label: { show: false },
          data: MOCK_BOOKING_BY_PLATFORM.map((p) => ({
            name: p.name,
            value: p.percent,
            itemStyle: {
              color: [
                "#22c55e",
                "#a1a1aa",
                "#eab308",
                "#22c55e",
                "#a1a1aa",
                "#22c55e",
              ][MOCK_BOOKING_BY_PLATFORM.indexOf(p) % 6],
            },
          })),
        },
      ],
    }),
    []
  );

  const formatDate = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className='hotel-dashboard flex flex-col gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
        <div className='flex flex-wrap items-center gap-2'>
          <CalendarDays
            className='text-muted-foreground size-4 shrink-0'
            aria-hidden
          />
          <Input
            type='date'
            value={dateRangeFrom}
            onChange={(e) => setDateRangeFrom(e.target.value)}
            className='w-full min-w-[140px] sm:w-auto'
            aria-label={t("dateRangeFrom")}
          />
          <span className='text-muted-foreground text-sm'>–</span>
          <Input
            type='date'
            value={dateRangeTo}
            onChange={(e) => setDateRangeTo(e.target.value)}
            className='w-full min-w-[140px] sm:w-auto'
            aria-label={t("dateRangeTo")}
          />
        </div>
      </div>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title={t("newBookings")}
          value={MOCK_OVERVIEW_STATS.newBookings}
          trend={MOCK_OVERVIEW_STATS.newBookingsTrend}
          icon={CalendarDays}
          trendLabel={t("fromLastWeek")}
        />
        <StatCard
          title={t("checkIn")}
          value={MOCK_OVERVIEW_STATS.checkIn}
          trend={MOCK_OVERVIEW_STATS.checkInTrend}
          icon={ArrowDownLeft}
          trendLabel={t("fromLastWeek")}
        />
        <StatCard
          title={t("checkOut")}
          value={MOCK_OVERVIEW_STATS.checkOut}
          trend={MOCK_OVERVIEW_STATS.checkOutTrend}
          icon={ArrowUpRight}
          trendLabel={t("fromLastWeek")}
        />
        <StatCard
          title={t("totalRevenue")}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(MOCK_OVERVIEW_STATS.totalRevenue)}
          trend={MOCK_OVERVIEW_STATS.totalRevenueTrend}
          icon={DollarSign}
          trendLabel={t("fromLastWeek")}
        />
      </section>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='hotel-dashboard-room-availability'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>{t("roomAvailability")}</CardTitle>
            <button
              type='button'
              className='hover:bg-muted rounded p-1'
              aria-label={t("moreOptions")}
            >
              <MoreHorizontal className='size-4' />
            </button>
          </CardHeader>
          <CardContent>
            <div className='h-[280px] w-full'>
              <ReactECharts
                option={roomAvailabilityOption}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "canvas" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='hotel-dashboard-revenue'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>{t("revenue")}</CardTitle>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className='border-input rounded-md border bg-transparent px-2 py-1 text-sm'
              aria-label={t("revenueRange")}
            >
              <option value='6'>{t("last6Months")}</option>
              <option value='3'>{t("last3Months")}</option>
              <option value='12'>{t("last12Months")}</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className='h-[280px] w-full'>
              <ReactECharts
                option={revenueOption}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "canvas" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='hotel-dashboard-reservations'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>{t("reservations")}</CardTitle>
            <select
              value={reservationsRange}
              onChange={(e) => setReservationsRange(e.target.value)}
              className='border-input rounded-md border bg-transparent px-2 py-1 text-sm'
              aria-label={t("reservationsRange")}
            >
              <option value='7'>{t("last7Days")}</option>
              <option value='14'>{t("last14Days")}</option>
              <option value='30'>{t("last30Days")}</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className='h-[260px] w-full'>
              <ReactECharts
                option={reservationsOption}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "canvas" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='hotel-dashboard-booking-platform'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle>{t("bookingByPlatform")}</CardTitle>
            <button
              type='button'
              className='hover:bg-muted rounded p-1'
              aria-label={t("moreOptions")}
            >
              <MoreHorizontal className='size-4' />
            </button>
          </CardHeader>
          <CardContent>
            <div className='h-[260px] w-full'>
              <ReactECharts
                option={platformOption}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "canvas" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='hotel-dashboard-booking-list'>
        <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <CardTitle>{t("bookingList")}</CardTitle>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
              <Input
                type='search'
                placeholder={t("bookingSearchPlaceholder")}
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className='w-56 pl-8'
                aria-label={t("bookingSearchPlaceholder")}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as BookingStatus | "all")
              }
              className='border-input rounded-md border bg-transparent px-3 py-2 text-sm'
              aria-label={t("filterByStatus")}
            >
              <option value='all'>{t("allStatus")}</option>
              <option value='pending'>{t("statusPending")}</option>
              <option value='checked-in'>{t("statusCheckedIn")}</option>
              <option value='checked-out'>{t("statusCheckedOut")}</option>
              <option value='canceled'>{t("statusCanceled")}</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("bookingId")}</TableHead>
                <TableHead>{t("guestName")}</TableHead>
                <TableHead>{t("branch")}</TableHead>
                <TableHead>{t("roomType")}</TableHead>
                <TableHead>{t("roomNumber")}</TableHead>
                <TableHead>{t("duration")}</TableHead>
                <TableHead>{t("checkInOut")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-muted-foreground text-center'
                  >
                    {t("noBookings")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className='font-medium'>{row.id}</TableCell>
                    <TableCell>{row.guestName}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {row.branch ?? "–"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          row.roomType === "Deluxe" &&
                            "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
                          row.roomType === "Standard" &&
                            "bg-green-500/15 text-green-700 dark:text-green-400",
                          row.roomType === "Suite" &&
                            "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
                        )}
                      >
                        {row.roomType}
                      </span>
                    </TableCell>
                    <TableCell>Room {row.roomNumber}</TableCell>
                    <TableCell>
                      {row.durationNights} {t("nights")}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-xs'>
                      {formatDate(row.checkIn)} – {formatDate(row.checkOut)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          row.status === "checked-in" &&
                            "bg-green-500/15 text-green-700 dark:text-green-400",
                          row.status === "pending" &&
                            "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
                          row.status === "checked-out" &&
                            "bg-muted text-muted-foreground",
                          row.status === "canceled" &&
                            "bg-red-500/15 text-red-700 dark:text-red-400"
                        )}
                      >
                        {row.status === "checked-in" && t("statusCheckedIn")}
                        {row.status === "pending" && t("statusPending")}
                        {row.status === "checked-out" && t("statusCheckedOut")}
                        {row.status === "canceled" && t("statusCanceled")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

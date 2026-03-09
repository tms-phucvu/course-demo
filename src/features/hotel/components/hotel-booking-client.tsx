"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/core/lib/utils";
import { NewBookingSheet } from "@/features/hotel/components/new-booking-sheet";
import {
  BOOKING_GRID_HOURS,
  getMockRoomBookingSlotsForDate,
  MOCK_BOOKING_GRID_ROOMS,
} from "@/features/hotel/mock/booking-grid-data";
import type {
  BookingCardVariant,
  RoomBookingSlot,
  SlotPaymentStatus,
} from "@/features/hotel/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Grid3X3,
  List,
  MoreHorizontal,
  Phone,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { NewBookingFormValues } from "@/features/hotel/components/new-booking-sheet";

function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const CELL_SIZE = 220;
const SLOT_HEIGHT = CELL_SIZE;

function formatTimeForDisplay(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatBookedAt(bookedAt: string | undefined): string {
  if (!bookedAt) return "—";
  const d = new Date(bookedAt.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return bookedAt;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number | undefined): string {
  if (amount == null) return "—";
  return `¥${amount.toLocaleString()}`;
}

function getSlotIndex(time: string): number {
  const idx = BOOKING_GRID_HOURS.indexOf(time);
  return idx >= 0 ? idx : 0;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** True if the slot (row) is in the past: selected date before today, or today and current time >= slot end. */
function isSlotInPast(selectedDate: Date, rowIndex: number): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  if (selected.getTime() < today.getTime()) return true;
  if (selected.getTime() > today.getTime()) return false;
  const slotStartMinutes = timeToMinutes(
    BOOKING_GRID_HOURS[rowIndex] ?? "00:00"
  );
  const slotEndMinutes = slotStartMinutes + 60;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= slotEndMinutes;
}

/**
 * Compute card variant from current time vs booking slot.
 * - Green: ongoing (guest present, not ended).
 * - Red: already ended.
 * - Blue: future booking.
 * - Yellow: time reached but guest not arrived (no-show).
 */
function getBookingCardVariant(
  booking: RoomBookingSlot,
  selectedDate: Date
): BookingCardVariant {
  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();
  const currentMinutes = isToday
    ? now.getHours() * 60 + now.getMinutes()
    : 10 * 60; // 10:00 when not today (demo)
  const startMinutes = timeToMinutes(booking.startTime);
  const endMinutes = timeToMinutes(booking.endTime);

  if (currentMinutes >= endMinutes) return "red";
  if (currentMinutes < startMinutes) return "blue";
  // start <= now < end (ongoing)
  return booking.checkedIn === false ? "yellow" : "green";
}

const CARD_VARIANT_STYLES: Record<
  BookingCardVariant,
  { border: string; bg: string }
> = {
  green: { border: "border-green-500", bg: "bg-green-50 dark:bg-green-950/40" },
  red: { border: "border-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
  blue: { border: "border-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
  yellow: {
    border: "border-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
  },
};

function getPaymentStatusKey(
  status: SlotPaymentStatus | undefined
): "paymentPending" | "paymentPaid" | "paymentPartial" {
  switch (status) {
    case "paid":
      return "paymentPaid";
    case "partial":
      return "paymentPartial";
    default:
      return "paymentPending";
  }
}

function BookingCard({
  booking,
  variant,
  rowSpan,
  onMenu,
  onPay,
}: {
  booking: RoomBookingSlot;
  variant: BookingCardVariant;
  rowSpan: number;
  onMenu?: (id: string) => void;
  onPay?: (booking: RoomBookingSlot) => void;
}) {
  const t = useTranslations("hotel.booking");
  const height = rowSpan * SLOT_HEIGHT - 8;
  const minCardH = 60;
  const styles = CARD_VARIANT_STYLES[variant];
  const showPayButton =
    (booking.paymentStatus === "pending" ||
      booking.paymentStatus === "partial") &&
    booking.amount != null &&
    booking.amount > 0;

  const paymentStatus = booking.paymentStatus ?? "pending";
  const chipClass = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    partial: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  }[paymentStatus];

  return (
    <div
      className={cn(
        "BookingCard absolute top-1 right-1 left-1 flex min-h-[44px] flex-col items-start rounded-lg border-2 p-2 text-left",
        styles.border,
        styles.bg
      )}
      style={{ height: Math.max(height, minCardH) }}
    >
      <div className='flex w-full flex-1 flex-col gap-1 overflow-auto text-left'>
        <div className='flex w-full items-start justify-between gap-1'>
          <span className='text-foreground min-w-0 truncate text-xs font-bold'>
            {booking.guestName}
          </span>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onMenu?.(booking.id);
            }}
            className='hover:bg-muted shrink-0 rounded p-0.5'
            aria-label={t("moreOptions")}
          >
            <MoreHorizontal className='size-3.5' />
          </button>
        </div>
        {booking.phone != null && booking.phone !== "" && (
          <div className='text-muted-foreground flex items-center gap-1 text-left text-xs'>
            <Phone className='size-3 shrink-0' aria-hidden />
            <span className='truncate'>{booking.phone}</span>
          </div>
        )}
        <div className='text-muted-foreground text-left text-xs'>
          <span className='text-foreground/80 font-medium'>
            {t("cardBookedAt")}:{" "}
          </span>
          {formatBookedAt(booking.bookedAt)}
        </div>
        <div className='text-muted-foreground flex items-center gap-1 text-left text-xs'>
          <Clock className='size-3 shrink-0' aria-hidden />
          <span>
            {formatTimeForDisplay(booking.startTime)} –{" "}
            {formatTimeForDisplay(booking.endTime)}
          </span>
        </div>
        <div className='text-muted-foreground text-left text-xs'>
          <span className='text-foreground/80 font-medium'>
            {t("cardAmount")}:{" "}
          </span>
          {formatAmount(booking.amount)}
        </div>
        <div className='flex items-center gap-1 text-left text-xs'>
          <span className='text-foreground/80 font-medium'>
            {t("cardPaymentStatus")}:{" "}
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              chipClass
            )}
          >
            {t(getPaymentStatusKey(booking.paymentStatus))}
          </span>
        </div>
      </div>
      {showPayButton && (
        <div className='border-border/50 mt-2 w-full shrink-0 border-t pt-2'>
          <Button
            type='button'
            size='sm'
            variant='default'
            className='h-7 w-full text-xs'
            onClick={(e) => {
              e.stopPropagation();
              onPay?.(booking);
            }}
          >
            {t("pay")}
          </Button>
        </div>
      )}
    </div>
  );
}

export function HotelBookingClient() {
  const t = useTranslations("hotel.booking");
  const [selectedDate, setSelectedDate] = useState(() => new Date()); // Default: today
  const [view, setView] = useState<"grid" | "list">("grid");
  const [qrPaymentBooking, setQrPaymentBooking] =
    useState<RoomBookingSlot | null>(null);
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false);
  const [addCellPreFill, setAddCellPreFill] = useState<{
    roomId: string;
    startTime: string;
  } | null>(null);
  const [listSortKey, setListSortKey] = useState<
    keyof RoomBookingSlot | "roomName"
  >("startTime");
  const [listSortDir, setListSortDir] = useState<"asc" | "desc">("asc");
  const [todayKey, setTodayKey] = useState(getTodayDateKey);
  const [addedSlots, setAddedSlots] = useState<RoomBookingSlot[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setTodayKey((prev) => {
        const next = getTodayDateKey();
        return next !== prev ? next : prev;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const mockSlots = useMemo(() => {
    void todayKey;
    return getMockRoomBookingSlotsForDate(new Date());
  }, [todayKey]);

  const selectedDateStr = useMemo(
    () =>
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
    [selectedDate]
  );

  const isSelectedDateToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }, [selectedDate]);

  const displaySlots = useMemo(() => {
    const base = isSelectedDateToday ? mockSlots : [];
    const forDate = addedSlots.filter((s) => s.date === selectedDateStr);
    return [...base, ...forDate];
  }, [mockSlots, addedSlots, isSelectedDateToday, selectedDateStr]);

  const dateLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [selectedDate]
  );

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };
  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const bookingsByRoomStart = useMemo(() => {
    const map = new Map<string, Map<number, RoomBookingSlot>>();
    for (const room of MOCK_BOOKING_GRID_ROOMS) {
      map.set(room.id, new Map());
    }
    for (const b of displaySlots) {
      const startIdx = getSlotIndex(b.startTime);
      const endIdx = getSlotIndex(b.endTime);
      if (endIdx <= startIdx) continue;
      map.get(b.roomId)?.set(startIdx, b);
    }
    return map;
  }, [displaySlots]);

  const bookingSpan = (booking: RoomBookingSlot) => {
    const startIdx = getSlotIndex(booking.startTime);
    const endIdx = getSlotIndex(booking.endTime);
    return Math.max(1, endIdx - startIdx);
  };

  const isCellCovered = (
    roomId: string,
    rowIndex: number
  ): RoomBookingSlot | null => {
    for (const b of displaySlots) {
      if (b.roomId !== roomId) continue;
      const startIdx = getSlotIndex(b.startTime);
      const endIdx = getSlotIndex(b.endTime);
      if (rowIndex >= startIdx && rowIndex < endIdx) return b;
    }
    return null;
  };

  const getBookingAt = (
    roomId: string,
    rowIndex: number
  ): RoomBookingSlot | null => {
    return bookingsByRoomStart.get(roomId)?.get(rowIndex) ?? null;
  };

  const roomNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of MOCK_BOOKING_GRID_ROOMS) m.set(r.id, r.name);
    return m;
  }, []);

  const sortedListSlots = useMemo(() => {
    const key = listSortKey;
    const dir = listSortDir === "asc" ? 1 : -1;
    const cmp = (a: RoomBookingSlot, b: RoomBookingSlot): number => {
      let v = 0;
      if (key === "id") v = (a.id ?? "").localeCompare(b.id ?? "");
      else if (key === "guestName")
        v = (a.guestName ?? "").localeCompare(b.guestName ?? "");
      else if (key === "phone")
        v = (a.phone ?? "").localeCompare(b.phone ?? "");
      else if (key === "roomId")
        v = (a.roomId ?? "").localeCompare(b.roomId ?? "");
      else if (key === "startTime")
        v = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      else if (key === "endTime")
        v = timeToMinutes(a.endTime) - timeToMinutes(b.endTime);
      else if (key === "bookedAt")
        v = (a.bookedAt ?? "").localeCompare(b.bookedAt ?? "");
      else if (key === "amount") v = (a.amount ?? 0) - (b.amount ?? 0);
      else if (key === "paymentStatus") {
        const order = { pending: 0, partial: 1, paid: 2 };
        v =
          (order[a.paymentStatus ?? "pending"] ?? 0) -
          (order[b.paymentStatus ?? "pending"] ?? 0);
      }
      return v * dir;
    };
    return [...displaySlots].sort(cmp);
  }, [displaySlots, listSortKey, listSortDir]);

  const handleListSort = (key: keyof RoomBookingSlot | "roomName") => {
    const actualKey = key === "roomName" ? "roomId" : key;
    if (listSortKey === actualKey) {
      setListSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setListSortKey(actualKey);
      setListSortDir("asc");
    }
  };

  function validateOverlap(
    roomId: string,
    date: string,
    startTime: string,
    endTime: string
  ): string | null {
    const isFormDateToday = date === selectedDateStr && isSelectedDateToday;
    const base = isFormDateToday ? mockSlots : [];
    const forRoomAndDate = [
      ...base,
      ...addedSlots.filter((s) => s.roomId === roomId && s.date === date),
    ];
    const startM = timeToMinutes(startTime);
    const endM = timeToMinutes(endTime);
    for (const s of forRoomAndDate) {
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);
      if (startM < sEnd && sStart < endM) return t("overlapError");
    }
    return null;
  }

  const handleSaveBooking = async (
    values: NewBookingFormValues
  ): Promise<boolean> => {
    const overlap = validateOverlap(
      values.room,
      values.date,
      values.startTime,
      values.endTime
    );
    if (overlap) {
      toast.error(overlap);
      return false;
    }
    const now = new Date();
    const newSlot: RoomBookingSlot = {
      id: `added-${Date.now()}`,
      guestName: values.name,
      roomId: values.room,
      startTime: values.startTime,
      endTime: values.endTime,
      phone: values.phone,
      bookedAt: now.toISOString().slice(0, 16).replace("T", " "),
      amount: 0,
      paymentStatus: values.status ?? "pending",
      date: values.date,
    };
    setAddedSlots((prev) => [...prev, newSlot]);
    toast.success(t("saveSuccess"));
    return true;
  };

  const legendItems: {
    variant: BookingCardVariant;
    labelKey: "colorGreen" | "colorRed" | "colorBlue" | "colorYellow";
  }[] = [
    { variant: "green", labelKey: "colorGreen" },
    { variant: "red", labelKey: "colorRed" },
    { variant: "blue", labelKey: "colorBlue" },
    { variant: "yellow", labelKey: "colorYellow" },
  ];

  return (
    <div className='hotel-booking flex flex-col gap-6 bg-white dark:bg-white'>
      <div className='border-border bg-muted/30 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border px-3 py-2'>
        {legendItems.map(({ variant, labelKey }) => {
          const s = CARD_VARIANT_STYLES[variant];
          return (
            <div key={variant} className='flex items-center gap-2'>
              <span
                className={cn(
                  "h-4 w-4 shrink-0 rounded border-2",
                  s.border,
                  s.bg
                )}
                aria-hidden
              />
              <span className='text-muted-foreground text-xs'>
                {t(labelKey)}
              </span>
            </div>
          );
        })}
      </div>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='border-input flex items-center gap-1 rounded-md border bg-white p-1'>
            <button
              type='button'
              onClick={goPrev}
              className='hover:bg-muted rounded p-1.5'
              aria-label={t("previousDay")}
            >
              <ChevronLeft className='size-4' />
            </button>
            <time
              dateTime={selectedDate.toISOString().slice(0, 10)}
              className='min-w-[120px] px-2 py-1.5 text-center text-sm font-medium'
            >
              {dateLabel}
            </time>
            <button
              type='button'
              onClick={goNext}
              className='hover:bg-muted rounded p-1.5'
              aria-label={t("nextDay")}
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
          <div className='border-input flex items-center gap-0.5 rounded-md border bg-white p-0.5'>
            <button
              type='button'
              onClick={() => setView("grid")}
              className={cn(
                "rounded p-2",
                view === "grid" ? "bg-muted" : "hover:bg-muted"
              )}
              aria-label={t("gridView")}
              aria-pressed={view === "grid"}
            >
              <Grid3X3 className='size-4' />
            </button>
            <button
              type='button'
              onClick={() => setView("list")}
              className={cn(
                "rounded p-2",
                view === "list" ? "bg-muted" : "hover:bg-muted"
              )}
              aria-label={t("listView")}
              aria-pressed={view === "list"}
            >
              <List className='size-4' />
            </button>
          </div>
          <Button
            type='button'
            className='gap-2 bg-black hover:bg-black/90 dark:bg-black dark:hover:bg-black/90'
            onClick={() => {
              setAddCellPreFill(null);
              setBookingSheetOpen(true);
            }}
          >
            <Plus className='size-4' />
            {t("bookingRoom")}
          </Button>
        </div>
      </div>

      {view === "grid" && (
        <div className='border-border overflow-x-auto overflow-y-auto rounded-xl border bg-white'>
          <table className='w-full border-collapse' role='grid'>
            <thead>
              <tr>
                <th
                  className='border-border text-muted-foreground sticky left-0 z-10 w-[80px] min-w-[80px] border px-2 py-3 text-center text-xs font-medium shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]'
                  style={{ backgroundColor: "#FAFAFA" }}
                  scope='col'
                >
                  {t("time")}
                </th>
                {MOCK_BOOKING_GRID_ROOMS.map((room) => {
                  const n = parseInt(room.id.replace("room-", ""), 10) || 1;
                  return (
                    <th
                      key={room.id}
                      className='border-border bg-muted/50 text-muted-foreground min-w-[220px] border px-2 py-3 text-center text-xs font-medium'
                      scope='col'
                      style={{ width: CELL_SIZE }}
                    >
                      {t("roomName", { n })}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {BOOKING_GRID_HOURS.map((hour, rowIndex) => (
                <tr key={hour}>
                  <td
                    className='border-border text-muted-foreground sticky left-0 z-10 w-[80px] min-w-[80px] border px-2 py-1 text-center text-xs shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]'
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    {formatTimeForDisplay(hour)}
                  </td>
                  {MOCK_BOOKING_GRID_ROOMS.map((room) => {
                    const covered = isCellCovered(room.id, rowIndex);
                    const booking = getBookingAt(room.id, rowIndex);
                    if (covered && !booking) return null;
                    const span = booking ? bookingSpan(booking) : 1;
                    const past = isSlotInPast(selectedDate, rowIndex);
                    const emptyAndPast = !booking && past;
                    return (
                      <td
                        key={room.id}
                        rowSpan={booking ? span : undefined}
                        className={cn(
                          "group border-border relative min-w-[220px] border p-1 text-center align-top",
                          emptyAndPast && "bg-muted/40"
                        )}
                        style={{
                          height: booking ? undefined : SLOT_HEIGHT,
                          minHeight: SLOT_HEIGHT,
                          width: CELL_SIZE,
                          verticalAlign: "top",
                        }}
                      >
                        {booking ? (
                          <BookingCard
                            booking={booking}
                            variant={getBookingCardVariant(
                              booking,
                              selectedDate
                            )}
                            rowSpan={span}
                            onMenu={(id) => window.console?.log?.(id)}
                            onPay={setQrPaymentBooking}
                          />
                        ) : emptyAndPast ? (
                          <span className='sr-only'>{t("pastSlot")}</span>
                        ) : (
                          <button
                            type='button'
                            className='border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50 absolute top-1/2 left-1/2 flex h-[30px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-dashed text-xs opacity-0 transition-opacity group-hover:opacity-100'
                            onClick={() => {
                              setAddCellPreFill({
                                roomId: room.id,
                                startTime:
                                  BOOKING_GRID_HOURS[rowIndex] ??
                                  BOOKING_GRID_HOURS[0],
                              });
                              setBookingSheetOpen(true);
                            }}
                          >
                            + {t("add")}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "list" && (
        <div className='border-border rounded-xl border bg-white'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("id")}
                    aria-label={t("sortBy", { column: t("listId") })}
                  >
                    {t("listId")}
                    {listSortKey === "id" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("guestName")}
                    aria-label={t("sortBy", { column: t("listGuest") })}
                  >
                    {t("listGuest")}
                    {listSortKey === "guestName" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("phone")}
                    aria-label={t("sortBy", { column: t("listPhone") })}
                  >
                    {t("listPhone")}
                    {listSortKey === "phone" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("roomName")}
                    aria-label={t("sortBy", { column: t("listRoom") })}
                  >
                    {t("listRoom")}
                    {listSortKey === "roomId" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("startTime")}
                    aria-label={t("sortBy", { column: t("listTimeSlot") })}
                  >
                    {t("listTimeSlot")}
                    {listSortKey === "startTime" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("bookedAt")}
                    aria-label={t("sortBy", { column: t("listBookedAt") })}
                  >
                    {t("listBookedAt")}
                    {listSortKey === "bookedAt" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("amount")}
                    aria-label={t("sortBy", { column: t("listAmount") })}
                  >
                    {t("listAmount")}
                    {listSortKey === "amount" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium'
                    onClick={() => handleListSort("paymentStatus")}
                    aria-label={t("sortBy", { column: t("listStatus") })}
                  >
                    {t("listStatus")}
                    {listSortKey === "paymentStatus" ? (
                      listSortDir === "asc" ? (
                        <ChevronUp className='size-4' />
                      ) : (
                        <ChevronDown className='size-4' />
                      )
                    ) : null}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedListSlots.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-muted-foreground h-24 text-center'
                  >
                    {t("listEmpty")}
                  </TableCell>
                </TableRow>
              ) : (
                sortedListSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className='font-mono text-xs'>
                      {slot.id}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {slot.guestName}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {slot.phone ?? "—"}
                    </TableCell>
                    <TableCell>
                      {roomNameById.get(slot.roomId) ?? slot.roomId}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      <span className='inline-flex items-center gap-1'>
                        <Clock className='size-3.5 shrink-0' aria-hidden />
                        {formatTimeForDisplay(slot.startTime)} –{" "}
                        {formatTimeForDisplay(slot.endTime)}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatBookedAt(slot.bookedAt)}
                    </TableCell>
                    <TableCell>{formatAmount(slot.amount)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          slot.paymentStatus === "paid" &&
                            "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
                          slot.paymentStatus === "pending" &&
                            "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
                          slot.paymentStatus === "partial" &&
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                        )}
                      >
                        {t(getPaymentStatusKey(slot.paymentStatus))}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <NewBookingSheet
        open={bookingSheetOpen}
        onOpenChange={setBookingSheetOpen}
        defaultRoomId={addCellPreFill?.roomId ?? null}
        defaultStartTime={addCellPreFill?.startTime ?? null}
        defaultDate={selectedDate}
        onSave={handleSaveBooking}
      />

      <Dialog
        open={qrPaymentBooking != null}
        onOpenChange={(open) => !open && setQrPaymentBooking(null)}
      >
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t("qrPaymentTitle")}</DialogTitle>
          </DialogHeader>
          {qrPaymentBooking != null && (
            <div className='flex flex-col items-center gap-4 py-2'>
              <p className='text-muted-foreground text-sm'>
                {t("qrPaymentAmount")}:{" "}
                <span className='text-foreground font-semibold'>
                  {formatAmount(qrPaymentBooking.amount)}
                </span>
              </p>
              <div
                className='border-muted-foreground/30 bg-muted/30 text-muted-foreground flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed text-xs'
                aria-hidden
              >
                {t("qrPlaceholder")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

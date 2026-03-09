/** Overview stats for the top cards. */
export interface HotelOverviewStats {
  newBookings: number;
  newBookingsTrend: number;
  checkIn: number;
  checkInTrend: number;
  checkOut: number;
  checkOutTrend: number;
  totalRevenue: number;
  totalRevenueTrend: number;
}

/** Room availability breakdown. */
export interface RoomAvailability {
  occupied: number;
  reserved: number;
  available: number;
  notReady: number;
}

/** Monthly revenue data point. */
export interface RevenueDataPoint {
  month: string;
  value: number;
}

/** Reservations by day (booked vs canceled). */
export interface ReservationsByDay {
  date: string;
  booked: number;
  canceled: number;
}

/** Booking share by platform. */
export interface BookingByPlatform {
  name: string;
  value: number;
  percent: number;
}

export type BookingStatus =
  | "pending"
  | "checked-in"
  | "checked-out"
  | "canceled";
export type RoomTypeLabel = "Deluxe" | "Standard" | "Suite";

/** Single row in the booking list table. */
export interface HotelBooking {
  id: string;
  guestName: string;
  /** Branch/location name (e.g. 京都, 玉田). */
  branch?: string;
  roomType: RoomTypeLabel;
  roomNumber: string;
  durationNights: number;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
}

/** Room for the booking grid (room column). */
export interface BookingGridRoom {
  id: string;
  name: string;
}

/** Payment status for a booking slot. */
export type SlotPaymentStatus = "pending" | "paid" | "partial";

/** Single booking slot in the grid (time range in one room). */
export interface RoomBookingSlot {
  id: string;
  guestName: string;
  roomId: string;
  /** Time "HH:mm" (24h) start. */
  startTime: string;
  /** Time "HH:mm" (24h) end. */
  endTime: string;
  /** Whether guest has checked in (used for yellow vs green when ongoing). */
  checkedIn?: boolean;
  /** Guest phone number. */
  phone?: string;
  /** When the booking was made (e.g. "YYYY-MM-DD HH:mm" or ISO). */
  bookedAt?: string;
  /** Amount to pay (e.g. in JPY or project currency). */
  amount?: number;
  /** Payment status. */
  paymentStatus?: SlotPaymentStatus;
  /** Date "YYYY-MM-DD" for the booking day (used for added slots to filter by selected date). */
  date?: string;
}

/**
 * Display variant for booking card (computed from current time + slot).
 * - green: ongoing (guest present, not ended)
 * - red: ended
 * - blue: future booking
 * - yellow: time reached but guest not arrived (no-show)
 */
export type BookingCardVariant = "green" | "red" | "blue" | "yellow";

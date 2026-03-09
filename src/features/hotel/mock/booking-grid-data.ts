import type { BookingGridRoom, RoomBookingSlot } from "../types";

export const MOCK_BOOKING_GRID_ROOMS: BookingGridRoom[] = [
  { id: "room-1", name: "Room 1" },
  { id: "room-2", name: "Room 2" },
  { id: "room-3", name: "Room 3" },
  { id: "room-4", name: "Room 4" },
  { id: "room-5", name: "Room 5" },
  { id: "room-6", name: "Room 6" },
];

/** Hour slots from 7:00 to 22:00 (16 slots). */
export const BOOKING_GRID_HOURS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

/** Format a Date as "YYYY-MM-DD HH:mm" for bookedAt. */
function toBookedAtString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

/** Get a date relative to today at given time (hour, minute). */
function relativeDate(
  today: Date,
  daysOffset: number,
  hour: number,
  minute: number
): Date {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * Mock bookings for the grid, derived from "today" so the demo looks correct
 * whenever a customer opens the page (bookedAt and display are relative to current date).
 */
export function getMockRoomBookingSlotsForDate(today: Date): RoomBookingSlot[] {
  return [
    {
      id: "ID1928309",
      guestName: "Renata",
      roomId: "room-1",
      startTime: "07:00",
      endTime: "08:00",
      checkedIn: true,
      phone: "+81 90-1234-5678",
      bookedAt: toBookedAtString(relativeDate(today, -1, 18, 30)),
      amount: 5500,
      paymentStatus: "paid",
    },
    {
      id: "ID1928310",
      guestName: "Marcel",
      roomId: "room-2",
      startTime: "07:00",
      endTime: "09:00",
      checkedIn: true,
      phone: "+81 80-9876-5432",
      bookedAt: toBookedAtString(relativeDate(today, 0, 6, 15)),
      amount: 8000,
      paymentStatus: "pending",
    },
    {
      id: "ID1928311",
      guestName: "Damar",
      roomId: "room-3",
      startTime: "07:00",
      endTime: "10:00",
      checkedIn: false,
      phone: "+81 70-1111-2222",
      bookedAt: toBookedAtString(relativeDate(today, -1, 20, 0)),
      amount: 12000,
      paymentStatus: "partial",
    },
    {
      id: "ID1928312",
      guestName: "田中 花子",
      roomId: "room-1",
      startTime: "09:00",
      endTime: "10:00",
      phone: "+81 90-3333-4444",
      bookedAt: toBookedAtString(relativeDate(today, -2, 14, 0)),
      amount: 4500,
      paymentStatus: "paid",
    },
    {
      id: "ID1928313",
      guestName: "佐藤 一郎",
      roomId: "room-2",
      startTime: "09:00",
      endTime: "11:00",
      phone: "+81 80-5555-6666",
      bookedAt: toBookedAtString(relativeDate(today, -1, 9, 0)),
      amount: 9000,
      paymentStatus: "pending",
    },
    {
      id: "ID1928314",
      guestName: "鈴木 美咲",
      roomId: "room-1",
      startTime: "10:00",
      endTime: "12:00",
      phone: "+81 70-7777-8888",
      bookedAt: toBookedAtString(relativeDate(today, -3, 16, 30)),
      amount: 10000,
      paymentStatus: "pending",
    },
    {
      id: "ID1928315",
      guestName: "高橋 健太",
      roomId: "room-2",
      startTime: "11:00",
      endTime: "12:00",
      phone: "+81 90-9999-0000",
      bookedAt: toBookedAtString(relativeDate(today, 0, 8, 0)),
      amount: 4500,
      paymentStatus: "paid",
    },
    {
      id: "ID1928316",
      guestName: "伊藤 直樹",
      roomId: "room-4",
      startTime: "08:00",
      endTime: "10:00",
      checkedIn: false,
      phone: "+81 80-1212-3434",
      bookedAt: toBookedAtString(relativeDate(today, -1, 12, 0)),
      amount: 7500,
      paymentStatus: "pending",
    },
    {
      id: "ID1928317",
      guestName: "渡辺 さくら",
      roomId: "room-5",
      startTime: "09:00",
      endTime: "11:00",
      phone: "+81 70-5656-7878",
      bookedAt: toBookedAtString(relativeDate(today, -2, 11, 0)),
      amount: 8500,
      paymentStatus: "paid",
    },
    // Booked mainly in the future (blue when current time < start)
    {
      id: "ID1928318",
      guestName: "山本 翔太",
      roomId: "room-3",
      startTime: "13:00",
      endTime: "15:00",
      phone: "+81 90-2222-3333",
      bookedAt: toBookedAtString(relativeDate(today, -1, 10, 0)),
      amount: 9000,
      paymentStatus: "pending",
    },
    {
      id: "ID1928319",
      guestName: "中村 あおい",
      roomId: "room-5",
      startTime: "17:00",
      endTime: "19:00",
      phone: "+81 80-4444-5555",
      bookedAt: toBookedAtString(relativeDate(today, 0, 9, 0)),
      amount: 11000,
      paymentStatus: "pending",
    },
    {
      id: "ID1928320",
      guestName: "小林 蓮",
      roomId: "room-6",
      startTime: "14:00",
      endTime: "16:00",
      phone: "+81 70-6666-7777",
      bookedAt: toBookedAtString(relativeDate(today, -2, 15, 30)),
      amount: 10000,
      paymentStatus: "paid",
    },
    {
      id: "ID1928321",
      guestName: "加藤 桜",
      roomId: "room-6",
      startTime: "18:00",
      endTime: "20:00",
      phone: "+81 90-8888-9999",
      bookedAt: toBookedAtString(relativeDate(today, -1, 14, 0)),
      amount: 12000,
      paymentStatus: "pending",
    },
    // Booked but guest has not arrived yet (yellow when ongoing, checkedIn: false)
    {
      id: "ID1928322",
      guestName: "吉田 大輝",
      roomId: "room-6",
      startTime: "10:00",
      endTime: "11:00",
      checkedIn: false,
      phone: "+81 80-1010-2020",
      bookedAt: toBookedAtString(relativeDate(today, -1, 16, 0)),
      amount: 4500,
      paymentStatus: "pending",
    },
    {
      id: "ID1928323",
      guestName: "松本 ゆい",
      roomId: "room-4",
      startTime: "15:00",
      endTime: "17:00",
      checkedIn: false,
      phone: "+81 70-3030-4040",
      bookedAt: toBookedAtString(relativeDate(today, 0, 8, 30)),
      amount: 8500,
      paymentStatus: "pending",
    },
    {
      id: "ID1928324",
      guestName: "井上 健",
      roomId: "room-3",
      startTime: "16:00",
      endTime: "18:00",
      checkedIn: false,
      phone: "+81 90-5050-6060",
      bookedAt: toBookedAtString(relativeDate(today, -1, 11, 0)),
      amount: 9500,
      paymentStatus: "partial",
    },
  ];
}

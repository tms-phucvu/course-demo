import type {
  BookingByPlatform,
  HotelBooking,
  HotelOverviewStats,
  RevenueDataPoint,
  ReservationsByDay,
  RoomAvailability,
} from "../types";

export const MOCK_OVERVIEW_STATS: HotelOverviewStats = {
  newBookings: 840,
  newBookingsTrend: 8.7,
  checkIn: 231,
  checkInTrend: 3.56,
  checkOut: 124,
  checkOutTrend: -1.06,
  totalRevenue: 123980,
  totalRevenueTrend: 5.7,
};

export const MOCK_ROOM_AVAILABILITY: RoomAvailability = {
  occupied: 286,
  reserved: 87,
  available: 32,
  notReady: 13,
};

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: "2027年12月", value: 185000 },
  { month: "2028年1月", value: 242000 },
  { month: "2028年2月", value: 315060 },
  { month: "2028年3月", value: 278000 },
  { month: "2028年4月", value: 320000 },
  { month: "2028年5月", value: 295000 },
];

export const MOCK_RESERVATIONS_BY_DAY: ReservationsByDay[] = [
  { date: "6月12日", booked: 72, canceled: 8 },
  { date: "6月13日", booked: 85, canceled: 12 },
  { date: "6月14日", booked: 78, canceled: 5 },
  { date: "6月15日", booked: 92, canceled: 15 },
  { date: "6月16日", booked: 88, canceled: 10 },
  { date: "6月17日", booked: 95, canceled: 7 },
  { date: "6月18日", booked: 82, canceled: 11 },
];

export const MOCK_BOOKING_BY_PLATFORM: BookingByPlatform[] = [
  { name: "直接予約", value: 61, percent: 61 },
  { name: "Booking.com", value: 12, percent: 12 },
  { name: "Agoda", value: 11, percent: 11 },
  { name: "Airbnb", value: 9, percent: 9 },
  { name: "Hotels.com", value: 5, percent: 5 },
  { name: "その他", value: 2, percent: 2 },
];

export const MOCK_BOOKING_LIST: HotelBooking[] = [
  {
    id: "LG-B00108",
    guestName: "田中 太郎",
    branch: "京都",
    roomType: "Deluxe",
    roomNumber: "101",
    durationNights: 3,
    checkIn: "2028-06-19",
    checkOut: "2028-06-22",
    status: "checked-in",
  },
  {
    id: "LG-B00109",
    guestName: "佐藤 花子",
    branch: "玉田",
    roomType: "Standard",
    roomNumber: "202",
    durationNights: 2,
    checkIn: "2028-06-19",
    checkOut: "2028-06-21",
    status: "checked-in",
  },
  {
    id: "LG-B00110",
    guestName: "鈴木 一郎",
    branch: "東京",
    roomType: "Suite",
    roomNumber: "303",
    durationNights: 5,
    checkIn: "2028-06-19",
    checkOut: "2028-06-24",
    status: "pending",
  },
  {
    id: "LG-B00111",
    guestName: "高橋 美咲",
    branch: "大阪",
    roomType: "Standard",
    roomNumber: "105",
    durationNights: 4,
    checkIn: "2028-06-19",
    checkOut: "2028-06-23",
    status: "checked-in",
  },
  {
    id: "LG-B00112",
    guestName: "伊藤 健太",
    branch: "横浜",
    roomType: "Deluxe",
    roomNumber: "205",
    durationNights: 2,
    checkIn: "2028-06-20",
    checkOut: "2028-06-22",
    status: "pending",
  },
  {
    id: "LG-B00113",
    guestName: "渡辺 直樹",
    branch: "福岡",
    roomType: "Suite",
    roomNumber: "401",
    durationNights: 1,
    checkIn: "2028-06-18",
    checkOut: "2028-06-19",
    status: "checked-out",
  },
];

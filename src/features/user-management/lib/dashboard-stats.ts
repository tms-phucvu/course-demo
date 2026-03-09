import type { ManagementUser } from "../types";
import {
  PREFECTURE_EN_TO_JA,
  PREFECTURE_JA_TO_EN,
  PREFECTURES_JA,
} from "../constants/prefecture-map";

/** Mock monthly revenue per plan (for dashboard total revenue) */
const REVENUE_BY_PLAN: Record<ManagementUser["plan"], number> = {
  free: 0,
  silver: 10,
  gold: 30,
  diamond: 100,
};

export interface DashboardStats {
  total: number;
  silver: number;
  gold: number;
  diamond: number;
  totalRevenue: number;
  requestPlanCount: number;
  inactiveCount: number;
}

export interface MonthCount {
  month: string;
  monthShort: string;
  yearMonth: string;
  count: number;
}

/**
 * Compute dashboard stats from users list.
 */
export function getDashboardStats(users: ManagementUser[]): DashboardStats {
  let silver = 0;
  let gold = 0;
  let diamond = 0;
  let totalRevenue = 0;
  let requestPlanCount = 0;
  let inactiveCount = 0;

  for (const u of users) {
    if (u.plan === "silver") silver += 1;
    else if (u.plan === "gold") gold += 1;
    else if (u.plan === "diamond") diamond += 1;
    totalRevenue += REVENUE_BY_PLAN[u.plan];
    if (u.status === "requestPlan") requestPlanCount += 1;
    if (u.status === "inactive") inactiveCount += 1;
  }

  return {
    total: users.length,
    silver,
    gold,
    diamond,
    totalRevenue,
    requestPlanCount,
    inactiveCount,
  };
}

/**
 * Group users by month (from updatedAt).
 * If range is provided, only includes months within [start, end] and counts users in that range.
 * Otherwise uses the last 12 months from now.
 * Returns array of { month, monthShort, yearMonth, count } sorted by yearMonth.
 */
export function getUsersByMonth(
  users: ManagementUser[],
  range?: { start: Date; end: Date }
): MonthCount[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (range) {
    const monthCounts = new Map<string, number>();
    const startYear = range.start.getFullYear();
    const startMonth = range.start.getMonth();
    const endYear = range.end.getFullYear();
    const endMonth = range.end.getMonth();

    let y = startYear;
    let m = startMonth;
    while (y < endYear || (y === endYear && m <= endMonth)) {
      const yearMonth = `${y}-${String(m + 1).padStart(2, "0")}`;
      monthCounts.set(yearMonth, 0);
      m += 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
    }

    for (const u of users) {
      const d = new Date(u.updatedAt);
      if (d < range.start || d > range.end) continue;
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthCounts.has(yearMonth)) {
        monthCounts.set(yearMonth, (monthCounts.get(yearMonth) ?? 0) + 1);
      }
    }

    return Array.from(monthCounts.entries())
      .map(([yearMonth, count]) => {
        const [yr, mo] = yearMonth.split("-").map(Number);
        const monthShort = `${monthNames[mo - 1]} ${yr}`;
        const month = monthShort;
        return { month, monthShort, yearMonth, count };
      })
      .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  }

  const now = new Date();
  const monthCounts = new Map<string, number>();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(yearMonth, 0);
  }

  for (const u of users) {
    const d = new Date(u.updatedAt);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthCounts.has(yearMonth)) {
      monthCounts.set(yearMonth, (monthCounts.get(yearMonth) ?? 0) + 1);
    }
  }

  return Array.from(monthCounts.entries())
    .map(([yearMonth, count]) => {
      const [y, m] = yearMonth.split("-").map(Number);
      const monthShort = `${monthNames[m - 1]} ${y}`;
      const month = `${monthNames[m - 1]} ${y}`;
      return { month, monthShort, yearMonth, count };
    })
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

export interface PrefectureCount {
  name: string;
  value: number;
}

/**
 * Count users by prefecture (address). Returns array for ECharts map:
 * one entry per Japanese prefecture with { name: jaName, value: count }.
 */
export function getUsersByPrefecture(
  users: ManagementUser[]
): PrefectureCount[] {
  const countByEn = new Map<string, number>();
  for (const en of Object.keys(PREFECTURE_EN_TO_JA)) {
    countByEn.set(en, 0);
  }
  for (const u of users) {
    if (countByEn.has(u.address)) {
      countByEn.set(u.address, (countByEn.get(u.address) ?? 0) + 1);
    }
  }
  return PREFECTURES_JA.map((ja) => {
    const en = PREFECTURE_JA_TO_EN[ja] ?? "";
    return { name: ja, value: countByEn.get(en) ?? 0 };
  });
}

/**
 * Count users by prefecture (English name). Returns a map for @react-map/japan cityColors.
 */
export function getUsersByPrefectureCountMap(
  users: ManagementUser[]
): Record<string, number> {
  const countByEn: Record<string, number> = {};
  for (const en of Object.keys(PREFECTURE_EN_TO_JA)) {
    countByEn[en] = 0;
  }
  for (const u of users) {
    if (countByEn[u.address] !== undefined) {
      countByEn[u.address] += 1;
    }
  }
  return countByEn;
}

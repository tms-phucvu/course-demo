import type { ManagementUser } from "../types";
import { PREFECTURES } from "../constants/prefectures";

const PLANS: ManagementUser["plan"][] = ["free", "silver", "gold", "diamond"];
const STATUSES: ManagementUser["status"][] = [
  "active",
  "requestPlan",
  "inactive",
];

const NAMES = [
  "Stern Thireau",
  "Ford McKibbin",
  "Gun Kaasmann",
  "Lira Nakamura",
  "Yuki Tanaka",
  "Hiroshi Sato",
  "Emi Watanabe",
  "Kenji Yamamoto",
  "Sakura Kobayashi",
  "Takeshi Inoue",
  "Mika Fujimoto",
  "Ryu Suzuki",
  "Aya Takahashi",
  "Kenta Tanaka",
  "Naomi Yoshida",
  "Daiki Matsumoto",
  "Yui Sasaki",
  "Shota Yamaguchi",
  "Rina Tanaka",
  "Kazuki Ito",
  "Hana Suzuki",
  "Yuto Nakamura",
];

/** Alternate between male and female avatar by index */
const AVATAR_URLS = [
  "/image/avatar_men.png",
  "/image/avatar_girl.png",
] as const;

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? arr[0];
}

/** Random date within the last 12 months (for dashboard chart spread) */
function randomDateLast12Months(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * 12));
  d.setDate(1 + Math.floor(Math.random() * 28));
  return d.toISOString();
}

/** Generate a simple mock phone (e.g. 090-1234-5678) */
function mockPhone(seed: number): string {
  const a = String(90 + (seed % 10)).padStart(2, "0");
  const b = String(1000 + ((seed * 7) % 9000));
  const c = String(1000 + ((seed * 13) % 9000));
  return `${a}-${b}-${c}`;
}

export function getMockManagementUsers(): ManagementUser[] {
  return NAMES.map((name, i) => {
    return {
      id: `user-${i + 1}`,
      name,
      avatarUrl: AVATAR_URLS[i % AVATAR_URLS.length],
      phone: mockPhone(i),
      plan: randomItem(PLANS),
      address: PREFECTURES[i % PREFECTURES.length],
      status: randomItem(STATUSES),
      updatedAt: randomDateLast12Months(),
    };
  });
}

import { Role } from "@/features/auth/types";
import type { ManagementUser } from "../types";

export const ROLES: ManagementUser["role"][] = [Role.ADMIN, Role.STUDENT];
export const STATUSES: ManagementUser["status"][] = ["active", "inactive"];

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

/** Generate a simple mock email */
function mockEmail(seed: number): string {
  const name = NAMES[seed % NAMES.length];

  // get first name
  const firstName = name.split(" ")[0].toLowerCase();

  const domains = ["gmail.com", "yahoo.com", "outlook.com"];
  const domain = domains[seed % domains.length];

  return `${firstName}${seed + 1}@${domain}`;
}

export function getMockManagementUsers(): ManagementUser[] {
  return NAMES.map((name, i) => {
    return {
      id: `user-${i + 1}`,
      name,
      avatarUrl: AVATAR_URLS[i % AVATAR_URLS.length],
      email: mockEmail(i),
      role: randomItem(ROLES),
      status: randomItem(STATUSES),
      createdAt: randomDateLast12Months(),
    };
  });
}

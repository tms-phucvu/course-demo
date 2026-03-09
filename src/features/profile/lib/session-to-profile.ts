import { PROFILE_DEFAULT_COMPANY, type Profile } from "../types";

const DEFAULT_AVATAR = "/image/avatar_men.png";

/** Pre-filled profile for demo account hieu.nguyen2@tomosia.com */
const DEMO_PROFILE_OVERRIDES: Partial<Profile> = {
  name: "Nguyễn Trung Hiếu",
  nameKanji: "阮忠孝",
  nameKana: "グエン・チュン・ヒエウ",
  email: "hieu.nguyen2@tomosia.com",
  role: "admin",
  plan: "Pro",
  verified: true,
  company: PROFILE_DEFAULT_COMPANY,
  department: "Engineering",
  position: "Software Engineer",
  phone: "+84 24 1234 5678",
  country: "Vietnam",
  postalCode: "100000",
  address: "Số 1, Tòa nhà Âu Việt, 1 Lê Đức Thọ, Mai Dịch, Cầu Giấy, Hà Nội",
  birthDate: "1990-01-15",
  gender: "Male",
  website: "https://tomosia.com",
  createdAt: "2024-01-01T00:00:00.000Z",
};

export type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} & Record<string, unknown>;

export function getProfileFromSessionUser(user: SessionUser): Profile {
  const base: Profile = {
    id: user.id ?? "",
    name: (user.name as string | null) ?? null,
    nameKanji: (user.nameKanji as string | null) ?? null,
    nameKana: (user.nameKana as string | null) ?? null,
    email: (user.email as string | null) ?? null,
    image: (user.image as string | null) ?? DEFAULT_AVATAR,
    role: (user.role as string | null) ?? "admin",
    plan: (user.plan as string | null) ?? "Free",
    verified: (user.verified as boolean | undefined) ?? true,
    phone: (user.phone as string | null) ?? null,
    country: (user.country as string | null) ?? null,
    website: (user.website as string | null) ?? null,
    createdAt: (user.createdAt as string | null) ?? null,
    company: (user.company as string | null) ?? PROFILE_DEFAULT_COMPANY,
    department: (user.department as string | null) ?? null,
    position: (user.position as string | null) ?? null,
    postalCode: (user.postalCode as string | null) ?? null,
    address: (user.address as string | null) ?? null,
    birthDate: (user.birthDate as string | null) ?? null,
    gender: (user.gender as string | null) ?? null,
  };

  if (base.email === "hieu.nguyen2@tomosia.com") {
    return {
      ...base,
      ...DEMO_PROFILE_OVERRIDES,
      id: base.id,
      image: base.image,
    };
  }

  return base;
}

export type ActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  data?: Record<string, unknown>;
};

/** Default company when not set (Tomosia Vietnam) */
export const PROFILE_DEFAULT_COMPANY = "Tomosia Vietnam";

export type Profile = {
  id: string;
  name: string | null;
  /** Display name in Kanji (漢字) - common in Japanese profiles */
  nameKanji?: string | null;
  /** Display name in Kana (かな/カナ) - common in Japanese profiles */
  nameKana?: string | null;
  email: string | null;
  image: string | null;
  role?: string | null;
  plan?: string | null;
  verified?: boolean;
  phone?: string | null;
  country?: string | null;
  website?: string | null;
  createdAt?: string | null;
  /** Company (e.g. Tomosia Vietnam) */
  company?: string | null;
  /** Department (部署) */
  department?: string | null;
  /** Position / job title (役職) */
  position?: string | null;
  /** Postal code (郵便番号) */
  postalCode?: string | null;
  /** Address (住所) */
  address?: string | null;
  /** Birth date (生年月日) */
  birthDate?: string | null;
  /** Gender (性別) */
  gender?: string | null;
};

export type UpdateProfileInput = {
  name?: string | null;
  nameKanji?: string | null;
  nameKana?: string | null;
  phone?: string | null;
  country?: string | null;
  website?: string | null;
  role?: string | null;
  company?: string | null;
  department?: string | null;
  position?: string | null;
  postalCode?: string | null;
  address?: string | null;
  birthDate?: string | null;
  gender?: string | null;
};

export type SettingsTabId =
  | "edit"
  | "avatar"
  | "password"
  | "security"
  | "role";

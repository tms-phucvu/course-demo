import { z } from "zod";

// --- Helpers ---

/** Optional string: empty or max length. Trimmed so whitespace-only becomes empty. */
function optionalString(max: number) {
  return z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(z.string().max(max).optional().or(z.literal("")));
}

/** Phone: optional; if filled, only + digits spaces - ( ) and at least one digit. */
const phoneSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(25, "Phone is too long")
      .regex(/^\+?[\d\s\-()]*$/, "Only numbers, spaces, + - ( ) allowed")
      .refine(
        (v) => !v || /\d/.test(v),
        "Phone must contain at least one digit"
      )
      .optional()
      .or(z.literal(""))
  );

/** Website: optional; if filled, must be valid http(s) URL. */
const websiteSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(500)
      .refine(
        (v) => !v || /^https?:\/\/[^\s]+$/.test(v),
        "Enter a valid URL (e.g. https://example.com)"
      )
      .optional()
      .or(z.literal(""))
  );

/** Postal code: optional; if filled, only digits, spaces, hyphens (JP, US, VN, etc.). */
const postalCodeSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(20)
      .regex(/^[\d\s\-]*$/, "Only numbers, spaces and hyphens allowed")
      .optional()
      .or(z.literal(""))
  );

/** Birth date: optional; if filled, YYYY-MM-DD and valid calendar date, not in future. */
function isValidDate(y: number, m: number, d: number): boolean {
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** Birth date: optional; if filled, YYYY-MM-DD, valid calendar date, not in future. */
const birthDateSchema = z
  .string()
  .transform((s) => (s ?? "").trim())
  .pipe(
    z
      .string()
      .max(10)
      .refine((v) => {
        if (!v || v === "") return true;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
        const [y, m, d] = v.split("-").map(Number);
        if (!isValidDate(y, m, d)) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const entered = new Date(y, m - 1, d);
        return entered <= today;
      }, "Use YYYY-MM-DD and a valid past or today date")
  )
  .optional()
  .or(z.literal(""));

export const profileSchema = z.object({
  name: z
    .string()
    .transform((s) => (s ?? "").trim())
    .pipe(z.string().min(1, "Name is required").max(100, "Name is too long")),
  nameKanji: optionalString(100),
  nameKana: optionalString(100),
  phone: phoneSchema,
  country: optionalString(100),
  website: websiteSchema,
  role: optionalString(50),
  company: optionalString(150),
  department: optionalString(100),
  position: optionalString(100),
  postalCode: postalCodeSchema,
  address: optionalString(300),
  birthDate: birthDateSchema,
  gender: optionalString(50),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

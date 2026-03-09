import { z } from "zod";
import { PREFECTURES } from "../constants/prefectures";

const PLAN_VALUES = ["free", "silver", "gold", "diamond"] as const;
const ADDRESS_VALUES = [...PREFECTURES] as [string, ...string[]];

export const addUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^[0-9]{2,4}-[0-9]{2,4}-[0-9]{4}$/,
      "Invalid phone format (e.g. 090-1234-5678)"
    ),
  plan: z.enum(PLAN_VALUES, { required_error: "Plan is required" }),
  address: z.enum(ADDRESS_VALUES, { required_error: "Address is required" }),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;

import { Role } from "@/features/auth/types";
import { z } from "zod";

const ROLE_VALUES = [Role.ADMIN, Role.STUDENT] as const;

export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.enum(ROLE_VALUES, { required_error: "Role is required" }),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

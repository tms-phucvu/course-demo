import { Role } from "@/features/auth/types";
import { z } from "zod";

const ROLE_VALUES = [Role.ADMIN, Role.STUDENT] as const;

export const addUserSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    role: z.enum(ROLE_VALUES, { required_error: "Role is required" }),
    avatarUrl: z.string().optional().or(z.literal("")),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddUserFormData = z.infer<typeof addUserSchema>;

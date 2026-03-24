import { Role } from "@/features/auth/types";
import { UserStatus, type User } from "../types/user.types";

export const ROLES: User["role"][] = [Role.ADMIN, Role.STUDENT];
export const STATUSES: User["status"][] = [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
];

export const AVATAR_VALIDATION = {
  maxSizeInMb: 2,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 1,
};

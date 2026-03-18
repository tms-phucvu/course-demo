import { Role } from "@/features/auth/types";

/** User status in the management list */
export type UserStatus = "active" | "inactive";

export interface ManagementUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string; // ISO date string
}

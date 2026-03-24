import { Role } from "@/features/auth/types";

/** User status in the management list */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface UserFilters {
  name: string;
  page: number;
  limit: number;
}

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export type CreateUserPayload = Omit<User, "id" | "createdAt" | "status"> & {
  password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

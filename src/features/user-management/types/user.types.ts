import { Role } from "@/features/auth/types";

/** User status in the management list */
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  role: Role;
  status?: UserStatus;
  createdAt: string;
}

export interface UserFilters {
  name: string;
  page: number;
  limit: number;
}

export interface UserListResponse {
  item: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

import { Role } from "@/features/auth/types";

export interface ApiAuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export type ApiAuthResponse = {
  accessToken: string;
  user: ApiAuthUser;
};

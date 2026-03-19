import { apiClient } from "@/core/lib";
import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserFilters,
  UserListResponse,
} from "@/features/user-management/types/user.types";

// GET ALL
export async function getAllUser(
  filters?: UserFilters
): Promise<UserListResponse> {
  const params: Record<string, string | number> = {};

  if (filters?.name) {
    params.name = filters.name;
  }
  params.page = filters?.page ?? 1;
  params.limit = filters?.limit ?? 10;

  const response = await apiClient.get<UserListResponse>("/admin/users", {
    params,
  });

  return response.data;
}

// GET BY ID
export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/admin/users/${id}`);
  return response.data;
}

// CREATE
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await apiClient.post<User>("/admin/users", payload);
  return response.data;
}

// UPDATE
export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<User> {
  const response = await apiClient.patch<User>(`/admin/users/${id}`, payload);
  return response.data;
}

// DELETE
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}

// DELETE MANY USERS
export async function deleteManyUsers(ids: string[]) {
  await Promise.all(ids.map((id) => deleteUser(id)));
}

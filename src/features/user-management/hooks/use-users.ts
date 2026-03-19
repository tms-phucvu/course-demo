import { getAllUser } from "@/features/user-management/services/user.service";
import {
  UserFilters,
  UserListResponse,
} from "@/features/user-management/types/user.types";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (filters: UserFilters) => {
  const { page = 1, limit = 10, name } = filters;

  return useQuery<UserListResponse>({
    queryKey: ["users", page, limit, name],
    queryFn: () => getAllUser({ page, limit, name }),
  });
};

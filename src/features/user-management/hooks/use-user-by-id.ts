import { getUserById } from "@/features/user-management/services/user.service";
import { User } from "@/features/user-management/types/user.types";
import { useQuery } from "@tanstack/react-query";

export const useUserById = (id?: string) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
};

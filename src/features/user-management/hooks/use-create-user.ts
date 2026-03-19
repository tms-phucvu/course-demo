import { createUser } from "@/features/user-management/services/user.service";
import {
  CreateUserPayload,
  User,
} from "@/features/user-management/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

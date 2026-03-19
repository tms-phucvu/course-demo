import { updateUser } from "@/features/user-management/services/user.service";
import {
  UpdateUserPayload,
  User,
} from "@/features/user-management/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UpdateUserPayload }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      // invalidate list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // update detail cache
      queryClient.invalidateQueries({
        queryKey: ["user", variables.id],
      });
    },
  });
};

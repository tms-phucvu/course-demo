import { updateUserStatus } from "@/features/user-management/services/user.service";
import { User, UserStatus } from "@/features/user-management/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: { status: UserStatus } }>(
    {
      mutationFn: ({ id, data }) => updateUserStatus(id, data),
      onSuccess: (_, variables) => {
        // invalidate list
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // update detail cache
        queryClient.invalidateQueries({
          queryKey: ["user", variables.id],
        });
      },
    }
  );
};

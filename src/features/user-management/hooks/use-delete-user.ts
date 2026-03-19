import { deleteUser } from "@/features/user-management/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      queryClient.removeQueries({
        queryKey: ["user", id],
      });
    },
  });
};

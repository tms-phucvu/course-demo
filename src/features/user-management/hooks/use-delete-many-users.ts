import { deleteManyUsers } from "@/features/user-management/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteManyUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[]>({
    mutationFn: deleteManyUsers,
    onSuccess: (_, ids) => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // remove cache for user detail
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: ["user", id] });
      });
    },
  });
};
